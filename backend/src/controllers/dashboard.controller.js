const db = require('../config/db');

exports.getStats = async (req, res) => {
  try {
    const totalGuests = await db('guests').count('id as count').first();
    const totalBookings = await db('bookings').count('id as count').first();
    const availableRooms = await db('rooms').where('status', 'Available').count('id as count').first();
    const occupiedRooms = await db('rooms').where('status', 'Occupied').count('id as count').first();
    
    const today = new Date().toISOString().split('T')[0];
    const revenueToday = await db('bookings')
      .where('check_in', '<=', today)
      .andWhere('check_out', '>=', today)
      .andWhereNot('status', 'Cancelled')
      .sum('total_price as total')
      .first();

    res.json({
      success: true,
      data: {
        totalGuests: totalGuests.count,
        totalBookings: totalBookings.count,
        availableRooms: availableRooms.count,
        occupiedRooms: occupiedRooms.count,
        revenueToday: revenueToday.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRevenueChart = async (req, res) => {
  try {
    const isSqlite = db.client.config.client === 'sqlite3';
    
    let query;
    if (isSqlite) {
      query = db('bookings')
        .select(db.raw("strftime('%Y-%m', check_in) as month"))
        .sum('total_price as total')
        .whereRaw("strftime('%Y', check_in) = strftime('%Y', 'now')")
        .groupBy('month')
        .orderBy('month');
    } else {
      query = db('bookings')
        .select(db.raw("DATE_FORMAT(check_in, '%Y-%m') as month"))
        .sum('total_price as total')
        .whereRaw("YEAR(check_in) = YEAR(CURDATE())")
        .groupBy('month')
        .orderBy('month');
    }

    const revenue = await query;
    res.json({ success: true, data: revenue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOccupancyRate = async (req, res) => {
  try {
    const totalRooms = await db('rooms').count('id as count').first();
    const occupiedRooms = await db('rooms').where('status', 'Occupied').count('id as count').first();
    const occupancyRate = (occupiedRooms.count / totalRooms.count) * 100;

    res.json({ success: true, occupancyRate: occupancyRate.toFixed(2) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPublicStats = async (req, res) => {
  try {
    const totalGuests = await db('guests').count('id as count').first();
    const totalBookings = await db('bookings').whereNot('status', 'Cancelled').count('id as count').first();
    const totalRooms = await db('rooms').count('id as count').first();
    const availableRooms = await db('rooms').where('status', 'Available').count('id as count').first();
    const occupiedRooms = await db('rooms').where('status', 'Occupied').count('id as count').first();
    const reservedRooms = await db('rooms').where('status', 'Reserved').count('id as count').first();
    const cleaningRooms = await db('rooms').where('status', 'Cleaning').count('id as count').first();
    const maintenanceRooms = await db('rooms').where('status', 'Maintenance').count('id as count').first();
    
    res.json({
      success: true,
      data: {
        totalGuests: totalGuests.count,
        totalBookings: totalBookings.count,
        totalRooms: totalRooms.count,
        availableRooms: availableRooms.count,
        occupiedRooms: occupiedRooms.count,
        reservedRooms: reservedRooms.count,
        cleaningRooms: cleaningRooms.count,
        maintenanceRooms: maintenanceRooms.count
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.globalSearch = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json({
        success: true,
        data: { guests: [], staff: [], rooms: [], bookings: [], reservations: [], payments: [], inventory: [] }
      });
    }

    const query = `%${q}%`;

    // 1. Guests
    const guests = await db('guests')
      .where('full_name', 'like', query)
      .orWhere('email', 'like', query)
      .orWhere('phone', 'like', query)
      .orWhere('nationality', 'like', query)
      .select('*');

    // 2. Staff (joined with user for name/email)
    const staff = await db('staff')
      .join('users', 'staff.user_id', 'users.id')
      .where('users.name', 'like', query)
      .orWhere('users.email', 'like', query)
      .orWhere('staff.position', 'like', query)
      .orWhere('staff.department', 'like', query)
      .select('staff.*', 'users.name', 'users.email');

    // 3. Rooms (joined with room_types for type name)
    const rooms = await db('rooms')
      .join('room_types', 'rooms.type_id', 'room_types.id')
      .where('rooms.room_number', 'like', query)
      .orWhere('room_types.name', 'like', query)
      .orWhere('rooms.status', 'like', query)
      .select('rooms.*', 'room_types.name as type_name', 'room_types.price_per_night');

    // 4. Bookings (all bookings joined with guests & rooms)
    const bookings = await db('bookings')
      .join('guests', 'bookings.guest_id', 'guests.id')
      .join('rooms', 'bookings.room_id', 'rooms.id')
      .where('guests.full_name', 'like', query)
      .orWhere('rooms.room_number', 'like', query)
      .orWhere('bookings.status', 'like', query)
      .select('bookings.*', 'guests.full_name as guest_name', 'rooms.room_number');

    // 5. Reservations (Pending or Confirmed status)
    const reservations = bookings.filter(b => b.status === 'Pending' || b.status === 'Confirmed');

    // 6. Payments (joined with bookings and guests)
    const payments = await db('payments')
      .join('bookings', 'payments.booking_id', 'bookings.id')
      .join('guests', 'bookings.guest_id', 'guests.id')
      .where('guests.full_name', 'like', query)
      .orWhere('payments.status', 'like', query)
      .orWhere('payments.transaction_id', 'like', query)
      .select('payments.*', 'guests.full_name as guest_name');

    // 7. Inventory
    const inventory = await db('inventory')
      .where('item_name', 'like', query)
      .select('*');

    res.json({
      success: true,
      data: {
        guests,
        staff,
        rooms,
        bookings,
        reservations,
        payments,
        inventory
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

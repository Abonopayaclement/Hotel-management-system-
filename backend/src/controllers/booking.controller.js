const db = require('../config/db');

exports.checkAvailability = async (req, res) => {
  try {
    const { room_type_id, check_in, check_out } = req.body;

    // Subquery to find booked rooms in that date range
    const bookedRoomIds = db('bookings')
      .where((builder) => {
        builder.where('check_in', '<', check_out).andWhere('check_out', '>', check_in);
      })
      .andWhereNot('status', 'Cancelled')
      .select('room_id');

    // Find available rooms of that type
    const availableRooms = await db('rooms')
      .where('type_id', room_type_id)
      .whereNotIn('id', bookedRoomIds)
      .andWhere('status', 'Available');

    res.json({ success: true, available: availableRooms.length > 0, rooms: availableRooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createBooking = async (req, res) => {
  const trx = await db.transaction();
  try {
    const { room_id, check_in, check_out, guests_count, total_price, guest_details, payment_method } = req.body;
    const user_id = req.user.id;

    // Prevent duplicate bookings by checking room status and overlapping schedules
    const room = await trx('rooms').where({ id: room_id }).first();
    if (!room) {
      await trx.rollback();
      return res.status(404).json({ success: false, message: 'Room not found.' });
    }

    if (room.status !== 'Available') {
      await trx.rollback();
      return res.status(400).json({ 
        success: false, 
        message: 'This room is currently unavailable because it has already been booked.' 
      });
    }

    const overlapping = await trx('bookings')
      .where('room_id', room_id)
      .whereNotIn('status', ['Cancelled', 'Checked Out'])
      .andWhere(function() {
        this.where('check_in', '<', check_out).andWhere('check_out', '>', check_in);
      })
      .first();

    if (overlapping) {
      await trx.rollback();
      return res.status(400).json({ 
        success: false, 
        message: 'This room is currently unavailable because it has already been booked.' 
      });
    }

    // 1. Ensure guest exists or create one
    let guest = await trx('guests').where({ email: guest_details.email }).first();
    if (!guest) {
      const [guestId] = await trx('guests').insert({
        user_id,
        full_name: guest_details.full_name,
        email: guest_details.email,
        phone: guest_details.phone,
        nationality: guest_details.nationality,
        id_type: guest_details.id_type,
        id_number: guest_details.id_number
      });
      guest = { id: guestId };
    }

    // 2. Create booking. A new booking is a reservation until payment/check-in changes the state.
    const [bookingId] = await trx('bookings').insert({
      guest_id: guest.id,
      room_id,
      check_in,
      check_out,
      guests_count,
      total_price,
      status: 'Pending'
    });

    // 3. Create the linked pending payment so Finance and Guest Portal see the balance immediately.
    await trx('payments').insert({
      booking_id: bookingId,
      amount: total_price,
      method: payment_method || 'Mobile Money',
      status: 'Pending',
      transaction_id: null
    });

    // Create notification
    await trx('notifications').insert({
      user_id: user_id,
      message: `New Reservation: Booking #${bookingId} created for guest ${guest_details.full_name}. Payment pending.`
    });

    // 4. Reserve the room without marking the guest as checked in.
    await trx('rooms').where({ id: room_id }).update({ status: 'Reserved' });

    await trx.commit();
    res.status(201).json({ success: true, message: 'Reservation created successfully', bookingId });
  } catch (error) {
    await trx.rollback();
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await db('bookings')
      .join('guests', 'bookings.guest_id', 'guests.id')
      .join('rooms', 'bookings.room_id', 'rooms.id')
      .leftJoin('room_types', 'rooms.type_id', 'room_types.id')
      .leftJoin('payments', 'payments.booking_id', 'bookings.id')
      .select(
        'bookings.*',
        'guests.full_name as guest_name',
        'guests.email as guest_email',
        'rooms.room_number',
        'room_types.name as room_type',
        'payments.id as payment_id',
        'payments.status as payment_status',
        'payments.method as payment_method'
      )
      .orderBy('bookings.created_at', 'desc');
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await db('bookings')
      .join('guests', 'bookings.guest_id', 'guests.id')
      .where('guests.user_id', req.user.id)
      .join('rooms', 'bookings.room_id', 'rooms.id')
      .leftJoin('room_types', 'rooms.type_id', 'room_types.id')
      .leftJoin('payments', 'payments.booking_id', 'bookings.id')
      .select(
        'bookings.*',
        'rooms.room_number',
        'room_types.name as room_type',
        'payments.id as payment_id',
        'payments.status as payment_status',
        'payments.method as payment_method',
        'payments.transaction_id'
      )
      .orderBy('bookings.created_at', 'desc');
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getBookingById = async (req, res) => {
  try {
    const booking = await db('bookings')
      .join('guests', 'bookings.guest_id', 'guests.id')
      .join('rooms', 'bookings.room_id', 'rooms.id')
      .select('bookings.*', 'guests.full_name as guest_name', 'guests.email as guest_email', 'rooms.room_number')
      .where('bookings.id', req.params.id)
      .first();
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await db('bookings').where('id', req.params.id).update({ status });
    
    // Update room status based on booking status
    const booking = await db('bookings')
      .join('guests', 'bookings.guest_id', 'guests.id')
      .join('rooms', 'bookings.room_id', 'rooms.id')
      .select('bookings.*', 'guests.full_name as guest_name', 'rooms.room_number')
      .where('bookings.id', req.params.id)
      .first();

    if (status === 'Checked In') {
      await db('rooms').where('id', booking.room_id).update({ status: 'Occupied' });
      await db('notifications').insert({
        user_id: req.user ? req.user.id : 1,
        message: `Guest Check-In: ${booking.guest_name} checked into Room ${booking.room_number}.`
      });
    } else if (status === 'Checked Out') {
      await db('rooms').where('id', booking.room_id).update({ status: 'Cleaning' });
      
      // Upsert housekeeping task
      const existing = await db('housekeeping').where({ room_id: booking.room_id }).first();
      if (existing) {
        await db('housekeeping').where({ room_id: booking.room_id }).update({
          status: 'Dirty',
          last_cleaned: null,
          staff_id: null
        });
      } else {
        await db('housekeeping').insert({
          room_id: booking.room_id,
          status: 'Dirty',
          last_cleaned: null,
          staff_id: null
        });
      }

      await db('notifications').insert({
        user_id: req.user ? req.user.id : 1,
        message: `Guest Check-Out: ${booking.guest_name} checked out of Room ${booking.room_number}.`
      });
    } else if (status === 'Cancelled') {
      await db('rooms').where('id', booking.room_id).update({ status: 'Available' });
      await db('notifications').insert({
        user_id: req.user ? req.user.id : 1,
        message: `Booking Cancelled: Booking #${booking.id} for guest ${booking.guest_name} has been cancelled.`
      });
    }

    res.json({ success: true, message: 'Booking status updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getServiceCategoryName = (serviceName) => {
  const name = serviceName.toLowerCase();
  if (name.includes('gym') || name.includes('fitness')) return 'Gym';
  if (name.includes('massage') || name.includes('spa')) return 'Spa / Massage';
  if (name.includes('clinic')) return 'Clinic';
  if (name.includes('conference') || name.includes('hall') || name.includes('event')) return 'Conference Hall';
  if (name.includes('sports')) return 'Sports Complex';
  if (name.includes('indoor') || name.includes('games') || name.includes('game')) return 'Indoor Games';
  if (name.includes('restaurant') || name.includes('dining')) return 'Restaurant';
  return 'Other Services';
};

exports.getDashboardReservations = async (req, res) => {
  try {
    // 1. Fetch Room Reservations (unpaid bookings)
    const roomReservations = await db('bookings')
      .join('guests', 'bookings.guest_id', 'guests.id')
      .join('rooms', 'bookings.room_id', 'rooms.id')
      .leftJoin('room_types', 'rooms.type_id', 'room_types.id')
      .leftJoin('payments', 'payments.booking_id', 'bookings.id')
      .select(
        'bookings.id as booking_id',
        'guests.full_name as guest_name',
        'guests.email as guest_email',
        'rooms.room_number',
        'room_types.name as room_type',
        'bookings.check_in',
        'bookings.check_out',
        'bookings.guests_count',
        'bookings.total_price as amount',
        'bookings.status',
        'payments.status as payment_status',
        'bookings.created_at'
      )
      .where(function() {
        this.where('payments.status', 'Pending')
          .orWhereNull('payments.status')
          .orWhere('bookings.status', 'Pending');
      })
      .andWhereNot('bookings.status', 'Cancelled')
      .orderBy('bookings.created_at', 'desc');

    // 2. Fetch Service Reservations (unpaid service bookings)
    const hasServiceBookings = await db.schema.hasTable('service_bookings');
    let serviceReservations = [];
    if (hasServiceBookings) {
      serviceReservations = await db('service_bookings')
        .join('users', 'service_bookings.user_id', 'users.id')
        .select(
          'service_bookings.id as booking_id',
          'users.name as guest_name',
          'users.email as guest_email',
          'service_bookings.service_name',
          'service_bookings.booking_date',
          'service_bookings.booking_time',
          'service_bookings.price as amount',
          'service_bookings.status',
          'service_bookings.payment_status',
          'service_bookings.created_at'
        )
        .where(function() {
          this.where('service_bookings.payment_status', 'Pending')
            .orWhereNull('service_bookings.payment_status')
            .orWhere('service_bookings.status', 'Pending');
        })
        .andWhereNot('service_bookings.status', 'Cancelled')
        .orderBy('service_bookings.created_at', 'desc');
    }

    // 3. Map and combine
    const unifiedRooms = roomReservations.map(r => ({
      id: `BK${r.booking_id}`,
      dbId: r.booking_id,
      source: 'room',
      guest_name: r.guest_name,
      guest_email: r.guest_email,
      category: 'Rooms',
      item_name: `${r.room_type} (Room ${r.room_number})`,
      created_at: r.created_at,
      date: r.check_in,
      check_in: r.check_in,
      check_out: r.check_out,
      guests_count: r.guests_count,
      status: r.status,
      payment_status: r.payment_status || 'Pending',
      amount: Number(r.amount)
    }));

    const unifiedServices = serviceReservations.map(s => ({
      id: `SRV${s.booking_id}`,
      dbId: s.booking_id,
      source: 'service',
      guest_name: s.guest_name,
      guest_email: s.guest_email,
      category: getServiceCategoryName(s.service_name),
      item_name: s.service_name,
      created_at: s.created_at,
      date: `${s.booking_date} at ${s.booking_time}`,
      booking_date: s.booking_date,
      booking_time: s.booking_time,
      status: s.status,
      payment_status: s.payment_status || 'Pending',
      amount: Number(s.amount)
    }));

    const combined = [...unifiedRooms, ...unifiedServices].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json({ success: true, data: combined });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDashboardBookings = async (req, res) => {
  try {
    // 1. Fetch Room Bookings (paid bookings)
    const roomBookings = await db('bookings')
      .join('guests', 'bookings.guest_id', 'guests.id')
      .join('rooms', 'bookings.room_id', 'rooms.id')
      .leftJoin('room_types', 'rooms.type_id', 'room_types.id')
      .leftJoin('payments', 'payments.booking_id', 'bookings.id')
      .select(
        'bookings.id as booking_id',
        'guests.full_name as guest_name',
        'guests.email as guest_email',
        'rooms.room_number',
        'room_types.name as room_type',
        'bookings.check_in',
        'bookings.check_out',
        'bookings.guests_count',
        'bookings.total_price as amount',
        'bookings.status',
        'payments.status as payment_status',
        'bookings.created_at'
      )
      .where(function() {
        this.where('payments.status', 'Paid')
          .orWhereIn('bookings.status', ['Confirmed', 'Checked In', 'Checked Out']);
      })
      .andWhereNot('bookings.status', 'Cancelled')
      .orderBy('bookings.created_at', 'desc');

    // 2. Fetch Service Bookings (paid/completed service bookings)
    const hasServiceBookings = await db.schema.hasTable('service_bookings');
    let serviceBookings = [];
    if (hasServiceBookings) {
      serviceBookings = await db('service_bookings')
        .join('users', 'service_bookings.user_id', 'users.id')
        .select(
          'service_bookings.id as booking_id',
          'users.name as guest_name',
          'users.email as guest_email',
          'service_bookings.service_name',
          'service_bookings.booking_date',
          'service_bookings.booking_time',
          'service_bookings.price as amount',
          'service_bookings.status',
          'service_bookings.payment_status',
          'service_bookings.created_at'
        )
        .where(function() {
          this.where('service_bookings.payment_status', 'Paid')
            .orWhere('service_bookings.status', 'Completed');
        })
        .andWhereNot('service_bookings.status', 'Cancelled')
        .orderBy('service_bookings.created_at', 'desc');
    }

    // 3. Map and combine
    const unifiedRooms = roomBookings.map(r => ({
      id: `BK${r.booking_id}`,
      dbId: r.booking_id,
      source: 'room',
      guest_name: r.guest_name,
      guest_email: r.guest_email,
      category: 'Rooms',
      item_name: `${r.room_type} (Room ${r.room_number})`,
      created_at: r.created_at,
      date: r.check_in,
      check_in: r.check_in,
      check_out: r.check_out,
      guests_count: r.guests_count,
      status: r.status,
      payment_status: r.payment_status || 'Paid',
      amount: Number(r.amount)
    }));

    const unifiedServices = serviceBookings.map(s => ({
      id: `SRV${s.booking_id}`,
      dbId: s.booking_id,
      source: 'service',
      guest_name: s.guest_name,
      guest_email: s.guest_email,
      category: getServiceCategoryName(s.service_name),
      item_name: s.service_name,
      created_at: s.created_at,
      date: `${s.booking_date} at ${s.booking_time}`,
      booking_date: s.booking_date,
      booking_time: s.booking_time,
      status: s.status,
      payment_status: s.payment_status || 'Paid',
      amount: Number(s.amount)
    }));

    const combined = [...unifiedRooms, ...unifiedServices].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json({ success: true, data: combined });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.cancelMyBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find the booking and make sure it belongs to the logged-in user
    const booking = await db('bookings')
      .join('guests', 'bookings.guest_id', 'guests.id')
      .select('bookings.*', 'payments.status as payment_status')
      .leftJoin('payments', 'payments.booking_id', 'bookings.id')
      .where('bookings.id', id)
      .andWhere('guests.user_id', userId)
      .first();

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check if paid
    if (booking.payment_status === 'Paid' || booking.status === 'Confirmed' || booking.status === 'Checked In' || booking.status === 'Checked Out') {
      return res.status(400).json({ success: false, message: 'Paid or confirmed bookings cannot be cancelled by the guest. Please contact support.' });
    }

    // Update status to Cancelled
    await db('bookings').where('id', id).update({ status: 'Cancelled' });
    
    // Release the room
    await db('rooms').where('id', booking.room_id).update({ status: 'Available' });

    // Update payment status to Failed
    await db('payments').where('booking_id', id).update({ status: 'Failed' });

    // Create notification
    await db('notifications').insert({
      user_id: userId,
      message: `You cancelled your pending room reservation #${id}.`
    });

    res.json({ success: true, message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
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
    const { room_id, check_in, check_out, guests_count, total_price, guest_details } = req.body;
    const user_id = req.user.id;

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

    // 2. Create booking
    const [bookingId] = await trx('bookings').insert({
      guest_id: guest.id,
      room_id,
      check_in,
      check_out,
      guests_count,
      total_price,
      status: 'Pending'
    });

    // Create notification
    await trx('notifications').insert({
      user_id: user_id,
      message: `New Reservation: Booking #${bookingId} created for guest ${guest_details.full_name}.`
    });

    // 3. Update room status (optional, depending on business logic - usually 'Reserved')
    await trx('rooms').where({ id: room_id }).update({ status: 'Reserved' });

    await trx.commit();
    res.status(201).json({ success: true, message: 'Booking created successfully', bookingId });
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
      .select('bookings.*', 'guests.full_name as guest_name', 'rooms.room_number');
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
      .select('bookings.*', 'rooms.room_number');
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

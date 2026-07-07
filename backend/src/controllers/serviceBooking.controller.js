const db = require('../config/db');

const SERVICE_PRICES = {
  'Gym / Fitness Center': 50.00,
  'Spa / Massage': 150.00,
  'Massage / Spa Center': 150.00,
  'Sports Complex': 80.00,
  'Indoor Games / Game Center': 40.00,
  'Clinic': 120.00,
  'Conference Halls': 1500.00,
  'Conference Hall': 1500.00,
  'Restaurant / Dining': 0.00
};

const pickExistingColumns = async (table, data) => {
  const columnInfo = await db(table).columnInfo();
  return Object.fromEntries(
    Object.entries(data).filter(([key, value]) => columnInfo[key] && value !== undefined)
  );
};

exports.createServiceBooking = async (req, res) => {
  try {
    const { service_name, booking_date, booking_time, notes, price, payment_method } = req.body;
    const user_id = req.user.id;
    const servicePrice = Number(price ?? SERVICE_PRICES[service_name] ?? 0);

    const insertData = await pickExistingColumns('service_bookings', {
      user_id,
      service_name,
      booking_date,
      booking_time,
      notes,
      price: servicePrice,
      payment_method: payment_method || 'Mobile Money',
      payment_status: 'Pending',
      status: 'Pending'
    });

    const [id] = await db('service_bookings').insert(insertData);

    // Create a notification for staff
    await db('notifications').insert({
      user_id: 1, // Default admin user ID
      message: `New service booking: ${service_name} scheduled for ${booking_date} at ${booking_time}.`
    });

    res.status(201).json({ success: true, message: 'Service booking created successfully', id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyServiceBookings = async (req, res) => {
  try {
    const user_id = req.user.id;
    const bookings = await db('service_bookings')
      .where({ user_id })
      .orderBy('created_at', 'desc');
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllServiceBookings = async (req, res) => {
  try {
    const bookings = await db('service_bookings')
      .join('users', 'service_bookings.user_id', 'users.id')
      .select('service_bookings.*', 'users.name as guest_name', 'users.email as guest_email')
      .orderBy('service_bookings.created_at', 'desc');
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateServiceBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    await db('service_bookings').where({ id }).update({ status });
    res.json({ success: true, message: 'Service booking status updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.cancelMyServiceBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await db('service_bookings')
      .where({ id, user_id: userId })
      .first();

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Service booking not found' });
    }

    if (booking.payment_status === 'Paid' || booking.status === 'Completed') {
      return res.status(400).json({ success: false, message: 'Paid or completed service bookings cannot be cancelled by the guest. Please contact support.' });
    }

    await db('service_bookings').where({ id }).update({ status: 'Cancelled' });

    // Update payment status to Failed
    await db('service_bookings').where({ id }).update({ payment_status: 'Failed' });

    await db('notifications').insert({
      user_id: userId,
      message: `You cancelled your pending service booking for ${booking.service_name}.`
    });

    res.json({ success: true, message: 'Service booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const db = require('../config/db');

exports.getAllPayments = async (req, res) => {
  try {
    const { status, search, date } = req.query;
    let query = db('payments')
      .join('bookings', 'payments.booking_id', 'bookings.id')
      .join('guests', 'bookings.guest_id', 'guests.id')
      .select(
        'payments.*',
        'guests.full_name as guest_name',
        'bookings.room_id'
      );

    if (status && status !== 'All') {
      query = query.where('payments.status', status);
    }
    
    if (date) {
      // Handles both SQLite date(...) and standard format matching
      query = query.whereRaw("date(payments.created_at) = ?", [date]);
    }

    if (search) {
      query = query.where(function() {
        this.where('guests.full_name', 'like', `%${search}%`)
            .orWhere('payments.transaction_id', 'like', `%${search}%`);
      });
    }

    const payments = await query;
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

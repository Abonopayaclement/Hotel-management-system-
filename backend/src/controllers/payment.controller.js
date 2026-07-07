const db = require('../config/db');

const createTransactionId = (prefix) => {
  const stamp = Date.now().toString(36).toUpperCase();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${stamp}-${random}`;
};

const updateExistingColumns = async (table, where, data) => {
  const columnInfo = await db(table).columnInfo();
  const updateData = Object.fromEntries(
    Object.entries(data).filter(([key, value]) => columnInfo[key] && value !== undefined)
  );

  if (Object.keys(updateData).length > 0) {
    await db(table).where(where).update(updateData);
  }
};

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

exports.completePayment = async (req, res) => {
  const trx = await db.transaction();
  try {
    const { source, id, method } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;
    const isAdmin = ['Super Admin', 'Hotel Manager', 'Receptionist'].includes(userRole);
    const paymentMethod = method || 'Mobile Money';

    if (!source || !id) {
      await trx.rollback();
      return res.status(400).json({ success: false, message: 'Payment source and ID are required' });
    }

    if (source === 'booking' || source === 'reservation' || source === 'room') {
      let query = trx('bookings')
        .join('guests', 'bookings.guest_id', 'guests.id')
        .select('bookings.*')
        .where('bookings.id', id);

      if (!isAdmin) {
        query = query.andWhere('guests.user_id', userId);
      }

      const booking = await query.first();

      if (!booking) {
        await trx.rollback();
        return res.status(404).json({ success: false, message: 'Reservation not found for this guest' });
      }

      const payment = await trx('payments').where({ booking_id: booking.id }).first();
      if (payment) {
        await trx('payments').where({ id: payment.id }).update({
          status: 'Paid',
          method: paymentMethod,
          transaction_id: payment.transaction_id || createTransactionId('ROOM')
        });
      } else {
        await trx('payments').insert({
          booking_id: booking.id,
          amount: booking.total_price,
          method: paymentMethod,
          status: 'Paid',
          transaction_id: createTransactionId('ROOM')
        });
      }

      await trx('bookings').where({ id: booking.id }).update({ status: 'Confirmed' });
      await trx('rooms').where({ id: booking.room_id }).update({ status: 'Occupied' });
    } else if (source === 'food') {
      const order = await trx('food_orders').where({ id }).first();
      if (!order || (!isAdmin && order.user_id !== userId)) {
        await trx.rollback();
        return res.status(404).json({ success: false, message: 'Food order not found for this guest' });
      }

      await trx('food_orders').where({ id }).update({ status: 'Completed' });
      const columnInfo = await trx('food_orders').columnInfo();
      const paymentUpdates = {};
      if (columnInfo.payment_method) paymentUpdates.payment_method = paymentMethod;
      if (columnInfo.payment_status) paymentUpdates.payment_status = 'Paid';
      if (columnInfo.transaction_id) paymentUpdates.transaction_id = createTransactionId('FOOD');
      if (Object.keys(paymentUpdates).length > 0) {
        await trx('food_orders').where({ id }).update(paymentUpdates);
      }
    } else if (source === 'service') {
      const booking = await trx('service_bookings').where({ id }).first();
      if (!booking || (!isAdmin && booking.user_id !== userId)) {
        await trx.rollback();
        return res.status(404).json({ success: false, message: 'Service booking not found for this guest' });
      }

      await trx('service_bookings').where({ id }).update({ status: 'Completed' });
      const columnInfo = await trx('service_bookings').columnInfo();
      const paymentUpdates = {};
      if (columnInfo.payment_method) paymentUpdates.payment_method = paymentMethod;
      if (columnInfo.payment_status) paymentUpdates.payment_status = 'Paid';
      if (columnInfo.transaction_id) paymentUpdates.transaction_id = createTransactionId('SRV');
      if (Object.keys(paymentUpdates).length > 0) {
        await trx('service_bookings').where({ id }).update(paymentUpdates);
      }
    } else {
      await trx.rollback();
      return res.status(400).json({ success: false, message: 'Unsupported payment source' });
    }

    await trx.commit();
    res.json({ success: true, message: 'Payment completed successfully' });
  } catch (error) {
    await trx.rollback();
    res.status(500).json({ success: false, message: error.message });
  }
};

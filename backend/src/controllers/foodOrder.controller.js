const db = require('../config/db');

const ensureWalkInUser = async () => {
  const email = 'restaurant.walkin@holystar.local';
  const existing = await db('users').where({ email }).first();
  if (existing) return existing.id;

  const bcrypt = require('bcryptjs');
  const customerRole = await db('roles').where({ name: 'Customer' }).first();
  const hashedPassword = await bcrypt.hash(`walk-in-${Date.now()}`, 10);
  const [id] = await db('users').insert({
    role_id: customerRole ? customerRole.id : null,
    name: 'Restaurant Walk-in Guest',
    email,
    password: hashedPassword
  });
  return id;
};

const pickExistingColumns = async (table, data) => {
  const columnInfo = await db(table).columnInfo();
  return Object.fromEntries(
    Object.entries(data).filter(([key, value]) => columnInfo[key] && value !== undefined)
  );
};

exports.createFoodOrder = async (req, res) => {
  try {
    const {
      items,
      total_price,
      delivery_room,
      delivery_location,
      delivery_fee,
      customer_name,
      customer_email,
      customer_phone,
      order_type,
      payment_method,
      pay_now
    } = req.body;

    if (!items || !total_price) {
      return res.status(400).json({ success: false, message: 'Order items and total price are required' });
    }

    const isGuestOrder = Boolean(req.user);
    const user_id = isGuestOrder ? req.user.id : await ensureWalkInUser();
    const resolvedOrderType = order_type || (isGuestOrder ? 'room' : 'external');
    const normalizedRoom = delivery_room ? `Room ${String(delivery_room).replace(/^Room\s*/i, '')}` : null;
    const displayLocation = resolvedOrderType === 'room'
      ? normalizedRoom
      : (delivery_location || 'External delivery');
    const status = pay_now || !isGuestOrder ? 'Completed' : 'Pending';

    const insertData = await pickExistingColumns('food_orders', {
      user_id,
      items,
      total_price,
      delivery_room: displayLocation,
      delivery_location,
      delivery_fee: delivery_fee || 0,
      customer_name,
      customer_email,
      customer_phone,
      order_type: resolvedOrderType,
      payment_method: payment_method || 'Mobile Money',
      payment_status: status === 'Completed' ? 'Paid' : 'Pending',
      transaction_id: status === 'Completed' ? `FOOD-${Date.now()}` : null,
      status
    });

    const [id] = await db('food_orders').insert(insertData);

    await db('notifications').insert({
      user_id: 1,
      message: `New food order: ${items} for ${displayLocation || 'restaurant pickup'}. Total: GH₵${total_price}.`
    });

    res.status(201).json({ success: true, message: 'Food order placed successfully', id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyFoodOrders = async (req, res) => {
  try {
    const user_id = req.user.id;
    const orders = await db('food_orders')
      .where({ user_id })
      .orderBy('created_at', 'desc');
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllFoodOrders = async (req, res) => {
  try {
    const orders = await db('food_orders')
      .leftJoin('users', 'food_orders.user_id', 'users.id')
      .select('food_orders.*', 'users.name as guest_name')
      .orderBy('food_orders.created_at', 'desc');
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateFoodOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    await db('food_orders').where({ id }).update({ status });
    res.json({ success: true, message: 'Food order status updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.cancelMyFoodOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await db('food_orders')
      .where({ id, user_id: userId })
      .first();

    if (!order) {
      return res.status(404).json({ success: false, message: 'Food order not found' });
    }

    if (order.payment_status === 'Paid' || order.status === 'Completed') {
      return res.status(400).json({ success: false, message: 'Paid or completed food orders cannot be cancelled by the guest.' });
    }

    await db('food_orders').where({ id }).update({ status: 'Cancelled' });

    // Update payment status to Failed
    await db('food_orders').where({ id }).update({ payment_status: 'Failed' });

    await db('notifications').insert({
      user_id: userId,
      message: `You cancelled your pending food order #${id}.`
    });

    res.json({ success: true, message: 'Food order cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const db = require('../config/db');

exports.getAllNotifications = async (req, res) => {
  try {
    const { search } = req.query;
    let query = db('notifications').orderBy('created_at', 'desc');

    if (search) {
      query = query.where('message', 'like', `%${search}%`);
    }

    const notifications = await query;
    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await db('notifications').where('id', req.params.id).update({ is_read: true });
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const { message } = req.body;
    const user_id = req.user ? req.user.id : 1;
    const [id] = await db('notifications').insert({
      user_id,
      message,
      is_read: false
    });
    res.status(201).json({ success: true, message: 'Notification created', id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


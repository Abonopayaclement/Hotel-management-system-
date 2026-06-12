const db = require('../config/db');

exports.getAllHousekeeping = async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = db('housekeeping')
      .join('rooms', 'housekeeping.room_id', 'rooms.id')
      .leftJoin('staff', 'housekeeping.staff_id', 'staff.id')
      .leftJoin('users', 'staff.user_id', 'users.id')
      .select(
        'housekeeping.*',
        'rooms.room_number',
        'users.name as staff_name'
      );

    if (status && status !== 'All') {
      query = query.where('housekeeping.status', status);
    }

    if (search) {
      query = query.where(function() {
        this.where('rooms.room_number', 'like', `%${search}%`)
            .orWhere('users.name', 'like', `%${search}%`);
      });
    }

    const housekeeping = await query;
    res.json({ success: true, data: housekeeping });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

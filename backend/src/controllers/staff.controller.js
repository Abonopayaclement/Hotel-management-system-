const db = require('../config/db');

exports.getAllStaff = async (req, res) => {
  try {
    const { search } = req.query;
    let query = db('staff')
      .join('users', 'staff.user_id', 'users.id')
      .select(
        'staff.*',
        'users.name',
        'users.email'
      );

    if (search) {
      query = query.where(function() {
        this.where('users.name', 'like', `%${search}%`)
            .orWhere('staff.position', 'like', `%${search}%`)
            .orWhere('staff.department', 'like', `%${search}%`);
      });
    }

    const staff = await query;
    res.json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

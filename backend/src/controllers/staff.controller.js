const db = require('../config/db');

exports.getAllStaff = async (req, res) => {
  try {
    const { search } = req.query;
    
    // Check if the user is authorized to see salaries
    const isAdminOrManager = ['Super Admin', 'Hotel Manager'].includes(req.user.role);
    
    const selectFields = [
      'staff.id',
      'staff.user_id',
      'staff.position',
      'staff.department',
      'staff.created_at',
      'staff.updated_at',
      'users.name',
      'users.email'
    ];
    
    if (isAdminOrManager) {
      selectFields.push('staff.salary');
    }

    let query = db('staff')
      .join('users', 'staff.user_id', 'users.id')
      .select(selectFields);

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

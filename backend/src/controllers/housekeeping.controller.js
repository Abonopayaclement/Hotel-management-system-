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

exports.updateHousekeeping = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, staff_id } = req.body;

    const updates = {};
    if (status !== undefined) updates.status = status;
    if (staff_id !== undefined) {
      // If staff_id is passed as "unassigned" or null/empty, clear staff_id
      updates.staff_id = (staff_id === 'unassigned' || staff_id === '') ? null : staff_id;
    }

    if (status === 'Clean' || status === 'Completed') {
      updates.last_cleaned = db.fn.now();
    }

    await db('housekeeping').where({ id }).update(updates);

    const task = await db('housekeeping').where({ id }).first();
    if (task && (status === 'Clean' || status === 'Completed')) {
      const room = await db('rooms').where({ id: task.room_id }).first();
      if (room) {
        // Also check if there are other pending support tickets for this room
        const otherTickets = await db('support_requests')
          .where(function() {
            this.where('room_number', `Room ${room.room_number}`)
                .orWhere('room_number', `${room.room_number}`);
          })
          .whereIn('status', ['Pending', 'Assigned', 'In Progress'])
          .first();

        if (!otherTickets) {
          await db('rooms').where({ id: task.room_id }).update({ status: 'Available' });
        }
      }
    }

    res.json({ success: true, message: 'Housekeeping task updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

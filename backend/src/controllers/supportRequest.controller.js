const db = require('../config/db');

exports.createSupportRequest = async (req, res) => {
  try {
    const { guest_name, email, phone, room_number, category, description, urgency } = req.body;

    const [id] = await db('support_requests').insert({
      guest_name,
      email,
      phone,
      room_number,
      category,
      description,
      urgency: urgency || 'Medium',
      status: 'Pending'
    });

    // Automatically update room and housekeeping status if room_number matches
    const match = room_number ? room_number.match(/\d+/) : null;
    const rawRoomNum = match ? match[0] : '';
    if (rawRoomNum) {
      const room = await db('rooms').where({ room_number: rawRoomNum }).first();
      if (room) {
        let newStatus = null;
        if (category === 'Room cleaning request' || category === 'Housekeeping request') {
          newStatus = 'Cleaning';
          
          // Upsert housekeeping task
          const existing = await db('housekeeping').where({ room_id: room.id }).first();
          if (existing) {
            await db('housekeeping').where({ room_id: room.id }).update({
              status: 'Dirty',
              last_cleaned: null,
              staff_id: null
            });
          } else {
            await db('housekeeping').insert({
              room_id: room.id,
              status: 'Dirty',
              last_cleaned: null,
              staff_id: null
            });
          }
        } else if ([
          'Maintenance problem',
          'Electrical issue',
          'Plumbing issue',
          'AC / TV / Wi-Fi not working'
        ].includes(category)) {
          newStatus = 'Maintenance';
        }

        if (newStatus) {
          await db('rooms').where({ id: room.id }).update({ status: newStatus });
        }
      }
    }

    // Create a notification for staff/admin
    await db('notifications').insert({
      user_id: 1, // Default Admin user ID
      message: `Support Ticket: Room ${room_number || 'N/A'} submitted a ${category} request (${urgency || 'Medium'} urgency).`
    });

    res.status(201).json({ success: true, message: 'Support request submitted successfully', id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllSupportRequests = async (req, res) => {
  try {
    const requests = await db('support_requests').orderBy('created_at', 'desc');
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSupportRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    await db('support_requests').where({ id }).update({ status });

    if (status === 'Completed' || status === 'Completed / Ready') {
      const request = await db('support_requests').where({ id }).first();
      if (request && request.room_number) {
        const match = request.room_number.match(/\d+/);
        const rawRoomNum = match ? match[0] : '';
        if (rawRoomNum) {
          const room = await db('rooms').where({ room_number: rawRoomNum }).first();
          if (room) {
            // Check if there are other pending/assigned/in-progress support requests for this room
            const otherTickets = await db('support_requests')
              .where({ room_number: request.room_number })
              .whereIn('status', ['Pending', 'Assigned', 'In Progress'])
              .andWhereNot({ id })
              .first();

            // Check if there is a dirty/in-progress housekeeping task
            const hkTask = await db('housekeeping')
              .where({ room_id: room.id })
              .whereIn('status', ['Dirty', 'In Progress'])
              .first();

            if (!otherTickets && !hkTask) {
              await db('rooms').where({ id: room.id }).update({ status: 'Available' });
            }
          }
        }
      }
    }

    res.json({ success: true, message: 'Support request status updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const db = require('../config/db');

exports.createSupportRequest = async (req, res) => {
  try {
    const { guest_name, email, phone, room_number, category, description, image_url } = req.body;

    // Validate that the room exists and is currently occupied
    const match = room_number ? room_number.match(/\d+/) : null;
    const rawRoomNum = match ? match[0] : '';
    let room = null;
    if (rawRoomNum) {
      room = await db('rooms').where({ room_number: rawRoomNum }).first();
      if (!room) {
        return res.status(400).json({ success: false, message: 'Invalid room number. Please check and try again.' });
      }
      if (room.status !== 'Occupied') {
        return res.status(400).json({ success: false, message: `Room ${rawRoomNum} is not currently occupied. There is no guest in this room.` });
      }
    }

    // Auto-calculate priority (urgency) based on category and description keywords
    const desc = (description || '').toLowerCase();
    let calculatedUrgency = 'Medium';
    
    // Check extreme urgency keywords
    if (desc.includes('fire') || desc.includes('smoke') || desc.includes('flood') || desc.includes('burst') || desc.includes('spark') || desc.includes('shock') || desc.includes('emergency') || desc.includes('injur') || desc.includes('danger')) {
      calculatedUrgency = 'High';
    } else {
      // Map standard categories
      if (category === 'Electrical issue' || category === 'Plumbing issue' || category === 'Electrical' || category === 'Plumbing') {
        calculatedUrgency = 'High';
      } else if (category === 'Maintenance problem' || category === 'Maintenance' || category === 'Internet') {
        calculatedUrgency = 'Medium';
      } else if (category === 'Cleaning' || category === 'Room Service' || category === 'Room cleaning request' || category === 'Housekeeping request' || category === 'Other') {
        calculatedUrgency = 'Low';
      }
      
      // Elevate priority on keywords
      if (calculatedUrgency === 'Low' && (desc.includes('urgent') || desc.includes('leak') || desc.includes('broken') || desc.includes('spill') || desc.includes('smell'))) {
        calculatedUrgency = 'Medium';
      } else if (calculatedUrgency === 'Medium' && (desc.includes('urgent') || desc.includes('leak') || desc.includes('broken') || desc.includes('no power') || desc.includes('water flowing') || desc.includes('overflow'))) {
        calculatedUrgency = 'High';
      }
    }

    const [id] = await db('support_requests').insert({
      guest_name,
      email,
      phone,
      room_number,
      category,
      description,
      urgency: calculatedUrgency,
      status: 'Pending',
      image_url: image_url || null
    });

    // Automatically update room and housekeeping status if room exists
    if (room) {
      let newStatus = null;
      if (category === 'Room cleaning request' || category === 'Housekeeping request' || category === 'Cleaning') {
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
        'AC / TV / Wi-Fi not working',
        'Maintenance',
        'Plumbing',
        'Electrical',
        'Internet'
      ].includes(category)) {
        newStatus = 'Maintenance';
      }

      if (newStatus) {
        await db('rooms').where({ id: room.id }).update({ status: newStatus });
      }
    }

    // Find a valid admin/user ID dynamically to avoid foreign key errors on MySQL
    const adminUser = await db('users')
      .join('roles', 'users.role_id', 'roles.id')
      .where('roles.name', 'Super Admin')
      .first();
    const adminId = adminUser ? adminUser.id : 9; // Fallback to 9 (Super Admin seed ID) or first user in DB

    // Create a notification for staff/admin
    await db('notifications').insert({
      user_id: adminId,
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

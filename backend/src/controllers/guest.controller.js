const db = require('../config/db');

exports.getAllGuests = async (req, res) => {
  try {
    const { search, nationality } = req.query;
    
    let query = db('guests')
      .leftJoin('bookings', 'guests.id', 'bookings.guest_id')
      .leftJoin('rooms', 'bookings.room_id', 'rooms.id')
      .select('guests.*', 'rooms.room_number as room', 'bookings.check_in', 'bookings.check_out', 'bookings.status as booking_status')
      .orderBy('bookings.id', 'desc');

    let guests = await query;
    
    // De-duplicate guests since join might return multiple rows per guest
    const uniqueGuests = [];
    const seenGuestIds = new Set();
    
    for (const g of guests) {
      if (!seenGuestIds.has(g.id)) {
        seenGuestIds.add(g.id);
        uniqueGuests.push({
          id: g.id,
          name: g.full_name,
          email: g.email,
          phone: g.phone,
          nationality: g.nationality,
          room: g.room || 'None',
          check_in: g.check_in || 'N/A',
          check_out: g.check_out || 'N/A',
          status: g.booking_status || 'Registered'
        });
      }
    }

    let result = uniqueGuests;
    if (nationality) {
      result = result.filter(g => g.nationality === nationality);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(g => 
        g.name.toLowerCase().includes(q) || 
        g.email.toLowerCase().includes(q) || 
        g.phone.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getGuestById = async (req, res) => {
  try {
    const guest = await db('guests').where('id', req.params.id).first();
    if (!guest) return res.status(404).json({ success: false, message: 'Guest not found' });
    res.json({ success: true, data: guest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateGuest = async (req, res) => {
  try {
    await db('guests').where('id', req.params.id).update(req.body);
    res.json({ success: true, message: 'Guest updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const guest = await db('guests').where('user_id', req.user.id).first();
    if (!guest) {
      return res.json({ 
        success: true, 
        data: { 
          full_name: req.user.name, 
          email: req.user.email,
          phone: '', 
          nationality: '', 
          id_type: 'Passport', 
          id_number: '' 
        } 
      });
    }
    res.json({ success: true, data: guest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateMyProfile = async (req, res) => {
  try {
    const { full_name, phone, nationality, id_type, id_number } = req.body;
    let guest = await db('guests').where('user_id', req.user.id).first();
    if (!guest) {
      const [id] = await db('guests').insert({
        user_id: req.user.id,
        full_name: full_name || req.user.name,
        email: req.user.email,
        phone: phone || '',
        nationality: nationality || '',
        id_type: id_type || 'Passport',
        id_number: id_number || ''
      });
      return res.json({ success: true, message: 'Profile created', id });
    } else {
      await db('guests').where('user_id', req.user.id).update({
        full_name: full_name || guest.full_name,
        phone: phone !== undefined ? phone : guest.phone,
        nationality: nationality !== undefined ? nationality : guest.nationality,
        id_type: id_type !== undefined ? id_type : guest.id_type,
        id_number: id_number !== undefined ? id_number : guest.id_number
      });
      return res.json({ success: true, message: 'Profile updated' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


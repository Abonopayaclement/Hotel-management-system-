const db = require('../config/db');

exports.getAllRooms = async (req, res) => {
  try {
    const { type, status, minPrice, maxPrice, search } = req.query;
    let query = db('rooms')
      .join('room_types', 'rooms.type_id', 'room_types.id')
      .select('rooms.*', 'room_types.name as type_name', 'room_types.price_per_night', 'room_types.capacity');

    if (type && type !== 'All') {
      if (type.toLowerCase() === 'presidential') {
        query = query.where(function() {
          this.where('room_types.name', 'Presidential')
              .orWhere('room_types.name', 'Presidential Suite');
        });
      } else {
        query = query.where('room_types.name', type);
      }
    }
    if (status && status !== 'All') {
      query = query.where('rooms.status', status);
    }
    if (minPrice) {
      query = query.where('room_types.price_per_night', '>=', parseFloat(minPrice));
    }
    if (maxPrice) {
      query = query.where('room_types.price_per_night', '<=', parseFloat(maxPrice));
    }
    if (search) {
      query = query.where(function() {
        this.where('rooms.room_number', 'like', `%${search}%`)
            .orWhere('room_types.name', 'like', `%${search}%`);
      });
    }

    const rooms = await query;
    res.json({ success: true, data: rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRoomTypes = async (req, res) => {
  try {
    const types = await db('room_types').select('*');
    res.json({ success: true, data: types });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRoomById = async (req, res) => {
  try {
    const room = await db('rooms')
      .join('room_types', 'rooms.type_id', 'room_types.id')
      .select('rooms.*', 'room_types.name as type_name', 'room_types.price_per_night', 'room_types.capacity', 'room_types.description', 'room_types.amenities')
      .where('rooms.id', req.params.id)
      .first();
    
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    res.json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const { room_number, floor, type_id, status } = req.body;
    const [id] = await db('rooms').insert({
      room_number,
      floor: parseInt(floor),
      type_id: parseInt(type_id),
      status: status || 'Available'
    });
    res.status(201).json({ success: true, message: 'Room created', id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const { room_number, floor, type_id, status, price_per_night } = req.body;
    
    // Update rooms table
    const updateData = {};
    if (room_number !== undefined) updateData.room_number = room_number;
    if (floor !== undefined) updateData.floor = parseInt(floor);
    if (type_id !== undefined) updateData.type_id = parseInt(type_id);
    if (status !== undefined) updateData.status = status;

    if (Object.keys(updateData).length > 0) {
      await db('rooms').where('id', req.params.id).update(updateData);
    }

    // If price_per_night is updated, update the associated room type price
    if (price_per_night !== undefined && type_id !== undefined) {
      await db('room_types').where('id', parseInt(type_id)).update({
        price_per_night: parseFloat(price_per_night)
      });
    }

    res.json({ success: true, message: 'Room updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    await db('rooms').where('id', req.params.id).del();
    res.json({ success: true, message: 'Room deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

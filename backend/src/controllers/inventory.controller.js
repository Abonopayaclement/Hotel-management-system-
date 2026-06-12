const db = require('../config/db');

exports.getAllInventory = async (req, res) => {
  try {
    const { search } = req.query;
    let query = db('inventory').select('*');

    if (search) {
      query = query.where('item_name', 'like', `%${search}%`);
    }

    const inventory = await query;
    res.json({ success: true, data: inventory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

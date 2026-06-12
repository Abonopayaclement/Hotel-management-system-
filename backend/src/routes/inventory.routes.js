const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, inventoryController.getAllInventory);

module.exports = router;

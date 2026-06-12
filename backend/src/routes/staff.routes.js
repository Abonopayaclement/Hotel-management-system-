const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staff.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, staffController.getAllStaff);

module.exports = router;

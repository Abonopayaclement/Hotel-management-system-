const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staff.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/', protect, authorize('Super Admin', 'Hotel Manager', 'Receptionist', 'Accountant', 'Housekeeper'), staffController.getAllStaff);

module.exports = router;

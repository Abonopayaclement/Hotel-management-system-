const express = require('express');
const router = express.Router();
const financeController = require('../controllers/finance.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/', protect, authorize('Super Admin', 'Hotel Manager', 'Accountant'), financeController.getFinanceDashboard);
router.post('/:id/pay', protect, authorize('Super Admin', 'Hotel Manager', 'Accountant'), financeController.markAsPaid);

module.exports = router;

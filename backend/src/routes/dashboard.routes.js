const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/stats', protect, authorize('Super Admin', 'Hotel Manager', 'Accountant'), dashboardController.getStats);
router.get('/public-stats', dashboardController.getPublicStats);
router.get('/revenue-chart', protect, authorize('Super Admin', 'Hotel Manager', 'Accountant'), dashboardController.getRevenueChart);
router.get('/occupancy', protect, authorize('Super Admin', 'Hotel Manager'), dashboardController.getOccupancyRate);
router.get('/search', protect, dashboardController.globalSearch);

module.exports = router;

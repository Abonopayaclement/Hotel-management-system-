const express = require('express');
const router = express.Router();
const serviceBookingController = require('../controllers/serviceBooking.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.post('/', protect, serviceBookingController.createServiceBooking);
router.get('/my', protect, serviceBookingController.getMyServiceBookings);
router.get('/', protect, authorize('Super Admin', 'Hotel Manager', 'Receptionist'), serviceBookingController.getAllServiceBookings);
router.post('/:id/cancel', protect, serviceBookingController.cancelMyServiceBooking);
router.put('/:id/status', protect, authorize('Super Admin', 'Hotel Manager', 'Receptionist'), serviceBookingController.updateServiceBookingStatus);

module.exports = router;

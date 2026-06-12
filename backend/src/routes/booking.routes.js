const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.post('/check-availability', bookingController.checkAvailability);
router.post('/', protect, bookingController.createBooking);
router.get('/', protect, authorize('Super Admin', 'Hotel Manager', 'Receptionist'), bookingController.getAllBookings);
router.get('/my-bookings', protect, bookingController.getMyBookings);
router.get('/:id', protect, bookingController.getBookingById);
router.put('/:id/status', protect, authorize('Super Admin', 'Hotel Manager', 'Receptionist'), bookingController.updateBookingStatus);

module.exports = router;

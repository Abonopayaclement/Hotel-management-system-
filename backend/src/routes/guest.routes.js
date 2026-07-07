const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guest.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/', protect, authorize('Super Admin', 'Hotel Manager', 'Receptionist'), guestController.getAllGuests);
router.get('/profile/me', protect, guestController.getMyProfile);
router.put('/profile/me', protect, guestController.updateMyProfile);
router.get('/:id', protect, guestController.getGuestById);
router.put('/:id', protect, guestController.updateGuest);

module.exports = router;


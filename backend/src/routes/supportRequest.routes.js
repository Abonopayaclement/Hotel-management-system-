const express = require('express');
const router = express.Router();
const supportRequestController = require('../controllers/supportRequest.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Public route to submit support request from contact page
router.post('/', supportRequestController.createSupportRequest);

// Protected routes for staff to manage support requests
router.get('/', protect, authorize('Super Admin', 'Hotel Manager', 'Receptionist', 'Housekeeper'), supportRequestController.getAllSupportRequests);
router.put('/:id/status', protect, authorize('Super Admin', 'Hotel Manager', 'Receptionist', 'Housekeeper'), supportRequestController.updateSupportRequestStatus);

module.exports = router;

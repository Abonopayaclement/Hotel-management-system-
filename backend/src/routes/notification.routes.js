const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, notificationController.getAllNotifications);
router.put('/:id/read', protect, notificationController.markAsRead);

module.exports = router;

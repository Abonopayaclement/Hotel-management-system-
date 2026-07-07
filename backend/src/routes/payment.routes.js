const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, paymentController.getAllPayments);
router.post('/complete', protect, paymentController.completePayment);

module.exports = router;

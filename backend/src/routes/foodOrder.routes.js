const express = require('express');
const router = express.Router();
const foodOrderController = require('../controllers/foodOrder.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.post('/public', foodOrderController.createFoodOrder);
router.post('/', protect, foodOrderController.createFoodOrder);
router.get('/my', protect, foodOrderController.getMyFoodOrders);
router.get('/', protect, authorize('Super Admin', 'Hotel Manager', 'Receptionist'), foodOrderController.getAllFoodOrders);
router.post('/:id/cancel', protect, foodOrderController.cancelMyFoodOrder);
router.put('/:id/status', protect, authorize('Super Admin', 'Hotel Manager', 'Receptionist'), foodOrderController.updateFoodOrderStatus);

module.exports = router;

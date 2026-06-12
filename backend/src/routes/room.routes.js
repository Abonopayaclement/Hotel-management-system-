const express = require('express');
const router = express.Router();
const roomController = require('../controllers/room.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/', roomController.getAllRooms);
router.get('/types', roomController.getRoomTypes);
router.get('/:id', roomController.getRoomById);

// Protected routes
router.post('/', protect, authorize('Super Admin', 'Hotel Manager'), roomController.createRoom);
router.put('/:id', protect, authorize('Super Admin', 'Hotel Manager', 'Receptionist'), roomController.updateRoom);
router.delete('/:id', protect, authorize('Super Admin'), roomController.deleteRoom);

module.exports = router;

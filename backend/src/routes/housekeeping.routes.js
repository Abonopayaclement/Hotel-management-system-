const express = require('express');
const router = express.Router();
const housekeepingController = require('../controllers/housekeeping.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, housekeepingController.getAllHousekeeping);
router.put('/:id', protect, housekeepingController.updateHousekeeping);

module.exports = router;

const express = require('express');
const router = express.Router();
const housekeepingController = require('../controllers/housekeeping.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, housekeepingController.getAllHousekeeping);

module.exports = router;

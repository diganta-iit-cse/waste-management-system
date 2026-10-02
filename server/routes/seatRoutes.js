const express = require('express');
const router = express.Router();
const { lockSeats, releaseSeats } = require('../controllers/seatController');

router.post('/lock', lockSeats);
router.post('/release', releaseSeats);

module.exports = router;

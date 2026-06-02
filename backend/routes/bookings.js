const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Create booking
router.post('/create', bookingController.createBooking);

// Get available dates
router.get('/available-dates', bookingController.getAvailableDates);

// Get available times for a date
router.get('/available-times/:date', bookingController.getAvailableTimes);

// Get all bookings (admin)
router.get('/all', bookingController.getAllBookings);

module.exports = router;

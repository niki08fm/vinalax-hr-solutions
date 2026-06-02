const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// Get all services
router.get('/', serviceController.getAllServices);

// Get service by slug
router.get('/:slug', serviceController.getServiceBySlug);

module.exports = router;

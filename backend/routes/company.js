const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');

// Get company info
router.get('/info', companyController.getCompanyInfo);

module.exports = router;

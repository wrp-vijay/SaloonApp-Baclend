const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const saloonController = require('../controller/saloon');
const { verifyPostToken, varifyAccessToken } = require('../middleware/jwtAuth');
const { saloonSchema } = require('../helper/validationSchemas');
const validate = require('../middleware/validate'); // Adjust path as needed

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10
});

// Create Saloon
router.post('/saloons',validate(saloonSchema) ,verifyPostToken,limiter, saloonController.createSaloon);

// Read Saloons (Get all saloons or get saloon by ID)
router.get('/saloons', varifyAccessToken,limiter, saloonController.getAllSaloons);
router.get('/saloons/:id', varifyAccessToken,limiter, saloonController.getSaloonById);

// Update Saloon
router.put('/saloons/:id', varifyAccessToken,limiter, saloonController.updateSaloon);

// Delete Saloon
router.delete('/saloons/:id', varifyAccessToken,limiter, saloonController.deleteSaloon);

module.exports = router;

const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const saloonRattingController = require('../controller/saloonRatting');
const { saloonRattingSchema } = require('../helper/validationSchemas');
const validate = require('../middleware/validate');
const { varifyAccessToken } = require('../middleware/jwtAuth');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10
});

// Create SaloonRatting
router.post('/saloonrattings',validate(saloonRattingSchema),varifyAccessToken,limiter, saloonRattingController.createSaloonRating);

// Read all SaloonRattings
router.get('/saloonrattings',limiter, saloonRattingController.getAllSaloonRatings);

// Read SaloonRatting by ID
router.get('/saloonrattings/:id',limiter, saloonRattingController.getSaloonRatingById);

// Update SaloonRatting
router.put('/saloonrattings/:id',limiter, saloonRattingController.updateSaloonRating);

// Delete SaloonRatting
router.delete('/saloonrattings/:id',limiter, saloonRattingController.deleteSaloonRating);

module.exports = router;

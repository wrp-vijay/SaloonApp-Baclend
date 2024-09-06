const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const barberRatingController = require('../controller/barberrating');
const { barberRattingSchema } = require('../helper/validationSchemas');
const validate = require('../middleware/validate');
const { varifyAccessToken } = require('../middleware/jwtAuth');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10
});

router.post('/barberratings', varifyAccessToken, validate(barberRattingSchema), limiter, barberRatingController.createBarberRating);
router.get('/barberratings', limiter, barberRatingController.getBarberRatings);
router.get('/barberratings/:id', limiter, barberRatingController.getBarberRatingById);
router.put('/barberratings/:id', limiter, barberRatingController.updateBarberRating);
router.delete('/barberratings/:id', limiter, barberRatingController.deleteBarberRating);

module.exports = router;


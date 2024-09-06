const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const barberController = require('../controller/barber');
const { verifyPostToken, varifyAccessToken } = require('../middleware/jwtAuth');
const { barberSchema } = require('../helper/validationSchemas');
const validate = require('../middleware/validate');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20
});

router.post('/barbers', validate(barberSchema), verifyPostToken, limiter, barberController.createBarber);
router.get('/barbers', varifyAccessToken,limiter, barberController.getBarbers);
router.get('/barbers/:id', varifyAccessToken,limiter, barberController.getBarberById);
router.put('/barbers/:id', varifyAccessToken,limiter, barberController.updateBarber);
router.delete('/barbers/:id', varifyAccessToken,limiter, barberController.deleteBarber);

module.exports = router;

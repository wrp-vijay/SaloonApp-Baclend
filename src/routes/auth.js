const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const authController = require('../controller/auth');
const { varifyAccessToken } = require('../middleware/jwtAuth');
const { registerSchema, loginSchema } = require('../helper/validationSchemas');
const validate = require('../middleware/validate'); // Adjust path as needed

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10
});

router.post("/register",validate(registerSchema), limiter, authController.registerUser);
router.post("/login",validate(loginSchema),limiter, authController.login);
router.get("/user/saloons",varifyAccessToken,limiter, authController.getAllSaloons);
router.get("/user/barbers",varifyAccessToken,limiter, authController.getBarbers);

module.exports = router;
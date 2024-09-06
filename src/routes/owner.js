const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const ownerController = require('../controller/owner');
const { verifyPostToken } = require('../middleware/jwtAuth');
const { loginSchema, ownerSchema } = require('../helper/validationSchemas');
const validate = require('../middleware/validate'); // Adjust path as needed

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10
});

// Create Owner
router.post('/owners',validate(ownerSchema),limiter, ownerController.createOwner);
router.post('/owners/login',validate(loginSchema),limiter, ownerController.ownerLogin);

// Read Owners (Get all owners or get owner by ID)
router.get('/owners', verifyPostToken, limiter, ownerController.getAllOwners);
router.get('/owners/:id', verifyPostToken,limiter, ownerController.getOwnerById);

// Update Owner
router.put('/owners/:id', verifyPostToken,limiter, ownerController.updateOwner);

// Delete Owner
router.delete('/owners/:id', verifyPostToken,limiter, ownerController.deleteOwner);

module.exports = router;

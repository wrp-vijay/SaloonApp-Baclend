const express = require('express');
const router = express.Router();
const UserController = require('../controller/user'); // Adjust the path as needed

router.post('/users', UserController.createUser); // Create User
router.get('/users', UserController.getAllUsers); // Read all Users
router.get('/users/:id', UserController.getUserById); // Read User by ID
router.put('/users/:id', UserController.updateUser); // Update User
router.delete('/users/:id', UserController.deleteUser); // Delete User

module.exports = router;

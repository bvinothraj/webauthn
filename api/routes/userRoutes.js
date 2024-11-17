const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Define the route for creating a user
router.post('/users/v1', userController.createUser);

module.exports = router;
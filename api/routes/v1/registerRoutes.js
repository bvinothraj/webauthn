const express = require('express');
const registerController = require('../../controllers/registerController');

const router = express.Router();

// Define the route for registration initiation
router.post('/start', registerController.startRegistration);
router.post('/confirm', registerController.completeRegistration);

module.exports = router;
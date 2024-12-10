const userService = require('../services/registerService');

const startRegistration = async (req, res) => {
    console.log('startRegistration', req.body);
    const { name, email } = req.body;
    if (!name || !email) {
        const error = new Error('Name and email are required');
        error.statusCode = 400;
        throw error;
    }

    const options = await userService.createUser(name, email);
    res.status(201).json(options);
};

const completeRegistration = async (req, res) => {
    res.status(201);
};


module.exports = {
    startRegistration,
    completeRegistration,
};
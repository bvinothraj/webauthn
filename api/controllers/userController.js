const userService = require('../services/userService');

const createUser = async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        const error = new Error('Name and email are required');
        error.statusCode = 400;
        throw error;
    }

    const userId = await userService.createUser(name, email);
    res.status(201).json({ userId });
};

module.exports = {
    createUser,
};
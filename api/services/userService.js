const userModel = require('../models/userModel');
const { v4: uuidv4 } = require('uuid');

const createUser = async (name, email) => {
    const userId = uuidv4();
    const userData = { name, email };
    await userModel.saveUser(userId, userData);
    return userId;
};

module.exports = {
    createUser,
};
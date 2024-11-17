const redisClient = require('../config/redis');

const saveUser = async (userId, userData) => {
    await redisClient.hSet(userId, userData);
    return userId;
};

module.exports = {
    saveUser,
};
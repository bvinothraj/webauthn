// config/redis.js
const { createClient } = require('redis');

const redisClient = createClient({
    url: 'redis://localhost:6379',
});

redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
});

(async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Redis');
    } catch (err) {
        console.error('Failed to connect to Redis:', err);
    }
})();

// Gracefully handle server shutdown
process.on('SIGINT', async () => {
    console.log('Closing redis connection...');
    await redisClient.quit();
});


module.exports = redisClient;

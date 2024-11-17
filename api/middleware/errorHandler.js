const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.stack); // Logs the error stack trace for debugging

    // Respond with a JSON error message
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
    });
};

module.exports = errorHandler;
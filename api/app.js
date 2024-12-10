const express = require('express');
const path = require('path');
const registerRoutes = require('./routes/v1/registerRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, '../public')));

// Middleware
app.use(express.json());

// Load routes
app.use('/api/v1/register', registerRoutes);

// Error handler middleware should be the last middleware added
app.use(errorHandler);

module.exports = app;
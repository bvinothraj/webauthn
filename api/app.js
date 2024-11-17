const express = require('express');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.json());

// Load routes
app.use('/api', userRoutes);

// Error handler middleware should be the last middleware added
app.use(errorHandler);

module.exports = app;
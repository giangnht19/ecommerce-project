const express = require('express');
require('dotenv').config();

const app = express();

// Environment check endpoint
app.get('/env-check', (req, res) => {
    const envVars = {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        SERVER_URL: process.env.SERVER_URL,
        CLIENT_URL: process.env.CLIENT_URL,
        host: req.get('host'),
        protocol: req.protocol
    };
    
    console.log('Environment check requested:', envVars);
    res.json(envVars);
});

module.exports = app;

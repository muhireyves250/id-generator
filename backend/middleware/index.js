const express = require('express');
const cors = require('cors');

const configureMiddleware = (app) => {
    app.use(cors());
    // Need a large limit for base64 encoded images
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));
};

module.exports = configureMiddleware;

require('dotenv').config();
const express = require('express');
const configureMiddleware = require('./middleware');
const cardRoutes = require('./routes/cardRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Setup Middleware
configureMiddleware(app);

// Setup Routes
app.use('/api/cards', cardRoutes);

// Database Initialization
const db = require('./db');

const initDB = async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS cards (
                id VARCHAR(255) PRIMARY KEY,
                student_name VARCHAR(255),
                dob DATE,
                student_id_value VARCHAR(255),
                id_format VARCHAR(50),
                student_email VARCHAR(255),
                student_department VARCHAR(255),
                address TEXT,
                academic_year VARCHAR(100),
                issue_txt VARCHAR(100),
                date_of_issue VARCHAR(100),
                exp_txt VARCHAR(100),
                date_of_exp VARCHAR(100),
                temp2o VARCHAR(50),
                country VARCHAR(100),
                college VARCHAR(255),
                principal_signature VARCHAR(255),
                parent_name VARCHAR(255),
                parent_number VARCHAR(50),
                gender VARCHAR(50),
                uploaded_image TEXT,
                uploaded_logo TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Database initialized successfully with structured schema.');
    } catch (err) {
        console.error('Failed to initialize database:', err);
    }
};

// Start Server
app.listen(PORT, async () => {
    await initDB();
    console.log(`Backend API running on port ${PORT}`);
});

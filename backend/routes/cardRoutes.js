const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const router = express.Router();

// GET all cards
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM cards ORDER BY created_at ASC');
        const cards = result.rows.map(row => ({
            id: row.id,
            studentName: row.student_name,
            dob: row.dob ? new Date(row.dob).toISOString().split('T')[0] : row.dob,
            studentId: row.student_id_value,
            idFormat: row.id_format,
            studentEmail: row.student_email,
            studentDepartment: row.student_department,
            address: row.address,
            academicYear: row.academic_year,
            issueTxt: row.issue_txt,
            dateOfIssue: row.date_of_issue,
            expTxt: row.exp_txt,
            dateOfExp: row.date_of_exp,
            temp2o: row.temp2o,
            country: row.country,
            college: row.college,
            principalSignature: row.principal_signature,
            parentName: row.parent_name,
            parentNumber: row.parent_number,
            gender: row.gender,
            uploadedImage: row.uploaded_image,
            uploadedLogo: row.uploaded_logo,
            createdAt: row.created_at
        }));
        res.json(cards);
    } catch (err) {
        console.error('Error fetching cards:', err);
        res.status(500).json({ error: 'Failed to fetch cards' });
    }
});

// GET single card
router.get('/:id', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM cards WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Card not found' });
        }
        const row = result.rows[0];
        res.json({
            id: row.id,
            studentName: row.student_name,
            dob: row.dob ? new Date(row.dob).toISOString().split('T')[0] : row.dob,
            studentId: row.student_id_value,
            idFormat: row.id_format,
            studentEmail: row.student_email,
            studentDepartment: row.student_department,
            address: row.address,
            academicYear: row.academic_year,
            issueTxt: row.issue_txt,
            dateOfIssue: row.date_of_issue,
            expTxt: row.exp_txt,
            dateOfExp: row.date_of_exp,
            temp2o: row.temp2o,
            country: row.country,
            college: row.college,
            principalSignature: row.principal_signature,
            parentName: row.parent_name,
            parentNumber: row.parent_number,
            gender: row.gender,
            uploadedImage: row.uploaded_image,
            uploadedLogo: row.uploaded_logo,
            createdAt: row.created_at
        });
    } catch (err) {
        console.error('Error fetching card:', err);
        res.status(500).json({ error: 'Failed to fetch card' });
    }
});

// POST new card
router.post('/', async (req, res) => {
    try {
        const id = uuidv4();
        const d = req.body;

        await db.query(
            `INSERT INTO cards (
                id, student_name, dob, student_id_value, id_format, student_email, 
                student_department, address, academic_year, issue_txt, date_of_issue, 
                exp_txt, date_of_exp, temp2o, country, college, principal_signature, 
                parent_name, parent_number, gender, uploaded_image, uploaded_logo
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)`,
            [
                id, d.studentName, d.dob, d.studentId, d.idFormat, d.studentEmail,
                d.studentDepartment, d.address, d.academicYear, d.issueTxt, d.dateOfIssue,
                d.expTxt, d.dateOfExp, d.temp2o, d.country, d.college, d.principalSignature,
                d.parentName, d.parentNumber, d.gender, d.uploadedImage, d.uploadedLogo
            ]
        );

        const result = await db.query('SELECT * FROM cards WHERE id = $1', [id]);
        const row = result.rows[0];
        res.status(201).json({
            id: row.id,
            studentName: row.student_name,
            dob: row.dob,
            studentId: row.student_id_value,
            idFormat: row.id_format,
            studentEmail: row.student_email,
            studentDepartment: row.student_department,
            address: row.address,
            academicYear: row.academic_year,
            issueTxt: row.issue_txt,
            dateOfIssue: row.date_of_issue,
            expTxt: row.exp_txt,
            dateOfExp: row.date_of_exp,
            temp2o: row.temp2o,
            country: row.country,
            college: row.college,
            principalSignature: row.principal_signature,
            parentName: row.parent_name,
            parentNumber: row.parent_number,
            gender: row.gender,
            uploadedImage: row.uploaded_image,
            uploadedLogo: row.uploaded_logo,
            createdAt: row.created_at
        });
    } catch (err) {
        console.error('Error saving card:', err);
        res.status(500).json({ error: 'Failed to save card' });
    }
});

// PUT update card
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const d = req.body;

        const result = await db.query(
            `UPDATE cards SET 
                student_name = $1, dob = $2, student_id_value = $3, id_format = $4, 
                student_email = $5, student_department = $6, address = $7, 
                academic_year = $8, issue_txt = $9, date_of_issue = $10, 
                exp_txt = $11, date_of_exp = $12, temp2o = $13, country = $14, 
                college = $15, principal_signature = $16, parent_name = $17, 
                parent_number = $18, gender = $19, uploaded_image = $20, 
                uploaded_logo = $21
            WHERE id = $22 RETURNING *`,
            [
                d.studentName, d.dob, d.studentId, d.idFormat, d.studentEmail,
                d.studentDepartment, d.address, d.academicYear, d.issueTxt, d.dateOfIssue,
                d.expTxt, d.dateOfExp, d.temp2o, d.country, d.college, d.principalSignature,
                d.parentName, d.parentNumber, d.gender, d.uploadedImage, d.uploadedLogo,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Card not found' });
        }

        const row = result.rows[0];
        res.json({
            id: row.id,
            studentName: row.student_name,
            dob: row.dob,
            studentId: row.student_id_value,
            idFormat: row.id_format,
            studentEmail: row.student_email,
            studentDepartment: row.student_department,
            address: row.address,
            academicYear: row.academic_year,
            issueTxt: row.issue_txt,
            dateOfIssue: row.date_of_issue,
            expTxt: row.exp_txt,
            dateOfExp: row.date_of_exp,
            temp2o: row.temp2o,
            country: row.country,
            college: row.college,
            principalSignature: row.principal_signature,
            parentName: row.parent_name,
            parentNumber: row.parent_number,
            gender: row.gender,
            uploadedImage: row.uploaded_image,
            uploadedLogo: row.uploaded_logo,
            createdAt: row.created_at
        });
    } catch (err) {
        console.error('Error updating card:', err);
        res.status(500).json({ error: 'Failed to update card' });
    }
});

// DELETE card
router.delete('/:id', async (req, res) => {
    try {
        const result = await db.query('DELETE FROM cards WHERE id = $1 RETURNING id', [req.params.id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Card not found' });
        }

        res.json({ message: 'Card deleted successfully' });
    } catch (err) {
        console.error('Error deleting card:', err);
        res.status(500).json({ error: 'Failed to delete card' });
    }
});

// POST print card
router.post('/print', async (req, res) => {
    try {
        const { image } = req.body;
        if (!image) {
            return res.status(400).json({ error: 'No image data provided' });
        }

        // Remove header from base64 string
        const base64Data = image.replace(/^data:image\/png;base64,/, "");
        const tempDir = path.join(__dirname, '../../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }

        const filePath = path.join(tempDir, `print_${Date.now()}.png`);
        fs.writeFileSync(filePath, base64Data, 'base64');

        // PowerShell command to print the image
        // Using Start-Process with -Verb Print starts the default printing process for the file type
        const printCommand = `powershell -Command "Start-Process -FilePath '${filePath}' -Verb Print"`;

        exec(printCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Print error: ${error}`);
                return res.status(500).json({ success: false, error: 'Failed to trigger printer' });
            }
            // Optional: Delete the temp file after some time or immediately if print is queued
            setTimeout(() => {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }, 60000); // Wait 1 minute before cleanup

            res.json({ success: true, message: 'Print job sent' });
        });

    } catch (err) {
        console.error('Error in /print route:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST bulk cards (Import)
router.post('/bulk', async (req, res) => {
    const { cards } = req.body;
    if (!cards || !Array.isArray(cards)) {
        return res.status(400).json({ error: 'Invalid data format. Expected an array of cards.' });
    }

    const client = await db.pool.connect(); // Use a single connection for transaction
    try {
        await client.query('BEGIN');

        let count = 0;
        for (const d of cards) {
            const id = uuidv4();
            await client.query(
                `INSERT INTO cards (
                    id, student_name, dob, student_id_value, id_format, student_email, 
                    student_department, address, academic_year, issue_txt, date_of_issue, 
                    exp_txt, date_of_exp, temp2o, country, college, principal_signature, 
                    parent_name, parent_number, gender, uploaded_image, uploaded_logo
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)`,
                [
                    id, d.studentName, d.dob, d.studentId, d.idFormat, d.studentEmail,
                    d.studentDepartment, d.address, d.academicYear, d.issueTxt, d.dateOfIssue,
                    d.expTxt, d.dateOfExp, d.temp2o, d.country, d.college, d.principalSignature,
                    d.parentName, d.parentNumber, d.gender, d.uploadedImage, d.uploadedLogo
                ]
            );
            count++;
        }

        await client.query('COMMIT');
        res.status(201).json({ success: true, count: count });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error during bulk import:', err);
        res.status(500).json({ error: 'Bulk import failed' });
    } finally {
        client.release();
    }
});

module.exports = router;

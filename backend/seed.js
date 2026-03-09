require('dotenv').config();
const db = require('./db');
const { v4: uuidv4 } = require('uuid');

const sampleData = [
    {
        studentName: "ALEX JOHNSON",
        dob: "2002-05-15",
        studentId: "100-200-3000",
        idFormat: "numeric",
        studentEmail: "alex.j@ubuntu.edu",
        studentDepartment: "Piano class",
        address: "123 Music Lane, Kigali",
        academicYear: "2024-2025",
        issueTxt: "Date Of Issue",
        dateOfIssue: "15 AUG 2024",
        expTxt: "Card Expires",
        dateOfExp: "DEC 2025",
        temp2o: "100",
        country: "Rwanda",
        college: "UBUNTU MUSIC PROGRAM",
        principalSignature: "Robert",
        parentName: "John Johnson",
        parentNumber: "0780000001",
        gender: "Male",
        uploadedImage: "/student.png",
        uploadedLogo: "/college_logo.png"
    },
    {
        studentName: "SARAH SMITH",
        dob: "2003-08-22",
        studentId: "100-200-3001",
        idFormat: "numeric",
        studentEmail: "sarah.s@ubuntu.edu",
        studentDepartment: "Vocal class",
        address: "456 Harmony St, Kigali",
        academicYear: "2024-2025",
        issueTxt: "Date Of Issue",
        dateOfIssue: "15 AUG 2024",
        expTxt: "Card Expires",
        dateOfExp: "DEC 2025",
        temp2o: "100",
        country: "Rwanda",
        college: "UBUNTU MUSIC PROGRAM",
        principalSignature: "Robert",
        parentName: "Jane Smith",
        parentNumber: "0780000002",
        gender: "Female",
        uploadedImage: "/student.png",
        uploadedLogo: "/college_logo.png"
    },
    {
        studentName: "DAVID NDAYI",
        dob: "2001-11-30",
        studentId: "100-200-3002",
        idFormat: "numeric",
        studentEmail: "david.n@ubuntu.edu",
        studentDepartment: "Guitar class",
        address: "789 Rhythm Blvd, Kigali",
        academicYear: "2024-2025",
        issueTxt: "Date Of Issue",
        dateOfIssue: "15 AUG 2024",
        expTxt: "Card Expires",
        dateOfExp: "DEC 2025",
        temp2o: "100",
        country: "Rwanda",
        college: "UBUNTU MUSIC PROGRAM",
        principalSignature: "Robert",
        parentName: "Paul Ndayi",
        parentNumber: "0780000003",
        gender: "Male",
        uploadedImage: "/student.png",
        uploadedLogo: "/college_logo.png"
    }
];

const seed = async () => {
    try {
        // We don't drop here because server.js initDB already handles schema migration/dropping for now
        for (const d of sampleData) {
            const id = uuidv4();
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
            console.log(`Inserted: ${d.studentName}`);
        }
        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seed();

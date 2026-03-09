import React, { useRef, useState } from 'react';
import { useToast } from '../context/ToastContext';
import { useModal } from '../context/ModalContext';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { generateCardCanvas } from '../utils/generateCard';

function AllCardsPage({ generatedCards, onBack, onEdit, onDelete }) {
    const { addToast } = useToast();
    const { confirm } = useModal();
    const hiddenCanvasRef = useRef(null);
    const [genderFilter, setGenderFilter] = useState('');
    const [ageFilter, setAgeFilter] = useState('');

    const handleDownload = async (card, index) => {
        const confirmed = await confirm({
            title: 'Download Student Card',
            message: `Do you want to prepare and download the ID card for ${card.studentName}?`,
            icon: '⬇️',
            confirmText: 'Download JPEG',
            cancelText: 'Cancel'
        });

        if (!confirmed) return;

        const canvas = hiddenCanvasRef.current;
        if (!canvas) return;

        // Use Set 1, Template 1 for downloading from the table by default
        await generateCardCanvas(canvas, '/temp1.png', 'set1', card, card.uploadedImage, card.uploadedLogo);

        // Brief delay to ensure canvas buffer is ready
        setTimeout(() => {
            const link = document.createElement('a');
            link.download = `student_card_${index + 1}.jpeg`;
            link.href = canvas.toDataURL('image/jpeg', 1.0);
            link.click();
            addToast('Card download started!', 'info');
        }, 100);
    };

    const handlePrint = async (card) => {
        const confirmed = await confirm({
            title: 'Direct Print ID Card',
            message: `Prepare ${card.studentName}'s card and send directly to your default printer?`,
            icon: '🖨️',
            confirmText: 'Print Now',
            cancelText: 'Cancel'
        });

        if (!confirmed) return;

        const canvas = hiddenCanvasRef.current;
        if (!canvas) return;

        // Generate the card on the hidden high-res canvas (1004x638)
        await generateCardCanvas(canvas, '/temp1.png', 'set1', card, card.uploadedImage, card.uploadedLogo);

        setTimeout(async () => {
            const imageData = canvas.toDataURL('image/png');
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cards/print`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: imageData })
                });
                const result = await response.json();
                if (result.success) {
                    addToast('Print job sent successfully!', 'success');
                } else {
                    addToast('Failed to print: ' + result.error, 'error');
                }
            } catch (err) {
                console.error('Print error:', err);
                addToast('Error sending print job to backend.', 'error');
            }
        }, 100);
    };

    const handleExportExcel = async () => {
        const confirmed = await confirm({
            title: 'Export to Excel',
            message: `Do you want to export the current student records (${filteredCards.length} rows) to an Excel spreadsheet?`,
            icon: '📊',
            confirmText: 'Export Now',
            cancelText: 'Cancel'
        });

        if (!confirmed) return;

        const worksheet = XLSX.utils.json_to_sheet(filteredCards.map(card => ({
            'Student ID': card.studentId,
            'Name': card.studentName,
            'DOB': card.dob,
            'Gender': card.gender,
            'Email': card.studentEmail,
            'Department': card.studentDepartment,
            'Academic Year': card.academicYear,
            'Address': card.address,
            'Parent Name': card.parentName,
            'Parent Number': card.parentNumber,
            'Country': card.country,
            'College': card.college,
            'Issue Date': card.dateOfIssue,
            'Expiry Date': card.dateOfExp
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
        XLSX.writeFile(workbook, "Student_Records.xlsx");
        addToast('Excel export successful!', 'success');
    };

    const handleExportPDF = async () => {
        const confirmed = await confirm({
            title: 'Generate PDF Report',
            message: `Are you sure you want to create a professional PDF table report for the current filtered records?`,
            icon: '📄',
            confirmText: 'Generate PDF',
            cancelText: 'Cancel'
        });

        if (!confirmed) return;

        try {
            const doc = new jsPDF('l', 'mm', 'a4');
            doc.text("Student Records Report", 14, 15);

            const tableColumn = ["ID", "Name", "DOB", "Gender", "Email", "Dept", "College", "Parent Name", "Parent No."];
            const tableRows = filteredCards.map(card => [
                card.studentId || '',
                card.studentName || '',
                card.dob || '',
                card.gender || '',
                card.studentEmail || '',
                card.studentDepartment || '',
                card.college || '',
                card.parentName || '',
                card.parentNumber || ''
            ]);

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 20,
                theme: 'grid',
                headStyles: { fillColor: [244, 82, 69] }
            });

            doc.save("Student_Records_Report.pdf");
            addToast('PDF report generated!', 'success');
        } catch (err) {
            console.error('PDF Export Error:', err);
            addToast('Failed to generate PDF: ' + err.message, 'error');
        }
    };

    const handleImportExcel = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            const confirmed = await confirm({
                title: 'Confirm Bulk Import',
                message: `About to import ${jsonData.length} student records from the selected file. Continue?`,
                icon: '📥',
                confirmText: 'Import Records',
                cancelText: 'Cancel'
            });

            if (!confirmed) return;

            // Map Excel headers to our frontend field names
            const mappedData = jsonData.map(item => ({
                studentId: item['Student ID'] || item.studentId || '',
                studentName: item['Name'] || item.studentName || '',
                dob: item['DOB'] || item.dob || '',
                gender: item['Gender'] || item.gender || '',
                studentEmail: item['Email'] || item.studentEmail || '',
                studentDepartment: item['Department'] || item.studentDepartment || item.dept || '',
                academicYear: item['Academic Year'] || item.academicYear || '',
                address: item['Address'] || item.address || '',
                parentName: item['Parent Name'] || item.parentName || '',
                parentNumber: item['Parent Number'] || item.parentNumber || '',
                country: item['Country'] || item.country || 'USA',
                college: item['College'] || item.college || '',
                dateOfIssue: item['Issue Date'] || item.dateOfIssue || '',
                dateOfExp: item['Expiry Date'] || item.dateOfExp || '',
                idFormat: 'numeric',
                issueTxt: 'Date Of Issue',
                expTxt: 'Card Expires',
                temp2o: '0.1',
                uploadedImage: '/student.png',
                uploadedLogo: '/college_logo.png'
            }));

            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cards/bulk`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cards: mappedData })
                });
                const result = await response.json();
                if (result.success) {
                    addToast(`Successfully imported ${result.count} records!`, 'success');
                    setTimeout(() => window.location.reload(), 2000); // Delay reload to see toast
                } else {
                    addToast('Import failed: ' + result.error, 'error');
                }
            } catch (err) {
                console.error('Import error:', err);
                addToast('Error connecting to backend for import.', 'error');
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const filteredCards = generatedCards.filter(card => {
        let matchGender = true;
        if (genderFilter) matchGender = card.gender === genderFilter;

        let matchAge = true;
        if (ageFilter) {
            const ageInput = ageFilter.toLowerCase();
            const date = new Date(card.dob);
            if (!isNaN(date)) {
                const ageDifMs = Date.now() - date.getTime();
                const ageDate = new Date(ageDifMs);
                const age = Math.abs(ageDate.getUTCFullYear() - 1970).toString();
                matchAge = (age === ageInput) || (card.dob && card.dob.toLowerCase().includes(ageInput));
            } else {
                matchAge = card.dob && card.dob.toLowerCase().includes(ageInput);
            }
        }
        return matchGender && matchAge;
    });

    return (
        <div className="all-cards-page">
            <header className="all-cards-header">
                <h1>📇 Student Record Management</h1>
                <p>History of all generated student ID cards</p>
            </header>

            <div className="all-cards-container">
                <div className="all-cards-toolbar">
                    <h2>Generated Cards <span>({generatedCards.length})</span></h2>
                    <div className="all-cards-filters" style={{ display: 'flex', gap: '15px' }}>
                        <select
                            value={genderFilter}
                            onChange={e => setGenderFilter(e.target.value)}
                            className="filter-input input"
                            style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-color)', outline: 'none' }}
                        >
                            <option value="" style={{ color: 'black' }}>All Genders</option>
                            <option value="Male" style={{ color: 'black' }}>Male</option>
                            <option value="Female" style={{ color: 'black' }}>Female</option>
                            <option value="Other" style={{ color: 'black' }}>Other</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Filter by Age/DOB..."
                            value={ageFilter}
                            onChange={e => setAgeFilter(e.target.value)}
                            className="filter-input input"
                            style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-color)', outline: 'none' }}
                        />
                        <button onClick={handleExportExcel} className="action-btn" style={{ padding: '8px 12px', borderRadius: '8px', background: '#217346', color: 'white', border: 'none', cursor: 'pointer' }} title="Export to Excel">📊 Excel</button>
                        <button onClick={handleExportPDF} className="action-btn" style={{ padding: '8px 12px', borderRadius: '8px', background: '#F44336', color: 'white', border: 'none', cursor: 'pointer' }} title="Export to PDF">📄 PDF</button>
                        <label className="action-btn" style={{ padding: '8px 12px', borderRadius: '8px', background: '#2196F3', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Import from Excel">
                            📥 Import
                            <input type="file" accept=".xlsx, .xls, .csv" style={{ display: 'none' }} onChange={handleImportExcel} />
                        </label>
                    </div>
                    <button
                        onClick={onBack}
                        className="back-btn"
                    >
                        ← Back to Generator
                    </button>
                </div>

                {generatedCards.length === 0 ? (
                    <div className="all-cards-empty">
                        <p>No cards have been generated yet. Go back to create some!</p>
                        <button onClick={onBack} className="back-btn" style={{ margin: '0 auto' }}>
                            Go Create Cards
                        </button>
                    </div>
                ) : (
                    <div className="all-cards-table-wrapper">
                        <table className="all-cards-table">
                            <thead>
                                <tr>
                                    <th>Photo</th>
                                    <th>Student ID</th>
                                    <th>Name</th>
                                    <th>DOB</th>
                                    <th>Gender</th>
                                    <th>Email</th>
                                    <th>Department</th>
                                    <th>Address</th>
                                    <th>Academic Year</th>
                                    <th>Parent Name</th>
                                    <th>Parent Number</th>
                                    <th>Country</th>
                                    <th>College</th>
                                    <th>Issue Date</th>
                                    <th>Expire Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCards.map((card, index) => (
                                    <tr key={index}>
                                        <td>
                                            <img
                                                src={card.uploadedImage}
                                                alt={card.studentName}
                                                style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%', display: 'block' }}
                                                onError={(e) => { e.target.src = '/student.png'; }}
                                            />
                                        </td>
                                        <td className="student-id-cell">{card.studentId}</td>
                                        <td>{card.studentName}</td>
                                        <td>{card.dob}</td>
                                        <td>{card.gender}</td>
                                        <td>{card.studentEmail}</td>
                                        <td>{card.studentDepartment}</td>
                                        <td>{card.address}</td>
                                        <td>{card.academicYear}</td>
                                        <td>{card.parentName}</td>
                                        <td>{card.parentNumber}</td>
                                        <td>{card.country}</td>
                                        <td>{card.college === 'custom' ? card.customCollege : card.college}</td>
                                        <td>{card.dateOfIssue}</td>
                                        <td>{card.dateOfExp}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button onClick={() => handlePrint(card)} className="action-btn print-btn-sm" title="Print Directly">🖨️</button>
                                                <button onClick={() => handleDownload(card, index)} className="action-btn download-btn-sm" title="Download">⬇️</button>
                                                <button onClick={() => onEdit(index)} className="action-btn edit-btn-sm" title="Edit">✏️</button>
                                                <button onClick={() => onDelete(index)} className="action-btn delete-btn-sm" title="Delete">🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <canvas ref={hiddenCanvasRef} width="1004" height="638" style={{ display: 'none' }}></canvas>
        </div>
    );
}

export default AllCardsPage;

import React, { useState, useEffect, useRef } from 'react';
import { useToast } from './context/ToastContext';
import { useModal } from './context/ModalContext';
import './App.css';

// Components
import Header from './components/Header';
import AllCardsPage from './components/AllCardsPage';
import FormPanel from './components/FormPanel';
import PreviewPanel from './components/PreviewPanel';

function App() {
    const { addToast } = useToast();
    const { confirm } = useModal();
    const [currentView, setCurrentView] = useState('home');
    const [generatedCards, setGeneratedCards] = useState([]);
    const [uploadedImage, setUploadedImage] = useState('/student.png');
    const [uploadedLogo, setUploadedLogo] = useState('/college_logo.png');
    const [editingIndex, setEditingIndex] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        studentName: 'Alex Thomas',
        dob: '2001-01-25',
        studentId: '202535592',
        idFormat: 'numeric',
        studentEmail: '',
        studentDepartment: '',
        address: 'Nilkhet Road, Dhaka 1000, Bangladesh',
        academicYear: 'Fall 2024',
        issueTxt: 'Date Of Issue',
        dateOfIssue: '15 AUG 2025',
        expTxt: 'Card Expires',
        dateOfExp: 'DEC 2028',
        temp2o: '0.0',
        country: 'Rwanda',
        college: 'UBUNTU MUSIC PROGRAM',
        principalSignature: 'Robert',
        parentName: '',
        parentNumber: '',
        gender: '',
    });

    const [colleges, setColleges] = useState({});
    const [countryOptions, setCountryOptions] = useState([]);

    // Slider states
    const [currentSlide1, setCurrentSlide1] = useState(0);
    const [currentSlide2, setCurrentSlide2] = useState(0);

    // Load initial data
    useEffect(() => {
        // Generate initial ID & Email
        const initialId = generateStudentId('numeric');
        setFormData(prev => ({
            ...prev,
            studentId: initialId,
            studentEmail: generateEduEmail(initialId),
            academicYear: generateAcademicYear()
        }));

        // Fetch college data
        fetch('/collegeWa.json')
            .then(res => res.json())
            .then(data => {
                setColleges(data);
                setCountryOptions(['Rwanda']);
            })
            .catch(err => console.error("Failed to load colleges", err));

        // Fetch generated cards from backend
        fetchCards();
    }, []);

    const fetchCards = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cards`);
            if (res.ok) {
                const data = await res.json();
                setGeneratedCards(data);
            }
        } catch (err) {
            console.error("Failed to fetch cards:", err);
        }
    };

    // Helpers
    const generateStudentId = (format = 'numeric') => {
        if (format === 'numeric') {
            const p1 = Math.floor(Math.random() * 900 + 100);
            const p2 = Math.floor(Math.random() * 900 + 100);
            const p3 = Math.floor(Math.random() * 9000 + 1000);
            return `${p1}-${p2}-${p3}`;
        } else {
            const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let res = '';
            for (let i = 0; i < 3; i++) res += letters.charAt(Math.floor(Math.random() * letters.length));
            for (let i = 0; i < 9; i++) res += Math.floor(Math.random() * 10);
            return res;
        }
    };

    const generateEduEmail = (id) => {
        const cleanId = id.replace(/[^a-zA-Z0-9]/g, '');
        const domains = ['@university.edu', '@du.edu', '@college.edu', '@campus.edu', '@institute.edu', '@academy.edu'];
        return cleanId + domains[Math.floor(Math.random() * domains.length)];
    };

    const generateAcademicYear = () => {
        const year = new Date().getFullYear();
        return `${year}-${year + 3}`;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormatChange = (format) => {
        const newId = generateStudentId(format);
        setFormData(prev => ({
            ...prev,
            idFormat: format,
            studentId: newId,
            studentEmail: generateEduEmail(newId)
        }));
    };

    const handleCountryChange = (e) => {
        const country = e.target.value;
        setFormData(prev => ({ ...prev, country, college: '', address: '' }));
    };

    const handleCollegeChange = (e) => {
        const collegeName = e.target.value;
        let newAddress = '';

        if (collegeName !== 'custom' && formData.country && colleges[formData.country]) {
            const collegeObj = colleges[formData.country].find(c => c.name === collegeName);
            if (collegeObj) newAddress = collegeObj.address;
        }

        setFormData(prev => ({ ...prev, college: collegeName, address: newAddress }));
    };

    const handleImageUpload = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (type === 'student') setUploadedImage(event.target.result);
                if (type === 'logo') setUploadedLogo(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = (type) => {
        if (type === 'student') setUploadedImage('/student.png');
        if (type === 'logo') setUploadedLogo('/college_logo.png');
    };

    const getEffectiveCollegeName = () => {
        return formData.college || "UBUNTU MUSIC PROGRAM";
    };

    const splitSchoolName = (name) => {
        name = name.trim();
        if (name.length <= 16) return [name];
        const words = name.split(' ');
        if (words.length === 1) return [name];
        const firstTwoWordsLen = words[0].length + 1 + words[1].length;
        if (firstTwoWordsLen > 16) {
            return [words[0] + ' ' + words[1], words.slice(2).join(' ')];
        } else {
            let line1 = words[0];
            let idx = 1;
            while (idx < words.length && (line1.length + 1 + words[idx].length) <= 16) {
                line1 += ' ' + words[idx];
                idx++;
            }
            return [line1, words.slice(idx).join(' ')];
        }
    };

    const handleResetForm = () => {
        const newId = generateStudentId(formData.idFormat);
        setFormData({
            studentName: '',
            dob: '',
            studentId: newId,
            idFormat: formData.idFormat,
            studentEmail: generateEduEmail(newId),
            studentDepartment: '',
            address: '',
            academicYear: generateAcademicYear(),
            issueTxt: 'Date Of Issue',
            dateOfIssue: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
            expTxt: 'Card Expires',
            dateOfExp: `DEC ${new Date().getFullYear() + 4}`,
            temp2o: '0.0',
            country: formData.country || 'Rwanda',
            college: formData.college || '',
            principalSignature: 'Robert',
            parentName: '',
            parentNumber: '',
            gender: '',
        });
        setUploadedImage('/student.png');
        setUploadedLogo('/college_logo.png');
        setEditingIndex(null);
    };

    // Rendering Maps logic for canvas components goes here
    const [renderTrigger, setRenderTrigger] = useState(0);

    useEffect(() => {
        const initRender = async () => {
            try {
                await document.fonts.load('italic 38px "Alex Brush"');
            } catch (e) {
                console.warn(e);
            }
            setRenderTrigger(prev => prev + 1);
        };
        initRender();
    }, []);

    const generateCards = async () => {
        const isEditing = editingIndex !== null;
        const confirmed = await confirm({
            title: isEditing ? 'Update Student Record' : 'Generate Student ID',
            message: isEditing
                ? 'Are you sure you want to save the changes to this student record?'
                : 'Are you sure you want to generate a new student ID card with the provided information?',
            icon: isEditing ? '📝' : '✨',
            confirmText: isEditing ? 'Update Record' : 'Generate Now',
            cancelText: 'Cancel'
        });

        if (!confirmed) return;

        const payload = { ...formData, uploadedImage, uploadedLogo };

        try {
            if (editingIndex !== null) {
                const cardId = generatedCards[editingIndex].id;

                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cards/${cardId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    const updatedCard = await res.json();
                    setGeneratedCards(prev => {
                        const newCards = [...prev];
                        newCards[editingIndex] = updatedCard;
                        return newCards;
                    });
                    addToast('Card updated successfully!', 'success');
                    handleResetForm();
                }
                setEditingIndex(null);
            } else {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cards`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    const newCard = await res.json();
                    setGeneratedCards(prev => [...prev, newCard]);
                    addToast('New card generated successfully!', 'success');
                    handleResetForm();
                }
            }
        } catch (err) {
            console.error('Failed to save card:', err);
            addToast('Failed to save card. Please ensure the backend is running.', 'error');
        }

        setRenderTrigger(prev => prev + 1);
    };

    const handleEditCard = (index) => {
        const cardToEdit = generatedCards[index];
        const { uploadedImage: img, uploadedLogo: logo, ...restForm } = cardToEdit;
        setFormData(restForm);
        if (img) setUploadedImage(img);
        if (logo) setUploadedLogo(logo);
        setEditingIndex(index);
        setCurrentView('home');
    };

    const handleDeleteCard = async (index) => {
        const confirmed = await confirm({
            title: 'Delete Student Record',
            message: 'Are you sure you want to delete this student record? This action cannot be undone and the card will be removed from the database.',
            icon: '🗑️',
            confirmText: 'Delete Forever',
            cancelText: 'Keep Record'
        });

        if (confirmed) {
            const cardId = generatedCards[index].id;

            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cards/${cardId}`, {
                    method: 'DELETE'
                });

                if (res.ok) {
                    setGeneratedCards(prev => prev.filter((_, i) => i !== index));
                    addToast('Record deleted successfully.', 'success');
                }
            } catch (err) {
                console.error('Failed to delete card:', err);
                addToast('Failed to delete card.', 'error');
            }
        }
    };

    return (
        <div className="app-root">
            <Header setView={setCurrentView} />

            {currentView === 'home' ? (
                <div className="container">
                    <div className="page-title">
                        <h1>Student ID Card Generator</h1>
                    </div>

                    <div className="left-column">
                        <FormPanel
                            formData={formData}
                            onInputChange={handleInputChange}
                            onFormatChange={handleFormatChange}
                            onCountryChange={handleCountryChange}
                            countryOptions={countryOptions}
                            colleges={colleges}
                            uploadedImage={uploadedImage}
                            uploadedLogo={uploadedLogo}
                            onImageUpload={handleImageUpload}
                            onClearImage={clearImage}
                            onGenerate={generateCards}
                            isEditing={editingIndex !== null}
                        />
                    </div>

                    <div className="right-column">
                        <PreviewPanel
                            renderTrigger={renderTrigger}
                            formData={{ ...formData, effectiveCollegeName: getEffectiveCollegeName() }}
                            uploadedImage={uploadedImage}
                            uploadedLogo={uploadedLogo}
                            splitSchoolName={splitSchoolName}
                            currentSlide1={currentSlide1} setCurrentSlide1={setCurrentSlide1}
                            currentSlide2={currentSlide2} setCurrentSlide2={setCurrentSlide2}
                        />
                    </div>
                </div>
            ) : (
                <AllCardsPage
                    generatedCards={generatedCards}
                    onBack={() => setCurrentView('home')}
                    onEdit={handleEditCard}
                    onDelete={handleDeleteCard}
                />
            )}

        </div>
    );
}

export default App;

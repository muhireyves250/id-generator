import React from 'react';

function FormPanel({
    formData, onInputChange, onFormatChange, onCountryChange,
    countryOptions, colleges, uploadedImage, uploadedLogo, onImageUpload, onClearImage, onGenerate, isEditing
}) {

    return (
        <div className="form-container">
            <h2 className="section-title">Student Details</h2>

            <div className="form-grid">
                <div className="photo-upload">
                    <label>Student Photo</label>
                    <div className="photo-container" id="photoContainer" onClick={() => document.getElementById('fileInput').click()}>
                        <img src={uploadedImage} alt="Student Photo" id="studentPhoto" />
                        <div className="photo-overlay">
                            <span>Click to Upload</span>
                        </div>
                        {uploadedImage !== '/student.png' && (
                            <button className="clear-btn show" id="clearBtn" onClick={(e) => { e.stopPropagation(); onClearImage('student'); }}>×</button>
                        )}
                    </div>
                    <input type="file" id="fileInput" accept="image/*" style={{ display: 'none' }} onChange={(e) => onImageUpload(e, 'student')} />
                </div>

                <div className="photo-upload">
                    <label>College Logo</label>
                    <div className="photo-container" id="logoContainer" onClick={() => document.getElementById('logoFileInput').click()}>
                        <img src={uploadedLogo} alt="College Logo" id="collegeLogo" />
                        <div className="photo-overlay">
                            <span>Click to Upload</span>
                        </div>
                        {uploadedLogo !== '/college_logo.png' && (
                            <button className="clear-btn show" id="clearLogoBtn" onClick={(e) => { e.stopPropagation(); onClearImage('logo'); }}>×</button>
                        )}

                    </div>
                    <input type="file" id="logoFileInput" accept="image/*" style={{ display: 'none' }} onChange={(e) => onImageUpload(e, 'logo')} />
                </div>

                <div className="form-group">
                    <label htmlFor="studentName">Student Name</label>
                    <input type="text" id="studentName" name="studentName" placeholder="Enter student name" value={formData.studentName} onChange={onInputChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="dob">Date of Birth</label>
                    <input type="text" id="dob" name="dob" value={formData.dob} onChange={onInputChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <select id="gender" name="gender" value={formData.gender} onChange={onInputChange}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="studentId">
                        Student ID
                        <span className="id-format-toggle">
                            <button className={`format-btn ${formData.idFormat === 'numeric' ? 'active' : ''}`} id="formatNumeric" title="Numeric Format (123-456-7890)" onClick={() => onFormatChange('numeric')}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <text x="2" y="18" fontSize="16" fontWeight="bold">123</text>
                                </svg>
                            </button>
                            <button className={`format-btn ${formData.idFormat === 'alphanumeric' ? 'active' : ''}`} id="formatAlpha" title="Alphanumeric Format (ABC1234567890)" onClick={() => onFormatChange('alphanumeric')}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <text x="0" y="18" fontSize="14" fontWeight="bold">A1</text>
                                </svg>
                            </button>
                        </span>
                    </label>
                    <input type="text" id="studentId" name="studentId" value={formData.studentId} onChange={onInputChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="studentEmail">Student Email</label>
                    <input type="text" id="studentEmail" name="studentEmail" placeholder="Enter student Email" value={formData.studentEmail} onChange={onInputChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="studentDepartment">Student Department</label>
                    <select id="studentDepartment" name="studentDepartment" value={formData.studentDepartment} onChange={onInputChange}>
                        <option value="">Select Department/Class</option>
                        <option value="Piano class">Piano class</option>
                        <option value="Guitar class">Guitar class</option>
                        <option value="Bass guitar class">Bass guitar class</option>
                        <option value="Drums class">Drums class</option>
                        <option value="Vocal class">Vocal class</option>
                        <option value="Traditional Vocal class">Traditional Vocal class</option>
                        <option value="Djembe class">Djembe class</option>
                        <option value="Traditional Dance class">Traditional Dance class</option>
                        <option value="Fashion & Modeling class">Fashion & Modeling class</option>
                        <option value="English Program class">English Program class</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="parentName">Parent/Guardian Name</label>
                    <input type="text" id="parentName" name="parentName" placeholder="Enter parent name" value={formData.parentName} onChange={onInputChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="parentNumber">Parent Contact Number</label>
                    <input type="text" id="parentNumber" name="parentNumber" placeholder="Enter parent phone number" value={formData.parentNumber} onChange={onInputChange} />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label htmlFor="address">Address</label>
                    <textarea id="address" name="address" placeholder="Enter student address" value={formData.address} onChange={onInputChange}></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="academicYear">Academic Year</label>
                    <input type="text" id="academicYear" name="academicYear" value={formData.academicYear} onChange={onInputChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="issueTxt">Issue Text</label>
                    <input type="text" id="issueTxt" name="issueTxt" value={formData.issueTxt} onChange={onInputChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="dateOfIssue">Issue Date</label>
                    <input type="text" id="dateOfIssue" name="dateOfIssue" value={formData.dateOfIssue} onChange={onInputChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="expTxt">Expire Text</label>
                    <input type="text" id="expTxt" name="expTxt" value={formData.expTxt} onChange={onInputChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="dateOfExp">Date of Expire</label>
                    <input type="text" id="dateOfExp" name="dateOfExp" value={formData.dateOfExp} onChange={onInputChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="temp2o">Center Icon Opacity</label>
                    <input type="text" id="temp2o" name="temp2o" value={formData.temp2o} onChange={onInputChange} />
                </div>
            </div>

            <h2 className="section-title">Other Details</h2>

            <div className="form-grid">
                <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <select id="country" name="country" value={formData.country} onChange={onCountryChange} disabled>
                        {countryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div className="form-group" id="collegeGroup">
                    <label htmlFor="college">College</label>
                    <input type="text" id="college" name="college" value={formData.college} onChange={onInputChange} />
                </div>

                {formData.country && (
                    <div className="form-group" id="signatureGroup">
                        <label htmlFor="principalSignature">Principal Signature</label>
                        <input type="text" id="principalSignature" name="principalSignature" value={formData.principalSignature} onChange={onInputChange} />
                    </div>
                )}
            </div>

            <button className="generate-btn" id="generateBtn" onClick={onGenerate}>
                <span style={{ position: 'relative', zIndex: 1 }}>{isEditing ? 'Update Card' : 'Generate Cards'}</span>
            </button>
        </div>
    );
}

export default FormPanel;

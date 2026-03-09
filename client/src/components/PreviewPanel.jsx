import React, { useEffect, useRef } from 'react';

function PreviewPanel({
    renderTrigger,
    formData,
    uploadedImage,
    uploadedLogo,
    splitSchoolName,
    currentSlide1, setCurrentSlide1,
    currentSlide2, setCurrentSlide2
}) {
    const canvasRefs1 = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
    const canvasRefs2 = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
    const canvasRefs5 = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

    const lastRenderId = useRef(0);

    const loadImage = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = (err) => reject(err);
            img.src = src;
        });
    };

    const generateCard = async (canvas, templateSrc, set, currentRenderId) => {
        if (!canvas) return;

        const targetWidth = 1004;
        const targetHeight = 638;
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const scaleX = targetWidth / 1280;
        const scaleY = targetHeight / 804;

        try {
            const templateImage = await loadImage(templateSrc);
            if (currentRenderId !== lastRenderId.current) return;

            ctx.save();
            ctx.scale(scaleX, scaleY);
            ctx.drawImage(templateImage, 0, 0, 1280, 804);

            const collegeLogo = await loadImage(uploadedLogo || '/college_logo.png');
            if (currentRenderId !== lastRenderId.current) return;

            if (set === 'set2') {
                ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                ctx.shadowBlur = 4;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;
                ctx.drawImage(collegeLogo, 433, 177, 102, 102);
            } else {
                ctx.drawImage(collegeLogo, 15, 49, 165, 165);
            }

            const studentPhoto = await loadImage(uploadedImage || '/student.png');
            if (currentRenderId !== lastRenderId.current) return;

            const x = set === 'set2' ? 67 : 155;
            const y = set === 'set2' ? 179 : 227;
            const size = set === 'set2' ? 282 : 348;
            const radius = size / 2;

            ctx.save();
            ctx.beginPath();
            ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(studentPhoto, x, y, size, size);
            ctx.restore();

            // Draw center watermark
            const centerIcon = await loadImage(uploadedLogo || '/college_logo.png');
            if (currentRenderId !== lastRenderId.current) return;

            ctx.save();
            let temp2o = formData.temp2o;
            ctx.globalAlpha = set === 'set2' ? parseFloat(temp2o) : 0.1 || parseFloat(temp2o);
            const iconWidth = 620;
            const iconHeight = 620;
            const centerX = (1280 - iconWidth) / 2;
            const centerY = (804 - iconHeight) / 2;
            ctx.drawImage(centerIcon, centerX, centerY, iconWidth, iconHeight);
            ctx.restore();

            // Text drawing logic
            if (set === 'set2') {
                ctx.fillStyle = '#FFFFFF';
                ctx.font = 'bold 52px Arial';
                ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                ctx.shadowBlur = 4;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;

                ctx.fillText((formData.studentName || 'Mark Zuckerberg').toUpperCase(), 85, 750);

                ctx.fillStyle = '#FFFFFF';
                ctx.font = 'bold 40px Arial';
                ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                ctx.shadowBlur = 4;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;

                ctx.fillText(formData.dob || 'January 25, 2001', 715, 428);
                ctx.fillText(formData.studentId || '250-456-2000', 715, 359);

                const address = formData.address || '628, Kanaikhali, Natore';
                ctx.fillText(address.substring(0, 30), 715, 490);

                const department = formData.studentDepartment || 'Mechanical Engineering';
                ctx.fillText(department.substring(0, 30), 715, 521);

                ctx.fillText(formData.academicYear || '2025-2028', 715, 553);
                ctx.fillText(formData.dateOfExp || '31 DEC 2028', 715, 620);

                ctx.fillStyle = '#FFFFFF';
                ctx.font = 'bold 30px Arial';
                ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                ctx.shadowBlur = 4;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;
                ctx.fillText(formData.dateOfIssue || '15 AUG 2025', 1050, 80);

                ctx.fillStyle = '#FFFFFF';
                ctx.font = 'bold 40px Arial';
                ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                ctx.shadowBlur = 4;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;
                ctx.fillText(formData.issueTxt || 'Date Of Issue', 1005, 40);
            } else {
                ctx.fillStyle = '#F45245';
                ctx.font = 'bold 52px Arial';
                ctx.fillText((formData.studentName || 'Mark Zuckerberg').toUpperCase(), 625, 402);

                ctx.fillStyle = '#000000';
                ctx.font = 'bold 31px Arial';
                ctx.fillText(formData.dob || 'January 25, 2001', 808, 512);
                ctx.fillText(formData.studentId || '250-456-2000', 810, 462);

                const address = formData.address || '628, Kanaikhali, Natore';
                ctx.fillText(address.substring(0, 30), 810, 557);

                const department = formData.studentDepartment || 'Mechanical Engineering';
                ctx.fillText(department.substring(0, 30), 810, 590);

                ctx.fillStyle = '#F45245';
                ctx.font = 'bold 45px Arial';
                ctx.fillText(formData.academicYear || '2025-2028', 665, 694);

                ctx.fillStyle = '#FFFFFF';
                ctx.font = 'bold 30px Arial';
                ctx.fillText(formData.dateOfIssue || '15 AUG 2025', 1050, 80);
                ctx.fillText(formData.dateOfExp || '31 DEC 2028', 65, 785);

                ctx.fillStyle = '#FFFFFF';
                ctx.font = 'bold 40px Arial';
                ctx.fillText(formData.issueTxt || 'Date Of Issue', 1005, 40);
                ctx.font = 'bold 34px Arial';
                ctx.fillText(formData.expTxt || 'Card Expires', 10, 745);
            }

            ctx.fillStyle = set === 'set2' ? '#FFFFFF' : '#000000';
            ctx.font = 'bold 32px Arial';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;

            const college = (formData.effectiveCollegeName || "Custom College").toUpperCase();
            const words = college.split(' ');
            let line1 = '';
            let line2 = '';
            let line1Full = false;

            for (let word of words) {
                if (!line1Full) {
                    const testLine = line1 ? line1 + ' ' + word : word;
                    if (testLine.length <= 28) {
                        line1 = testLine;
                    } else {
                        line1Full = true;
                        line2 = word;
                    }
                } else {
                    line2 += (line2 ? ' ' : '') + word;
                }
            }

            const xOffset = set === 'set2' ? 380 : 0;
            const yOffset = set === 'set2' ? 110 : 0;

            if (!line2) {
                ctx.fillText(line1, 165 + xOffset, 130 + yOffset);
            } else {
                ctx.fillText(line1, 158 + xOffset, 112 + yOffset);
                const secondLineWords = line2.trim().split(' ');
                if (secondLineWords.length === 1) {
                    ctx.fillText(line2, 300 + xOffset, 149 + yOffset);
                } else {
                    ctx.fillText(line2, 200 + xOffset, 149 + yOffset);
                }
            }

            const signature = formData.principalSignature;
            if (signature) {
                ctx.font = 'italic 38px "Alex Brush"';
                ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                ctx.shadowBlur = 4;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;
                const sigX = set === 'set2' ? 955 : 1047;
                const sigY = set === 'set2' ? 700 : 693;
                ctx.fillText(signature || 'Elon Musk', sigX, sigY);
            }

            ctx.restore(); // Restore from scale
        } catch (err) {
            console.error('Render Error:', err);
        }
    };


    useEffect(() => {
        if (renderTrigger === 0) return;

        lastRenderId.current += 1;
        const currentId = lastRenderId.current;

        const templates1 = ['/temp1.png', '/temp2.png', '/temp3.png', '/temp4.png', '/temp5.png', '/temp6.png'];
        templates1.forEach((template, i) => generateCard(canvasRefs1[i].current, template, 'set1', currentId));

        const templates2 = ['/temp2_1.png', '/temp2_2.png', '/temp2_3.png', '/temp2_4.png', '/temp2_5.png', '/temp2_6.png'];
        templates2.forEach((template, i) => generateCard(canvasRefs2[i].current, template, 'set2', currentId));

        // D2 handling logic goes to the HiddenTemplates components
    }, [renderTrigger]);

    const downloadCard = (canvasRef, prefix, idx) => {
        if (!canvasRef.current) return;
        const link = document.createElement('a');
        link.download = `${prefix}_${idx + 1}.jpeg`;
        link.href = canvasRef.current.toDataURL('image/jpeg', 1.0);
        link.click();
    };

    return (
        <>
            <div className="preview-container">
                <h2 className="preview-title">Template S1</h2>
                <div className="card-counter">Card {currentSlide1 + 1} of 6</div>

                <div className="slider-container">
                    <button className="slider-nav prev" onClick={() => setCurrentSlide1(p => Math.max(0, p - 1))} disabled={currentSlide1 === 0}>‹</button>
                    <div className="slider-wrapper" style={{ transform: `translateX(-${currentSlide1 * 100}%)` }}>
                        {canvasRefs1.map((ref, i) => (
                            <canvas key={i} ref={ref} className={`previewCanvas ${currentSlide1 === i ? 'active' : ''}`} width="1004" height="638"></canvas>
                        ))}
                    </div>
                    <button className="slider-nav next" onClick={() => setCurrentSlide1(p => Math.min(5, p + 1))} disabled={currentSlide1 === 5}>›</button>
                </div>

                <div className="slider-dots">
                    {[0, 1, 2, 3, 4, 5].map(i => (
                        <span key={i} className={`slider-dot ${currentSlide1 === i ? 'active' : ''}`} onClick={() => setCurrentSlide1(i)}></span>
                    ))}
                </div>
                <div>
                    <button className="download-btn" onClick={() => downloadCard(canvasRefs1[currentSlide1], 'student_id_card_set1', currentSlide1)}>Download</button>
                </div>
            </div>

            <div className="preview-container">
                <h2 className="preview-title">Template S2</h2>
                <div className="card-counter">Card {currentSlide2 + 1} of 6</div>

                <div className="slider-container">
                    <button className="slider-nav prev" onClick={() => setCurrentSlide2(p => Math.max(0, p - 1))} disabled={currentSlide2 === 0}>‹</button>
                    <div className="slider-wrapper" style={{ transform: `translateX(-${currentSlide2 * 100}%)` }}>
                        {canvasRefs2.map((ref, i) => (
                            <canvas key={i} ref={ref} className={`previewCanvas ${currentSlide2 === i ? 'active' : ''}`} width="1004" height="638"></canvas>
                        ))}
                    </div>
                    <button className="slider-nav next" onClick={() => setCurrentSlide2(p => Math.min(5, p + 1))} disabled={currentSlide2 === 5}>›</button>
                </div>

                <div className="slider-dots">
                    {[0, 1, 2, 3, 4, 5].map(i => (
                        <span key={i} className={`slider-dot ${currentSlide2 === i ? 'active' : ''}`} onClick={() => setCurrentSlide2(i)}></span>
                    ))}
                </div>
                <div>
                    <button className="download-btn" onClick={() => downloadCard(canvasRefs2[currentSlide2], 'student_id_card_set2', currentSlide2)}>Download</button>
                </div>
            </div>
        </>
    );
}

export default PreviewPanel;

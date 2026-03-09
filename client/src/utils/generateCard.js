const loadImage = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = src;
    });
};

export const generateCardCanvas = async (canvas, templateSrc, set, formData, uploadedImage, uploadedLogo) => {
    const targetWidth = 1004;
    const targetHeight = 638;

    // Set internal canvas resolution for export
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Scaling factor from original 1280x804 coordinates
    const scaleX = targetWidth / 1280;
    const scaleY = targetHeight / 804;

    try {
        const templateImage = await loadImage(templateSrc);

        ctx.save();
        ctx.scale(scaleX, scaleY);
        ctx.drawImage(templateImage, 0, 0, 1280, 804);

        const collegeLogo = await loadImage(uploadedLogo || '/college_logo.png');
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

        const centerIcon = await loadImage(uploadedLogo || '/college_logo.png');
        ctx.save();
        let temp2o = formData.temp2o;
        ctx.globalAlpha = set === 'set2' ? parseFloat(temp2o) : 0.1 || parseFloat(temp2o);
        const iconWidth = 620;
        const iconHeight = 620;
        const centerX = (1280 - iconWidth) / 2;
        const centerY = (804 - iconHeight) / 2;
        ctx.drawImage(centerIcon, centerX, centerY, iconWidth, iconHeight);
        ctx.restore();

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
        console.error('Download Render Error:', err);
    }
};

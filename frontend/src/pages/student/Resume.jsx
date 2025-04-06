
import React, { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';

function Resume() {
  const resumePreviewRef = useRef(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [resumeData, setResumeData] = useState({
    personal: { name: 'John Doe', mobile: '+1234567890', email: 'john.doe@example.com', linkedin: 'linkedin.com/in/johndoe' },
    careerObjective: 'To leverage my skills in software development and contribute to innovative projects.',
    experience: [
      { title: 'Software Engineer', company: 'Tech Corp', duration: '2020-2023' },
      { title: 'Junior Developer', company: 'InnoSoft', duration: '2018-2020' }
    ],
    education: [
      { degree: 'B.S. Computer Science', institution: 'State University', year: '2018' }
    ],
    skills: [
      { name: 'JavaScript', description: 'Advanced proficiency' },
      { name: 'React', description: 'Building dynamic UIs' },
      { name: 'Python', description: '' }
    ],
    projects: [
      { title: 'E-Commerce Platform', description: 'Built a full-stack application using React and Node.js.' },
      { title: 'Task Manager', description: 'Developed a productivity app with Python and Flask.' }
    ],
    certifications: [
      { title: 'AWS Certified Developer', issuer: 'Amazon', year: '2022' }
    ],
    achievements: [
      { title: 'Employee of the Year', description: 'Recognized for outstanding performance at Tech Corp.' }
    ]
  });

  const [currentExp, setCurrentExp] = useState({ title: '', company: '', duration: '' });
  const [currentEdu, setCurrentEdu] = useState({ degree: '', institution: '', year: '' });
  const [currentSkill, setCurrentSkill] = useState({ name: '', description: '' });
  const [currentProject, setCurrentProject] = useState({ title: '', description: '' });
  const [currentCert, setCurrentCert] = useState({ title: '', issuer: '', year: '' });
  const [currentAchievement, setCurrentAchievement] = useState({ title: '', description: '' });
  const [isDownloadEnabled, setIsDownloadEnabled] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [errors, setErrors] = useState({ name: '', mobile: '', email: '' });

  const templates = {
    singleColumnLeft: { name: 'Single Column (Left)', layout: 'singleColumnLeft', description: 'Traditional single-column layout, left-aligned.' },
    twoColumn: { name: 'Two Column', layout: 'twoColumn', description: 'Skills and certifications on the left, main content on the right.' },
    centered: { name: 'Centered', layout: 'centered', description: 'All content centered for a balanced look.' },
    compact: { name: 'Compact', layout: 'compact', description: 'Tight single-column layout with minimal spacing.' },
    sidebarRight: { name: 'Sidebar Right', layout: 'sidebarRight', description: 'Main content on the left, skills/certifications on the right.' },
    stackedSections: { name: 'Stacked Sections', layout: 'stackedSections', description: 'Section headers with stacked content blocks.' },
  };

  useEffect(() => {
    const { personal, careerObjective, experience, education, skills } = resumeData;
    const isPersonalComplete = personal.name && personal.mobile && personal.email && !errors.name && !errors.mobile && !errors.email;
    const hasCoreContent = careerObjective && experience.length > 0 && education.length > 0 && skills.length > 0;
    setIsDownloadEnabled(isPersonalComplete && hasCoreContent);
  }, [resumeData, errors]);

  const validateField = (field, value) => {
    switch (field) {
      case 'name':
        setErrors(prev => ({ ...prev, name: value ? '' : 'Name is required' }));
        return !!value;
      case 'mobile':
        const mobileRegex = /^\+[0-9]{10,15}$/;
        setErrors(prev => ({ ...prev, mobile: mobileRegex.test(value) ? '' : 'Enter a valid phone number (e.g., +1234567890)' }));
        return mobileRegex.test(value);
      case 'email':
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        setErrors(prev => ({ ...prev, email: emailRegex.test(value) ? '' : 'Enter a valid email (e.g., name@domain.com)' }));
        return emailRegex.test(value);
      default:
        return true;
    }
  };

  const handlePersonalChange = (field, value) => {
    setResumeData(prev => ({ ...prev, personal: { ...prev.personal, [field]: value } }));
    validateField(field, value);
  };

  const addItem = (type, currentItem, setCurrentItem) => {
    const requiredFields = {
      experience: ['title', 'company'],
      education: ['degree', 'institution'],
      skills: ['name'],
      projects: ['title'],
      certifications: ['title', 'issuer'],
      achievements: ['title']
    };
    const isValid = requiredFields[type].every(field => currentItem[field]);
    if (isValid) {
      setResumeData(prev => ({ ...prev, [type]: [...prev[type], currentItem] }));
      setCurrentItem(Object.fromEntries(Object.keys(currentItem).map(key => [key, ''])));
    } else {
      alert(`Please fill in all required fields for ${type}.`);
    }
  };

  const removeItem = (type, index) => {
    setResumeData(prev => ({ ...prev, [type]: prev[type].filter((_, i) => i !== index) }));
  };

  const downloadResume = async () => {
    if (!isDownloadEnabled || isDownloading || !selectedTemplate) return;
    setIsDownloading(true);

    try {
      const pdf = new jsPDF('p', 'pt', 'a4');
      const margin = 40;
      const pageWidth = 595;
      let yPos = margin;

      pdf.setFont('helvetica', 'normal');

      const addText = (text, x, y, options = {}) => {
        const maxWidth = options.maxWidth || pageWidth - 2 * margin;
        const lines = pdf.splitTextToSize(text, maxWidth);
        pdf.text(lines, x, y, options);
        return lines.length * (options.lineHeight || 12);
      };

      const renderSection = (title, contentFn, xPos, width, options = {}) => {
        if (!contentFn) return;
        pdf.setFontSize(options.headerSize || 16);
        pdf.setTextColor(30, 58, 138);
        pdf.setFont('helvetica', options.boldHeader !== false ? 'bold' : 'normal');
        yPos += addText(title, xPos, yPos, { align: options.align || 'left', maxWidth: width });
        yPos += options.sectionGap || 10;
        pdf.setFontSize(options.contentSize || 11);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'normal');
        contentFn();
        yPos += options.lineGap || 15;
        pdf.line(xPos, yPos, xPos + width, yPos);
        yPos += options.bottomGap || 20;
      };

      const checkPageOverflow = (height) => {
        if (yPos + height > 800) {
          pdf.addPage();
          yPos = margin;
        }
      };

      const layout = templates[selectedTemplate].layout;
      const isTwoColumn = layout === 'twoColumn' || layout === 'sidebarRight';
      const leftWidth = isTwoColumn ? 180 : pageWidth - 2 * margin;
      const rightX = isTwoColumn ? margin + leftWidth + 20 : margin;
      const mainWidth = isTwoColumn ? pageWidth - leftWidth - 3 * margin : pageWidth - 2 * margin;

      // Header
      pdf.setFontSize(24);
      pdf.setTextColor(30, 58, 138);
      pdf.setFont('helvetica', 'bold');
      yPos += addText(resumeData.personal.name, layout === 'centered' ? pageWidth / 2 : margin, yPos, { align: layout === 'centered' ? 'center' : 'left', maxWidth: pageWidth - 2 * margin });
      yPos += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(75, 85, 99);
      yPos += addText([resumeData.personal.mobile, resumeData.personal.email, resumeData.personal.linkedin].filter(Boolean).join(' | '), layout === 'centered' ? pageWidth / 2 : margin, yPos, { align: layout === 'centered' ? 'center' : 'left', maxWidth: pageWidth - 2 * margin });
      yPos += 15;
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 20;

      if (layout === 'singleColumnLeft') {
        renderSection('Career Objective', () => yPos += addText(resumeData.careerObjective, margin, yPos), margin, mainWidth);
        renderSection('Experience', () => resumeData.experience.forEach(exp => {
          checkPageOverflow(40);
          pdf.setFont('helvetica', 'bold');
          yPos += addText(exp.title, margin, yPos);
          yPos += 5;
          pdf.setFont('helvetica', 'normal');
          yPos += addText(`${exp.company} | ${exp.duration}`, margin, yPos);
          yPos += 10;
        }), margin, mainWidth);
        renderSection('Education', () => resumeData.education.forEach(edu => {
          checkPageOverflow(40);
          pdf.setFont('helvetica', 'bold');
          yPos += addText(edu.degree, margin, yPos);
          yPos += 5;
          pdf.setFont('helvetica', 'normal');
          yPos += addText(`${edu.institution} | ${edu.year}`, margin, yPos);
          yPos += 10;
        }), margin, mainWidth);
        renderSection('Skills', () => resumeData.skills.forEach(skill => {
          checkPageOverflow(20);
          yPos += addText(`• ${skill.name}${skill.description ? ': ' + skill.description : ''}`, margin, yPos);
          yPos += 8;
        }), margin, mainWidth);
        renderSection('Projects', () => resumeData.projects.forEach(proj => {
          checkPageOverflow(40);
          pdf.setFont('helvetica', 'bold');
          yPos += addText(proj.title, margin, yPos);
          yPos += 5;
          pdf.setFont('helvetica', 'normal');
          yPos += addText(proj.description || '', margin, yPos);
          yPos += 10;
        }), margin, mainWidth);
        renderSection('Certifications', () => resumeData.certifications.forEach(cert => {
          checkPageOverflow(20);
          yPos += addText(`• ${cert.title} (${cert.issuer}, ${cert.year})`, margin, yPos);
          yPos += 8;
        }), margin, mainWidth);
        renderSection('Achievements', () => resumeData.achievements.forEach(ach => {
          checkPageOverflow(40);
          pdf.setFont('helvetica', 'bold');
          yPos += addText(ach.title, margin, yPos);
          yPos += 5;
          pdf.setFont('helvetica', 'normal');
          yPos += addText(ach.description || '', margin, yPos);
          yPos += 10;
        }), margin, mainWidth);
      } else if (layout === 'twoColumn') {
        let leftY = yPos;
        renderSection('Skills', () => resumeData.skills.forEach(skill => {
          checkPageOverflow(20);
          leftY += addText(`• ${skill.name}${skill.description ? ': ' + skill.description : ''}`, margin, leftY, { maxWidth: leftWidth });
          leftY += 8;
        }), margin, leftWidth);
        renderSection('Certifications', () => resumeData.certifications.forEach(cert => {
          checkPageOverflow(20);
          leftY += addText(`• ${cert.title} (${cert.issuer}, ${cert.year})`, margin, leftY, { maxWidth: leftWidth });
          leftY += 8;
        }), margin, leftWidth, { bottomGap: 0 });

        yPos = margin + 75; // Reset yPos for right column to align with left column start
        renderSection('Career Objective', () => yPos += addText(resumeData.careerObjective, rightX, yPos, { maxWidth: mainWidth }), rightX, mainWidth);
        renderSection('Experience', () => resumeData.experience.forEach(exp => {
          checkPageOverflow(40);
          pdf.setFont('helvetica', 'bold');
          yPos += addText(exp.title, rightX, yPos, { maxWidth: mainWidth });
          yPos += 5;
          pdf.setFont('helvetica', 'normal');
          yPos += addText(`${exp.company} | ${exp.duration}`, rightX, yPos, { maxWidth: mainWidth });
          yPos += 10;
        }), rightX, mainWidth);
        renderSection('Education', () => resumeData.education.forEach(edu => {
          checkPageOverflow(40);
          pdf.setFont('helvetica', 'bold');
          yPos += addText(edu.degree, rightX, yPos, { maxWidth: mainWidth });
          yPos += 5;
          pdf.setFont('helvetica', 'normal');
          yPos += addText(`${edu.institution} | ${edu.year}`, rightX, yPos, { maxWidth: mainWidth });
          yPos += 10;
        }), rightX, mainWidth);
        renderSection('Projects', () => resumeData.projects.forEach(proj => {
          checkPageOverflow(40);
          pdf.setFont('helvetica', 'bold');
          yPos += addText(proj.title, rightX, yPos, { maxWidth: mainWidth });
          yPos += 5;
          pdf.setFont('helvetica', 'normal');
          yPos += addText(proj.description || '', rightX, yPos, { maxWidth: mainWidth });
          yPos += 10;
        }), rightX, mainWidth);
        renderSection('Achievements', () => resumeData.achievements.forEach(ach => {
          checkPageOverflow(40);
          pdf.setFont('helvetica', 'bold');
          yPos += addText(ach.title, rightX, yPos, { maxWidth: mainWidth });
          yPos += 5;
          pdf.setFont('helvetica', 'normal');
          yPos += addText(ach.description || '', rightX, yPos, { maxWidth: mainWidth });
          yPos += 10;
        }), rightX, mainWidth);
        yPos = Math.max(yPos, leftY);
      } else if (layout === 'centered') {
        renderSection('Career Objective', () => yPos += addText(resumeData.careerObjective, pageWidth / 2, yPos, { align: 'center' }), pageWidth / 2 - mainWidth / 2, mainWidth, { align: 'center' });
        renderSection('Experience', () => resumeData.experience.forEach(exp => {
          checkPageOverflow(40);
          pdf.setFont('helvetica', 'bold');
          yPos += addText(exp.title, pageWidth / 2, yPos, { align: 'center' });
          yPos += 5;
          pdf.setFont('helvetica', 'normal');
          yPos += addText(`${exp.company} | ${exp.duration}`, pageWidth / 2, yPos, { align: 'center' });
          yPos += 10;
        }), pageWidth / 2 - mainWidth / 2, mainWidth, { align: 'center' });
        renderSection('Education', () => resumeData.education.forEach(edu => {
          checkPageOverflow(40);
          pdf.setFont('helvetica', 'bold');
          yPos += addText(edu.degree, pageWidth / 2, yPos, { align: 'center' });
          yPos += 5;
          pdf.setFont('helvetica', 'normal');
          yPos += addText(`${edu.institution} | ${edu.year}`, pageWidth / 2, yPos, { align: 'center' });
          yPos += 10;
        }), pageWidth / 2 - mainWidth / 2, mainWidth, { align: 'center' });
        renderSection('Skills', () => resumeData.skills.forEach(skill => {
          checkPageOverflow(20);
          yPos += addText(`• ${skill.name}${skill.description ? ': ' + skill.description : ''}`, pageWidth / 2, yPos, { align: 'center' });
          yPos += 8;
        }), pageWidth / 2 - mainWidth / 2, mainWidth, { align: 'center' });
        renderSection('Projects', () => resumeData.projects.forEach(proj => {
          checkPageOverflow(40);
          pdf.setFont('helvetica', 'bold');
          yPos += addText(proj.title, pageWidth / 2, yPos, { align: 'center' });
          yPos += 5;
          pdf.setFont('helvetica', 'normal');
          yPos += addText(proj.description || '', pageWidth / 2, yPos, { align: 'center' });
          yPos += 10;
        }), pageWidth / 2 - mainWidth / 2, mainWidth, { align: 'center' });
        renderSection('Certifications', () => resumeData.certifications.forEach(cert => {
          checkPageOverflow(20);
          yPos += addText(`• ${cert.title} (${cert.issuer}, ${cert.year})`, pageWidth / 2, yPos, { align: 'center' });
          yPos += 8;
        }), pageWidth / 2 - mainWidth / 2, mainWidth, { align: 'center' });
        renderSection('Achievements', () => resumeData.achievements.forEach(ach => {
          checkPageOverflow(40);
          pdf.setFont('helvetica', 'bold');
          yPos += addText(ach.title, pageWidth / 2, yPos, { align: 'center' });
          yPos += 5;
          pdf.setFont('helvetica', 'normal');
          yPos += addText(ach.description || '', pageWidth / 2, yPos, { align: 'center' });
          yPos += 10;
        }), pageWidth / 2 - mainWidth / 2, mainWidth, { align: 'center' });
      } else if (layout === 'compact') {
        renderSection('Career Objective', () => yPos += addText(resumeData.careerObjective, margin, yPos), margin, mainWidth, { headerSize: 14, contentSize: 10, sectionGap: 5, lineGap: 10, bottomGap: 10 });
        renderSection('Experience', () => resumeData.experience.forEach(exp => {
          checkPageOverflow(30);
          pdf.setFont('helvetica', 'bold');
          yPos += addText(exp.title, margin, yPos);
          yPos += 3;
          pdf.setFont('helvetica', 'normal');
          yPos += addText(`${exp.company} | ${exp.duration}`, margin, yPos);
          yPos += 5;
        }), margin, mainWidth, { headerSize: 14, contentSize: 10, sectionGap: 5, lineGap: 10, bottomGap: 10 });
        renderSection('Education', () => resumeData.education.forEach(edu => {
          checkPageOverflow(30);
          pdf.setFont('helvetica', 'bold');
          yPos += addText(edu.degree, margin, yPos);
          yPos += 3;
          pdf.setFont('helvetica', 'normal');
          yPos += addText(`${edu.institution} | ${edu.year}`, margin, yPos);
          yPos += 5;
        }), margin, mainWidth, { headerSize: 14, contentSize: 10, sectionGap: 5, lineGap: 10, bottomGap: 10 });
        renderSection('Skills', () => resumeData.skills.forEach(skill => {
          checkPageOverflow(15);
          yPos += addText(`• ${skill.name}${skill.description ? ': ' + skill.description : ''}`, margin, yPos);
          yPos += 5;
        }), margin, mainWidth, { headerSize: 14, contentSize: 10, sectionGap: 5, lineGap: 10, bottomGap: 10 });
        renderSection('Projects', () => resumeData.projects.forEach(proj => {
          checkPageOverflow(30);
          pdf.setFont('helvetica', 'bold');
          yPos += addText(proj.title, margin, yPos);
          yPos += 3;
          pdf.setFont('helvetica', 'normal');
          yPos += addText(proj.description || '', margin, yPos);
          yPos += 5;
        }), margin, mainWidth, { headerSize: 14, contentSize: 10, sectionGap: 5, lineGap: 10, bottomGap: 10 });
        renderSection('Certifications', () => resumeData.certifications.forEach(cert => {
          checkPageOverflow(15);
          yPos += addText(`• ${cert.title} (${cert.issuer}, ${cert.year})`, margin, yPos);
          yPos += 5;
        }), margin, mainWidth, { headerSize: 14, contentSize: 10, sectionGap: 5, lineGap: 10, bottomGap: 10 });
        renderSection('Achievements', () => resumeData.achievements.forEach(ach => {
          checkPageOverflow(30);
          pdf.setFont('helvetica', 'bold');
          yPos += addText(ach.title, margin, yPos);
          yPos += 3;
          pdf.setFont('helvetica', 'normal');
          yPos += addText(ach.description || '', margin, yPos);
          yPos += 5;
        }), margin, mainWidth, { headerSize: 14, contentSize: 10, sectionGap: 5, lineGap: 10, bottomGap: 10 });
      } else if (layout === 'sidebarRight') {
        let rightY = yPos;
        renderSection('Skills', () => resumeData.skills.forEach(skill => {
          checkPageOverflow(20);
          rightY += addText(`• ${skill.name}${skill.description ? ': ' + skill.description : ''}`, rightX, rightY, { maxWidth: leftWidth });
          rightY += 8;
        }), rightX, leftWidth);
        renderSection('Certifications', () => resumeData.certifications.forEach(cert => {
          checkPageOverflow(20);
          rightY += addText(`• ${cert.title} (${cert.issuer}, ${cert.year})`, rightX, rightY, { maxWidth: leftWidth });
          rightY += 8;
        }), rightX, leftWidth, { bottomGap: 0 });

        yPos = margin + 75; // Reset yPos for left column to align with right column start
        renderSection('Career Objective', () => yPos += addText(resumeData.careerObjective, margin, yPos, { maxWidth: mainWidth }), margin, mainWidth);
        renderSection('Experience', () => resumeData.experience.forEach(exp => {
          checkPageOverflow(40);
          pdf.setFont('helvetica', 'bold');
          yPos += addText(exp.title, margin, yPos, { maxWidth: mainWidth });
          yPos += 5;
          pdf.setFont('helvetica', 'normal');
          yPos += addText(`${exp.company} | ${exp.duration}`, margin, yPos, { maxWidth: mainWidth });
          yPos += 10;
        }), margin, mainWidth);
        renderSection('Education', () => resumeData.education.forEach(edu => {
          checkPageOverflow(40);
          pdf.setFont('helvetica', 'bold');
          yPos += addText(edu.degree, margin, yPos, { maxWidth: mainWidth });
          yPos += 5;
          pdf.setFont('helvetica', 'normal');
          yPos += addText(`${edu.institution} | ${edu.year}`, margin, yPos, { maxWidth: mainWidth });
          yPos += 10;
        }), margin, mainWidth);
        renderSection('Projects', () => resumeData.projects.forEach(proj => {
          checkPageOverflow(40);
          pdf.setFont('helvetica', 'bold');
          yPos += addText(proj.title, margin, yPos, { maxWidth: mainWidth });
          yPos += 5;
          pdf.setFont('helvetica', 'normal');
          yPos += addText(proj.description || '', margin, yPos, { maxWidth: mainWidth });
          yPos += 10;
        }), margin, mainWidth);
        renderSection('Achievements', () => resumeData.achievements.forEach(ach => {
          checkPageOverflow(40);
          pdf.setFont('helvetica', 'bold');
          yPos += addText(ach.title, margin, yPos, { maxWidth: mainWidth });
          yPos += 5;
          pdf.setFont('helvetica', 'normal');
          yPos += addText(ach.description || '', margin, yPos, { maxWidth: mainWidth });
          yPos += 10;
        }), margin, mainWidth);
        yPos = Math.max(yPos, rightY);
      } else if (layout === 'stackedSections') {
        renderSection('Career Objective', () => yPos += addText(resumeData.careerObjective, margin, yPos), margin, mainWidth, { boldHeader: false });
        renderSection('Experience', () => resumeData.experience.forEach(exp => {
          checkPageOverflow(40);
          pdf.setFont('helvetica', 'bold');
          yPos += addText(exp.title, margin, yPos);
          yPos += 5;
          pdf.setFont('helvetica', 'normal');
          yPos += addText(`${exp.company} | ${exp.duration}`, margin, yPos);
          yPos += 10;
        }), margin, mainWidth, { boldHeader: false });
        renderSection('Education', () => resumeData.education.forEach(edu => {
          checkPageOverflow(40);
          pdf.setFont('helvetica', 'bold');
          yPos += addText(edu.degree, margin, yPos);
          yPos += 5;
          pdf.setFont('helvetica', 'normal');
          yPos += addText(`${edu.institution} | ${edu.year}`, margin, yPos);
          yPos += 10;
        }), margin, mainWidth, { boldHeader: false });
        renderSection('Skills', () => resumeData.skills.forEach(skill => {
          checkPageOverflow(20);
          yPos += addText(`• ${skill.name}${skill.description ? ': ' + skill.description : ''}`, margin, yPos);
          yPos += 8;
        }), margin, mainWidth, { boldHeader: false });
        renderSection('Projects', () => resumeData.projects.forEach(proj => {
          checkPageOverflow(40);
          pdf.setFont('helvetica', 'bold');
          yPos += addText(proj.title, margin, yPos);
          yPos += 5;
          pdf.setFont('helvetica', 'normal');
          yPos += addText(proj.description || '', margin, yPos);
          yPos += 10;
        }), margin, mainWidth, { boldHeader: false });
        renderSection('Certifications', () => resumeData.certifications.forEach(cert => {
          checkPageOverflow(20);
          yPos += addText(`• ${cert.title} (${cert.issuer}, ${cert.year})`, margin, yPos);
          yPos += 8;
        }), margin, mainWidth, { boldHeader: false });
        renderSection('Achievements', () => resumeData.achievements.forEach(ach => {
          checkPageOverflow(40);
          pdf.setFont('helvetica', 'bold');
          yPos += addText(ach.title, margin, yPos);
          yPos += 5;
          pdf.setFont('helvetica', 'normal');
          yPos += addText(ach.description || '', margin, yPos);
          yPos += 10;
        }), margin, mainWidth, { boldHeader: false });
      }

      pdf.save(`${resumeData.personal.name}_${selectedTemplate}.pdf`);
    } catch (error) {
      console.error('PDF Generation Error:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const renderTemplateSelection = () =>(
    <div className="bg-gray-900 text-white  p-2  flex justify-center items-center h-screen">
      <div className="  rounded-lg shadow-lg  w-full max-w-3xl h-full">
        <h2 className="text-2xl font-bold mb-4 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Choose a Resume Template
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-7  h-[calc(100vh-200px)] pb-10 sm:pb-0 sm:h-[600px] overflow-y-auto">
          {Object.entries(templates).map(([key, template]) => (
            <div
              key={key}
              onClick={() => setSelectedTemplate(key)}
              className="bg-gray-700 p-3 rounded-lg cursor-pointer hover:bg-gray-600 transition-all duration-200 flex flex-col"
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-300 mb-2">{template.name}</h3>
                <p className="text-gray-300 mb-2" style={{ minHeight: '2.5em' }}>{template.description}</p>
              </div>
              <div
                style={{
                  height: '120px',
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  padding: '8px',
                  fontFamily: 'Helvetica, sans-serif',
                  fontSize: '9px',
                  color: '#000',
                  position: 'relative'
                }}
              >
                <div style={{ textAlign: template.layout === 'centered' ? 'center' : 'left', width: '100%' }}>
                  <h4 style={{ fontSize: '12px', color: '#1e3a8a', fontWeight: 'bold', marginBottom: '4px' }}>
                    John Doe
                  </h4>
                  <p style={{ fontSize: '7px', color: '#4b5563', marginBottom: '6px' }}>
                    +1234567890 | john.doe@example.com
                  </p>
                  <hr style={{ border: '1px solid #1e3a8a', marginBottom: '8px' }} />
                  <h5 style={{ fontSize: '10px', color: '#1e3a8a', fontWeight: template.layout === 'stackedSections' ? 'normal' : 'bold', marginBottom: '4px' }}>
                    Experience
                  </h5>
                  <p style={{ fontSize: '8px' }}>Software Engineer - Tech Corp</p>
                </div>
                {(template.layout === 'twoColumn' || template.layout === 'sidebarRight') && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: template.layout === 'sidebarRight' ? '8px' : 'auto',
                    left: template.layout === 'twoColumn' ? '8px' : 'auto',
                    width: '30%',
                    fontSize: '7px'
                  }}>
                    <h5 style={{ fontSize: '9px', color: '#1e3a8a', fontWeight: 'bold', marginBottom: '4px' }}>
                      Skills
                    </h5>
                    <p>• JavaScript</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #1f2937;
        }
        ::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
    </div>
  );

  const renderSectionPreview = (title, items, renderItem, options = {}) => (
    items.length > 0 && (
      <section style={{ marginBottom: options.compact ? '8px' : '16px' }}>
        <h2 style={{
          fontSize: options.compact ? '12pt' : '14pt',
          color: '#1e3a8a',
          marginBottom: options.compact ? '4px' : '8px',
          fontWeight: options.boldHeader !== false ? 'bold' : 'normal',
          textAlign: options.align || 'left'
        }}>
          {title}
        </h2>
        <div style={{ paddingLeft: options.paddingLeft || '0', textAlign: options.align || 'left' }}>
          {items.map(renderItem)}
        </div>
        <hr style={{ border: '1px solid #1e3a8a', marginTop: options.compact ? '4px' : '8px' }} />
      </section>
    )
  );

  const renderResumeBuilder = () => {
    const layout = templates[selectedTemplate].layout;
    const isTwoColumn = layout === 'twoColumn' || layout === 'sidebarRight';
    const compact = layout === 'compact';

    return (
      <div className="min-h-screen bg-gray-900 text-white pt-1 h-[600px]">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');`}</style>
        <div className="flex flex-col md:flex-row gap-4 p-1 sm:p-4 max-w-6xl mx-auto h-full pb-[160px]">
          <div className="w-full md:w-1/2 bg-gray-800 rounded-lg shadow-lg p-4 overflow-y-auto h-[calc(100vh-120px)]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Build Resume ({templates[selectedTemplate].name})
              </h2>
              <button onClick={() => setSelectedTemplate(null)} className="text-blue-300 hover:text-blue-400 text-sm">
                Change Template
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-700 p-3 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-blue-300">Personal Details</h3>
                <input value={resumeData.personal.name} onChange={(e) => handlePersonalChange('name', e.target.value)} placeholder="Full Name" className="w-full p-2 mb-2 bg-gray-800 border border-gray-600 rounded text-white" />
                {errors.name && <p className="text-red-400 text-xs">{errors.name}</p>}
                <input value={resumeData.personal.mobile} onChange={(e) => handlePersonalChange('mobile', e.target.value)} placeholder="Mobile (+1234567890)" className="w-full p-2 mb-2 bg-gray-800 border border-gray-600 rounded text-white" />
                {errors.mobile && <p className="text-red-400 text-xs">{errors.mobile}</p>}
                <input value={resumeData.personal.email} onChange={(e) => handlePersonalChange('email', e.target.value)} placeholder="Email (name@domain.com)" className="w-full p-2 mb-2 bg-gray-800 border border-gray-600 rounded text-white" />
                {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
                <input value={resumeData.personal.linkedin} onChange={(e) => handlePersonalChange('linkedin', e.target.value)} placeholder="LinkedIn (optional)" className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white" />
              </div>

              <div className="bg-gray-700 p-3 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-blue-300">Career Objective</h3>
                <textarea value={resumeData.careerObjective} onChange={(e) => setResumeData(prev => ({ ...prev, careerObjective: e.target.value }))} placeholder="Your career objective" className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white" rows="2" />
              </div>

              <div className="bg-gray-700 p-3 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-blue-300">Experience</h3>
                <input value={currentExp.title} onChange={(e) => setCurrentExp(prev => ({ ...prev, title: e.target.value }))} placeholder="Job Title" className="w-full p-2 mb-2 bg-gray-800 border border-gray-600 rounded text-white" />
                <input value={currentExp.company} onChange={(e) => setCurrentExp(prev => ({ ...prev, company: e.target.value }))} placeholder="Company" className="w-full p-2 mb-2 bg-gray-800 border border-gray-600 rounded text-white" />
                <input value={currentExp.duration} onChange={(e) => setCurrentExp(prev => ({ ...prev, duration: e.target.value }))} placeholder="Duration (e.g., 2020-Present)" className="w-full p-2 mb-2 bg-gray-800 border border-gray-600 rounded text-white" />
                <button onClick={() => addItem('experience', currentExp, setCurrentExp)} className="w-full p-2 bg-blue-600 rounded text-white hover:bg-blue-700">Add Experience</button>
                {resumeData.experience.map((exp, index) => (
                  <div key={index} className="flex justify-between items-center mt-2 bg-gray-600 p-2 rounded">
                    <span className="text-sm">{exp.title} - {exp.company}</span>
                    <button onClick={() => removeItem('experience', index)} className="text-red-400">×</button>
                  </div>
                ))}
              </div>

              <div className="bg-gray-700 p-3 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-blue-300">Education</h3>
                <input value={currentEdu.degree} onChange={(e) => setCurrentEdu(prev => ({ ...prev, degree: e.target.value }))} placeholder="Degree" className="w-full p-2 mb-2 bg-gray-800 border border-gray-600 rounded text-white" />
                <input value={currentEdu.institution} onChange={(e) => setCurrentEdu(prev => ({ ...prev, institution: e.target.value }))} placeholder="Institution" className="w-full p-2 mb-2 bg-gray-800 border border-gray-600 rounded text-white" />
                <input value={currentEdu.year} onChange={(e) => setCurrentEdu(prev => ({ ...prev, year: e.target.value }))} placeholder="Year" className="w-full p-2 mb-2 bg-gray-800 border border-gray-600 rounded text-white" />
                <button onClick={() => addItem('education', currentEdu, setCurrentEdu)} className="w-full p-2 bg-blue-600 rounded text-white hover:bg-blue-700">Add Education</button>
                {resumeData.education.map((edu, index) => (
                  <div key={index} className="flex justify-between items-center mt-2 bg-gray-600 p-2 rounded">
                    <span className="text-sm">{edu.degree} - {edu.institution}</span>
                    <button onClick={() => removeItem('education', index)} className="text-red-400">×</button>
                  </div>
                ))}
              </div>

              <div className="bg-gray-700 p-3 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-blue-300">Skills</h3>
                <input value={currentSkill.name} onChange={(e) => setCurrentSkill(prev => ({ ...prev, name: e.target.value }))} placeholder="Skill Name" className="w-full p-2 mb-2 bg-gray-800 border border-gray-600 rounded text-white" />
                <textarea value={currentSkill.description} onChange={(e) => setCurrentSkill(prev => ({ ...prev, description: e.target.value }))} placeholder="Description (optional)" className="w-full p-2 mb-2 bg-gray-800 border border-gray-600 rounded text-white" rows="2" />
                <button onClick={() => addItem('skills', currentSkill, setCurrentSkill)} className="w-full p-2 bg-blue-600 rounded text-white hover:bg-blue-700">Add Skill</button>
                {resumeData.skills.map((skill, index) => (
                  <div key={index} className="flex justify-between items-center mt-2 bg-gray-600 p-2 rounded">
                    <span className="text-sm">{skill.name}</span>
                    <button onClick={() => removeItem('skills', index)} className="text-red-400">×</button>
                  </div>
                ))}
              </div>

              <div className="bg-gray-700 p-3 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-blue-300">Projects</h3>
                <input value={currentProject.title} onChange={(e) => setCurrentProject(prev => ({ ...prev, title: e.target.value }))} placeholder="Project Title" className="w-full p-2 mb-2 bg-gray-800 border border-gray-600 rounded text-white" />
                <textarea value={currentProject.description} onChange={(e) => setCurrentProject(prev => ({ ...prev, description: e.target.value }))} placeholder="Description" className="w-full p-2 mb-2 bg-gray-800 border border-gray-600 rounded text-white" rows="2" />
                <button onClick={() => addItem('projects', currentProject, setCurrentProject)} className="w-full p-2 bg-blue-600 rounded text-white hover:bg-blue-700">Add Project</button>
                {resumeData.projects.map((proj, index) => (
                  <div key={index} className="flex justify-between items-center mt-2 bg-gray-600 p-2 rounded">
                    <span className="text-sm">{proj.title}</span>
                    <button onClick={() => removeItem('projects', index)} className="text-red-400">×</button>
                  </div>
                ))}
              </div>

              <div className="bg-gray-700 p-3 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-blue-300">Certifications</h3>
                <input value={currentCert.title} onChange={(e) => setCurrentCert(prev => ({ ...prev, title: e.target.value }))} placeholder="Certification Title" className="w-full p-2 mb-2 bg-gray-800 border border-gray-600 rounded text-white" />
                <input value={currentCert.issuer} onChange={(e) => setCurrentCert(prev => ({ ...prev, issuer: e.target.value }))} placeholder="Issuer" className="w-full p-2 mb-2 bg-gray-800 border border-gray-600 rounded text-white" />
                <input value={currentCert.year} onChange={(e) => setCurrentCert(prev => ({ ...prev, year: e.target.value }))} placeholder="Year" className="w-full p-2 mb-2 bg-gray-800 border border-gray-600 rounded text-white" />
                <button onClick={() => addItem('certifications', currentCert, setCurrentCert)} className="w-full p-2 bg-blue-600 rounded text-white hover:bg-blue-700">Add Certification</button>
                {resumeData.certifications.map((cert, index) => (
                  <div key={index} className="flex justify-between items-center mt-2 bg-gray-600 p-2 rounded">
                    <span className="text-sm">{cert.title} ({cert.issuer})</span>
                    <button onClick={() => removeItem('certifications', index)} className="text-red-400">×</button>
                  </div>
                ))}
              </div>

              <div className="bg-gray-700 p-3 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-blue-300">Achievements</h3>
                <input value={currentAchievement.title} onChange={(e) => setCurrentAchievement(prev => ({ ...prev, title: e.target.value }))} placeholder="Achievement Title" className="w-full p-2 mb-2 bg-gray-800 border border-gray-600 rounded text-white" />
                <textarea value={currentAchievement.description} onChange={(e) => setCurrentAchievement(prev => ({ ...prev, description: e.target.value }))} placeholder="Description" className="w-full p-2 mb-2 bg-gray-800 border border-gray-600 rounded text-white" rows="2" />
                <button onClick={() => addItem('achievements', currentAchievement, setCurrentAchievement)} className="w-full p-2 bg-blue-600 rounded text-white hover:bg-blue-700">Add Achievement</button>
                {resumeData.achievements.map((ach, index) => (
                  <div key={index} className="flex justify-between items-center mt-2 bg-gray-600 p-2 rounded">
                    <span className="text-sm">{ach.title}</span>
                    <button onClick={() => removeItem('achievements', index)} className="text-red-400">×</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 bg-gray-800 rounded-lg shadow-lg overflow-hidden h-[calc(100vh-120px)]">
            <div className="bg-gray-700 p-3 flex justify-between items-center ">
              <h2 className="text-lg font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>Preview</h2>
              <button
                onClick={downloadResume}
                disabled={!isDownloadEnabled || isDownloading}
                className={`p-2 rounded text-white text-sm ${isDownloadEnabled && !isDownloading ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 cursor-not-allowed'}`}
              >
                {isDownloading ? 'Downloading...' : 'Download PDF'}
              </button>
            </div>
            <div className="p-4 bg-white text-black h-[calc(100vh-60px)] overflow-y-auto pb-[590px] sm:pb-[130px]" style={{ fontFamily: 'Helvetica, sans-serif' }}>
              <div ref={resumePreviewRef} style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '20pt', color: '#1e3a8a', fontWeight: 'bold', marginBottom: '8px', textAlign: layout === 'centered' ? 'center' : 'left' }}>
                  {resumeData.personal.name}
                </h1>
                <p style={{ fontSize: '9pt', color: '#4b5563', marginBottom: '12px', textAlign: layout === 'centered' ? 'center' : 'left' }}>
                  {[resumeData.personal.mobile, resumeData.personal.email, resumeData.personal.linkedin].filter(Boolean).join(' | ')}
                </p>
                <hr style={{ border: '1px solid #1e3a8a', marginBottom: '16px' }} />

                {layout === 'singleColumnLeft' && (
                  <>
                    {renderSectionPreview('Career Objective', [resumeData.careerObjective], (_, i) => <p key={i} style={{ fontSize: '10pt' }}>{resumeData.careerObjective}</p>)}
                    {renderSectionPreview('Experience', resumeData.experience, (exp, i) => (
                      <div key={i} style={{ marginBottom: '8px' }}>
                        <strong style={{ fontSize: '11pt' }}>{exp.title}</strong>
                        <p style={{ fontSize: '10pt', color: '#4b5563' }}>{exp.company} | {exp.duration}</p>
                      </div>
                    ))}
                    {renderSectionPreview('Education', resumeData.education, (edu, i) => (
                      <div key={i} style={{ marginBottom: '8px' }}>
                        <strong style={{ fontSize: '11pt' }}>{edu.degree}</strong>
                        <p style={{ fontSize: '10pt', color: '#4b5563' }}>{edu.institution} | {edu.year}</p>
                      </div>
                    ))}
                    {renderSectionPreview('Skills', resumeData.skills, (skill, i) => (
                      <p key={i} style={{ fontSize: '10pt' }}>• {skill.name}{skill.description ? `: ${skill.description}` : ''}</p>
                    ))}
                    {renderSectionPreview('Projects', resumeData.projects, (proj, i) => (
                      <div key={i} style={{ marginBottom: '8px' }}>
                        <strong style={{ fontSize: '11pt' }}>{proj.title}</strong>
                        <p style={{ fontSize: '10pt' }}>{proj.description}</p>
                      </div>
                    ))}
                    {renderSectionPreview('Certifications', resumeData.certifications, (cert, i) => (
                      <p key={i} style={{ fontSize: '10pt' }}>• {cert.title} ({cert.issuer}, {cert.year})</p>
                    ))}
                    {renderSectionPreview('Achievements', resumeData.achievements, (ach, i) => (
                      <div key={i} style={{ marginBottom: '8px' }}>
                        <strong style={{ fontSize: '11pt' }}>{ach.title}</strong>
                        <p style={{ fontSize: '10pt' }}>{ach.description}</p>
                      </div>
                    ))}
                  </>
                )}

                {layout === 'twoColumn' && (
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/3">
                      {renderSectionPreview('Skills', resumeData.skills, (skill, i) => (
                        <p key={i} style={{ fontSize: '10pt' }}>• {skill.name}{skill.description ? `: ${skill.description}` : ''}</p>
                      ))}
                      {renderSectionPreview('Certifications', resumeData.certifications, (cert, i) => (
                        <p key={i} style={{ fontSize: '10pt' }}>• {cert.title} ({cert.issuer}, {cert.year})</p>
                      ))}
                    </div>
                    <div className="w-full md:w-2/3">
                      {renderSectionPreview('Career Objective', [resumeData.careerObjective], (_, i) => <p key={i} style={{ fontSize: '10pt' }}>{resumeData.careerObjective}</p>)}
                      {renderSectionPreview('Experience', resumeData.experience, (exp, i) => (
                        <div key={i} style={{ marginBottom: '8px' }}>
                          <strong style={{ fontSize: '11pt' }}>{exp.title}</strong>
                          <p style={{ fontSize: '10pt', color: '#4b5563' }}>{exp.company} | {exp.duration}</p>
                        </div>
                      ))}
                      {renderSectionPreview('Education', resumeData.education, (edu, i) => (
                        <div key={i} style={{ marginBottom: '8px' }}>
                          <strong style={{ fontSize: '11pt' }}>{edu.degree}</strong>
                          <p style={{ fontSize: '10pt', color: '#4b5563' }}>{edu.institution} | {edu.year}</p>
                        </div>
                      ))}
                      {renderSectionPreview('Projects', resumeData.projects, (proj, i) => (
                        <div key={i} style={{ marginBottom: '8px' }}>
                          <strong style={{ fontSize: '11pt' }}>{proj.title}</strong>
                          <p style={{ fontSize: '10pt' }}>{proj.description}</p>
                        </div>
                      ))}
                      {renderSectionPreview('Achievements', resumeData.achievements, (ach, i) => (
                        <div key={i} style={{ marginBottom: '8px' }}>
                          <strong style={{ fontSize: '11pt' }}>{ach.title}</strong>
                          <p style={{ fontSize: '10pt' }}>{ach.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {layout === 'centered' && (
                  <>
                    {renderSectionPreview('Career Objective', [resumeData.careerObjective], (_, i) => <p key={i} style={{ fontSize: '10pt' }}>{resumeData.careerObjective}</p>, { align: 'center' })}
                    {renderSectionPreview('Experience', resumeData.experience, (exp, i 
   
) => (
                      <div key={i} style={{ marginBottom: '8px' }}>
                        <strong style={{ fontSize: '11pt' }}>{exp.title}</strong>
                        <p style={{ fontSize: '10pt', color: '#4b5563' }}>{exp.company} | {exp.duration}</p>
                      </div>
                    ), { align: 'center' })}
                    {renderSectionPreview('Education', resumeData.education, (edu, i) => (
                      <div key={i} style={{ marginBottom: '8px' }}>
                        <strong style={{ fontSize: '11pt' }}>{edu.degree}</strong>
                        <p style={{ fontSize: '10pt', color: '#4b5563' }}>{edu.institution} | {edu.year}</p>
                      </div>
                    ), { align: 'center' })}
                    {renderSectionPreview('Skills', resumeData.skills, (skill, i) => (
                      <p key={i} style={{ fontSize: '10pt' }}>• {skill.name}{skill.description ? `: ${skill.description}` : ''}</p>
                    ), { align: 'center' })}
                    {renderSectionPreview('Projects', resumeData.projects, (proj, i) => (
                      <div key={i} style={{ marginBottom: '8px' }}>
                        <strong style={{ fontSize: '11pt' }}>{proj.title}</strong>
                        <p style={{ fontSize: '10pt' }}>{proj.description}</p>
                      </div>
                    ), { align: 'center' })}
                    {renderSectionPreview('Certifications', resumeData.certifications, (cert, i) => (
                      <p key={i} style={{ fontSize: '10pt' }}>• {cert.title} ({cert.issuer}, {cert.year})</p>
                    ), { align: 'center' })}
                    {renderSectionPreview('Achievements', resumeData.achievements, (ach, i) => (
                      <div key={i} style={{ marginBottom: '8px' }}>
                        <strong style={{ fontSize: '11pt' }}>{ach.title}</strong>
                        <p style={{ fontSize: '10pt' }}>{ach.description}</p>
                      </div>
                    ), { align: 'center' })}
                  </>
                )}

                {layout === 'compact' && (
                  <>
                    {renderSectionPreview('Career Objective', [resumeData.careerObjective], (_, i) => <p key={i} style={{ fontSize: '9pt' }}>{resumeData.careerObjective}</p>, { compact: true })}
                    {renderSectionPreview('Experience', resumeData.experience, (exp, i) => (
                      <div key={i} style={{ marginBottom: '6px' }}>
                        <strong style={{ fontSize: '10pt' }}>{exp.title}</strong>
                        <p style={{ fontSize: '9pt', color: '#4b5563' }}>{exp.company} | {exp.duration}</p>
                      </div>
                    ), { compact: true })}
                    {renderSectionPreview('Education', resumeData.education, (edu, i) => (
                      <div key={i} style={{ marginBottom: '6px' }}>
                        <strong style={{ fontSize: '10pt' }}>{edu.degree}</strong>
                        <p style={{ fontSize: '9pt', color: '#4b5563' }}>{edu.institution} | {edu.year}</p>
                      </div>
                    ), { compact: true })}
                    {renderSectionPreview('Skills', resumeData.skills, (skill, i) => (
                      <p key={i} style={{ fontSize: '9pt' }}>• {skill.name}{skill.description ? `: ${skill.description}` : ''}</p>
                    ), { compact: true })}
                    {renderSectionPreview('Projects', resumeData.projects, (proj, i) => (
                      <div key={i} style={{ marginBottom: '6px' }}>
                        <strong style={{ fontSize: '10pt' }}>{proj.title}</strong>
                        <p style={{ fontSize: '9pt' }}>{proj.description}</p>
                      </div>
                    ), { compact: true })}
                    {renderSectionPreview('Certifications', resumeData.certifications, (cert, i) => (
                      <p key={i} style={{ fontSize: '9pt' }}>• {cert.title} ({cert.issuer}, {cert.year})</p>
                    ), { compact: true })}
                    {renderSectionPreview('Achievements', resumeData.achievements, (ach, i) => (
                      <div key={i} style={{ marginBottom: '6px' }}>
                        <strong style={{ fontSize: '10pt' }}>{ach.title}</strong>
                        <p style={{ fontSize: '9pt' }}>{ach.description}</p>
                      </div>
                    ), { compact: true })}
                  </>
                )}

                {layout === 'sidebarRight' && (
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-2/3">
                      {renderSectionPreview('Career Objective', [resumeData.careerObjective], (_, i) => <p key={i} style={{ fontSize: '10pt' }}>{resumeData.careerObjective}</p>)}
                      {renderSectionPreview('Experience', resumeData.experience, (exp, i) => (
                        <div key={i} style={{ marginBottom: '8px' }}>
                          <strong style={{ fontSize: '11pt' }}>{exp.title}</strong>
                          <p style={{ fontSize: '10pt', color: '#4b5563' }}>{exp.company} | {exp.duration}</p>
                        </div>
                      ))}
                      {renderSectionPreview('Education', resumeData.education, (edu, i) => (
                        <div key={i} style={{ marginBottom: '8px' }}>
                          <strong style={{ fontSize: '11pt' }}>{edu.degree}</strong>
                          <p style={{ fontSize: '10pt', color: '#4b5563' }}>{edu.institution} | {edu.year}</p>
                        </div>
                      ))}
                      {renderSectionPreview('Projects', resumeData.projects, (proj, i) => (
                        <div key={i} style={{ marginBottom: '8px' }}>
                          <strong style={{ fontSize: '11pt' }}>{proj.title}</strong>
                          <p style={{ fontSize: '10pt' }}>{proj.description}</p>
                        </div>
                      ))}
                      {renderSectionPreview('Achievements', resumeData.achievements, (ach, i) => (
                        <div key={i} style={{ marginBottom: '8px' }}>
                          <strong style={{ fontSize: '11pt' }}>{ach.title}</strong>
                          <p style={{ fontSize: '10pt' }}>{ach.description}</p>
                        </div>
                      ))}
                    </div>
                    <div className="w-full md:w-1/3">
                      {renderSectionPreview('Skills', resumeData.skills, (skill, i) => (
                        <p key={i} style={{ fontSize: '10pt' }}>• {skill.name}{skill.description ? `: ${skill.description}` : ''}</p>
                      ))}
                      {renderSectionPreview('Certifications', resumeData.certifications, (cert, i) => (
                        <p key={i} style={{ fontSize: '10pt' }}>• {cert.title} ({cert.issuer}, {cert.year})</p>
                      ))}
                    </div>
                  </div>
                )}

                {layout === 'stackedSections' && (
                  <>
                    {renderSectionPreview('Career Objective', [resumeData.careerObjective], (_, i) => <p key={i} style={{ fontSize: '10pt' }}>{resumeData.careerObjective}</p>, { boldHeader: false })}
                    {renderSectionPreview('Experience', resumeData.experience, (exp, i) => (
                      <div key={i} style={{ marginBottom: '8px' }}>
                        <strong style={{ fontSize: '11pt' }}>{exp.title}</strong>
                        <p style={{ fontSize: '10pt', color: '#4b5563' }}>{exp.company} | {exp.duration}</p>
                      </div>
                    ), { boldHeader: false })}
                    {renderSectionPreview('Education', resumeData.education, (edu, i) => (
                      <div key={i} style={{ marginBottom: '8px' }}>
                        <strong style={{ fontSize: '11pt' }}>{edu.degree}</strong>
                        <p style={{ fontSize: '10pt', color: '#4b5563' }}>{edu.institution} | {edu.year}</p>
                      </div>
                    ), { boldHeader: false })}
                    {renderSectionPreview('Skills', resumeData.skills, (skill, i) => (
                      <p key={i} style={{ fontSize: '10pt' }}>• {skill.name}{skill.description ? `: ${skill.description}` : ''}</p>
                    ), { boldHeader: false })}
                    {renderSectionPreview('Projects', resumeData.projects, (proj, i) => (
                      <div key={i} style={{ marginBottom: '8px' }}>
                        <strong style={{ fontSize: '11pt' }}>{proj.title}</strong>
                        <p style={{ fontSize: '10pt' }}>{proj.description}</p>
                      </div>
                    ), { boldHeader: false })}
                    {renderSectionPreview('Certifications', resumeData.certifications, (cert, i) => (
                      <p key={i} style={{ fontSize: '10pt' }}>• {cert.title} ({cert.issuer}, {cert.year})</p>
                    ), { boldHeader: false })}
                    {renderSectionPreview('Achievements', resumeData.achievements, (ach, i) => (
                      <div key={i} style={{ marginBottom: '8px' }}>
                        <strong style={{ fontSize: '11pt' }}>{ach.title}</strong>
                        <p style={{ fontSize: '10pt' }}>{ach.description}</p>
                      </div>
                    ), { boldHeader: false })}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return selectedTemplate ? renderResumeBuilder() : renderTemplateSelection();
}

export default Resume;
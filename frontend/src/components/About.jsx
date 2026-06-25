import React, { useState, useEffect } from 'react';
import axios from 'axios';

const About = () => {
  const [activeTab, setActiveTab] = useState('experience');
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample data for when backend is not running
  const sampleExperiences = [
    {
      _id: '1',
      year: '2023 - 2024',
      title: 'Frontend Developer',
      company: 'Mindstay Technology',
      description: 'Built responsive and optimized UIs using React.js and Tailwind CSS. Collaborated with backend teams to integrate APIs and improve user experience.'
    },
    {
      _id: '2',
      year: '2022 - 2023',
      title: 'Frontend Developer Intern',
      company: 'Tech Solutions',
      description: 'Developed reusable components and managed state using Redux. Implemented responsive designs and improved page load performance.'
    }
  ];

  const sampleEducation = [
    {
      _id: '1',
      year: '2020 - 2023',
      degree: 'Bachelor of Computer Applications (BCA)',
      institution: 'CS University, Dehradun',
      description: 'Studied core subjects like Data Structures, Web Development, and Operating Systems. Built multiple academic projects using JavaScript and the MERN stack.'
    },
    {
      _id: '2',
      year: '2018 - 2020',
      degree: '12th Standard',
      institution: 'Punjab School Education Board',
      description: 'Completed higher secondary education with Computer Science as major subject.'
    }
  ];

  const sampleSkills = [
    'HTML5', 'CSS3', 'JavaScript', 'React.js', 'Node.js', 'Express.js',
    'MongoDB', 'Git & GitHub', 'Tailwind CSS', 'REST APIs', 'Redux', 'TypeScript'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expRes, eduRes, skillsRes] = await Promise.all([
          axios.get('/api/experiences'),
          axios.get('/api/education'),
          axios.get('/api/skills')
        ]);
        setExperiences(expRes.data);
        setEducation(eduRes.data);
        setSkills(skillsRes.data.map(s => s.name));
      } catch (error) {
        console.log('Using sample data');
        setExperiences(sampleExperiences);
        setEducation(sampleEducation);
        setSkills(sampleSkills);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <section id="about" className="about-section">
        <div className="container">
          <div className="loader"><div className="spinner"></div></div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="about-section">
      <div className="container">
        <h2>About <span>Me</span></h2>
        <div className="about-grid">
          <div className="about-left">
            <h3>Why Hire Me?</h3>
            <p>I'm a passionate and experienced MERN stack developer who simplifies complex concepts. I deliver quality mentorship, clear teaching, and reliable websites tailored to client needs with full dedication and care.</p>
            <div className="tabs-container">
              <div className="tabs">
                <button className={`tab-btn ${activeTab === 'experience' ? 'active' : ''}`} onClick={() => setActiveTab('experience')}>Experience</button>
                <button className={`tab-btn ${activeTab === 'education' ? 'active' : ''}`} onClick={() => setActiveTab('education')}>Education</button>
                <button className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`} onClick={() => setActiveTab('skills')}>Skills</button>
                <button className={`tab-btn ${activeTab === 'about-me' ? 'active' : ''}`} onClick={() => setActiveTab('about-me')}>About Me</button>
              </div>
            </div>
          </div>
          <div className="about-right">
            <div className={`tab-pane ${activeTab === 'experience' ? 'active' : ''}`}>
              {experiences.map(exp => (
                <div key={exp._id} className="exp-card">
                  <div className="year">{exp.year}</div>
                  <h4>{exp.title}</h4>
                  <div className="company">{exp.company}</div>
                  <p>{exp.description}</p>
                </div>
              ))}
            </div>
            <div className={`tab-pane ${activeTab === 'education' ? 'active' : ''}`}>
              {education.map(edu => (
                <div key={edu._id} className="edu-card">
                  <div className="year">{edu.year}</div>
                  <h4>{edu.degree}</h4>
                  <div className="institution">{edu.institution}</div>
                  <p>{edu.description}</p>
                </div>
              ))}
            </div>
            <div className={`tab-pane ${activeTab === 'skills' ? 'active' : ''}`}>
              <div className="skills-grid">
                {skills.map((skill, index) => (
                  <div key={index} className="skill-item">
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={`tab-pane ${activeTab === 'about-me' ? 'active' : ''}`}>
              <div className="about-me-content">
                <p>I'm a passionate developer dedicated to building impactful digital experiences, blending creativity and code to solve real-world problems efficiently and effectively.</p>
                <div className="info-grid">
                  <div className="info-item">
                    <div className="info-label">Name</div>
                    <div className="info-value">Simranpreet Kaur</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Country</div>
                    <div className="info-value">India</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Industry</div>
                    <div className="info-value">Software & IT</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Experience</div>
                    <div className="info-value">Fresher</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
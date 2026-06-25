import React, { useState, useEffect } from 'react';

const Home = () => {
  const words = ['Web Developer', 'Frontend Developer', 'React.js Developer', 'MERN Stack Developer'];
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(currentWord.substring(0, charIndex + 1));
        setCharIndex(prev => prev + 1);
        
        if (charIndex === currentWord.length - 1) {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        setText(currentWord.substring(0, charIndex - 1));
        setCharIndex(prev => prev - 1);
        
        if (charIndex === 0) {
          setIsDeleting(false);
          setWordIndex(prev => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? 50 : 100);
    
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, wordIndex, words]);

  // CV Download Function
  const downloadCV = () => {
    // Create a link element
    const link = document.createElement('a');
   
    link.href = '/cv/Simranpreet_Kaur_CV.pdf';
    
    link.download = 'Simranpreet_Kaur_CV.pdf';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Social media links - Replace with your actual URLs
  const socialLinks = {
    github: 'https://github.com/simranbehl149',
    linkedin: 'https://www.linkedin.com/in/simranpreet-kaur-b06806252/',
    telegram: 'https://web.telegram.org/a/#6162168856',
    instagram: 'hhttps://www.instagram.com/simran114_/'
  };

  return (
    <section id="home" className="home container">
      <div className="home-content">
        <div className="greeting">Hello, I'm</div>
        <h2><span>Simranpreet</span> Kaur</h2>
        <h3>I'm <span className="typing-text">{text}</span></h3>
        <p>I am a passionate Web Developer with a strong foundation in HTML, CSS, JavaScript, and React. I enjoy building responsive, user-friendly websites and continuously learning new technologies. As a fresher, I am eager to apply my skills, gain real-world experience, and grow as a developer while creating meaningful digital experiences.</p>
        <button className="btn" onClick={downloadCV}>
          <i className="ph ph-download-simple"></i> Download CV
        </button>
        <div className="social-links">
          <a 
            href={socialLinks.github} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="social-icon"
            title="GitHub"
          >
            <i className="ph ph-github-logo"></i>
          </a>
          <a 
            href={socialLinks.linkedin} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="social-icon"
            title="LinkedIn"
          >
            <i className="ph ph-linkedin-logo"></i>
          </a>
          <a 
            href={socialLinks.telegram} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="social-icon"
            title="Telegram"
          >
            <i className="ph ph-telegram-logo"></i>
          </a>
          <a 
            href={socialLinks.instagram} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="social-icon"
            title="Instagram"
          >
            <i className="ph ph-instagram-logo"></i>
          </a>
        </div>
      </div>
      <div className="home-image">
        <div className="image-wrapper">
          <img 
            src="/assets/profile1.jpeg" 
            alt="Simranpreet Kaur - Profile" 
            onError={(e) => { 
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/320/1a1f2e/7cf03d?text=Profile'; 
            }} 
          />
        </div>
      </div>
    </section>
  );
};

export default Home;
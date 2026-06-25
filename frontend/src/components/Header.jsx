import React, { useState } from 'react';

const Header = ({ activeSection, setActiveSection }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleClick = (id) => {
    setActiveSection(id);
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <header className="header">
        <div className="logo">
          <img src="/assets/logo.jpeg" alt="Logo" className="logo-img" 
            onError={(e) => { e.target.style.display = 'none' }} />
          <h1>Simranpreet Kaur</h1>
        </div>
        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          <i className={`ph ${menuOpen ? 'ph-x' : 'ph-list'}`}></i>
        </div>
        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {navItems.map(item => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={activeSection === item.id ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                handleClick(item.id);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>
      <div className={`nav-overlay ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(false)}></div>
    </>
  );
};

export default Header;
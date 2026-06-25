// frontend/src/components/Services.jsx
import React, { useState } from 'react';

const Services = () => {
  const [activeService, setActiveService] = useState(null);
  
  const services = [
    {
      icon: "ph-code",
      title: "Website Development",
      description: "I build fast, secure, and scalable websites using modern technologies like HTML, CSS, JavaScript, and React."
    },
    {
      icon: "ph-layout",
      title: "Frontend Development",
      description: "I craft clean, interactive, and visually appealing user interfaces with React.js and modern UI practices."
    },
    {
      icon: "ph-device-mobile",
      title: "Responsive Design",
      description: "I design mobile-first layouts that adapt seamlessly across desktops, tablets, and smartphones."
    },
    {
      icon: "ph-lightning",
      title: "Performance Optimization",
      description: "I optimize website speed, assets, and performance to ensure smooth user experience and faster load times."
    },
    {
      icon: "ph-palette",
      title: "UI/UX Implementation",
      description: "I convert design concepts into pixel-perfect interfaces with strong focus on usability and accessibility."
    },
    {
      icon: "ph-git-branch",
      title: "Code & Version Control",
      description: "I follow clean coding standards and use Git/GitHub to maintain organized, scalable projects."
    }
  ];

  return (
    <section id="services" className="services">
      <div className="container">
        <h2>My <span>Services</span></h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <div
              key={index}
              className={`service-card ${activeService === index ? 'active' : ''}`}
              onClick={() => setActiveService(index)}
            >
              <div className="service-icon">
                <i className={`ph ${service.icon}`}></i>
                <span><i className="ph ph-arrow-down-right"></i></span>
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
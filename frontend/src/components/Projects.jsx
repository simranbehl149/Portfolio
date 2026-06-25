import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ImageCarousel from './ImageCarousel';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('/api/projects');
        setProjects(response.data);
      } catch (error) {
        console.log('Error fetching projects:', error);
        // Sample data with multiple images
        setProjects([
          {
            _id: '1',
            title: 'FullStack Thread Clone',
            category: 'Web Application',
            description: 'A full-stack thread-based discussion platform similar to Reddit. Users can create posts, comment, and upvote content.',
            technologies: ['MongoDB', 'Express', 'React', 'Node.js'],
            images: [
              'https://via.placeholder.com/800x400/1a1f2e/7cf03d?text=Project+Image+1',
              'https://via.placeholder.com/800x400/1a1f2e/7cf03d?text=Project+Image+2',
              'https://via.placeholder.com/800x400/1a1f2e/7cf03d?text=Project+Image+3'
            ],
            featured: true
          },
          {
            _id: '2',
            title: 'SAAS Canva Website',
            category: 'Web Development',
            description: 'A SAAS platform for creating stunning designs with drag-and-drop functionality and template library.',
            technologies: ['Next.js', 'Strapi', 'Tailwind CSS'],
            images: [
              'https://via.placeholder.com/800x400/1a1f2e/7cf03d?text=SAAS+Image+1',
              'https://via.placeholder.com/800x400/1a1f2e/7cf03d?text=SAAS+Image+2'
            ],
            featured: true
          },
          {
            _id: '3',
            title: 'E-Commerce Platform',
            category: 'E-Commerce',
            description: 'Full-featured e-commerce platform with product management, cart, checkout, and payment integration.',
            technologies: ['MERN Stack', 'Redux', 'Stripe'],
            images: [
              'https://via.placeholder.com/800x400/1a1f2e/7cf03d?text=E-Commerce+1',
              'https://via.placeholder.com/800x400/1a1f2e/7cf03d?text=E-Commerce+2',
              'https://via.placeholder.com/800x400/1a1f2e/7cf03d?text=E-Commerce+3'
            ],
            featured: true
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const displayedProjects = showAll ? projects : projects.filter(p => p.featured).slice(0, 6);

  if (loading) {
    return (
      <section id="projects">
        <div className="container">
          <div className="loader"><div className="spinner"></div></div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects">
      <div className="container">
        <div className="projects-header">
          <h2>My <span>Projects</span></h2>
          <p>Here are some of my recent works that showcase my skills and creativity</p>
        </div>
        <div className="projects-grid">
          {displayedProjects.map(project => (
            <div key={project._id} className="project-card">
              <ImageCarousel 
                images={project.images || []} 
                title={project.title}
                autoPlay={true}
                interval={4000}
              />
              <div className="project-info">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-tech">
                  {project.technologies?.map((tech, idx) => (
                    <span key={idx}>{tech}</span>
                  ))}
                </div>
                <div className="project-links">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <i className="ph ph-github-logo"></i> Code
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <i className="ph ph-eye"></i> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {projects.length > 6 && !showAll && (
          <div className="view-all">
            <button className="btn btn-outline" onClick={() => setShowAll(true)}>
              View All Projects ({projects.length})
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
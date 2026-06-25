import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ensureArray } from '../utils/helpers';
import ImageCarousel from './ImageCarousel';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  // useEffect(() => {
  //   const fetchProjects = async () => {
  //     try {
  //       const response = await axios.get('/api/projects');
  //       setProjects(ensureArray(response.data));
  //     } catch (error) {
  //       console.log('Using sample projects');
  //       setProjects([
  //         {
  //           _id: '1',
  //           title: 'FullStack Thread Clone',
  //           description: 'A full-stack thread-based discussion platform.',
  //           technologies: ['MongoDB', 'Express', 'React', 'Node.js'],
  //           images: ['https://via.placeholder.com/800x400/1a1f2e/7cf03d?text=Project+1'],
  //           featured: true
  //         },
  //         {
  //           _id: '2',
  //           title: 'SAAS Canva Website',
  //           description: 'A SAAS platform for creating stunning designs.',
  //           technologies: ['Next.js', 'Strapi', 'Tailwind CSS'],
  //           images: ['https://via.placeholder.com/800x400/1a1f2e/7cf03d?text=Project+2'],
  //           featured: true
  //         },
  //         {
  //           _id: '3',
  //           title: 'E-Commerce Platform',
  //           description: 'Full-featured e-commerce platform.',
  //           technologies: ['MERN Stack', 'Redux', 'Stripe'],
  //           images: ['https://via.placeholder.com/800x400/1a1f2e/7cf03d?text=Project+3'],
  //           featured: true
  //         }
  //       ]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchProjects();
  // }, []);


  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects');
        setProjects(ensureArray(response.data));
      } catch (error) {
        console.log('Using sample projects');
        setProjects([
          {
            _id: '1',
            title: 'FullStack Thread Clone',
            description: 'A full-stack thread-based discussion platform.',
            technologies: ['MongoDB', 'Express', 'React', 'Node.js'],
            images: ['https://via.placeholder.com/800x400/1a1f2e/7cf03d?text=Project+1'],
            featured: true
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  
  const featuredProjects = projects.filter(p => p.featured);
  const displayedProjects = showAll ? projects : featuredProjects.slice(0, 6);

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
        <h2>My <span>Projects</span></h2>
        <div className="projects-grid">
          {displayedProjects.map(project => (
            <div key={project._id} className="project-card">
              <ImageCarousel 
                images={ensureArray(project.images)} 
                title={project.title}
                autoPlay={true}
                interval={4000}
              />
              <div className="project-info">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-tech">
                  {ensureArray(project.technologies).map((tech, idx) => (
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
            <button className="btn" onClick={() => setShowAll(true)}>
              View All Projects ({projects.length})
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
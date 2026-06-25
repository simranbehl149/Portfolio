import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ManageProjects from './ManageProjects';
import ManageExperience from './ManageExperience';
import ManageEducation from './ManageEducation';
import ManageSkills from './ManageSkills';
import ManageContacts from './ManageContacts';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('projects');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
      return;
    }

    const verifyToken = async () => {
      try {
        await axios.post('/api/admin/verify', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLoading(false);
      } catch (error) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminEmail');
        navigate('/admin');
      }
    };
    verifyToken();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    navigate('/admin');
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loader"><div className="spinner"></div></div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Admin <span>Dashboard</span></h2>
        <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
      </div>
      <div className="dashboard-nav">
        <button className={activeSection === 'projects' ? 'active' : ''} onClick={() => setActiveSection('projects')}>
          📁 Projects
        </button>
        <button className={activeSection === 'experience' ? 'active' : ''} onClick={() => setActiveSection('experience')}>
          💼 Experience
        </button>
        <button className={activeSection === 'education' ? 'active' : ''} onClick={() => setActiveSection('education')}>
          🎓 Education
        </button>
        <button className={activeSection === 'skills' ? 'active' : ''} onClick={() => setActiveSection('skills')}>
          🛠️ Skills
        </button>
        <button className={activeSection === 'contacts' ? 'active' : ''} onClick={() => setActiveSection('contacts')}>
          📩 Messages
        </button>
      </div>
      {activeSection === 'projects' && <ManageProjects />}
      {activeSection === 'experience' && <ManageExperience />}
      {activeSection === 'education' && <ManageEducation />}
      {activeSection === 'skills' && <ManageSkills />}
      {activeSection === 'contacts' && <ManageContacts />}
    </div>
  );
};

export default AdminDashboard;
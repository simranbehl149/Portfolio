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
  const [adminEmail, setAdminEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const email = localStorage.getItem('adminEmail');
    
    if (!token) {
      navigate('/admin');
      return;
    }
    
    setAdminEmail(email || '');

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
        <div className="admin-loader">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'projects', label: '📁 Projects' },
    { id: 'experience', label: '💼 Experience' },
    { id: 'education', label: '🎓 Education' },
    { id: 'skills', label: '🛠️ Skills' },
    { id: 'contacts', label: '📩 Messages' }
  ];

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Admin <span>Dashboard</span></h2>
        <div className="admin-info">
          <span className="admin-email">{adminEmail}</span>
          <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
        </div>
      </div>
      
      <div className="dashboard-nav">
        {navItems.map(item => (
          <button 
            key={item.id}
            className={activeSection === item.id ? 'active' : ''} 
            onClick={() => setActiveSection(item.id)}
          >
            {item.label}
          </button>
        ))}
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
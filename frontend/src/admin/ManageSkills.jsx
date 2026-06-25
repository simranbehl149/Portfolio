import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ensureArray } from '../utils/helpers';

const ManageSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    category: 'frontend', 
    level: 80 
  });

  const token = localStorage.getItem('adminToken');

  const categories = [
    { value: 'frontend', label: '🎨 Frontend' },
    { value: 'backend', label: '⚙️ Backend' },
    { value: 'database', label: '🗄️ Database' },
    { value: 'tools', label: '🔧 Tools' },
    { value: 'design', label: '🎯 Design' },
    { value: 'soft', label: '💬 Soft Skills' }
  ];

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/skills');
      setSkills(ensureArray(response.data));
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.name) {
      alert('Please enter a skill name');
      setIsSubmitting(false);
      return;
    }

    try {
      if (editing) {
        await axios.put(`/api/skills/${editing}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('✅ Skill updated successfully!');
      } else {
        await axios.post('/api/skills', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('✅ Skill added successfully!');
      }
      fetchData();
      resetForm();
    } catch (error) {
      console.error('Error saving:', error);
      alert('❌ Error: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditing(null);
    setFormData({ name: '', category: 'frontend', level: 80 });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this skill?')) {
      try {
        await axios.delete(`/api/skills/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
        alert('✅ Skill deleted successfully!');
      } catch (error) {
        console.error('Error deleting:', error);
        alert('❌ Error deleting skill');
      }
    }
  };

  const handleEdit = (skill) => {
    setEditing(skill._id);
    setFormData({
      name: skill.name || '',
      category: skill.category || 'frontend',
      level: skill.level || 80
    });
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="admin-loader">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-section-header">
        <h3>
          🛠️ Skills
          <span className="count">{skills.length}</span>
        </h3>
        <button 
          className={`add-btn ${showForm ? 'cancel' : ''}`} 
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
        >
          {showForm ? '❌ Cancel' : '+ Add Skill'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form">
          <h4>{editing ? '✏️ Edit Skill' : '📝 Add New Skill'}</h4>
          
          <div className="form-group">
            <label>Skill Name *</label>
            <input 
              type="text" 
              placeholder="e.g., React.js" 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Category</label>
            <select 
              value={formData.category} 
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Level: {formData.level}%</label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={formData.level} 
              onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
              style={{ width: '100%', accentColor: 'var(--green)' }}
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? '⏳ Saving...' : (editing ? '✅ Update' : '✅ Create')}
            </button>
            <button type="button" className="cancel-btn" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="skills-grid-admin">
        {skills.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <div className="empty-icon">🛠️</div>
            <h4>No Skills Added</h4>
            <p>Add your skills to showcase your expertise and technologies you work with.</p>
          </div>
        ) : (
          skills.map(skill => (
            <div key={skill._id} className="skill-card-admin">
              <div className="skill-info">
                <span className="skill-name">{skill.name}</span>
                <span className={`skill-category ${skill.category || 'frontend'}`}>
                  {skill.category || 'frontend'}
                </span>
              </div>
              <div className="skill-level">
                <div className="skill-level-bar">
                  <div className="fill" style={{ width: `${skill.level || 80}%` }}></div>
                </div>
                <span className="skill-level-text">{skill.level || 80}%</span>
              </div>
              <div className="skill-actions">
                <button className="edit-btn" onClick={() => handleEdit(skill)}>✏️</button>
                <button className="delete-btn" onClick={() => handleDelete(skill._id)}>🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageSkills;
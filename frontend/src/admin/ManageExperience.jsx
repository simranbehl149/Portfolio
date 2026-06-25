import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ensureArray } from '../utils/helpers';

const ManageExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ 
    year: '', 
    title: '', 
    company: '', 
    description: '' 
  });

  const token = localStorage.getItem('adminToken');

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/experiences');
      setExperiences(ensureArray(response.data));
    } catch (error) {
      console.error('Error fetching experiences:', error);
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

    if (!formData.year || !formData.title || !formData.company || !formData.description) {
      alert('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    try {
      if (editing) {
        await axios.put(`/api/experiences/${editing}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('✅ Experience updated successfully!');
      } else {
        await axios.post('/api/experiences', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('✅ Experience added successfully!');
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
    setFormData({ year: '', title: '', company: '', description: '' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this experience?')) {
      try {
        await axios.delete(`/api/experiences/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
        alert('✅ Experience deleted successfully!');
      } catch (error) {
        console.error('Error deleting:', error);
        alert('❌ Error deleting experience');
      }
    }
  };

  const handleEdit = (exp) => {
    setEditing(exp._id);
    setFormData({
      year: exp.year || '',
      title: exp.title || '',
      company: exp.company || '',
      description: exp.description || ''
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
          💼 Experience
          <span className="count">{experiences.length}</span>
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
          {showForm ? '❌ Cancel' : '+ Add Experience'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form">
          <h4>{editing ? '✏️ Edit Experience' : '📝 Add New Experience'}</h4>
          
          <div className="form-group">
            <label>Year *</label>
            <input 
              type="text" 
              placeholder="e.g., 2023 - 2024" 
              value={formData.year} 
              onChange={(e) => setFormData({ ...formData, year: e.target.value })} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Title *</label>
            <input 
              type="text" 
              placeholder="e.g., Frontend Developer" 
              value={formData.title} 
              onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Company *</label>
            <input 
              type="text" 
              placeholder="e.g., Mindstay Technology" 
              value={formData.company} 
              onChange={(e) => setFormData({ ...formData, company: e.target.value })} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Description *</label>
            <textarea 
              placeholder="Describe your role and achievements..." 
              rows="4" 
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
              required 
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

      <div className="experience-list-admin">
        {experiences.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💼</div>
            <h4>No Experience Added</h4>
            <p>Add your work experience to showcase your professional journey.</p>
          </div>
        ) : (
          experiences.map(exp => (
            <div key={exp._id} className="experience-card-admin">
              <div className="exp-info">
                <div className="exp-year">{exp.year}</div>
                <div className="exp-title">{exp.title}</div>
                <div className="exp-company">{exp.company}</div>
                <div className="exp-description">{exp.description}</div>
              </div>
              <div className="exp-actions">
                <button className="edit-btn" onClick={() => handleEdit(exp)}>✏️ Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(exp._id)}>🗑️ Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageExperience;
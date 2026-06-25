import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ensureArray } from '../utils/helpers';

const ManageEducation = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ 
    year: '', 
    degree: '', 
    institution: '', 
    description: '' 
  });

  const token = localStorage.getItem('adminToken');

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/education');
      setEducation(ensureArray(response.data));
    } catch (error) {
      console.error('Error fetching education:', error);
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

    if (!formData.year || !formData.degree || !formData.institution || !formData.description) {
      alert('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    try {
      if (editing) {
        await axios.put(`/api/education/${editing}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('✅ Education updated successfully!');
      } else {
        await axios.post('/api/education', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('✅ Education added successfully!');
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
    setFormData({ year: '', degree: '', institution: '', description: '' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this education record?')) {
      try {
        await axios.delete(`/api/education/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
        alert('✅ Education deleted successfully!');
      } catch (error) {
        console.error('Error deleting:', error);
        alert('❌ Error deleting education');
      }
    }
  };

  const handleEdit = (edu) => {
    setEditing(edu._id);
    setFormData({
      year: edu.year || '',
      degree: edu.degree || '',
      institution: edu.institution || '',
      description: edu.description || ''
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
          🎓 Education
          <span className="count">{education.length}</span>
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
          {showForm ? '❌ Cancel' : '+ Add Education'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form">
          <h4>{editing ? '✏️ Edit Education' : '📝 Add New Education'}</h4>
          
          <div className="form-group">
            <label>Year *</label>
            <input 
              type="text" 
              placeholder="e.g., 2020 - 2023" 
              value={formData.year} 
              onChange={(e) => setFormData({ ...formData, year: e.target.value })} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Degree *</label>
            <input 
              type="text" 
              placeholder="e.g., Bachelor of Computer Applications (BCA)" 
              value={formData.degree} 
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Institution *</label>
            <input 
              type="text" 
              placeholder="e.g., CS University, Dehradun" 
              value={formData.institution} 
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Description *</label>
            <textarea 
              placeholder="Describe your studies, achievements, and key learnings..." 
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

      <div className="education-list-admin">
        {education.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎓</div>
            <h4>No Education Added</h4>
            <p>Add your educational qualifications to showcase your academic background.</p>
          </div>
        ) : (
          education.map(edu => (
            <div key={edu._id} className="education-card-admin">
              <div className="edu-info">
                <div className="edu-year">{edu.year}</div>
                <div className="edu-degree">{edu.degree}</div>
                <div className="edu-institution">{edu.institution}</div>
                <div className="edu-description">{edu.description}</div>
              </div>
              <div className="edu-actions">
                <button className="edit-btn" onClick={() => handleEdit(edu)}>✏️ Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(edu._id)}>🗑️ Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageEducation;
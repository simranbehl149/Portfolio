import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageEducation = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ year: '', degree: '', institution: '', description: '' });

  const token = localStorage.getItem('adminToken');

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/education');
      setEducation(response.data);
    } catch (error) {
      console.error('Error fetching education:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`/api/education/${editing}`, formData, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post('/api/education', formData, { headers: { Authorization: `Bearer ${token}` } });
      }
      fetchData();
      setShowForm(false);
      setEditing(null);
      setFormData({ year: '', degree: '', institution: '', description: '' });
    } catch (error) { console.error('Error saving:', error); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this education record?')) {
      await axios.delete(`/api/education/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    }
  };

  if (loading) return <div className="loader"><div className="spinner"></div></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3>Manage Education</h3>
        <button className="btn" onClick={() => { setShowForm(!showForm); setEditing(null); setFormData({ year: '', degree: '', institution: '', description: '' }); }}>
          {showForm ? 'Cancel' : '+ Add Education'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="add-form">
          <h3>{editing ? 'Edit Education' : 'Add Education'}</h3>
          <input type="text" placeholder="Year (e.g., 2020 - 2023)" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} required />
          <input type="text" placeholder="Degree" value={formData.degree} onChange={(e) => setFormData({ ...formData, degree: e.target.value })} required />
          <input type="text" placeholder="Institution" value={formData.institution} onChange={(e) => setFormData({ ...formData, institution: e.target.value })} required />
          <textarea placeholder="Description" rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
          <button type="submit" className="btn">{editing ? 'Update' : 'Create'}</button>
        </form>
      )}

      <div className="admin-table">
        <table>
          <thead><tr><th>Year</th><th>Degree</th><th>Institution</th><th>Actions</th></tr></thead>
          <tbody>
            {education.map(edu => (
              <tr key={edu._id}>
                <td>{edu.year}</td><td>{edu.degree}</td><td>{edu.institution}</td>
                <td><button className="edit-btn" onClick={() => { setEditing(edu._id); setFormData(edu); setShowForm(true); }}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(edu._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageEducation;

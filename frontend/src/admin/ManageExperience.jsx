import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ year: '', title: '', company: '', description: '' });

  const token = localStorage.getItem('adminToken');

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/experiences');
      setExperiences(response.data);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`/api/experiences/${editing}`, formData, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post('/api/experiences', formData, { headers: { Authorization: `Bearer ${token}` } });
      }
      fetchData();
      setShowForm(false);
      setEditing(null);
      setFormData({ year: '', title: '', company: '', description: '' });
    } catch (error) { console.error('Error saving:', error); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this experience?')) {
      await axios.delete(`/api/experiences/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    }
  };

  if (loading) return <div className="loader"><div className="spinner"></div></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3>Manage Experience</h3>
        <button className="btn" onClick={() => { setShowForm(!showForm); setEditing(null); setFormData({ year: '', title: '', company: '', description: '' }); }}>
          {showForm ? 'Cancel' : '+ Add Experience'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="add-form">
          <h3>{editing ? 'Edit Experience' : 'Add Experience'}</h3>
          <input type="text" placeholder="Year (e.g., 2023 - 2024)" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} required />
          <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          <input type="text" placeholder="Company" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} required />
          <textarea placeholder="Description" rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
          <button type="submit" className="btn">{editing ? 'Update' : 'Create'}</button>
        </form>
      )}

      <div className="admin-table">
        <table>
          <thead><tr><th>Year</th><th>Title</th><th>Company</th><th>Actions</th></tr></thead>
          <tbody>
            {experiences.map(exp => (
              <tr key={exp._id}>
                <td>{exp.year}</td><td>{exp.title}</td><td>{exp.company}</td>
                <td><button className="edit-btn" onClick={() => { setEditing(exp._id); setFormData(exp); setShowForm(true); }}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(exp._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageExperience;
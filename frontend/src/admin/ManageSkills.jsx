import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: 'Technical', level: 80 });

  const token = localStorage.getItem('adminToken');

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/skills');
      setSkills(response.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`/api/skills/${editing}`, formData, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post('/api/skills', formData, { headers: { Authorization: `Bearer ${token}` } });
      }
      fetchData();
      setShowForm(false);
      setEditing(null);
      setFormData({ name: '', category: 'Technical', level: 80 });
    } catch (error) { console.error('Error saving:', error); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this skill?')) {
      await axios.delete(`/api/skills/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    }
  };

  if (loading) return <div className="loader"><div className="spinner"></div></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3>Manage Skills</h3>
        <button className="btn" onClick={() => { setShowForm(!showForm); setEditing(null); setFormData({ name: '', category: 'Technical', level: 80 }); }}>
          {showForm ? 'Cancel' : '+ Add Skill'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="add-form">
          <h3>{editing ? 'Edit Skill' : 'Add Skill'}</h3>
          <input type="text" placeholder="Skill Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
            <option>Technical</option><option>Soft Skills</option><option>Design</option>
          </select>
          <input type="number" placeholder="Level (0-100)" value={formData.level} onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })} />
          <button type="submit" className="btn">{editing ? 'Update' : 'Create'}</button>
        </form>
      )}

      <div className="admin-table">
        <table>
          <thead><tr><th>Skill</th><th>Category</th><th>Level</th><th>Actions</th></tr></thead>
          <tbody>
            {skills.map(skill => (
              <tr key={skill._id}>
                <td>{skill.name}</td><td>{skill.category}</td><td>{skill.level}%</td>
                <td><button className="edit-btn" onClick={() => { setEditing(skill._id); setFormData(skill); setShowForm(true); }}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(skill._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageSkills;
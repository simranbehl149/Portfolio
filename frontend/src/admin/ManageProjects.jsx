import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ensureArray } from '../utils/helpers';

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '', 
    category: '', 
    description: '', 
    technologies: '', 
    liveUrl: '', 
    githubUrl: '', 
    featured: false,
    images: []
  });

  const token = localStorage.getItem('adminToken');

  // Image compression function
  const compressImage = (dataUrl, maxWidth = 800, maxHeight = 600, quality = 0.7) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = dataUrl;
    });
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/projects');
      setProjects(ensureArray(response.data));
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    const compressedImages = [];
    
    for (const file of files) {
      const reader = new FileReader();
      const dataUrl = await new Promise((resolve) => {
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
      
      const compressed = await compressImage(dataUrl, 800, 600, 0.7);
      compressedImages.push(compressed);
    }
    
    setFormData({ ...formData, images: [...formData.images, ...compressedImages] });
    setPreviewImages([...previewImages, ...compressedImages]);
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
    
    const newPreview = [...previewImages];
    newPreview.splice(index, 1);
    setPreviewImages(newPreview);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!formData.title || !formData.description || !formData.technologies) {
      alert('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    const data = { 
      ...formData, 
      images: formData.images,
      technologies: formData.technologies.split(',').map(t => t.trim()).filter(t => t !== '')
    };
    
    try {
      if (editing) {
        await axios.put(`/api/projects/${editing}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('✅ Project updated successfully!');
      } else {
        await axios.post('/api/projects', data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('✅ Project created successfully!');
      }
      
      fetchProjects();
      resetForm();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('❌ Error: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditing(null);
    setFormData({ 
      title: '', 
      category: '', 
      description: '', 
      technologies: '', 
      liveUrl: '', 
      githubUrl: '', 
      featured: false,
      images: []
    });
    setPreviewImages([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchProjects();
        alert('✅ Project deleted successfully!');
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('❌ Error deleting project');
      }
    }
  };

  const handleEdit = (project) => {
    setEditing(project._id);
    setFormData({
      title: project.title || '',
      category: project.category || '',
      description: project.description || '',
      technologies: project.technologies ? project.technologies.join(', ') : '',
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      featured: project.featured || false,
      images: project.images || []
    });
    setPreviewImages(project.images || []);
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
          📁 Projects
          <span className="count">{projects.length}</span>
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
          {showForm ? '❌ Cancel' : '+ Add Project'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form">
          <h4>{editing ? '✏️ Edit Project' : '📝 Add New Project'}</h4>
          
          <div className="form-row">
            <div className="form-group">
              <label>Title *</label>
              <input 
                type="text" 
                placeholder="Project Title" 
                value={formData.title} 
                onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input 
                type="text" 
                placeholder="Category" 
                value={formData.category} 
                onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Description *</label>
            <textarea 
              placeholder="Project Description" 
              rows="3" 
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Technologies * (comma separated)</label>
            <input 
              type="text" 
              placeholder="React, Node.js, MongoDB" 
              value={formData.technologies} 
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })} 
              required 
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Live URL</label>
              <input 
                type="text" 
                placeholder="https://your-project.com" 
                value={formData.liveUrl} 
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })} 
              />
            </div>
            <div className="form-group">
              <label>GitHub URL</label>
              <input 
                type="text" 
                placeholder="https://github.com/username/repo" 
                value={formData.githubUrl} 
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })} 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Project Images</label>
            <div className="image-upload-area" onClick={() => fileInputRef.current?.click()}>
              <div className="upload-icon">📷</div>
              <div className="upload-text">Click to upload images (max 5)</div>
              <input 
                type="file" 
                accept="image/*"
                multiple
                ref={fileInputRef}
                onChange={handleImageChange}
                disabled={formData.images.length >= 5}
              />
            </div>
            
            {previewImages.length > 0 && (
              <div className="image-preview-grid">
                {previewImages.map((img, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={img} alt={`Preview ${index + 1}`} />
                    <button type="button" className="remove-image" onClick={() => removeImage(index)}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <small style={{ color: 'var(--gray)' }}>
              {previewImages.length} / 5 images uploaded
            </small>
          </div>

          <div className="checkbox-group">
            <input 
              type="checkbox" 
              checked={formData.featured} 
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} 
            />
            <label>⭐ Featured Project (shows on homepage)</label>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? '⏳ Saving...' : (editing ? '✅ Update Project' : '✅ Create Project')}
            </button>
            <button type="button" className="cancel-btn" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Images</th>
              <th>Title</th>
              <th>Category</th>
              <th>Technologies</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(project => (
              <tr key={project._id}>
                <td>
                  <div className="image-thumbnails">
                    {project.images && project.images.length > 0 ? (
                      <>
                        {project.images.slice(0, 2).map((img, idx) => (
                          <img key={idx} src={img} alt={project.title} />
                        ))}
                        {project.images.length > 2 && (
                          <span className="more-images">+{project.images.length - 2}</span>
                        )}
                      </>
                    ) : (
                      <span style={{ color: 'var(--gray)', fontSize: '0.8rem' }}>No images</span>
                    )}
                  </div>
                </td>
                <td><strong>{project.title}</strong></td>
                <td>{project.category || '-'}</td>
                <td>{project.technologies?.join(', ') || '-'}</td>
                <td>
                  {project.featured ? (
                    <span className="status-badge featured">⭐ Featured</span>
                  ) : (
                    <span style={{ color: 'var(--gray)' }}>Standard</span>
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="edit-btn" onClick={() => handleEdit(project)}>✏️ Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(project._id)}>🗑️ Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProjects;
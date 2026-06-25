import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        
        // Calculate new dimensions
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        // Create canvas and compress
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
      setProjects(response.data);
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
      
      // Compress image
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
    
    // Validate required fields
    if (!formData.title || !formData.description || !formData.technologies) {
      alert('Please fill in all required fields (Title, Description, Technologies)');
      setIsSubmitting(false);
      return;
    }

    // Compress images if there are too many or too large
    let imagesToSave = formData.images;
    if (imagesToSave.length > 0) {
      // Compress all images again if needed
      const compressed = await Promise.all(
        imagesToSave.map(img => compressImage(img, 600, 400, 0.6))
      );
      imagesToSave = compressed;
    }

    const data = { 
      ...formData, 
      images: imagesToSave,
      technologies: formData.technologies.split(',').map(t => t.trim()).filter(t => t !== '')
    };
    
    console.log('Submitting data with images:', data.images.length);

    try {
      let response;
      if (editing) {
        response = await axios.put(`/api/projects/${editing}`, data, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        alert('✅ Project updated successfully!');
      } else {
        response = await axios.post('/api/projects', data, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        alert('✅ Project created successfully!');
      }
      
      await fetchProjects();
      
      // Reset form
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
      
    } catch (error) {
      console.error('Error saving project:', error);
      if (error.response?.status === 413) {
        alert('❌ Images are too large. Please use smaller images (max 200KB each).');
      } else {
        alert('❌ Error: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        await fetchProjects();
        alert('✅ Project deleted successfully!');
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('❌ Error deleting project: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleEdit = (project) => {
    console.log('Editing project:', project);
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

  const cancelEdit = () => {
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

  if (loading) return <div className="loader"><div className="spinner"></div></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h3>Manage Projects ({projects.length})</h3>
        <button className="btn" onClick={() => {
          cancelEdit();
          setShowForm(true);
        }}>
          {showForm ? '❌ Cancel' : '+ Add Project'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="add-form" style={{ 
          background: 'var(--card-bg)',
          padding: '2rem',
          borderRadius: '16px',
          marginBottom: '2rem'
        }}>
          <h3 style={{ marginBottom: '1.5rem' }}>
            {editing ? '✏️ Edit Project' : '📝 Add New Project'}
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="Title *" 
              value={formData.title} 
              onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
              required 
              style={{ padding: '12px' }}
            />
            <input 
              type="text" 
              placeholder="Category" 
              value={formData.category} 
              onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
              style={{ padding: '12px' }}
            />
          </div>
          
          <textarea 
            placeholder="Description *" 
            rows="3" 
            value={formData.description} 
            onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
            required 
            style={{ padding: '12px', width: '100%' }}
          />
          
          <input 
            type="text" 
            placeholder="Technologies (comma separated) *" 
            value={formData.technologies} 
            onChange={(e) => setFormData({ ...formData, technologies: e.target.value })} 
            required 
            style={{ padding: '12px', width: '100%' }}
          />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="Live URL" 
              value={formData.liveUrl} 
              onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })} 
              style={{ padding: '12px' }}
            />
            <input 
              type="text" 
              placeholder="GitHub URL" 
              value={formData.githubUrl} 
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })} 
              style={{ padding: '12px' }}
            />
          </div>

          {/* Multiple Image Upload */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--light-gray)' }}>
              Project Images (Select multiple, max 5 images):
            </label>
            <input 
              type="file" 
              accept="image/*"
              multiple
              ref={fileInputRef}
              onChange={handleImageChange}
              style={{ color: 'var(--white)' }}
              disabled={formData.images.length >= 5}
            />
            {formData.images.length >= 5 && (
              <p style={{ color: '#ff4444', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                Maximum 5 images allowed
              </p>
            )}
            
            {previewImages.length > 0 && (
              <div style={{ 
                marginTop: '1rem', 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: '0.5rem'
              }}>
                {previewImages.map((img, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <img 
                      src={img} 
                      alt={`Preview ${index + 1}`} 
                      style={{ 
                        width: '100%', 
                        height: '80px', 
                        objectFit: 'cover', 
                        borderRadius: '8px',
                        border: '2px solid var(--green)'
                      }} 
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        background: '#ef4444',
                        border: 'none',
                        color: 'white',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p style={{ fontSize: '0.8rem', color: 'var(--gray)', marginTop: '0.5rem' }}>
              {previewImages.length} / 5 images uploaded
            </p>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
            <input 
              type="checkbox" 
              checked={formData.featured} 
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} 
            />
            ⭐ Featured Project (shows on homepage)
          </label>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn" style={{ flex: 1 }} disabled={isSubmitting}>
              {isSubmitting ? '⏳ Saving...' : (editing ? '✅ Update Project' : '✅ Create Project')}
            </button>
            <button type="button" className="btn" onClick={cancelEdit} style={{ 
              background: 'transparent', 
              border: '2px solid var(--gray)',
              color: 'var(--gray)',
              flex: 0.5
            }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>Images</th>
              <th>Title</th>
              <th>Category</th>
              <th>Technologies</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(project => (
              <tr key={project._id}>
                <td>
                  {project.images && project.images.length > 0 ? (
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {project.images.slice(0, 3).map((img, idx) => (
                        <img 
                          key={idx}
                          src={img} 
                          alt={project.title} 
                          style={{ 
                            width: '40px', 
                            height: '40px', 
                            objectFit: 'cover', 
                            borderRadius: '4px',
                            border: '1px solid var(--green)'
                          }} 
                        />
                      ))}
                      {project.images.length > 3 && (
                        <span style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          width: '40px',
                          height: '40px',
                          background: 'var(--secondary)',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          color: 'var(--gray)'
                        }}>
                          +{project.images.length - 3}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span style={{ color: 'var(--gray)', fontSize: '0.8rem' }}>No images</span>
                  )}
                </td>
                <td><strong>{project.title}</strong></td>
                <td>{project.category}</td>
                <td>{project.technologies?.join(', ') || '-'}</td>
                <td>{project.featured ? '⭐ Yes' : 'No'}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(project)}>✏️ Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(project._id)}>🗑️ Delete</button>
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
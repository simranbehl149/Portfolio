import React, { useState } from 'react';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await api.post('/contact', formData);
      setStatus({ type: 'success', message: '✅ Message sent successfully!' });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus({ type: 'error', message: '❌ Failed to send message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <h2>Contact <span>Me</span></h2>
        <div className="contact-grid">
          <div className="contact-info">
            <h3>Let's Connect</h3>
            <p>I'm always excited to work on new projects. Feel free to reach out!</p>
            <div className="contact-detail">
              <i className="ph ph-envelope"></i>
              <span>simranbehl495@gmail.com</span>
            </div>
            <div className="contact-detail">
              <i className="ph ph-phone"></i>
              <span>+91 8427690277</span>
            </div>
            <div className="contact-detail">
              <i className="ph ph-map-pin"></i>
              <span>Punjab, India</span>
            </div>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} required></textarea>
            </div>
            {status.message && (
              <div style={{
                padding: '10px',
                borderRadius: '5px',
                marginBottom: '1rem',
                background: status.type === 'success' ? 'rgba(124, 240, 61, 0.2)' : 'rgba(255, 0, 0, 0.2)',
                color: status.type === 'success' ? '#7cf03d' : '#ff4444'
              }}>
                {status.message}
              </div>
            )}
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
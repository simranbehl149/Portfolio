import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('adminToken');

  const fetchContacts = async () => {
    try {
      const response = await axios.get('/api/contacts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchContacts, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/contacts/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchContacts();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const deleteMessage = async (id) => {
    if (window.confirm('Delete this message?')) {
      try {
        await axios.delete(`/api/contacts/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchContacts();
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  const unreadCount = contacts.filter(c => !c.read).length;

  if (loading) return <div className="loader"><div className="spinner"></div></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3>Contact Messages {unreadCount > 0 && (
          <span style={{ 
            background: '#ef4444', 
            color: 'white', 
            padding: '2px 10px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            marginLeft: '10px'
          }}>
            {unreadCount} New
          </span>
        )}</h3>
        <button className="btn" onClick={fetchContacts} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
          🔄 Refresh
        </button>
      </div>

      <div className="admin-table">
        {contacts.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray)' }}>
            No messages yet. When someone contacts you, it will appear here.
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map(contact => (
                <tr key={contact._id} style={!contact.read ? { background: 'rgba(124, 240, 61, 0.05)' } : {}}>
                  <td>
                    {!contact.read ? (
                      <span style={{ 
                        display: 'inline-block', 
                        width: '10px', 
                        height: '10px', 
                        background: '#7cf03d', 
                        borderRadius: '50%' 
                      }}></span>
                    ) : (
                      <span style={{ color: 'var(--gray)' }}>✓ Read</span>
                    )}
                  </td>
                  <td><strong>{contact.name}</strong></td>
                  <td><a href={`mailto:${contact.email}`} style={{ color: 'var(--green)' }}>{contact.email}</a></td>
                  <td style={{ maxWidth: '200px' }}>
                    <div style={{ 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap' 
                    }} title={contact.message}>
                      {contact.message}
                    </div>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>
                    {new Date(contact.createdAt).toLocaleDateString()} 
                    <br />
                    {new Date(contact.createdAt).toLocaleTimeString()}
                  </td>
                  <td>
                    {!contact.read && (
                      <button className="edit-btn" onClick={() => markAsRead(contact._id)}>
                        Mark Read
                      </button>
                    )}
                    <button className="delete-btn" onClick={() => deleteMessage(contact._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageContacts;
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
      setContacts(response.data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
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
          📩 Messages
          {unreadCount > 0 && <span className="count">{unreadCount} unread</span>}
        </h3>
        <button className="add-btn" onClick={fetchContacts}>
          🔄 Refresh
        </button>
      </div>

      <div className="admin-table-container">
        {contacts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h4>No Messages Yet</h4>
            <p>When someone contacts you, it will appear here.</p>
          </div>
        ) : (
          <table className="admin-table">
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
                      <span className="unread-indicator"></span>
                    ) : (
                      <span className="status-badge read">✓ Read</span>
                    )}
                  </td>
                  <td><strong>{contact.name}</strong></td>
                  <td><a href={`mailto:${contact.email}`} style={{ color: 'var(--green)' }}>{contact.email}</a></td>
                  <td className="message-preview" title={contact.message}>
                    {contact.message}
                  </td>
                  <td style={{ fontSize: '0.8rem' }}>
                    {new Date(contact.createdAt).toLocaleDateString()}
                    <br />
                    {new Date(contact.createdAt).toLocaleTimeString()}
                  </td>
                  <td>
                    <div className="action-buttons">
                      {!contact.read && (
                        <button className="read-btn" onClick={() => markAsRead(contact._id)}>
                          ✓ Mark Read
                        </button>
                      )}
                      <button className="delete-btn" onClick={() => deleteMessage(contact._id)}>
                        🗑️ Delete
                      </button>
                    </div>
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
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaSave, FaTimes, FaUser, FaEnvelope, FaPhone, FaBox, FaComment, FaCalendar } from "react-icons/fa";
import "./ManageContacts.css";

const ManageContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [search, setSearch] = useState("");

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/contact");
      if (!res.ok) throw new Error("Failed to fetch contacts");

      const result = await res.json();
      setContacts(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error(err);
      setError("Unable to load contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Filter contacts based on search
  const filteredContacts = contacts.filter(contact => {
    const searchLower = search.toLowerCase();
    return (
      contact.first_name?.toLowerCase().includes(searchLower) ||
      contact.last_name?.toLowerCase().includes(searchLower) ||
      contact.email?.toLowerCase().includes(searchLower) ||
      contact.phone?.includes(search) ||
      contact.product_interest?.toLowerCase().includes(searchLower) ||
      contact.message?.toLowerCase().includes(searchLower)
    );
  });

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?"))
      return;
    try {
      const res = await fetch(`http://localhost:5000/api/contact/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Delete failed");

      setContacts(contacts.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete contact");
    }
  };

  // Edit
  const handleEdit = (contact) => {
    setEditingId(contact.id);
    setEditData({
      first_name: contact.first_name,
      last_name: contact.last_name,
      email: contact.email,
      phone: contact.phone,
      product_interest: contact.product_interest || "",
      message: contact.message,
    });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/contact/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: editData.first_name,
          lastName: editData.last_name,
          email: editData.email,
          phone: editData.phone,
          productInterest: editData.product_interest,
          message: editData.message,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Update failed");

      setContacts(contacts.map((c) => (c.id === id ? result.data[0] : c)));
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update contact");
    }
  };

  const handleCancelEdit = () => setEditingId(null);

  return (
    <div className="manage-contacts">
      <div className="contacts-header">
        <div className="header-left">
          <h2><FaUser className="header-icon" /> Contact Messages</h2>
          <p className="contacts-count">{filteredContacts.length} Messages Found</p>
        </div>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="search-icon">🔍</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="contacts-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <FaEnvelope />
          </div>
          <div className="stat-info">
            <h3>{contacts.length}</h3>
            <p>Total Messages</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaCalendar />
          </div>
          <div className="stat-info">
            <h3>{new Date().getDate()}</h3>
            <p>Today</p>
          </div>
        </div>
      </div>

      {/* Loading shimmer */}
      {loading && (
        <div className="loading-wrapper">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="loading-row"></div>
          ))}
        </div>
      )}

      {!loading && error && <p className="error-text">{error}</p>}
      {!loading && filteredContacts.length === 0 && (
        <div className="no-data">
          <div className="no-data-icon">📭</div>
          <h3>No messages found</h3>
          <p>No contact messages have been received yet.</p>
        </div>
      )}

      {!loading && filteredContacts.length > 0 && (
        <div className="table-wrapper">
          <table className="contacts-table">
            <thead>
              <tr>
                <th><FaUser /> Name</th>
                <th><FaEnvelope /> Email</th>
                <th><FaPhone /> Phone</th>
                <th><FaBox /> Product Interest</th>
                <th><FaComment /> Message</th>
                <th>Date</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((c) => (
                <tr key={c.id || `${c.email}-${c.created_at}`} className={editingId === c.id ? "editing-row" : ""}>
                  <td data-label="Name">
                    <div className="contact-name">
                      {editingId === c.id ? (
                        <div className="edit-field">
                          <input
                            name="first_name"
                            value={editData.first_name}
                            onChange={handleEditChange}
                            placeholder="First Name"
                          />
                          <input
                            name="last_name"
                            value={editData.last_name}
                            onChange={handleEditChange}
                            placeholder="Last Name"
                          />
                        </div>
                      ) : (
                        <>
                          <div className="name-display">
                            <strong>{c.first_name} {c.last_name}</strong>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                  <td data-label="Email">
                    {editingId === c.id ? (
                      <input
                        name="email"
                        value={editData.email}
                        onChange={handleEditChange}
                        type="email"
                      />
                    ) : (
                      <a href={`mailto:${c.email}`} className="email-link">
                        {c.email}
                      </a>
                    )}
                  </td>
                  <td data-label="Phone">
                    {editingId === c.id ? (
                      <input
                        name="phone"
                        value={editData.phone}
                        onChange={handleEditChange}
                        type="tel"
                      />
                    ) : (
                      <a href={`tel:${c.phone}`} className="phone-link">
                        {c.phone}
                      </a>
                    )}
                  </td>
                  <td data-label="Product">
                    {editingId === c.id ? (
                      <input
                        name="product_interest"
                        value={editData.product_interest}
                        onChange={handleEditChange}
                      />
                    ) : (
                      <span className={`product-tag ${c.product_interest ? '' : 'no-product'}`}>
                        {c.product_interest || "Not specified"}
                      </span>
                    )}
                  </td>
                  <td data-label="Message">
                    {editingId === c.id ? (
                      <textarea
                        name="message"
                        value={editData.message}
                        onChange={handleEditChange}
                        rows="3"
                      />
                    ) : (
                      <div className="message-preview">
                        {c.message.length > 100 ? `${c.message.substring(0, 100)}...` : c.message}
                      </div>
                    )}
                  </td>
                  <td data-label="Date">
                    <div className="date-display">
                      <div className="date">
                        {c.created_at
                          ? new Date(c.created_at).toLocaleDateString()
                          : "-"}
                      </div>
                      <div className="time">
                        {c.created_at
                          ? new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : ""}
                      </div>
                    </div>
                  </td>
                  <td className="actions-col" data-label="Actions">
                    {editingId === c.id ? (
                      <div className="edit-actions">
                        <button
                          className="btn save"
                          onClick={() => handleEditSave(c.id)}
                        >
                          <FaSave /> Save
                        </button>
                        <button
                          className="btn cancel"
                          onClick={handleCancelEdit}
                        >
                          <FaTimes /> Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="action-buttons">
                        <button
                          className="btn edit"
                          onClick={() => handleEdit(c)}
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          className="btn delete"
                          onClick={() => handleDelete(c.id)}
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageContacts;
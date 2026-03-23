import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash, FaUser, FaInfoCircle, FaUpload, FaTimes, FaAward } from "react-icons/fa";
import "./ManageImages.css"; // Reuse styling

const ManageAbout = () => {
  const [team, setTeam] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // ================= FETCH TEAM =================
  const fetchTeam = async () => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || "https://dairy-backend-g9m2.onrender.com";
      const res = await axios.get(`${API_URL}/api/about`);
      
      // Handle different response structures gracefully
      const teamData = res.data.data || (Array.isArray(res.data) ? res.data : []);
      setTeam(Array.isArray(teamData) ? teamData : []);
    } catch (err) {
      console.error(err);
      setTeam([]); // Ensure team is always an array
      alert("Failed to fetch team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  // Filter team
  const filteredTeam = Array.isArray(team) ? team.filter(member => 
    member.name?.toLowerCase().includes(search.toLowerCase()) ||
    member.role?.toLowerCase().includes(search.toLowerCase()) ||
    member.bio?.toLowerCase().includes(search.toLowerCase())
  ) : [];

  // ================= ADD / UPDATE TEAM MEMBER =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("role", role);
    formData.append("experience", experience);
    formData.append("bio", bio);
    if (image) formData.append("image", image);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "https://dairy-backend-g9m2.onrender.com";
      if (editingId) {
        await axios.put(
          `${API_URL}/api/about/${editingId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
        alert("Team member updated successfully");
      } else {
        if (!image) return alert("Image is required");
        await axios.post(`${API_URL}/api/about`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Team member added successfully");
      }

      resetForm();
      fetchTeam();
    } catch (err) {
      console.error(err);
      alert("Operation failed");
    }
  };

  // ================= EDIT =================
  const handleEdit = (member) => {
    setEditingId(member.id);
    setName(member.name);
    setRole(member.role);
    setExperience(member.experience || "");
    setBio(member.bio || "");
    setImagePreview(member.image);
    setImage(null);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this team member?")) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL || "https://dairy-backend-g9m2.onrender.com";
      await axios.delete(`${API_URL}/api/about/${id}`);
      alert("Team member deleted successfully");
      fetchTeam();
    } catch (err) {
      console.error(err);
      alert("Failed to delete team member");
    }
  };

  // ================= IMAGE HANDLING =================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setRole("");
    setExperience("");
    setBio("");
    setImage(null);
    setImagePreview("");
  };

  return (
    <div className="manage-about-admin">
      {/* Header */}
      <div className="about-admin-header">
        <div className="header-left">
          <h2><FaInfoCircle className="header-icon" /> Manage About Page</h2>
          <p className="product-count">Total Team Members: {team.length}</p>
        </div>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search team..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="search-icon">🔍</div>
        </div>
      </div>

      {/* Form Section */}
      <div className="about-admin-form-section">
        <div className="form-card">
          <div className="form-header">
            <h3>{editingId ? "Update Team Member" : "Add New Team Member"}</h3>
            {editingId && (
              <button className="cancel-btn" onClick={resetForm}>
                <FaTimes /> Cancel
              </button>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="about-admin-form">
            <div className="form-grid">
              <div className="form-group">
                <label><FaUser /> Name</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label><FaInfoCircle /> Role / Designation</label>
                <input
                  type="text"
                  placeholder="e.g., Co-Founder & CEO"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label><FaAward /> Experience</label>
                <input
                  type="text"
                  placeholder="e.g., 20+ Years"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label><FaInfoCircle /> Bio / Description</label>
                <textarea
                  placeholder="Tell something about the team member..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows="3"
                />
              </div>

              <div className="form-group full-width">
                <label><FaUpload /> Profile Photo</label>
                <div className="image-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    id="image-upload-about"
                  />
                  <label htmlFor="image-upload-about" className="upload-btn">
                    <FaUpload /> Choose Photo
                  </label>
                  <span className="file-name">
                    {image ? image.name : "No file chosen"}
                  </span>
                </div>
                
                {(imagePreview || editingId) && (
                  <div className="image-preview">
                    <img 
                      src={imagePreview || team.find(m => m.id === editingId)?.image} 
                      alt="Preview" 
                    />
                    <div className="preview-label">Photo Preview</div>
                  </div>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn" style={{backgroundColor: "var(--panchmev-red)"}}>
                <FaPlus /> {editingId ? "Update Member" : "Add Member"}
              </button>
              <button type="button" className="reset-btn" onClick={resetForm}>
                Reset Form
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Team Content */}
      <div className="about-admin-list-section">
        <div className="section-header">
          <h3>Panchmev Team</h3>
          <p className="showing-count">Showing {filteredTeam.length} members</p>
        </div>

        {loading ? (
          <div className="loading-wrapper">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="loading-row"></div>
            ))}
          </div>
        ) : filteredTeam.length === 0 ? (
          <div className="no-products">
            <div className="no-products-icon">👥</div>
            <h4>No team members found</h4>
            <p>{search ? "Try a different search term" : "Add your first team member using the form above"}</p>
          </div>
        ) : (
          <div className="about-admin-team-grid">
            {filteredTeam.map((member) => (
              <div className="about-admin-member-card" key={member.id}>
                <div className="about-admin-member-image">
                  <img src={member.image} alt={member.name} />
                  <span className="product-category">{member.experience} EXP</span>
                </div>
                <div className="about-admin-member-info">
                  <h4>{member.name}</h4>
                  <p className="team-role-admin" style={{color: "var(--panchmev-red)", fontWeight: "bold", fontSize: "0.9rem", marginBottom: "10px"}}>{member.role}</p>
                  <p className="product-desc">{member.bio}</p>
                </div>
                <div className="about-admin-member-actions">
                  <button className="action-btn edit" onClick={() => handleEdit(member)}>
                    <FaEdit /> Edit
                  </button>
                  <button className="action-btn delete" onClick={() => handleDelete(member.id)}>
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAbout;

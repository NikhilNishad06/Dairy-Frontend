import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { FaTachometerAlt, FaImages, FaUsers, FaInfoCircle, FaBars, FaHome, FaProductHunt, FaSignOutAlt } from "react-icons/fa";
import { supabase } from "../supabaseClient";
import "./AdminLayout.css";

const AdminLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="admin-wrapper">
      {open && (
        <div className="sidebar-overlay" onClick={() => setOpen(false)} />
      )}

      <aside className={`admin-sidebar ${open ? "open" : ""}`}>
        <div className="admin-logo">
          <div className="logo-brand">
            <span className="logo-panchmev">PANCHMEV</span>
            <span className="logo-admin">ADMIN PANEL</span>
          </div>
        </div>

        <div className="admin-menu">
          <NavLink
            to="/admin-dashboard"
            className="menu-link"
            onClick={() => setOpen(false)}
          >
            <FaTachometerAlt className="menu-icon" />
            <span>Dashboard</span>
          </NavLink>

          {/* ... */}

          <NavLink
            to="/admin/manage-images"
            className="menu-link"
            onClick={() => setOpen(false)}
          >
            <FaImages className="menu-icon" />
            <span>Manage Product</span>
          </NavLink>

          <NavLink
            to="/admin/manage-contacts"
            className="menu-link"
            onClick={() => setOpen(false)}
          >
            <FaUsers className="menu-icon" />
            <span>Manage Contacts</span>
          </NavLink>

          {/* ... */}


        </div>

        <div className="sidebar-footer">
          <NavLink to="/" className="home-link" onClick={() => setOpen(false)}>
            <FaHome className="home-icon" />
            <span>Back to Website</span>
          </NavLink>

          <button
            className="logout-btn"
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/login";
            }}
          >
            <FaSignOutAlt className="logout-icon" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <button className="menu-toggle" onClick={() => setOpen(true)}>
            <FaBars />
          </button>
          <div className="header-content">
            <h2>Admin Dashboard</h2>
            <p className="welcome-text">Welcome to Panchmev Admin Panel</p>
          </div>
          <div className="header-actions">
            <div className="admin-badge">
              <span className="admin-role">Administrator</span>
              <span className="admin-status">● Online</span>
            </div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser, FaSignOutAlt, FaColumns } from "react-icons/fa";
import { supabase } from "../supabaseClient";
import "./Navbar.css";

const Navbar = () => {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchRole(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchRole(session.user.id);
      else setRole(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchRole = async (userId) => {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();
    if (!error && data) setRole(data.role);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg glass-navbar fixed-top">
      <div className="container navbar-box">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img src="/punchmew.jpg" alt="Panchmev Logo" />
          <span className="brand-text">PANCHMEV</span>
        </Link>

        {/* Toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-4">
            {session && ["Home", "About", "Products", "Contact"].map((item) => (
              <li className="nav-item" key={item}>
                <Link
                  className="nav-link fancy-link"
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                >
                  {item}
                </Link>
              </li>
            ))}

            {!session ? (
              <>
                <li className="nav-item mt-3 mt-lg-0">
                  <Link className="btn login-btn" to="/login">
                    <FaUser className="me-2" />
                    Login
                  </Link>
                </li>
                <li className="nav-item mt-3 mt-lg-0">
                  <Link className="btn order-btn" to="/signup">
                    Signup
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item mt-3 mt-lg-0">
                  <Link
                    className="nav-link fancy-link d-flex align-items-center"
                    to={role === 'admin' ? "/admin-dashboard" : "/dashboard"}
                  >
                    <FaColumns className="me-2" />
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item mt-3 mt-lg-0">
                  <button className="btn login-btn" onClick={handleLogout}>
                    <FaSignOutAlt className="me-2" />
                    Logout
                  </button>
                </li>
              </>
            )}

            {/* Order Button */}
            <li className="nav-item ms-lg-2 mt-3 mt-lg-0">
              <Link className="btn order-btn" to="/contact">
                <FaShoppingCart className="me-2" />
                Order Now
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
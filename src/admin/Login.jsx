import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiLock, FiEye, FiEyeOff, FiCoffee, FiMail } from "react-icons/fi";
import { supabase } from "../supabaseClient";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profile?.role === 'admin') navigate("/admin-dashboard");
        else navigate("/dashboard");
      }
    };
    checkUser();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Fetch role from users table
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      if (profileError) throw profileError;

      if (profile.role === 'admin') {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Background Elements with Traditional Indian Patterns */}
      <div className="traditional-pattern pattern-1"></div>
      <div className="traditional-pattern pattern-2"></div>
      <div className="traditional-pattern pattern-3"></div>

      {/* Decorative Elements */}
      <div className="decorative-element spice-1"></div>
      <div className="decorative-element spice-2"></div>
      <div className="decorative-element spice-3"></div>

      {/* Main Login Card */}
      <div className="login-card">
        {/* Logo/Header Section */}
        <div className="login-header">
          <div className="logo-container">
            <div className="logo-icon">
              <FiCoffee className="logo-svg" />
            </div>
            <div className="logo-text-section">
              <h1 className="logo-main">PANCHMEV</h1>
              <div className="logo-subtitle">
                <span className="logo-food">FOOD&PRODUCT</span>
                <span className="logo-traditional">MADE WITH TRADITIONAL INDIAN METHODS</span>
              </div>
            </div>
          </div>

          <div className="welcome-section">
            <p className="welcome-text">Welcome Back</p>
            <p className="subtitle">Authentic Taste, Modern Management</p>
          </div>
        </div>

        {/* Divider */}
        <div className="divider">
          <span className="divider-line"></span>
          <span className="divider-icon">🪔</span>
          <span className="divider-line"></span>
        </div>

        {/* Login Form */}
        {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}
        <form onSubmit={handleLogin} className="login-form">
          {/* Email Field */}
          <div className="input-group">
            <div className="input-icon">
              <FiMail />
            </div>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-input"
              disabled={isLoading}
            />
            <div className="input-border"></div>
          </div>

          {/* Password Field */}
          <div className="input-group">
            <div className="input-icon">
              <FiLock />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
              disabled={isLoading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
            <div className="input-border"></div>
          </div>

          <div className="text-center mt-3">
            <p className="subtitle">
              Don't have an account? <Link to="/signup" className="text-primary text-decoration-none">Sign Up</Link>
            </p>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner"></span>
            ) : (
              <>
                Sign In
                <span className="button-icon">→</span>
              </>
            )}
          </button>

          {/* Demo Credentials Hint */}
          {/* <div className="demo-credentials">
            <div className="credentials-header">
              <span className="credentials-icon">🔑</span>
              <span>Demo Credentials</span>
            </div>
            <div className="credentials-list">
              <div className="credential-item">
                <span className="credential-label">Username:</span>
                <span className="credential-value">vinay</span>
              </div>
              <div className="credential-item">
                <span className="credential-label">Password:</span>
                <span className="credential-value">vinay123</span>
              </div>
            </div>
          </div> */}

          {/* Footer */}
          <div className="login-footer">
            <div className="footer-content">
              <span className="footer-icon">🌿</span>
              <p>
                Preserving Tradition Since 2024 •
                <span className="footer-highlight"> Authentic Indian Products</span>
              </p>
              <span className="footer-icon">🌿</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
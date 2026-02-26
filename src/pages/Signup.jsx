import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserPlus, FaEnvelope, FaLock, FaUser, FaArrowRight } from "react-icons/fa";
import { supabase } from "../supabaseClient";
import "./Signup.css";

const Signup = () => {
    const [formData, setFormData] = useState({ email: "", password: "", fullName: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const { data, error: signupError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: { data: { full_name: formData.fullName } }
        });

        if (signupError) {
            setError(signupError.message);
            setLoading(false);
        } else if (data?.user) {
            const { error: dbError } = await supabase.from('users').insert([{ id: data.user.id, role: 'customer' }]);
            if (dbError) {
                setError(dbError.message);
                setLoading(false);
            } else {
                navigate("/login");
            }
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-card">
                <div className="signup-header">
                    <Link to="/" className="back-home">
                        <span className="panchmev">PANCHMEV</span>
                    </Link>
                    <h2>Create Your Account</h2>
                    <p>Join the Panchmev family today</p>
                </div>

                <form onSubmit={handleSignup} className="signup-form">
                    {error && <div className="error-alert">{error}</div>}

                    <div className="form-group">
                        <label><FaUser /> Full Name</label>
                        <input
                            type="text"
                            placeholder="Your Name"
                            required
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label><FaEnvelope /> Email Address</label>
                        <input
                            type="email"
                            placeholder="example@mail.com"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label><FaLock /> Password</label>
                        <input
                            type="password"
                            placeholder="********"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="signup-btn" disabled={loading}>
                        {loading ? "Creating Account..." : "Sign Up"} <FaArrowRight />
                    </button>
                </form>

                <div className="signup-footer">
                    <p>Already have an account? <Link to="/login">Login here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Signup;

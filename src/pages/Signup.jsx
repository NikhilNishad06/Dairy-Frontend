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

        const email = formData.email.trim();
        const password = formData.password;
        const fullName = formData.fullName.trim();

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            setLoading(false);
            return;
        }

        try {
            // STEP 1: Direct Supabase Signup (Account Creation)
            // Simplified call to avoid server-side metadata rejection
            const { data: authData, error: signupError } = await supabase.auth.signUp({
                email,
                password
            });

            if (signupError) {
                console.error("Supabase Auth Error:", signupError);
                setError(`Auth Error: ${signupError.message}`);
                setLoading(false);
                return;
            }

            if (authData?.user) {
                // STEP 2: Create profile in public.users table
                // Since RLS is disabled (as seen in screenshot), this should succeed.
                const { error: dbError } = await supabase
                    .from('users')
                    .upsert([{ 
                        id: authData.user.id, 
                        email: email,
                        full_name: fullName,
                        role: 'customer'
                    }], { onConflict: 'id' });

                if (dbError) {
                    console.error("Database Error:", dbError);
                    setError(`Accross partially created: ${dbError.message}`);
                    setLoading(false);
                    return;
                }

                // Success!
                navigate("/login", { state: { message: "Success! Account created. Please verify your email." } });
            } else {
                setError("Signup initiated, but user session not found. Please check your email.");
                setLoading(false);
            }

        } catch (err) {
            console.error("Signup exception:", err);
            setError(`Unexpected Error: ${err.message}`);
            setLoading(false);
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
                            placeholder="Min. 6 characters"
                            required
                            minLength="6"
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

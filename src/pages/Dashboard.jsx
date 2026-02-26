import React, { useEffect, useState } from "react";
import { FaUser, FaClock, FaShoppingCart, FaSignOutAlt, FaLeaf, FaMapMarkerAlt } from "react-icons/fa";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user: supaUser } }) => {
            if (!supaUser) navigate("/login");
            else setUser(supaUser);
        });
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/login");
    };

    if (!user) return <div className="loading">Loading...</div>;

    return (
        <div className="user-dashboard">
            <div className="container">
                <header className="dashboard-header">
                    <div className="welcome-section">
                        <h1>Welcome, {user.user_metadata?.full_name || "Guest"}!</h1>
                        <p>Here is your Panchmev account overview</p>
                    </div>
                    <button className="logout-link" onClick={handleLogout}>
                        <FaSignOutAlt /> Logout
                    </button>
                </header>

                <div className="dashboard-grid">
                    <div className="stat-card">
                        <div className="stat-icon"><FaShoppingCart /></div>
                        <div className="stat-info">
                            <h3>Recent Orders</h3>
                            <p>You have no recent orders.</p>
                            <button className="dashboard-btn" onClick={() => navigate("/products")}>Shop Now</button>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon"><FaClock /></div>
                        <div className="stat-info">
                            <h3>Delivery Status</h3>
                            <p>No active deliveries.</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon"><FaUser /></div>
                        <div className="stat-info">
                            <h3>Profile</h3>
                            <p>{user.email}</p>
                            <button className="dashboard-btn">Edit Profile</button>
                        </div>
                    </div>
                </div>

                <section className="dashboard-info">
                    <div className="info-box">
                        <h4><FaLeaf /> Quality Promise</h4>
                        <p>Every product is traditionally processed to ensure pure taste and 100% nutrition.</p>
                    </div>
                    <div className="info-box">
                        <h4><FaMapMarkerAlt /> Quick Delivery</h4>
                        <p>Order before 8 AM for same-day delivery across the city!</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;

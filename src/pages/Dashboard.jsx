import React, { useEffect, useState } from "react";
import { FaUser, FaClock, FaShoppingCart, FaSignOutAlt, FaLeaf, FaMapMarkerAlt } from "react-icons/fa";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState("");
    const [updating, setUpdating] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            const { data: { user: supaUser } } = await supabase.auth.getUser();
            
            if (!supaUser) {
                navigate("/login");
                return;
            }
            
            setUser(supaUser);

            // Fetch Profile (Full Name)
            const { data: profileData } = await supabase
                .from('users')
                .select('*')
                .eq('id', supaUser.id)
                .maybeSingle();
            
            if (profileData) setProfile(profileData);

            // Fetch Wishlist Items
            const { data: wishlistData } = await supabase
                .from('wishlist')
                .select(`
                    id,
                    product_id,
                    products (
                        id,
                        name,
                        price,
                        image_url,
                        category
                    )
                `)
                .eq('user_id', supaUser.id);
            
            if (wishlistData) setWishlist(wishlistData);
            setLoading(false);
        };

        fetchDashboardData();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/login");
    };

    const handleUpdateProfile = async () => {
        if (!newName.trim()) return;
        setUpdating(true);
        const { error } = await supabase
            .from('users')
            .update({ full_name: newName.trim() })
            .eq('id', user.id);
        
        if (!error) {
            setProfile({ ...profile, full_name: newName.trim() });
            setIsEditing(false);
        } else {
            alert("Error updating profile: " + error.message);
        }
        setUpdating(false);
    };

    if (loading) return (
        <div className="loading-screen">
            <div className="spinner"></div>
            <p>Loading your dashboard...</p>
        </div>
    );

    return (
        <div className="user-dashboard">
            <div className="container">
                <header className="dashboard-header">
                    <div className="welcome-section">
                        <h1>Welcome, {profile?.full_name || user.email.split('@')[0]}!</h1>
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
                            <h3>My Profile</h3>
                            <p>{user.email}</p>
                            <button 
                                className="dashboard-btn" 
                                onClick={() => { setIsEditing(true); setNewName(profile?.full_name || ""); }}
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Edit Profile Modal */}
                {isEditing && (
                    <div className="edit-modal-overlay">
                        <div className="edit-modal">
                            <h3>Update Your Name</h3>
                            <input 
                                type="text" 
                                value={newName} 
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="Full Name"
                            />
                            <div className="modal-actions">
                                <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                                <button className="save-btn" onClick={handleUpdateProfile} disabled={updating}>
                                    {updating ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Wishlist Section */}
                <div className="wishlist-section">
                    <h3>Your Wishlist</h3>
                    {wishlist.length > 0 ? (
                        <div className="wishlist-row">
                            {wishlist.map((item) => (
                                <div key={item.id} className="wishlist-card" onClick={() => navigate("/products")}>
                                    <img src={item.products?.image_url} alt={item.products?.name} />
                                    <div className="wishlist-card-info">
                                        <h4>{item.products?.name}</h4>
                                        <p>{item.products?.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="wishlist-empty">
                            <p>Your wishlist is currently empty.</p>
                            <button onClick={() => navigate("/products")}>Explore Products</button>
                        </div>
                    )}
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

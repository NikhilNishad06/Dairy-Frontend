import React, { useEffect, useState } from "react";
import { FaUsers, FaHeart, FaLeaf, FaShieldAlt, FaAward, FaHandsHelping, FaHistory, FaStar, FaTruck, FaCertificate } from "react-icons/fa";
import { GiCow, GiMilkCarton, GiFarmer } from "react-icons/gi";
import { supabase } from "../supabaseClient";
import AOS from "aos";
import "aos/dist/aos.css";
import "./About.css";
import PageTransition from "../components/PageTransition";

const About = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    });

    const mockTeam = [
      {
        id: 1,
        name: "Rajesh Kumar",
        role: "Co-Founder & CEO",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=60",
        experience: "25+ Years",
        bio: "Visionary leader with a passion for traditional dairy heritage."
      },
      {
        id: 2,
        name: "Priya Singh",
        role: "Co-Founder & Operations",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=60",
        experience: "20+ Years",
        bio: "Expert in supply chain and organic dairy processing."
      },
      {
        id: 3,
        name: "Amit Patel",
        role: "Quality Assurance",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=60",
        experience: "15+ Years",
        bio: "Ensures every drop of milk meets our high standards of purity."
      }
    ];

    // 🔥 FETCH FROM SUPABASE DIRECTLY
    const fetchTeam = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("team")
          .select("*")
          .order("id", { ascending: true });

        if (error) {
          console.warn("Table 'team' might be missing, falling back to mock data:", error.message);
          setTeam(mockTeam);
          setError(null); // Silent fallback
        } else if (data && data.length > 0) {
          setTeam(data);
          setError(null);
        } else {
          setTeam(mockTeam);
          setError(null);
        }
      } catch (err) {
        console.error("Unexpected error, showing mock team:", err);
        setTeam(mockTeam);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  const coreValues = [
    { icon: <FaLeaf />, title: "100% Natural", desc: "No preservatives or artificial additives", color: "#198754" },
    { icon: <FaHeart />, title: "Family Legacy", desc: "Three generations of dairy excellence", color: "#8B1A1A" },
    { icon: <FaShieldAlt />, title: "Quality First", desc: "FSSAI approved & hygienic packaging", color: "#0D6EFD" },
    { icon: <FaHandsHelping />, title: "Farmer Trust", desc: "Direct partnership with local farmers", color: "#D4AF37" },
    { icon: <FaTruck />, title: "Fresh Delivery", desc: "Within 24 hours from farm to home", color: "#FD7E14" },
    { icon: <FaCertificate />, title: "Traditional Methods", desc: "Age-old Indian dairy techniques", color: "#6F42C1" }
  ];

  return (
    <PageTransition>
      <div className="about-page">

        {/* ===== HERO SECTION ===== */}
        <section className="about-hero"
        >
          <div className="hero-overlay"></div>
          <div className="container">
            <div className="hero-content">
              <div className="hero-badge">
                <GiMilkCarton className="badge-icon" />
                <span>Traditional Since 1995</span>
              </div>
              <h1>
                <span className="hero-title">About</span>
                <span className="hero-brand">Panchmev</span>
              </h1>
              <p className="hero-subtitle">
                Preserving Tradition, Delivering Purity — Three Generations of Dairy Excellence
              </p>
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">28+</span>
                  <span className="stat-label">Years</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">5000+</span>
                  <span className="stat-label">Families</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">Natural</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== STORY SECTION ===== */}
        <section className="story-section">
          <div className="container">
            <div className="story-container" >
              <div className="story-content">
                <div className="section-header">
                  <h2>Our Journey of Purity</h2>
                  <p>From humble beginnings to trusted dairy brand</p>
                  <div className="section-ornament"></div>
                </div>

                <div className="story-text">
                  <p>
                    Founded in 1995 by the Patel family, <strong>Panchmev</strong> began as a small
                    family dairy farm in rural Gujarat. What started with just five cows and
                    traditional hand-churning methods has grown into a trusted name in dairy
                    products across the region.
                  </p>
                  <p>
                    Our commitment to preserving age-old Indian dairy techniques while
                    maintaining modern hygiene standards has been our guiding principle.
                    Today, we proudly serve thousands of families with pure, unadulterated
                    dairy products, staying true to our roots.
                  </p>
                </div>
              </div>

              <div className="story-image"  >
                <div className="image-frame">
                  <img
                    src="https://images.unsplash.com/photo-1761839258575-038fef381ee7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8"
                    alt="Traditional Dairy Farming"
                    className="story-img"
                  />
                </div>
                <div className="floating-testimonial">
                  <FaStar className="star-icon" />
                  <div>
                    <p>"Panchmev's paneer tastes just like homemade!"</p>
                    <span>- Mrs. Sharma, Regular Customer</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== VALUES SECTION ===== */}
        <section className="values-section">
          <div className="container">
            <div className="section-header" >
              <h2>Our Core Values</h2>
              <p>The principles that guide everything we do</p>
              <div className="section-ornament"></div>
            </div>

            <div className="values-grid">
              {coreValues.map((value, index) => (
                <div
                  className="value-card"
                  key={index}
                >
                  <div
                    className="value-icon-wrapper"
                    style={{
                      backgroundColor: `${value.color}15`,
                      borderColor: value.color
                    }}
                  >
                    <div className="value-icon" style={{ color: value.color }}>
                      {value.icon}
                    </div>
                  </div>
                  <h3>{value.title}</h3>
                  <p>{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== TEAM SECTION ===== */}
        <section className="team-section">
          <div className="container">
            <div className="section-header" >
              <h2>
                Meet Our <span className="brand-primary">Panchmev</span> Family
              </h2>
              <p>The passionate team behind your favorite dairy products</p>
              <div className="section-ornament"></div>
            </div>

            {error && (
              <div className="error-message" >
                <div className="error-icon">⚠️</div>
                <h4>Error Loading Team</h4>
                <p>{error}</p>
              </div>
            )}

            {loading && (
              <div className="loading-state" >
                <div className="loading-spinner"></div>
                <p>Loading our wonderful team...</p>
              </div>
            )}

            {!loading && team.length === 0 && !error && (
              <div className="empty-state" >
                <FaUsers className="empty-icon" />
                <h4>No Team Members Found</h4>
                <p>Our team information is currently unavailable</p>
              </div>
            )}

            <div className="team-grid">
              {team.map((member, index) => (
                <div
                  className="team-card"
                  key={index}
                >
                  <div className="team-image-container">
                    <img
                      src={member.image || "https://via.placeholder.com/150"}
                      alt={member.name}
                      className="team-image"
                    />
                    <div className="team-overlay">
                      <FaUsers className="overlay-icon" />
                    </div>
                  </div>
                  <div className="team-content">
                    <h3>{member.name}</h3>
                    <p className="team-role">{member.role}</p>
                    {member.bio && <p className="team-bio">{member.bio}</p>}
                    <div className="team-social">
                      <span className="experience-badge">
                        <FaAward className="badge-icon" />
                        {member.experience || "5+ Years"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Founders Info Section */}
            <div className="founders-section" >
              <div className="founders-header">
                <GiFarmer className="founders-icon" />
                <h3>Three Generations of Dairy Masters</h3>
              </div>
              <p className="founders-desc">
                Our founders come from a lineage of dairy experts who have perfected
                traditional Indian dairy techniques over generations.
              </p>
            </div>
          </div>
        </section>

        {/* ===== CTA SECTION ===== */}
        <section className="about-cta" >
          <div className="container">
            <div className="cta-content">
              <h2>Experience Traditional Goodness</h2>
              <p>Join thousands of families who trust Panchmev for pure dairy products</p>
              <div className="cta-buttons">
                <button className="btn btn-primary">
                  <GiMilkCarton className="btn-icon" />
                  Browse Products
                </button>
                <button className="btn btn-secondary">
                  <FaTruck className="btn-icon" />
                  Order Now
                </button>
              </div>
            </div>
          </div>
        </section>

      </div>
    </PageTransition>
  );
};

export default About;
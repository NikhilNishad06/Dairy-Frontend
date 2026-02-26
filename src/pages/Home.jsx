import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaLeaf, FaTruck, FaAward, FaShieldAlt, FaStar, FaFire, FaTimes, FaHeart, FaShoppingCart } from "react-icons/fa";
import { GiMilkCarton, GiCow } from "react-icons/gi";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Home.css";
import PageTransition from "../components/PageTransition";


const Home = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    });
  }, []);

  const openModal = (product) => setSelectedProduct(product);
  const closeModal = () => setSelectedProduct(null);

  const products = [
    {
      name: "Fresh Paneer",
      price: "₹250",
      unit: "kg",
      originalPrice: "₹300/kg",
      img: "https://himalayancreamery.com/cdn/shop/files/WhatsAppImage2025-06-17at15.03.17_2_dc58008d-b4c8-44c1-8dd7-ee0a26ffe1b9.jpg?v=1751224019",
      desc: "Soft handmade paneer from pure cow milk",
      badge: "Best Seller",
      tag: "Paneer",
      rating: 4.9,
      category: "Paneer"
    },
    {
      name: "Pure Cow Milk",
      price: "₹60",
      unit: "liter",
      originalPrice: "₹70/liter",
      img: "https://static.vecteezy.com/system/resources/previews/025/222/153/original/glass-of-milk-with-splash-isolated-on-transparent-background-png.png",
      desc: "Fresh unadulterated A2 cow milk",
      badge: "Fresh Daily",
      tag: "Milk",
      rating: 4.8,
      category: "Milk"
    },
    {
      name: "Pure Desi Ghee",
      price: "₹800",
      unit: "kg",
      originalPrice: "₹900/kg",
      img: "https://d2j6dbq0eux0bg.cloudfront.net/images/26760098/3223860011.jpg",
      desc: "Traditional bilona method ghee",
      badge: "Traditional",
      tag: "Ghee",
      rating: 4.9,
      category: "Ghee"
    },
  ];

  return (
    <PageTransition>
      <div className="home-page">

        {/* ===== Hero Section ===== */}
        <section className="hero-section">
          <div className="container">
            <div className="hero-container">

              <div className="hero-content"
                data-aos-delay="100">
                <div className="hero-badge">
                  <FaFire className="badge-icon" />
                  <span>Traditional Indian Methods</span>
                </div>
                <h1>
                  <span className="hero-title-main">Pure & Natural</span>
                  <span className="hero-title-accent">Dairy Products</span>
                </h1>
                <p className="hero-description">
                  Experience 100% natural, chemical-free milk products crafted with traditional
                  Indian methods and delivered fresh from our trusted farmers to your home.
                </p>
                <div className="hero-features">
                  <div className="hero-feature">
                    <FaLeaf className="feature-icon" />
                    <span>100% Natural</span>
                  </div>
                  <div className="hero-feature">
                    <GiCow className="feature-icon" />
                    <span>Pure Cow Milk</span>
                  </div>
                  <div className="hero-feature">
                    <FaShieldAlt className="feature-icon" />
                    <span>FSSAI Certified</span>
                  </div>
                </div>
                <div className="hero-buttons">
                  <Link to="/products" className="btn btn-primary">
                    <GiMilkCarton className="btn-icon" />
                    Browse Products
                  </Link>
                  <Link to="/contact" className="btn btn-secondary">
                    <FaTruck className="btn-icon" />
                    Order Now
                  </Link>
                </div>
              </div>

              <div className="hero-image-container"
                data-aos-delay="300">
                <div className="image-wrapper">
                  <img
                    src="https://images.unsplash.com/photo-1594731884638-8197c3102d1d?w=700&auto=format&fit=crop&q=80"
                    alt="Traditional Indian Dairy Farmer"
                    className="hero-image"
                  />
                  <div className="image-overlay"></div>
                </div>
                <div className="floating-badge">
                  <FaStar className="star-icon" />
                  <div>
                    <span className="rating">4.9/5</span>
                    <span className="rating-text">Customer Rating</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ===== Features Section ===== */}
        <section className="features-section">
          <div className="container">
            <div className="section-header"
            >
              <h2>Why Choose Panchmev?</h2>
              <p>Traditional methods meet modern quality standards</p>
              <div className="section-ornament"></div>
            </div>

            <div className="features-grid">
              {[
                {
                  icon: <FaLeaf />,
                  title: "100% Natural",
                  text: "No preservatives or artificial additives",
                  color: "var(--success)"
                },
                {
                  icon: <FaTruck />,
                  title: "Fast Delivery",
                  text: "Fresh delivery within 24 hours",
                  color: "var(--primary)"
                },
                {
                  icon: <FaAward />,
                  title: "Award Winning",
                  text: "Best dairy brand 2023",
                  color: "var(--warning)"
                },
                {
                  icon: <FaShieldAlt />,
                  title: "Certified Quality",
                  text: "FSSAI approved & hygienic packaging",
                  color: "var(--danger)"
                },
              ].map((item, i) => (
                <div key={i} className="feature-card"
                  data-aos-delay={i * 100}>
                  <div className="feature-icon-wrapper" style={{ backgroundColor: `${item.color}15`, borderColor: item.color }}>
                    <div className="feature-icon" style={{ color: item.color }}>
                      {item.icon}
                    </div>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Featured Products ===== */}
        <section className="products-section">
          <div className="container">
            <div className="section-header"
            >
              <h2>Our Premium Products</h2>
              <p>Crafted with traditional Indian expertise</p>
              <div className="section-ornament"></div>
            </div>

            <div className="products-grid">
              {products.map((product, i) => (
                <div key={i} className="product-card"
                  data-aos-delay={i * 150}>
                  {product.badge && (
                    <div className="product-badge">{product.badge}</div>
                  )}
                  <div className="product-image-container">
                    <img
                      src={product.img}
                      alt={product.name}
                      className="product-image"
                    />
                    <div className="product-tag">{product.tag}</div>
                  </div>
                  <div className="product-content">
                    <h3>{product.name}</h3>
                    <p>{product.desc}</p>
                    <div className="product-price">
                      <span className="current-price">{product.price}/{product.unit}</span>
                      {product.originalPrice && (
                        <span className="original-price">{product.originalPrice}</span>
                      )}
                    </div>
                    <button onClick={() => openModal(product)} className="product-btn">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="products-cta"
            >
              <Link to="/products" className="btn btn-outline">
                View All Products →
              </Link>
            </div>
          </div>
        </section>

        {/* ===== CTA Section ===== */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content"
            >
              <h2>Ready to Experience Traditional Goodness?</h2>
              <p>Order now and get 10% off on your first purchase</p>
              <div className="cta-buttons">
                <Link to="/contact" className="btn btn-primary btn-lg">
                  <FaTruck className="btn-icon" />
                  Order Now
                </Link>
                <Link to="/about" className="btn btn-secondary btn-lg">
                  Learn More About Us
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Product Modal */}
        {selectedProduct && (
          <div className="product-modal-overlay">
            <div className="product-modal">
              <button className="close-btn" onClick={closeModal}>
                <FaTimes />
              </button>
              <div className="modal-content">
                <div className="modal-image">
                  <img src={selectedProduct.img} alt={selectedProduct.name} />
                </div>
                <div className="modal-details">
                  <div className="modal-header">
                    <span className="modal-category">{selectedProduct.category}</span>
                    <h3>{selectedProduct.name}</h3>
                    <div className="modal-rating">
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={i < Math.floor(selectedProduct.rating) ? 'star-filled' : 'star-empty'} />
                        ))}
                      </div>
                      <span>{selectedProduct.rating}/5</span>
                    </div>
                  </div>
                  <p className="modal-description">{selectedProduct.desc}</p>
                  <div className="modal-features">
                    <div className="feature">
                      <FaTruck />
                      <span>Delivered within 24 hours</span>
                    </div>
                    <div className="feature">
                      <FaLeaf />
                      <span>No preservatives added</span>
                    </div>
                    <div className="feature">
                      <FaHeart />
                      <span>100% vegetarian</span>
                    </div>
                  </div>
                  <div className="modal-price">
                    <div className="price-main">
                      <span className="price">{selectedProduct.price}/{selectedProduct.unit}</span>
                      <span className="discount">(No hidden charges)</span>
                    </div>
                    <div className="quantity-selector">
                      <label>Quantity:</label>
                      <select defaultValue="1">
                        <option value="1">1 unit</option>
                        <option value="2">2 units</option>
                        <option value="3">3 units</option>
                        <option value="4">4 units</option>
                        <option value="5">5 units</option>
                      </select>
                    </div>
                  </div>
                  <div className="modal-actions">
                    <button className="buy-now-btn">
                      <FaShoppingCart /> Buy Now
                    </button>
                    <button className="add-to-cart-btn">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </PageTransition>
  );
};

export default Home;

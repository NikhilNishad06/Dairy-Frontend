import React, { useState, useMemo, useEffect } from "react";
import { FaStar, FaShoppingCart, FaSearch, FaTimes, FaLeaf, FaHeart, FaSeedling, FaCalendarAlt, FaTruck } from "react-icons/fa";
import { FaCow } from "react-icons/fa6"; // FaCow is in fa6 package
import { supabase } from "../supabaseClient";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Products.css";
import PageTransition from "../components/PageTransition";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllProducts();

    // Set up Real-time subscription for Supabase products
    // This ensures that anything the admin adds is immediately visible to customers
    const channel = supabase
      .channel("products_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        (payload) => {
          console.log("Real-time update received:", payload);
          fetchAllProducts(); // Re-fetch to get merged list
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAllProducts = async () => {
    try {
      // 1. Fetch from External API (with timeout/retry logic internally handled by axios defaults or just simple catch)
      let apiProducts = [];
      try {
        const API_URL = import.meta.env.VITE_API_URL || "";
        const apiRes = await axios.get(`${API_URL}/api/products`);
        apiProducts = apiRes.data || [];
      } catch (apiError) {
        console.warn("External API fetch failed, falling back to Supabase/Cache:", apiError.message);
      }

      // 2. Fetch from Supabase (Primary Database)
      const { data: supaData, error: supaError } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false }); // Show newest first

      if (supaError) {
        console.error("Supabase error:", supaError.message);
      }
      const supaProducts = supaData || [];

      // 3. Robust Merge Logic: Ensure no duplicates by ID or Name
      // This ensures that products added by admin via ANY method are displayed
      const combined = [...apiProducts, ...supaProducts];
      const uniqueProductsMap = new Map();
      
      combined.forEach(product => {
        // Use name + category as a unique key if ID is missing or inconsistent
        const uniqueKey = product.id || `${product.name}-${product.category}`.toLowerCase();
        if (!uniqueProductsMap.has(uniqueKey)) {
          uniqueProductsMap.set(uniqueKey, product);
        }
      });

      const mergedProducts = Array.from(uniqueProductsMap.values());

      // 4. Set final products list
      if (mergedProducts.length > 0) {
        setProducts(mergedProducts);
      } else {
        // Only show sample products if everything else fails (ensures a good first impression)
        const sampleProducts = [
          {
            id: 'sample-1',
            name: "Fresh Cow Milk",
            category: "Milk",
            image_url: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format&fit=crop&q=60",
            rating: 4.8,
            description: "100% pure cow milk from grass-fed cows",
            price: "₹40/L"
          },
          {
            id: 'sample-2',
            name: "Organic Paneer",
            category: "Paneer",
            image_url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=60",
            rating: 4.9,
            description: "Handmade fresh paneer, no preservatives",
            price: "₹280/kg"
          },
          {
            id: 'sample-3',
            name: "Desi Ghee",
            category: "Ghee",
            image_url: "https://images.unsplash.com/photo-1605601722069-3dc4d38e1c9a?w=500&auto=format&fit=crop&q=60",
            rating: 4.9,
            description: "Traditional bilona method ghee",
            price: "₹550/kg"
          },
          {
            id: 'sample-4',
            name: "Curd (Dahi)",
            category: "Curd",
            image_url: "https://images.unsplash.com/photo-1625943553855-362811d08660?w=500&auto=format&fit=crop&q=60",
            rating: 4.7,
            description: "Creamy homemade curd",
            price: "₹60/pack"
          },
          {
            id: 'sample-5',
            name: "Buttermilk",
            category: "Beverages",
            image_url: "https://images.unsplash.com/photo-1546171753-97d7676e4602?w=500&auto=format&fit=crop&q=60",
            rating: 4.6,
            description: "Fresh spiced buttermilk",
            price: "₹30/glass"
          },
          {
            id: 'sample-6',
            name: "Cottage Cheese",
            category: "Cheese",
            image_url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=60",
            rating: 4.8,
            description: "Low fat cottage cheese",
            price: "₹320/kg"
          },
          {
            id: 'sample-7',
            name: "Flavored Milk",
            category: "Milk",
            image_url: "https://images.unsplash.com/photo-1519985178571-5cf2f56b1c8d?w=500&auto=format&fit=crop&q=60",
            rating: 4.5,
            description: "Chocolate & kesar flavored milk",
            price: "₹50/pack"
          },
          {
            id: 'sample-8',
            name: "Fresh Cream",
            category: "Cream",
            image_url: "https://images.unsplash.com/photo-1603524053242-8cbb10685da1?w=500&auto=format&fit=crop&q=60",
            rating: 4.7,
            description: "Pure malai cream",
            price: "₹180/pack"
          }
        ];
        setProducts(sampleProducts);
      }
    } catch (err) {
      console.error("Main fetch error:", err);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      `${p.name} ${p.category}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  const openModal = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };
  const closeModal = () => {
    setSelectedProduct(null);
    setQuantity(1);
  };

  return (
    <PageTransition>
      <div className="products-page">
        {/* Hero Section with Brand Theme */}
        <section className="products-hero">
          <div className="brand-overlay">
            <div className="brand-logo">
              <span className="panchmev">PANCHMEV</span>
              <span className="food-product">FOOD & PRODUCT</span>
              <span className="tagline">MADE WITH TRADITIONAL INDIAN METHODS</span>
            </div>
            <div className="hero-content">
              <h1>Pure Dairy Heritage</h1>
              <p className="hero-subtitle">Experience the authentic taste of traditional Indian dairy, preserved through generations</p>
              <div className="hero-features">
                <div className="feature-item">
                  <FaLeaf className="feature-icon" />
                  <span>100% Natural</span>
                </div>
                <div className="feature-item">
                  <FaHeart className="feature-icon" />
                  <span>Family Legacy</span>
                </div>
                <div className="feature-item">
                  <FaCow className="feature-icon" />
                  <span>Grass-fed Cows</span>
                </div>
                <div className="feature-item">
                  <FaTruck className="feature-icon" />
                  <span>24h Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section (Simplified height) */}
        <section className="categories-section-compact">
          <div className="container">
            <div className="categories-grid">
              {['Milk', 'Paneer', 'Ghee', 'Curd', 'Buttermilk', 'Cheese', 'Cream'].map(cat => (
                <button
                  key={cat}
                  className={`category-btn ${search.toLowerCase() === cat.toLowerCase() ? 'active' : ''}`}
                  onClick={() => setSearch(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid Section */}
        <section className="public-products-section">
          <div className="container">
            {/* INLINE SEARCH BAR MOVED HERE */}
            <div className="inline-search-wrapper">
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search milk, paneer, ghee, curd..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button className="clear-search" onClick={() => setSearch("")}>
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>

            <div className="section-header">
              <h2>Our Premium Collection</h2>
              <p>Handpicked with love, delivered with care</p>
            </div>
            <div className="public-products-grid">
              {filteredProducts.map((product) => (
                <div className="public-product-card" key={product.id}>
                  <div className="public-product-image">
                    <img src={product.image_url} alt={product.name} />
                    <div className="category-badge">
                      <FaSeedling className="badge-icon" />
                      <span>{product.category}</span>
                    </div>
                    <div className="product-overlay">
                      <button className="quick-view" onClick={() => openModal(product)}>
                        View Details
                      </button>
                    </div>
                  </div>
                  <div className="public-product-info">
                    <h4>{product.name}</h4>
                    <div className="rating">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < Math.floor(product.rating) ? 'star-filled' : 'star-empty'} />
                      ))}
                      <span className="rating-value">{product.rating}</span>
                    </div>
                    <p className="product-desc">{product.description}</p>
                    <div className="product-footer">
                      <div className="price-section">
                        <span className="price">{product.price}</span>
                        <span className="unit">per unit</span>
                      </div>
                      <button className="add-to-cart" onClick={() => openModal(product)}>
                        <FaShoppingCart /> Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Traditional Methods Banner */}
        <section className="traditional-banner">
          <div className="container">
            <div className="banner-content">
              <FaCalendarAlt className="banner-icon" />
              <div>
                <h3>Traditional Indian Methods</h3>
                <p>Preserving the ancient art of dairy making with modern hygiene standards</p>
              </div>
            </div>
          </div>
        </section>

        {/* Product Modal */}
        {selectedProduct && (
          <div className="public-modal-overlay">
            <div className="public-modal">
              <button className="close-btn" onClick={closeModal}>
                <FaTimes />
              </button>
              <div className="public-modal-content">
                <div className="public-modal-left">
                  <div className="public-modal-image">
                    <img src={selectedProduct.image_url} alt={selectedProduct.name} />
                    <div className="public-modal-image-badge">
                      <FaLeaf /> 100% Natural
                    </div>
                  </div>
                </div>
                <div className="public-modal-right">
                  <div className="public-modal-header">
                    <span className="public-modal-category">{selectedProduct.category}</span>
                    <h3>{selectedProduct.name}</h3>
                    <div className="public-modal-rating">
                      <div className="public-stars">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={i < Math.floor(selectedProduct.rating) ? 'star-filled' : 'star-empty'} />
                        ))}
                      </div>
                      <span className="rating-num">{selectedProduct.rating}/5</span>
                    </div>
                  </div>
                  <p className="public-modal-description">{selectedProduct.description}</p>
                  <div className="public-modal-features">
                    <div className="public-feature-item">
                      <FaTruck />
                      <span>Delivery in 24h</span>
                    </div>
                    <div className="public-feature-item">
                      <FaLeaf />
                      <span>Natural</span>
                    </div>
                    <div className="public-feature-item">
                      <FaHeart />
                      <span>Pure</span>
                    </div>
                  </div>
                  <div className="public-modal-price-box">
                    <div className="price-info">
                      <span className="main-price">{selectedProduct.price}</span>
                      <span className="price-tag">(No hidden charges)</span>
                    </div>
                    <div className="public-quantity">
                      <label>Qty:</label>
                      <select value={quantity} onChange={(e) => setQuantity(e.target.value)}>
                        <option value="1">1 unit</option>
                        <option value="2">2 units</option>
                        <option value="3">3 units</option>
                        <option value="4">4 units</option>
                        <option value="5">5 units</option>
                      </select>
                    </div>
                  </div>
                  <div className="public-modal-actions">
                    <button
                      className="public-buy-btn"
                      onClick={() => navigate('/checkout', { state: { product: selectedProduct, quantity: parseInt(quantity) } })}
                    >
                      <FaShoppingCart /> Buy Now
                    </button>
                    <button className="public-cart-btn">
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

export default Products;
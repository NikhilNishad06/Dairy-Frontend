import React, { useState, useMemo, useEffect } from "react";
import { FaStar, FaShoppingCart, FaSearch, FaTimes, FaLeaf, FaHeart, FaSeedling, FaCalendarAlt, FaTruck } from "react-icons/fa";
import { FaCow } from "react-icons/fa6"; // FaCow is in fa6 package
import { supabase } from "../supabaseClient";
import axios from "axios";
import "./Products.css";
import PageTransition from "../components/PageTransition";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const apiRes = await axios.get("http://localhost:5000/api/products");
      const apiProducts = apiRes.data || [];

      const { data: supaData, error } = await supabase.from("products").select("*");
      if (error) {
        console.error("Supabase error:", error.message);
      }
      const supaProducts = supaData || [];

      const mergedProducts = [...apiProducts, ...supaProducts].reduce((acc, curr) => {
        if (!acc.find((p) => p.id === curr.id)) acc.push(curr);
        return acc;
      }, []);

      // Add sample products if empty (for demo)
      if (mergedProducts.length === 0) {
        const sampleProducts = [
          {
            id: 1,
            name: "Fresh Cow Milk",
            category: "Milk",
            image_url: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format&fit=crop&q=60",
            rating: 4.8,
            description: "100% pure cow milk from grass-fed cows",
            price: "₹40/L"
          },
          {
            id: 2,
            name: "Organic Paneer",
            category: "Paneer",
            image_url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=60",
            rating: 4.9,
            description: "Handmade fresh paneer, no preservatives",
            price: "₹280/kg"
          },
          {
            id: 3,
            name: "Desi Ghee",
            category: "Ghee",
            image_url: "https://images.unsplash.com/photo-1605601722069-3dc4d38e1c9a?w=500&auto=format&fit=crop&q=60",
            rating: 4.9,
            description: "Traditional bilona method ghee",
            price: "₹550/kg"
          },
          {
            id: 4,
            name: "Curd (Dahi)",
            category: "Curd",
            image_url: "https://images.unsplash.com/photo-1625943553855-362811d08660?w=500&auto=format&fit=crop&q=60",
            rating: 4.7,
            description: "Creamy homemade curd",
            price: "₹60/pack"
          },
          {
            id: 5,
            name: "Buttermilk",
            category: "Beverages",
            image_url: "https://images.unsplash.com/photo-1546171753-97d7676e4602?w=500&auto=format&fit=crop&q=60",
            rating: 4.6,
            description: "Fresh spiced buttermilk",
            price: "₹30/glass"
          },
          {
            id: 6,
            name: "Cottage Cheese",
            category: "Cheese",
            image_url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=60",
            rating: 4.8,
            description: "Low fat cottage cheese",
            price: "₹320/kg"
          },
          {
            id: 7,
            name: "Flavored Milk",
            category: "Milk",
            image_url: "https://images.unsplash.com/photo-1519985178571-5cf2f56b1c8d?w=500&auto=format&fit=crop&q=60",
            rating: 4.5,
            description: "Chocolate & kesar flavored milk",
            price: "₹50/pack"
          },
          {
            id: 8,
            name: "Fresh Cream",
            category: "Cream",
            image_url: "https://images.unsplash.com/photo-1603524053242-8cbb10685da1?w=500&auto=format&fit=crop&q=60",
            rating: 4.7,
            description: "Pure malai cream",
            price: "₹180/pack"
          }
        ];
        setProducts(sampleProducts);
      } else {
        setProducts(mergedProducts);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      `${p.name} ${p.category}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  const openModal = (product) => setSelectedProduct(product);
  const closeModal = () => setSelectedProduct(null);

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

        {/* Search Section */}
        <section className="search-section">
          <div className="container">
            <div className="search-wrapper">
              <div className="search-header">
                <h2>Discover Our Pure Products</h2>
                <p>Search from our wide range of traditional dairy products</p>
              </div>
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
          </div>
        </section>

        {/* Categories */}
        <section className="categories-section">
          <div className="container">
            <h3>Browse by Category</h3>
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

        {/* Products Grid */}
        <section className="products-grid">
          <div className="container">
            <div className="section-header">
              <h2>Our Premium Collection</h2>
              <p>Handpicked with love, delivered with care</p>
            </div>
            <div className="products-grid-container">
              {filteredProducts.map((product) => (
                <div className="product-card" key={product.id}>
                  <div className="product-image">
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
                  <div className="product-info">
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
          <div className="product-modal-overlay">
            <div className="product-modal">
              <button className="close-btn" onClick={closeModal}>
                <FaTimes />
              </button>
              <div className="modal-content">
                <div className="modal-image">
                  <img src={selectedProduct.image_url} alt={selectedProduct.name} />
                  <div className="image-badge">
                    <FaLeaf /> 100% Natural
                  </div>
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
                  <p className="modal-description">{selectedProduct.description}</p>
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
                      <span className="price">{selectedProduct.price}</span>
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

export default Products;
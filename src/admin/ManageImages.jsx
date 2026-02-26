import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash, FaImage, FaTag, FaDollarSign, FaStar, FaInfoCircle, FaUpload, FaTimes } from "react-icons/fa";
import "./ManageImages.css";

const ManageImages = () => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Categories for dropdown
  const categories = ["Milk", "Paneer", "Ghee", "Curd", "Buttermilk", "Cheese", "Cream", "Other"];

  // ================= FETCH PRODUCTS =================
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.category.toLowerCase().includes(search.toLowerCase()) ||
    product.description.toLowerCase().includes(search.toLowerCase())
  );

  // ================= ADD / UPDATE PRODUCT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("rating", rating);
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/products/${editingId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
        alert("Product updated successfully");
      } else {
        if (!image) return alert("Image is required");
        await axios.post("http://localhost:5000/api/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Product added successfully");
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Operation failed");
    }
  };

  // ================= EDIT =================
  const handleEdit = (product) => {
    setEditingId(product.id);
    setName(product.name);
    setCategory(product.category);
    setPrice(product.price);
    setRating(product.rating);
    setDescription(product.description);
    setImagePreview(product.image_url);
    setImage(null);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      alert("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  // ================= IMAGE HANDLING =================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setCategory("");
    setPrice("");
    setRating("");
    setDescription("");
    setImage(null);
    setImagePreview("");
  };

  return (
    <div className="manage-images">
      {/* Header */}
      <div className="manage-header">
        <div className="header-left">
          <h2><FaImage className="header-icon" /> Manage Products</h2>
          <p className="product-count">Total Products: {products.length}</p>
        </div>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="search-icon">🔍</div>
        </div>
      </div>

      {/* Form Section */}
      <div className="form-section">
        <div className="form-card">
          <div className="form-header">
            <h3>{editingId ? "Update Product" : "Add New Product"}</h3>
            {editingId && (
              <button className="cancel-btn" onClick={resetForm}>
                <FaTimes /> Cancel
              </button>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-grid">
              <div className="form-group">
                <label><FaTag /> Product Name</label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label><FaTag /> Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label><FaDollarSign /> Price</label>
                <input
                  type="text"
                  placeholder="e.g., ₹40/L"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label><FaStar /> Rating</label>
                <div className="rating-input">
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    placeholder="4.5"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    required
                  />
                  <div className="rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < Math.floor(rating) ? 'star-filled' : 'star-empty'} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-group full-width">
                <label><FaInfoCircle /> Description</label>
                <textarea
                  placeholder="Enter product description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label><FaUpload /> Product Image</label>
                <div className="image-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="upload-btn">
                    <FaUpload /> Choose Image
                  </label>
                  <span className="file-name">
                    {image ? image.name : "No file chosen"}
                  </span>
                </div>
                
                {(imagePreview || editingId) && (
                  <div className="image-preview">
                    <img 
                      src={imagePreview || products.find(p => p.id === editingId)?.image_url} 
                      alt="Preview" 
                    />
                    <div className="preview-label">Image Preview</div>
                  </div>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                <FaPlus /> {editingId ? "Update Product" : "Add Product"}
              </button>
              <button type="button" className="reset-btn" onClick={resetForm}>
                Reset Form
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Products Table */}
      <div className="products-section">
        <div className="section-header">
          <h3>All Products</h3>
          <p className="showing-count">Showing {filteredProducts.length} of {products.length} products</p>
        </div>

        {loading ? (
          <div className="loading-wrapper">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="loading-row"></div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="no-products">
            <div className="no-products-icon">📦</div>
            <h4>No products found</h4>
            <p>{search ? "Try a different search term" : "Add your first product using the form above"}</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div className="product-card" key={product.id}>
                <div className="product-image">
                  <img src={product.image_url} alt={product.name} />
                  <span className="product-category">{product.category}</span>
                </div>
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <div className="product-rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < Math.floor(product.rating) ? 'star-filled' : 'star-empty'} />
                      ))}
                    </div>
                    <span className="rating-value">{product.rating}</span>
                  </div>
                  <p className="product-desc">{product.description}</p>
                  <div className="product-meta">
                    <span className="product-price">{product.price}</span>
                    <span className="product-id">ID: {product.id}</span>
                  </div>
                </div>
                <div className="product-actions">
                  <button className="action-btn edit" onClick={() => handleEdit(product)}>
                    <FaEdit /> Edit
                  </button>
                  <button className="action-btn delete" onClick={() => handleDelete(product.id)}>
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageImages;
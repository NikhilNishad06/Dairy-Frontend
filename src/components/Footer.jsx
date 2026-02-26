import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaLeaf,
  FaHeart
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-overlay">
        <div className="container pt-5 pb-4">
          <div className="row">
            {/* Brand & About */}
            <div className="col-lg-4 mb-4">
              <div className="footer-brand">
                <h4 className="mb-3 footer-logo">
                  <span className="panchmev-red">PANCHMEV</span>
                  <span className="food-product">FOOD & PRODUCT</span>
                </h4>
                <p className="footer-tagline">MADE WITH TRADITIONAL INDIAN METHODS</p>
              </div>
              <p className="footer-text">
                Pure, fresh dairy products straight from our farm to your table. 
                Serving trusted quality since 1995 with three generations of dairy excellence.
              </p>
              
              <div className="footer-features">
                <div className="feature">
                  <FaLeaf /> 100% Natural
                </div>
                <div className="feature">
                  <FaHeart /> Family Legacy
                </div>
              </div>

              <div className="social-icons mt-4">
                <a href="#" className="social-icon">
                  <FaFacebook />
                </a>
                <a href="#" className="social-icon">
                  <FaInstagram />
                </a>
                <a href="#" className="social-icon">
                  <FaTwitter />
                </a>
                <a href="#" className="social-icon">
                  <FaYoutube />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-lg-2 col-md-6 mb-4">
              <h5 className="footer-title">Quick Links</h5>
              <ul className="footer-links">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/about">About Us</Link>
                </li>
                <li>
                  <Link to="/products">Products</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
                <li>
                  <Link to="/gallery">Gallery</Link>
                </li>
              </ul>
            </div>

            {/* Products */}
            <div className="col-lg-3 col-md-6 mb-4">
              <h5 className="footer-title">Our Products</h5>
              <ul className="footer-products">
                <li>Fresh Cow Milk</li>
                <li>Organic Paneer</li>
                <li>Desi Ghee</li>
                <li>Fresh Curd (Dahi)</li>
                <li>Buttermilk</li>
                <li>Cottage Cheese</li>
              </ul>
            </div>

            {/* Contact */}
            <div className="col-lg-3 col-md-6 mb-4">
              <h5 className="footer-title">Contact Info</h5>
              <ul className="footer-contact">
                <li className="contact-item">
                  <FaMapMarkerAlt className="contact-icon" />
                  <div>
                    <strong>Address</strong>
                    <span>Bhilai, Chhattisgarh, India</span>
                  </div>
                </li>
                <li className="contact-item">
                  <FaPhone className="contact-icon" />
                  <div>
                    <strong>Phone</strong>
                    <span>+91 75820 56910</span>
                  </div>
                </li>
                <li className="contact-item">
                  <FaEnvelope className="contact-icon" />
                  <div>
                    <strong>Email</strong>
                    <span>orders@panchmev.com</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-divider"></div>

          <div className="footer-bottom">
            <div className="row align-items-center">
              <div className="col-md-6">
                <p className="copyright">
                  © 2024 PANCHMEV FOOD & PRODUCT. All rights reserved.
                </p>
              </div>
              <div className="col-md-6">
                <div className="footer-bottom-links">
                  <Link to="/privacy">Privacy Policy</Link>
                  <Link to="/terms">Terms of Service</Link>
                  <Link to="/sitemap">Sitemap</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
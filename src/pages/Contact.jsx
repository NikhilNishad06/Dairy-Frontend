import React, { useState, useEffect } from "react";
import "./Contact.css";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaWhatsapp,
  FaPaperPlane,
  FaUser,
  FaMapPin,
} from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import PageTransition from "../components/PageTransition";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    productInterest: "",
    message: "",
  });

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 120,
    });

    window.addEventListener("load", () => {
      AOS.refreshHard();
    });
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert("Message sent successfully!");
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      productInterest: "",
      message: "",
    });
  };

  return (
    <PageTransition>
      <div className="contact-page">
        {/* HERO SECTION */}
        <section className="contact-hero">
          <div className="container">
            <h1 className="contact-title">Get in Touch</h1>
            <p className="contact-subtitle">
              Experience Traditional Taste with Modern Service
            </p>
            <div className="hero-ornament"></div>
          </div>
        </section>

        {/* CONTACT INFO BAR */}
        <section className="contact-info-bar">
          <div className="container">
            <div className="info-grid">
              <div className="info-card">
                <div className="info-icon phone">
                  <FaPhone size={24} />
                </div>
                <h4>Call Us</h4>
                <p>+91 7582056910</p>
                <span className="info-note">Mon-Sun: 6AM - 10PM</span>
              </div>

              <div className="info-card" data-aos-delay="150">
                <div className="info-icon whatsapp">
                  <FaWhatsapp size={24} />
                </div>
                <h4>WhatsApp</h4>
                <p>+91 7582056910</p>
                <span className="info-note">Instant Response</span>
              </div>

              <div className="info-card" data-aos-delay="300">
                <div className="info-icon email">
                  <FaEnvelope size={24} />
                </div>
                <h4>Email</h4>
                <p>info@panchmev.com</p>
                <span className="info-note">24hrs Response</span>
              </div>

              <div className="info-card" data-aos-delay="450">
                <div className="info-icon location">
                  <FaMapMarkerAlt size={24} />
                </div>
                <h4>Visit Us</h4>
                <p>Traditional Kitchen</p>
                <span className="info-note">By Appointment</span>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <div className="container contact-main-container">
          <div className="contact-grid-layout">
            {/* TOP HORIZONTAL SECTION (Form Header) */}
            <div className="grid-top-section">
              <div className="section-header">
                <h2>Send Your Message</h2>
                <p>We'll respond within 24 hours</p>
                <div className="form-ornament"></div>
              </div>
            </div>

            {/* LEFT VERTICAL COLUMN (Form Inputs) */}
            <div className="grid-left-column">
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <FaUser className="input-icon" /> First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 12345 67890"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Product Interest</label>
                  <select
                    name="productInterest"
                    value={formData.productInterest}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select product category</option>
                    <option value="spices">Traditional Spices</option>
                    <option value="sweets">Indian Sweets</option>
                    <option value="snacks">Traditional Snacks</option>
                    <option value="all">All Products</option>
                    <option value="custom">Custom Order</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Your Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Share your requirements, questions, or special requests..."
                    rows="5"
                    required
                  />
                </div>
              </form>
            </div>

            {/* MIDDLE VERTICAL SECTION (Submit Button) */}
            <div className="grid-middle-section">
              <button type="submit" className="submit-btn" onClick={handleSubmit}>
                <FaPaperPlane className="btn-icon" />
                Send Message
              </button>
            </div>

            {/* RIGHT TOP SECTION (Map) */}
            <div className="grid-right-top">
              <div className="map-card">
                <div className="map-header">
                  <h3>
                    <FaMapPin className="map-icon" /> Our Location
                  </h3>
                  <p>Visit our traditional kitchen</p>
                </div>
                <div className="map-container">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.8995119655085!2d77.20654231508207!3d28.570279982440536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce2daa9eb4d0b%3A0x717971125923e5d!2sIndia%20Gate%2C%20New%20Delhi!5e0!3m2!1sen!2sin!4v1640012345678"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    title="Panchmev Location"
                  ></iframe>
                </div>
              </div>
            </div>

            {/* RIGHT MIDDLE SECTION (WhatsApp) */}
            <div className="grid-right-middle">
              <div className="whatsapp-card">
                <div className="whatsapp-icon">
                  <FaWhatsapp size={32} />
                </div>
                <div className="whatsapp-content">
                  <h3>Instant WhatsApp Order</h3>
                  <p>Get quick responses & place orders directly</p>
                  <p className="whatsapp-note">Usually replies in minutes</p>
                  <a
                    href="https://wa.me/917582056910"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-btn"
                  >
                    <FaWhatsapp className="btn-icon" />
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* RIGHT BOTTOM SECTION (Quick Info) */}
            <div className="grid-right-bottom">
              <div className="quick-info-card">
                <h4>Quick Information</h4>
                <ul className="quick-info-list">
                  <li>
                    <FaClock className="list-icon" />
                    <span>
                      Delivery: <strong>Same Day</strong> (Within city)
                    </span>
                  </li>
                  <li>
                    <FaClock className="list-icon" />
                    <span>
                      Min. Order: <strong>₹300</strong> for free delivery
                    </span>
                  </li>
                  <li>
                    <FaClock className="list-icon" />
                    <span>
                      Custom Orders: <strong>Available</strong>
                    </span>
                  </li>
                  <li>
                    <FaClock className="list-icon" />
                    <span>
                      Bulk Orders: <strong>Special Discounts</strong>
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* BOTTOM HORIZONTAL LINE (Decoration) */}
            <div className="grid-bottom-line"></div>
          </div>
        </div>

        {/* FAQ SECTION */}
        <section className="faq-section">
          <div className="container">
            <div className="faq-header">
              <h2>Frequently Asked Questions</h2>
              <p>Common queries about our products & services</p>
            </div>

            <div className="faq-grid">
              <div className="faq-item">
                <details>
                  <summary>Do you offer home delivery?</summary>
                  <p>
                    Yes! We offer free home delivery for orders above ₹300 within
                    city limits. For orders below ₹300, a nominal delivery charge
                    applies.
                  </p>
                </details>
              </div>

              <div className="faq-item" data-aos-delay="100">
                <details>
                  <summary>Are subscription plans available?</summary>
                  <p>
                    Yes, we offer monthly and quarterly subscription plans for
                    regular customers. Enjoy discounts and priority delivery with
                    our subscription service.
                  </p>
                </details>
              </div>

              <div className="faq-item" data-aos-delay="200">
                <details>
                  <summary>What are your business hours?</summary>
                  <p>
                    We're open from 6 AM to 10 PM, seven days a week. WhatsApp
                    support is available 24/7 for order placement.
                  </p>
                </details>
              </div>

              <div className="faq-item" data-aos-delay="300">
                <details>
                  <summary>Do you make custom products?</summary>
                  <p>
                    Absolutely! We specialize in custom traditional food
                    preparations. Contact us with your requirements for
                    personalized orders.
                  </p>
                </details>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="contact-cta">
          <div className="container">
            <h2 className="text-light">Ready to Taste Tradition?</h2>
            <p>Order now and experience authentic Indian flavors</p>
            <div className="cta-buttons">
              <a href="tel:+917582056910" className="cta-btn phone-cta">
                <FaPhone /> Call Now
              </a>
              <a
                href="https://wa.me/917582056910"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-btn whatsapp-cta"
              >
                <FaWhatsapp /> WhatsApp Order
              </a>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Contact;

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PaymentButton from "../components/PaymentButton";
import QRPaymentModal from "../components/QRPaymentModal";
import PageTransition from "../components/PageTransition";
import axios from "axios";
import "./Checkout.css";

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [address, setAddress] = useState({
        name: "",
        phone: "",
        street: "",
        city: "",
        zip: "",
    });

    const [paymentMethod, setPaymentMethod] = useState("cod"); // "cod" or "qr"
    const [showQRModal, setShowQRModal] = useState(false);
    const [loading, setLoading] = useState(false);

    // Re-direct if not coming from "Buy Now"
    useEffect(() => {
        if (!location.state || !location.state.product) {
            navigate("/products", { replace: true });
        }
    }, [location, navigate]);

    if (!location.state || !location.state.product) {
        return null; // Don't render while redirecting
    }

    const { product, quantity } = location.state;

    // Extract number from price string (e.g. ₹40/L -> 40)
    const priceNumber = parseInt(product.price.replace(/[^\d]/g, ""), 10) || 0;
    const totalAmount = priceNumber * quantity;

    const handleInputChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const isAddressValid = Object.values(address).every((val) => val.trim() !== "");

    const handlePaymentSuccess = () => {
        alert("Payment successful! Your order has been placed.");
        navigate("/products");
    };

    const handlePaymentError = (err) => {
        console.error("Payment Error: ", err);
    };

    const handleQRPayClick = async () => {
        if (!isAddressValid) return;

        try {
            setLoading(true);
            const API_URL = import.meta.env.VITE_API_URL || "https://dairy-backend-g9m2.onrender.com";
            const response = await axios.post(`${API_URL}/api/payments/create-order`, {
                amount: totalAmount,
                userId: null,
                address: address,
                receipt: `${paymentMethod}_receipt_${Date.now()}`
            });

            if (response.data.success) {
                if (paymentMethod === 'qr') {
                    setShowQRModal(true);
                } else {
                    // It's COD, just show success and redirect
                    alert("Order placed successfully (Cash on Delivery)! We will contact you soon.");
                    navigate("/products");
                }
            } else {
                alert("Failed to initialize order. Please try again.");
            }
        } catch (error) {
            console.error("Order creation error:", error);
            alert("Something went wrong. Check your internet connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleQRConfirm = () => {
        // Here we just notify the user, as the order is already in DB as 'pending'
        // In a real app, you might send a notification to the admin.
        setTimeout(() => {
            setShowQRModal(false);
            alert("Order placed successfully! We will verify your payment and contact you.");
            navigate("/products");
        }, 2000);
    };

    return (
        <PageTransition>
            <div className="checkout-page">
                <div className="checkout-container">
                    <h2>Order Checkout</h2>
                    <div className="checkout-content">
                        {/* Delivery Address Section */}
                        <div className="checkout-section address-section">
                            <h3>Delivery Address</h3>
                            <div className="address-form">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={address.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={address.phone}
                                        onChange={handleInputChange}
                                        placeholder="Enter 10-digit number"
                                        maxLength="10"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Street Address</label>
                                    <input
                                        type="text"
                                        name="street"
                                        value={address.street}
                                        onChange={handleInputChange}
                                        placeholder="House No, Building, Street Area"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>City / District</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={address.city}
                                        onChange={handleInputChange}
                                        placeholder="Enter your city"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Pincode</label>
                                    <input
                                        type="text"
                                        name="zip"
                                        value={address.zip}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 110001"
                                        maxLength="6"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Order Summary & Payment Section */}
                        <div className="checkout-section summary-section">
                            <h3>Order Summary</h3>
                            <div className="summary-details">
                                <div className="summary-item">
                                    <img src={product.image_url} alt={product.name} className="summary-image" />
                                    <div className="summary-info">
                                        <h4>{product.name}</h4>
                                        <p>Category: {product.category}</p>
                                        <p>Price: {product.price}</p>
                                        <p>Quantity: {quantity} {quantity > 1 ? "units" : "unit"}</p>
                                    </div>
                                </div>

                                <div className="summary-total">
                                    <span>Total Payable:</span>
                                    <span>₹{totalAmount}</span>
                                </div>

                                <div className="payment-method-selector">
                                    <h4>Select Payment Method:</h4>
                                    <div className="method-options">
                                        <label className={`method-option ${paymentMethod === 'cod' ? 'active' : ''}`}>
                                            <input 
                                                type="radio" 
                                                name="paymentMethod" 
                                                value="cod" 
                                                checked={paymentMethod === 'cod'} 
                                                onChange={() => setPaymentMethod('cod')} 
                                            />
                                            <span>Cash on Delivery (COD)</span>
                                        </label>
                                        <label className={`method-option ${paymentMethod === 'qr' ? 'active' : ''}`}>
                                            <input 
                                                type="radio" 
                                                name="paymentMethod" 
                                                value="qr" 
                                                checked={paymentMethod === 'qr'} 
                                                onChange={() => setPaymentMethod('qr')} 
                                            />
                                            <span>Scan & Pay (UPI)</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="payment-section">
                                    {paymentMethod === 'cod' ? (
                                        <button 
                                            className="cod-place-order-btn" 
                                            onClick={handleQRPayClick} // Reusing logic to create order in DB
                                            disabled={!isAddressValid || loading}
                                        >
                                            {loading ? "Processing..." : `Place Order (COD) - ₹${totalAmount}`}
                                        </button>
                                    ) : (
                                        <button 
                                            className="qr-pay-initiator-btn" 
                                            onClick={handleQRPayClick}
                                            disabled={!isAddressValid || loading}
                                        >
                                            {loading ? "Processing..." : `Pay via QR - ₹${totalAmount}`}
                                        </button>
                                    )}

                                    {!isAddressValid && (
                                        <div className="fill-address-warning">
                                            Please fill out all delivery address fields above to proceed.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <QRPaymentModal 
                    isOpen={showQRModal}
                    onClose={() => setShowQRModal(false)}
                    amount={totalAmount}
                    onConfirm={handleQRConfirm}
                />
            </div>
        </PageTransition>
    );
};

export default Checkout;

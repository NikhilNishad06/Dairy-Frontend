import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PaymentButton from "../components/PaymentButton";
import PageTransition from "../components/PageTransition";
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

                                <div className="payment-section">
                                    <PaymentButton
                                        amount={totalAmount}
                                        userId={null} // Passing null since database expects a valid UUID for referenced user_id.
                                        address={address}
                                        planName={`Purchase of ${product.name}`}
                                        onSuccess={handlePaymentSuccess}
                                        onError={handlePaymentError}
                                        disabled={!isAddressValid}
                                    />
                                    {!isAddressValid && (
                                        <div className="fill-address-warning">
                                            Please fill out all delivery address fields above to click this button.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default Checkout;

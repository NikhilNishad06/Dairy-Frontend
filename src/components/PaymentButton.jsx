import React, { useState } from 'react';
import axios from 'axios';
import './PaymentButton.css';

const PaymentButton = ({ amount, userId, address, planName, onSuccess, onError, disabled }) => {
    const [loading, setLoading] = useState(false);

    // Helper method to dynamically load the Razorpay script
    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const displayRazorpay = async () => {
        try {
            setLoading(true);

            const res = await loadScript(
                "https://checkout.razorpay.com/v1/checkout.js"
            );

            if (!res) {
                alert("Razorpay SDK failed to load. Are you online?");
                setLoading(false);
                return;
            }

            // 1. Creating order on backend
            const API_URL = import.meta.env.VITE_API_URL || "";
            const result = await axios.post(`${API_URL}/api/payments/create-order`, {
                amount,
                userId,
                address,
                receipt: `receipt_${Date.now()}`
            });

            if (!result.data || !result.data.success) {
                alert("Server error. Are you online?");
                setLoading(false);
                return;
            }

            const { amount: orderAmount, id: order_id, currency } = result.data.order;
            const internalOrderId = result.data.internalOrderId;

            // 2. Open Razorpay Dialog
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_YourTestKey", // Enter the Key ID generated from the Dashboard
                amount: orderAmount.toString(),
                currency: currency,
                name: "Dairy Management",
                description: planName || "Milk Subscription/Order",
                order_id: order_id, // This is the order_id created in the backend
                handler: async function (response) {
                    try {
                        // 3. Verify Payment Signature
                        const API_URL = import.meta.env.VITE_API_URL || "";
                        const verifyResult = await axios.post(`${API_URL}/api/payments/verify-payment`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            internalOrderId: internalOrderId,
                            userId: userId,
                            amount: amount
                        });

                        if (verifyResult.data.success) {
                            if (onSuccess) onSuccess(verifyResult.data.payment);
                            alert("Payment Successful & Subscription Activated!");
                        } else {
                            if (onError) onError("Payment verification failed");
                            alert("Payment verification failed. Please contact support.");
                        }
                    } catch (err) {
                        console.error(err);
                        if (onError) onError(err);
                        alert("Error in payment verification.");
                    }
                },
                prefill: {
                    name: "User Name", // You can pass actual user details
                    email: "user@example.com",
                    contact: "9999999999",
                },
                theme: {
                    color: "#2C5F2D", // Match the branding (Panchmev or similar)
                },
            };

            if (order_id.startsWith("order_dummy_")) {
                alert("Test Mode: Simulating successful payment since genuine Razorpay keys are missing from the backend.");
                // Manually trigger success to pass the dummy variables to the backend verify logic
                return options.handler({
                    razorpay_order_id: order_id,
                    razorpay_payment_id: "pay_dummy_" + Date.now(),
                    razorpay_signature: "dummy_signature"
                });
            }

            const paymentObject = new window.Razorpay(options);

            paymentObject.on('payment.failed', function (response) {
                alert("Payment Failed: " + response.error.description);
                if (onError) onError(response.error);
            });

            paymentObject.open();
        } catch (err) {
            console.error(err);
            alert("Something went wrong during payment initialization");
            if (onError) onError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button className="payment-btn" onClick={displayRazorpay} disabled={loading || disabled}>
            {loading ? "Processing..." : `Pay Now - ₹${amount}`}
        </button>
    );
};

export default PaymentButton;

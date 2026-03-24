import React, { useState } from 'react';
import './QRPaymentModal.css';

const QRPaymentModal = ({ isOpen, onClose, amount, orderId, onConfirm }) => {
    const [isConfirmed, setIsConfirmed] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = () => {
        setIsConfirmed(true);
        if (onConfirm) onConfirm();
    };

    return (
        <div className="qr-modal-overlay">
            <div className="qr-modal-content">
                <button className="qr-modal-close" onClick={onClose}>&times;</button>
                <h3>Scan & Pay with UPI</h3>
                <p className="qr-amount-text">Amount to Pay: <strong>₹{amount}</strong></p>
                
                <div className="qr-image-container">
                    {/* Ensure the image is saved in 'public/payment-qr.jpg' */}
                    <img 
                        src="/scannerqr.jpg" 
                        alt="PhonePe QR Code" 
                        className="payment-qr-img"
                    />
                </div>
                
                <p className="qr-instructions">
                    1. Scan the QR code using any UPI App (PhonePe, GPay, Paytm). <br/>
                    2. After successful payment, click the button below.
                </p>

                <div className="qr-modal-actions">
                    {!isConfirmed ? (
                        <button className="qr-confirm-btn" onClick={handleConfirm}>
                            I have paid ₹{amount}
                        </button>
                    ) : (
                        <div className="qr-success-msg">
                            ✅ Order Submitted for Verification!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QRPaymentModal;

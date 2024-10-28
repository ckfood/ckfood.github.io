// src/Checkout.js
import React from 'react';
import { useLocation } from 'react-router-dom';

const Checkout = () => {
    const location = useLocation();
    const { cartItems } = location.state || { cartItems: [] }; // Get cart items from location state

    return (
        <div className="checkout-container">
            <h2>Checkout</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <ul>
                    {cartItems.map((item, index) => (
                        <li key={index}>
                            {item.name} - ${item.price}
                        </li>
                    ))}
                </ul>
            )}
            <button onClick={() => alert('Proceeding to payment...')}>Proceed to Payment</button>
        </div>
    );
};

export default Checkout;
// src/components/Menu.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import '../css/Menu.css';

export default function Menu() {
    const { user, logout } = useAuth();
    const [menuItems, setMenuItems] = useState([]);
    const [expandedCategories, setExpandedCategories] = useState({});
    const { itemCounts, setItemCounts } = useCart();
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const route = location.state || {};
    // console.log('user information: ', user);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await axios.get('http://localhost:5001/menu_items');
                setMenuItems(response.data);
            } catch (err) {
                console.error('Error fetching menu items:', err);
            }
        };
        fetchMenuItems();
    }, []);

    const handleLogout = async () => {
        try {
            // await logout();
            navigate('/signin');
        } catch (error) {
            console.error('Error during logout:', error);
            alert('Logout error: An error occurred while trying to log out.');
        }
    };

    const groupByCategory = (items) => {
        const singleItemCategories = {};
        const multiItemCategories = {};

        items.forEach((item) => {
            if (items.filter((i) => i.category === item.category).length === 1) {
                (singleItemCategories[item.category] =
                    singleItemCategories[item.category] || []).push(item);
            } else {
                (multiItemCategories[item.category] =
                    multiItemCategories[item.category] || []).push(item);
            }
        });

        return { singleItemCategories, multiItemCategories };
    };

    const groupedMenuItems = groupByCategory(menuItems);

    const toggleCategory = (category) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [category]: !prev[category],
        }));
    };

    const handleIncrement = (itemId) => {
        setItemCounts((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1,
        }));
    };

    const handleDecrement = (itemId) => {
        setItemCounts((prev) => ({
            ...prev,
            [itemId]: Math.max((prev[itemId] || 0) - 1, 0),
        }));
    };

    const getTotalCount = () => {
        return Object.values(itemCounts).reduce((total, count) => total + count, 0);
    };

    const getTotalPrice = () => {
        return Object.keys(itemCounts)
            .reduce((total, itemId) => {
                const count = itemCounts[itemId] || 0;
                const item = menuItems.find((menuItem) => menuItem.id === itemId);
                return total + (item ? item.price * count : 0);
            }, 0)
            .toFixed(2);
    };

    const handleCheckout = () => {
        const totalCount = getTotalCount();
        if (totalCount === 0) {
            alert('No items selected: Add items to your cart');
        } else {
            navigate('/checkout', { state: { itemCounts, menuItems } });
        }
    };

    const handleOrders = () => {
        navigate('/orders');
    };

    const renderItem = (item) => {
        const isSoldOut = item.quantity === 0;
        const itemCount = itemCounts[item.id] || 0;

        return (
            <div
                className={`card-container ${isSoldOut ? 'sold-out' : ''}`}
                key={item.id}
            >
                <img src={item.image} alt={item.name} className="image" />
                {isSoldOut && <div className="overlay" />}
                <div className="info-container">
                    <h3 className={`item-name ${isSoldOut ? 'sold-out-text' : ''}`}>
                        {item.name}
                    </h3>
                    <p className={`item-price ${isSoldOut ? 'sold-out-text' : ''}`}>
                        {isSoldOut ? 'Sold Out' : `$${item.price.toFixed(2)}`}
                    </p>
                </div>
                {!isSoldOut && (
                    <div className="counter-container">
                        {itemCount === 0 ? (
                            <button
                                onClick={() => handleIncrement(item.id)}
                                className="icon-button"
                            >
                                +
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => handleDecrement(item.id)}
                                    className="counter-button"
                                >
                                    -
                                </button>
                                <span className="counter-text">{itemCount}</span>
                                <button
                                    onClick={() => handleIncrement(item.id)}
                                    className="counter-button"
                                >
                                    +
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const renderCategory = (category) => {
        if (groupedMenuItems.singleItemCategories[category]) {
            return (
                <div className="single-item-container" key={category}>
                    {groupedMenuItems.singleItemCategories[category].map(renderItem)}
                </div>
            );
        } else {
            return (
                <div className="category-container" key={category}>
                    <button
                        onClick={() => toggleCategory(category)}
                        className="category-header"
                    >
                        <h4 className="category-title">{category}</h4>
                        <span className="arrow">
                            {expandedCategories[category] ? '▲' : '▼'}
                        </span>
                    </button>
                    {expandedCategories[category] && (
                        <div className="category-items">
                            {groupedMenuItems.multiItemCategories[category].map(renderItem)}
                        </div>
                    )}
                </div>
            );
        }
    };

    return (
        <div className="container">
            <header className="header">
                <h2 className="welcome-text">
                    Welcome, {user ? user.username : 'Guest'}
                </h2>
                <button
                    onClick={() => setDropdownVisible(!dropdownVisible)}
                    className="hamburger-button"
                >
                    ☰
                </button>
            </header>

            {dropdownVisible && (
                <div className="dropdown-menu">
                    <button className="close-button" onClick={() => setDropdownVisible(false)}>
                &times;
            </button>
                    <button className="dropdown-item" onClick={handleOrders}>
                        My Orders
                    </button>
                    <button className="dropdown-item logout" onClick={handleLogout}>
                        Log Out
                    </button>
                </div>
            )}

            <div className="categories">
                {Object.keys(groupedMenuItems.singleItemCategories)
                    .concat(Object.keys(groupedMenuItems.multiItemCategories))
                    .map(renderCategory)}
            </div>

            <div className="checkout-container">
    <div className="total-container">
        <p className="total-count">Total Items: {getTotalCount()}</p>
        <p className="total-price">Total Price: ${getTotalPrice()}</p>
    </div>
    <button className="checkout-button" onClick={handleCheckout}>
        Checkout
    </button>
</div>
        </div>
    );
}
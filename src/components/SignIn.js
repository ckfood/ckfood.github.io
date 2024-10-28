// src/SignIn.js
import React, { useState } from 'react';
import axios from 'axios';
import '../css/Auth.css'; // Import the CSS file
import { useAuth } from '../context/AuthContext'; // Import useAuth to access context
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const SignIn = () => {
    const { setUser } = useAuth(); // Get setUser from context
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate(); // Initialize navigation

    const handleSignIn = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
    
        try {
            const response = await axios.post('http://localhost:5001/signin', {
                phone,
                password,
            });
    
            console.log('API Response:', response.data); // Log the response data
            // console.log('user status: ', response.status);
            // console.log('sign in: ', response.data.status)
            const status = response.data.status;
            const username = response.data.username;
            const token  = response.data.token;
            console.log('user status: ', status);
            if (status === 'Pending') {
                alert('Authorization Pending. Please wait for Admin to approve.');
            } else if (status === 'Blocked') {
                alert('Account Blocked. Please ask Admin to unblock');
            } else if (status === 'Admin') {
                alert('Admin login'); // Placeholder for Admin navigation
            } else if (status === 'Approved') {
                // Store user data in context
                setUser({ phone, username, token });
                // console.log("Redirecting to menu...", username); // Log before navigation
                navigate('/menu');
            }
        } catch (err) {
            console.error('Error during sign-in:', err); // Log the error
            if (err.response) {
                setError(err.response.data.error);
            } else {
                setError('Error: ' + err.message);
            }
        }
    };

    return (
        <div className="auth-container">
            <img src="https://llsjhmarfuipnzgwkngm.supabase.co/storage/v1/object/public/foodImages/CKFood.png" alt="App Logo" className="logo" />
            <form onSubmit={handleSignIn}>
                <h2>Sign In</h2>
                <input
                    type="text"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input"
                    required
                />
                <button type="submit" className="button">Sign In</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                <div className="footer">
                    <p>Don't have an account? <a href="/signup" className="link">Sign Up</a></p>
                </div>
            </form>
        </div>
    );
};

export default SignIn;
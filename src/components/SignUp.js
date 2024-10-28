// src/SignUp.js
import React, { useState } from 'react';
import axios from 'axios';
import '../css/Auth.css'; // Import the CSS file

const SignUp = () => {
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        try {
            const response = await axios.post('http://localhost:5001/signup', {
                phone,
                email,
                username,
                password,
            });
            console.log('User signed up:', response.data);
            setSuccessMessage(response.data.message);
        } catch (err) {
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
            <form onSubmit={handleSignUp}>
                <h2>Sign Up</h2>
                <input
                    type="text"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input"
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                    required
                />
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                <button type="submit" className="button">Sign Up</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                <div className="footer">
                    <p>Already have an account? <a href="/signin" className="link">Sign In</a></p>
                </div>
            </form>
        </div>
    );
};

export default SignUp;
// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Menu from "./components/Menu";
import Checkout from "./components/Checkout";

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
      {" "}
      {/* Wrap the Router with AuthProvider */}
      <Router>
        <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </div>
      </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;

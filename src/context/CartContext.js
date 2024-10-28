import React, { createContext, useContext, useState } from 'react';

// Create a context for the shopping cart
const CartContext = createContext();

// CartProvider component to provide cart context to children
export const CartProvider = ({ children }) => {
  const [itemCounts, setItemCounts] = useState({}); // Holds counts of items in the cart

  // Function to reset item counts in the cart
  const resetItemCounts = () => {
    setItemCounts({}); // Clear all item counts
  };

  return (
    <CartContext.Provider value={{ itemCounts, setItemCounts, resetItemCounts }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
import React, { useEffect, useState } from "react";
import "./Cart.css";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const products = JSON.parse(sessionStorage.getItem("products")) || [];
    setCartItems(products);
  }, []);

  const removeFromCart = (itemToRemove) => {
    const updatedCart = cartItems.filter((item) => item !== itemToRemove);
    setCartItems(updatedCart);
    sessionStorage.setItem("products", JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  return (
    <div className="cart-container">
      <div className="cart">
        <h2>Your Cart</h2>
        {cartItems.map((item, index) => (
          <div key={index} className="cart-item">
            <div className="item-details">
              <div>{item.title}</div>
              <div className="item-price">${item.price.toFixed(2)}</div>
            </div>
            <button onClick={() => removeFromCart(item)}>Remove</button>
          </div>
        ))}
        <div className="cart-total">
          <strong>Total:</strong> ${calculateTotal()}
        </div>
      </div>
    </div>
  );
}

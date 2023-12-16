import React from "react";
import "./Product.css";

export default function Product({
  product,
  handleQuantityChange,
  handleAddtoCart,
}) {
  const { title, desc, image, price, qty } = product;

  return (
    <div className="product">
      <div className="product-content">
        <div className="product-title">{title}</div>
        <div className="product-desc">{desc}</div>
        <img className="product-image" src={image} alt={title} />
      </div>
      <div className="product-footer">
        <div className="product-price">${price.toFixed(2)}</div>
        {qty > 0 ? (
          <div className="quantity-container">
            <button
              className="quantity-button"
              onClick={() => handleQuantityChange(product, "decrement")}
            >
              -
            </button>
            <div className="product-quantity">{qty}</div>
            <button
              className="quantity-button"
              onClick={() => handleQuantityChange(product, "increment")}
            >
              +
            </button>
          </div>
        ) : (
          <button onClick={() => handleAddtoCart(product)}>Add to cart</button>
        )}
      </div>
    </div>
  );
}

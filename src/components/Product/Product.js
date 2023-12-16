import React from "react";
import "./Product.css";

export default function Product({ product, handleAddtoCart }) {
  const { title, desc, image, price } = product;

  return (
    <div className="product">
      <div className="product-title">{title}</div>
      <div className="product-desc">{desc}</div>
      <img className="product-image" src={image} alt={title} />
      <div className="product-price">${price.toFixed(2)}</div>
      <button onClick={() => handleAddtoCart(product)}>Add to cart</button>
    </div>
  );
}

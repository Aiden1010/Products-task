import React, { useEffect, useState } from "react";
import Product from "../../components/Product/Product";
import "./Products.css";
import { useNavigate } from "react-router-dom";

export default function Products() {
  const [productsList, setProductsList] = useState([]);
  const [order, setOrder] = useState("asc");
  const [categoriesList, setCategoriesList] = useState([]);
  const [category, setCategory] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const baseUrl = "https://fakestoreapi.com/products";
  const navigate = useNavigate();

  useEffect(() => {
    retrieveCategories();
    const storedProducts = JSON.parse(sessionStorage.getItem("products")) || [];
    setCartCount(storedProducts.length);
  }, []);

  const retrieveCategories = () => {
    apiRequest(`${baseUrl}/categories`, handleCategoriesData);
  };

  useEffect(() => {
    retrieveProducts(order, category);
  }, [order, category]);

  const retrieveProducts = (order, category) => {
    var url = baseUrl;
    if (category) url = `${url}/category/${category}`;
    apiRequest(`${url}?sort=${order}`, handleProductsData);
  };

  const apiRequest = async (url, callback) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      callback(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCategoriesData = (data) => setCategoriesList(data);

  const handleProductsData = (data) => {
    const storedProducts = JSON.parse(sessionStorage.getItem("products")) || [];
    const updatedStoredProducts = data.map((product) => {
      const productMatch = storedProducts.find(
        (storedProduct) => storedProduct.id === product.id
      );
      return productMatch
        ? { ...product, qty: productMatch.qty }
        : { ...product, qty: 0 };
    });
    setProductsList(updatedStoredProducts);
  };

  const handleOrderChange = (e) => {
    setOrder(e.target.value);
  };

  const hanldleChangeCatgory = (e) => {
    setCategory(e.target.value);
  };

  const handleQuantityChange = (product, value) => {
    const updatedProducts = productsList.map((p) => {
      if (p.id === product.id) {
        return {
          ...p,
          qty: value === "increment" ? p.qty + 1 : Math.max(p.qty - 1, 0),
        };
      }
      return p;
    });
    setProductsList(updatedProducts);
    updateCartItems(updatedProducts);
  };

  const handleAddtoCart = (product) => {
    const updatedProducts = productsList.map((p) =>
      p.id === product.id ? { ...p, qty: p.qty + 1 } : p
    );
    setProductsList(updatedProducts);

    const existingProducts =
      JSON.parse(sessionStorage.getItem("products")) || [];
    const existingProduct = existingProducts.find((p) => p.id === product.id);

    if (!existingProduct) {
      existingProducts.push({ ...product, qty: 1 });
    } else {
      existingProduct.qty += 1;
    }

    updateCartItems(existingProducts);
  };

  const updateCartItems = (updatedProducts) => {
    const updatedSessionProducts = updatedProducts.filter((p) => p.qty > 0);
    setCartCount(updatedSessionProducts.length);
    sessionStorage.setItem("products", JSON.stringify(updatedSessionProducts));
  };

  return (
    <div className="product-wrapper">
      <div className="page-header">
        <h2 className="page-title">Products</h2>
        <div className="cart-icon" onClick={() => navigate("/cart")}>
          <div className="cart-count">{cartCount}</div>
        </div>
      </div>
      <div className="filters">
        <select value={category} onChange={hanldleChangeCatgory}>
          <option value="">All Categories</option>
          {categoriesList.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select value={order} onChange={handleOrderChange}>
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
      </div>
      <div className="product-container">
        {productsList.map((product, index) => (
          <Product
            key={index}
            product={product}
            handleQuantityChange={handleQuantityChange}
            handleAddtoCart={handleAddtoCart}
          />
        ))}
      </div>
    </div>
  );
}

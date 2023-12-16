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
    const products = JSON.parse(sessionStorage.getItem("products")) || [];
    setCartCount(products.length);
  }, []);

  useEffect(() => {
    retrieveProducts(order);
  }, [order]);

  const retrieveProducts = (order) => {
    apiRequest(`${baseUrl}?sort=${order}`);
  };

  const retrieveCategories = () => {
    var url = `${baseUrl}/categories`;
    apiRequest(url);
  };

  const apiRequest = async (url) => {
    await fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (url.includes("categories")) {
          setCategoriesList(data);
        } else {
          setProductsList(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOrderChange = (e) => {
    setOrder(e.target.value);
  };

  const hanldleChangeCatgory = (e) => {
    const { value } = e.target;
    setCategory(value);
    var url = baseUrl;
    if (value) {
      url = `${baseUrl}/category/${value}`;
    }
    apiRequest(url);
  };

  const handleAddtoCart = (product) => {
    const existingProducts =
      JSON.parse(sessionStorage.getItem("products")) || [];
    const existingProduct = existingProducts.find((p) => p.id === product.id);

    if (!existingProduct) existingProducts.push({ ...product });

    setCartCount(existingProducts.length);
    sessionStorage.setItem("products", JSON.stringify(existingProducts));
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
            handleAddtoCart={handleAddtoCart}
          />
        ))}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import axios from "axios";
import "../../styles/ProductList.css"; // Import the CSS file for styling

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/products/")
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="product-list">
      {products.map((product, index) => (
        <ProductCard key={index} product={product}/>
      ))}
    </div>
  );
}

export default ProductList;

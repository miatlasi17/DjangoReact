import React from "react";
import "../../styles/ProductCard.css"; 
import { useNavigate } from "react-router-dom"; // Import the CSS file

function ProductCard({ product }) {
  const navigate = useNavigate(); // For React Router v6, useNavigate instead
  const routeToPdp = () => {
    navigate(`/products/${product.id}`);
  };
  return (
    <div className="product-card" onClick={routeToPdp}>
      <div className="product-image">
        <img src={`http://127.0.0.1:8000/${product.image}`} alt={product.name} />
      </div>
      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <p className="product-price">${product.price}</p>
      </div>
    </div>
  );
}

export default ProductCard;

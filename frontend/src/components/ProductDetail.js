// ProductDetail.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/ProductDetail.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartData } from "../store/cartSlice";

function ProductDetail() {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const cart = useSelector((state) => state.cart);
  const isAddedToCart = cart.items.some(
    (item) => item.product_id === Number(id)
  );
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/products/${id}/`) // Fetch product by ID
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
        setError("Failed to fetch product details");
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await axios.post(
        "http://localhost:8000/cart/",
        {
          action: "add",
          product_id: product.id,
          quantity: quantity,
        },
        { withCredentials: true }
      );
      await dispatch(fetchCartData());
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  const handleQuantityChange = (e) => {
    const value = Math.max(1, Math.floor(Number(e.target.value))); // Convert to integer and ensure minimum value of 1
    setQuantity(value);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="product-detail">
      <h1 className="product-title">{product.name}</h1>
      <div className="product-image-wrapper">
        <img
          src={`http://localhost:8000/${product.image}`}
          alt={product.name}
        />
        {/* Add carousel or image thumbnails here */}
      </div>
      <div className="product-info">
        <p className="product-description">{product.description}</p>
        <p className="product-price">Price: ${product.price}</p>
        <div className="quantity-container">
          <label htmlFor="quantity" className="quantity-label">Quantity:</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            min="1"
            step="1"  // Restrict input to whole numbers
            onChange={handleQuantityChange}
            className="quantity-input"
          />
        </div>
        {isAddedToCart ? (
          <button className="added-to-cart">Added to Cart</button>
        ) : (
          <button className="add-to-cart" onClick={handleAddToCart}>
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;

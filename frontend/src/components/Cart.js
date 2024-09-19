// src/Cart.js
import React, { useEffect } from "react";
import "../styles/Cart.css"; // Import the CSS file
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { fetchCartData } from "../store/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const removeItem = async (id) => {
    axios
      .post(
        "http://localhost:8000/cart/",
        { action: "remove", product_id: Number(id) },
        { withCredentials: true }
      )
      .then(() => {
        dispatch(fetchCartData());
      })
      .catch((error) => {
        console.error("Error removing item from cart:", error);
      });
  };
  useEffect(() => {
    // Dispatch the action to fetch cart data on component mount
    dispatch(fetchCartData());
  }, [dispatch]);

  if (cart.loading) {
    return <div className="empty">Loading...</div>;
  }

  if (cart.error) return <div>Error: {cart.error}</div>;

  // Check if cart is an array or object and render accordingly
  return (
    <div className="container">
      {cart.items.length === 0 ? (
        <div className="empty">Your cart is empty</div>
      ) : (
        <h2 className="header">Your Cart</h2>
      )}
      <div className="cart-items">
        {cart.items.map((item, index) => (
          <div key={index} className="cart-item">
            <img src={item.image} alt={item.name} />
            <div className="cart-item-details">
              <div className="item-name">{item.name}</div>
              <div className="item-price">${item.price}</div>
              <div className="item-quantity">Quantity: {item.quantity}</div>
            </div>
            <button
              onClick={() => removeItem(item.product_id)}
              className="remove-item"
            >
              Remove{" "}
            </button>
          </div>
        ))}
      </div>
      <div className="total">Total: ${cart.total_price}</div>
    </div>
  );
};

export default Cart;

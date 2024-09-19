// src/App.js
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";
import NProgress from "nprogress";
import "nprogress/nprogress.css"; // Import the default NProgress styles
import TodoList from "./TodoList"; // Import the TodoList component
import AddTodo from "./AddTodo"; // Import the AddTodo component
import ProductList from "./ProductList";
import LoginForm from "./Login";
import ProductDetail from "./ProductDetail";
import Banner from "./Banner"; // Import the ProductList component
import Footer from "./Footer"; // Import the Footer component
import Cart from "./Cart"; // Import the Footer component
import CartIcon from "./cartIcon"; // Import the Footer component
import "../styles/index.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartData } from "../store/cartSlice";
import { logoutUser } from "../store/userSlice";
import SignupForm from "./Signup";
// Custom component to handle progress bar on route change
const RouteChangeTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Start the progress bar
    NProgress.start();

    // Complete the progress bar on route change
    NProgress.done();

    // Clean up on unmount
    return () => {
      NProgress.done();
    };
  }, [location]);

  return null; // This component doesn't render anything
};

function Index() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  useEffect(() => {
    dispatch(fetchCartData());
  }, [dispatch]);

  return (
    <Router>
      <RouteChangeTracker />
      <div className="App">
        <header className="App-header">
          <nav>
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/add-todo" className="nav-link">
              Add Todo
            </Link>
            <Link to="/product-list" className="nav-link">
              Product List
            </Link>
            <Link to="/cart" className="nav-link">
              <CartIcon count={cart.items.length} />
            </Link>
            {isAuthenticated ? (
              <Link
                to="/"
                onClick={ () => dispatch(logoutUser())}
                className="nav-link"
              >
                Logout
              </Link>
            ) : (
              <Link to="/login" className="nav-link">
                Login
              </Link>
            )}
          </nav>
        </header>
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Banner /> {/* Banner is rendered here */}
                  <TodoList />
                </>
              }
            />
            <Route path="/" element={<TodoList />} />
            <Route path="/add-todo" element={<AddTodo />} />
            <Route path="/product-list" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default Index;

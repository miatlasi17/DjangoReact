import React, { useState } from "react";
import "../styles/login.css"; // Import the CSS file
import { Link } from "react-router-dom";
import { userLogin } from "../store/userSlice";
import { useDispatch } from 'react-redux';

const LoginForm = () => {
  const [passwordType, setPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const togglePasswordVisibility = (type) => {
    if (type === "password") {
      setPasswordType(passwordType === "password" ? "text" : "password");
    } else {
      setConfirmPasswordType(
        confirmPasswordType === "password" ? "text" : "password"
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "username":
        setUsername(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const handleLogin = () => {
    dispatch(userLogin({password, username}));
  }

  return (
    <section className="Authcontainer forms">
      {/* Login Form */}
      <div className="form login">
        <div className="form-content">
          <header>Login</header>
          <form>
            <div className="field input-field">
              <input
                name="username"
                type="text"
                placeholder="username"
                className="input"
                onChange={handleChange}
                value={username}
              />
            </div>
            <div className="field input-field">
              <input
                name="password"
                type={passwordType}
                placeholder="Password"
                onChange={handleChange}
                value={password}
                className="password"
              />
              <i
                className={`bx bx-${
                  passwordType === "password" ? "hide" : "show"
                } eye-icon`}
                onClick={() => togglePasswordVisibility("password")}
              ></i>
            </div>
            <div className="form-link">
              <a href="#" className="forgot-pass">
                Forgot password?
              </a>
            </div>
            <div className="field button-field">
              <button onClick={handleLogin} type="button">Login</button>
            </div>
          </form>
          <div className="form-link">
            <span>
              Don't have an account?{" "}
              <Link to="/signup" className="link">
                Signup
              </Link>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;

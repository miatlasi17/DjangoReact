// src/components/AuthForm.js
import React, { useState } from 'react';
import '../styles/login.css'; // Import the CSS file
import { Link } from 'react-router-dom';

const SignupForm = () => {
  const [passwordType, setPasswordType] = useState('password');
  const [confirmPasswordType, setConfirmPasswordType] = useState('password');

  const togglePasswordVisibility = (type) => {
    if (type === 'password') {
      setPasswordType(passwordType === 'password' ? 'text' : 'password');
    } else {
      setConfirmPasswordType(confirmPasswordType === 'password' ? 'text' : 'password');
    }
  };

  return (
    <section className="Authcontainer forms show-signup">
      <div className="form signup">
        <div className="form-content">
          <header>Signup</header>
          <form>
            <div className="field input-field">
              <input type="email" placeholder="Email" className="input" />
            </div>
            <div className="field input-field">
              <input
                type={passwordType}
                placeholder="Create password"
                className="password"
              />
            </div>
            <div className="field input-field">
              <input
                type={confirmPasswordType}
                placeholder="Confirm password"
                className="password"
              />
              <i
                className={`bx bx-${confirmPasswordType === 'password' ? 'hide' : 'show'} eye-icon`}
                onClick={() => togglePasswordVisibility('confirm')}
              ></i>
            </div>
            <div className="field button-field">
              <button type="button">Signup</button>
            </div>
          </form>
          <div className="form-link">
            <span>
              Already have an account? <Link to='/login' className="link">Login</Link>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignupForm;

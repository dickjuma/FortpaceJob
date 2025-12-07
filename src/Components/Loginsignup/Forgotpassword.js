import React, { useState } from 'react';
import './forgotpassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = (e) => {
    e.preventDefault();
    // Placeholder logic for sending reset link
    setMessage(`If an account exists for ${email}, a reset link has been sent.`);
    setEmail('');
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <h2>Forgot Password?</h2>
        <p className="forgot-guidance">
          Enter your email address below and we’ll send you a link to reset your password.
        </p>

        <form className="forgot-form" onSubmit={handleReset}>
          <div className="input-group">
            <input
              type="email"
              id="forgot-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="forgot-email">Email Address</label>
          </div>

          <button type="submit" className="btn-reset">Send Reset Link</button>

          {message && <p className="reset-message">{message}</p>}
        </form>

        <p className="back-login">
          Remembered your password? <a href="/signin">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;

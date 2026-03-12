import React, { useState } from 'react';
import './forgotpassword.css';
import { authAPI } from '../../Services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await authAPI.forgotPassword(email);
      setMessage(response?.message || `If an account exists for ${email}, a reset link has been sent.`);
      setEmail('');
    } catch (err) {
      setError(err.message || 'Could not send reset link.');
    } finally {
      setLoading(false);
    }
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

          <button type="submit" className="btn-reset" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>

          {message && <p className="reset-message">{message}</p>}
          {error && <p className="reset-message">{error}</p>}
        </form>

        <p className="back-login">
          Remembered your password? <a href="/signin">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;

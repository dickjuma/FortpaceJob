import React, { useState } from 'react';
import './signin.css';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Email:', email, 'Password:', password);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p className="login-guidance">Sign in to access your dashboard</p>

        <form className="login-form" onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />

          <a href="/forgot" className="forgot-password">Forgot Password?</a>

          <button type="submit" className="btn-login">Sign In</button>

          <div className="divider"><span>OR</span></div>

          <div className="alt-login">
            <button type="button" className="alt-btn google">Sign in with Google</button>
            <button type="button" className="alt-btn facebook">Sign in with Facebook</button>
          </div>

          <p className="signup-link">
            Don’t have an account? <a href="/signup">Sign Up</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signin;

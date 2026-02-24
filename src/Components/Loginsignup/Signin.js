import React, { useState } from 'react';
import './signin.css';

const Signin = () => {
  const [method, setMethod] = useState('email');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login method:', method, { email, username, phone, otp, password, remember });
  };

  return (
    <div className="login-container">
      <div className="login-shell">
        <aside className="login-left">
          <h2>Welcome Back</h2>
          <p className="login-guidance">Sign in to access your dashboard and manage services.</p>
          <ul className="login-points">
            <li>Secure access with multiple login options</li>
            <li>Fast onboarding for clients and talent</li>
            <li>Trusted payments and verified profiles</li>
          </ul>
          <div className="login-badges">
            <span>Forte Verified</span>
            <span>Secure Payments</span>
            <span>24/7 Support</span>
          </div>
        </aside>

        <section className="login-card">
          <div className="login-title">
            <h3>Sign in</h3>
            <p>Choose a login style that works for you.</p>
          </div>

          <div className="login-methods">
            <button type="button" className={`method-btn ${method === 'email' ? 'active' : ''}`} onClick={() => setMethod('email')}>Email</button>
            <button type="button" className={`method-btn ${method === 'phone' ? 'active' : ''}`} onClick={() => setMethod('phone')}>Phone</button>
            <button type="button" className={`method-btn ${method === 'username' ? 'active' : ''}`} onClick={() => setMethod('username')}>Username</button>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            {method === 'email' && (
              <>
                <label>Email</label>
                <input 
                  type="email" 
                  placeholder="you@email.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
                <label>Password</label>
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </>
            )}

            {method === 'phone' && (
              <>
                <label>Phone number</label>
                <input 
                  type="tel" 
                  placeholder="+1 555 123 4567" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  required 
                />
                <label>One-time code</label>
                <div className="otp-row">
                  <input 
                    type="text" 
                    placeholder="6-digit code" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)} 
                    required 
                  />
                  <button type="button" className="btn-ghost">Send OTP</button>
                </div>
              </>
            )}

            {method === 'username' && (
              <>
                <label>Username</label>
                <input 
                  type="text" 
                  placeholder="your username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                />
                <label>Password</label>
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </>
            )}

            <div className="login-row">
              <label className="remember">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                Remember me
              </label>
              {(method === 'email' || method === 'username') && (
                <a href="/forgot" className="forgot-password">Forgot password?</a>
              )}
            </div>

            <button type="submit" className="btn-login">Sign In</button>

            <div className="divider"><span>OR</span></div>

            <div className="alt-login">
              <button type="button" className="alt-btn google">Continue with Google</button>
              <button type="button" className="alt-btn apple">Continue with Apple</button>
              <button type="button" className="alt-btn facebook">Continue with Facebook</button>
              <button type="button" className="alt-btn linkedin">Continue with LinkedIn</button>
            </div>

            <p className="signup-link">
              Don’t have an account? <a href="/signup">Sign Up</a>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Signin;

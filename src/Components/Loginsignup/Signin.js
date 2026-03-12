import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../Services/api';

// Map backend messages to friendlier text
const getFriendlyLoginError = (message) => {
  const text = String(message || '').toLowerCase();
  if (text.includes('inactive')) {
    return 'Your account needs to be verified. Please check your email and phone for codes.';
  }
  return message;
};

const Signin = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [resendAvailable, setResendAvailable] = useState(false);

  const redirectByRole = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.role === 'freelancer') {
      navigate('/find-work');
      return;
    }
    if (user?.role === 'client') {
      navigate('/talent');
      return;
    }
    navigate('/');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setNotice('');

    try {
      const identifier = method === 'phone' ? phone : email;
      await authAPI.login(identifier, password);
      redirectByRole();
    } catch (err) {
      const raw = err.message || 'Login failed. Please try again.';
      const msg = getFriendlyLoginError(raw);
      setError(msg);
      if (raw.toLowerCase().includes('inactive')) {
        setResendAvailable(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setError('');
    window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/google`;
  };

  const handleResend = async (channel) => {
    setLoading(true);
    setError('');
    setNotice('');
    try {
      if (method === 'phone') {
        await authAPI.resendOTP('', phone, channel);
      } else {
        await authAPI.resendOTP(email, '', channel);
      }
      setNotice(`Verification code resent via ${channel}.`);
    } catch (err) {
      setError(err.message || 'Unable to resend code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FB] flex items-center justify-center p-4 font-sans antialiased">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left panel - guidance */}
          <div className="md:w-2/5 bg-gradient-to-br from-[#F7F9FB] to-[#F7F9FB] p-8 md:p-10">
            <h2 className="text-4xl font-bold text-[#4A312F] mb-3">Welcome Back</h2>
            <p className="text-lg text-[#4A312F]/80 mb-6">
              Sign in to access your dashboard and manage services.
            </p>
            <ul className="space-y-3 text-[#4A312F]/70 mb-8">
              <li className="flex items-start gap-2">
                <span className="text-[#D34079] text-xl">•</span>
                <span>Secure access with multiple login options</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D34079] text-xl">•</span>
                <span>Fast onboarding for clients and talent</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D34079] text-xl">•</span>
                <span>Trusted payments and verified profiles</span>
              </li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <span className="bg-[#FBB9C2] text-[#4A312F] px-3 py-1.5 rounded-full text-sm font-medium">
                Forte Verified
              </span>
              <span className="bg-[#FBB9C2] text-[#4A312F] px-3 py-1.5 rounded-full text-sm font-medium">
                Secure Payments
              </span>
              <span className="bg-[#FBB9C2] text-[#4A312F] px-3 py-1.5 rounded-full text-sm font-medium">
                24/7 Support
              </span>
            </div>
          </div>

          {/* Right panel - signin form */}
          <div className="md:w-3/5 p-8 md:p-10">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-[#4A312F]">Sign in</h3>
              <p className="text-gray-500">Choose a login method that works for you.</p>
            </div>

            {/* Method toggle */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setMethod('email')}
                className={`py-3 px-4 rounded-xl font-semibold transition ${
                  method === 'email'
                    ? 'bg-[#D34079] text-white shadow-sm'
                    : 'bg-[#F7F9FB] text-[#4A312F] border border-[#B7E2BF] hover:bg-[#FBB9C2]'
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => setMethod('phone')}
                className={`py-3 px-4 rounded-xl font-semibold transition ${
                  method === 'phone'
                    ? 'bg-[#D34079] text-white shadow-sm'
                    : 'bg-[#F7F9FB] text-[#4A312F] border border-[#B7E2BF] hover:bg-[#FBB9C2]'
                }`}
              >
                Phone
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {method === 'email' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-[#4A312F] mb-1.5">
                      Email <span className="text-[#D34079]">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="you@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D34079]/20 focus:border-[#D34079] focus:shadow-sm transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#4A312F] mb-1.5">
                      Password <span className="text-[#D34079]">*</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D34079]/20 focus:border-[#D34079] focus:shadow-sm transition"
                    />
                  </div>
                </>
              )}

              {method === 'phone' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-[#4A312F] mb-1.5">
                      Phone number <span className="text-[#D34079]">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="+254712345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D34079]/20 focus:border-[#D34079] focus:shadow-sm transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#4A312F] mb-1.5">
                      Password <span className="text-[#D34079]">*</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D34079]/20 focus:border-[#D34079] focus:shadow-sm transition"
                    />
                  </div>
                </>
              )}

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-[#4A312F]">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 text-[#D34079] border-[#B7E2BF] rounded focus:ring-[#D34079]"
                  />
                  Remember me
                </label>
                <a href="/forgot" className="text-[#D34079] hover:underline font-medium">
                  Forgot password?
                </a>
              </div>

              {/* Notices */}
              {notice && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center justify-between">
                  <span>{notice}</span>
                  <button
                    type="button"
                    onClick={() => setNotice('')}
                    className="text-green-800 font-medium hover:underline"
                  >
                    OK
                  </button>
                </div>
              )}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center justify-between">
                  <span>{error}</span>
                  <button
                    type="button"
                    onClick={() => setError('')}
                    className="text-red-800 font-medium hover:underline"
                  >
                    OK
                  </button>
                </div>
              )}

              {/* Resend section for inactive accounts */}
              {resendAvailable && (
                <div className="bg-[#FEF3F3] border border-[#F4A9B8] rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-3">Didn't receive codes? Resend:</p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleResend('phone')}
                      disabled={loading}
                      className="flex-1 py-2.5 border border-[#D34079] text-[#D34079] font-medium rounded-lg hover:bg-[#D34079] hover:text-white transition disabled:opacity-50"
                    >
                      Phone
                    </button>
                    <button
                      type="button"
                      onClick={() => handleResend('email')}
                      disabled={loading}
                      className="flex-1 py-2.5 border border-[#D34079] text-[#D34079] font-medium rounded-lg hover:bg-[#D34079] hover:text-white transition disabled:opacity-50"
                    >
                      Email
                    </button>
                  </div>
                </div>
              )}

              {/* Sign in button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#D34079] text-white font-semibold rounded-xl shadow-sm hover:bg-[#b12f65] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              {/* Divider */}
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-[#B7E2BF]"></div>
                <span className="flex-shrink mx-4 text-[#4A312F]/50">OR</span>
                <div className="flex-grow border-t border-[#B7E2BF]"></div>
              </div>

              {/* Google login */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-[#B7E2BF] rounded-xl bg-white hover:bg-[#F7F9FB] transition"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                <span className="font-medium text-[#4A312F]">Continue with Google</span>
              </button>

              {/* Sign up link */}
              <p className="text-center text-[#4A312F] text-sm">
                Don't have an account?{' '}
                <a href="/signup" className="text-[#D34079] font-semibold hover:underline">
                  Sign Up
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
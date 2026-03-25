import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../Services/api';
import { LockKeyhole, ShieldCheck } from 'lucide-react';

// Map backend messages to friendlier text
const getFriendlyLoginError = (message) => {
  const text = String(message || '').toLowerCase();
  if (text.includes('inactive')) {
    return 'Your account needs to be verified. Please check your email or phone for codes.';
  }
  return message;
};

const LOGIN_STAGES = [
  "Verifying your details",
  "Securing your session",
  "Preparing your workspace",
];

// OTP input group (6 separate boxes) with paste support
const OtpInputGroup = ({ value, onChange, disabled }) => {
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/g, "");
    if (!val) return;
    const newOtp = value.split("");
    newOtp[index] = val.slice(-1);
    const newValue = newOtp.join("");
    onChange(newValue);
    if (val && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!paste) return;
    const newOtp = (paste.slice(0, 6) + "000000").slice(0, 6).split("");
    onChange(newOtp.join(""));
    const lastFilled = Math.min(paste.length, 6) - 1;
    if (lastFilled >= 0) inputsRef.current[lastFilled]?.focus();
  };

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {[...Array(6)].map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          disabled={disabled}
          className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D34079] focus:border-[#D34079] disabled:bg-gray-100"
        />
      ))}
    </div>
  );
};

const Signin = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // Verification View State
  const [verificationData, setVerificationData] = useState(null); // If set, show verification view
  const [phoneOtp, setPhoneOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);
  const [loginStageIndex, setLoginStageIndex] = useState(0);

  useEffect(() => {
    if (otpTimer > 0) setTimeout(() => setOtpTimer(t => t - 1), 1000);
  }, [otpTimer]);

  useEffect(() => {
    if (!loading) {
      setLoginStageIndex(0);
      return undefined;
    }

    const interval = setInterval(() => {
      setLoginStageIndex((current) => (current + 1) % LOGIN_STAGES.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [loading]);

  const redirectByRole = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.role === 'freelancer') {
      navigate('/my-profile/overview');
    } else if (user?.role === 'client') {
      navigate('/client-services/overview');
    } else {
      navigate('/');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setNotice('');

    try {
      await authAPI.login(identifier, password);
      redirectByRole();
    } catch (err) {
      // Check for verification needed 403
      if (err.response && err.response.status === 403 && err.response.data.verificationNeeded) {
        setVerificationData(err.response.data);
        // Pre-fill verified states based on backend response
        if (err.response.data.phoneVerified) setPhoneOtp("VERIFIED"); 
        if (err.response.data.emailVerified) setEmailOtp("VERIFIED");
        return;
      }

      const raw = err.message || 'Login failed. Please try again.';
      const msg = getFriendlyLoginError(raw);
      setError(msg);
      if (raw.toLowerCase().includes('inactive')) {
        setShowVerificationModal(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // Redirect to backend OAuth endpoint
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    window.location.href = `${baseUrl}/auth/${provider}`;
  };

  const getIdentifierType = () => {
    return identifier.includes('@') ? 'email' : 'phone';
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError('');
    setNotice('');
    try {
      const type = getIdentifierType();
      if (type === 'email') {
        await authAPI.resendOTP(identifier, '', 'email');
      } else {
        await authAPI.resendOTP('', identifier, 'phone');
      }
      setNotice(`Verification code resent via ${type}.`);
      // Auto‑close modal after successful resend? Keep it open so user sees the notice.
    } catch (err) {
      setError(err.message || 'Unable to resend code.');
    } finally {
      setResendLoading(false);
    }
  };

  const closeModal = () => {
    setShowVerificationModal(false);
    setError('');
    setNotice('');
  };

  const handleVerifyOtp = async (channel) => {
    setLoading(true);
    setError("");
    setNotice("");
    try {
      let res;
      const isEmail = channel === "email";
      const otp = isEmail ? emailOtp : phoneOtp;
      
      if (isEmail) {
        res = await authAPI.verifyEmailOTP(verificationData.pendingEmail, otp);
      } else {
        res = await authAPI.verifyPhoneOTP(verificationData.pendingEmail, verificationData.pendingPhoneNumber, otp);
      }

      // Update local verification status
      const newData = { ...verificationData };
      if (isEmail) newData.emailVerified = true;
      else newData.phoneVerified = true;
      setVerificationData(newData);

      // If response contains tokens, user is fully activated
      if (res.accessToken) {
        localStorage.setItem("accessToken", res.accessToken);
        localStorage.setItem("refreshToken", res.refreshToken);
        if (res.user) localStorage.setItem("user", JSON.stringify(res.user));
        navigate(res.user?.role === 'client' ? '/client-services/overview' : '/my-profile/overview');
      } else {
        setNotice(`${channel === "email" ? "Email" : "Phone"} verified successfully.`);
      }
    } catch (err) {
      setError(err.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async (channel) => {
    if (otpTimer > 0) return;
    setResendLoading(true);
    try {
      if (channel === "email") {
        await authAPI.resendOTP(verificationData.pendingEmail, "", "email");
      } else {
        await authAPI.resendOTP("", verificationData.pendingPhoneNumber, "phone");
      }
      setNotice(`Code resent to ${channel}.`);
      setOtpTimer(60);
    } catch (err) {
      setError(err.message || "Failed to resend.");
    } finally {
      setResendLoading(false);
    }
  };

  const LoadingPulse = () => (
    <div className="flex items-center gap-1.5" aria-hidden="true">
      <span className="h-2.5 w-2.5 rounded-full bg-white/95 animate-bounce" />
      <span className="h-2.5 w-2.5 rounded-full bg-white/80 animate-pulse" />
      <span className="h-2.5 w-2.5 rounded-full bg-white/65 animate-ping" />
    </div>
  );

  const activeLoginStage = LOGIN_STAGES[loginStageIndex];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#F7F9FB] via-white to-[#F7F9FB] flex items-center justify-center p-4 font-sans antialiased">
        <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-100 transform transition-all hover:scale-[1.01] duration-300">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-extrabold text-[#4A312F]">Welcome Back</h2>
            <p className="text-gray-500 mt-2">Sign in to continue</p>
          </div>

          {!verificationData ? (
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email/Phone field */}
            <div className="group">
              <label className="block text-sm font-medium text-[#4A312F] mb-1.5">
                Email or phone number <span className="text-[#D34079]">*</span>
              </label>
              <input
                type="text"
                placeholder="you@email.com or +254712345678"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                disabled={loading}
                className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D34079]/20 focus:border-[#D34079] focus:shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-medium text-[#4A312F] mb-1.5">
                Password <span className="text-[#D34079]">*</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D34079]/20 focus:border-[#D34079] focus:shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-[#4A312F]">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  disabled={loading}
                  className="w-4 h-4 text-[#D34079] border-[#B7E2BF] rounded focus:ring-[#D34079]"
                />
                Remember me
              </label>
              <a href="/forgot" className="text-[#D34079] hover:underline font-medium">
                Forgot password?
              </a>
            </div>

            {/* Inline notices (for quick feedback) */}
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
            {error && !showVerificationModal && (
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

            {/* Sign in button with production-ready loading state */}
            <button
              type="submit"
              disabled={loading}
              className={`relative w-full overflow-hidden rounded-xl py-4 text-white shadow-md transition focus:outline-none focus:ring-4 focus:ring-[#D34079]/20 ${
                loading
                  ? "cursor-wait bg-gradient-to-r from-[#D34079] via-[#C33770] to-[#B12F65]"
                  : "bg-[#D34079] hover:bg-[#b12f65]"
              }`}
              aria-busy={loading}
            >
              {loading ? (
                <span className="relative z-10 flex items-center justify-center gap-3 px-4 font-semibold">
                  <span className="relative flex h-11 w-11 shrink-0 items-center justify-center">
                    <span className="absolute inset-0 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm" />
                    <span className="absolute inset-0 rounded-full border border-white/25 animate-spin" />
                    <span className="absolute inset-[5px] rounded-full border border-white/20 animate-pulse" />
                    <LockKeyhole size={17} className="relative text-white" />
                  </span>
                  <span className="flex items-center gap-3 text-left">
                    <LoadingPulse />
                    <span>
                      <span className="block leading-none">Signing you in</span>
                      <span className="mt-1 block text-[11px] font-medium tracking-[0.16em] text-white/78 uppercase">
                        {activeLoginStage}
                      </span>
                    </span>
                  </span>
                  <ShieldCheck size={16} className="hidden text-white/85 sm:block animate-pulse" />
                </span>
              ) : (
                <span className="relative z-10 font-semibold">Sign In</span>
              )}
              {loading && (
                <>
                  <span className="absolute inset-y-0 left-0 w-1/2 -translate-x-full bg-white/10 blur-2xl animate-pulse" />
                  <span className="absolute inset-x-0 top-0 h-px bg-white/30" />
                  <span className="absolute inset-x-0 bottom-0 grid h-1 grid-cols-3 gap-1 bg-white/10 px-1">
                    <span className="h-full rounded-full bg-white/85 animate-pulse" />
                    <span className="h-full rounded-full bg-white/65 animate-pulse" />
                    <span className="h-full rounded-full bg-white/45 animate-pulse" />
                  </span>
                  <span className="absolute right-4 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-white/85 animate-ping" />
                  <span className="absolute left-4 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-white/65 animate-pulse" />
                </>
              )}
            </button>

            {loading && (
              <div className="rounded-2xl border border-[#EBC1D4] bg-[#FFF6FA] px-4 py-3">
                <div className="flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#A23967]">
                  <span>Login Progress</span>
                  <span>{loginStageIndex + 1}/3</span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {LOGIN_STAGES.map((stage, index) => {
                    const isActive = index === loginStageIndex;
                    const isCompleted = index < loginStageIndex;
                    return (
                      <div key={stage} className={`rounded-xl px-3 py-2 text-[11px] font-medium transition ${
                        isActive
                          ? "bg-[#D34079] text-white shadow-sm"
                          : isCompleted
                            ? "bg-[#F9DDE9] text-[#A23967]"
                            : "bg-white text-[#9E7A88]"
                      }`}>
                        {stage}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-[#B7E2BF]"></div>
              <span className="flex-shrink mx-4 text-[#4A312F]/50">OR</span>
              <div className="flex-grow border-t border-[#B7E2BF]"></div>
            </div>

            {/* Social login buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                disabled={loading}
                className="flex items-center justify-center py-3 px-2 border border-[#B7E2BF] rounded-xl bg-white hover:bg-[#F7F9FB] transition disabled:opacity-50"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('facebook')}
                disabled={loading}
                className="flex items-center justify-center py-3 px-2 border border-[#B7E2BF] rounded-xl bg-white hover:bg-[#F7F9FB] transition disabled:opacity-50"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                  alt="Facebook"
                  className="w-5 h-5"
                />
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('apple')}
                disabled={loading}
                className="flex items-center justify-center py-3 px-2 border border-[#B7E2BF] rounded-xl bg-white hover:bg-[#F7F9FB] transition disabled:opacity-50"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-black">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.67-1.48 3.676-2.948 1.158-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.69 3.56-1.702z" />
                </svg>
              </button>
            </div>

            {/* Sign up link */}
            <p className="text-center text-[#4A312F] text-sm">
              Don't have an account?{' '}
              <a href="/signup" className="text-[#D34079] font-semibold hover:underline">
                Sign Up
              </a>
            </p>
          </form>
          ) : (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-xl text-sm">
                Your account is inactive. Please complete verification.
              </div>

              {/* Phone Verification Section */}
              {verificationData.pendingPhoneNumber && (
                <div className={`p-5 rounded-xl border ${verificationData.phoneVerified ? "border-green-200 bg-green-50/30" : "border-gray-200"}`}>
                  <div className="flex justify-between mb-3">
                    <span className="font-medium text-[#4A312F]">Phone ({verificationData.pendingPhoneNumber})</span>
                    {verificationData.phoneVerified && <span className="text-green-600 font-bold">✓ Verified</span>}
                  </div>
                  {!verificationData.phoneVerified && (
                    <>
                      <OtpInputGroup value={phoneOtp} onChange={setPhoneOtp} disabled={loading} />
                      <div className="flex justify-between items-center mt-3">
                        <button
                          type="button"
                          onClick={() => handleResendOtp("phone")}
                          disabled={otpTimer > 0 || resendLoading}
                          className="text-sm text-[#D34079] hover:underline disabled:opacity-50"
                        >
                          {otpTimer > 0 ? `Wait ${otpTimer}s` : "Resend Code"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleVerifyOtp("phone")}
                          disabled={phoneOtp.length !== 6 || loading}
                          className="px-4 py-2 bg-[#D34079] text-white rounded-lg text-sm hover:bg-[#b12f65] disabled:opacity-50"
                        >
                          Verify
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Email Verification Section */}
              {verificationData.pendingEmail && (
                <div className={`p-5 rounded-xl border ${verificationData.emailVerified ? "border-green-200 bg-green-50/30" : "border-gray-200"}`}>
                  <div className="flex justify-between mb-3">
                    <span className="font-medium text-[#4A312F]">Email ({verificationData.pendingEmail})</span>
                    {verificationData.emailVerified && <span className="text-green-600 font-bold">✓ Verified</span>}
                  </div>
                  {!verificationData.emailVerified && (
                    <>
                      <OtpInputGroup value={emailOtp} onChange={setEmailOtp} disabled={loading} />
                      <div className="flex justify-between items-center mt-3">
                        <button
                          type="button"
                          onClick={() => handleResendOtp("email")}
                          disabled={otpTimer > 0 || resendLoading}
                          className="text-sm text-[#D34079] hover:underline disabled:opacity-50"
                        >
                          {otpTimer > 0 ? `Wait ${otpTimer}s` : "Resend Code"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleVerifyOtp("email")}
                          disabled={emailOtp.length !== 6 || loading}
                          className="px-4 py-2 bg-[#D34079] text-white rounded-lg text-sm hover:bg-[#b12f65] disabled:opacity-50"
                        >
                          Verify
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
              
              <button onClick={() => setVerificationData(null)} className="w-full text-[#4A312F] text-sm hover:underline">
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl transition-all duration-200 ease-out">
            <h3 className="text-2xl font-bold text-[#4A312F] mb-2">Verify Your Account</h3>
            <p className="text-gray-600 mb-6">
              Your account is not yet verified. Please check your email or phone for the verification code.
            </p>

            {notice && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4">
                {notice}
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={handleResend}
                disabled={resendLoading}
                className="w-full py-3 bg-[#D34079] text-white font-semibold rounded-xl hover:bg-[#b12f65] transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {resendLoading ? (
                  <>
                    <LoadingPulse />
                    <span>Sending...</span>
                  </>
                ) : (
                  'Resend Verification Code'
                )}
              </button>
              <button
                onClick={closeModal}
                className="w-full py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Signin;

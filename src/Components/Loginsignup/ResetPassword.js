import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { authAPI } from "../../Services/api";

// Constants
const OTP_LENGTH = 6;
const MIN_PASSWORD_LENGTH = 8;
const RESEND_COOLDOWN_SECONDS = 60;

/**
 * A polished OTP input with auto-focus, paste support, and inline resend option.
 */
const VerificationCodeInput = ({ value, onChange, onPaste, inputRefs, resendTimer, onResend, loading }) => {
  const handleChange = (index, event) => {
    const digit = event.target.value.replace(/\D/g, "").slice(-1);
    const newOtp = [...value];
    newOtp[index] = digit;
    onChange(newOtp);
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="space-y-3">
      {/* Label and resend button inline */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-[#4A312F]">
          Verification Code <span className="text-[#D34079]">*</span>
        </label>
        <button
          type="button"
          onClick={onResend}
          disabled={loading || resendTimer > 0}
          className="text-sm text-[#D34079] hover:underline disabled:opacity-50 disabled:no-underline"
        >
          {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}
        </button>
      </div>

      {/* OTP input boxes */}
      <div className="flex gap-3 justify-between" onPaste={onPaste}>
        {Array.from({ length: OTP_LENGTH }, (_, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[i] || ""}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-full aspect-square text-center text-xl font-semibold bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D34079]/30 focus:border-[#D34079] focus:bg-white transition shadow-sm"
            aria-label={`Digit ${i + 1}`}
          />
        ))}
      </div>

      {/* Helper text with alternative resend link */}
      <p className="text-xs text-gray-500">
        Didn't receive it? Check your spam folder or{" "}
        <button
          type="button"
          onClick={onResend}
          disabled={loading || resendTimer > 0}
          className="text-[#D34079] underline disabled:opacity-50"
        >
          request a new code
        </button>
        .
      </p>
    </div>
  );
};

/**
 * Main ResetPassword component.
 * Supports both token-based (from email link) and OTP-based (code + email) reset flows.
 */
const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL parameters (for token flow)
  const token = searchParams.get("token") || "";
  const emailParam = searchParams.get("email") || "";

  // Form state
  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" }); // 'success' or 'error'
  const [resendTimer, setResendTimer] = useState(0);

  // Refs for OTP inputs
  const otpInputsRef = useRef([]);

  // Focus first OTP input on mount if we're in OTP mode
  useEffect(() => {
    if (!token) {
      otpInputsRef.current[0]?.focus();
    }
  }, [token]);

  // Countdown timer for resend button
  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  // Handle paste into OTP fields
  const handleOtpPaste = useCallback((e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    const newOtp = Array(OTP_LENGTH).fill("");
    pastedData.split("").forEach((char, idx) => {
      newOtp[idx] = char;
    });
    setOtp(newOtp);

    // Focus the next empty input after paste
    const nextIndex = Math.min(pastedData.length, OTP_LENGTH - 1);
    otpInputsRef.current[nextIndex]?.focus();
  }, []);

  // Resend OTP code
  const handleResendCode = async () => {
    if (!email || resendTimer > 0) return;
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await authAPI.resendOTP(email, "", "email", "reset_password");
      setMessage({ type: "success", text: response?.message || "A new code has been sent." });
      setResendTimer(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Could not resend the code." });
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Validation
    if (!token) {
      if (!email) {
        setMessage({ type: "error", text: "Email is required." });
        return;
      }
      if (otp.join("").length !== OTP_LENGTH) {
        setMessage({ type: "error", text: "Please enter the 6-digit code from your email." });
        return;
      }
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setMessage({
        type: "error",
        text: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
      });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setLoading(true);
    try {
      if (token) {
        // Token-based reset (from email link)
        await authAPI.resetPassword(token, password);
      } else {
        // OTP-based reset
        await authAPI.resetPassword({ email, otp: otp.join(""), password });
      }
      setMessage({ type: "success", text: "Password reset successful! Redirecting to sign in..." });
      setTimeout(() => navigate("/signin"), 1500);
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Could not reset password." });
    } finally {
      setLoading(false);
    }
  };

  // Dismiss error message
  const dismissMessage = () => setMessage({ type: "", text: "" });

  return (
    <div className="min-h-screen bg-[#F7F9FB] flex items-center justify-center p-4 font-sans antialiased">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#4A312F]">Reset Password</h2>
          <p className="text-gray-500 mt-2">
            {token
              ? "Enter your new password below."
              : "Use the code sent to your email to set a new password."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* OTP flow fields (only shown when no token) */}
          {!token && (
            <>
              {/* Email field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#4A312F] mb-1.5">
                  Email <span className="text-[#D34079]">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D34079]/20 focus:border-[#D34079] focus:shadow-sm transition"
                />
              </div>

              {/* Verification Code Input with integrated resend */}
              <VerificationCodeInput
                value={otp}
                onChange={setOtp}
                onPaste={handleOtpPaste}
                inputRefs={otpInputsRef}
                resendTimer={resendTimer}
                onResend={handleResendCode}
                loading={loading}
              />
            </>
          )}

          {/* Password fields (always shown) */}
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-[#4A312F] mb-1.5">
              New Password <span className="text-[#D34079]">*</span>
            </label>
            <input
              id="new-password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D34079]/20 focus:border-[#D34079] focus:shadow-sm transition"
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-[#4A312F] mb-1.5">
              Confirm Password <span className="text-[#D34079]">*</span>
            </label>
            <input
              id="confirm-password"
              type="password"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D34079]/20 focus:border-[#D34079] focus:shadow-sm transition"
            />
          </div>

          {/* Message display (success/error) */}
          {message.text && (
            <div
              className={`px-4 py-3 rounded-xl flex items-center justify-between ${
                message.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-red-50 border border-red-200 text-red-600"
              }`}
            >
              <span>{message.text}</span>
              {message.type === "error" && (
                <button
                  type="button"
                  onClick={dismissMessage}
                  className="text-red-800 font-medium hover:underline"
                >
                  OK
                </button>
              )}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#D34079] text-white font-semibold rounded-xl shadow-sm hover:bg-[#b12f65] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          {/* Sign-in link */}
          <p className="text-center text-[#4A312F] text-sm">
            Remember your password?{" "}
            <Link to="/signin" className="text-[#D34079] font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
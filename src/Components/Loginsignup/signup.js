import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { authAPI } from "../../Services/api";
import debounce from "lodash/debounce"; // optional, or implement your own

// Friendly error messages
const getFriendlyAuthError = (message) => {
  const text = String(message || "").toLowerCase();
  if (text.includes("recipient email domain cannot receive mail"))
    return "That email domain cannot receive messages. Use a valid inbox email (e.g., Gmail or Outlook).";
  if (text.includes("email already registered"))
    return "This email is already registered. Sign in instead, or use Forgot Password.";
  return message || "Something went wrong. Please try again.";
};

// Simple spinner component
const Spinner = () => (
  <svg
    className="animate-spin h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

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
    // Focus the last filled input
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

// Password strength indicator
const PasswordStrength = ({ password }) => {
  const strength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const score = strength();
  const width = `${(score / 5) * 100}%`;
  const color =
    score <= 2 ? "bg-red-500" : score <= 4 ? "bg-yellow-500" : "bg-green-500";

  return (
    <div className="mt-1">
      <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-300`} style={{ width }} />
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {score <= 2 && "Weak"}
        {score === 3 && "Fair"}
        {score === 4 && "Good"}
        {score === 5 && "Strong"}
      </p>
    </div>
  );
};

const Signup = () => {
  const navigate = useNavigate();

  // Steps: 1 = role, 2 = details, 3 = OTP
  const [step, setStep] = useState(1);
  const [role, setRole] = useState(""); // "freelancer" or "client"

  // Form fields
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Validation errors
  const [fieldErrors, setFieldErrors] = useState({});

  // Email existence check
  const [emailExists, setEmailExists] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  // OTP state
  const [otpPhase, setOtpPhase] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [pendingPhone, setPendingPhone] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  // Resend timer
  const [resendTimer, setResendTimer] = useState(0);
  const [resendChannel, setResendChannel] = useState(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Refs for focus
  const firstFieldRef = useRef(null);
  const otpContainerRef = useRef(null);

  // Debounced email check
  const debouncedCheckEmail = useCallback(
    debounce(async (email) => {
      if (!email || !validateEmail(email)) {
        setEmailExists(false);
        return;
      }
      setCheckingEmail(true);
      try {
        const res = await authAPI.checkEmail(email); // assume returns { exists: boolean }
        setEmailExists(res.exists);
      } catch (err) {
        // ignore
      } finally {
        setCheckingEmail(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    debouncedCheckEmail(email);
    return () => debouncedCheckEmail.cancel();
  }, [email, debouncedCheckEmail]);

  // Focus first field when step changes
  useEffect(() => {
    if (step === 2) firstFieldRef.current?.focus();
    if (otpPhase) otpContainerRef.current?.focus();
  }, [step, otpPhase]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  // Validation helpers
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePhone = (phone) => phone && phone.length >= 10;
  const validatePassword = (pwd) => pwd.length >= 8;

  const validateField = (name, value) => {
    if (name === "email") {
      if (!validateEmail(value)) return "Enter a valid email address.";
      if (emailExists) return "This email is already registered.";
    }
    if (name === "phone" && !validatePhone(value))
      return "Enter a valid phone number.";
    if (name === "password" && !validatePassword(value))
      return "Password must be at least 8 characters.";
    if (name === "confirmPassword" && value !== password)
      return "Passwords do not match.";
    return null;
  };

  const handleBlur = (field) => {
    const value =
      field === "email"
        ? email
        : field === "phone"
        ? phone
        : field === "password"
        ? password
        : confirmPassword;
    const errorMsg = validateField(field, value);
    setFieldErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };

  // ----- Role step -----
  const selectRole = (selectedRole) => {
    setRole(selectedRole);
    setError("");
  };

  const continueToDetails = () => {
    if (!role) {
      setError("Please select a role to continue.");
      return;
    }
    setStep(2);
  };

  // ----- Account details step -----
  const handleDetailsSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const emailError = validateField("email", email);
    const phoneError = validateField("phone", phone);
    const passwordError = validateField("password", password);
    const confirmError = validateField("confirmPassword", confirmPassword);
    setFieldErrors({
      email: emailError,
      phone: phoneError,
      password: passwordError,
      confirmPassword: confirmError,
    });

    if (emailError || phoneError || passwordError || confirmError) {
      setError("Please fix the errors above.");
      return;
    }

    if (!terms) {
      setError("You must agree to the Terms and Privacy Policy.");
      return;
    }

    setLoading(true);
    setError("");
    setNotice("");
    setPhoneOtp("");
    setEmailOtp("");

    try {
      const userData = {
        role,
        ...(role === "freelancer" ? { name } : { companyName }),
        email,
        phoneNumber: phone,
        password,
        skills: [],
        languages: [],
        serviceMode: "",
      };

      const result = await authAPI.registerWithOTP(userData, true);
      setPendingEmail(result.pendingEmail || email);
      setPendingPhone(result.pendingPhoneNumber || phone);
      setOtpPhase(true);
      setNotice(result.message || "Verification codes sent to your email and phone.");
    } catch (err) {
      setError(getFriendlyAuthError(err.message));
    } finally {
      setLoading(false);
    }
  };

  // ----- OTP verification -----
  const verifyPhone = async () => {
    if (phoneOtp.length !== 6) {
      setError("Please enter the 6‑digit phone OTP.");
      return;
    }
    setLoading(true);
    setError("");
    setNotice("");
    try {
      await authAPI.verifyPhoneOTP(pendingEmail, pendingPhone, phoneOtp);
      setPhoneVerified(true);
      setPhoneOtp("");
      setNotice("✓ Phone verified successfully!");
    } catch (err) {
      setError(getFriendlyAuthError(err.message));
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async () => {
    if (emailOtp.length !== 6) {
      setError("Please enter the 6‑digit email OTP.");
      return;
    }
    setLoading(true);
    setError("");
    setNotice("");
    try {
      await authAPI.verifyEmailOTP(pendingEmail, emailOtp);
      setEmailVerified(true);
      setEmailOtp("");
      setNotice("✓ Email verified successfully!");
    } catch (err) {
      setError(getFriendlyAuthError(err.message));
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async (channel) => {
    if (resendTimer > 0) return;
    setLoading(true);
    setError("");
    setNotice("");
    try {
      if (channel === "phone") {
        await authAPI.resendOTP("", pendingPhone, channel);
      } else {
        await authAPI.resendOTP(pendingEmail, "", channel);
      }
      setNotice(`OTP resent via ${channel}.`);
      setResendTimer(60);
      setResendChannel(channel);
    } catch (err) {
      setError(getFriendlyAuthError(err.message));
    } finally {
      setLoading(false);
    }
  };

  const completeSignup = () => {
    navigate("/profile");
  };

  // Step indicator component
  const StepIndicator = () => (
    <div className="flex items-center justify-center space-x-4 mb-6">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
              (s === 1 && step >= 1) ||
              (s === 2 && step >= 2) ||
              (s === 3 && otpPhase)
                ? "bg-[#D34079] text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {s}
          </div>
          {s < 3 && (
            <div
              className={`w-12 h-1 ${
                step > s || (s === 2 && otpPhase) ? "bg-[#D34079]" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F9FB] via-white to-[#F7F9FB] flex items-center justify-center p-4 font-sans antialiased">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-100 transform transition-all hover:scale-[1.01] duration-300">
        <div className="text-center mb-4">
          <h2 className="text-4xl font-extrabold text-[#4A312F]">Join Forte</h2>
          <p className="text-gray-500 mt-1">
            {step === 1 && "Choose your path"}
            {step === 2 && "Create your account"}
            {otpPhase && "Verify your identity"}
          </p>
        </div>

        {/* Step indicator */}
        {!otpPhase && <StepIndicator />}

        {/* Accessible live region */}
        <div aria-live="polite" className="sr-only">
          {notice || error}
        </div>

        {/* Notice / Error messages */}
        {notice && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 flex items-center justify-between animate-fadeIn">
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice("")}
              className="text-green-800 font-medium hover:underline"
            >
              OK
            </button>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 flex items-center justify-between animate-fadeIn">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              className="text-red-800 font-medium hover:underline"
            >
              OK
            </button>
          </div>
        )}

        {!otpPhase ? (
          <>
            {/* Step 1: Role selection */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => selectRole("freelancer")}
                    className={`text-left p-5 rounded-xl border-2 transition-all ${
                      role === "freelancer"
                        ? "border-[#D34079] bg-[#FBB9C2]/10"
                        : "border-gray-200 hover:border-[#D34079]/30"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-[#4A312F]">Talent</h3>
                        <p className="text-sm text-[#4A312F]/70">Offer services</p>
                      </div>
                      {role === "freelancer" && (
                        <span className="text-[#D34079] text-xl">✓</span>
                      )}
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => selectRole("client")}
                    className={`text-left p-5 rounded-xl border-2 transition-all ${
                      role === "client"
                        ? "border-[#D34079] bg-[#FBB9C2]/10"
                        : "border-gray-200 hover:border-[#D34079]/30"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-[#4A312F]">Client</h3>
                        <p className="text-sm text-[#4A312F]/70">Hire talent</p>
                      </div>
                      {role === "client" && (
                        <span className="text-[#D34079] text-xl">✓</span>
                      )}
                    </div>
                  </button>
                </div>

                {/* Divider + Google */}
                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-[#B7E2BF]"></div>
                  <span className="flex-shrink mx-4 text-[#4A312F]/50">OR</span>
                  <div className="flex-grow border-t border-[#B7E2BF]"></div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    (window.location.href = `${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/auth/google`)
                  }
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-[#B7E2BF] rounded-xl bg-white hover:bg-[#F7F9FB] transition"
                >
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  <span className="font-medium text-[#4A312F]">Continue with Google</span>
                </button>

                {role && (
                  <button
                    type="button"
                    onClick={continueToDetails}
                    className="w-full bg-[#D34079] text-white font-semibold py-3 rounded-xl shadow-md hover:bg-[#b12f65] transition"
                  >
                    Continue
                  </button>
                )}
              </div>
            )}

            {/* Step 2: Account details */}
            {step === 2 && (
              <form onSubmit={handleDetailsSubmit} className="space-y-4">
                {/* Role‑specific fields */}
                {role === "freelancer" ? (
                  <div>
                    <label className="block text-sm font-medium text-[#4A312F] mb-1.5">
                      Full Name <span className="text-[#D34079]">*</span>
                    </label>
                    <input
                      ref={firstFieldRef}
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      required
                      className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D34079]/20 focus:border-[#D34079] focus:shadow-sm transition"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-[#4A312F] mb-1.5">
                      Company Name <span className="text-[#D34079]">*</span>
                    </label>
                    <input
                      ref={firstFieldRef}
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Acme Inc."
                      required
                      className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D34079]/20 focus:border-[#D34079] focus:shadow-sm transition"
                    />
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-[#4A312F] mb-1.5">
                    Email <span className="text-[#D34079]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => handleBlur("email")}
                      placeholder="you@email.com"
                      required
                      className={`w-full px-5 py-4 border rounded-xl transition ${
                        fieldErrors.email
                          ? "border-red-300 focus:ring-red-200"
                          : emailExists
                          ? "border-yellow-300 focus:ring-yellow-200"
                          : "border-gray-200 focus:ring-[#D34079]/20 focus:border-[#D34079]"
                      } focus:ring-2 focus:shadow-sm pr-12`}
                    />
                    {checkingEmail && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <Spinner />
                      </div>
                    )}
                  </div>
                  {fieldErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
                  )}
                  {!fieldErrors.email && emailExists && (
                    <p className="mt-1 text-sm text-yellow-600">
                      This email is already registered.{" "}
                      <a href="/signin" className="underline font-medium">
                        Sign in
                      </a>
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-[#4A312F] mb-1.5">
                    Phone Number <span className="text-[#D34079]">*</span>
                  </label>
                  <PhoneInput
                    international
                    defaultCountry="KE"
                    value={phone}
                    onChange={setPhone}
                    onBlur={() => handleBlur("phone")}
                    className={`w-full px-3 py-3 border rounded-xl ${
                      fieldErrors.phone ? "border-red-300" : "border-gray-200"
                    } focus-within:ring-2 focus-within:ring-[#D34079]/20 focus-within:border-[#D34079]`}
                  />
                  {fieldErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.phone}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-[#4A312F] mb-1.5">
                    Password <span className="text-[#D34079]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => handleBlur("password")}
                      placeholder="At least 8 characters"
                      required
                      minLength={8}
                      className={`w-full px-5 py-4 border rounded-xl transition ${
                        fieldErrors.password
                          ? "border-red-300 focus:ring-red-200"
                          : "border-gray-200 focus:ring-[#D34079]/20 focus:border-[#D34079]"
                      } focus:ring-2 focus:shadow-sm pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#D34079]"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {fieldErrors.password ? (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
                  ) : (
                    <PasswordStrength password={password} />
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-[#4A312F] mb-1.5">
                    Confirm Password <span className="text-[#D34079]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={() => handleBlur("confirmPassword")}
                      placeholder="Re‑enter password"
                      required
                      className={`w-full px-5 py-4 border rounded-xl transition ${
                        fieldErrors.confirmPassword
                          ? "border-red-300 focus:ring-red-200"
                          : "border-gray-200 focus:ring-[#D34079]/20 focus:border-[#D34079]"
                      } focus:ring-2 focus:shadow-sm pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#D34079]"
                    >
                      {showConfirm ? "Hide" : "Show"}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {fieldErrors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Terms */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={terms}
                    onChange={(e) => setTerms(e.target.checked)}
                    className="w-4 h-4 text-[#D34079] border-[#B7E2BF] rounded focus:ring-[#D34079]"
                  />
                  <label htmlFor="terms" className="text-sm text-[#4A312F]">
                    I agree to{" "}
                    <a href="/terms" className="text-[#D34079] hover:underline">
                      Terms
                    </a>{" "}
                    &{" "}
                    <a href="/privacy" className="text-[#D34079] hover:underline">
                      Privacy
                    </a>
                  </label>
                </div>

                {/* Navigation */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-3 border-2 border-[#4A312F] text-[#4A312F] font-semibold rounded-xl hover:bg-[#F7F9FB] transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || emailExists}
                    className="px-6 py-3 bg-[#D34079] text-white font-semibold rounded-xl shadow-md hover:bg-[#b12f65] transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading && <Spinner />}
                    {loading ? "Sending OTPs..." : "Create Account"}
                  </button>
                </div>
              </form>
            )}
          </>
        ) : (
          // OTP Verification Phase
          <div ref={otpContainerRef} tabIndex={-1} className="space-y-6 outline-none">
            <p className="text-gray-500 text-sm">
              Enter the 6‑digit codes sent to your email and phone.
            </p>

            {/* Phone verification */}
            <div
              className={`p-5 rounded-xl border transition-colors ${
                phoneVerified
                  ? "border-green-200 bg-green-50/30"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#4A312F]">Phone: {pendingPhone}</span>
                  {!phoneVerified && (
                    <button
                      type="button"
                      onClick={() => setOtpPhase(false)}
                      className="text-xs text-[#D34079] hover:underline"
                    >
                      (Edit)
                    </button>
                  )}
                </div>
                {phoneVerified && (
                  <span className="text-green-600 text-sm font-medium">✓ Verified</span>
                )}
              </div>
              {!phoneVerified && (
                <>
                  <OtpInputGroup
                    value={phoneOtp}
                    onChange={setPhoneOtp}
                    disabled={loading}
                  />
                  <div className="flex justify-between items-center mt-3">
                    <button
                      type="button"
                      onClick={() => resendOtp("phone")}
                      disabled={loading || resendTimer > 0}
                      className="text-sm text-[#D34079] hover:underline disabled:opacity-50"
                    >
                      {resendTimer > 0 && resendChannel === "phone"
                        ? `Resend in ${resendTimer}s`
                        : "Resend code"}
                    </button>
                    <button
                      type="button"
                      onClick={verifyPhone}
                      disabled={loading || phoneOtp.length !== 6}
                      className="px-5 py-2 bg-[#D34079] text-white font-medium rounded-lg hover:bg-[#b12f65] disabled:opacity-50 flex items-center gap-2"
                    >
                      {loading && <Spinner />}
                      Verify
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Email verification */}
            <div
              className={`p-5 rounded-xl border transition-colors ${
                emailVerified
                  ? "border-green-200 bg-green-50/30"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#4A312F]">Email: {pendingEmail}</span>
                  {!emailVerified && (
                    <button
                      type="button"
                      onClick={() => setOtpPhase(false)}
                      className="text-xs text-[#D34079] hover:underline"
                    >
                      (Edit)
                    </button>
                  )}
                </div>
                {emailVerified && (
                  <span className="text-green-600 text-sm font-medium">✓ Verified</span>
                )}
              </div>
              {!emailVerified && (
                <>
                  <OtpInputGroup
                    value={emailOtp}
                    onChange={setEmailOtp}
                    disabled={loading}
                  />
                  <div className="flex justify-between items-center mt-3">
                    <button
                      type="button"
                      onClick={() => resendOtp("email")}
                      disabled={loading || resendTimer > 0}
                      className="text-sm text-[#D34079] hover:underline disabled:opacity-50"
                    >
                      {resendTimer > 0 && resendChannel === "email"
                        ? `Resend in ${resendTimer}s`
                        : "Resend code"}
                    </button>
                    <button
                      type="button"
                      onClick={verifyEmail}
                      disabled={loading || emailOtp.length !== 6}
                      className="px-5 py-2 bg-[#D34079] text-white font-medium rounded-lg hover:bg-[#b12f65] disabled:opacity-50 flex items-center gap-2"
                    >
                      {loading && <Spinner />}
                      Verify
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Final action */}
            {phoneVerified && emailVerified ? (
              <button
                type="button"
                onClick={completeSignup}
                disabled={loading}
                className="w-full py-4 bg-[#D34079] text-white font-semibold rounded-xl shadow-md hover:bg-[#b12f65] transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Spinner />}
                {loading ? "Completing..." : "Go to Profile"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setOtpPhase(false)}
                disabled={loading}
                className="w-full py-4 border-2 border-gray-200 text-[#4A312F] font-semibold rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
              >
                Back to edit info
              </button>
            )}
          </div>
        )}

        {/* Sign in link */}
        <p className="text-center text-[#4A312F] text-sm mt-6">
          Already have an account?{" "}
          <a href="/signin" className="text-[#D34079] font-semibold hover:underline">
            Sign In
          </a>
        </p>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Signup;
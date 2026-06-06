import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { authAPI } from "../../services/api";

const getFriendlyAuthError = (message) => {
  const text = String(message || "").toLowerCase();
  if (text.includes("email already registered")) {
    return "This email is already registered. Sign in instead, or use Forgot Password.";
  }
  return message || "Something went wrong. Please try again.";
};

const Spinner = () => (
  <svg
    className="animate-spin h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const validateEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const continueToDetails = () => {
    if (!role) {
      setError("Please select a role to continue.");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!terms) {
      setError("You must agree to the Terms and Privacy Policy.");
      return;
    }

    setLoading(true);
    setError("");
    setNotice("");

    try {
      const result = await authAPI.register({
        role,
        email,
        password,
        accountType: "INDIVIDUAL",
      });

      if (result?.accessToken && result?.user) {
        setNotice("Account created successfully.");
      }

      navigate("/auth/profile-completion");
    } catch (err) {
      setError(getFriendlyAuthError(err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] via-white to-[#F2F2F2] flex items-center justify-center p-4 font-sans antialiased">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-100 transform transition-all hover:scale-[1.01] duration-300">
        <div className="text-center mb-4">
          <h2 className="text-4xl font-extrabold text-[#4C1D95]">Join Forte</h2>
          <p className="text-gray-500 mt-1">{step === 1 ? "Choose your path" : "Create your account"}</p>
        </div>

        <div aria-live="polite" className="sr-only">
          {notice || error}
        </div>

        {notice && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 flex items-center justify-between animate-fadeIn">
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice("")} className="text-green-800 font-medium hover:underline">
              OK
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 flex items-center justify-between animate-fadeIn">
            <span>{error}</span>
            <button type="button" onClick={() => setError("")} className="text-red-800 font-medium hover:underline">
              OK
            </button>
          </div>
        )}

        {step === 1 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole("freelancer")}
                className={`text-left p-5 rounded-xl border-2 transition-all ${
                  role === "freelancer" ? "border-[#A855F7] bg-[#C084FC]/10" : "border-gray-200 hover:border-[#A855F7]/30"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-[#4C1D95]">Talent</h3>
                    <p className="text-sm text-[#4C1D95]/70">Offer services</p>
                  </div>
                  {role === "freelancer" && <span className="text-[#A855F7] text-xl">✓</span>}
                </div>
              </button>
              <button
                type="button"
                onClick={() => setRole("client")}
                className={`text-left p-5 rounded-xl border-2 transition-all ${
                  role === "client" ? "border-[#A855F7] bg-[#C084FC]/10" : "border-gray-200 hover:border-[#A855F7]/30"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-[#4C1D95]">Client</h3>
                    <p className="text-sm text-[#4C1D95]/70">Hire talent</p>
                  </div>
                  {role === "client" && <span className="text-[#A855F7] text-xl">✓</span>}
                </div>
              </button>
            </div>

            <button
              type="button"
              onClick={continueToDetails}
              className="w-full bg-[#A855F7] text-white font-semibold py-3 rounded-xl shadow-md hover:bg-[#7C3AED] transition"
            >
              Continue
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#4C1D95] mb-1.5">
                Email <span className="text-[#A855F7]">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
                className="w-full px-5 py-4 border rounded-xl border-gray-200 focus:ring-2 focus:ring-[#A855F7]/20 focus:border-[#A855F7] focus:shadow-sm transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4C1D95] mb-1.5">
                Password <span className="text-[#A855F7]">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                minLength={8}
                className="w-full px-5 py-4 border rounded-xl border-gray-200 focus:ring-2 focus:ring-[#A855F7]/20 focus:border-[#A855F7] focus:shadow-sm transition"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                className="w-4 h-4 text-[#A855F7] border-[#E5E7EB] rounded focus:ring-[#A855F7]"
              />
              <label htmlFor="terms" className="text-sm text-[#4C1D95]">
                I agree to <a href="/terms" className="text-[#A855F7] hover:underline">Terms</a> &{" "}
                <a href="/privacy" className="text-[#A855F7] hover:underline">Privacy</a>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-3 border-2 border-[#4C1D95] text-[#4C1D95] font-semibold rounded-xl hover:bg-[#F2F2F2] transition"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-[#A855F7] text-white font-semibold rounded-xl shadow-md hover:bg-[#7C3AED] transition disabled:opacity-50 flex items-center gap-2"
              >
                {loading && <Spinner />}
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Signup;

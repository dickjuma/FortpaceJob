import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { authAPI, profileAPI } from "../../Services/api";

// ---------- Data constants (unchanged) ----------
const allSkills = ["React","Node.js","UI/UX","Python","Django","JavaScript","TailwindCSS","Figma","Next.js","Vue.js","Angular","PHP"];
const countries = ["Kenya","USA","UK","Canada","India","Germany"];
const languages = ["English","French","Spanish","Swahili","German","Hindi"];
const currencies = ["KES","USD","EUR","GBP","INR","CAD"];
const industries = ["Technology","Finance","Healthcare","Education","E-commerce","Marketing","Manufacturing"];
const serviceModes = ["Fully online","Physical on-site","Hybrid (online + on-site)"];
const physicalCategories = ["Mechanical","Electrical","Auto repair","Home services","Beauty/Wellness","Other"];
const physicalMicroSectors = {
  Mechanical: ["Engine diagnostics","Machine maintenance","Welding","CNC operation","HVAC systems","Pumps and valves"],
  Electrical: ["Residential wiring","Commercial wiring","Panel upgrades","Solar installation","Generator setup","Troubleshooting"],
  "Auto repair": ["Oil change","Brake service","Diagnostics","Suspension","AC service","Battery and starter"],
  "Home services": ["Plumbing","Carpentry","Painting","Appliance repair","Pest control","Roofing"],
  "Beauty/Wellness": ["Hair styling","Nails","Makeup","Massage","Barbering","Skincare"],
  "Other": ["General repairs","Handyman","Installation","Inspection","Other"]
};

const stepGuidance = {
  freelancer: {
    1: "Choose your role",
    2: "Create your account",
    3: "Services you offer (online or on-site)",
    4: "Add your skills & bio",
    5: "Set your hourly rate & currency",
    6: "Upload portfolio files & intro video",
    7: "Select country, languages & agree to terms"
  },
  client: {
    1: "Choose your role",
    2: "Create your company account",
    3: "Type of services you need",
    4: "Company industry & niche",
    5: "Budget, location & hiring capacity"
  }
};

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [direction, setDirection] = useState(0);
  const [formData, setFormData] = useState({
    name:"", email:"", phoneNumber:"", password:"", avatar:null, skills:[], bio:"", hourlyRate:10, currency:"KES",
    portfolio:[], portfolioVideos:[],
    companyName:"", companyDescription:"", industry:"", budget:"", hiringCapacity:"", companyLogo:null,
    serviceMode:"", physicalCategory:"", serviceArea:"",
    country:"", languages:[], terms:false
  });
  const [uploadPayload, setUploadPayload] = useState({
    avatarFile: null,
    companyLogoFile: null,
    portfolioFiles: [],
    introVideoFile: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [otpPhase, setOtpPhase] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [pendingPhone, setPendingPhone] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [customSkill, setCustomSkill] = useState("");

  const totalSteps = role === "client" ? 5 : 7;
  const progress = (step / totalSteps) * 100;

  // Navigation
  const nextStep = () => {
    if (step === 1 && role === "") {
      setError("Select a role to continue.");
      return;
    }
    setError("");
    setDirection(1);
    setStep(s => s + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep(s => s - 1);
  };

  // Form change handlers
  const handleChange = e => {
    const { name, value } = e.target;
    if (name === "serviceMode") {
      setFormData(prev => ({
        ...prev,
        serviceMode: value,
        physicalCategory: "",
        serviceArea: "",
        skills: []
      }));
      return;
    }
    if (name === "physicalCategory") {
      setFormData(prev => ({
        ...prev,
        physicalCategory: value,
        skills: []
      }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (type === "avatar") {
      setFormData(prev => ({ ...prev, avatar: URL.createObjectURL(files[0]) }));
      setUploadPayload(prev => ({ ...prev, avatarFile: files[0] }));
    }
    if (type === "logo") {
      setFormData(prev => ({ ...prev, companyLogo: URL.createObjectURL(files[0]) }));
      setUploadPayload(prev => ({ ...prev, companyLogoFile: files[0] }));
    }
    if (type === "portfolio") {
      setFormData(prev => ({
        ...prev,
        portfolio: [...prev.portfolio, ...files.map(f => URL.createObjectURL(f))]
      }));
      setUploadPayload(prev => ({
        ...prev,
        portfolioFiles: [...prev.portfolioFiles, ...files]
      }));
    }
    if (type === "video") {
      setFormData(prev => ({ ...prev, portfolioVideos: [URL.createObjectURL(files[0])] }));
      setUploadPayload(prev => ({ ...prev, introVideoFile: files[0] }));
    }
  };

  const toggleSkill = skill => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const addCustomSkill = () => {
    const value = customSkill.trim();
    if (!value) return;
    if (formData.skills.some(s => s.toLowerCase() === value.toLowerCase())) {
      setCustomSkill("");
      return;
    }
    setFormData(prev => ({ ...prev, skills: [...prev.skills, value] }));
    setCustomSkill("");
  };

  const toggleLanguage = lang => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang]
    }));
  };

  // Password strength indicator
  const passwordStrength = pwd => {
    if (pwd.length > 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) return "strong";
    if (pwd.length >= 6) return "medium";
    return "weak";
  };

  // API helpers
  const getFriendlyAuthError = (message) => {
    const text = String(message || "").toLowerCase();
    if (text.includes("recipient email domain cannot receive mail"))
      return "That email domain cannot receive messages. Use a valid inbox email (e.g., Gmail or Outlook).";
    if (text.includes("could not send email otp"))
      return "We could not send the phone OTP right now. Confirm your phone number and try again.";
    if (text.includes("email already registered"))
      return "This email is already registered. Sign in instead, or use Forgot Password.";
    if (text.includes("verification pending"))
      return "Verification pending. New codes were sent to your email and phone.";
    return message || "Something went wrong. Please try again.";
  };

  // Step 1: Register & send OTPs
  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.terms) {
      setError("You must agree to Terms and Privacy to continue.");
      return;
    }

    setLoading(true);
    setError("");
    setNotice("");

    try {
      const userData = {
        role,
        fullName: formData.name || formData.companyName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        otpChannel: "phone",
        password: formData.password,
        name: formData.name,
        companyName: formData.companyName,
        bio: formData.bio,
        skills: formData.skills,
        hourlyRate: formData.hourlyRate,
        currency: formData.currency,
        serviceMode: formData.serviceMode,
        physicalCategory: formData.physicalCategory,
        serviceArea: formData.serviceArea,
        country: formData.country,
        languages: formData.languages,
        companyDescription: formData.companyDescription,
        industry: formData.industry,
        budget: formData.budget,
        hiringCapacity: formData.hiringCapacity,
      };

      const result = await authAPI.registerWithOTP(userData, true);
      setPendingEmail(result.pendingEmail || formData.email);
      setPendingPhone(result.pendingPhoneNumber || formData.phoneNumber);
      setPhoneVerified(false);
      setEmailVerified(false);
      setOtpPhase(true);
      setNotice(result.message || "Verification codes sent to your email and phone.");
    } catch (err) {
      setError(getFriendlyAuthError(err.message));
    } finally {
      setLoading(false);
    }
  };

  // Verify phone OTP separately
  const verifyPhone = async () => {
    if (!phoneOtp.trim()) {
      setError("Please enter the phone OTP.");
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

  // Verify email OTP separately
  const verifyEmail = async () => {
    if (!emailOtp.trim()) {
      setError("Please enter the email OTP.");
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

  // Final step: after both verified, create account and upload files
  const completeSignup = async () => {
    setLoading(true);
    setError("");
    setNotice("Account created. Uploading signup media...");

    try {
      // Upload optional files (non-blocking)
      const uploadJobs = [];
      if (role === "freelancer" && uploadPayload.avatarFile) {
        uploadJobs.push(profileAPI.uploadAvatar(uploadPayload.avatarFile));
      }
      if (role === "client" && uploadPayload.companyLogoFile) {
        uploadJobs.push(profileAPI.uploadCompanyLogo(uploadPayload.companyLogoFile));
      }
      if (uploadPayload.portfolioFiles.length) {
        uploadJobs.push(profileAPI.uploadPortfolio(uploadPayload.portfolioFiles));
      }
      if (role === "freelancer" && uploadPayload.introVideoFile) {
        uploadJobs.push(profileAPI.uploadIntroVideo(uploadPayload.introVideoFile));
      }

      let uploadFailures = 0;
      if (uploadJobs.length) {
        const results = await Promise.allSettled(uploadJobs);
        uploadFailures = results.filter(r => r.status === "rejected").length;
      }

      if (uploadFailures > 0) {
        setNotice("Account created. Some files failed to upload; you can update them later in My Profile.");
      } else {
        setNotice("Account created successfully.");
      }

      // Redirect based on role
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.role === "freelancer") navigate("/find-work");
      else if (user?.role === "client") navigate("/talent");
      else navigate("/");
    } catch (err) {
      setError(getFriendlyAuthError(err.message) || "Failed to complete signup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async (channel = "both") => {
    setLoading(true);
    setError("");
    setNotice("");
    try {
      if (channel === 'phone') {
        await authAPI.resendOTP('', pendingPhone || formData.phoneNumber, channel);
      } else {
        await authAPI.resendOTP(pendingEmail || formData.email, '', channel);
      }
      setNotice(`OTP resent via ${channel}.`);
    } catch (err) {
      setError(getFriendlyAuthError(err.message));
    } finally {
      setLoading(false);
    }
  };

  // UI helpers
  const isPhysical = formData.serviceMode === "Physical on-site" || formData.serviceMode === "Hybrid (online + on-site)";
  const skillOptions = isPhysical && formData.physicalCategory
    ? (physicalMicroSectors[formData.physicalCategory] || [])
    : allSkills;

  const variants = {
    initial: dir => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    animate: { x: 0, opacity: 1 },
    exit: dir => ({ x: dir < 0 ? "100%" : "-100%", opacity: 0 })
  };

  // ---------- Render ----------
  return (
    <div className="min-h-screen bg-[#F7F9FB] flex items-center justify-center p-4 font-sans antialiased">
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left panel - guidance (simplified) */}
          <div className="md:w-2/5 bg-gradient-to-br from-[#F7F9FB] to-[#F7F9FB] p-8 md:p-10">
            <h2 className="text-4xl font-bold text-[#4A312F] mb-3">Join Forte</h2>
            <p className="text-lg text-[#4A312F]/80 mb-6">
              Create your account and start offering or hiring trusted services.
            </p>
            <ul className="space-y-3 text-[#4A312F]/70 mb-8">
              <li className="flex items-start gap-2">
                <span className="text-[#D34079] text-xl">•</span>
                <span>Verified profiles and secure payments</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D34079] text-xl">•</span>
                <span>Online and physical service categories</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D34079] text-xl">•</span>
                <span>Showcase your portfolio or post your needs</span>
              </li>
            </ul>
            <p className="text-[#4A312F] font-medium text-lg">
              {role ? stepGuidance[role][step] : stepGuidance.freelancer[step]}
            </p>
          </div>

          {/* Right panel - form */}
          <div className="md:w-3/5 p-8 md:p-10">
            {/* Progress bar at top */}
            <div className="w-full h-1 bg-gray-100 rounded-full mb-6">
              <div
                className="h-full bg-[#D34079] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {otpPhase ? (
              // ---------- OTP Verification Phase (Fiverr-like) ----------
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-[#4A312F]">Verify your accounts</h3>
                <p className="text-gray-500">We’ve sent 6‑digit codes to your email and phone.</p>

                {notice && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center justify-between">
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
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center justify-between">
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

                {/* Phone verification */}
                <div className={`p-5 rounded-xl border ${phoneVerified ? 'border-green-200 bg-green-50/30' : 'border-gray-200 bg-white'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-[#4A312F]">Phone: {pendingPhone}</span>
                    {phoneVerified && <span className="text-green-600 text-sm font-medium">✓ Verified</span>}
                  </div>
                  {!phoneVerified && (
                    <>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={phoneOtp}
                          onChange={e => setPhoneOtp(e.target.value)}
                          placeholder="6-digit code"
                          maxLength="6"
                          className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D34079]/20 focus:border-[#D34079] transition"
                        />
                        <button
                          type="button"
                          onClick={verifyPhone}
                          disabled={loading || !phoneOtp.trim()}
                          className="px-5 py-3 bg-[#D34079] text-white font-medium rounded-lg hover:bg-[#b12f65] disabled:opacity-50 transition"
                        >
                          Verify
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleResendOtp("phone")}
                        disabled={loading}
                        className="mt-2 text-sm text-[#D34079] hover:underline disabled:opacity-50"
                      >
                        Resend code
                      </button>
                    </>
                  )}
                </div>

                {/* Email verification */}
                <div className={`p-5 rounded-xl border ${emailVerified ? 'border-green-200 bg-green-50/30' : 'border-gray-200 bg-white'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-[#4A312F]">Email: {pendingEmail}</span>
                    {emailVerified && <span className="text-green-600 text-sm font-medium">✓ Verified</span>}
                  </div>
                  {!emailVerified && (
                    <>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={emailOtp}
                          onChange={e => setEmailOtp(e.target.value)}
                          placeholder="6-digit code"
                          maxLength="6"
                          className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D34079]/20 focus:border-[#D34079] transition"
                        />
                        <button
                          type="button"
                          onClick={verifyEmail}
                          disabled={loading || !emailOtp.trim()}
                          className="px-5 py-3 bg-[#D34079] text-white font-medium rounded-lg hover:bg-[#b12f65] disabled:opacity-50 transition"
                        >
                          Verify
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleResendOtp("email")}
                        disabled={loading}
                        className="mt-2 text-sm text-[#D34079] hover:underline disabled:opacity-50"
                      >
                        Resend code
                      </button>
                    </>
                  )}
                </div>

                {/* Final action */}
                {phoneVerified && emailVerified ? (
                  <button
                    type="button"
                    onClick={completeSignup}
                    disabled={loading}
                    className="w-full py-4 bg-[#D34079] text-white font-semibold rounded-xl shadow-sm hover:bg-[#b12f65] transition disabled:opacity-50"
                  >
                    {loading ? "Completing..." : "Complete Signup"}
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
            ) : (
              // ---------- Main Multi-step Form ----------
              <form onSubmit={handleSubmit} className="space-y-6">
                {notice && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center justify-between">
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
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center justify-between">
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

                <AnimatePresence custom={direction} mode="wait">
                  {/* Step 1: Role Selection (with checkmark indicator) */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      custom={direction}
                      variants={variants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.5 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setRole("freelancer")}
                          className={`text-left p-6 rounded-xl border-2 transition ${
                            role === "freelancer"
                              ? "border-[#D34079] bg-[#FBB9C2]/10"
                              : "border-gray-200 hover:border-[#D34079]/30"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-bold text-[#4A312F] mb-2">Join as Talent</h3>
                              <p className="text-[#4A312F]/70">Offer services and grow your business.</p>
                            </div>
                            {role === "freelancer" && (
                              <span className="text-[#D34079] text-2xl">✓</span>
                            )}
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setRole("client")}
                          className={`text-left p-6 rounded-xl border-2 transition ${
                            role === "client"
                              ? "border-[#D34079] bg-[#FBB9C2]/10"
                              : "border-gray-200 hover:border-[#D34079]/30"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-bold text-[#4A312F] mb-2">Join as Client</h3>
                              <p className="text-[#4A312F]/70">Hire verified talent.</p>
                            </div>
                            {role === "client" && (
                              <span className="text-[#D34079] text-2xl">✓</span>
                            )}
                          </div>
                        </button>
                      </div>

                      <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-[#B7E2BF]"></div>
                        <span className="flex-shrink mx-4 text-[#4A312F]/50">OR</span>
                        <div className="flex-grow border-t border-[#B7E2BF]"></div>
                      </div>

                      <button
                        type="button"
                        onClick={() => (window.location.href = `${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/auth/google`)}
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
                          onClick={nextStep}
                          className="w-full bg-[#D34079] text-white font-semibold py-3 px-6 rounded-xl shadow-sm hover:bg-[#b12f65] transition"
                        >
                          Continue
                        </button>
                      )}
                    </motion.div>
                  )}

                  {/* Step 2: Freelancer - Account Details */}
                  {step === 2 && role === "freelancer" && (
                    <motion.div
                      key="freelancer2"
                      custom={direction}
                      variants={variants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.5 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-[#4A312F] mb-1.5">
                          Name <span className="text-[#D34079]">*</span>
                        </label>
                        <input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Full Name"
                          required
                          className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D34079]/20 focus:border-[#D34079] focus:shadow-sm transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#4A312F] mb-1.5">
                          Email <span className="text-[#D34079]">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Email"
                          required
                          className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D34079]/20 focus:border-[#D34079] focus:shadow-sm transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#4A312F] mb-1.5">
                          Phone Number <span className="text-[#D34079]">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          placeholder="+254700000000"
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
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Password"
                          required
                          className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D34079]/20 focus:border-[#D34079] focus:shadow-sm transition"
                        />
                        <p
                          className={`mt-1 text-sm font-medium ${
                            passwordStrength(formData.password) === "strong"
                              ? "text-green-600"
                              : passwordStrength(formData.password) === "medium"
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          Strength: {passwordStrength(formData.password)}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#4A312F] mb-1.5">Profile Picture</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleFileChange(e, "avatar")}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FBB9C2] file:text-[#4A312F] hover:file:bg-[#FBB9C2]/80"
                        />
                        {formData.avatar && (
                          <img
                            src={formData.avatar}
                            alt="avatar preview"
                            className="mt-3 w-24 h-24 rounded-full object-cover border-4 border-[#D34079]"
                          />
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Client - Account Details */}
                  {step === 2 && role === "client" && (
                    <motion.div
                      key="client2"
                      custom={direction}
                      variants={variants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.5 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-[#4A312F] mb-1.5">
                          Company Name <span className="text-[#D34079]">*</span>
                        </label>
                        <input
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          placeholder="Company Name"
                          required
                          className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D34079]/20 focus:border-[#D34079] focus:shadow-sm transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#4A312F] mb-1.5">
                          Email <span className="text-[#D34079]">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Company Email"
                          required
                          className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D34079]/20 focus:border-[#D34079] focus:shadow-sm transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#4A312F] mb-1.5">
                          Phone Number <span className="text-[#D34079]">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          placeholder="+254700000000"
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
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Password"
                          required
                          className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D34079]/20 focus:border-[#D34079] focus:shadow-sm transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#4A312F] mb-1.5">Company Logo</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleFileChange(e, "logo")}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FBB9C2] file:text-[#4A312F] hover:file:bg-[#FBB9C2]/80"
                        />
                        {formData.companyLogo && (
                          <img
                            src={formData.companyLogo}
                            alt="logo preview"
                            className="mt-3 w-24 h-24 rounded-lg object-cover border-4 border-[#D34079]"
                          />
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Freelancer - Service Type */}
                  {step === 3 && role === "freelancer" && (
                    <motion.div
                      key="freelancer3"
                      custom={direction}
                      variants={variants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.5 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-[#4A312F] mb-1.5">Service Type</label>
                        <select
                          name="serviceMode"
                          value={formData.serviceMode}
                          onChange={handleChange}
                          required
                          className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D34079]/20 focus:border-[#D34079] focus:shadow-sm transition"
                        >
                          <option value="">Select service type</option>
                          {serviceModes.map(mode => <option key={mode}>{mode}</option>)}
                        </select>
                      </div>
                      {(formData.serviceMode === "Physical on-site" || formData.serviceMode === "Hybrid (online + on-site)") && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-[#4A312F] mb-1.5">Physical Service Category</label>
                            <select
                              name="physicalCategory"
                              value={formData.physicalCategory}
                              onChange={handleChange}
                              required
                              className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D34079]/20 focus:border-[#D34079] focus:shadow-sm transition"
                            >
                              <option value="">Select category</option>
                              {physicalCategories.map(cat => <option key={cat}>{cat}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#4A312F] mb-1.5">Service Area</label>
                            <input
                              name="serviceArea"
                              value={formData.serviceArea}
                              onChange={handleChange}
                              placeholder="City or service radius"
                              className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D34079]/20 focus:border-[#D34079] focus:shadow-sm transition"
                            />
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}

                  {/* Step 3: Client - Service Type Needed */}
                  {step === 3 && role === "client" && (
                    <motion.div
                      key="client3"
                      custom={direction}
                      variants={variants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.5 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-[#4A312F] mb-1.5">Service Type Needed</label>
                        <select
                          name="serviceMode"
                          value={formData.serviceMode}
                          onChange={handleChange}
                          required
                          className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D34079]/20 focus:border-[#D34079] focus:shadow-sm transition"
                        >
                          <option value="">Select service type</option>
                          {serviceModes.map(mode => <option key={mode}>{mode}</option>)}
                        </select>
                      </div>
                      {(formData.serviceMode === "Physical on-site" || formData.serviceMode === "Hybrid (online + on-site)") && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-[#4A312F] mb-1.5">Physical Service Category</label>
                            <select
                              name="physicalCategory"
                              value={formData.physicalCategory}
                              onChange={handleChange}
                              required
                              className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D34079]/20 focus:border-[#D34079] focus:shadow-sm transition"
                            >
                              <option value="">Select category</option>
                              {physicalCategories.map(cat => <option key={cat}>{cat}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#4A312F] mb-1.5">Service Location</label>
                            <input
                              name="serviceArea"
                              value={formData.serviceArea}
                              onChange={handleChange}
                              placeholder="City or address"
                              className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D34079]/20 focus:border-[#D34079] focus:shadow-sm transition"
                            />
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}

                  {/* Step 4: Freelancer - Skills & Bio */}
                  {step === 4 && role === "freelancer" && (
                    <motion.div
                      key="freelancer4"
                      custom={direction}
                      variants={variants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.5 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-[#4A312F] mb-2">
                          {isPhysical ? "Micro Sectors / Specialties" : "Skills"}
                        </label>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {skillOptions.map(skill => (
                            <button
                              key={skill}
                              type="button"
                              onClick={() => toggleSkill(skill)}
                              className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                                formData.skills.includes(skill)
                                  ? "bg-[#D34079] text-white"
                                  : "bg-[#FBB9C2] text-[#4A312F] hover:bg-[#FBB9C2]/80"
                              }`}
                            >
                              {skill}
                            </button>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={customSkill}
                            onChange={e => setCustomSkill(e.target.value)}
                            placeholder="Add custom skill"
                            onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addCustomSkill())}
                            className="flex-1 px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D34079]/20 focus:border-[#D34079] focus:shadow-sm transition"
                          />
                          <button
                            type="button"
                            onClick={addCustomSkill}
                            className="px-6 py-4 bg-[#D34079] text-white rounded-xl hover:bg-[#b12f65] transition"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#4A312F] mb-1.5">Short Bio</label>
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          placeholder="Introduce yourself"
                          required
                          rows="3"
                          className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D34079]/20 focus:border-[#D34079] focus:shadow-sm transition"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Client - Company Description & Industry */}
                  {step === 4 && role === "client" && (
                    <motion.div
                      key="client4"
                      custom={direction}
                      variants={variants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.5 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-[#4A312F] mb-1.5">Company Description / Niche</label>
                        <textarea
                          name="companyDescription"
                          value={formData.companyDescription}
                          onChange={handleChange}
                          placeholder="Describe your company & niche"
                          required
                          rows="3"
                          className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D34079]/20 focus:border-[#D34079] focus:shadow-sm transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#4A312F] mb-1.5">Industry</label>
                        <select
                          name="industry"
                          value={formData.industry}
                          onChange={handleChange}
                          className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D34079]/20 focus:border-[#D34079] focus:shadow-sm transition"
                        >
                          <option value="">Select Industry</option>
                          {industries.map(ind => <option key={ind}>{ind}</option>)}
                        </select>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 5: Freelancer - Hourly Rate */}
                  {step === 5 && role === "freelancer" && (
                    <motion.div
                      key="freelancer5"
                      custom={direction}
                      variants={variants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.5 }}
                      className="space-y-4"
                    >
                      <label className="block text-sm font-medium text-[#4A312F]">
                        Hourly Rate
                        <span className="ml-1 text-sm text-gray-500 cursor-help" title="Set your expected hourly rate">ⓘ</span>
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          name="hourlyRate"
                          min="1"
                          max="1000"
                          value={formData.hourlyRate}
                          onChange={handleChange}
                          className="flex-1 accent-[#D34079]"
                        />
                        <span className="text-lg font-semibold text-[#4A312F] w-16 text-center">
                          {formData.hourlyRate}
                        </span>
                        <select
                          name="currency"
                          value={formData.currency}
                          onChange={handleChange}
                          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D34079]/20"
                        >
                          {currencies.map(cur => <option key={cur}>{cur}</option>)}
                        </select>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 5: Client - Budget, Location, Terms */}
                  {step === 5 && role === "client" && (
                    <motion.div
                      key="client5"
                      custom={direction}
                      variants={variants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.5 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-[#4A312F] mb-1.5">Budget (per project / month)</label>
                        <input
                          type="number"
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          placeholder="Budget in USD"
                          className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D34079]/20 focus:border-[#D34079] focus:shadow-sm transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#4A312F] mb-1.5">Hiring Capacity (Number of freelancers)</label>
                        <input
                          type="number"
                          name="hiringCapacity"
                          value={formData.hiringCapacity}
                          onChange={handleChange}
                          placeholder="No. of hires"
                          className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D34079]/20 focus:border-[#D34079] focus:shadow-sm transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#4A312F] mb-1.5">Country</label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D34079]/20 focus:border-[#D34079] focus:shadow-sm transition"
                        >
                          <option value="">Select Country</option>
                          {countries.map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#4A312F] mb-2">Languages</label>
                        <div className="flex flex-wrap gap-2">
                          {languages.map(lang => (
                            <button
                              key={lang}
                              type="button"
                              onClick={() => toggleLanguage(lang)}
                              className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                                formData.languages.includes(lang)
                                  ? "bg-[#D34079] text-white"
                                  : "bg-[#FBB9C2] text-[#4A312F] hover:bg-[#FBB9C2]/80"
                              }`}
                            >
                              {lang}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="terms-client"
                          checked={formData.terms}
                          onChange={e => setFormData(prev => ({ ...prev, terms: e.target.checked }))}
                          className="w-4 h-4 text-[#D34079] border-[#B7E2BF] rounded focus:ring-[#D34079]"
                        />
                        <label htmlFor="terms-client" className="text-sm text-[#4A312F]">
                          I agree to Terms & Privacy
                        </label>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 6: Freelancer - Portfolio & Video */}
                  {step === 6 && role === "freelancer" && (
                    <motion.div
                      key="freelancer6"
                      custom={direction}
                      variants={variants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.5 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-[#4A312F] mb-1.5">Portfolio Upload (Images, PDFs)</label>
                        <input
                          type="file"
                          multiple
                          accept="image/*,.pdf"
                          onChange={e => handleFileChange(e, "portfolio")}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FBB9C2] file:text-[#4A312F] hover:file:bg-[#FBB9C2]/80"
                        />
                        <div className="flex flex-wrap gap-3 mt-3">
                          {formData.portfolio.map((p, i) => (
                            <img key={i} src={p} alt="portfolio" className="w-20 h-20 object-cover rounded-lg border border-[#B7E2BF]" />
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#4A312F] mb-1.5">
                          Intro Video (Max 5 min)
                          <span className="ml-1 text-sm text-gray-500 cursor-help" title="Upload a short introduction video">ⓘ</span>
                        </label>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={e => handleFileChange(e, "video")}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FBB9C2] file:text-[#4A312F] hover:file:bg-[#FBB9C2]/80"
                        />
                        {formData.portfolioVideos.map((v, i) => (
                          <video key={i} src={v} controls className="mt-3 w-40 rounded-lg border border-[#B7E2BF]" />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 7: Freelancer - Country, Languages, Terms */}
                  {step === 7 && role === "freelancer" && (
                    <motion.div
                      key="freelancer7"
                      custom={direction}
                      variants={variants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.5 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-[#4A312F] mb-1.5">Country</label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D34079]/20 focus:border-[#D34079] focus:shadow-sm transition"
                        >
                          <option value="">Select Country</option>
                          {countries.map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#4A312F] mb-2">Languages</label>
                        <div className="flex flex-wrap gap-2">
                          {languages.map(lang => (
                            <button
                              key={lang}
                              type="button"
                              onClick={() => toggleLanguage(lang)}
                              className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                                formData.languages.includes(lang)
                                  ? "bg-[#D34079] text-white"
                                  : "bg-[#FBB9C2] text-[#4A312F] hover:bg-[#FBB9C2]/80"
                              }`}
                            >
                              {lang}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="terms-freelancer"
                          checked={formData.terms}
                          onChange={e => setFormData(prev => ({ ...prev, terms: e.target.checked }))}
                          className="w-4 h-4 text-[#D34079] border-[#B7E2BF] rounded focus:ring-[#D34079]"
                        />
                        <label htmlFor="terms-freelancer" className="text-sm text-[#4A312F]">
                          I agree to Terms & Privacy
                        </label>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation buttons */}
                {step > 1 && step <= totalSteps && (
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-3 border-2 border-[#4A312F] text-[#4A312F] font-semibold rounded-xl hover:bg-[#F7F9FB] transition"
                    >
                      Back
                    </button>
                    {step < totalSteps && (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="px-6 py-3 bg-[#D34079] text-white font-semibold rounded-xl shadow-sm hover:bg-[#b12f65] transition"
                      >
                        Continue
                      </button>
                    )}
                    {step === totalSteps && (
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-[#D34079] text-white font-semibold rounded-xl shadow-sm hover:bg-[#b12f65] transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? "Sending OTPs..." : "Create Account"}
                      </button>
                    )}
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
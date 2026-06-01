import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authAPI, setUser, setTokens, removeTokens } from "../../../services/api";
import { toast } from "sonner";
import { validateOtp } from "../../../common/utils/validation";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phoneNumber: "",
    channel: "email",
  });

  useEffect(() => {
    const state = location.state;
    if (state?.email) {
      setContactInfo((prev) => ({
        ...prev,
        email: state.email,
        phoneNumber: state.phoneNumber || "",
        channel: state.channel || "email",
      }));
    }
  }, [location]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        document.getElementById(`otp-input-${index + 1}`)?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    const otpError = validateOtp(otpValue);
    if (otpError) {
      toast.error(otpError);
      return;
    }

    setIsLoading(true);
    try {
      let response;
      if (contactInfo.channel === "email") {
        response = await authAPI.verifyEmailOTP(contactInfo.email, otpValue);
      } else {
        response = await authAPI.verifyPhoneOTP(
          contactInfo.email,
          contactInfo.phoneNumber,
          otpValue
        );
      }

      if (response.accessToken) {
        setTokens(response.accessToken, response.refreshToken);
        setUser(response.user);
      }

      toast.success("OTP verified successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Invalid OTP code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    try {
      await authAPI.resendOTP(
        contactInfo.email,
        contactInfo.phoneNumber,
        contactInfo.channel
      );
      toast.success(`OTP resent to your ${contactInfo.channel}`);
      setResendCooldown(60);
    } catch (error) {
      toast.error(error.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Your Identity
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the 6-digit code sent to your{" "}
            {contactInfo.channel === "email" ? "email" : "phone"}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-2xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-#14a800] focus:border-transparent"
              />
            ))}
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading || otp.some((d) => !d)}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#14a800] hover:bg-[#118a00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-#14a800] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </button>
          </div>
          <div className="text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0}
              className="text-sm text-[#14a800] hover:text-[#14a800] disabled:text-gray-400"
            >
              {resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : "Resend Code"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;
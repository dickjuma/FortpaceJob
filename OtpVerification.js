import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

// You can create a central axios instance for your API
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

const DEFAULT_RESEND_SECONDS = 60;

// Props:
// - email (optional)
// - phoneNumber (optional)
// - channel: "email" | "sms" (default "email")
// - purpose: "verify_email" | "verify_phone" | "login_phone" | "reset_password"
// - onSuccess: callback when verified
const OtpVerification = ({ email, phoneNumber, channel = 'email', purpose = 'verify_email', onSuccess }) => {
  const [digits, setDigits] = useState(Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const inputsRef = useRef([]);

  const otpValue = digits.join('');

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...digits];
    next[index] = value.slice(-1);
    setDigits(next);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = Array(6).fill('');
    for (let i = 0; i < pasted.length; i += 1) next[i] = pasted[i];
    setDigits(next);
    inputsRef.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otpValue.length !== 6) {
      setError('Please enter the full 6-digit code.');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      if (purpose === 'login_phone') {
        const response = await apiClient.post('/auth/login/phone', {
          phoneNumber,
          otp: otpValue,
          channel,
        });
        setMessage(response.data.message || 'Verification successful!');
        onSuccess?.(response.data);
        return;
      }

      if (purpose === 'verify_phone') {
        const response = await apiClient.post('/auth/verify-phone-otp', {
          email,
          phoneNumber,
          otp: otpValue,
          channel,
        });
        setMessage(response.data.message || 'Phone verified successfully!');
        onSuccess?.(response.data);
        return;
      }

      const response = await apiClient.post('/auth/verify-email-otp', {
        email,
        otp: otpValue,
        channel,
      });
      setMessage(response.data.message || 'Email verified successfully!');
      onSuccess?.(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Verification failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setIsLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await apiClient.post('/auth/resend-otp', {
        email,
        phoneNumber,
        channel,
        purpose,
      });
      setMessage(response.data.message || 'A new OTP has been sent.');
      setResendTimer(DEFAULT_RESEND_SECONDS);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Could not resend OTP. Please try again later.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Verify your {channel === 'sms' ? 'phone' : 'email'}</h2>
      <p>
        We sent a verification code to{' '}
        <strong>{channel === 'sms' ? phoneNumber : email}</strong>. Please enter it below.
      </p>

      <form onSubmit={handleVerifyOtp}>
        <div>
          <label htmlFor="otp">Verification Code</label>
          <div onPaste={handlePaste} style={{ display: 'flex', gap: 8 }}>
            {digits.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isLoading}
                ref={(el) => (inputsRef.current[index] = el)}
                style={{ width: 40, height: 48, textAlign: 'center', fontSize: 18 }}
              />
            ))}
          </div>
        </div>
        <button type="submit" disabled={isLoading || otpValue.length !== 6}>
          {isLoading ? 'Verifying...' : 'Verify Code'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      <p>
        Didn't receive the code?{' '}
        <button onClick={handleResendOtp} disabled={isLoading || resendTimer > 0}>
          {resendTimer > 0 ? `Resend in ${resendTimer}s` : isLoading ? 'Sending...' : 'Resend OTP'}
        </button>
      </p>
    </div>
  );
};

export default OtpVerification;

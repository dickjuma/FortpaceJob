// src/pages/freelancer/PaymentSetupPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone, ShieldCheck, Check, Key, Loader2, Sparkles, AlertCircle, RefreshCcw, CreditCard, HelpCircle, X
} from 'lucide-react';

// Keep original API structure - preserve for actual implementation
// import { walletAPI } from '../../common/services/api';

export default function PaymentSetupPage() {
  const [mpesaStatus, setMpesaStatus] = useState('Not setup');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [payoutSchedule, setPayoutSchedule] = useState('Immediate');
  const [showSuccess, setShowSuccess] = useState(null);

  const handleSendOTP = (e) => {
    e.preventDefault();
    if (!phone.startsWith('07') && !phone.startsWith('01') && !phone.startsWith('+254')) {
      setShowSuccess({ message: 'Enter a valid Safaricom phone number', isError: true });
      setTimeout(() => setShowSuccess(null), 2000);
      return;
    }
    if (!fullName || !nationalId) {
      setShowSuccess({ message: 'Please complete all required fields', isError: true });
      setTimeout(() => setShowSuccess(null), 2000);
      return;
    }

    setOtpSent(true);
    setShowSuccess({ message: 'OTP sent to your phone' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp !== '4832') {
      setShowSuccess({ message: 'Invalid OTP code. Use "4832" for testing.', isError: true });
      setTimeout(() => setShowSuccess(null), 2000);
      return;
    }
    if (pin.length !== 4) {
      setShowSuccess({ message: 'PIN must be 4 digits', isError: true });
      setTimeout(() => setShowSuccess(null), 2000);
      return;
    }

    setMpesaStatus('Active');
    setShowSuccess({ message: 'M-Pesa connected and verified!' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const handleDisconnect = () => {
    setMpesaStatus('Not setup');
    setPhone('');
    setFullName('');
    setNationalId('');
    setOtp('');
    setPin('');
    setOtpSent(false);
    setShowSuccess({ message: 'Payment method disconnected' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const payoutOptions = ['Immediate', 'Weekly Sunday', 'Monthly First'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Success/Error Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-md font-body text-sm flex items-center gap-2 ${
              showSuccess.isError ? 'bg-danger text-white' : 'bg-accent-dark text-white'
            }`}
          >
            <Check className="w-4 h-4" />
            {showSuccess.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border pb-6 mb-8">
        <div className="p-2.5 bg-accent-light rounded-xl">
          <CreditCard className="w-6 h-6 text-accent DEFAULT" />
        </div>
        <div>
          <h1 className="font-display font-bold text-3xl text-brand-900">Payment setup</h1>
          <p className="text-ink-secondary font-body">Configure secure withdrawal methods and payment preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main Form */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-body font-semibold text-base text-ink-primary flex items-center gap-2 pb-3 border-b border-border mb-5">
              <Phone className="w-5 h-5 text-accent DEFAULT" /> Connect M-Pesa
            </h3>

            {mpesaStatus === 'Active' ? (
              <div className="p-4 bg-accent-light border border-accent DEFAULT rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-accent-dark">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-xs font-body font-semibold">M-Pesa verified active</span>
                </div>
                <div className="text-sm font-body text-ink-secondary space-y-1">
                  <div>Owner: <strong className="text-ink-primary">{fullName}</strong></div>
                  <div>Phone: <strong className="text-ink-primary">{phone}</strong></div>
                  <div>Payout: <strong className="text-ink-primary">{payoutSchedule}</strong></div>
                </div>
                <div className="pt-2">
                  <button
                    onClick={handleDisconnect}
                    className="px-4 py-1.5 rounded-lg border border-danger text-danger hover:bg-danger-light font-body text-sm transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={otpSent ? handleVerifyOTP : handleSendOTP} className="space-y-4">
                <div>
                  <label className="block text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1.5">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    placeholder="0712345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={otpSent}
                    className="w-full h-11 px-4 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1.5">
                    Full name (as per ID)
                  </label>
                  <input
                    type="text"
                    placeholder="Alex Morgan"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={otpSent}
                    className="w-full h-11 px-4 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1.5">
                    National ID
                  </label>
                  <input
                    type="text"
                    placeholder="33445566"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    disabled={otpSent}
                    className="w-full h-11 px-4 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900 disabled:opacity-50"
                  />
                </div>

                {otpSent ? (
                  <div className="space-y-4 pt-2 border-t border-border">
                    <div>
                      <label className="block text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1.5">
                        OTP code (4832)
                      </label>
                      <input
                        type="text"
                        placeholder="6-digit code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full h-11 px-4 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1.5">
                        Withdrawal PIN (4 digits)
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="****"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        className="w-full h-11 px-4 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-sm transition-colors"
                    >
                      Verify & connect
                    </button>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-sm transition-colors"
                  >
                    Send OTP
                  </button>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-5">

          {/* Payout Settings */}
          <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
            <h4 className="font-body font-semibold text-sm text-ink-primary flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-accent DEFAULT" /> Payout settings
            </h4>
            <p className="text-xs text-ink-tertiary mb-4">
              Configure how often you receive payments
            </p>
            <div className="space-y-2">
              {payoutOptions.map(option => (
                <label key={option} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="schedule"
                    checked={payoutSchedule === option}
                    onChange={() => setPayoutSchedule(option)}
                    className="w-3.5 h-3.5 text-accent DEFAULT focus:ring-accent DEFAULT"
                  />
                  <span className="text-sm font-body text-ink-primary">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Security Info */}
          <div className="bg-warn-light border border-warn DEFAULT rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-warn" />
              <h4 className="font-body font-semibold text-sm text-warn">Security notice</h4>
            </div>
            <p className="text-xs text-warn leading-relaxed">
              Your M-Pesa account name must match your verified ID for compliance.
            </p>
          </div>

          {/* Help Card */}
          <div className="bg-accent-light border border-accent DEFAULT rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="w-4 h-4 text-accent-dark" />
              <h4 className="font-body font-semibold text-sm text-accent-dark">Need help?</h4>
            </div>
            <p className="text-xs text-accent-dark">
              Contact support if you're having trouble connecting your payment method.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

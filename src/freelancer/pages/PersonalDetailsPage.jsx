// src/pages/freelancer/PersonalDetailsPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Briefcase, Globe, Home, CheckCircle2, Save, MapPin, CreditCard, Smartphone, Building2, Check
} from 'lucide-react';

export default function PersonalDetailsPage() {
  const [workModality, setWorkModality] = useState('ONLINE');
  const [formData, setFormData] = useState({
    name: '',
    titleOrCrn: '',
    baseCity: '',
    travelRadius: '',
    preferredPaymentMethod: 'mpesa',
    phoneNumber: '',
    bankName: 'KCB',
    bankAccount: ''
  });
  const [isSaved, setIsSaved] = useState(false);
  const [showSuccess, setShowSuccess] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setIsSaved(false);
  };

  const handleSave = () => {
    setIsSaved(true);
    setShowSuccess({ message: 'Details saved successfully' });
    setTimeout(() => {
      setIsSaved(false);
      setShowSuccess(null);
    }, 2000);
  };

  const handleClear = () => {
    setFormData({
      name: '',
      titleOrCrn: '',
      baseCity: '',
      travelRadius: '',
      preferredPaymentMethod: 'mpesa',
      phoneNumber: '',
      bankName: 'KCB',
      bankAccount: ''
    });
    setShowSuccess({ message: 'Form cleared' });
    setTimeout(() => setShowSuccess(null), 1500);
  };

  const paymentMethods = [
    { id: 'mpesa', name: 'M-Pesa', icon: Smartphone, color: 'text-accent DEFAULT' },
    { id: 'airtel', name: 'Airtel Money', icon: Smartphone, color: 'text-danger' },
    { id: 'bank', name: 'Bank Account', icon: Building2, color: 'text-info' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 bg-accent-dark text-white px-4 py-3 rounded-lg shadow-md font-body text-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            {showSuccess.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-accent-light rounded-xl">
            <User className="w-6 h-6 text-accent DEFAULT" />
          </div>
          <h1 className="font-display font-bold text-3xl text-brand-900">Service configuration</h1>
        </div>
        <p className="text-ink-secondary font-body">Tell us how you prefer to work so we can match you with the right clients</p>
      </div>

      <div className="space-y-6">

        {/* Business Information */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="font-display font-semibold text-lg text-brand-900 mb-5">Business information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide">
                Display name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full h-11 px-4 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                placeholder="e.g., Jane Doe or Acme Solutions"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide">
                Professional headline
              </label>
              <input
                type="text"
                name="titleOrCrn"
                value={formData.titleOrCrn}
                onChange={handleInputChange}
                className="w-full h-11 px-4 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                placeholder="e.g., Senior Frontend Developer"
              />
            </div>
          </div>
        </div>

        {/* Work Modality */}
        <div>
          <h2 className="font-display font-semibold text-lg text-brand-900 mb-4">Work modality & location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div
              onClick={() => setWorkModality('ONLINE')}
              className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                workModality === 'ONLINE'
                  ? "border-accent DEFAULT bg-accent-light"
                  : "border-border bg-white hover:border-border-strong"
              }`}
            >
              <div className={`p-2 rounded-lg shrink-0 ${workModality === 'ONLINE' ? "bg-accent DEFAULT text-white" : "bg-surface-muted text-ink-tertiary"}`}>
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-body font-semibold text-ink-primary">Online / Remote services</h3>
                <p className="text-sm text-ink-secondary mt-1">Digital work such as software development, design, writing</p>
              </div>
            </div>

            <div
              onClick={() => setWorkModality('OFFLINE')}
              className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                workModality === 'OFFLINE'
                  ? "border-danger bg-danger-light"
                  : "border-border bg-white hover:border-border-strong"
              }`}
            >
              <div className={`p-2 rounded-lg shrink-0 ${workModality === 'OFFLINE' ? "bg-danger text-white" : "bg-surface-muted text-ink-tertiary"}`}>
                <Home className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-body font-semibold text-ink-primary">Physical / On-site services</h3>
                <p className="text-sm text-ink-secondary mt-1">In-person tasks such as plumbing, electrical, cleaning</p>
              </div>
            </div>
          </div>

          {/* Offline Location Settings */}
          {workModality === 'OFFLINE' && (
            <div className="bg-danger-light border-l-4 border-danger rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-danger" />
                <h3 className="font-body font-semibold text-danger">Service area settings</h3>
              </div>
              <p className="text-sm text-danger/80 mb-4">
                Since you offer physical services, please define your operating region.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-body font-medium text-danger uppercase tracking-wide">Base city/region</label>
                  <input
                    type="text"
                    name="baseCity"
                    value={formData.baseCity}
                    onChange={handleInputChange}
                    className="w-full h-11 px-4 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                    placeholder="e.g., Nairobi, Kenya"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-body font-medium text-danger uppercase tracking-wide">Max travel radius (km)</label>
                  <input
                    type="number"
                    name="travelRadius"
                    value={formData.travelRadius}
                    onChange={handleInputChange}
                    className="w-full h-11 px-4 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                    placeholder="e.g., 50"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Payment & Withdrawal */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="font-display font-semibold text-lg text-brand-900 mb-4">Payment & withdrawal settings</h2>
          <p className="text-sm text-ink-secondary mb-5">Select your preferred withdrawal method and link your account details</p>

          <div className="space-y-5">
            <div>
              <label className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-2 block">
                Preferred withdrawal method
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {paymentMethods.map(method => {
                  const Icon = method.icon;
                  const isSelected = formData.preferredPaymentMethod === method.id;
                  return (
                    <div
                      key={method.id}
                      onClick={() => setFormData({...formData, preferredPaymentMethod: method.id})}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-2 ${
                        isSelected
                          ? `border-accent DEFAULT bg-accent-light`
                          : "border-border hover:border-border-strong"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? method.color : "text-ink-tertiary"}`} />
                      <span className={`font-body font-medium text-sm ${isSelected ? "text-accent DEFAULT" : "text-ink-primary"}`}>
                        {method.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              {(formData.preferredPaymentMethod === 'mpesa' || formData.preferredPaymentMethod === 'airtel') ? (
                <div className="space-y-1.5 max-w-md">
                  <label className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-accent DEFAULT" />
                    {formData.preferredPaymentMethod === 'mpesa' ? 'M-Pesa' : 'Airtel'} phone number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full h-11 px-4 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                    placeholder="e.g., +254 712 345 678"
                  />
                  <p className="text-xs text-ink-tertiary">Ensure the number is registered in your name</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-info" /> Bank
                    </label>
                    <select
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      className="w-full h-11 px-4 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                    >
                      <option value="KCB">KCB Bank</option>
                      <option value="Equity">Equity Bank</option>
                      <option value="Coop">Co-operative Bank</option>
                      <option value="Absa">Absa Bank Kenya</option>
                      <option value="NCBA">NCBA Bank</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5 text-info" /> Account number
                    </label>
                    <input
                      type="text"
                      name="bankAccount"
                      value={formData.bankAccount}
                      onChange={handleInputChange}
                      className="w-full h-11 px-4 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                      placeholder="Enter account number"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end items-center gap-4 pt-4 border-t border-border">
          {isSaved && (
            <span className="text-sm font-body font-medium text-accent DEFAULT flex items-center gap-1.5 mr-auto">
              <CheckCircle2 className="w-4 h-4" /> Details saved
            </span>
          )}
          <button
            onClick={handleClear}
            className="px-5 py-2 rounded-lg border border-border text-ink-primary hover:bg-surface-muted font-body font-medium text-sm transition-colors"
          >
            Clear
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-sm transition-colors inline-flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save details
          </button>
        </div>
      </div>
    </motion.div>
  );
}

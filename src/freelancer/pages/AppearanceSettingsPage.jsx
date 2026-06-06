// src/pages/settings/AppearanceSettingsPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Sun, Moon, Laptop, Layout, Check, Palette, Sparkles } from 'lucide-react';

export default function AppearanceSettingsPage() {
  const [theme, setTheme] = useState('system'); // 'light' | 'dark' | 'system'
  const [sidebarLayout, setSidebarLayout] = useState('expanded'); // 'expanded' | 'collapsed'
  const [accentColor, setAccentColor] = useState('green'); // 'green' | 'blue' | 'amber' | 'rose'
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const handleSelectTheme = (mode) => {
    setTheme(mode);
  };

  const handleSelectAccent = (color) => {
    setAccentColor(color);
  };

  const handleSave = () => {
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const accentColors = [
    { key: 'green', label: 'Green', class: 'bg-accent DEFAULT', activeClass: 'ring-accent DEFAULT' },
    { key: 'blue', label: 'Blue', class: 'bg-info DEFAULT', activeClass: 'ring-info DEFAULT' },
    { key: 'amber', label: 'Amber', class: 'bg-warn DEFAULT', activeClass: 'ring-warn DEFAULT' },
    { key: 'rose', label: 'Rose', class: 'bg-danger DEFAULT', activeClass: 'ring-danger DEFAULT' }
  ];

  const Button = ({ children, variant = 'primary', icon, onClick, disabled = false, className = '' }) => {
    const baseStyles = "px-5 py-2.5 rounded-lg font-body font-medium text-sm inline-flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
    const variants = {
      primary: "bg-brand-900 text-white hover:bg-brand-800 focus:ring-brand-900",
      ghost: "border border-brand-900 text-brand-900 hover:bg-surface-muted focus:ring-brand-900",
      danger: "bg-danger text-white hover:bg-red-700 focus:ring-danger"
    };

    return (
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        disabled={disabled}
        className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${className}`}
      >
        {icon && <span className="w-4 h-4 flex items-center justify-center">{icon}</span>}
        {children}
      </motion.button>
    );
  };

  const Badge = ({ children, variant = 'default' }) => {
    const variants = {
      default: "bg-surface-muted text-ink-secondary",
      success: "bg-accent-light text-accent-dark",
      warning: "bg-warn-light text-warn",
      danger: "bg-danger-light text-danger",
      info: "bg-info-light text-info"
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
        {children}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Success Toast */}
      <AnimatePresence>
        {showSaveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 bg-accent-dark text-white px-4 py-3 rounded-lg shadow-md font-body text-sm"
          >
            Appearance settings saved
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-4xl text-brand-900 flex items-center gap-3">
            <Palette className="w-8 h-8 text-accent DEFAULT" />
            Appearance
          </h1>
          <p className="text-ink-secondary font-body mt-1 text-base">
            Customize your workspace look and feel
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Check size={18} />}
          onClick={handleSave}
        >
          Save changes
        </Button>
      </div>

      <div className="space-y-6">

        {/* Theme configuration */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border">
            <Sun className="w-5 h-5 text-accent DEFAULT" />
            <h3 className="font-display font-semibold text-lg text-brand-900">Theme preference</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { key: 'light', label: 'Light', icon: Sun, description: 'Clean bright interface for daytime work' },
              { key: 'dark', label: 'Dark', icon: Moon, description: 'Reduced eye strain in low-light environments' },
              { key: 'system', label: 'System', icon: Laptop, description: 'Matches your operating system preference' }
            ].map(opt => (
              <motion.div
                key={opt.key}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleSelectTheme(opt.key)}
                className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                  theme === opt.key
                    ? "border-accent DEFAULT bg-accent-light"
                    : "border-border bg-white hover:border-border-strong"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-2 rounded-lg border ${theme === opt.key ? 'border-accent DEFAULT bg-white' : 'border-border bg-surface-muted'}`}>
                    <opt.icon className={`w-5 h-5 ${theme === opt.key ? 'text-accent DEFAULT' : 'text-ink-secondary'}`} />
                  </div>
                  {theme === opt.key && <Check className="w-5 h-5 text-accent DEFAULT" />}
                </div>
                <h4 className="font-body font-semibold text-ink-primary mb-1">{opt.label}</h4>
                <p className="text-ink-tertiary text-xs font-body leading-relaxed">{opt.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Accent Color Selector */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border">
            <Sparkles className="w-5 h-5 text-accent DEFAULT" />
            <h3 className="font-display font-semibold text-lg text-brand-900">Accent color</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {accentColors.map(color => (
              <motion.div
                key={color.key}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleSelectAccent(color.key)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  accentColor === color.key
                    ? "border-accent DEFAULT bg-accent-light ring-2 ring-accent-light"
                    : "border-border bg-white hover:border-border-strong"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full ${color.class} shadow-sm`}></div>
                  <span className="font-body font-medium text-sm text-ink-primary flex-1">{color.label}</span>
                  {accentColor === color.key && <Check className="w-4 h-4 text-accent DEFAULT" />}
                </div>
              </motion.div>
            ))}
          </div>

          <p className="mt-4 text-ink-tertiary text-xs font-body">
            Accent colors appear on buttons, links, and active states
          </p>
        </div>

        {/* Sidebar layouts */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border">
            <Layout className="w-5 h-5 text-accent DEFAULT" />
            <h3 className="font-display font-semibold text-lg text-brand-900">Sidebar layout</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { key: 'expanded', label: 'Expanded', description: 'Full labels next to navigation icons' },
              { key: 'collapsed', label: 'Collapsed', description: 'Icon-only sidebar saves screen space' }
            ].map(opt => (
              <motion.div
                key={opt.key}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSidebarLayout(opt.key)}
                className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                  sidebarLayout === opt.key
                    ? "border-accent DEFAULT bg-accent-light"
                    : "border-border bg-white hover:border-border-strong"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-body font-semibold text-ink-primary">{opt.label}</h4>
                  {sidebarLayout === opt.key && <Check className="w-5 h-5 text-accent DEFAULT" />}
                </div>
                <p className="text-ink-tertiary text-xs font-body leading-relaxed">{opt.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Preview Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="bg-surface-soft rounded-2xl p-6 border border-border"
        >
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-ink-secondary" />
            <h3 className="font-body font-semibold text-ink-primary">Preview</h3>
            <Badge variant="info">Live preview</Badge>
          </div>

          <div className="bg-white rounded-xl p-4 border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-surface-muted flex items-center justify-center">
                <span className="text-ink-secondary font-body text-sm">JD</span>
              </div>
              <div>
                <div className="font-body font-medium text-ink-primary text-sm">Your profile</div>
                <div className="text-ink-tertiary text-xs">settings appear here</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="success">Active</Badge>
              <Badge variant="default">Member since 2024</Badge>
            </div>
          </div>

          <p className="mt-4 text-ink-tertiary text-xs font-body text-center">
            Changes apply immediately to your dashboard experience
          </p>
        </motion.div>

      </div>
    </motion.div>
  );
}

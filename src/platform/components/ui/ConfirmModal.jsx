import React from 'react';
import { AlertCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const VARIANTS = {
  danger:  { button: 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30', icon: XCircle, iconColor: 'text-red-400 bg-red-400/10' },
  success: { button: 'bg-success/10 hover:bg-success/20 text-success border-success/30', icon: CheckCircle, iconColor: 'text-success bg-success/10' },
  warning: { button: 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: AlertCircle, iconColor: 'text-yellow-400 bg-yellow-400/10' },
  default: { button: 'bg-success/10 hover:bg-success/20 text-success border-success/30', icon: AlertCircle, iconColor: 'text-success bg-success/10' },
};

/**
 * ConfirmModal — a reusable confirmation dialog.
 *
 * Props:
 *   isOpen         {bool}    Controls visibility
 *   title          {string}  Dialog title
 *   message        {string}  Body text / description
 *   confirmLabel   {string}  Text for the confirm button (default: "Confirm")
 *   cancelLabel    {string}  Text for the cancel button (default: "Cancel")
 *   confirmVariant {string}  "danger" | "success" | "warning" | "default"
 *   isLoading      {bool}    Shows spinner on confirm button
 *   onConfirm      {fn}      Called when user clicks confirm
 *   onClose        {fn}      Called when user clicks cancel or backdrop
 */
export default function ConfirmModal({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'default',
  isLoading = false,
  onConfirm,
  onClose,
}) {
  if (!isOpen) return null;

  const variant = VARIANTS[confirmVariant] || VARIANTS.default;
  const Icon = variant.icon;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5 animate-fadeIn">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${variant.iconColor}`}>
          <Icon className="w-6 h-6" />
        </div>

        {/* Text */}
        <div>
          <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">{message}</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-bold transition-colors disabled:opacity-50 ${variant.button}`}
          >
            {isLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

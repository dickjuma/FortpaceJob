import React, { useState, useEffect, useRef } from "react";
import { X, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

// ─── Confirmation / Reason Modal ──────────────────────────────────────────────
export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, requireReason, reasonLabel, variant = "default", isPending }) {
  const [reason, setReason] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setReason("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (requireReason && !reason.trim()) return;
    onConfirm(reason.trim() || undefined);
  };

  const borderColor =
    variant === "danger" ? "border-red-500/30" :
    variant === "warning" ? "border-amber-500/30" :
    "border-emerald-500/30";

  const btnClass =
    variant === "danger" ? "bg-red-600 hover:bg-red-700 text-white" :
    variant === "warning" ? "bg-amber-500 hover:bg-amber-600 text-white" :
    "bg-emerald-600 hover:bg-emerald-700 text-white";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => !isPending && onClose()}
      />

      {/* Modal */}
      <div
        className={`relative z-10 w-full max-w-md rounded-[28px] border bg-zinc-950 shadow-2xl ${borderColor}`}
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
              variant === "danger" ? "bg-red-500/15 text-red-400" :
              variant === "warning" ? "bg-amber-500/15 text-amber-400" :
              "bg-emerald-500/15 text-emerald-400"
            }`}>
              <AlertTriangle size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-black text-white leading-tight">{title}</h2>
              {message && <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed">{message}</p>}
            </div>
            <button
              onClick={() => !isPending && onClose()}
              disabled={isPending}
              className="p-1.5 rounded-xl text-zinc-500 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40"
            >
              <X size={18} />
            </button>
          </div>

          {requireReason && (
            <div className="mb-5">
              <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">
                {reasonLabel || "Reason for this action"} <span className="text-red-400">*</span>
              </label>
              <textarea
                ref={inputRef}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={isPending}
                rows={3}
                placeholder="Enter a detailed reason..."
                className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-200 outline-none resize-none placeholder-zinc-600 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all disabled:opacity-50"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.metaKey) handleConfirm();
                }}
              />
              {requireReason && reason.trim() === "" && (
                <p className="mt-1.5 text-xs text-red-400">A reason is required to proceed.</p>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => !isPending && onClose()}
              disabled={isPending}
              className="flex-1 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm font-bold text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isPending || (requireReason && !reason.trim())}
              className={`flex-1 rounded-2xl px-4 py-3 text-sm font-black flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${btnClass}`}
            >
              {isPending ? (
                <><Loader2 size={16} className="animate-spin" /> Processing…</>
              ) : (
                "Confirm"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Success Confirmation Overlay ─────────────────────────────────────────────
export function SuccessOverlay({ isOpen, message, onClose }) {
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(onClose, 2800);
      return () => clearTimeout(t);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none">
      <div className="pointer-events-auto animate-in zoom-in-95 fade-in duration-300 w-full max-w-sm rounded-[28px] border border-emerald-500/30 bg-zinc-950 p-8 shadow-2xl text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
          <CheckCircle2 size={36} />
        </div>
        <h3 className="text-xl font-black text-white mb-2">Action Completed</h3>
        <p className="text-sm text-zinc-400 leading-relaxed">{message || "Your admin action was applied successfully."}</p>
        <div className="mt-5 h-1 rounded-full bg-zinc-800 overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full animate-[shrink_2.8s_linear_forwards]" style={{ width: "100%" }} />
        </div>
      </div>
    </div>
  );
}

// ─── Primary Action Modal (multi-field form) ──────────────────────────────────
export function PrimaryActionModal({ isOpen, onClose, onSubmit, action, isPending }) {
  const [values, setValues] = useState({});

  useEffect(() => {
    if (isOpen) setValues({});
  }, [isOpen]);

  if (!isOpen || !action) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate required fields
    for (const field of action.fields || []) {
      if (field.required && !values[field.name]?.trim()) return;
    }
    onSubmit(values);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !isPending && onClose()} />
      <div className="relative z-10 w-full max-w-md rounded-[28px] border border-emerald-500/20 bg-zinc-950 shadow-2xl">
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white">{action.label}</h2>
            <button type="button" onClick={() => !isPending && onClose()} disabled={isPending} className="p-1.5 rounded-xl text-zinc-500 hover:text-white hover:bg-white/10 transition-colors">
              <X size={18} />
            </button>
          </div>

          {(action.fields || []).map((field) => (
            <div key={field.name}>
              <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">
                {field.label} {field.required && <span className="text-red-400">*</span>}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  value={values[field.name] || ""}
                  onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                  rows={3}
                  placeholder={field.placeholder || field.prompt}
                  required={field.required}
                  className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-200 outline-none resize-none placeholder-zinc-600 focus:border-zinc-500 transition-all"
                />
              ) : (
                <input
                  type={field.type || "text"}
                  value={values[field.name] || ""}
                  onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                  placeholder={field.placeholder || field.prompt}
                  required={field.required}
                  className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-200 outline-none placeholder-zinc-600 focus:border-zinc-500 transition-all"
                />
              )}
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => !isPending && onClose()} disabled={isPending} className="flex-1 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm font-bold text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={isPending} className="flex-1 rounded-2xl bg-emerald-600 hover:bg-emerald-700 px-4 py-3 text-sm font-black text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {isPending ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { createContext, useContext, useCallback, useReducer, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X } from 'lucide-react';
import StatusLottie from '../../components/feedback/StatusLottie';
import { registerNotifyBridge } from '../utils/notify';

// ─── Types & Constants ────────────────────────────────────────────────────────

const MAX_TOASTS = 3;

const TOAST_CONFIG = {
  success: {
    lottie: 'success',
    duration: 3000,
    baseClass: 'border-emerald-500/30 bg-emerald-500/10',
    iconClass: 'text-emerald-400',
    titleClass: 'text-emerald-300',
    barClass: 'bg-emerald-500',
    lightBase: 'border-emerald-200 bg-emerald-50',
    lightIcon: 'text-emerald-600',
    lightTitle: 'text-emerald-700',
    lightBar: 'bg-emerald-500',
  },
  error: {
    lottie: 'error',
    duration: 5000,
    baseClass: 'border-red-500/30 bg-red-500/10',
    iconClass: 'text-red-400',
    titleClass: 'text-red-300',
    barClass: 'bg-red-500',
    lightBase: 'border-red-200 bg-red-50',
    lightIcon: 'text-red-600',
    lightTitle: 'text-red-700',
    lightBar: 'bg-red-500',
  },
  info: {
    icon: Info,
    lottie: null,
    duration: 3000,
    baseClass: 'border-[#2bb75c]/30 bg-[#2bb75c]/10',
    iconClass: 'text-[#2bb75c]',
    titleClass: 'text-[#7bc67e]',
    barClass: 'bg-[#2bb75c]',
    lightBase: 'border-[#2bb75c]/30 bg-[#2bb75c]/5',
    lightIcon: 'text-[#2bb75c]',
    lightTitle: 'text-[#2bb75c]',
    lightBar: 'bg-[#2bb75c]',
  },
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

const initialState = { toasts: [] };

function toastReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const next = [action.payload, ...state.toasts].slice(0, MAX_TOASTS);
      return { toasts: next };
    }
    case 'UPSERT': {
      const idx = state.toasts.findIndex((t) => t.id === action.payload.id);
      if (idx >= 0) {
        const toasts = [...state.toasts];
        toasts[idx] = action.payload;
        return { toasts };
      }
      return { toasts: [action.payload, ...state.toasts].slice(0, MAX_TOASTS) };
    }
    case 'REMOVE':
      return { toasts: state.toasts.filter((t) => t.id !== action.id) };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext(null);

// ─── Individual Toast ─────────────────────────────────────────────────────────

function ToastItem({ toast, onRemove }) {
  const config = TOAST_CONFIG[toast.type] || TOAST_CONFIG.info;
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`relative flex items-start gap-3 w-full max-w-sm rounded-2xl border px-4 py-3.5 shadow-xl shadow-black/20 backdrop-blur-xl overflow-hidden
        dark:${config.baseClass} dark:text-zinc-100
        ${config.lightBase} text-zinc-800`}
      role="alert"
    >
      {/* Progress bar */}
      <motion.div
        className={`absolute bottom-0 left-0 h-0.5 ${config.barClass}`}
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: config.duration / 1000, ease: 'linear' }}
      />

      <div className="flex-shrink-0 mt-0.5">
        {config.lottie ? (
          <StatusLottie variant={config.lottie} size={36} />
        ) : Icon ? (
          <Icon className={`w-5 h-5 dark:${config.iconClass} ${config.lightIcon}`} />
        ) : null}
      </div>

      {/* Message */}
      <p className="flex-1 text-sm font-semibold leading-snug pr-1">
        {toast.message}
      </p>

      {/* Close */}
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 -mr-1 mt-0.5 p-1 rounded-lg opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }) {
  const [state, dispatch] = useReducer(toastReducer, initialState);
  const timerRefs = useRef({});

  const removeToast = useCallback((id) => {
    clearTimeout(timerRefs.current[id]);
    delete timerRefs.current[id];
    dispatch({ type: 'REMOVE', id });
  }, []);

  const scheduleDismiss = useCallback(
    (id, type) => {
      clearTimeout(timerRefs.current[id]);
      if (type === 'info' && String(id).includes('loading')) return;
      const duration = TOAST_CONFIG[type]?.duration ?? 3000;
      timerRefs.current[id] = setTimeout(() => removeToast(id), duration);
    },
    [removeToast]
  );

  const upsertToast = useCallback(
    (type, message, opts = {}) => {
      const id = opts.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      dispatch({ type: 'UPSERT', payload: { id, type, message } });
      scheduleDismiss(id, type);
      return id;
    },
    [scheduleDismiss]
  );

  const toastApi = useMemo(() => {
    const api = {
      success: (msg, opts) => upsertToast('success', msg, opts),
      error: (msg, opts) => upsertToast('error', msg, opts),
      info: (msg, opts) => upsertToast('info', msg, opts),
      loading: (msg, opts) =>
        upsertToast('info', msg, { ...opts, id: opts?.id || `${Date.now()}-loading` }),
      dismiss: (id) => removeToast(id),
      promise: async (promise, messages = {}) => {
        const loadingId = api.loading(messages.loading || 'Processing…');
        try {
          const result = await promise;
          upsertToast('success', messages.success || 'Done', { id: loadingId });
          return result;
        } catch (e) {
          upsertToast('error', messages.error || e?.message || 'Something went wrong', { id: loadingId });
          throw e;
        }
      },
    };
    return api;
  }, [upsertToast, removeToast]);

  useEffect(() => {
    registerNotifyBridge(toastApi);
  }, [toastApi]);

  return (
    <ToastContext.Provider value={{ toast: toastApi }}>
      {children}

      {/* Toast portal — top-right */}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
        style={{ maxWidth: '24rem', width: 'calc(100vw - 2rem)' }}
      >
        <AnimatePresence initial={false} mode="sync">
          {state.toasts.map((t) => (
            <div key={t.id} className="pointer-events-auto">
              <ToastItem toast={t} onRemove={removeToast} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used inside <ToastProvider>');
  }
  return ctx;
}


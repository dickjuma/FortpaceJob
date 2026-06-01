import React, { createContext, useCallback, useContext, useState } from 'react';
import ConfirmModal from '../../components/ui/ConfirmModal';

const ConfirmContext = createContext(null);

const DEFAULTS = {
  title: 'Confirm action',
  message: 'Are you sure you want to continue?',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  confirmVariant: 'default',
  critical: false,
};

export function ConfirmProvider({ children }) {
  const [state, setState] = useState({ open: false, isLoading: false, ...DEFAULTS });
  const resolverRef = React.useRef(null);

  const close = useCallback(() => {
    setState((s) => ({ ...s, open: false, isLoading: false }));
    resolverRef.current?.(false);
    resolverRef.current = null;
  }, []);

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setState({
        open: true,
        isLoading: false,
        ...DEFAULTS,
        ...options,
        confirmVariant: options.critical ? 'danger' : options.confirmVariant || 'default',
      });
    });
  }, []);

  const handleConfirm = useCallback(async () => {
    const onConfirm = state.onConfirm;
    if (typeof onConfirm === 'function') {
      setState((s) => ({ ...s, isLoading: true }));
      try {
        await onConfirm();
        setState((s) => ({ ...s, open: false, isLoading: false }));
        resolverRef.current?.(true);
        resolverRef.current = null;
      } catch {
        setState((s) => ({ ...s, isLoading: false }));
        resolverRef.current?.(false);
      }
      return;
    }
    setState((s) => ({ ...s, open: false }));
    resolverRef.current?.(true);
    resolverRef.current = null;
  }, [state.onConfirm]);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <ConfirmModal
        isOpen={state.open}
        title={state.title}
        message={state.message}
        confirmLabel={state.confirmLabel}
        cancelLabel={state.cancelLabel}
        confirmVariant={state.confirmVariant}
        isLoading={state.isLoading}
        onConfirm={handleConfirm}
        onClose={close}
      />
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider');
  return ctx;
}

/**
 * Drop-in replacement for react-hot-toast — routes to ToastProvider (Lottie success/error).
 * Enabled via jsconfig paths alias; remove page-level <Toaster /> components.
 */
import notify from './notify';

/** @deprecated No-op — global toasts render from ToastProvider */
export function Toaster() {
  return null;
}

function toast(message, opts = {}) {
  const text = typeof message === 'string' ? message : String(message ?? '');
  if (opts?.type === 'error') return notify.error(text, opts);
  if (opts?.type === 'success') return notify.success(text, opts);
  return notify.info(text, opts);
}

toast.success = (message, opts) => notify.success(message, opts);
toast.error = (message, opts) => notify.error(message, opts);
toast.loading = (message, opts) => notify.loading(message, opts);
toast.info = (message, opts) => notify.info(message, opts);
toast.dismiss = (id) => notify.dismiss(id);
toast.promise = (promise, messages) => notify.promise(promise, messages);

export default toast;

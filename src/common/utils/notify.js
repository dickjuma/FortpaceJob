/**
 * App-wide notifications. Requires ToastProvider + registerNotifyBridge in index.
 * Prefer this over scattered react-hot-toast imports for consistent Lottie feedback.
 */

let bridge = {
  success: () => {},
  error: () => {},
  info: () => {},
  loading: () => {},
  dismiss: () => {},
  promise: async (p) => p,
};

export function registerNotifyBridge(toastApi) {
  bridge = { ...bridge, ...toastApi };
}

export const notify = {
  success: (message, opts) => bridge.success(message, opts),
  error: (message, opts) => bridge.error(message, opts),
  info: (message, opts) => bridge.info(message, opts),
  loading: (message) => bridge.loading(message),
  dismiss: (id) => bridge.dismiss(id),
  promise: (promise, messages) => bridge.promise(promise, messages),
};

export default notify;

import { API_BASE_URL, getToken } from './api';

const base = '/master_wallet';

async function mwClient(endpoint, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || 'Master wallet request failed');
    err.code = data.code;
    throw err;
  }
  return data.data !== undefined ? data.data : data;
}

export const masterWalletAPI = {
  getProviderWallet: () => mwClient(`${base}/provider/wallet`),
  getCompliance: () => mwClient(`${base}/provider/compliance`),
  updateKraPin: (kraPin, kraDocumentUrl) =>
    mwClient(`${base}/provider/compliance/kra`, {
      method: 'PATCH',
      body: JSON.stringify({ kraPin, kraDocumentUrl }),
    }),
  verifyKyc: (verified = true, level = 'standard') =>
    mwClient(`${base}/provider/compliance/kyc`, {
      method: 'POST',
      body: JSON.stringify({ verified, level }),
    }),
  listPayouts: () => mwClient(`${base}/provider/payouts`),
  listInvoices: () => mwClient(`${base}/provider/invoices`),
  registerTransferRecipient: (details) =>
    mwClient(`${base}/provider/transfer-recipient`, {
      method: 'POST',
      body: JSON.stringify(details),
    }),
  getTransferRecipient: () => mwClient(`${base}/provider/transfer-recipient`),
  withdraw: (amount, recipientDetails, idempotencyKey) =>
    mwClient(`${base}/provider/withdraw`, {
      method: 'POST',
      headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {},
      body: JSON.stringify({ amount, recipientDetails }),
    }),
};

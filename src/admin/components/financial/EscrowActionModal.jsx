import React, { useState } from 'react';

export default function EscrowActionModal({ isOpen, onClose, escrow, onAction }) {
  const [mfaToken, setMfaToken] = useState('');

  if (!isOpen) return null;

  const actionLabel = {
    release: 'Release Funds',
    refund: 'Refund Buyer',
    hold: 'Hold Escrow',
  };

  const handleConfirm = () => {
    onAction?.(escrow?.action, mfaToken);
    setMfaToken('');
    onClose();
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='bg-white dark:bg-surface-dark rounded-2xl p-6 w-full max-w-md shadow-xl'>
        <h3 className='text-lg font-bold mb-4'>{actionLabel[escrow?.action] || 'Escrow Action'}</h3>
        <p className='text-sm text-zinc-500 mb-4'>
          Escrow ID: {escrow?.id} | Amount: {escrow?.amount || 0} | Status: {escrow?.status || 'ACTIVE'}
        </p>
        <div className='space-y-3'>
          <label className='block'>
            <span className='text-sm font-medium'>MFA Token (required for financial actions)</span>
            <input
              type='password'
              value={mfaToken}
              onChange={(e) => setMfaToken(e.target.value)}
              className='w-full mt-1 px-3 py-2 border border-zinc-300 rounded-lg'
              placeholder='Enter MFA token'
            />
          </label>
          <div className='flex gap-2 pt-4'>
            <button
              onClick={handleConfirm}
              disabled={!mfaToken}
              className='flex-1 px-4 py-2 bg-[#4C1D95] text-white rounded-lg hover:bg-[#3d187a] disabled:opacity-50'
            >
              Confirm {actionLabel[escrow?.action] || 'Action'}
            </button>
          </div>
        </div>
        <button
          onClick={onClose}
          className='mt-4 w-full px-4 py-2 border border-zinc-300 rounded-lg hover:bg-zinc-50'
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
import React from 'react';

const TransactionDetailModal = ({ isOpen, transaction, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-bold mb-4">Transaction Details</h3>
        {transaction && (
          <div className="space-y-2">
            <p><strong>ID:</strong> {transaction.id}</p>
            <p><strong>Amount:</strong> {transaction.amount}</p>
            <p><strong>Status:</strong> {transaction.status}</p>
          </div>
        )}
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TransactionDetailModal;
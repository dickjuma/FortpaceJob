import React from 'react';
import DocumentTemplate from '../shared/DocumentTemplate';

export default function ReceiptPreview({ transaction }) {
  if (!transaction) return null;

  return (
    <DocumentTemplate 
      title="Official Receipt"
      documentId={transaction.id}
      date={new Date(transaction.date).toLocaleDateString()}
      type="receipt"
      className="shadow-xl"
    >
      <div className="space-y-8">
        
        {/* Bill To Section */}
        <div className="flex justify-between items-start border-b border-zinc-100 pb-6">
          <div>
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">Billed To</h3>
            <p className="text-base font-bold text-zinc-900">{transaction.user}</p>
            <p className="text-sm font-medium text-zinc-500 mt-1">Forte Space User</p>
          </div>
          <div className="text-right">
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">Payment Status</h3>
            <span className="inline-flex px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-black uppercase tracking-widest">
              {transaction.status === 'completed' ? 'Paid & Settled' : transaction.status}
            </span>
          </div>
        </div>

        {/* Line Items */}
        <div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-zinc-200">
                <th className="py-3 text-xs font-black text-zinc-400 uppercase tracking-widest">Description</th>
                <th className="py-3 text-xs font-black text-zinc-400 uppercase tracking-widest text-center">Method</th>
                <th className="py-3 text-xs font-black text-zinc-400 uppercase tracking-widest text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              <tr>
                <td className="py-4">
                  <p className="text-sm font-bold text-zinc-900 capitalize">{transaction.type} processing</p>
                  <p className="text-xs text-zinc-500 mt-1 font-mono">Ref: {transaction.id}</p>
                </td>
                <td className="py-4 text-center">
                  <span className="text-xs font-bold text-zinc-700 uppercase">{transaction.method}</span>
                </td>
                <td className="py-4 text-right">
                  <span className="text-sm font-bold text-zinc-900">
                    KES {transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end pt-4">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-sm font-bold text-zinc-500">
              <span>Subtotal</span>
              <span>KES {transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-zinc-500">
              <span>Tax (0%)</span>
              <span>KES 0.00</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t-2 border-zinc-900">
              <span className="text-base font-black text-zinc-900">Total Paid</span>
              <span className="text-xl font-black text-[#14a800]">
                KES {transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

      </div>
    </DocumentTemplate>
  );
}

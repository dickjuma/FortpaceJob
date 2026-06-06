import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Smartphone, Building, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';

export default function DepositFundsModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState('');
  const [amount, setAmount] = useState('');

  const methods = [
    { id: 'mpesa', name: 'M-Pesa STK Push', icon: Smartphone, time: 'Instant', fee: '0%' },
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, time: 'Instant', fee: '2.9%' },
    { id: 'bank', name: 'Bank Transfer', icon: Building, time: '1-3 Days', fee: '$0 Fixed' },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-surface-dark rounded-2xl shadow-modal w-full max-w-lg overflow-hidden border border-gray-200 dark:border-surface-dark-border font-sans"
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-surface-dark-border">
            <h2 className="text-xl font-bold text-surface-dark dark:text-white">Deposit Funds</h2>
            <button onClick={onClose} className="text-gray-500 hover:bg-gray-100 dark:hover:bg-surface-dark-secondary p-2 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-surface-dark dark:text-white mb-3">Select Payment Method</label>
                  <div className="space-y-3">
                    {methods.map(m => (
                      <div 
                        key={m.id} 
                        onClick={() => setMethod(m.id)}
                        className={`p-4 border-2 rounded-xl cursor-pointer flex items-center justify-between transition-colors ${method === m.id ? 'border-[#4C1D95]/20 bg-[#4C1D95]/5 dark:bg-[#4C1D95]/20' : 'border-gray-200 dark:border-surface-dark-border hover:border-[#4C1D95]/50'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${method === m.id ? 'bg-[#4C1D95] text-white' : 'bg-gray-100 dark:bg-surface-dark-secondary text-gray-500'}`}>
                            <m.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-surface-dark dark:text-white">{m.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{m.time} processing</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-surface-dark dark:text-gray-300">{m.fee} Fee</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setStep(2)}
                  disabled={!method}
                  className="w-full py-4 bg-[#4C1D95] hover:bg-[#22C55E] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-button font-bold flex justify-center items-center transition-colors shadow-lg shadow-[#4C1D95]/25/25"
                >
                  Continue <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-surface-dark dark:text-white mb-3">Enter Amount (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -tranzinc-y-1/2 text-xl font-bold text-gray-400">$</span>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-9 pr-4 py-4 text-2xl font-bold bg-surface-secondary dark:bg-surface-dark-secondary border-2 border-transparent focus:border-[#4C1D95]/20 rounded-xl text-surface-dark dark:text-white outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="bg-surface-tertiary dark:bg-surface-dark-secondary rounded-xl p-4 border border-gray-200 dark:border-surface-dark-border">
                  <div className="flex justify-between items-center mb-2 text-sm">
                    <span className="text-gray-500">Processing Fee</span>
                    <span className="font-medium text-surface-dark dark:text-white">$0.00</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="font-bold text-surface-dark dark:text-white">Total to Pay</span>
                    <span className="font-bold text-[#4C1D95] dark:text-[#4C1D95]">${amount || '0.00'}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setStep(3)}
                  disabled={!amount || Number(amount) <= 0}
                  className="w-full py-4 bg-[#4C1D95] hover:bg-[#22C55E] disabled:opacity-50 text-white rounded-button font-bold transition-colors shadow-lg shadow-[#4C1D95]/25/25"
                >
                  Confirm & Pay
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="py-8 text-center space-y-4">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.5 }}
                  className="w-20 h-20 mx-auto bg-success/10 text-success rounded-full flex items-center justify-center mb-4"
                >
                  <CheckCircle className="w-10 h-10" />
                </motion.div>
                <h2 className="text-2xl font-bold text-surface-dark dark:text-white">Deposit Successful!</h2>
                <p className="text-gray-500 dark:text-gray-400">Your wallet has been credited with ${amount}.</p>
                
                <div className="pt-8">
                  <button onClick={onClose} className="w-full py-4 bg-surface-tertiary dark:bg-surface-dark-secondary hover:bg-gray-200 dark:hover:bg-surface-dark-tertiary text-surface-dark dark:text-white rounded-button font-bold transition-colors">
                    Return to Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>

          {step < 3 && (
            <div className="p-4 bg-surface dark:bg-surface-dark-secondary border-t border-gray-200 dark:border-surface-dark-border flex items-center justify-center gap-2 text-xs text-gray-500">
              <ShieldCheck className="w-4 h-4 text-success" />
              End-to-end encrypted • PCI DSS Compliant
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}



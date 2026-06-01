import React, { useState } from 'react';
import { Camera, UploadCloud, ShieldCheck, CheckCircle, ArrowRight, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function IdentityVerificationFlow() {
  const [step, setStep] = useState(1);
  const [documentType, setDocumentType] = useState('');

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 font-sans">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#14a800]/10 dark:bg-[#14a800]/30 text-[#14a800] dark:text-[#14a800] mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Identity Verification</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Securely verify your identity to unlock enterprise features.</p>
      </div>

      <div className="flex justify-between items-center mb-12 relative">
        <div className="absolute left-0 top-1/2 -tranzinc-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-800 -z-10"></div>
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step >= s ? 'bg-[#14a800] text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'}`}>
            {step > s ? <CheckCircle className="w-6 h-6" /> : s}
          </div>
        ))}
      </div>

      <motion.div 
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-sm"
      >
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Select Document Type</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['Passport', 'Driver License', 'National ID'].map((type) => (
                <button
                  key={type}
                  onClick={() => setDocumentType(type)}
                  className={`p-4 border rounded-xl text-left transition-colors ${documentType === type ? 'border-[#14a800]/20 bg-[#14a800]/5 dark:bg-[#14a800]/20' : 'border-gray-200 dark:border-gray-800 hover:border-[#14a800]/20'}`}
                >
                  <User className="w-6 h-6 mb-2 text-gray-600 dark:text-gray-400" />
                  <span className="font-semibold text-gray-900 dark:text-white">{type}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 text-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upload Front of {documentType}</h2>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-surface dark:hover:bg-gray-800/50 transition-colors">
              <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-700 dark:text-gray-300 font-medium">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-500 mt-1">SVG, PNG, JPG or PDF (max. 10MB)</p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 text-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Liveness Check</h2>
            <p className="text-gray-500 dark:text-gray-400">Please position your face within the frame.</p>
            <div className="w-full h-64 bg-gray-900 rounded-2xl flex items-center justify-center relative overflow-hidden">
              <div className="w-48 h-48 border-4 border-dashed border-white rounded-full opacity-50"></div>
              <button className="absolute bottom-4 bg-white text-gray-900 px-6 py-2 rounded-full font-bold shadow-lg flex items-center">
                <Camera className="w-5 h-5 mr-2" /> Take Photo
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 text-center py-8">
            <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verification Submitted</h2>
            <p className="text-gray-500 dark:text-gray-400">Our AI is reviewing your documents. This usually takes less than 5 minutes.</p>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          {step < 4 && (
            <button
              onClick={handleNext}
              disabled={step === 1 && !documentType}
              className="px-6 py-3 bg-[#14a800] hover:bg-[#118a00] text-white rounded-xl font-medium transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

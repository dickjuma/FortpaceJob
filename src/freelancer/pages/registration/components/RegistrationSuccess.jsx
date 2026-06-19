import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Search, Settings, UserCircle } from 'lucide-react';

export const RegistrationSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-10 px-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12" />
        </div>
      </motion.div>

      <h2 className="text-3xl font-bold text-gray-900 mb-4">You're all set!</h2>
      <p className="text-gray-500 max-w-md mx-auto mb-10">
        Your Fort-Space freelancer profile has been created and is now under review. 
        You can start browsing jobs immediately.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mb-12">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Browse Jobs</h3>
          <p className="text-sm text-gray-500">Find and save jobs that match your skills.</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
          <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <UserCircle className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Complete Profile</h3>
          <p className="text-sm text-gray-500">Add more portfolio items to stand out.</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
          <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Settings className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Account Settings</h3>
          <p className="text-sm text-gray-500">Configure your payment and notification settings.</p>
        </div>
      </div>

      <button
        onClick={() => window.location.href = '/dashboard/freelancer'}
        className="bg-gray-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition"
      >
        Go to Dashboard
      </button>
    </div>
  );
};

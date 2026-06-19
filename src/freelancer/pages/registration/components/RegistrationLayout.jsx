import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';
import { useRegistration } from '../RegistrationContext';

const steps = [
  { id: 1, name: 'Account Setup', description: 'Basic details' },
  { id: 2, name: 'Professional Identity', description: 'Your expertise' },
  { id: 3, name: 'Verification', description: 'ID & Security' },
  { id: 4, name: 'Preferences', description: 'Availability' },
];

export const RegistrationLayout = ({ children }) => {
  const { currentStep } = useRegistration();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Fort-Space</span>
          </div>
          <div className="text-sm text-gray-500">
            Freelancer Registration
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col lg:flex-row gap-8 w-full">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 shrink-0">
          <nav aria-label="Progress">
            <ol className="overflow-hidden lg:block flex gap-4 overflow-x-auto pb-4">
              {steps.map((step, stepIdx) => (
                <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'lg:pb-10' : ''} flex-1 lg:flex-none min-w-[120px]`}>
                  {stepIdx !== steps.length - 1 ? (
                    <div
                      className={`hidden lg:block absolute top-4 left-4 -ml-px h-full w-0.5 ${
                        step.id < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex items-start group">
                    <span className="h-9 flex items-center">
                      <span
                        className={`relative z-10 w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                          step.id < currentStep
                            ? 'bg-blue-600 hover:bg-blue-800'
                            : step.id === currentStep
                            ? 'bg-white border-2 border-blue-600'
                            : 'bg-white border-2 border-gray-300'
                        }`}
                      >
                        {step.id < currentStep ? (
                          <Check className="w-5 h-5 text-white" />
                        ) : (
                          <span
                            className={`${
                              step.id === currentStep ? 'text-blue-600' : 'text-gray-500'
                            } font-semibold text-sm`}
                          >
                            {step.id}
                          </span>
                        )}
                      </span>
                    </span>
                    <span className="ml-4 min-w-0 flex flex-col">
                      <span
                        className={`text-sm font-medium tracking-wide uppercase ${
                          step.id <= currentStep ? 'text-blue-600' : 'text-gray-500'
                        }`}
                      >
                        {step.name}
                      </span>
                      <span className="text-sm text-gray-500 hidden lg:block">{step.description}</span>
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {/* Form Area */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
          <div className="p-6 md:p-10 min-h-[500px] flex flex-col relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

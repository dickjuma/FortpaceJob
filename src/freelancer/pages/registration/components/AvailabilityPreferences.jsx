import React, { useState } from 'react';
import { useRegistration } from '../RegistrationContext';
import { DollarSign, Clock, Globe, MapPin, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AvailabilityPreferences = () => {
  const { formData, updateFormData, nextStep, prevStep } = useRegistration();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        role: 'FREELANCER',
        accountType: 'INDIVIDUAL',
        name: `${formData.firstName} ${formData.lastName}`.trim(),
      };
      // Submit the data to the API
      const { default: api } = await import('../../../../platform/common/services/api');
      await api.auth.register(payload);
      nextStep();
    } catch (err) {
      console.error('Registration error', err);
      // Optional: Handle error UI here (e.g. setErrors)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Availability & Preferences</h2>
        <p className="text-gray-500 mb-8">Set your rates and working preferences to help us match you with the right jobs.</p>

        <form onSubmit={handleNext} className="space-y-8 max-w-xl">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate (USD)</label>
            <p className="text-xs text-gray-500 mb-3">You can adjust this for individual proposals later.</p>
            <div className="relative max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                min="5"
                required
                value={formData.hourlyRate}
                onChange={(e) => updateFormData({ hourlyRate: e.target.value })}
                className="pl-10 block w-full border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-lg shadow-sm border p-3 font-semibold"
                placeholder="0.00"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 font-medium">/hr</span>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Your hourly rate</span>
                <span className="font-medium text-gray-900">${formData.hourlyRate || '0.00'}</span>
              </div>
              <div className="flex justify-between text-sm mb-3 pb-3 border-b border-gray-200">
                <span className="text-gray-600">Fort-Space Service Fee (10%)</span>
                <span className="text-gray-500">-${((formData.hourlyRate || 0) * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-gray-900">You'll receive</span>
                <span className="text-green-600">${((formData.hourlyRate || 0) * 0.9).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Availability</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                onClick={() => updateFormData({ availability: 'full-time' })}
                className={`border rounded-xl p-4 cursor-pointer transition ${
                  formData.availability === 'full-time' 
                    ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Clock className={`w-5 h-5 ${formData.availability === 'full-time' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className={`font-medium ${formData.availability === 'full-time' ? 'text-blue-900' : 'text-gray-900'}`}>More than 30 hrs/week</span>
                  </div>
                  {formData.availability === 'full-time' && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                </div>
                <p className="text-sm text-gray-500 mt-1 pl-7">I am looking for full-time workload</p>
              </div>

              <div 
                onClick={() => updateFormData({ availability: 'part-time' })}
                className={`border rounded-xl p-4 cursor-pointer transition ${
                  formData.availability === 'part-time' 
                    ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Clock className={`w-5 h-5 ${formData.availability === 'part-time' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className={`font-medium ${formData.availability === 'part-time' ? 'text-blue-900' : 'text-gray-900'}`}>Less than 30 hrs/week</span>
                  </div>
                  {formData.availability === 'part-time' && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                </div>
                <p className="text-sm text-gray-500 mt-1 pl-7">I am open to part-time gigs</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Work Type</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                onClick={() => updateFormData({ preferredWorkType: 'remote' })}
                className={`border rounded-xl p-4 cursor-pointer transition ${
                  formData.preferredWorkType === 'remote' 
                    ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Globe className={`w-5 h-5 ${formData.preferredWorkType === 'remote' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className={`font-medium ${formData.preferredWorkType === 'remote' ? 'text-blue-900' : 'text-gray-900'}`}>Remote Only</span>
                  </div>
                  {formData.preferredWorkType === 'remote' && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                </div>
              </div>

              <div 
                onClick={() => updateFormData({ preferredWorkType: 'hybrid' })}
                className={`border rounded-xl p-4 cursor-pointer transition ${
                  formData.preferredWorkType === 'hybrid' 
                    ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <MapPin className={`w-5 h-5 ${formData.preferredWorkType === 'hybrid' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className={`font-medium ${formData.preferredWorkType === 'hybrid' ? 'text-blue-900' : 'text-gray-900'}`}>Open to On-site/Hybrid</span>
                  </div>
                  {formData.preferredWorkType === 'hybrid' && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-12 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors"
              disabled={isSubmitting}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-brand-900 text-white rounded-xl font-bold hover:bg-brand-800 transition-colors shadow-lg shadow-brand-900/20"
            >
              {isSubmitting ? 'Submitting...' : 'Complete Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React from 'react';
import { useRegistration } from '../RegistrationContext';
import { Shield, Upload, FileText, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

export const VerificationSecurity = () => {
  const { formData, updateFormData, nextStep, prevStep } = useRegistration();

  const handleNext = (e) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-bold text-gray-900">Verification & Security</h2>
          <Shield className="w-6 h-6 text-green-500" />
        </div>
        <p className="text-gray-500 mb-8">Fort-Space requires ID verification to build a trusted marketplace.</p>

        <form onSubmit={handleNext} className="space-y-8 max-w-xl">
          
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-4">
            <div className="bg-blue-100 p-2 rounded-full shrink-0">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Why do we need this?</h4>
              <p className="text-sm text-gray-600 mt-1">
                Verifying your identity helps keep Fort-Space secure and builds trust with potential clients. Your data is encrypted and stored securely.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Government ID Type</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['Passport', 'Driver\'s License', 'National ID'].map((type) => (
                <div 
                  key={type}
                  onClick={() => updateFormData({ idDocumentType: type })}
                  className={`border rounded-xl p-4 cursor-pointer transition flex items-center justify-between ${
                    formData.idDocumentType === type 
                      ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className={`text-sm font-medium ${formData.idDocumentType === type ? 'text-blue-900' : 'text-gray-700'}`}>
                    {type}
                  </span>
                  {formData.idDocumentType === type && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Upload ID Document</label>
            
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:bg-gray-50 transition cursor-pointer group">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <Upload className="w-6 h-6 text-gray-500 group-hover:text-blue-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Click to upload front of ID</h4>
              <p className="text-xs text-gray-500">SVG, PNG, JPG or PDF (max. 10MB)</p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:bg-gray-50 transition cursor-pointer group">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <Upload className="w-6 h-6 text-gray-500 group-hover:text-blue-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Click to upload back of ID (optional)</h4>
              <p className="text-xs text-gray-500">Only if applicable to your ID type</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => updateFormData({ city: e.target.value })}
                className="block w-full border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm border p-3"
                placeholder="e.g. San Francisco"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <select
                required
                value={formData.country}
                onChange={(e) => updateFormData({ country: e.target.value })}
                className="block w-full border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm border p-3 bg-white"
              >
                <option value="">Select country...</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="IN">India</option>
                <option value="DE">Germany</option>
              </select>
            </div>
          </div>

          <button id="submit-step-3" type="submit" className="hidden"></button>
        </form>
      </div>

      {/* Footer Navigation */}
      <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
        <button
          onClick={prevStep}
          className="text-gray-600 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={() => document.getElementById('submit-step-3').click()}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition flex items-center gap-2"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

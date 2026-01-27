import React, { useState } from "react";
import { 
  Send, 
  Clock, 
  DollarSign, 
  FileText, 
  AlertCircle, 
  Paperclip, 
  ShieldCheck, 
  ChevronDown,
  X,
  Upload,
  CheckCircle,
  Percent,
  Calendar,
  User,
  Briefcase
} from "lucide-react";

export default function SendProposal({ request, onCancel }) {
  const [formData, setFormData] = useState({
    description: "",
    price: "",
    deliveryTime: "7",
    revisions: "2",
    attachments: []
  });
  const [dragActive, setDragActive] = useState(false);
  const [step, setStep] = useState(1);

  const serviceFee = formData.price ? (parseFloat(formData.price) * 0.20).toFixed(2) : "0.00";
  const netIncome = formData.price ? (parseFloat(formData.price) - serviceFee).toFixed(2) : "0.00";

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files) => {
    const fileArray = Array.from(files).slice(0, 3);
    setFormData({...formData, attachments: [...formData.attachments, ...fileArray].slice(0, 3)});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.price) {
      alert("Please fill in all required fields");
      return;
    }
    alert(`Offer sent to ${request?.buyer || "client"}`);
    onCancel();
  };

  const deliveryOptions = [
    { value: "1", label: "1 Day" },
    { value: "3", label: "3 Days" },
    { value: "7", label: "7 Days" },
    { value: "14", label: "14 Days" },
    { value: "30", label: "30 Days" }
  ];

  const revisionOptions = [
    { value: "1", label: "1 Revision" },
    { value: "2", label: "2 Revisions" },
    { value: "3", label: "3 Revisions" },
    { value: "unlimited", label: "Unlimited Revisions" }
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button 
          onClick={onCancel}
          className="text-sm font-medium text-gray-500 hover:text-gray-800 mb-4 flex items-center gap-2"
        >
          ← Back to requests
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Send Proposal</h1>
            <p className="text-gray-600 mt-1">Create a custom offer for this project</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <div className="text-sm font-medium text-gray-900">Client's Budget</div>
              <div className="text-lg font-semibold">{request?.budget || "$0.00"}</div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Send size={20} className="text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                1
              </div>
              <span className="font-medium">Proposal</span>
            </div>
            <div className="h-1 w-8 bg-gray-200"></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                2
              </div>
              <span className="font-medium">Details</span>
            </div>
            <div className="h-1 w-8 bg-gray-200"></div>
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                3
              </div>
              <span className="font-medium">Review</span>
            </div>
          </div>
        </div>

        {/* Project Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-gray-900">Project: {request?.title || "Custom Project"}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <User size={14} />
                  {request?.buyer || "Client"}
                </div>
                {request?.rating && (
                  <div className="flex items-center gap-1">
                    <CheckCircle size={14} className="text-green-500" />
                    Rating: {request.rating}
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 mb-1">Client Budget</div>
              <div className="text-lg font-semibold text-gray-900">{request?.budget || "Not specified"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Proposal Form */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-8">
            {/* Proposal Description */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Proposal Description
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-4 min-h-[150px] focus:border-blue-500 focus:outline-none text-gray-700 text-sm"
                placeholder="Introduce yourself and explain how you will execute this project. Be specific about the value you bring, your approach, and relevant experience."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
              <div className="flex justify-between mt-2">
                <p className="text-xs text-gray-500">Required field</p>
                <p className="text-xs text-gray-500">{formData.description.length} / 2500 characters</p>
              </div>
            </div>

            {/* Offer Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Inputs */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Price
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="number"
                        className="w-full border border-gray-300 rounded-lg py-2.5 pl-9 pr-3 focus:outline-none focus:border-blue-500"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Time
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <select
                        className="w-full border border-gray-300 rounded-lg py-2.5 pl-9 pr-8 appearance-none focus:outline-none focus:border-blue-500 bg-white"
                        value={formData.deliveryTime}
                        onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                      >
                        {deliveryOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Revisions Included
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <select
                      className="w-full border border-gray-300 rounded-lg py-2.5 pl-9 pr-8 appearance-none focus:outline-none focus:border-blue-500 bg-white"
                      value={formData.revisions}
                      onChange={(e) => setFormData({ ...formData, revisions: e.target.value })}
                    >
                      {revisionOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attachments (Optional)
                  </label>
                  <div 
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer ${
                      dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('file-upload').click()}
                  >
                    <Upload className="mx-auto mb-3 text-gray-400" size={24} />
                    <p className="text-sm text-gray-600 mb-1">
                      Drag & drop files or <span className="text-blue-600 font-medium">click to browse</span>
                    </p>
                    <p className="text-xs text-gray-500">Max 3 files, 10MB each</p>
                    <input 
                      id="file-upload"
                      type="file" 
                      multiple 
                      className="hidden" 
                      onChange={(e) => handleFiles(e.target.files)}
                    />
                  </div>
                  
                  {formData.attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {formData.attachments.map((file, i) => (
                        <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <Paperclip size={14} className="text-gray-500" />
                            <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">{file.name}</span>
                            <span className="text-xs text-gray-500">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setFormData({
                              ...formData, 
                              attachments: formData.attachments.filter((_, idx) => idx !== i)
                            })}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Fee Breakdown */}
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Financial Breakdown</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center py-2">
                    <div>
                      <div className="text-sm font-medium text-gray-900">Total Offer Amount</div>
                      <div className="text-xs text-gray-500">What the client pays</div>
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      ${formData.price || "0.00"}
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-2 border-t border-gray-200">
                    <div>
                      <div className="text-sm font-medium text-gray-700">Service Fee (20%)</div>
                      <div className="text-xs text-gray-500">Platform commission</div>
                    </div>
                    <div className="text-sm font-semibold text-red-600">
                      -${serviceFee}
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-2 border-t border-gray-200">
                    <div>
                      <div className="text-sm font-medium text-gray-700">Taxes & Processing</div>
                      <div className="text-xs text-gray-500">Estimated</div>
                    </div>
                    <div className="text-sm font-semibold text-red-600">
                      -${formData.price ? (parseFloat(formData.price) * 0.03).toFixed(2) : "0.00"}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-300">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-base font-semibold text-gray-900">You'll Earn</div>
                        <div className="text-sm text-gray-500">Net income after fees</div>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        ${netIncome}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-700">
                      This offer will be valid for 48 hours. Once accepted, a workspace will be created for collaboration.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes & Tips */}
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle size={18} className="text-yellow-600 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Tips for a successful proposal:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Be specific about deliverables and timeline</li>
                    <li>Include relevant portfolio samples or case studies</li>
                    <li>Mention your unique approach to this project</li>
                    <li>Clearly state what's included in your price</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-500">
                  By submitting, you agree to our terms and conditions
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => alert("Draft saved")}
                    className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Save as Draft
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm flex items-center gap-2 transition-colors"
                  >
                    <Send size={16} />
                    Send Proposal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
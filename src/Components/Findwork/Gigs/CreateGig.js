import React, { useState } from "react";
import { 
  Check, ChevronRight, ChevronLeft, DollarSign, Clock, 
  Plus, X, ImageIcon, MessageSquare, Rocket,
  AlertCircle, Info, Star, Zap
} from "lucide-react";

export default function CreateGig() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    category: "Programming & Tech",
    subcategory: "",
    tags: [],
    packages: {
      basic: { name: "Basic", desc: "", delivery: "3", revisions: "1", price: "" },
      standard: { name: "Standard", desc: "", delivery: "5", revisions: "3", price: "" },
      premium: { name: "Premium", desc: "", delivery: "7", revisions: "Unlimited", price: "" },
    },
    description: "",
    requirements: [{ id: 1, question: "", type: "text", required: true }],
    images: []
  });

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep((prev) => prev + 1);
  };
  
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const steps = [
    { id: 1, title: "Overview", subtitle: "Gig information" },
    { id: 2, title: "Pricing", subtitle: "Packages & pricing" },
    { id: 3, title: "Description", subtitle: "Details & FAQs" },
    { id: 4, title: "Requirements", subtitle: "What you need" },
    { id: 5, title: "Gallery", subtitle: "Images & media" }
  ];

  const addTag = (tag) => {
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData({...formData, tags: [...formData.tags, tag]});
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({...formData, tags: formData.tags.filter(t => t !== tagToRemove)});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Create a New Gig</h1>
              <p className="text-sm text-gray-500 mt-1 hidden sm:block">
                Step {currentStep} of {steps.length}: {steps[currentStep - 1].subtitle}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
                Save Draft
              </button>
              <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Auto-saving
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between pb-4">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex-1 relative">
                <div className="flex flex-col items-center sm:items-start sm:flex-row sm:gap-3">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    currentStep > step.id 
                      ? "bg-[#1DBF73] text-white" 
                      : currentStep === step.id 
                        ? "bg-[#1DBF73] text-white ring-4 ring-[#1DBF73]/20" 
                        : "bg-gray-200 text-gray-400"
                  }`}>
                    {currentStep > step.id ? <Check size={16} strokeWidth={3} /> : step.id}
                  </div>
                  <div className="hidden sm:block mt-1">
                    <div className={`text-sm font-semibold ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500">{step.subtitle}</div>
                  </div>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`hidden sm:block absolute top-5 left-10 right-0 h-0.5 -z-10 transition-all ${
                    currentStep > step.id ? 'bg-[#1DBF73]' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          
          {/* Step Content */}
          <div className="p-6 sm:p-8 lg:p-12">
            
            {/* STEP 1: OVERVIEW */}
            {currentStep === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Gig Title <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#1DBF73] focus:border-transparent"
                      placeholder="I will..."
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      maxLength={80}
                    />
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      {formData.title.length}/80 characters
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    As your Gig storefront, your title is the most important place to include keywords that buyers would likely use to search for a service like yours.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#1DBF73] focus:border-transparent"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      <option>Programming & Tech</option>
                      <option>Graphics & Design</option>
                      <option>Digital Marketing</option>
                      <option>Writing & Translation</option>
                      <option>Video & Animation</option>
                      <option>Music & Audio</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Subcategory <span className="text-red-500">*</span>
                    </label>
                    <select 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#1DBF73] focus:border-transparent"
                      value={formData.subcategory}
                      onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
                    >
                      <option value="">Select a subcategory</option>
                      <option>Website Development</option>
                      <option>Mobile Apps</option>
                      <option>Desktop Applications</option>
                      <option>Chatbots</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Search Tags <span className="text-gray-500 font-normal">(up to 5 tags)</span>
                  </label>
                  <div className="border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-[#1DBF73] focus-within:border-transparent">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.tags.map(tag => (
                        <span key={tag} className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium">
                          {tag}
                          <button onClick={() => removeTag(tag)} className="hover:text-red-600">
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      className="w-full outline-none text-base"
                      placeholder={formData.tags.length < 5 ? "Add a tag (press Enter)" : "Maximum 5 tags reached"}
                      disabled={formData.tags.length >= 5}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          e.preventDefault();
                          addTag(e.target.value.trim());
                          e.target.value = '';
                        }
                      }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Tag your Gig with buzz words that are relevant to the services you offer. Use all 5 tags to get found.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 2: PRICING */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                  <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">Pricing Strategy Tips</p>
                    <p>Offer 3 packages at different price points to maximize your earning potential. Each package should clearly show increasing value.</p>
                  </div>
                </div>

                <div className="overflow-x-auto -mx-6 sm:mx-0">
                  <div className="inline-block min-w-full align-middle px-6 sm:px-0">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Package</th>
                          <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                          <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">Delivery</th>
                          <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">Revisions</th>
                          <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {['basic', 'standard', 'premium'].map((tier) => (
                          <tr key={tier} className="hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  tier === 'basic' ? 'bg-blue-100 text-blue-600' :
                                  tier === 'standard' ? 'bg-purple-100 text-purple-600' :
                                  'bg-orange-100 text-orange-600'
                                }`}>
                                  {tier === 'basic' ? <Zap size={18} /> :
                                   tier === 'standard' ? <Star size={18} /> :
                                   <Rocket size={18} />}
                                </div>
                                <div>
                                  <div className="font-semibold text-sm text-gray-900 capitalize">{tier}</div>
                                  <div className="text-xs text-gray-500">Package</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1DBF73] focus:border-transparent"
                                placeholder="Describe what's included..."
                                value={formData.packages[tier].desc}
                                onChange={(e) => {
                                  const p = {...formData.packages};
                                  p[tier].desc = e.target.value;
                                  setFormData({...formData, packages: p});
                                }}
                              />
                            </td>
                            <td className="py-4 px-4">
                              <div className="relative">
                                <input
                                  type="number"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1DBF73] focus:border-transparent"
                                  placeholder="3"
                                  value={formData.packages[tier].delivery}
                                  onChange={(e) => {
                                    const p = {...formData.packages};
                                    p[tier].delivery = e.target.value;
                                    setFormData({...formData, packages: p});
                                  }}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">days</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1DBF73] focus:border-transparent"
                                placeholder="3"
                                value={formData.packages[tier].revisions}
                                onChange={(e) => {
                                  const p = {...formData.packages};
                                  p[tier].revisions = e.target.value;
                                  setFormData({...formData, packages: p});
                                }}
                              />
                            </td>
                            <td className="py-4 px-4">
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                <input
                                  type="number"
                                  className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1DBF73] focus:border-transparent"
                                  placeholder="50"
                                  value={formData.packages[tier].price}
                                  onChange={(e) => {
                                    const p = {...formData.packages};
                                    p[tier].price = e.target.value;
                                    setFormData({...formData, packages: p});
                                  }}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: DESCRIPTION */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Gig Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#1DBF73] focus:border-transparent resize-none"
                    rows="12"
                    placeholder="Briefly describe your gig..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    maxLength={1200}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-500">
                      Describe your service in detail. Include your experience, why you're qualified, and what makes you unique.
                    </p>
                    <div className="text-xs text-gray-500">
                      {formData.description.length}/1200
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-900">
                    <p className="font-semibold mb-1">Make Your Description Stand Out</p>
                    <ul className="list-disc list-inside space-y-1 text-yellow-800">
                      <li>Highlight what makes your service unique</li>
                      <li>List the benefits buyers will get</li>
                      <li>Explain your process and timeline</li>
                      <li>Include relevant experience or credentials</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: REQUIREMENTS */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                  <MessageSquare size={20} className="text-gray-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">Get the information you need</p>
                    <p className="text-sm text-gray-600">Add questions to help buyers provide you with exactly what you need to start working on their order.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {formData.requirements.map((req, idx) => (
                    <div key={req.id} className="border border-gray-200 rounded-lg p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold text-gray-900">Question {idx + 1}</h4>
                        {formData.requirements.length > 1 && (
                          <button 
                            onClick={() => setFormData({
                              ...formData, 
                              requirements: formData.requirements.filter(r => r.id !== req.id)
                            })}
                            className="text-red-600 hover:text-red-700 text-sm font-semibold"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your question
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1DBF73] focus:border-transparent"
                            placeholder="e.g., What is your brand name?"
                            value={req.question}
                            onChange={(e) => {
                              const reqs = [...formData.requirements];
                              reqs[idx].question = e.target.value;
                              setFormData({...formData, requirements: reqs});
                            }}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Answer type
                            </label>
                            <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1DBF73] focus:border-transparent">
                              <option>Free Text</option>
                              <option>Multiple Choice</option>
                              <option>Attachment</option>
                            </select>
                          </div>
                          
                          <div className="flex items-end">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" className="w-4 h-4 text-[#1DBF73] border-gray-300 rounded focus:ring-[#1DBF73]" defaultChecked />
                              <span className="text-sm font-medium text-gray-700">Required answer</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setFormData({
                    ...formData,
                    requirements: [...formData.requirements, { id: Date.now(), question: "", type: "text", required: true }]
                  })}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-semibold text-gray-600 hover:border-[#1DBF73] hover:text-[#1DBF73] transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> Add Another Question
                </button>
              </div>
            )}

            {/* STEP 5: GALLERY */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="text-center">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-[#1DBF73] transition-colors cursor-pointer group">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#1DBF73]/10 transition-colors">
                      <ImageIcon size={28} className="text-gray-400 group-hover:text-[#1DBF73] transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Images or Videos</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Drag & drop files here or click to browse
                    </p>
                    <button className="px-6 py-2.5 bg-[#1DBF73] text-white rounded-lg font-semibold hover:bg-[#19A463] transition-colors">
                      Choose Files
                    </button>
                  </div>
                  
                  <div className="mt-6 text-left">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Upload Guidelines</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Upload up to 3 images that best represent your service</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Images should be at least 550x370px (recommended: 1270x760px)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Supported formats: JPG, PNG, GIF (max 5MB per file)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                        <span>You can also add a video to showcase your work (max 75 seconds)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Footer */}
          <div className="border-t border-gray-200 px-6 sm:px-8 lg:px-12 py-4 sm:py-6 bg-gray-50">
            <div className="flex items-center justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                  currentStep === 1
                    ? 'opacity-0 pointer-events-none'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ChevronLeft size={18} /> Back
              </button>

              <div className="flex items-center gap-3">
                <button className="px-6 py-2.5 text-gray-700 hover:bg-gray-200 rounded-lg font-semibold text-sm transition-colors hidden sm:block">
                  Save as Draft
                </button>
                <button
                  onClick={nextStep}
                  className="px-8 py-2.5 bg-[#1DBF73] text-white rounded-lg font-semibold text-sm hover:bg-[#19A463] transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                >
                  {currentStep === 5 ? (
                    <>
                      Publish Gig <Rocket size={18} />
                    </>
                  ) : (
                    <>
                      Continue <ChevronRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator - Mobile */}
        <div className="mt-6 text-center text-sm text-gray-500 sm:hidden">
          Step {currentStep} of {steps.length}
        </div>
      </div>
    </div>
  );
}
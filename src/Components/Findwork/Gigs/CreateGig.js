import React, { useState, useEffect } from "react";
import { 
  Check, ChevronRight, ChevronLeft, DollarSign, Clock, 
  Plus, X, ImageIcon, MessageSquare, Rocket,
  AlertCircle, Info, Star, Zap, FileText, Video, 
  Upload, Trash2, Eye, Palette, Globe, TrendingUp,
  Shield, Target, Users, FileCode, Package,
  Sparkles, DollarSign as Dollar, Palette as Paint,
  Volume2, Camera, FileVideo, Link
} from "lucide-react";

export default function CreateGig() {
  const [currentStep, setCurrentStep] = useState(1);
  const [autoSaveStatus, setAutoSaveStatus] = useState("saved");
  const [showPreview, setShowPreview] = useState(false);
  const [gigViews, setGigViews] = useState(124);
  
  const [formData, setFormData] = useState({
    title: "",
    category: "Programming & Tech",
    subcategory: "",
    tags: [],
    packages: {
      basic: { 
        name: "Basic", 
        desc: "", 
        features: [],
        delivery: "3", 
        deliveryType: "days",
        revisions: "1", 
        price: "",
        popular: false
      },
      standard: { 
        name: "Standard", 
        desc: "", 
        features: [],
        delivery: "5", 
        deliveryType: "days",
        revisions: "3", 
        price: "",
        popular: true
      },
      premium: { 
        name: "Premium", 
        desc: "", 
        features: [],
        delivery: "7", 
        deliveryType: "days",
        revisions: "Unlimited", 
        price: "",
        popular: false
      },
    },
    description: "",
    requirements: [{ id: 1, question: "", type: "text", required: true }],
    images: [],
    videos: [],
    faqs: [{ id: 1, question: "", answer: "" }],
    gigExtras: [
      { id: 1, title: "Express Delivery", desc: "Get it 2x faster", price: "50" },
      { id: 2, title: "Source Files", desc: "Get all source files", price: "30" },
      { id: 3, title: "Additional Revision", desc: "One extra revision", price: "20" }
    ],
    seo: {
      metaTitle: "",
      metaDescription: "",
      slug: ""
    },
    visibility: "public",
    aiAssist: false
  });

  // Auto-save simulation
  useEffect(() => {
    if (formData.title) {
      setAutoSaveStatus("saving");
      const timer = setTimeout(() => {
        setAutoSaveStatus("saved");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [formData]);

  const nextStep = () => {
    if (currentStep < 6) setCurrentStep((prev) => prev + 1);
  };
  
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const steps = [
    { id: 1, title: "Overview", subtitle: "Gig information", icon: Info },
    { id: 2, title: "Pricing", subtitle: "Packages & pricing", icon: DollarSign },
    { id: 3, title: "Description", subtitle: "Details & FAQs", icon: FileText },
    { id: 4, title: "Requirements", subtitle: "What you need", icon: Target },
    { id: 5, title: "Gallery", subtitle: "Images & media", icon: ImageIcon },
    { id: 6, title: "Settings", subtitle: "SEO & visibility", icon: Settings }
  ];

  const categories = {
    "Programming & Tech": ["Web Development", "Mobile Apps", "Chatbots", "AI Services", "Blockchain"],
    "Graphics & Design": ["Logo Design", "Brand Style", "Illustration", "UI/UX Design"],
    "Digital Marketing": ["SEO", "Social Media", "Content Strategy", "Email Marketing"],
    "Writing & Translation": ["Content Writing", "Proofreading", "Translation", "Technical Writing"],
    "Video & Animation": ["Video Editing", "Animation", "Motion Graphics", "Whiteboard"],
    "Music & Audio": ["Voice Over", "Mixing & Mastering", "Sound Design", "Jingles"]
  };

  const addTag = (tag) => {
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData({...formData, tags: [...formData.tags, tag]});
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({...formData, tags: formData.tags.filter(t => t !== tagToRemove)});
  };

  const addPackageFeature = (tier, feature) => {
    if (feature.trim()) {
      setFormData(prev => ({
        ...prev,
        packages: {
          ...prev.packages,
          [tier]: {
            ...prev.packages[tier],
            features: [...prev.packages[tier].features, feature.trim()]
          }
        }
      }));
    }
  };

  const removePackageFeature = (tier, index) => {
    setFormData(prev => ({
      ...prev,
      packages: {
        ...prev.packages,
        [tier]: {
          ...prev.packages[tier],
          features: prev.packages[tier].features.filter((_, i) => i !== index)
        }
      }
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'video'
    }));
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const removeMedia = (id) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== id)
    }));
  };

  const StatsCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold text-gray-900">Create New Gig</h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <Sparkles size={14} className="text-yellow-500" />
                  Complete all steps to launch your gig
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowPreview(!showPreview)}
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Eye size={16} />
                Preview
              </button>
              
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  autoSaveStatus === "saving" ? "bg-yellow-500 animate-pulse" :
                  autoSaveStatus === "saved" ? "bg-green-500" : "bg-gray-300"
                }`} />
                <span className="text-xs text-gray-500 hidden sm:inline">
                  {autoSaveStatus === "saving" ? "Saving..." : "Auto-saved"}
                </span>
              </div>
            </div>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              {steps.map((step, idx) => {
                const StepIcon = step.icon;
                return (
                  <div key={step.id} className="flex-1 relative">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setCurrentStep(step.id)}
                        className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                          currentStep > step.id 
                            ? "bg-[#1DBF73] text-white" 
                            : currentStep === step.id 
                              ? "bg-[#1DBF73] text-white ring-4 ring-[#1DBF73]/20 shadow-lg" 
                              : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <StepIcon size={18} />
                      </button>
                      <div className="hidden lg:block">
                        <div className={`text-sm font-semibold ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'}`}>
                          {step.title}
                        </div>
                        <div className="text-xs text-gray-500">{step.subtitle}</div>
                      </div>
                    </div>
                    {idx < steps.length - 1 && (
                      <div className={`absolute top-5 left-10 right-0 h-0.5 -z-10 transition-all duration-300 ${
                        currentStep > step.id ? 'bg-[#1DBF73]' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats & AI Assistant */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Gig Performance</h3>
              <div className="space-y-4">
                <StatsCard 
                  icon={TrendingUp} 
                  label="Estimated Views"
                  value={gigViews.toLocaleString()}
                  color="bg-blue-500"
                />
                <StatsCard 
                  icon={Dollar} 
                  label="Potential Earnings"
                  value="$2,450"
                  color="bg-green-500"
                />
                <StatsCard 
                  icon={Users} 
                  label="Target Audience"
                  value="15.2K"
                  color="bg-purple-500"
                />
              </div>
            </div>

            {/* AI Assistant */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Sparkles size={20} className="text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900">AI Gig Assistant</h3>
              </div>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors">
                  ✨ Optimize gig title
                </button>
                <button className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors">
                  📊 Suggest pricing
                </button>
                <button className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors">
                  🎯 Generate tags
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              
              {/* Step Content */}
              <div className="p-6 sm:p-8">
                
                {/* STEP 1: OVERVIEW */}
                {currentStep === 1 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900">Gig Overview</h2>
                      <button className="text-sm text-[#1DBF73] font-semibold hover:text-[#19A463] flex items-center gap-2">
                        <Sparkles size={16} />
                        AI Suggestions
                      </button>
                    </div>

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
                        <div className="flex justify-between mt-2">
                          <div className="text-xs text-gray-500">
                            {formData.title.length}/80 characters
                          </div>
                          <div className="text-xs text-gray-500">
                            🔥 Keywords: 3/5
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Category <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#1DBF73] focus:border-transparent appearance-none"
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value, subcategory: ""})}
                          >
                            {Object.keys(categories).map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
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
                          {categories[formData.category]?.map(sub => (
                            <option key={sub} value={sub}>{sub}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Search Tags <span className="text-gray-500 font-normal">(up to 5 tags)</span>
                      </label>
                      <div className="space-y-3">
                        <div className="border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-[#1DBF73] focus-within:border-transparent">
                          <div className="flex flex-wrap gap-2 mb-2">
                            {formData.tags.map(tag => (
                              <span key={tag} className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-100">
                                #{tag}
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
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs text-gray-500">Suggestions:</span>
                          {["web", "design", "fast", "professional", "responsive"].map(suggestion => (
                            <button
                              key={suggestion}
                              onClick={() => addTag(suggestion)}
                              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: PRICING */}
                {currentStep === 2 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900">Pricing Packages</h2>
                      <button className="text-sm text-[#1DBF73] font-semibold hover:text-[#19A463]">
                        Compare with competitors →
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {['basic', 'standard', 'premium'].map((tier) => (
                        <div 
                          key={tier} 
                          className={`border rounded-xl p-6 relative transition-all hover:shadow-lg ${
                            formData.packages[tier].popular 
                              ? 'border-[#1DBF73] ring-1 ring-[#1DBF73]' 
                              : 'border-gray-200'
                          }`}
                        >
                          {formData.packages[tier].popular && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                              <span className="bg-[#1DBF73] text-white text-xs font-bold px-3 py-1 rounded-full">
                                MOST POPULAR
                              </span>
                            </div>
                          )}
                          
                          <div className="text-center mb-6">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 ${
                              tier === 'basic' ? 'bg-blue-100 text-blue-600' :
                              tier === 'standard' ? 'bg-purple-100 text-purple-600' :
                              'bg-orange-100 text-orange-600'
                            }`}>
                              {tier === 'basic' ? <Zap size={24} /> :
                               tier === 'standard' ? <Star size={24} /> :
                               <Rocket size={24} />}
                            </div>
                            <h3 className="font-bold text-gray-900 capitalize">{tier}</h3>
                            <p className="text-sm text-gray-500 mt-1">Perfect for small projects</p>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                              </label>
                              <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1DBF73] focus:border-transparent"
                                placeholder="What's included..."
                                value={formData.packages[tier].desc}
                                onChange={(e) => {
                                  const p = {...formData.packages};
                                  p[tier].desc = e.target.value;
                                  setFormData({...formData, packages: p});
                                }}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Delivery
                                </label>
                                <div className="flex gap-2">
                                  <input
                                    type="number"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    value={formData.packages[tier].delivery}
                                    onChange={(e) => {
                                      const p = {...formData.packages};
                                      p[tier].delivery = e.target.value;
                                      setFormData({...formData, packages: p});
                                    }}
                                  />
                                  <select 
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    value={formData.packages[tier].deliveryType}
                                    onChange={(e) => {
                                      const p = {...formData.packages};
                                      p[tier].deliveryType = e.target.value;
                                      setFormData({...formData, packages: p});
                                    }}
                                  >
                                    <option value="days">Days</option>
                                    <option value="hours">Hours</option>
                                  </select>
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Revisions
                                </label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                  placeholder="1"
                                  value={formData.packages[tier].revisions}
                                  onChange={(e) => {
                                    const p = {...formData.packages};
                                    p[tier].revisions = e.target.value;
                                    setFormData({...formData, packages: p});
                                  }}
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                <input
                                  type="number"
                                  className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-lg font-bold focus:outline-none focus:ring-2 focus:ring-[#1DBF73] focus:border-transparent"
                                  placeholder="50"
                                  value={formData.packages[tier].price}
                                  onChange={(e) => {
                                    const p = {...formData.packages};
                                    p[tier].price = e.target.value;
                                    setFormData({...formData, packages: p});
                                  }}
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Features
                              </label>
                              <div className="space-y-2">
                                {formData.packages[tier].features.map((feature, idx) => (
                                  <div key={idx} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                                    <span className="text-sm">✓ {feature}</span>
                                    <button 
                                      onClick={() => removePackageFeature(tier, idx)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                ))}
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                  placeholder="Add a feature..."
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      addPackageFeature(tier, e.target.value);
                                      e.target.value = '';
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Gig Extras */}
                    <div className="border-t pt-8">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Gig Extras</h3>
                      <div className="space-y-3">
                        {formData.gigExtras.map(extra => (
                          <div key={extra.id} className="flex items-center justify-between border border-gray-200 rounded-lg p-4 hover:border-[#1DBF73] transition-colors">
                            <div>
                              <h4 className="font-semibold text-gray-900">{extra.title}</h4>
                              <p className="text-sm text-gray-500">{extra.desc}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="font-bold text-gray-900">+${extra.price}</div>
                                <div className="text-xs text-gray-500">Extra</div>
                              </div>
                              <button className="text-red-500 hover:text-red-700">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                        <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-semibold text-gray-600 hover:border-[#1DBF73] hover:text-[#1DBF73] transition-colors flex items-center justify-center gap-2">
                          <Plus size={16} /> Add Extra Service
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: DESCRIPTION & FAQ */}
                {currentStep === 3 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Gig Description <span className="text-red-500">*</span>
                      </label>
                      <div className="border border-gray-300 rounded-lg overflow-hidden">
                        <div className="border-b border-gray-300 bg-gray-50 p-3 flex gap-2">
                          <button className="px-3 py-1 text-sm font-medium hover:bg-gray-200 rounded">B</button>
                          <button className="px-3 py-1 text-sm font-medium hover:bg-gray-200 rounded">I</button>
                          <button className="px-3 py-1 text-sm font-medium hover:bg-gray-200 rounded">U</button>
                          <div className="w-px h-6 bg-gray-300 mx-2"></div>
                          <button className="px-3 py-1 text-sm font-medium hover:bg-gray-200 rounded">📋</button>
                          <button className="px-3 py-1 text-sm font-medium hover:bg-gray-200 rounded">🔗</button>
                        </div>
                        <textarea
                          className="w-full px-4 py-3 border-none text-base focus:outline-none resize-none"
                          rows="12"
                          placeholder="Briefly describe your gig..."
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          maxLength={1200}
                        />
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-sm text-gray-500">
                          <span className="font-medium">Pro tip:</span> Use bullet points and bold text to highlight key benefits
                        </div>
                        <div className="text-xs text-gray-500">
                          {formData.description.length}/1200
                        </div>
                      </div>
                    </div>

                    {/* FAQ Section */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
                      <div className="space-y-4">
                        {formData.faqs.map((faq, idx) => (
                          <div key={faq.id} className="border border-gray-200 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-sm font-semibold text-gray-900">FAQ {idx + 1}</h4>
                              {formData.faqs.length > 1 && (
                                <button className="text-red-600 hover:text-red-700 text-sm font-semibold">
                                  Remove
                                </button>
                              )}
                            </div>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Question
                                </label>
                                <input
                                  type="text"
                                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm"
                                  placeholder="What do you need to get started?"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Answer
                                </label>
                                <textarea
                                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm"
                                  rows="3"
                                  placeholder="Provide a clear answer..."
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-semibold text-gray-600 hover:border-[#1DBF73] hover:text-[#1DBF73] transition-colors flex items-center justify-center gap-2">
                          <Plus size={16} /> Add FAQ
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: REQUIREMENTS */}
                {currentStep === 4 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">Requirements Form</h2>
                      <p className="text-gray-600">Create a custom form to gather all necessary information from buyers</p>
                    </div>

                    <div className="space-y-6">
                      {formData.requirements.map((req, idx) => (
                        <div key={req.id} className="border border-gray-200 rounded-xl p-6 bg-white">
                          <div className="flex items-center justify-between mb-6">
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900">Question {idx + 1}</h4>
                              <p className="text-xs text-gray-500">Buyers will see this when placing an order</p>
                            </div>
                            {formData.requirements.length > 1 && (
                              <button className="text-red-600 hover:text-red-700 text-sm font-semibold">
                                Remove
                              </button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Question Text
                              </label>
                              <input
                                type="text"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm"
                                placeholder="e.g., What is your brand name?"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Answer Type
                              </label>
                              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm">
                                <option>Free Text</option>
                                <option>Multiple Choice</option>
                                <option>Attachment</option>
                                <option>Yes/No</option>
                              </select>
                            </div>
                          </div>

                          <div className="mt-6">
                            <label className="flex items-center gap-3 cursor-pointer">
                              <div className="relative">
                                <input type="checkbox" className="sr-only" />
                                <div className="w-10 h-6 bg-gray-300 rounded-full shadow-inner"></div>
                                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                              </div>
                              <span className="text-sm font-medium text-gray-700">Required field</span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-sm font-semibold text-gray-600 hover:border-[#1DBF73] hover:text-[#1DBF73] transition-colors flex items-center justify-center gap-2">
                      <Plus size={20} /> Add Another Question
                    </button>
                  </div>
                )}

                {/* STEP 5: GALLERY */}
                {currentStep === 5 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">Media Gallery</h2>
                      <p className="text-gray-600">Upload images and videos to showcase your work</p>
                    </div>

                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-[#1DBF73] transition-colors group cursor-pointer">
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="media-upload"
                      />
                      <label htmlFor="media-upload" className="cursor-pointer">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:from-blue-100 group-hover:to-purple-100 transition-colors">
                          <Upload size={32} className="text-gray-400 group-hover:text-[#1DBF73]" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Drag & drop files here</h3>
                        <p className="text-gray-500 mb-6">or click to browse (max 10 files, 5MB each)</p>
                        <button className="px-8 py-3 bg-[#1DBF73] text-white rounded-lg font-semibold hover:bg-[#19A463] transition-colors shadow-sm">
                          Browse Files
                        </button>
                      </label>
                    </div>

                    {/* Media Preview Grid */}
                    {formData.images.length > 0 && (
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Uploaded Media</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                          {formData.images.map((media) => (
                            <div key={media.id} className="relative group">
                              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                {media.type === 'image' ? (
                                  <img 
                                    src={media.preview} 
                                    alt="Preview" 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-900">
                                    <FileVideo size={32} className="text-white" />
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={() => removeMedia(media.id)}
                                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={16} />
                              </button>
                              <div className="absolute bottom-2 left-2">
                                <span className="text-xs text-white bg-black/50 px-2 py-1 rounded">
                                  {media.type}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Video Embed */}
                    <div className="border border-gray-200 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Embed Video</h3>
                      <div className="flex gap-4">
                        <input
                          type="url"
                          placeholder="YouTube, Vimeo, or TikTok URL"
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
                        />
                        <button className="px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800">
                          Embed
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 6: SETTINGS */}
                {currentStep === 6 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">SEO & Visibility Settings</h2>
                      <p className="text-gray-600">Optimize your gig for search and control visibility</p>
                    </div>

                    {/* SEO Settings */}
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          SEO Title
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
                          placeholder="Optimize for search engines..."
                          maxLength={60}
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          Recommended: 50-60 characters
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          SEO Description
                        </label>
                        <textarea
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
                          rows="3"
                          placeholder="Meta description for search engines..."
                          maxLength={160}
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          Recommended: 150-160 characters
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Custom URL Slug
                        </label>
                        <div className="flex gap-2">
                          <span className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-l-lg text-gray-600">
                            fiverr.com/
                          </span>
                          <input
                            type="text"
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg"
                            placeholder="your-gig-url"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Visibility Settings */}
                    <div className="border border-gray-200 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Visibility Settings</h3>
                      <div className="space-y-4">
                        <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#1DBF73] cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <Globe size={20} className="text-blue-600" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">Public</div>
                              <div className="text-sm text-gray-500">Visible to everyone</div>
                            </div>
                          </div>
                          <input type="radio" name="visibility" className="w-5 h-5" defaultChecked />
                        </label>

                        <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#1DBF73] cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                              <Shield size={20} className="text-green-600" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">Private</div>
                              <div className="text-sm text-gray-500">Only visible via direct link</div>
                            </div>
                          </div>
                          <input type="radio" name="visibility" className="w-5 h-5" />
                        </label>

                        <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#1DBF73] cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                              <Clock size={20} className="text-purple-600" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">Scheduled</div>
                              <div className="text-sm text-gray-500">Publish at specific date/time</div>
                            </div>
                          </div>
                          <input type="radio" name="visibility" className="w-5 h-5" />
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Navigation Footer */}
              <div className="border-t border-gray-200 px-6 sm:px-8 lg:px-12 py-6 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-3 ${
                      currentStep === 1
                        ? 'opacity-0 pointer-events-none'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronLeft size={18} /> Previous
                  </button>

                  <div className="flex items-center gap-4">
                    <div className="hidden sm:block">
                      <div className="text-xs text-gray-500 mb-1">Step {currentStep} of {steps.length}</div>
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#1DBF73] rounded-full transition-all duration-300"
                          style={{ width: `${(currentStep / steps.length) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <button className="px-6 py-3 text-gray-700 hover:bg-gray-200 rounded-xl font-semibold text-sm transition-colors hidden sm:block">
                      Save Draft
                    </button>
                    <button
                      onClick={nextStep}
                      className="px-10 py-3 bg-gradient-to-r from-[#1DBF73] to-[#19A463] text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all flex items-center gap-3 group"
                    >
                      {currentStep === steps.length ? (
                        <>
                          <Rocket size={18} />
                          Publish Gig Now
                        </>
                      ) : (
                        <>
                          Continue
                          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Indicator - Mobile */}
            <div className="mt-6 flex items-center justify-between sm:hidden">
              <div className="text-sm text-gray-500">
                Step {currentStep} of {steps.length}
              </div>
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#1DBF73] rounded-full"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Gig Preview</h2>
              <button 
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{formData.title || "Your Gig Title"}</h3>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {['basic', 'standard', 'premium'].map(tier => (
                    <div key={tier} className="border border-gray-200 rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 capitalize mb-4">{tier} Package</h4>
                      <div className="text-3xl font-bold text-gray-900 mb-4">
                        ${formData.packages[tier].price || "0"}
                      </div>
                      <ul className="space-y-2">
                        <li className="text-gray-600">✓ {formData.packages[tier].delivery} days delivery</li>
                        <li className="text-gray-600">✓ {formData.packages[tier].revisions} revisions</li>
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component for ChevronDown
function ChevronDown(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

// Settings Icon
function Settings(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
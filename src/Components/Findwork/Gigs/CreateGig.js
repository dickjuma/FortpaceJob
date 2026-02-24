import React, { useState, useEffect } from "react";
import { 
  Check, ChevronRight, ChevronLeft, DollarSign, Clock, 
  Plus, X, ImageIcon, MessageSquare, Rocket,
  AlertCircle, Info, Star, Zap, FileText, Video, 
  Upload, Trash2, Eye, Palette, Globe, TrendingUp,
  Shield, Target, Users, FileCode, Package, 
  Sparkles, DollarSign as Dollar, Palette as Paint,
  Volume2, Camera, FileVideo, Link, Calendar,
  Percent, Award, BarChart, Users as UserIcon,
  Mail, Phone, MapPin, CreditCard, Lock,
  CheckCircle, AlertTriangle, Key, Bell
} from "lucide-react";

// Validation utility functions
const validators = {
  required: (value) => !value || value.trim() === "" ? "This field is required" : "",
  minLength: (value, min) => value.length < min ? `Minimum ${min} characters required` : "",
  maxLength: (value, max) => value.length > max ? `Maximum ${max} characters allowed` : "",
  minValue: (value, min) => parseFloat(value) < min ? `Minimum value is ${min}` : "",
  maxValue: (value, max) => parseFloat(value) > max ? `Maximum value is ${max}` : "",
  url: (value) => {
    if (!value) return "";
    const pattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return !pattern.test(value) ? "Please enter a valid URL" : "";
  },
  email: (value) => {
    if (!value) return "";
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !pattern.test(value) ? "Please enter a valid email" : "";
  },
  tagsCount: (tags, max) => tags.length > max ? `Maximum ${max} tags allowed` : "",
  imagesCount: (images, min) => images.length < min ? `Minimum ${min} images required` : "",
  priceRange: (value, min, max) => {
    const num = parseFloat(value);
    return num < min || num > max ? `Price must be between $${min} and $${max}` : "";
  }
};

export default function CreateGig() {
  const [currentStep, setCurrentStep] = useState(1);
  const [autoSaveStatus, setAutoSaveStatus] = useState("saved");
  const [showPreview, setShowPreview] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [gigStats, setGigStats] = useState({
    estimatedViews: 1240,
    potentialEarnings: 2450,
    targetAudience: 15200,
    completionScore: 25
  });

  const [formData, setFormData] = useState({
    title: "",
    category: "programming-tech",
    subcategory: "web-development",
    tags: [],
    packages: [
      { 
        id: 1,
        name: "Basic", 
        description: "Perfect for small projects", 
        features: ["1 page design", "Basic revisions", "1 day delivery"],
        deliveryTime: 3,
        deliveryUnit: "days",
        revisions: 1,
        price: 50,
        popular: false,
        enabled: true
      },
      { 
        id: 2,
        name: "Standard", 
        description: "Most popular choice", 
        features: ["3 page design", "Multiple revisions", "Source files included"],
        deliveryTime: 5,
        deliveryUnit: "days",
        revisions: 3,
        price: 150,
        popular: true,
        enabled: true
      },
      { 
        id: 3,
        name: "Premium", 
        description: "Complete solution", 
        features: ["Unlimited pages", "Unlimited revisions", "Priority support", "Source files"],
        deliveryTime: 7,
        deliveryUnit: "days",
        revisions: 999,
        price: 300,
        popular: false,
        enabled: true
      }
    ],
    description: "",
    requirements: [
      { 
        id: 1, 
        question: "What is your project about?", 
        type: "text", 
        required: true,
        placeholder: "Briefly describe your project..."
      }
    ],
    images: [],
    videos: [],
    faqs: [
      { 
        id: 1, 
        question: "What information do you need to get started?", 
        answer: "I need details about your project requirements, brand guidelines (if any), and any reference materials." 
      }
    ],
    gigExtras: [
      { 
        id: 1, 
        title: "Express Delivery", 
        description: "Get it 2x faster", 
        price: 50,
        enabled: true
      },
      { 
        id: 2, 
        title: "Source Files", 
        description: "Get all source files", 
        price: 30,
        enabled: true
      },
      { 
        id: 3, 
        title: "Additional Revision", 
        description: "One extra revision", 
        price: 20,
        enabled: true
      }
    ],
    seo: {
      metaTitle: "",
      metaDescription: "",
      slug: "",
      keywords: []
    },
    visibility: "public",
    publishDate: "",
    aiAssist: false,
    settings: {
      allowCustomOffers: true,
      enableGigExtras: true,
      responseTime: "24h",
      showOnlineStatus: true,
      notifyOnOrder: true
    }
  });

  const steps = [
    { id: 1, title: "Overview", subtitle: "Basic information", icon: Info, validation: validateStep1 },
    { id: 2, title: "Pricing", subtitle: "Packages & extras", icon: DollarSign, validation: validateStep2 },
    { id: 3, title: "Description", subtitle: "Details & FAQs", icon: FileText, validation: validateStep3 },
    { id: 4, title: "Requirements", subtitle: "Client questions", icon: Target, validation: validateStep4 },
    { id: 5, title: "Gallery", subtitle: "Portfolio & media", icon: ImageIcon, validation: validateStep5 },
    { id: 6, title: "Publish", subtitle: "Review & launch", icon: Rocket, validation: validateStep6 }
  ];

  // Validation functions for each step
  function validateStep1() {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = "Gig title is required";
    } else if (formData.title.length < 15) {
      errors.title = "Title should be at least 15 characters";
    } else if (formData.title.length > 80) {
      errors.title = "Title should not exceed 80 characters";
    }
    
    if (!formData.category) {
      errors.category = "Category is required";
    }
    
    if (!formData.subcategory) {
      errors.subcategory = "Subcategory is required";
    }
    
    if (formData.tags.length === 0) {
      errors.tags = "At least one tag is required";
    } else if (formData.tags.length > 5) {
      errors.tags = "Maximum 5 tags allowed";
    }
    
    return errors;
  }

  function validateStep2() {
    const errors = {};
    
    formData.packages.forEach((pkg, index) => {
      if (pkg.enabled) {
        if (!pkg.name.trim()) {
          errors[`package_${index}_name`] = "Package name is required";
        }
        if (!pkg.description.trim()) {
          errors[`package_${index}_desc`] = "Package description is required";
        }
        if (pkg.price < 5 || pkg.price > 10000) {
          errors[`package_${index}_price`] = "Price must be between $5 and $10,000";
        }
        if (pkg.deliveryTime < 1) {
          errors[`package_${index}_delivery`] = "Delivery time must be at least 1";
        }
      }
    });
    
    return errors;
  }

  function validateStep3() {
    const errors = {};
    
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    } else if (formData.description.length < 120) {
      errors.description = "Description should be at least 120 characters";
    } else if (formData.description.length > 1200) {
      errors.description = "Description should not exceed 1200 characters";
    }
    
    formData.faqs.forEach((faq, index) => {
      if (!faq.question.trim()) {
        errors[`faq_${index}_question`] = "FAQ question is required";
      }
      if (!faq.answer.trim()) {
        errors[`faq_${index}_answer`] = "FAQ answer is required";
      }
    });
    
    return errors;
  }

  function validateStep4() {
    const errors = {};
    
    formData.requirements.forEach((req, index) => {
      if (!req.question.trim()) {
        errors[`req_${index}_question`] = "Question is required";
      }
    });
    
    return errors;
  }

  function validateStep5() {
    const errors = {};
    
    if (formData.images.length < 3) {
      errors.images = "At least 3 images are required";
    }
    
    return errors;
  }

  function validateStep6() {
    const errors = {};
    
    if (!formData.seo.metaTitle.trim() && formData.seo.metaTitle.length > 0) {
      if (formData.seo.metaTitle.length < 30) {
        errors.metaTitle = "SEO title should be at least 30 characters";
      } else if (formData.seo.metaTitle.length > 60) {
        errors.metaTitle = "SEO title should not exceed 60 characters";
      }
    }
    
    if (!formData.seo.metaDescription.trim() && formData.seo.metaDescription.length > 0) {
      if (formData.seo.metaDescription.length < 120) {
        errors.metaDescription = "Meta description should be at least 120 characters";
      } else if (formData.seo.metaDescription.length > 160) {
        errors.metaDescription = "Meta description should not exceed 160 characters";
      }
    }
    
    if (formData.visibility === "scheduled" && !formData.publishDate) {
      errors.publishDate = "Publish date is required for scheduled gigs";
    }
    
    return errors;
  }

  // Auto-save simulation
  useEffect(() => {
    if (formData.title) {
      setAutoSaveStatus("saving");
      const timer = setTimeout(() => {
        setAutoSaveStatus("saved");
        // Simulate saving to localStorage
        localStorage.setItem('gigDraft', JSON.stringify(formData));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [formData]);

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('gigDraft');
    if (savedDraft) {
      setFormData(JSON.parse(savedDraft));
    }
  }, []);

  const nextStep = () => {
    const validationFn = steps[currentStep - 1].validation;
    const errors = validationFn();
    
    if (Object.keys(errors).length === 0) {
      if (currentStep < 6) {
        setCurrentStep(prev => prev + 1);
        setValidationErrors({});
      } else {
        handlePublish();
      }
    } else {
      setValidationErrors(errors);
      // Scroll to first error
      const firstErrorKey = Object.keys(errors)[0];
      const element = document.querySelector(`[data-error="${firstErrorKey}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setValidationErrors({});
    }
  };

  const handlePublish = async () => {
    setSubmitting(true);
    
    try {
      // Prepare data for backend
      const gigData = {
        ...formData,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: "current-user-id", // This would come from auth context
        // Process images for upload (convert to base64 or URLs)
        images: formData.images.map(img => ({
          url: img.preview,
          type: img.type,
          isThumbnail: img.id === formData.images[0]?.id
        })),
        // Calculate statistics
        stats: {
          completionScore: calculateCompletionScore(),
          expectedCtr: calculateExpectedCTR(),
          competitionLevel: "medium"
        }
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success - redirect or show success message
      alert('🎉 Gig published successfully!');
      localStorage.removeItem('gigDraft');
      
      // In real app, you would redirect to gig page
      // router.push(`/gig/${gigId}`);
      
    } catch (error) {
      alert('Error publishing gig. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateCompletionScore = () => {
    let score = 0;
    const totalFields = 8;
    
    if (formData.title) score++;
    if (formData.category && formData.subcategory) score++;
    if (formData.tags.length >= 3) score++;
    if (formData.description.length >= 120) score++;
    if (formData.images.length >= 3) score++;
    if (formData.packages.some(p => p.enabled)) score++;
    if (formData.requirements.length > 0) score++;
    if (formData.faqs.length > 0) score++;
    
    return Math.round((score / totalFields) * 100);
  };

  const calculateExpectedCTR = () => {
    let ctr = 2.5; // Base CTR
    
    // Factors affecting CTR
    if (formData.title.length >= 30 && formData.title.length <= 60) ctr += 0.5;
    if (formData.images.length >= 3) ctr += 0.3;
    if (formData.packages.some(p => p.popular)) ctr += 0.2;
    if (formData.tags.length >= 3) ctr += 0.2;
    
    return ctr.toFixed(1);
  };

  const categories = {
    "graphics-design": {
      name: "Graphics & Design",
      subcategories: [
        { id: "logo-design", name: "Logo Design" },
        { id: "brand-style", name: "Brand Style Guides" },
        { id: "business-cards", name: "Business Cards" },
        { id: "illustration", name: "Illustration" },
        { id: "ui-ux", name: "UI/UX Design" }
      ]
    },
    "programming-tech": {
      name: "Programming & Tech",
      subcategories: [
        { id: "web-development", name: "Web Development" },
        { id: "mobile-apps", name: "Mobile Apps" },
        { id: "chatbots", name: "Chatbots" },
        { id: "ai-services", name: "AI Services" },
        { id: "blockchain", name: "Blockchain" }
      ]
    },
    "digital-marketing": {
      name: "Digital Marketing",
      subcategories: [
        { id: "seo", name: "SEO" },
        { id: "social-media", name: "Social Media Marketing" },
        { id: "content-strategy", name: "Content Strategy" },
        { id: "email-marketing", name: "Email Marketing" }
      ]
    }
  };

  const tagSuggestions = {
    "web-development": ["React", "Next.js", "TypeScript", "Node.js", "MongoDB"],
    "logo-design": ["Minimal", "Modern", "Vintage", "Typography", "Mascot"],
    "seo": ["Technical SEO", "On-page SEO", "Off-page SEO", "Keyword Research", "Analytics"]
  };

  const addTag = (tag) => {
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData(prev => ({...prev, tags: [...prev.tags, tag]}));
      clearError("tags");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({...prev, tags: prev.tags.filter(t => t !== tagToRemove)}));
  };

  const updatePackage = (index, field, value) => {
    setFormData(prev => {
      const newPackages = [...prev.packages];
      newPackages[index] = { ...newPackages[index], [field]: value };
      return { ...prev, packages: newPackages };
    });
    
    // Clear validation error for this field
    clearError(`package_${index}_${field}`);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 10 - formData.images.length);
    
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 5MB.`);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, {
            id: Date.now() + Math.random(),
            file,
            preview: e.target.result,
            type: file.type.startsWith('image/') ? 'image' : 'video',
            name: file.name,
            size: file.size
          }]
        }));
        clearError("images");
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (id) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== id)
    }));
  };

  const addFAQ = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, {
        id: Date.now(),
        question: "",
        answer: ""
      }]
    }));
  };

  const updateFAQ = (index, field, value) => {
    setFormData(prev => {
      const newFAQs = [...prev.faqs];
      newFAQs[index] = { ...newFAQs[index], [field]: value };
      return { ...prev, faqs: newFAQs };
    });
    clearError(`faq_${index}_${field}`);
  };

  const removeFAQ = (id) => {
    if (formData.faqs.length > 1) {
      setFormData(prev => ({
        ...prev,
        faqs: prev.faqs.filter(faq => faq.id !== id)
      }));
    }
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, {
        id: Date.now(),
        question: "",
        type: "text",
        required: true,
        placeholder: ""
      }]
    }));
  };

  const updateRequirement = (index, field, value) => {
    setFormData(prev => {
      const newReqs = [...prev.requirements];
      newReqs[index] = { ...newReqs[index], [field]: value };
      return { ...prev, requirements: newReqs };
    });
    clearError(`req_${index}_question`);
  };

  const removeRequirement = (id) => {
    if (formData.requirements.length > 1) {
      setFormData(prev => ({
        ...prev,
        requirements: prev.requirements.filter(req => req.id !== id)
      }));
    }
  };

  const clearError = (field) => {
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const StatsCard = ({ icon: Icon, label, value, color, trend }) => (
    <div className="bg-white rounded-xl border border-[#E7E1DE] p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon size={20} className="text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#2E2322]">{value}</div>
            <div className="text-sm text-[#7A5A4C]">{label}</div>
          </div>
        </div>
        {trend && (
          <div className={`text-xs font-medium px-2 py-1 rounded-full ${
            trend > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );

  const InputError = ({ error }) => (
    error && (
      <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
        <AlertCircle size={14} />
        <span>{error}</span>
      </div>
    )
  );

  // Update completion score
  useEffect(() => {
    const score = calculateCompletionScore();
    setGigStats(prev => ({ ...prev, completionScore: score }));
  }, [formData]);

  return (
    <div className="min-h-screen bg-[#F8F4F1]">
      {/* Header */}
      <div className="bg-white border-b border-[#E7E1DE] sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-[#2E2322]">Create New Gig</h1>
                <p className="text-sm text-[#7A5A4C] mt-1">Turn your skills into a successful freelance business</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  autoSaveStatus === "saving" ? "bg-yellow-500 animate-pulse" :
                  autoSaveStatus === "saved" ? "bg-green-500" : "bg-[#C1B1A8]"
                }`} />
                <span className="text-sm text-[#7A5A4C]">
                  {autoSaveStatus === "saving" ? "Saving..." : "Auto-saved"}
                </span>
              </div>
              
              <button 
                onClick={() => setShowPreview(true)}
                className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#4A312F] hover:text-[#2E2322] hover:bg-[#F3E9E5] rounded-lg transition-colors"
              >
                <Eye size={16} />
                Preview
              </button>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              {steps.map((step, idx) => {
                const StepIcon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex-1 relative">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setCurrentStep(step.id)}
                        className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                          isCompleted 
                            ? "bg-green-500 text-white" 
                            : isActive 
                              ? "bg-green-500 text-white ring-4 ring-green-500/20" 
                              : "bg-[#F3E9E5] text-[#A38F85]"
                        }`}
                      >
                        {isCompleted ? <Check size={18} /> : <StepIcon size={18} />}
                      </button>
                      <div className="hidden lg:block">
                        <div className={`text-sm font-semibold ${isActive || isCompleted ? 'text-[#2E2322]' : 'text-[#A38F85]'}`}>
                          {step.title}
                        </div>
                        <div className="text-xs text-[#7A5A4C]">{step.subtitle}</div>
                      </div>
                    </div>
                    {idx < steps.length - 1 && (
                      <div className={`absolute top-5 left-10 right-0 h-0.5 -z-10 transition-all duration-300 ${
                        isCompleted ? 'bg-green-500' : 'bg-[#EFE7E2]'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Stats & Progress */}
          <div className="lg:col-span-1 space-y-6">
            {/* Completion Card */}
            <div className="bg-white rounded-xl border border-[#E7E1DE] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#2E2322]">Completion</h3>
                <span className="text-2xl font-bold text-green-500">{gigStats.completionScore}%</span>
              </div>
              <div className="w-full h-2 bg-[#EFE7E2] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all duration-300"
                  style={{ width: `${gigStats.completionScore}%` }}
                />
              </div>
              <div className="mt-4 space-y-2">
                {[
                  { label: "Title & Category", done: !!formData.title && !!formData.category },
                  { label: "Pricing", done: formData.packages.some(p => p.enabled && p.price > 0) },
                  { label: "Description", done: formData.description.length >= 120 },
                  { label: "Portfolio", done: formData.images.length >= 3 },
                  { label: "Requirements", done: formData.requirements.length > 0 },
                  { label: "FAQs", done: formData.faqs.length > 0 }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      item.done ? 'bg-green-500' : 'bg-[#EFE7E2]'
                    }`}>
                      {item.done && <Check size={10} className="text-white" />}
                    </div>
                    <span className={`text-sm ${item.done ? 'text-[#2E2322]' : 'text-[#7A5A4C]'}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Stats */}
            <div className="bg-white rounded-xl border border-[#E7E1DE] p-6">
              <h3 className="font-semibold text-[#2E2322] mb-4">Performance Insights</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-[#7A5A4C] mb-1">Expected CTR</div>
                  <div className="text-2xl font-bold text-[#2E2322]">{calculateExpectedCTR()}%</div>
                </div>
                <div>
                  <div className="text-sm text-[#7A5A4C] mb-1">Competition Level</div>
                  <div className="flex items-center gap-2">
                    <div className="w-full h-2 bg-[#EFE7E2] rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-yellow-500" />
                    </div>
                    <span className="text-sm font-medium text-[#4A312F]">Medium</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-[#FDECE7] to-[#F8F4F1] rounded-xl border border-[#F4C7A1] p-6">
              <h3 className="font-semibold text-[#2E2322] mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-white rounded-lg border border-[#E7E1DE] hover:border-[#C9452F] transition-colors flex items-center gap-3">
                  <Sparkles size={16} className="text-[#C9452F]" />
                  <span>Optimize with AI</span>
                </button>
                <button className="w-full text-left p-3 bg-white rounded-lg border border-[#E7E1DE] hover:border-[#C9452F] transition-colors flex items-center gap-3">
                  <BarChart size={16} className="text-green-500" />
                  <span>View Analytics</span>
                </button>
                <button className="w-full text-left p-3 bg-white rounded-lg border border-[#E7E1DE] hover:border-[#C9452F] transition-colors flex items-center gap-3">
                  <Users size={16} className="text-purple-500" />
                  <span>Target Audience</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-[#E7E1DE] shadow-sm overflow-hidden">
              
              {/* Step Content */}
              <div className="p-6 sm:p-8">
                {currentStep === 1 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-xl font-bold text-[#2E2322] mb-2">Gig Overview</h2>
                      <p className="text-[#6B5B50]">Set up the basic information about your service</p>
                    </div>

                    <div data-error="title">
                      <label className="block text-sm font-semibold text-[#2E2322] mb-2">
                        Gig Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className={`w-full px-4 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-green-500 ${
                          validationErrors.title ? 'border-red-500' : 'border-[#E7E1DE]'
                        }`}
                        placeholder="I will design a modern logo for your brand"
                        value={formData.title}
                        onChange={(e) => {
                          setFormData(prev => ({...prev, title: e.target.value}));
                          clearError("title");
                        }}
                        maxLength={80}
                      />
                      <div className="flex justify-between mt-2">
                        <InputError error={validationErrors.title} />
                        <div className="text-xs text-[#7A5A4C]">
                          {formData.title.length}/80 characters
                        </div>
                      </div>
                      <div className="text-xs text-[#7A5A4C] mt-2">
                        💡 Use keywords that buyers search for. Start with "I will..."
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div data-error="category">
                        <label className="block text-sm font-semibold text-[#2E2322] mb-2">
                          Category <span className="text-red-500">*</span>
                        </label>
                        <select 
                          className={`w-full px-4 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-green-500 ${
                            validationErrors.category ? 'border-red-500' : 'border-[#E7E1DE]'
                          }`}
                          value={formData.category}
                          onChange={(e) => {
                            setFormData(prev => ({...prev, category: e.target.value, subcategory: ''}));
                            clearError("category");
                          }}
                        >
                          <option value="">Select a category</option>
                          {Object.entries(categories).map(([key, cat]) => (
                            <option key={key} value={key}>{cat.name}</option>
                          ))}
                        </select>
                        <InputError error={validationErrors.category} />
                      </div>

                      <div data-error="subcategory">
                        <label className="block text-sm font-semibold text-[#2E2322] mb-2">
                          Subcategory <span className="text-red-500">*</span>
                        </label>
                        <select 
                          className={`w-full px-4 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-green-500 ${
                            validationErrors.subcategory ? 'border-red-500' : 'border-[#E7E1DE]'
                          }`}
                          value={formData.subcategory}
                          onChange={(e) => {
                            setFormData(prev => ({...prev, subcategory: e.target.value}));
                            clearError("subcategory");
                          }}
                          disabled={!formData.category}
                        >
                          <option value="">Select a subcategory</option>
                          {formData.category && categories[formData.category]?.subcategories.map(sub => (
                            <option key={sub.id} value={sub.id}>{sub.name}</option>
                          ))}
                        </select>
                        <InputError error={validationErrors.subcategory} />
                      </div>
                    </div>

                    <div data-error="tags">
                      <label className="block text-sm font-semibold text-[#2E2322] mb-2">
                        Search Tags <span className="text-[#7A5A4C] text-sm font-normal">(up to 5 tags)</span>
                      </label>
                      <div className="space-y-3">
                        <div className={`border rounded-lg p-3 focus-within:ring-2 focus-within:ring-green-500 ${
                          validationErrors.tags ? 'border-red-500' : 'border-[#E7E1DE]'
                        }`}>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {formData.tags.map(tag => (
                              <span key={tag} className="inline-flex items-center gap-1.5 bg-[#F3E9E5] text-[#4A312F] px-3 py-1.5 rounded-full text-sm font-medium">
                                #{tag}
                                <button 
                                  onClick={() => removeTag(tag)}
                                  className="hover:text-red-600 transition-colors"
                                >
                                  <X size={14} />
                                </button>
                              </span>
                            ))}
                          </div>
                          <input
                            type="text"
                            className="w-full outline-none text-base"
                            placeholder={formData.tags.length < 5 ? "Type a tag and press Enter" : "Maximum 5 tags reached"}
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
                        <InputError error={validationErrors.tags} />
                        {formData.subcategory && tagSuggestions[formData.subcategory] && (
                          <div className="flex flex-wrap gap-2">
                            <span className="text-sm text-[#7A5A4C]">Suggestions:</span>
                            {tagSuggestions[formData.subcategory].map(suggestion => (
                              <button
                                key={suggestion}
                                onClick={() => addTag(suggestion)}
                                className="text-sm px-3 py-1 bg-[#F3E9E5] hover:bg-[#EFE7E2] rounded-lg transition-colors"
                                disabled={formData.tags.length >= 5}
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-xl font-bold text-[#2E2322] mb-2">Pricing Packages</h2>
                      <p className="text-[#6B5B50]">Create packages that suit different buyer needs</p>
                    </div>

                    <div className="space-y-6">
                      {formData.packages.map((pkg, index) => (
                        <div 
                          key={pkg.id} 
                          className={`border rounded-xl p-6 relative transition-all ${
                            pkg.popular ? 'border-green-500 ring-1 ring-green-500' : 'border-[#E7E1DE]'
                          }`}
                        >
                          {pkg.popular && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                              <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                MOST POPULAR
                              </span>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={pkg.enabled}
                                  onChange={(e) => updatePackage(index, 'enabled', e.target.checked)}
                                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                />
                                <span className="font-bold text-[#2E2322]">{pkg.name}</span>
                              </label>
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={pkg.popular}
                                onChange={(e) => {
                                  // Only one package can be popular
                                  const newPackages = formData.packages.map((p, i) => ({
                                    ...p,
                                    popular: i === index ? e.target.checked : false
                                  }));
                                  setFormData(prev => ({ ...prev, packages: newPackages }));
                                }}
                                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                              />
                              <span className="text-sm text-[#6B5B50]">Mark as Popular</span>
                            </label>
                          </div>

                          {pkg.enabled && (
                            <div className="space-y-4">
                              <div data-error={`package_${index}_desc`}>
                                <label className="block text-sm font-medium text-[#4A312F] mb-2">
                                  Package Description
                                </label>
                                <input
                                  type="text"
                                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                    validationErrors[`package_${index}_desc`] ? 'border-red-500' : 'border-[#E7E1DE]'
                                  }`}
                                  value={pkg.description}
                                  onChange={(e) => updatePackage(index, 'description', e.target.value)}
                                  placeholder="What's included in this package?"
                                />
                                <InputError error={validationErrors[`package_${index}_desc`]} />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div data-error={`package_${index}_delivery`}>
                                  <label className="block text-sm font-medium text-[#4A312F] mb-2">
                                    Delivery Time
                                  </label>
                                  <div className="flex gap-2">
                                    <input
                                      type="number"
                                      className={`flex-1 px-3 py-2 border rounded-lg text-sm ${
                                        validationErrors[`package_${index}_delivery`] ? 'border-red-500' : 'border-[#E7E1DE]'
                                      }`}
                                      value={pkg.deliveryTime}
                                      onChange={(e) => updatePackage(index, 'deliveryTime', parseInt(e.target.value) || 0)}
                                      min="1"
                                    />
                                    <select 
                                      className="px-3 py-2 border border-[#E7E1DE] rounded-lg text-sm"
                                      value={pkg.deliveryUnit}
                                      onChange={(e) => updatePackage(index, 'deliveryUnit', e.target.value)}
                                    >
                                      <option value="days">Days</option>
                                      <option value="hours">Hours</option>
                                    </select>
                                  </div>
                                  <InputError error={validationErrors[`package_${index}_delivery`]} />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-[#4A312F] mb-2">
                                    Revisions
                                  </label>
                                  <input
                                    type="number"
                                    className="w-full px-3 py-2 border border-[#E7E1DE] rounded-lg text-sm"
                                    value={pkg.revisions === 999 ? "Unlimited" : pkg.revisions}
                                    onChange={(e) => updatePackage(index, 'revisions', e.target.value === "Unlimited" ? 999 : parseInt(e.target.value) || 0)}
                                    min="0"
                                  />
                                </div>
                              </div>

                              <div data-error={`package_${index}_price`}>
                                <label className="block text-sm font-medium text-[#4A312F] mb-2">
                                  Price <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A5A4C]">$</span>
                                  <input
                                    type="number"
                                    className={`w-full pl-7 pr-3 py-2 border rounded-lg text-lg font-bold focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                      validationErrors[`package_${index}_price`] ? 'border-red-500' : 'border-[#E7E1DE]'
                                    }`}
                                    value={pkg.price}
                                    onChange={(e) => updatePackage(index, 'price', parseFloat(e.target.value) || 0)}
                                    min="5"
                                    max="10000"
                                    step="5"
                                  />
                                </div>
                                <InputError error={validationErrors[`package_${index}_price`]} />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-[#4A312F] mb-2">
                                  Features
                                </label>
                                <div className="space-y-2">
                                  {pkg.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-[#F8F4F1] px-3 py-2 rounded">
                                      <div className="flex items-center gap-2">
                                        <Check size={12} className="text-green-500" />
                                        <span className="text-sm">{feature}</span>
                                      </div>
                                      <button 
                                        onClick={() => {
                                          const newFeatures = [...pkg.features];
                                          newFeatures.splice(idx, 1);
                                          updatePackage(index, 'features', newFeatures);
                                        }}
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <X size={14} />
                                      </button>
                                    </div>
                                  ))}
                                  <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-[#E7E1DE] rounded-lg text-sm"
                                    placeholder="Add a feature (press Enter)"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && e.target.value.trim()) {
                                        updatePackage(index, 'features', [...pkg.features, e.target.value.trim()]);
                                        e.target.value = '';
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-xl font-bold text-[#2E2322] mb-2">Description & FAQs</h2>
                      <p className="text-[#6B5B50]">Describe your service and answer common questions</p>
                    </div>

                    <div data-error="description">
                      <label className="block text-sm font-semibold text-[#2E2322] mb-2">
                        Gig Description <span className="text-red-500">*</span>
                      </label>
                      <div className="border border-[#E7E1DE] rounded-lg overflow-hidden">
                        <div className="border-b border-[#E7E1DE] bg-[#F8F4F1] p-3 flex gap-2">
                          <button className="px-3 py-1 text-sm font-medium hover:bg-[#EFE7E2] rounded">B</button>
                          <button className="px-3 py-1 text-sm font-medium hover:bg-[#EFE7E2] rounded">I</button>
                          <button className="px-3 py-1 text-sm font-medium hover:bg-[#EFE7E2] rounded">U</button>
                          <div className="w-px h-6 bg-[#C1B1A8] mx-2"></div>
                          <button className="px-3 py-1 text-sm font-medium hover:bg-[#EFE7E2] rounded">📋</button>
                          <button className="px-3 py-1 text-sm font-medium hover:bg-[#EFE7E2] rounded">🔗</button>
                        </div>
                        <textarea
                          className={`w-full px-4 py-3 border-none text-base focus:outline-none resize-none min-h-[200px] ${
                            validationErrors.description ? 'border-red-500' : ''
                          }`}
                          placeholder="Describe your service in detail. Include what makes you unique, your process, and what buyers can expect."
                          value={formData.description}
                          onChange={(e) => {
                            setFormData(prev => ({...prev, description: e.target.value}));
                            clearError("description");
                          }}
                          maxLength={1200}
                        />
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <InputError error={validationErrors.description} />
                        <div className="text-xs text-[#7A5A4C]">
                          {formData.description.length}/1200 characters
                        </div>
                      </div>
                      <div className="text-sm text-[#7A5A4C] mt-2">
                        💡 Use bullet points (•), bold text, and line breaks to make your description easy to read.
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-[#2E2322] mb-4">Frequently Asked Questions</h3>
                      <div className="space-y-4">
                        {formData.faqs.map((faq, index) => (
                          <div key={faq.id} className="border border-[#E7E1DE] rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-sm font-semibold text-[#2E2322]">FAQ {index + 1}</h4>
                              {formData.faqs.length > 1 && (
                                <button 
                                  onClick={() => removeFAQ(faq.id)}
                                  className="text-red-600 hover:text-red-700 text-sm font-semibold"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                            
                            <div className="space-y-4">
                              <div data-error={`faq_${index}_question`}>
                                <label className="block text-sm font-medium text-[#4A312F] mb-2">
                                  Question <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                    validationErrors[`faq_${index}_question`] ? 'border-red-500' : 'border-[#E7E1DE]'
                                  }`}
                                  placeholder="What do you need to get started?"
                                  value={faq.question}
                                  onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                                />
                                <InputError error={validationErrors[`faq_${index}_question`]} />
                              </div>
                              
                              <div data-error={`faq_${index}_answer`}>
                                <label className="block text-sm font-medium text-[#4A312F] mb-2">
                                  Answer <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                    validationErrors[`faq_${index}_answer`] ? 'border-red-500' : 'border-[#E7E1DE]'
                                  }`}
                                  rows="3"
                                  placeholder="Provide a clear and helpful answer..."
                                  value={faq.answer}
                                  onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                                />
                                <InputError error={validationErrors[`faq_${index}_answer`]} />
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <button 
                          onClick={addFAQ}
                          className="w-full py-3 border-2 border-dashed border-[#E7E1DE] rounded-lg text-sm font-semibold text-[#6B5B50] hover:border-green-500 hover:text-green-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <Plus size={16} /> Add FAQ
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-xl font-bold text-[#2E2322] mb-2">Requirements Form</h2>
                      <p className="text-[#6B5B50]">Ask buyers for information you need to start working</p>
                    </div>

                    <div className="space-y-6">
                      {formData.requirements.map((req, index) => (
                        <div key={req.id} className="border border-[#E7E1DE] rounded-xl p-6">
                          <div className="flex items-center justify-between mb-6">
                            <div>
                              <h4 className="text-sm font-semibold text-[#2E2322]">Question {index + 1}</h4>
                              <p className="text-xs text-[#7A5A4C]">Buyers will see this when placing an order</p>
                            </div>
                            {formData.requirements.length > 1 && (
                              <button 
                                onClick={() => removeRequirement(req.id)}
                                className="text-red-600 hover:text-red-700 text-sm font-semibold"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          
                          <div className="space-y-4">
                            <div data-error={`req_${index}_question`}>
                              <label className="block text-sm font-medium text-[#4A312F] mb-2">
                                Question Text <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                  validationErrors[`req_${index}_question`] ? 'border-red-500' : 'border-[#E7E1DE]'
                                }`}
                                placeholder="e.g., What is your brand name?"
                                value={req.question}
                                onChange={(e) => updateRequirement(index, 'question', e.target.value)}
                              />
                              <InputError error={validationErrors[`req_${index}_question`]} />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-medium text-[#4A312F] mb-2">
                                  Answer Type
                                </label>
                                <select 
                                  className="w-full px-4 py-3 border border-[#E7E1DE] rounded-lg text-sm"
                                  value={req.type}
                                  onChange={(e) => updateRequirement(index, 'type', e.target.value)}
                                >
                                  <option value="text">Text</option>
                                  <option value="multiple">Multiple Choice</option>
                                  <option value="file">File Attachment</option>
                                  <option value="yesno">Yes/No</option>
                                </select>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-[#4A312F] mb-2">
                                  Placeholder Text
                                </label>
                                <input
                                  type="text"
                                  className="w-full px-4 py-3 border border-[#E7E1DE] rounded-lg text-sm"
                                  placeholder="Optional placeholder text"
                                  value={req.placeholder}
                                  onChange={(e) => updateRequirement(index, 'placeholder', e.target.value)}
                                />
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-[#E7E1DE]">
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={req.required}
                                  onChange={(e) => updateRequirement(index, 'required', e.target.checked)}
                                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                />
                                <span className="text-sm font-medium text-[#4A312F]">Required field</span>
                              </label>
                              
                              {req.required && (
                                <span className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded">
                                  Buyer must answer this
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <button 
                        onClick={addRequirement}
                        className="w-full py-4 border-2 border-dashed border-[#E7E1DE] rounded-xl text-sm font-semibold text-[#6B5B50] hover:border-green-500 hover:text-green-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus size={20} /> Add Another Question
                      </button>
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-xl font-bold text-[#2E2322] mb-2">Media Gallery</h2>
                      <p className="text-[#6B5B50]">Showcase your work with images and videos</p>
                    </div>

                    <div data-error="images">
                      {/* Upload Area */}
                      <div className="border-2 border-dashed border-[#E7E1DE] rounded-2xl p-12 text-center hover:border-green-500 transition-colors group cursor-pointer">
                        <input
                          type="file"
                          multiple
                          accept="image/*,video/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="media-upload"
                        />
                        <label htmlFor="media-upload" className="cursor-pointer">
                          <div className="w-20 h-20 bg-gradient-to-br from-green-50 to-[#F8F4F1] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:from-green-100 group-hover:to-[#F4C7A1] transition-colors">
                            <Upload size={32} className="text-[#A38F85] group-hover:text-green-500" />
                          </div>
                          <h3 className="text-xl font-bold text-[#2E2322] mb-2">Drag & drop files here</h3>
                          <p className="text-[#7A5A4C] mb-6">or click to browse (max 10 files, 5MB each)</p>
                          <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button className="px-8 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors shadow-sm">
                              Browse Files
                            </button>
                            <button className="px-8 py-3 border border-[#E7E1DE] text-[#4A312F] rounded-lg font-semibold hover:bg-[#F8F4F1] transition-colors">
                              Sample Images
                            </button>
                          </div>
                        </label>
                      </div>
                      <InputError error={validationErrors.images} />
                      
                      {/* Requirements */}
                      <div className="mt-4 p-4 bg-[#FDECE7] border border-[#F4C7A1] rounded-lg">
                        <h4 className="font-medium text-[#2E2322] mb-2 flex items-center gap-2">
                          <Info size={16} className="text-[#C9452F]" />
                          Media Requirements
                        </h4>
                        <ul className="text-sm text-[#6B5B50] space-y-1">
                          <li>• Minimum 3 images required (recommended: 5-7)</li>
                          <li>• First image will be the gig thumbnail</li>
                          <li>• Supported formats: JPG, PNG, GIF, MP4</li>
                          <li>• Maximum file size: 5MB each</li>
                          <li>• Recommended dimensions: 1280×769 pixels</li>
                        </ul>
                      </div>

                      {/* Media Preview Grid */}
                      {formData.images.length > 0 && (
                        <div className="mt-8">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-[#2E2322]">Uploaded Media ({formData.images.length}/10)</h3>
                            <button 
                              onClick={() => {
                                const newImages = [...formData.images];
                                newImages.sort((a, b) => a.name.localeCompare(b.name));
                                setFormData(prev => ({ ...prev, images: newImages }));
                              }}
                              className="text-sm text-[#6B5B50] hover:text-[#2E2322]"
                            >
                              Sort by name
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {formData.images.map((media, index) => (
                              <div key={media.id} className="relative group">
                                <div className="aspect-square rounded-lg overflow-hidden bg-[#F3E9E5] border border-[#E7E1DE]">
                                  {media.type === 'image' ? (
                                    <img 
                                      src={media.preview} 
                                      alt="Preview" 
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-[#2E2322]">
                                      <FileVideo size={32} className="text-white" />
                                    </div>
                                  )}
                                </div>
                                
                                {index === 0 && (
                                  <div className="absolute top-2 left-2">
                                    <span className="text-xs font-medium bg-green-500 text-white px-2 py-1 rounded">
                                      Thumbnail
                                    </span>
                                  </div>
                                )}
                                
                                <button
                                  onClick={() => removeMedia(media.id)}
                                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X size={16} />
                                </button>
                                
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                  <div className="text-xs text-white truncate">{media.name}</div>
                                  <div className="text-xs text-white/80">
                                    {(media.size / 1024 / 1024).toFixed(2)} MB
                                  </div>
                                </div>
                                
                                <button
                                  onClick={() => {
                                    // Move to first position
                                    const newImages = [...formData.images];
                                    const [moved] = newImages.splice(index, 1);
                                    newImages.unshift(moved);
                                    setFormData(prev => ({ ...prev, images: newImages }));
                                  }}
                                  className="absolute bottom-2 right-2 text-xs text-white bg-black/50 hover:bg-black/70 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  Set as thumbnail
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Video Embed */}
                      <div className="mt-8 border border-[#E7E1DE] rounded-xl p-6">
                        <h3 className="text-lg font-bold text-[#2E2322] mb-4 flex items-center gap-2">
                          <Video size={20} />
                          Embed Video (Optional)
                        </h3>
                        <div className="space-y-3">
                          <p className="text-sm text-[#6B5B50]">
                            Add a video from YouTube, Vimeo, or upload directly
                          </p>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <input
                              type="url"
                              placeholder="YouTube or Vimeo URL"
                              className="flex-1 px-4 py-3 border border-[#E7E1DE] rounded-lg"
                            />
                            <button className="px-6 py-3 bg-[#2E2322] text-white rounded-lg font-semibold hover:bg-[#3A2C2B] whitespace-nowrap">
                              Embed Video
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 6 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-xl font-bold text-[#2E2322] mb-2">Publish Settings</h2>
                      <p className="text-[#6B5B50]">Review your gig and configure visibility settings</p>
                    </div>

                    {/* Gig Summary */}
                    <div className="border border-[#E7E1DE] rounded-xl p-6">
                      <h3 className="text-lg font-bold text-[#2E2322] mb-4">Gig Summary</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <div className="text-sm text-[#7A5A4C] mb-1">Title</div>
                            <div className="font-medium">{formData.title || "Not set"}</div>
                          </div>
                          <div>
                            <div className="text-sm text-[#7A5A4C] mb-1">Category</div>
                            <div className="font-medium">
                              {formData.category ? categories[formData.category]?.name : "Not set"}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-[#7A5A4C] mb-1">Tags</div>
                            <div className="font-medium">
                              {formData.tags.length > 0 ? formData.tags.join(", ") : "Not set"}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-[#7A5A4C] mb-1">Images</div>
                            <div className="font-medium">{formData.images.length} uploaded</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SEO Settings */}
                    <div className="border border-[#E7E1DE] rounded-xl p-6">
                      <h3 className="text-lg font-bold text-[#2E2322] mb-4">SEO Settings (Optional)</h3>
                      <div className="space-y-4">
                        <div data-error="metaTitle">
                          <label className="block text-sm font-medium text-[#4A312F] mb-2">
                            SEO Title
                          </label>
                          <input
                            type="text"
                            className={`w-full px-4 py-3 border rounded-lg text-base ${
                              validationErrors.metaTitle ? 'border-red-500' : 'border-[#E7E1DE]'
                            }`}
                            placeholder="Optimized title for search engines"
                            value={formData.seo.metaTitle}
                            onChange={(e) => {
                              setFormData(prev => ({
                                ...prev,
                                seo: { ...prev.seo, metaTitle: e.target.value }
                              }));
                              clearError("metaTitle");
                            }}
                            maxLength={60}
                          />
                          <div className="flex justify-between mt-1">
                            <InputError error={validationErrors.metaTitle} />
                            <div className="text-xs text-[#7A5A4C]">
                              {formData.seo.metaTitle.length}/60 characters
                            </div>
                          </div>
                        </div>

                        <div data-error="metaDescription">
                          <label className="block text-sm font-medium text-[#4A312F] mb-2">
                            SEO Description
                          </label>
                          <textarea
                            className={`w-full px-4 py-3 border rounded-lg text-base ${
                              validationErrors.metaDescription ? 'border-red-500' : 'border-[#E7E1DE]'
                            }`}
                            rows="3"
                            placeholder="Meta description for search engines"
                            value={formData.seo.metaDescription}
                            onChange={(e) => {
                              setFormData(prev => ({
                                ...prev,
                                seo: { ...prev.seo, metaDescription: e.target.value }
                              }));
                              clearError("metaDescription");
                            }}
                            maxLength={160}
                          />
                          <div className="flex justify-between mt-1">
                            <InputError error={validationErrors.metaDescription} />
                            <div className="text-xs text-[#7A5A4C]">
                              {formData.seo.metaDescription.length}/160 characters
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Visibility Settings */}
                    <div className="border border-[#E7E1DE] rounded-xl p-6">
                      <h3 className="text-lg font-bold text-[#2E2322] mb-4">Visibility Settings</h3>
                      <div className="space-y-4">
                        <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                          formData.visibility === "public" ? "border-green-500 ring-2 ring-green-500/20" : "border-[#E7E1DE] hover:border-[#E7E1DE]"
                        }`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              formData.visibility === "public" ? "bg-green-100" : "bg-[#F3E9E5]"
                            }`}>
                              <Globe size={20} className={formData.visibility === "public" ? "text-green-600" : "text-[#A38F85]"} />
                            </div>
                            <div>
                              <div className="font-semibold text-[#2E2322]">Public</div>
                              <div className="text-sm text-[#7A5A4C]">Visible to everyone on Fiverr</div>
                            </div>
                          </div>
                          <input
                            type="radio"
                            name="visibility"
                            className="w-5 h-5 text-green-600"
                            checked={formData.visibility === "public"}
                            onChange={() => setFormData(prev => ({ ...prev, visibility: "public" }))}
                          />
                        </label>

                        <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                          formData.visibility === "private" ? "border-green-500 ring-2 ring-green-500/20" : "border-[#E7E1DE] hover:border-[#E7E1DE]"
                        }`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              formData.visibility === "private" ? "bg-green-100" : "bg-[#F3E9E5]"
                            }`}>
                              <Lock size={20} className={formData.visibility === "private" ? "text-green-600" : "text-[#A38F85]"} />
                            </div>
                            <div>
                              <div className="font-semibold text-[#2E2322]">Private</div>
                              <div className="text-sm text-[#7A5A4C]">Only visible via direct link</div>
                            </div>
                          </div>
                          <input
                            type="radio"
                            name="visibility"
                            className="w-5 h-5 text-green-600"
                            checked={formData.visibility === "private"}
                            onChange={() => setFormData(prev => ({ ...prev, visibility: "private" }))}
                          />
                        </label>

                        <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                          formData.visibility === "scheduled" ? "border-green-500 ring-2 ring-green-500/20" : "border-[#E7E1DE] hover:border-[#E7E1DE]"
                        }`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              formData.visibility === "scheduled" ? "bg-green-100" : "bg-[#F3E9E5]"
                            }`}>
                              <Calendar size={20} className={formData.visibility === "scheduled" ? "text-green-600" : "text-[#A38F85]"} />
                            </div>
                            <div>
                              <div className="font-semibold text-[#2E2322]">Scheduled</div>
                              <div className="text-sm text-[#7A5A4C]">Publish at specific date/time</div>
                            </div>
                          </div>
                          <input
                            type="radio"
                            name="visibility"
                            className="w-5 h-5 text-green-600"
                            checked={formData.visibility === "scheduled"}
                            onChange={() => setFormData(prev => ({ ...prev, visibility: "scheduled" }))}
                          />
                        </label>

                        {formData.visibility === "scheduled" && (
                          <div data-error="publishDate" className="pl-14">
                            <label className="block text-sm font-medium text-[#4A312F] mb-2">
                              Publish Date & Time
                            </label>
                            <input
                              type="datetime-local"
                              className={`w-full px-4 py-3 border rounded-lg text-base ${
                                validationErrors.publishDate ? 'border-red-500' : 'border-[#E7E1DE]'
                              }`}
                              value={formData.publishDate}
                              onChange={(e) => {
                                setFormData(prev => ({ ...prev, publishDate: e.target.value }));
                                clearError("publishDate");
                              }}
                              min={new Date().toISOString().slice(0, 16)}
                            />
                            <InputError error={validationErrors.publishDate} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Terms & Conditions */}
                    <div className="border border-[#E7E1DE] rounded-xl p-6">
                      <h3 className="text-lg font-bold text-[#2E2322] mb-4">Terms & Conditions</h3>
                      <div className="space-y-4">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-5 h-5 text-green-600 rounded focus:ring-green-500 mt-0.5"
                            required
                          />
                          <div>
                            <div className="font-medium text-[#2E2322]">
                              I agree to Fiverr's Terms of Service
                            </div>
                            <div className="text-sm text-[#6B5B50] mt-1">
                              By publishing this gig, you agree to comply with Fiverr's community standards and terms of service.
                            </div>
                          </div>
                        </label>
                        
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-5 h-5 text-green-600 rounded focus:ring-green-500 mt-0.5"
                            required
                          />
                          <div>
                            <div className="font-medium text-[#2E2322]">
                              I confirm that this service complies with Fiverr's policies
                            </div>
                            <div className="text-sm text-[#6B5B50] mt-1">
                              Your gig must not violate any of Fiverr's policies including intellectual property rights.
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Footer */}
              <div className="border-t border-[#E7E1DE] px-6 sm:px-8 py-6 bg-[#F8F4F1]">
                <div className="flex items-center justify-between">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                      currentStep === 1
                        ? 'opacity-0 pointer-events-none'
                        : 'text-[#4A312F] hover:bg-[#EFE7E2] hover:text-[#2E2322]'
                    }`}
                  >
                    <ChevronLeft size={18} /> Previous
                  </button>

                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => {
                        localStorage.setItem('gigDraft', JSON.stringify(formData));
                        alert('Draft saved successfully!');
                      }}
                      className="px-6 py-3 text-[#4A312F] hover:bg-[#EFE7E2] rounded-lg font-semibold text-sm transition-colors hidden sm:block"
                    >
                      Save as Draft
                    </button>
                    
                    <button
                      onClick={nextStep}
                      disabled={submitting}
                      className="px-8 py-3 bg-green-500 text-white rounded-lg font-semibold text-sm hover:bg-green-600 transition-all flex items-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Publishing...
                        </>
                      ) : currentStep === steps.length ? (
                        <>
                          <Rocket size={18} />
                          Publish Gig
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
                
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-[#7A5A4C]">
                  <Shield size={14} />
                  Your information is secure and encrypted
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[#E7E1DE] p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#2E2322]">Gig Preview</h2>
              <button 
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-[#F3E9E5] rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-8">
                {/* Gig Header */}
                <div>
                  <h1 className="text-3xl font-bold text-[#2E2322] mb-4">
                    {formData.title || "Your Gig Title"}
                  </h1>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {formData.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-[#F3E9E5] text-[#4A312F] rounded-full text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  {formData.images.length > 0 && (
                    <div className="aspect-video rounded-xl overflow-hidden bg-[#F3E9E5] mb-6">
                      <img 
                        src={formData.images[0]?.preview} 
                        alt="Gig thumbnail" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                
                {/* Packages */}
                <div>
                  <h2 className="text-2xl font-bold text-[#2E2322] mb-6">Packages</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {formData.packages.filter(p => p.enabled).map(pkg => (
                      <div 
                        key={pkg.id} 
                        className={`border rounded-xl p-6 relative ${
                          pkg.popular ? 'border-green-500 ring-1 ring-green-500' : 'border-[#E7E1DE]'
                        }`}
                      >
                        {pkg.popular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                              MOST POPULAR
                            </span>
                          </div>
                        )}
                        
                        <h3 className="font-bold text-[#2E2322] text-lg mb-2">{pkg.name}</h3>
                        <p className="text-[#6B5B50] text-sm mb-4">{pkg.description}</p>
                        
                        <div className="text-3xl font-bold text-[#2E2322] mb-6">
                          ${pkg.price}
                        </div>
                        
                        <ul className="space-y-2 mb-6">
                          <li className="text-[#6B5B50]">✓ {pkg.deliveryTime} {pkg.deliveryUnit} delivery</li>
                          <li className="text-[#6B5B50]">✓ {pkg.revisions === 999 ? "Unlimited" : pkg.revisions} revisions</li>
                          {pkg.features.map((feature, idx) => (
                            <li key={idx} className="text-[#6B5B50]">✓ {feature}</li>
                          ))}
                        </ul>
                        
                        <button className="w-full py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600">
                          Continue (${pkg.price})
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Description */}
                <div>
                  <h2 className="text-2xl font-bold text-[#2E2322] mb-4">About This Gig</h2>
                  <div className="prose max-w-none">
                    {formData.description.split('\n').map((para, idx) => (
                      <p key={idx} className="text-[#4A312F] mb-4">{para}</p>
                    ))}
                  </div>
                </div>
                
                {/* FAQs */}
                {formData.faqs.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-[#2E2322] mb-4">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                      {formData.faqs.map(faq => (
                        <div key={faq.id} className="border border-[#E7E1DE] rounded-lg p-6">
                          <h3 className="font-semibold text-[#2E2322] mb-2">{faq.question}</h3>
                          <p className="text-[#6B5B50]">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

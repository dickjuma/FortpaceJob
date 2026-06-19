// src/pages/freelancer/CreateGigWizardPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers, FileText, DollarSign, Image as ImageIcon,
  Settings, CheckCircle2, ArrowRight, ArrowLeft,
  Plus, Check, X, UploadCloud, Trash2, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCreateGig } from '../services/freelancerHooks';

const WIZARD_STEPS = [
  { id: 'overview', title: 'Overview', icon: FileText },
  { id: 'pricing', title: 'Pricing', icon: DollarSign },
  { id: 'description', title: 'Description', icon: Layers },
  { id: 'gallery', title: 'Gallery', icon: ImageIcon },
  { id: 'publish', title: 'Publish', icon: Settings }
];

const CATEGORY_MAP = {
  web: ['Frontend Web Development', 'Backend REST APIs', 'Fullstack Frameworks', 'WordPress & CMS'],
  design: ['UI/UX App Design', 'Brand Logo & Kit Design', 'Vector Illustration', 'Marketing Graphics'],
  marketing: ['Search Engine Optimization', 'Social Media Management', 'Paid Ads Campaign', 'Copywriting & Content']
};

export default function CreateGigWizardPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(null);
  const navigate = useNavigate();
  const createGigMutation = useCreateGig();

  // Step 1: Overview States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(['React', 'Next.js', 'Frontend']);

  // Step 2: Scope & Pricing States
  const [packages, setPackages] = useState({
    Basic: { title: 'Essential Setup', delivery: '3', price: '5000' },
    Standard: { title: 'Professional Core', delivery: '5', price: '15000' },
    Premium: { title: 'Enterprise Suite', delivery: '7', price: '30000' }
  });

  // Step 3: Description State
  const [description, setDescription] = useState('');

  // Step 4: Gallery States
  const [galleryImages, setGalleryImages] = useState([]);

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const cleaned = tagInput.trim().replace(/,/g, '');
      if (cleaned && !tags.includes(cleaned) && tags.length < 5) {
        setTags([...tags, cleaned]);
        setTagInput('');
      } else if (tags.length >= 5) {
        setShowSuccess({ message: 'Maximum 5 search tags allowed', isError: true });
        setTimeout(() => setShowSuccess(null), 2000);
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handlePackageChange = (tier, field, val) => {
    setPackages(prev => ({
      ...prev,
      [tier]: { ...prev[tier], [field]: val }
    }));
  };

  const handleUploadImage = () => {
    if (galleryImages.length >= 3) {
      setShowSuccess({ message: 'Maximum 3 images allowed', isError: true });
      setTimeout(() => setShowSuccess(null), 2000);
      return;
    }
    // Simulate upload - in real app, this would be a file picker
    const mockImage = `https://picsum.photos/400/250?random=${Date.now() + galleryImages.length}`;
    setGalleryImages([...galleryImages, mockImage]);
    setShowSuccess({ message: 'Image uploaded successfully' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const handleRemoveImage = (index) => {
    setGalleryImages(galleryImages.filter((_, idx) => idx !== index));
  };

  const validateStep = () => {
    if (currentStep === 0) {
      if (!title || title.trim().length < 15) {
        setShowSuccess({ message: 'Title must be at least 15 characters', isError: true });
        setTimeout(() => setShowSuccess(null), 2000);
        return false;
      }
      if (!category) {
        setShowSuccess({ message: 'Please select a category', isError: true });
        setTimeout(() => setShowSuccess(null), 2000);
        return false;
      }
      if (!subcategory) {
        setShowSuccess({ message: 'Please select a subcategory', isError: true });
        setTimeout(() => setShowSuccess(null), 2000);
        return false;
      }
    }
    if (currentStep === 1) {
      const basicPrice = parseFloat(packages.Basic.price);
      const standardPrice = parseFloat(packages.Standard.price);
      const premiumPrice = parseFloat(packages.Premium.price);
      if (isNaN(basicPrice) || basicPrice <= 0 || isNaN(standardPrice) || standardPrice <= 0 || isNaN(premiumPrice) || premiumPrice <= 0) {
        setShowSuccess({ message: 'Please enter valid prices for all packages', isError: true });
        setTimeout(() => setShowSuccess(null), 2000);
        return false;
      }
    }
    if (currentStep === 2) {
      if (!description || description.trim().length < 50) {
        setShowSuccess({ message: 'Description must be at least 50 characters', isError: true });
        setTimeout(() => setShowSuccess(null), 2000);
        return false;
      }
    }
    if (currentStep === 3) {
      if (galleryImages.length === 0) {
        setShowSuccess({ message: 'Please upload at least one image', isError: true });
        setTimeout(() => setShowSuccess(null), 2000);
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(curr => curr + 1);
      window.scrollTo(0, 0);
    } else {
      const gigData = {
        title,
        category,
        description,
        price: parseFloat(packages.Basic.price),
        deliveryTime: parseInt(packages.Basic.delivery, 10),
        packages: {
          create: Object.entries(packages).map(([tier, pkg]) => ({
            name: tier,
            description: pkg.title,
            price: parseFloat(pkg.price),
            deliveryTime: parseInt(pkg.delivery, 10),
            revisions: 1,
            features: {}
          }))
        },
        gallery: {
          create: galleryImages.map(img => ({ url: img }))
        }
      };

      createGigMutation.mutate(gigData, {
        onSuccess: () => {
          setShowSuccess({ message: 'Gig published successfully!' });
          setTimeout(() => {
            setShowSuccess(null);
            navigate('/freelancer/gigs');
          }, 1500);
        },
        onError: (err) => {
          setShowSuccess({ message: err.message || 'Failed to publish gig', isError: true });
          setTimeout(() => setShowSuccess(null), 3000);
        }
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Success/Error Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-md font-body text-sm flex items-center gap-2 ${
              showSuccess.isError ? 'bg-danger text-white' : 'bg-accent-dark text-white'
            }`}
          >
            <Check className="w-4 h-4" />
            {showSuccess.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-4xl text-brand-900">Create a new service</h1>
        <p className="text-sm text-ink-secondary font-body mt-2 max-w-2xl">
          Offer your expertise to clients worldwide. A great service title and clear pricing leads to more sales.
        </p>
      </div>

      {/* Stepper Progress */}
      <div className="bg-white border border-border rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 z-0 hidden sm:block">
            <motion.div
              className="h-full bg-accent DEFAULT transition-all duration-500"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / (WIZARD_STEPS.length - 1)) * 100}%` }}
            />
          </div>

          {WIZARD_STEPS.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const StepIcon = step.icon;

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    isActive ? "bg-accent DEFAULT border-accent DEFAULT text-white shadow-md" :
                    isCompleted ? "bg-accent DEFAULT border-accent DEFAULT text-white" :
                    "bg-white border-border text-ink-tertiary"
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : <StepIcon className="w-4 h-4" />}
                </motion.div>
                <span className={`text-xs font-body font-medium hidden sm:block ${
                  isActive ? "text-accent DEFAULT" :
                  isCompleted ? "text-ink-primary" :
                  "text-ink-tertiary"
                }`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wizard Content Area */}
      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-8 min-h-[500px]">
          <AnimatePresence mode="wait">
            {/* Step 1: Overview */}
            {currentStep === 0 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="font-display font-semibold text-xl text-brand-900">Service overview</h2>

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-xs font-body font-medium text-ink-secondary uppercase tracking-wide">
                      Service title
                    </label>
                    <span className="text-xs font-mono text-ink-tertiary">{title.length} / 80</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-4 font-body font-medium text-ink-tertiary text-base">
                      I will
                    </span>
                    <textarea
                      value={title}
                      onChange={(e) => setTitle(e.target.value.substring(0, 80))}
                      className="w-full pl-20 pr-4 py-3 bg-white border border-border rounded-lg text-base font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent resize-none h-24"
                      placeholder="design a high-converting landing page for your brand"
                    />
                  </div>
                  <p className="text-xs text-ink-tertiary font-body mt-1">
                    Keep it short, direct, and keyword-rich
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-body font-medium text-ink-secondary uppercase tracking-wide mb-2">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setSubcategory('');
                      }}
                      className="w-full h-11 px-4 rounded-lg border border-border bg-white text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900"
                    >
                      <option value="">Select category</option>
                      <option value="web">Programming & Tech</option>
                      <option value="design">Graphics & Design</option>
                      <option value="marketing">Digital Marketing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-body font-medium text-ink-secondary uppercase tracking-wide mb-2">
                      Subcategory
                    </label>
                    <select
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      disabled={!category}
                      className="w-full h-11 px-4 rounded-lg border border-border bg-white text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select subcategory</option>
                      {category && CATEGORY_MAP[category]?.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-body font-medium text-ink-secondary uppercase tracking-wide mb-2">
                    Search tags (press Enter or comma to add)
                  </label>
                  <div className="w-full p-2 bg-white border border-border rounded-lg flex flex-wrap gap-2 items-center min-h-[48px]">
                    {tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 bg-brand-900 text-white text-xs font-body font-medium rounded-md flex items-center gap-1.5">
                        {tag}
                        <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-danger transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      className="flex-1 min-w-[120px] bg-transparent p-1 text-sm font-body outline-none"
                      placeholder={tags.length < 5 ? "Add tag..." : "Max tags reached"}
                      disabled={tags.length >= 5}
                    />
                  </div>
                  <p className="text-xs text-ink-tertiary font-body mt-1">
                    {tags.length}/5 tags - helps clients find your service
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 2: Pricing */}
            {currentStep === 1 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="font-display font-semibold text-xl text-brand-900">Scope & pricing</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {['Basic', 'Standard', 'Premium'].map((tier, idx) => (
                    <div
                      key={tier}
                      className={`p-5 rounded-xl border-2 transition-all ${
                        idx === 1
                          ? "border-accent DEFAULT bg-accent-light relative"
                          : "border-border bg-white"
                      }`}
                    >
                      {idx === 1 && (
                        <span className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 bg-accent DEFAULT text-white text-xs font-body font-medium px-3 py-0.5 rounded-full">
                          Recommended
                        </span>
                      )}
                      <h3 className="font-body font-semibold text-lg text-ink-primary mb-4">{tier}</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-body font-medium text-ink-secondary mb-1">
                            Package title
                          </label>
                          <input
                            type="text"
                            value={packages[tier].title}
                            onChange={(e) => handlePackageChange(tier, 'title', e.target.value)}
                            className="w-full h-10 px-3 rounded-lg border border-border bg-white text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-body font-medium text-ink-secondary mb-1">
                            Delivery (days)
                          </label>
                          <input
                            type="number"
                            value={packages[tier].delivery}
                            onChange={(e) => handlePackageChange(tier, 'delivery', e.target.value)}
                            className="w-full h-10 px-3 rounded-lg border border-border bg-white text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-body font-medium text-ink-secondary mb-1">
                            Price (KES)
                          </label>
                          <input
                            type="number"
                            value={packages[tier].price}
                            onChange={(e) => handlePackageChange(tier, 'price', e.target.value)}
                            className="w-full h-10 px-3 rounded-lg border border-border bg-white text-ink-primary text-sm font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-brand-900"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Description */}
            {currentStep === 2 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="font-display font-semibold text-xl text-brand-900">Description</h2>

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-xs font-body font-medium text-ink-secondary uppercase tracking-wide">
                      Service description
                    </label>
                    <span className="text-xs font-mono text-ink-tertiary">{description.length} / 500 minimum</span>
                  </div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-border rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent h-64 resize-none"
                    placeholder="Describe what you are offering in detail. Highlight your experience, tech stack, and what the client will receive..."
                  />
                  <p className="text-xs text-ink-tertiary font-body mt-1">
                    {description.length >= 500 ? "✓ Good length" : "Be detailed to help clients understand your value"}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 4: Gallery */}
            {currentStep === 3 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="font-display font-semibold text-xl text-brand-900">Showcase your work</h2>
                    <p className="text-sm text-ink-secondary font-body mt-1">Upload images showing your past deliveries</p>
                  </div>
                  <span className="text-xs font-mono font-medium text-ink-tertiary">{galleryImages.length} / 3 images</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {galleryImages.map((img, idx) => (
                    <div key={idx} className="aspect-video relative rounded-xl overflow-hidden border border-border shadow-sm group">
                      <img src={img} alt={`Showcase ${idx + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="p-2 bg-danger rounded-full text-white hover:scale-110 transition-transform"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {galleryImages.length < 3 && (
                    <div
                      onClick={handleUploadImage}
                      className="aspect-video bg-surface-muted border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-accent DEFAULT hover:bg-accent-light transition-all group"
                    >
                      <UploadCloud className="w-8 h-8 text-ink-tertiary group-hover:text-accent DEFAULT mb-2" />
                      <span className="text-xs font-body font-medium text-ink-tertiary group-hover:text-accent DEFAULT">
                        Upload image
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 5: Publish */}
            {currentStep === 4 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-accent DEFAULT" />
                  </div>
                  <h2 className="font-display font-bold text-2xl text-brand-900">Review & publish</h2>
                  <p className="text-ink-secondary text-sm max-w-md mx-auto mt-2">
                    Your service is ready to launch on the marketplace
                  </p>
                </div>

                <div className="border border-border rounded-xl p-6 bg-surface-soft">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs font-body font-medium text-ink-secondary uppercase tracking-wide block">
                          Service title
                        </span>
                        <p className="text-sm font-body text-ink-primary mt-1">I will {title}</p>
                      </div>
                      <div className="flex gap-4">
                        <div>
                          <span className="text-xs font-body font-medium text-ink-secondary uppercase tracking-wide block">
                            Category
                          </span>
                          <p className="text-xs font-body text-ink-primary mt-1">
                            {category === 'web' ? 'Programming & Tech' : category === 'design' ? 'Graphics & Design' : 'Digital Marketing'}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs font-body font-medium text-ink-secondary uppercase tracking-wide block">
                            Subcategory
                          </span>
                          <p className="text-xs font-body text-ink-primary mt-1">{subcategory}</p>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-body font-medium text-ink-secondary uppercase tracking-wide block">
                          Search tags
                        </span>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {tags.map(t => (
                            <span key={t} className="px-2 py-0.5 bg-brand-900/10 text-brand-900 text-xs font-body font-medium rounded">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                      <span className="text-xs font-body font-medium text-ink-secondary uppercase tracking-wide block mb-3">
                        Pricing packages
                      </span>
                      <div className="space-y-2">
                        {Object.keys(packages).map(tier => (
                          <div key={tier} className="flex justify-between items-center text-xs pb-2">
                            <div>
                              <p className="font-body font-medium text-ink-primary">{tier}: {packages[tier].title}</p>
                              <p className="text-ink-tertiary">{packages[tier].delivery} day delivery</p>
                            </div>
                            <span className="font-mono font-semibold text-ink-primary">
                              KES {parseFloat(packages[tier].price).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Controls */}
        <div className="p-6 border-t border-border bg-surface-soft flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={currentStep === 0 || loading}
            className={`px-5 py-2.5 rounded-lg font-body font-medium text-sm transition-colors inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-900 ${
              currentStep === 0
                ? 'opacity-0 pointer-events-none'
                : 'border border-border text-ink-primary hover:bg-white'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={createGigMutation.isPending}
            className={`px-5 py-2.5 rounded-lg font-body font-medium text-sm transition-colors inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              currentStep === WIZARD_STEPS.length - 1
                ? 'bg-accent DEFAULT text-white hover:bg-accent-dark focus:ring-accent DEFAULT'
                : 'bg-brand-900 text-white hover:bg-brand-800 focus:ring-brand-900'
            } ${createGigMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {createGigMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                {currentStep === WIZARD_STEPS.length - 1 ? 'Publish gig' : 'Save & continue'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

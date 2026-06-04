import React, { useState } from 'react';
import { 
  Layers, 
  FileText, 
  DollarSign, 
  Image as ImageIcon, 
  Settings, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Plus, 
  Check, 
  X, 
  UploadCloud, 
  Trash2, 
  AlertCircle 
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { gigAPI } from '../../common/services/api';

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
  const navigate = useNavigate();

  // Step 1: Overview States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(['React', 'Next.js', 'Frontend']);

  // Step 2: Scope & Pricing States
  const [packages, setPackages] = useState({
    Basic: { title: 'Essential Setup', delivery: '3', price: '50' },
    Standard: { title: 'Professional Core', delivery: '5', price: '150' },
    Premium: { title: 'Enterprise Suite', delivery: '7', price: '300' }
  });

  // Step 3: Description State
  const [description, setDescription] = useState('');

  // Step 4: Gallery States (Mock uploaded images)
  const [galleryImages, setGalleryImages] = useState([
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=250&fit=crop'
  ]);

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const cleaned = tagInput.trim().replace(/,/g, '');
      if (cleaned && !tags.includes(cleaned) && tags.length < 5) {
        setTags([...tags, cleaned]);
        setTagInput('');
      } else if (tags.length >= 5) {
        toast.error('Maximum 5 search tags allowed.');
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handlePackageChange = (tier, field, val) => {
    setPackages(prev => ({
      ...prev,
      [tier]: {
        ...prev[tier],
        [field]: val
      }
    }));
  };

  const handleMockUpload = () => {
    if (galleryImages.length >= 3) {
      toast.error('Maximum 3 images showcase limit reached.');
      return;
    }
    const mockLinks = [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop',
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&h=250&fit=crop',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&h=250&fit=crop'
    ];
    const randomImg = mockLinks[Math.floor(Math.random() * mockLinks.length)];
    setGalleryImages([...galleryImages, randomImg]);
    toast.success('Image showcase uploaded successfully.');
  };

  const handleRemoveImage = (index) => {
    setGalleryImages(galleryImages.filter((_, idx) => idx !== index));
  };

  const validateStep = () => {
    if (currentStep === 0) {
      if (!title || title.trim().length < 15) {
        toast.error('Please enter a descriptive service title (minimum 15 characters).');
        return false;
      }
      if (!category) {
        toast.error('Please select a service category.');
        return false;
      }
      if (!subcategory) {
        toast.error('Please select a service subcategory.');
        return false;
      }
    }
    if (currentStep === 1) {
      const basicPrice = parseFloat(packages.Basic.price);
      const standardPrice = parseFloat(packages.Standard.price);
      const premiumPrice = parseFloat(packages.Premium.price);
      if (isNaN(basicPrice) || basicPrice <= 0 || isNaN(standardPrice) || standardPrice <= 0 || isNaN(premiumPrice) || premiumPrice <= 0) {
        toast.error('Please input valid positive pricing numbers for all packages.');
        return false;
      }
    }
    if (currentStep === 2) {
      if (!description || description.trim().length < 50) {
        toast.error('Please provide a comprehensive service description (minimum 50 characters).');
        return false;
      }
    }
    if (currentStep === 3) {
      if (galleryImages.length === 0) {
        toast.error('Please upload at least one image in your gallery showcase.');
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
      setLoading(true);
      toast.loading('Publishing your service...', { id: 'publish' });
      const basicPrice = parseFloat(packages.Basic.price);
      gigAPI
        .createGigJson({
          title: title.trim(),
          description: description.trim(),
          price: basicPrice,
          deliveryTime: parseInt(packages.Basic.delivery, 10) || 3,
          revisions: 1,
          category: subcategory || category,
          status: 'ACTIVE',
        })
        .then(() => {
          toast.success('Service published successfully!', { id: 'publish' });
          navigate('/freelancer/gigs');
        })
        .catch((err) => {
          toast.error(err.message || 'Failed to publish gig', { id: 'publish' });
        })
        .finally(() => setLoading(false));
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-text-primary tracking-tight">Create a New Service</h1>
          <p className="text-sm text-text-secondary font-medium mt-2 max-w-2xl">
            Offer your expertise to clients worldwide. A great service title and clear pricing leads to more sales.
          </p>
        </div>
      </div>

      {/* Stepper Progress */}
      <Card className="p-6 bg-white border-border shadow-sm">
        <div className="flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-light-gray -tranzinc-y-1/2 z-0 hidden sm:block">
            <div 
              className="h-full bg-success transition-all duration-500 ease-in-out" 
              style={{ width: `${(currentStep / (WIZARD_STEPS.length - 1)) * 100}%` }}
            ></div>
          </div>
          
          {WIZARD_STEPS.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const StepIcon = step.icon;

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  isActive ? "bg-success border-success text-white scale-110 shadow-lg shadow-[#2bb75c]/20" :
                  isCompleted ? "bg-success border-success text-white" :
                  "bg-white border-border text-text-secondary"
                )}>
                  {isCompleted ? <Check size={18} /> : <StepIcon size={18} />}
                </div>
                <span className={cn(
                  "text-xs font-bold uppercase tracking-widest hidden sm:block",
                  isActive ? "text-success" : 
                  isCompleted ? "text-text-primary" : 
                  "text-text-secondary"
                )}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Wizard Content Area */}
      <Card className="p-0 overflow-hidden bg-white border-border shadow-sm relative">
        <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-success/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="p-8 relative z-10 min-h-[400px]">
          
          {/* Step 1: Overview */}
          {currentStep === 0 && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
              <h2 className="text-xl font-bold text-text-primary">Service Overview</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest">Service Gig Title</label>
                    <span className="text-xs font-bold text-text-secondary">{title.length} / 80 characters</span>
                  </div>
                  <div className="relative flex">
                    <span className="absolute left-4 top-4 font-bold text-lg text-text-secondary select-none">I will</span>
                    <textarea 
                      value={title}
                      onChange={(e) => setTitle(e.target.value.substring(0, 80))}
                      className="w-full pl-16 pr-4 py-3 bg-light-gray/50 border border-border rounded-xl text-lg font-bold focus:outline-none focus:border-[#222222] focus:ring-1 focus:ring-navy transition-all resize-none h-24"
                      placeholder="design a high-converting landing page for your brand"
                    ></textarea>
                  </div>
                  <p className="text-[11px] text-text-secondary font-medium mt-1">Keep it short, direct, and keyword-rich to catch client attention.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Category</label>
                    <select 
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setSubcategory('');
                      }}
                      className="w-full p-3 bg-light-gray/50 border border-border rounded-xl text-sm font-semibold focus:outline-none focus:border-[#222222]"
                    >
                      <option value="">Select Category</option>
                      <option value="web">Programming & Tech</option>
                      <option value="design">Graphics & Design</option>
                      <option value="marketing">Digital Marketing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Subcategory</label>
                    <select 
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      disabled={!category}
                      className="w-full p-3 bg-light-gray/50 border border-border rounded-xl text-sm font-semibold focus:outline-none focus:border-[#222222] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select Subcategory</option>
                      {category && CATEGORY_MAP[category]?.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Search Tags (Press Enter or Comma to add)</label>
                  <div className="w-full p-2 bg-light-gray/50 border border-border rounded-xl flex flex-wrap gap-2 items-center">
                    {tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-[#222222] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all">
                        {tag}
                        <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-[#e63946] transition-colors">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    <input 
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      className="flex-1 min-w-[120px] bg-transparent p-1 text-sm font-semibold outline-none border-none"
                      placeholder={tags.length < 5 ? "Add tag..." : "Max reached"}
                      disabled={tags.length >= 5}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Pricing */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
              <h2 className="text-xl font-bold text-text-primary">Scope & Pricing</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['Basic', 'Standard', 'Premium'].map((tier, idx) => (
                  <div key={tier} className={cn(
                    "p-6 rounded-2xl border transition-all",
                    idx === 1 ? "border-success bg-success/5 shadow-md relative scale-102" : "border-border bg-light-gray/30"
                  )}>
                    {idx === 1 && <span className="absolute -top-3 left-1/2 -tranzinc-x-1/2 bg-success text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Recommended</span>}
                    <h3 className="text-lg font-bold text-text-primary mb-4">{tier} Package</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Package Title</label>
                        <input 
                          type="text" 
                          value={packages[tier].title}
                          onChange={(e) => handlePackageChange(tier, 'title', e.target.value)}
                          className="w-full p-2 bg-white border border-border rounded-lg text-sm font-semibold" 
                          placeholder={`${tier} Tier Package`} 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Delivery Time (Days)</label>
                        <input 
                          type="number" 
                          value={packages[tier].delivery}
                          onChange={(e) => handlePackageChange(tier, 'delivery', e.target.value)}
                          className="w-full p-2 bg-white border border-border rounded-lg text-sm font-semibold" 
                          placeholder="3" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Price (KES)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -tranzinc-y-1/2 font-bold text-text-secondary text-xs">KES</span>
                          <input 
                            type="number" 
                            value={packages[tier].price}
                            onChange={(e) => handlePackageChange(tier, 'price', e.target.value)}
                            className="w-full pl-12 p-2 bg-white border border-border rounded-lg text-sm font-black text-[#222222]" 
                            placeholder="5000" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Description */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
              <h2 className="text-xl font-bold text-text-primary">Description & FAQ</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest">Service Description</label>
                    <span className="text-xs font-bold text-text-secondary">{description.length} / 500 characters min</span>
                  </div>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-4 bg-light-gray/50 border border-border rounded-xl text-sm font-semibold focus:outline-none focus:border-[#222222] focus:ring-1 focus:ring-navy transition-all h-64"
                    placeholder="Describe what you are offering in detail. Highlight your experience, tech stack, and what the client will receive at the end..."
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Gallery */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-xl font-bold text-text-primary">Showcase Your Work</h2>
                  <p className="text-sm text-text-secondary mt-1">Upload files showing your professional credentials or past deliveries.</p>
                </div>
                <span className="text-xs font-bold text-text-secondary">{galleryImages.length} / 3 images uploaded</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {galleryImages.map((img, idx) => (
                  <div key={idx} className="aspect-video relative rounded-2xl overflow-hidden border border-border shadow-sm group">
                    <img src={img} alt="Showcase" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        type="button" 
                        onClick={() => handleRemoveImage(idx)}
                        className="p-2.5 bg-[#e63946] rounded-full text-white hover:scale-110 transition-transform"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                
                {galleryImages.length < 3 && (
                  <div 
                    onClick={handleMockUpload}
                    className="aspect-video bg-light-gray border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-success hover:bg-success/5 transition-all group"
                  >
                    <UploadCloud className="w-8 h-8 text-text-secondary group-hover:text-success mb-2" />
                    <span className="text-xs font-bold text-text-secondary group-hover:text-success">Upload Showcase Image</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Publish */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-success" />
                </div>
                <h2 className="text-2xl font-black text-text-primary tracking-tight">Review & Publish Your Gig</h2>
                <p className="text-text-secondary text-sm max-w-md mx-auto">
                  Your dynamic service gig is ready to launch on the Forte Space marketplace! Review the final parameters below.
                </p>
              </div>

              {/* Dynamic Recap Box */}
              <div className="p-6 rounded-2xl border border-border bg-light-gray/20 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-black text-text-secondary uppercase tracking-wider block">Gig Title</span>
                    <p className="text-sm font-bold text-[#222222] mt-1">I will {title}</p>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <span className="text-[10px] font-black text-text-secondary uppercase tracking-wider block">Category</span>
                      <p className="text-xs font-bold text-text-primary mt-1">{category === 'web' ? 'Programming & Tech' : category === 'design' ? 'Graphics & Design' : 'Digital Marketing'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-text-secondary uppercase tracking-wider block">Subcategory</span>
                      <p className="text-xs font-bold text-text-primary mt-1">{subcategory}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-text-secondary uppercase tracking-wider block">Search Tags</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {tags.map(t => (
                        <span key={t} className="px-2 py-0.5 bg-[#222222]/10 text-[#222222] text-[10px] font-bold rounded">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                  <span className="text-[10px] font-black text-text-secondary uppercase tracking-wider block">Pricing Packages Scope</span>
                  <div className="space-y-2 mt-2">
                    {Object.keys(packages).map(tier => (
                      <div key={tier} className="flex justify-between items-center text-xs border-b border-border/50 pb-2 last:border-none">
                        <div>
                          <p className="font-bold text-text-primary">{tier}: {packages[tier].title}</p>
                          <p className="text-[10px] text-text-secondary">Delivers in {packages[tier].delivery} days</p>
                        </div>
                        <span className="font-black text-[#222222] text-sm">KES {parseFloat(packages[tier].price).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="p-6 border-t border-border bg-light-gray/30 flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={handleBack} 
            disabled={currentStep === 0}
            className={currentStep === 0 ? "opacity-50 cursor-not-allowed" : ""}
            icon={<ArrowLeft size={16} />}
          >
            Back
          </Button>
          <Button 
            variant="primary" 
            onClick={handleNext}
            disabled={loading}
            icon={currentStep === WIZARD_STEPS.length - 1 ? <Check size={16} /> : <ArrowRight size={16} />}
            className={currentStep === WIZARD_STEPS.length - 1 ? "bg-success hover:bg-success/90 border-none shadow-lg shadow-[#2bb75c]/20" : ""}
          >
            {loading ? 'Publishing...' : currentStep === WIZARD_STEPS.length - 1 ? 'Publish Gig' : 'Save & Continue'}
          </Button>
        </div>
      </Card>
    </div>
  );
}


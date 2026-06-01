import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, UploadCloud, ShieldCheck, 
  FileText, Building, MapPin, User, ArrowRight, Shield,
  Building2, Briefcase, Camera, Loader2, Sparkles, AlertCircle
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useFreelancer } from '../../freelancer/context/FreelancerContext';
import toast, { Toaster } from 'react-hot-toast';

export default function IdentityVerificationCenterPage() {
  const { accountType, setAccountType } = useFreelancer();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [idFile, setIdFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [ocrStatus, setOcrStatus] = useState('idle'); // idle | scanning | completed
  const [ocrData, setOcrData] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [biometricStatus, setBiometricStatus] = useState('idle'); // idle | scanning | matched
  
  const fileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: 'Alex',
    lastName: 'Morgan',
    dob: '1990-05-12',
    nationality: 'United States',
    address: '102 Pine Street',
    city: 'San Francisco',
    zip: '94111',
    companyName: 'Acme Solutions Ltd',
    taxId: 'TX-992348-A',
    registrationNumber: 'REG-8834928'
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const steps = accountType === 'INDIVIDUAL' 
    ? [
        { id: 'personal', label: 'Personal Info', icon: User },
        { id: 'id', label: 'Government ID', icon: FileText },
        { id: 'biometric', label: 'Selfie Match', icon: Camera },
        { id: 'address', label: 'Address Info', icon: MapPin },
        { id: 'review', label: 'Review & Submit', icon: Check }
      ]
    : [
        { id: 'company', label: 'Company Info', icon: Building2 },
        { id: 'registration', label: 'Registration Docs', icon: FileText },
        { id: 'tax', label: 'Tax & VAT', icon: Briefcase },
        { id: 'owner_id', label: 'Director ID', icon: ShieldCheck },
        { id: 'biometric', label: 'Director Biometric', icon: Camera },
        { id: 'review', label: 'Review & Submit', icon: Check }
      ];

  const handleNext = () => {
    // Basic validation before moving forward
    if (accountType === 'INDIVIDUAL') {
      if (currentStep === 0 && (!formData.firstName || !formData.lastName)) {
        toast.error('Please enter your first and last name.');
        return;
      }
      if (currentStep === 1 && !idFile) {
        toast.error('Please upload your government-issued ID.');
        return;
      }
      if (currentStep === 2 && biometricStatus !== 'matched') {
        toast.error('Please perform the biometric selfie match verification.');
        return;
      }
    } else {
      if (currentStep === 0 && !formData.companyName) {
        toast.error('Please enter your corporate legal company name.');
        return;
      }
      if (currentStep === 1 && !idFile) {
        toast.error('Please upload your Business Registration document.');
        return;
      }
      if (currentStep === 2 && !formData.taxId) {
        toast.error('Please provide tax or VAT identification.');
        return;
      }
      if (currentStep === 4 && biometricStatus !== 'matched') {
        toast.error('Please perform the director biometric facial alignment check.');
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };
  
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const simulateOCR = (file) => {
    setOcrStatus('scanning');
    toast('Initializing high-speed OCR Document Scanner...', { icon: '🔍' });
    
    setTimeout(() => {
      setOcrStatus('completed');
      setOcrData({
        documentId: 'US-' + Math.floor(10000000 + Math.random() * 90000000),
        extractedName: `${formData.firstName} ${formData.lastName}`,
        expiryDate: '2032-11-20',
        matchScore: '99.2%'
      });
      toast.success('OCR Document Extraction Complete!', {
        description: 'Metadata matched successfully.'
      });
    }, 2000);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIdFile(file);
      simulateOCR(file);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setIdFile(file);
      simulateOCR(file);
    }
  };

  const startBiometricScan = () => {
    setCameraActive(true);
    setBiometricStatus('scanning');
    toast.loading('Starting Liveness Detection check...', { id: 'biometric-toast' });

    setTimeout(() => {
      setBiometricStatus('matched');
      setCameraActive(false);
      toast.success('Face Match Verified: 98.6% similarity score!', { id: 'biometric-toast' });
    }, 3000);
  };

  const handleSubmitAll = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Submitting secure KYC package to verification ledger...',
        success: 'KYC Verification Submitted! You will be notified in 10 minutes. 🛡️',
        error: 'Submission failed.'
      }
    );
  };

  useEffect(() => {
    setCurrentStep(0);
    setIdFile(null);
    setOcrStatus('idle');
    setOcrData(null);
    setBiometricStatus('idle');
  }, [accountType]);

  const renderIndividualStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-success" />
              <h3 className="text-xl font-bold text-text-primary">Personal Details</h3>
            </div>
            <p className="text-sm text-text-secondary">Please provide your legal name as it appears on your government-issued ID.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5">First Name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full rounded-xl border border-border bg-light-gray px-4 py-3 text-text-primary focus:bg-white focus:border-success outline-none transition-all shadow-inner" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5">Last Name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full rounded-xl border border-border bg-light-gray px-4 py-3 text-text-primary focus:bg-white focus:border-success outline-none transition-all shadow-inner" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5">Date of Birth</label>
                <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="w-full rounded-xl border border-border bg-light-gray px-4 py-3 text-text-primary focus:bg-white focus:border-success outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5">Nationality</label>
                <input type="text" name="nationality" value={formData.nationality} onChange={handleInputChange} className="w-full rounded-xl border border-border bg-light-gray px-4 py-3 text-text-primary focus:bg-white focus:border-success outline-none transition-all" />
              </div>
            </div>
          </motion.div>
        );
      case 1:
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h3 className="text-xl font-bold text-text-primary">Upload Government ID</h3>
            <p className="text-sm text-text-secondary">Upload a crisp photo or PDF scan of your Passport, Driver's License or National ID.</p>
            
            <div 
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "mt-6 border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[220px]",
                isDragging ? "border-success bg-success/5 scale-[0.98]" : "border-border hover:bg-light-gray hover:border-success"
              )}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,.pdf" />
              <UploadCloud className="h-12 w-12 text-success mb-4 animate-bounce" />
              <h4 className="text-base font-bold text-text-primary">Drag & drop document here, or browse</h4>
              <p className="text-xs text-text-secondary mt-1">Supports PNG, JPG, PDF up to 10MB</p>
            </div>

            {ocrStatus === 'scanning' && (
              <div className="mt-4 p-4 bg-success/5 border border-success/20 rounded-xl flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-success animate-spin" />
                <span className="text-xs font-bold text-success">Extracting data via OCR Neural Engine...</span>
              </div>
            )}

            {ocrStatus === 'completed' && ocrData && (
              <div className="mt-4 p-5 bg-success/5 border border-success/20 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-success">
                  <Check className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-wider">OCR Verified Success</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-text-secondary pt-1">
                  <div>Document ID: <strong className="text-text-primary font-bold">{ocrData.documentId}</strong></div>
                  <div>Extracted Name: <strong className="text-text-primary font-bold">{ocrData.extractedName}</strong></div>
                  <div>Expiry Date: <strong className="text-text-primary font-bold">{ocrData.expiryDate}</strong></div>
                  <div>OCR Confidence: <strong className="text-text-primary font-bold">{ocrData.matchScore}</strong></div>
                </div>
              </div>
            )}
          </motion.div>
        );
      case 2:
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h3 className="text-xl font-bold text-text-primary">Biometric Face Matching</h3>
            <p className="text-sm text-text-secondary">We match a real-time selfie check against your submitted ID for instant verification.</p>
            
            <div className="mt-6 flex flex-col items-center justify-center p-8 bg-zinc-900 text-white rounded-3xl relative overflow-hidden min-h-[300px] border border-white/10">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
              
              {cameraActive ? (
                <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-success animate-pulse flex items-center justify-center bg-black/40">
                  <Camera className="w-12 h-12 text-success" />
                  <div className="absolute inset-x-0 top-1/2 h-0.5 bg-success shadow-[0_0_8px_#a855f7] animate-bounce"></div>
                </div>
              ) : biometricStatus === 'matched' ? (
                <div className="text-center space-y-3">
                  <div className="w-20 h-20 rounded-full bg-success/20 text-success border border-success/30 flex items-center justify-center mx-auto mb-2">
                    <ShieldCheck className="w-10 h-10" />
                  </div>
                  <h4 className="font-black text-lg text-white">Liveness Verification Match Pass</h4>
                  <p className="text-xs text-white/60">Biometric characteristics align flawlessly (98.6% match rating).</p>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <Camera className="w-16 h-16 text-white/30 mx-auto" />
                  <p className="text-xs text-white/60 max-w-[280px]">Enable camera permission to complete live face verification.</p>
                  <Button variant="primary" onClick={startBiometricScan} className="bg-success hover:bg-success/90 border-0">
                    Launch Biometric Scan
                  </Button>
                </div>
              )}

              {biometricStatus === 'scanning' && (
                <div className="absolute bottom-4 left-1/2 -tranzinc-x-1/2 text-xs font-bold text-success tracking-widest uppercase flex items-center gap-1.5 bg-zinc-950 px-4 py-2 rounded-full border border-white/5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing Facial Vectors...
                </div>
              )}
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h3 className="text-xl font-bold text-text-primary">Residential Address</h3>
            <p className="text-sm text-text-secondary">Please enter your permanent address details.</p>
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5">Street Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full rounded-xl border border-border bg-light-gray px-4 py-3 text-text-primary focus:bg-white focus:border-success outline-none transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5">City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full rounded-xl border border-border bg-light-gray px-4 py-3 text-text-primary focus:bg-white focus:border-success outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5">ZIP Code</label>
                  <input type="text" name="zip" value={formData.zip} onChange={handleInputChange} className="w-full rounded-xl border border-border bg-light-gray px-4 py-3 text-text-primary focus:bg-white focus:border-success outline-none transition-colors" />
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-center py-6">
            <div className="w-20 h-20 bg-success/10 text-success border border-success/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-text-primary">Submit KYC Package</h3>
            <p className="text-text-secondary font-medium max-w-md mx-auto text-sm leading-relaxed">
              Your identity credentials, biometric proofs, and address documents will be encrypted and submitted.
            </p>
            <div className="bg-light-gray border border-border rounded-2xl p-5 max-w-md mx-auto text-left space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-text-secondary">Summary Profile</h4>
              <div className="text-xs font-bold text-text-primary grid grid-cols-2 gap-2">
                <span>Name: {formData.firstName} {formData.lastName}</span>
                <span>Nationality: {formData.nationality}</span>
                <span>Document: {idFile ? idFile.name : 'Not Uploaded'}</span>
                <span>Biometrics: Checked & Verified</span>
              </div>
            </div>
          </motion.div>
        );
      default: return null;
    }
  };

  const renderBusinessStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h3 className="text-xl font-bold text-text-primary">Corporate Entity Info</h3>
            <p className="text-sm text-text-secondary">Provide the legal details of your company, SME, or agency.</p>
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5">Legal Company Name</label>
                <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className="w-full rounded-xl border border-border bg-light-gray px-4 py-3 text-text-primary focus:bg-white focus:border-success outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5">Business Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full rounded-xl border border-border bg-light-gray px-4 py-3 text-text-primary focus:bg-white focus:border-success outline-none transition-colors" />
              </div>
            </div>
          </motion.div>
        );
      case 1:
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h3 className="text-xl font-bold text-text-primary">Upload Business License</h3>
            <p className="text-sm text-text-secondary">Upload Incorporation Certificate or Corporate Articles.</p>
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5">Registration Number</label>
              <input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleInputChange} className="w-full rounded-xl border border-border bg-light-gray px-4 py-3 text-text-primary focus:bg-white focus:border-success outline-none transition-colors mb-4" />
            </div>
            
            <div 
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[200px]",
                isDragging ? "border-success bg-success/5" : "border-border hover:bg-light-gray hover:border-success"
              )}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,.pdf" />
              <UploadCloud className="mx-auto h-12 w-12 text-success mb-3 animate-bounce" />
              <h4 className="text-base font-bold text-text-primary">Drag & drop certificate here, or browse</h4>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h3 className="text-xl font-bold text-text-primary">Tax & VAT Registration</h3>
            <p className="text-sm text-text-secondary">Provide tax registration and corporate VAT ids.</p>
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5">Tax ID / VAT Number</label>
                <input type="text" name="taxId" value={formData.taxId} onChange={handleInputChange} className="w-full rounded-xl border border-border bg-light-gray px-4 py-3 text-text-primary focus:bg-white focus:border-success outline-none transition-colors" />
              </div>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h3 className="text-xl font-bold text-text-primary">Director ID Document</h3>
            <p className="text-sm text-text-secondary">Upload passport or identity card of the primary director or owner.</p>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:bg-light-gray hover:border-success transition-all cursor-pointer flex flex-col items-center justify-center min-h-[200px]"
            >
              <User className="mx-auto h-12 w-12 text-success mb-3" />
              <h4 className="text-base font-bold text-text-primary">Upload Passport or National ID</h4>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h3 className="text-xl font-bold text-text-primary">Director Biometric Align Check</h3>
            <p className="text-sm text-text-secondary">Verify the identity of the beneficial owner through real-time facial alignment matching.</p>
            <div className="mt-6 flex flex-col items-center justify-center p-8 bg-zinc-900 text-white rounded-3xl relative overflow-hidden min-h-[280px]">
              {cameraActive ? (
                <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-success animate-pulse flex items-center justify-center">
                  <Camera className="w-10 h-10 text-success" />
                </div>
              ) : biometricStatus === 'matched' ? (
                <div className="text-center space-y-2">
                  <ShieldCheck className="w-12 h-12 text-success mx-auto" />
                  <h4 className="font-bold text-white">Director Verified Successfully</h4>
                </div>
              ) : (
                <Button variant="primary" onClick={startBiometricScan} className="bg-success hover:bg-success/95">
                  Launch Director Scan
                </Button>
              )}
            </div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-center py-6">
            <ShieldCheck className="h-16 w-16 text-success mx-auto" />
            <h3 className="text-2xl font-black text-text-primary">Submit Corporate KYB Package</h3>
            <p className="text-sm text-text-secondary font-medium">Verify your agency registration status and business tax certificates safely.</p>
          </motion.div>
        );
      default: return null;
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-12 relative max-w-5xl mx-auto">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-success/20 text-success rounded-xl border border-success/20 shadow-sm">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black text-text-primary tracking-tight">Identity Verification Center</h1>
          </div>
          <p className="text-sm text-text-secondary font-medium mt-2 max-w-xl">
            Settle trust indicators and upgrade your trading permissions securely.
          </p>
        </div>

        {/* Dynamic Switcher */}
        <div className="flex items-center gap-2 bg-light-gray p-1 rounded-xl border border-border">
          <button 
            onClick={() => setAccountType('INDIVIDUAL')}
            className={cn(
              "px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all",
              accountType === 'INDIVIDUAL' ? "bg-white text-success shadow-sm font-bold" : "text-text-secondary hover:text-text-primary"
            )}
          >
            Individual
          </button>
          <button 
            onClick={() => setAccountType('AGENCY')}
            className={cn(
              "px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all",
              accountType !== 'INDIVIDUAL' ? "bg-white text-success shadow-sm font-bold" : "text-text-secondary hover:text-text-primary"
            )}
          >
            SME/Agency
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Form Area */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="p-8 border border-border bg-white shadow-xl rounded-3xl">
            {/* Stepper Header */}
            <div className="flex items-center justify-between mb-8 overflow-x-auto pb-4 border-b border-border">
              {steps.map((step, index) => {
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;
                const Icon = step.icon;
                return (
                  <div key={step.id} className="flex items-center min-w-max">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                        isCompleted ? 'bg-success border-success text-white' : 
                        isCurrent ? 'border-success text-success bg-success/10 scale-105' : 
                        'border-border text-text-secondary/50 bg-light-gray'
                      )}>
                        {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                      </div>
                      <span className={cn(
                        "text-[9px] uppercase tracking-wider mt-3 font-bold",
                        isCurrent ? 'text-success' : 'text-text-secondary'
                      )}>{step.label}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={cn(
                        "w-8 sm:w-16 h-0.5 mx-2 -mt-6",
                        isCompleted ? 'bg-success' : 'bg-border'
                      )} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Step Content */}
            <div className="min-h-[250px] mt-6">
              <AnimatePresence mode="wait">
                <motion.div key={currentStep} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.15 }}>
                  {accountType === 'INDIVIDUAL' ? renderIndividualStep() : renderBusinessStep()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="mt-8 pt-6 border-t border-border flex justify-between items-center">
              <Button 
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="rounded-xl px-6 py-2.5 font-bold text-sm"
              >
                Back
              </Button>
              {currentStep === steps.length - 1 ? (
                <Button 
                  variant="primary" 
                  onClick={handleSubmitAll}
                  className="bg-success hover:bg-success/95 font-bold rounded-xl px-6 py-2.5 text-sm"
                >
                  Submit for Ledger Review
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  onClick={handleNext} 
                  className="bg-success hover:bg-success/95 font-bold rounded-xl px-6 py-2.5 text-sm"
                  icon={<ArrowRight size={16} />}
                >
                  Continue
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Trust Badges Widget Card Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 border border-border bg-light-gray rounded-3xl space-y-4">
            <h4 className="font-black text-text-primary text-sm flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-success" /> Verification Level
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed font-semibold">
              Verify your identity to lock in higher billing limits, reduced platform commissions, and instant withdrawal routing keys.
            </p>
            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-text-secondary">
                <span>KYC Verification</span>
                <span className="text-text-primary uppercase text-[10px]">Tier 1</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-text-secondary">
                <span>Contract Ledger Limit</span>
                <span className="text-success uppercase text-[10px]">Unlimited</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-text-secondary">
                <span>Commission Discount</span>
                <span className="text-success uppercase text-[10px]">-1.5%</span>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}

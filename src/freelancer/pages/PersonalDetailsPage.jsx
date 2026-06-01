import React, { useState } from 'react';
import { User, Briefcase, Globe, Home, CheckCircle2, Save, MapPin, CreditCard, Smartphone, Building2 } from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function PersonalDetailsPage() {
  // accountType is now assumed to come from the server context/state
  // e.g., const { accountType } = useAuth();
  
  const [workModality, setWorkModality] = useState('ONLINE'); // ONLINE, OFFLINE, HYBRID
  const [formData, setFormData] = useState({
    name: '',
    titleOrCrn: '',
    baseCity: '',
    travelRadius: '',
    preferredPaymentMethod: 'mpesa',
    phoneNumber: '',
    bankName: 'KCB',
    bankAccount: ''
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setIsSaved(false);
  };

  const handleSave = () => {
    // Simulate API call
    setTimeout(() => {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 500);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-text-primary tracking-tight mb-2">Service Configuration</h1>
        <p className="text-sm text-text-secondary font-medium">
          Tell us how you prefer to work so we can match you with the right clients.
        </p>
      </div>

      <div className="space-y-8">
        
        {/* Basic Details Form */}
        <Card title="Business Information">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">
                  Display Name
                </label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-light-gray border border-transparent rounded-md focus:border-border focus:bg-white transition-all text-sm font-medium outline-none text-text-primary"
                  placeholder="e.g. Jane Doe or Acme Solutions"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">
                  Professional Headline / Tagline
                </label>
                <input 
                  type="text" 
                  name="titleOrCrn"
                  value={formData.titleOrCrn}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-light-gray border border-transparent rounded-md focus:border-border focus:bg-white transition-all text-sm font-medium outline-none text-text-primary"
                  placeholder="e.g. Senior Frontend Developer"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Work Modality Selection */}
        <section>
          <h2 className="text-lg font-bold text-text-primary mb-4">Work Modality & Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Online */}
            <div 
              onClick={() => setWorkModality('ONLINE')}
              className={cn(
                "p-6 rounded-lg border-2 cursor-pointer transition-all flex items-start gap-4",
                workModality === 'ONLINE' 
                  ? "border-success bg-success/5" 
                  : "border-border bg-white hover:border-text-secondary"
              )}
            >
              <div className={cn("p-2.5 rounded-md shrink-0", workModality === 'ONLINE' ? "bg-success text-white" : "bg-light-gray text-text-secondary")}>
                <Globe size={20} />
              </div>
              <div>
                <h3 className="font-bold text-text-primary">Online / Remote Services</h3>
                <p className="text-sm text-text-secondary mt-1">Digital work such as software development, design, writing, or virtual consulting.</p>
              </div>
            </div>

            {/* Offline */}
            <div 
              onClick={() => setWorkModality('OFFLINE')}
              className={cn(
                "p-6 rounded-lg border-2 cursor-pointer transition-all flex items-start gap-4",
                workModality === 'OFFLINE' 
                  ? "border-[#e63946] bg-[#e63946]/5" 
                  : "border-border bg-white hover:border-text-secondary"
              )}
            >
              <div className={cn("p-2.5 rounded-md shrink-0", workModality === 'OFFLINE' ? "bg-[#e63946] text-white" : "bg-light-gray text-text-secondary")}>
                <Home size={20} />
              </div>
              <div>
                <h3 className="font-bold text-text-primary">Physical / On-Site Services</h3>
                <p className="text-sm text-text-secondary mt-1">In-person tasks such as plumbing, electrical work, home cleaning, or event photography.</p>
              </div>
            </div>
          </div>

          {/* Conditional Location Input for Offline work */}
          {workModality === 'OFFLINE' && (
            <Card className="border-l-4 border-l-[#e63946] p-6">
              <div className="flex items-center gap-3 mb-4 text-[#e63946]">
                <MapPin size={20} />
                <h3 className="font-bold text-text-primary">Service Area Settings</h3>
              </div>
              <p className="text-sm text-text-secondary mb-4">
                Since you offer physical services, please define your operating region. Clients outside this region won't be able to book you for on-site work.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Base City/Region</label>
                  <input 
                    type="text" 
                    name="baseCity"
                    value={formData.baseCity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white border border-border rounded-md focus:border-[#e63946] outline-none text-sm font-medium"
                    placeholder="e.g. Nairobi, Kenya"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Maximum Travel Radius (km)</label>
                  <input 
                    type="number" 
                    name="travelRadius"
                    value={formData.travelRadius}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white border border-border rounded-md focus:border-[#e63946] outline-none text-sm font-medium"
                    placeholder="e.g. 50"
                  />
                </div>
              </div>
            </Card>
          )}
        </section>

        {/* Payment & Withdrawal Details */}
        <Card title="Payment & Withdrawal Settings">
          <div className="space-y-6">
            <p className="text-sm text-text-secondary">Select your preferred withdrawal method and link your account details below.</p>
            
            {/* Method Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Preferred Withdrawal Method</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'mpesa', name: 'M-Pesa', icon: Smartphone, color: 'text-green-600' },
                  { id: 'airtel', name: 'Airtel Money', icon: Smartphone, color: 'text-red-600' },
                  { id: 'bank', name: 'Bank Account', icon: Building2, color: 'text-[#14a800]' }
                ].map(method => (
                  <div 
                    key={method.id}
                    onClick={() => setFormData({...formData, preferredPaymentMethod: method.id})}
                    className={`p-3 border-2 rounded-xl cursor-pointer transition-all flex items-center gap-2 ${
                      formData.preferredPaymentMethod === method.id ? 'border-[#14a800]/20 bg-[#14a800]/5' : 'border-border hover:border-zinc-300'
                    }`}
                  >
                    <method.icon size={18} className={method.color} />
                    <span className="font-bold text-sm text-text-primary">{method.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Form Fields */}
            <div className="pt-4 border-t border-border">
              {(formData.preferredPaymentMethod === 'mpesa' || formData.preferredPaymentMethod === 'airtel') ? (
                <div className="space-y-2 max-w-md">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center gap-1">
                    <Smartphone size={14} className={formData.preferredPaymentMethod === 'mpesa' ? 'text-green-600' : 'text-red-600'} /> 
                    {formData.preferredPaymentMethod === 'mpesa' ? 'M-Pesa' : 'Airtel'} Phone Number
                  </label>
                  <input 
                    type="text" 
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-light-gray border border-transparent rounded-md focus:border-border focus:bg-white transition-all text-sm font-medium outline-none text-text-primary"
                    placeholder="e.g. +254 712 345 678"
                  />
                  <p className="text-xs text-text-secondary">Please ensure the number is registered in your name.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center gap-1">
                      <Building2 size={14} className="text-[#14a800]" /> Select Bank
                    </label>
                    <select 
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-light-gray border border-transparent rounded-md focus:border-border focus:bg-white transition-all text-sm font-medium outline-none text-text-primary"
                    >
                      <option value="KCB">KCB Bank</option>
                      <option value="Equity">Equity Bank</option>
                      <option value="Coop">Co-operative Bank</option>
                      <option value="Absa">Absa Bank Kenya</option>
                      <option value="NCBA">NCBA Bank</option>
                      <option value="StanChart">Standard Chartered</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center gap-1">
                      <CreditCard size={14} className="text-[#14a800]" /> Account Number
                    </label>
                    <input 
                      type="text" 
                      name="bankAccount"
                      value={formData.bankAccount}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-light-gray border border-transparent rounded-md focus:border-border focus:bg-white transition-all text-sm font-medium outline-none text-text-primary"
                      placeholder="Enter 10-14 digit account number"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end items-center gap-4 pt-6 border-t border-border">
          {isSaved && (
            <span className="text-sm font-bold text-success flex items-center gap-1.5 mr-auto">
              <CheckCircle2 size={16} /> Details Saved Successfully
            </span>
          )}
          <Button variant="outline" size="lg" onClick={() => setFormData({name:'', titleOrCrn:'', baseCity:'', travelRadius:''})}>Clear</Button>
          <Button variant="primary" size="lg" icon={<Save size={18} />} onClick={handleSave}>
            Save Details
          </Button>
        </div>
      </div>
    </div>
  );
}

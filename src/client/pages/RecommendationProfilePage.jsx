import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, CheckCircle, ShieldAlert, Award, Compass, Save, RefreshCw, Zap, ShieldCheck, Briefcase } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import toast, { Toaster } from 'react-hot-toast';
import { cn } from '../../admin/utils/cn';
import { profileAPI } from '../../common/services/api';

export default function ClientRecommendationProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileId, setProfileId] = useState(null);

  // Recommendation parameters state
  const [formData, setFormData] = useState({
    companyName: '',
    companyDescription: '',
    industry: 'TECHNOLOGY',
    companySize: 'MEDIUM',
    hiringType: 'FREELANCE',
    budget: 50000,
    preferredWorkingHours: '9AM - 5PM',
    timezone: 'UTC+3',
  });

  const [aiScore, setAiScore] = useState(0);

  // Fetch initial profile
  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const res = await profileAPI.getMyProfile();
        if (res.success && res.user?.profile) {
          const p = res.user.profile;
          setProfileId(p.id);
          setFormData({
            companyName: p.companyName || '',
            companyDescription: p.companyDescription || '',
            industry: p.industry || 'TECHNOLOGY',
            companySize: p.companySize || 'MEDIUM',
            hiringType: p.hiringType || 'FREELANCE',
            budget: p.budget || 50000,
            preferredWorkingHours: p.preferredWorkingHours || '9AM - 5PM',
            timezone: p.timezone || 'UTC+3',
          });
        }
      } catch (err) {
        console.error('Failed to fetch client recommendation profile:', err);
        toast.error('Could not load profile intelligence stats.');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  // Compute AI score dynamically on input change
  useEffect(() => {
    let score = 0;
    if (formData.companyName.trim()) score += 15;
    if (formData.companyDescription.trim().length > 30) score += 25;
    else if (formData.companyDescription.trim().length > 0) score += 10;
    if (formData.industry) score += 15;
    if (formData.companySize) score += 15;
    if (formData.hiringType) score += 15;
    if (formData.preferredWorkingHours) score += 15;
    setAiScore(score);
  }, [formData]);

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await profileAPI.updateMyProfile({
        companyName: formData.companyName,
        companyDescription: formData.companyDescription,
        industry: formData.industry,
        companySize: formData.companySize,
        hiringType: formData.hiringType,
        budget: parseFloat(formData.budget),
        preferredWorkingHours: formData.preferredWorkingHours,
        timezone: formData.timezone,
      });

      if (res.success) {
        toast.success('Hiring recommendation parameters updated successfully!', { icon: '💼' });
      } else {
        toast.error('Failed to sync corporate parameters.');
      }
    } catch (err) {
      toast.error(err.message || 'Error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const getMissingTips = () => {
    const tips = [];
    if (!formData.companyName.trim()) tips.push('Add your company or workspace name to establish trust with premier talent.');
    if (formData.companyDescription.trim().length < 30) tips.push('Elaborate your company brief so the parser can recommend matching niche talents.');
    if (formData.budget < 10000) tips.push('Low default budget configurations might hide high-caliber matching profiles from your feed.');
    return tips;
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4">
        <RefreshCw className="animate-spin text-success" size={32} />
        <p className="text-sm font-bold text-gray-500">Analyzing Client Recommendation Briefs...</p>
      </div>
    );
  }

  const tips = getMissingTips();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 px-4 sm:px-6 font-sans">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-success/10 text-success rounded-xl shadow-sm border border-success/20">
              <Briefcase size={24} className="animate-pulse" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Hiring Profile Optimizer</h1>
          </div>
          <p className="text-sm text-gray-500 font-medium">
            Optimize your corporate matching metadata. This data calibrates our search intelligence to highlight perfect freelancers for your projects.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: AI Gauge & Tips */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-[#14a800] to-[#118a00] text-white shadow-xl border-none relative overflow-hidden flex flex-col items-center text-center p-8">
            <div className="absolute top-[-50%] right-[-10%] w-48 h-48 bg-white/5 blur-[50px] rounded-full pointer-events-none"></div>
            
            <h3 className="text-lg font-bold text-white/90 mb-6 flex items-center gap-2">
              <Sparkles size={18} className="text-success" /> Hiring Clarity Score
            </h3>

            {/* Circular Gauge */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" className="stroke-white/10" strokeWidth="10" fill="transparent" />
                <circle 
                  cx="80" 
                  cy="80" 
                  r="70" 
                  className="stroke-success shadow-[0_0_15px_rgba(34,197,94,0.4)] transition-all duration-1000" 
                  strokeWidth="10" 
                  fill="transparent" 
                  strokeDasharray={440} 
                  strokeDashoffset={440 - (440 * aiScore) / 100}
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-4xl font-black">{aiScore}%</span>
                <p className="text-[10px] uppercase font-bold tracking-widest text-white/70 mt-1">Brief Complete</p>
              </div>
            </div>

            <div className="mt-8 space-y-2">
              <p className="text-xs font-bold text-success bg-success/20 w-fit mx-auto px-3 py-1 rounded-full flex items-center gap-1.5">
                <ShieldCheck size={14} /> Brief Analysis Active
              </p>
              <p className="text-[11px] text-white/70 font-semibold mt-2">
                Higher brief clarity enables our semantic match engines to yield 3x more accurate recommendations.
              </p>
            </div>
          </Card>

          {/* Actionable Tips */}
          <Card className="bg-white border-gray-200 shadow-sm p-6">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Award size={16} className="text-success" /> Optimization Actions
            </h3>
            {tips.length === 0 ? (
              <div className="flex gap-3 text-success">
                <CheckCircle size={18} className="shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold">Workspace Fully Configured</h4>
                  <p className="text-xs text-gray-500 mt-1">Outstanding! Your corporate hiring parameters are optimized for finding premium matching freelancers.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {tips.map((tip, idx) => (
                  <div key={idx} className="flex gap-3 text-amber-600">
                    <ShieldAlert size={18} className="shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-500 font-medium">{tip}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Interactive Form */}
        <div className="lg:col-span-2">
          <Card className="bg-white border-gray-200 shadow-sm p-8">
            <h2 className="text-xl font-black text-gray-900 tracking-tight mb-8">Corporate Recommendation Parameters</h2>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Company Name */}
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Company / Workspace Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Acme SaaS Labs" 
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium focus:outline-none focus:border-success focus:ring-1 focus:ring-success transition-colors placeholder:text-gray-400 text-gray-900"
                    value={formData.companyName}
                    onChange={e => handleChange('companyName', e.target.value)}
                  />
                </div>

                {/* Industry Sector */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Industry Classification</label>
                  <select 
                    className="pl-4 pr-10 py-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg text-sm font-bold focus:border-success cursor-pointer appearance-none shadow-sm"
                    value={formData.industry}
                    onChange={e => handleChange('industry', e.target.value)}
                  >
                    <option value="TECHNOLOGY">Technology & Software</option>
                    <option value="FINANCE">Finance & Fintech</option>
                    <option value="MARKETING">Marketing & Advertising</option>
                    <option value="HEALTHCARE">Healthcare & Medicine</option>
                    <option value="RETAIL">Retail & E-Commerce</option>
                  </select>
                </div>

                {/* Preferred Hiring Model */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Default Hiring Model</label>
                  <div className="grid grid-cols-3 gap-2 bg-gray-50 p-1 rounded-lg border border-gray-300">
                    {['FULL_TIME', 'FREELANCE', 'CONTRACT'].map(lvl => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => handleChange('hiringType', lvl)}
                        className={cn(
                          "py-2 text-[10px] font-bold rounded-md uppercase tracking-wider transition-colors",
                          formData.hiringType === lvl 
                            ? "bg-success text-white shadow-sm" 
                            : "text-gray-500 hover:text-success hover:bg-gray-100"
                        )}
                      >
                        {lvl === 'FULL_TIME' ? 'Full Time' : lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Company Size */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Company Scale</label>
                  <select 
                    className="pl-4 pr-10 py-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg text-sm font-bold focus:border-success cursor-pointer appearance-none shadow-sm"
                    value={formData.companySize}
                    onChange={e => handleChange('companySize', e.target.value)}
                  >
                    <option value="STARTUP">Startup (&lt; 10 Employees)</option>
                    <option value="MEDIUM">SME (10 - 100 Employees)</option>
                    <option value="ENTERPRISE">Enterprise (&gt; 100 Employees)</option>
                  </select>
                </div>

                {/* Target Timezone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Preferred Working Hours</label>
                  <select 
                    className="pl-4 pr-10 py-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg text-sm font-bold focus:border-success cursor-pointer appearance-none shadow-sm"
                    value={formData.preferredWorkingHours}
                    onChange={e => handleChange('preferredWorkingHours', e.target.value)}
                  >
                    <option value="9AM - 5PM">Standard Business (9AM - 5PM)</option>
                    <option value="FLEXIBLE">Fully Flexible Schedules</option>
                    <option value="NIGHT_SHIFT">Night Shifts (Global Overlap)</option>
                  </select>
                </div>

                {/* Budget Configuration */}
                <div className="flex flex-col gap-1.5 p-4 bg-gray-50 rounded-xl border border-gray-300 md:col-span-2">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-500">
                    <span>Default Project Budget Target</span>
                    <span className="text-sm font-black text-success">KES {formData.budget.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="1000" 
                    max="1000000" 
                    step="5000"
                    className="w-full accent-success cursor-pointer h-2 bg-gray-200 rounded-full"
                    value={formData.budget}
                    onChange={e => handleChange('budget', e.target.value)}
                  />
                </div>

                {/* Brief Focus Statement */}
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Semantic Company Brief (Description)</label>
                  <textarea 
                    rows="5"
                    placeholder="Describe your workspace, typical projects, and ideal talent profile. Dynamic keyword mapping scans this description to suggest freelancers who have worked on identical tasks." 
                    className="w-full p-4 rounded-xl border border-gray-300 text-sm font-medium focus:outline-none focus:border-success focus:ring-1 focus:ring-success transition-colors placeholder:text-gray-400 text-gray-900 leading-relaxed resize-none"
                    value={formData.companyDescription}
                    onChange={e => handleChange('companyDescription', e.target.value)}
                  />
                </div>

              </div>

              <div className="pt-4 flex justify-end">
                <Button type="submit" variant="primary" className="shadow-lg min-w-[150px] bg-success hover:bg-success/90 text-white" disabled={saving}>
                  {saving ? (
                    <RefreshCw className="animate-spin mr-2" size={16} />
                  ) : (
                    <Save size={16} className="mr-2" />
                  )}
                  {saving ? 'Syncing Parameters...' : 'Save & Optimize'}
                </Button>
              </div>
            </form>
          </Card>
        </div>

      </div>
    </div>
  );
}

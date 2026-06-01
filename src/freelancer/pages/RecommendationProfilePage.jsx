import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, CheckCircle, ShieldAlert, Award, Compass, Save, RefreshCw, Zap, ShieldCheck } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import toast, { Toaster } from 'react-hot-toast';
import { profileAPI } from '../../common/services/api';
import { cn } from '../../admin/utils/cn';

export default function RecommendationProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileId, setProfileId] = useState(null);

  // Recommendation parameters state
  const [formData, setFormData] = useState({
    professionalTitle: '',
    bio: '',
    hourlyRate: 30,
    yearsOfExperience: 3,
    skillLevel: 'INTERMEDIATE',
    workModePreference: 'NO_PREFERENCE',
    preferredProjectType: 'LONG_TERM',
    availableHours: 40,
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
            professionalTitle: p.professionalTitle || '',
            bio: p.bio || '',
            hourlyRate: p.hourlyRate || 30,
            yearsOfExperience: p.yearsOfExperience || 3,
            skillLevel: p.skillLevel || 'INTERMEDIATE',
            workModePreference: p.workModePreference || 'NO_PREFERENCE',
            preferredProjectType: p.preferredProjectType || 'LONG_TERM',
            availableHours: p.availableHours || 40,
            timezone: p.timezone || 'UTC+3',
          });
        }
      } catch (err) {
        console.error('Failed to fetch recommendation profile:', err);
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
    if (formData.professionalTitle.trim()) score += 15;
    if (formData.bio.trim().length > 20) score += 20;
    else if (formData.bio.trim().length > 0) score += 10;
    if (formData.hourlyRate > 0) score += 15;
    if (formData.yearsOfExperience > 0) score += 15;
    if (formData.skillLevel) score += 15;
    if (formData.preferredProjectType) score += 10;
    if (formData.workModePreference) score += 10;
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
        professionalTitle: formData.professionalTitle,
        bio: formData.bio,
        hourlyRate: parseFloat(formData.hourlyRate),
        yearsOfExperience: parseInt(formData.yearsOfExperience),
        skillLevel: formData.skillLevel,
        workModePreference: formData.workModePreference,
        preferredProjectType: formData.preferredProjectType,
        availableHours: parseInt(formData.availableHours),
        timezone: formData.timezone,
      });

      if (res.success) {
        toast.success('Recommendation parameters synced successfully!', { icon: '🧠' });
      } else {
        toast.error('Failed to sync parameters.');
      }
    } catch (err) {
      toast.error(err.message || 'Error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const getMissingTips = () => {
    const tips = [];
    if (!formData.professionalTitle.trim()) tips.push('Add an exact Professional Title to matches matching job briefs.');
    if (formData.bio.trim().length < 20) tips.push('Expand your Bio to feed the semantic NLP search indices.');
    if (formData.skillLevel === 'INTERMEDIATE' && formData.yearsOfExperience > 5) tips.push('Consider promoting your Skill Level to EXPERT to unlocked higher-paying matches.');
    return tips;
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4">
        <RefreshCw className="animate-spin text-success" size={32} />
        <p className="text-sm font-bold text-text-secondary">Analyzing Profile Recommendation Indices...</p>
      </div>
    );
  }

  const tips = getMissingTips();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 px-4 sm:px-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-success/10 text-success rounded-xl shadow-sm border border-success/20">
              <Brain size={24} className="animate-pulse" />
            </div>
            <h1 className="text-3xl font-black text-text-primary tracking-tight">AI Profile Intelligence</h1>
          </div>
          <p className="text-sm text-text-secondary font-medium">
            Optimize your search metadata. This information directly configures our matching queue, boosting your proposal scores and relevance indexes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: AI Gauge & Tips */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-[#222222] to-[#222222]/90 text-white shadow-xl border-none relative overflow-hidden flex flex-col items-center text-center p-8">
            <div className="absolute top-[-50%] right-[-10%] w-48 h-48 bg-white/5 blur-[50px] rounded-full pointer-events-none"></div>
            
            <h3 className="text-lg font-bold text-white/90 mb-6 flex items-center gap-2">
              <Sparkles size={18} className="text-warning" /> Match Readiness Score
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
                <p className="text-[10px] uppercase font-bold tracking-widest text-white/70 mt-1">Optimized</p>
              </div>
            </div>

            <div className="mt-8 space-y-2">
              <p className="text-xs font-bold text-success bg-success/20 w-fit mx-auto px-3 py-1 rounded-full flex items-center gap-1.5">
                <ShieldCheck size={14} /> Matching Queue Active
              </p>
              <p className="text-[11px] text-white/70 font-semibold mt-2">
                Completing your recommendations metadata boosts matching chances by up to 2.4x.
              </p>
            </div>
          </Card>

          {/* Actionable Tips */}
          <Card className="bg-white border-border shadow-sm p-6">
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
              <Award size={16} className="text-success" /> Dynamic Match Actions
            </h3>
            {tips.length === 0 ? (
              <div className="flex gap-3 text-success">
                <CheckCircle size={18} className="shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold">100% Fully Configured</h4>
                  <p className="text-xs text-text-secondary mt-1">Excellent! Your profile meets all parameters to score maximum relevance weight in client hiring board indexes.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {tips.map((tip, idx) => (
                  <div key={idx} className="flex gap-3 text-warning">
                    <ShieldAlert size={18} className="shrink-0 mt-0.5" />
                    <p className="text-xs text-text-secondary font-medium">{tip}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Interactive Form */}
        <div className="lg:col-span-2">
          <Card className="bg-white border-border shadow-sm p-8">
            <h2 className="text-xl font-black text-text-primary tracking-tight mb-8">Recommendation Parameters</h2>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Professional Title */}
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Professional Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Senior Frontend Architect (React & Tailwind)" 
                    className="w-full px-4 py-2.5 rounded-lg border border-border text-sm font-medium focus:outline-none focus:border-[#222222] focus:ring-1 focus:ring-navy transition-colors placeholder:text-text-secondary"
                    value={formData.professionalTitle}
                    onChange={e => handleChange('professionalTitle', e.target.value)}
                  />
                </div>

                {/* Skill Level Selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Skill Level Segment</label>
                  <div className="grid grid-cols-3 gap-2 bg-light-gray/50 p-1 rounded-lg border border-border">
                    {['ENTRY', 'INTERMEDIATE', 'EXPERT'].map(lvl => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => handleChange('skillLevel', lvl)}
                        className={cn(
                          "py-2 text-[10px] font-bold rounded-md uppercase tracking-wider transition-colors",
                          formData.skillLevel === lvl 
                            ? "bg-[#222222] text-white shadow-sm" 
                            : "text-text-secondary hover:text-[#222222] hover:bg-light-gray"
                        )}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Work Mode Preference */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Work Mode Preference</label>
                  <div className="grid grid-cols-3 gap-2 bg-light-gray/50 p-1 rounded-lg border border-border">
                    {['ONLINE', 'ONSITE', 'NO_PREFERENCE'].map(mode => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => handleChange('workModePreference', mode)}
                        className={cn(
                          "py-2 text-[9px] font-bold rounded-md uppercase tracking-wider transition-colors",
                          formData.workModePreference === mode 
                            ? "bg-[#222222] text-white shadow-sm" 
                            : "text-text-secondary hover:text-[#222222] hover:bg-light-gray"
                        )}
                      >
                        {mode === 'NO_PREFERENCE' ? 'Any' : mode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preferred Project Type */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Preferred Contract Scope</label>
                  <select 
                    className="pl-4 pr-10 py-2.5 bg-white border border-border text-text-primary rounded-lg text-sm font-bold focus:border-[#222222] cursor-pointer appearance-none shadow-sm"
                    value={formData.preferredProjectType}
                    onChange={e => handleChange('preferredProjectType', e.target.value)}
                  >
                    <option value="SHORT_TERM">Short Term (&lt; 3 Months)</option>
                    <option value="LONG_TERM">Long Term (&gt; 3 Months)</option>
                    <option value="FIXED_PRICE">Fixed Price Projects</option>
                    <option value="HOURLY">Hourly Contracts</option>
                  </select>
                </div>

                {/* Target Timezone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Timezone Availability</label>
                  <select 
                    className="pl-4 pr-10 py-2.5 bg-white border border-border text-text-primary rounded-lg text-sm font-bold focus:border-[#222222] cursor-pointer appearance-none shadow-sm"
                    value={formData.timezone}
                    onChange={e => handleChange('timezone', e.target.value)}
                  >
                    <option value="UTC+3">UTC+3 (EAT / Nairobi)</option>
                    <option value="UTC+2">UTC+2 (EET / Cairo)</option>
                    <option value="UTC+0">UTC+0 (GMT / London)</option>
                    <option value="UTC-5">UTC-5 (EST / New York)</option>
                    <option value="UTC-8">UTC-8 (PST / California)</option>
                  </select>
                </div>

                {/* Hourly Rate Slider */}
                <div className="flex flex-col gap-1.5 p-4 bg-light-gray/20 rounded-xl border border-border">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-text-secondary">
                    <span>Target Hourly Rate</span>
                    <span className="text-sm font-black text-[#222222]">KES {formData.hourlyRate}/hr</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="300" 
                    step="5"
                    className="w-full accent-navy cursor-pointer h-2 bg-light-gray rounded-full"
                    value={formData.hourlyRate}
                    onChange={e => handleChange('hourlyRate', e.target.value)}
                  />
                </div>

                {/* Available Hours */}
                <div className="flex flex-col gap-1.5 p-4 bg-light-gray/20 rounded-xl border border-border">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-text-secondary">
                    <span>Weekly Available Hours</span>
                    <span className="text-sm font-black text-[#222222]">{formData.availableHours} hrs/week</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="80" 
                    step="5"
                    className="w-full accent-navy cursor-pointer h-2 bg-light-gray rounded-full"
                    value={formData.availableHours}
                    onChange={e => handleChange('availableHours', e.target.value)}
                  />
                </div>

                {/* Years of Experience */}
                <div className="flex flex-col gap-1.5 p-4 bg-light-gray/20 rounded-xl border border-border md:col-span-2">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-text-secondary">
                    <span>Years of Experience</span>
                    <span className="text-sm font-black text-[#222222]">{formData.yearsOfExperience} Years</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="20" 
                    className="w-full accent-navy cursor-pointer h-2 bg-light-gray rounded-full"
                    value={formData.yearsOfExperience}
                    onChange={e => handleChange('yearsOfExperience', e.target.value)}
                  />
                </div>

                {/* Brief Focus Statement */}
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">NLP Focus Statement (Bio)</label>
                  <textarea 
                    rows="5"
                    placeholder="Tell us what you specialize in. Use natural keywords (e.g. 'building real-time chats, optimizing sql databases, writing docker configs') to optimize semantic parsing in matching pipelines." 
                    className="w-full p-4 rounded-xl border border-border text-sm font-medium focus:outline-none focus:border-[#222222] focus:ring-1 focus:ring-navy transition-colors placeholder:text-text-secondary leading-relaxed resize-none"
                    value={formData.bio}
                    onChange={e => handleChange('bio', e.target.value)}
                  />
                </div>

              </div>

              <div className="pt-4 flex justify-end">
                <Button type="submit" variant="primary" className="shadow-lg min-w-[150px]" disabled={saving}>
                  {saving ? (
                    <RefreshCw className="animate-spin mr-2" size={16} />
                  ) : (
                    <Save size={16} className="mr-2" />
                  )}
                  {saving ? 'Syncing Parameters...' : 'Save & Recalculate'}
                </Button>
              </div>
            </form>
          </Card>
        </div>

      </div>
    </div>
  );
}

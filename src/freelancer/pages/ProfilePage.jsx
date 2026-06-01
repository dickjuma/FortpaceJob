import React, { useEffect, useMemo, useState } from 'react';
import { 
  MapPin, Clock, ShieldCheck, Star, 
  Award, Edit, Languages, Users,
  X, Plus, Save, Settings, Link2, GraduationCap, DollarSign
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { cn } from '../../admin/utils/cn';
import { useFreelancer } from '../context/FreelancerContext';
import { FREELANCER_WORK_MODES, FREELANCER_ACCOUNT_TYPES } from '../../common/constants/accountTypes';
import toast, { Toaster } from 'react-hot-toast';
import { profileAPI } from '../../common/services/api';
import { getProfileSummary } from '../../common/utils/profile';

export default function ProfilePage() {
  const { accountType, workMode, setWorkMode, persistProfile } = useFreelancer();

  const emptyProfile = () => ({
    firstName: '',
    lastName: '',
    title: '',
    location: '',
    avatar: '',
    bio: '',
    skills: [],
    hourlyRate: '',
    availability: '',
    education: [],
    certifications: [],
    linkedAccounts: [],
    teamSize: '',
    companyName: '',
  });

  const [profileData, setProfileData] = useState({
    INDIVIDUAL: emptyProfile(),
    SME: emptyProfile(),
    CORPORATE: emptyProfile(),
  });

  useEffect(() => {
    let cancelled = false;
    const hydrateProfile = async () => {
      try {
        const res = await profileAPI.getMyProfile();
        const userProfile = res?.user?.profile || res?.user || {};
        if (cancelled) return;
        const currentType = accountType === 'CORPORATE' ? 'CORPORATE' : accountType === 'SME' ? 'SME' : 'INDIVIDUAL';
        setProfileData((prev) => ({
          ...prev,
          [currentType]: {
            ...prev[currentType],
            firstName: userProfile.firstName || res?.user?.firstName || prev[currentType].firstName,
            lastName: userProfile.lastName || res?.user?.lastName || prev[currentType].lastName,
            title: userProfile.professionalTitle || userProfile.title || prev[currentType].title,
            location: userProfile.location || prev[currentType].location,
            avatar: userProfile.avatar || res?.user?.avatar || prev[currentType].avatar,
            bio: userProfile.bio || userProfile.description || prev[currentType].bio,
            skills: Array.isArray(userProfile.skills) && userProfile.skills.length ? userProfile.skills : prev[currentType].skills,
            hourlyRate: userProfile.hourlyRate || prev[currentType].hourlyRate,
            availability: userProfile.availability || prev[currentType].availability,
            teamSize: userProfile.teamSize || prev[currentType].teamSize,
            education: Array.isArray(userProfile.education) ? userProfile.education : prev[currentType].education,
            certifications: Array.isArray(userProfile.certifications) && userProfile.certifications.length ? userProfile.certifications : prev[currentType].certifications,
            linkedAccounts: Array.isArray(userProfile.linkedAccounts) && userProfile.linkedAccounts.length ? userProfile.linkedAccounts : prev[currentType].linkedAccounts,
            companyName: userProfile.companyName || res?.user?.companyName || prev[currentType].companyName,
          }
        }));
      } catch (_) {
        // Keep the local preview data when the profile endpoint is not ready.
      }
    };
    hydrateProfile();
    return () => { cancelled = true; };
  }, [accountType]);

  const [activeTab, setActiveTab] = useState('gigs'); // 'gigs' | 'portfolio' | 'reviews' | 'fiverr_edit'
  const [languages, setLanguages] = useState([
    { name: 'English', level: 'Native/Bilingual' },
    { name: 'Spanish', level: 'Conversational' }
  ]);

  // Modal active states
  const [activeModal, setActiveModal] = useState(null); // 'bio' | 'skills' | 'languages' | 'location'
  const [tempBioForm, setTempBioForm] = useState({ title: '', bio: '' });
  const [tempLocation, setTempLocation] = useState('');
  const [tempSkill, setTempSkill] = useState('');
  const [tempLanguage, setTempLanguage] = useState({ name: '', level: 'Conversational' });

  // Fiverr Form local states
  const [fiverrForm, setFiverrForm] = useState({
    title: '',
    hourlyRate: '',
    availability: '',
    bio: '',
    newEduSchool: '',
    newEduDegree: '',
    newEduYear: '',
    newCertTitle: '',
    newCertAuth: '',
    newCertYear: '',
    newSkill: '',
    newLangName: '',
    newLangLevel: 'Fluent'
  });

  const profileKey = accountType === 'CORPORATE' ? 'CORPORATE' : accountType === 'SME' ? 'SME' : 'INDIVIDUAL';
  const currentProfile = profileData[profileKey] || profileData.INDIVIDUAL;
  const liveSummary = useMemo(() => getProfileSummary({}, currentProfile), [currentProfile]);

  const commonData = {
    memberSince: 'Mar 2024',
    avgResponseTime: '1 hour',
    lastDelivery: 'about 2 hours ago',
    rating: 4.9,
    reviews: 142,
    gigs: [
      { id: 1, title: 'I will build a full-stack SaaS application in React and Node.js', price: 950, image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&h=300&fit=crop', rating: 5.0, reviews: 45 },
      { id: 2, title: 'I will fix bugs and optimize your React frontend', price: 150, image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop', rating: 4.9, reviews: 89 },
      { id: 3, title: 'I will design and develop a responsive landing page', price: 350, image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop', rating: 4.8, reviews: 8 }
    ],
    portfolio: [
      { id: 1, title: 'Fintech Dashboard', category: 'Web Application', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop' },
      { id: 2, title: 'E-Commerce Platform', category: 'Full Stack', image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop' },
    ],
    reviewsList: [
      { id: 1, user: 'tech_founder', country: 'United States', rating: 5, date: '1 week ago', text: 'Incredible to work with. Delivered the application ahead of schedule and the code quality is top-notch. Highly recommended!' },
      { id: 2, user: 'sarah_designs', country: 'Canada', rating: 5, date: '3 weeks ago', text: 'Exceptional communication and great attention to detail. Fixed our complex state management bugs in just a few hours.' }
    ]
  };

  const handleOpenFiverrForm = () => {
    setFiverrForm({
      title: currentProfile.title,
      hourlyRate: currentProfile.hourlyRate,
      availability: currentProfile.availability,
      bio: currentProfile.bio,
      newEduSchool: '',
      newEduDegree: '',
      newEduYear: '',
      newCertTitle: '',
      newCertAuth: '',
      newCertYear: '',
      newSkill: '',
      newLangName: '',
      newLangLevel: 'Fluent'
    });
    setActiveTab('fiverr_edit');
  };

  const handleSaveFiverrProfile = async (e) => {
    e.preventDefault();
    const key = profileKey;
    setProfileData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        title: fiverrForm.title,
        hourlyRate: fiverrForm.hourlyRate,
        availability: fiverrForm.availability,
        bio: fiverrForm.bio,
      },
    }));
    try {
      await persistProfile({
        accountType,
        workMode,
        professionalTitle: fiverrForm.title,
        title: fiverrForm.title,
        hourlyRate: fiverrForm.hourlyRate,
        availability: fiverrForm.availability,
        bio: fiverrForm.bio,
        description: fiverrForm.bio,
        firstName: profileData[key]?.firstName,
        lastName: profileData[key]?.lastName,
        location: profileData[key]?.location,
        skills: profileData[key]?.skills,
        teamSize: profileData[key]?.teamSize,
      });
      toast.success('Profile saved to your account');
    } catch (err) {
      toast.error(err.message || 'Could not save profile');
    }
    setActiveTab('gigs');
  };

  const handleAddFiverrEdu = () => {
    if (!fiverrForm.newEduSchool || !fiverrForm.newEduDegree || !fiverrForm.newEduYear) {
      toast.error('Please fill in all education fields.');
      return;
    }
    const newEntry = {
      school: fiverrForm.newEduSchool,
      degree: fiverrForm.newEduDegree,
      year: fiverrForm.newEduYear
    };
    setProfileData(prev => ({
      ...prev,
      [accountType]: {
        ...prev[accountType],
        education: [...prev[accountType].education, newEntry]
      }
    }));
    setFiverrForm(prev => ({
      ...prev,
      newEduSchool: '',
      newEduDegree: '',
      newEduYear: ''
    }));
    toast.success('Education record added.');
  };

  const handleRemoveFiverrEdu = (idx) => {
    setProfileData(prev => ({
      ...prev,
      [accountType]: {
        ...prev[accountType],
        education: prev[accountType].education.filter((_, i) => i !== idx)
      }
    }));
    toast.success('Education record removed.');
  };

  const handleAddFiverrCert = () => {
    if (!fiverrForm.newCertTitle || !fiverrForm.newCertAuth || !fiverrForm.newCertYear) {
      toast.error('Please fill in all certification fields.');
      return;
    }
    const newEntry = {
      title: fiverrForm.newCertTitle,
      authority: fiverrForm.newCertAuth,
      year: fiverrForm.newCertYear
    };
    setProfileData(prev => ({
      ...prev,
      [accountType]: {
        ...prev[accountType],
        certifications: [...prev[accountType].certifications, newEntry]
      }
    }));
    setFiverrForm(prev => ({
      ...prev,
      newCertTitle: '',
      newCertAuth: '',
      newCertYear: ''
    }));
    toast.success('Certification badge added.');
  };

  const handleRemoveFiverrCert = (idx) => {
    setProfileData(prev => ({
      ...prev,
      [accountType]: {
        ...prev[accountType],
        certifications: prev[accountType].certifications.filter((_, i) => i !== idx)
      }
    }));
    toast.success('Certification badge removed.');
  };

  const saveBio = (e) => {
    e.preventDefault();
    setProfileData(prev => ({
      ...prev,
      [accountType]: {
        ...prev[accountType],
        title: tempBioForm.title,
        bio: tempBioForm.bio
      }
    }));
    toast.success('Description updated successfully!');
    setActiveModal(null);
  };

  const openLocationModal = () => {
    setTempLocation(currentProfile.location);
    setActiveModal('location');
  };

  const saveLocation = (e) => {
    e.preventDefault();
    setProfileData(prev => ({
      ...prev,
      [accountType]: {
        ...prev[accountType],
        location: tempLocation
      }
    }));
    toast.success('Location updated successfully!');
    setActiveModal(null);
  };

  const removeSkill = (skillToRemove) => {
    setProfileData(prev => ({
      ...prev,
      [accountType]: {
        ...prev[accountType],
        skills: prev[accountType].skills.filter(s => s !== skillToRemove)
      }
    }));
    toast.success(`Removed skill: ${skillToRemove}`);
  };

  const addSkill = (e) => {
    e.preventDefault();
    if (!tempSkill.trim()) return;
    if (currentProfile.skills.includes(tempSkill.trim())) {
      toast.error('Skill already exists!');
      return;
    }
    setProfileData(prev => ({
      ...prev,
      [accountType]: {
        ...prev[accountType],
        skills: [...prev[accountType].skills, tempSkill.trim()]
      }
    }));
    toast.success(`Added skill: ${tempSkill.trim()}`);
    setTempSkill('');
  };

  const addLanguage = (e) => {
    e.preventDefault();
    if (!tempLanguage.name.trim()) return;
    if (languages.some(l => l.name.toLowerCase() === tempLanguage.name.trim().toLowerCase())) {
      toast.error('Language already added!');
      return;
    }
    setLanguages([...languages, { name: tempLanguage.name.trim(), level: tempLanguage.level }]);
    toast.success(`Added language: ${tempLanguage.name}`);
    setTempLanguage({ name: '', level: 'Conversational' });
  };

  const removeLanguage = (name) => {
    setLanguages(languages.filter(l => l.name !== name));
    toast.success(`Removed language: ${name}`);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-12 relative font-sans">
      <Toaster position="top-right" />
      
      {/* Top Banner */}
      <div className="h-48 rounded-2xl bg-gradient-to-r from-[#222222] to-success/90 relative overflow-hidden shadow-lg border border-white/10">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
        <div className="absolute top-4 right-4 flex gap-2 z-20">
          <button 
            onClick={handleOpenFiverrForm}
            className="px-4 py-2 bg-white text-[#222222] hover:bg-zinc-100 rounded-xl text-xs font-black shadow-lg transition-all flex items-center gap-1.5 border border-transparent"
          >
            <Settings size={14} className="animate-spin-slow" />
            Edit Fiverr Profile
          </button>
          <button className="px-4 py-2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/20">
            Change Banner
          </button>
        </div>
      </div>

      <div className="px-4 space-y-4">
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">Freelancer account type</h2>
          <div className="grid sm:grid-cols-3 gap-2 mb-4">
            {FREELANCER_ACCOUNT_TYPES.map((type) => (
              <div
                key={type.id}
                className={`p-3 rounded-lg border text-left ${
                  accountType === type.id ? 'border-[#14a800] bg-[#14a800]/5' : 'border-zinc-200 bg-zinc-50'
                }`}
              >
                <p className="text-sm font-bold text-zinc-900">{type.label}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{type.description}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-zinc-500 mb-2">Switch type from the sidebar simulator or settings.</p>
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Work mode</h2>
          <div className="grid sm:grid-cols-3 gap-2">
            {FREELANCER_WORK_MODES.map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setWorkMode(mode.id)}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  workMode === mode.id
                    ? 'border-[#14a800] bg-[#14a800]/5'
                    : 'border-zinc-200 hover:border-[#14a800]/30'
                }`}
              >
                <p className="text-sm font-bold text-zinc-900">{mode.label}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{mode.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 -mt-20 relative z-10">
        
        {/* Left Column: Freelancer Details */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="text-center p-8 border-t-4 border-t-success relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-xl">
            <div className="relative inline-block mb-4">
              <div className={cn("w-32 h-32 mx-auto border-4 border-white shadow-xl overflow-hidden bg-light-gray flex items-center justify-center relative group cursor-pointer", profileKey === 'INDIVIDUAL' ? 'rounded-full' : 'rounded-xl')}>
                <img src={currentProfile.avatar} alt="Profile" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold">
                  Update Avatar
                </div>
              </div>
              <div className="absolute bottom-2 right-2 w-5 h-5 bg-success border-2 border-white rounded-full z-10"></div>
            </div>
            
            <h1 className="text-2xl font-black text-text-primary flex items-center justify-center gap-2">
              {currentProfile.firstName || currentProfile.companyName || 'Freelancer'} {currentProfile.lastName || ''}
              <ShieldCheck className="w-5 h-5 text-success" />
            </h1>
            <p className="text-sm font-bold text-text-secondary mt-1">{currentProfile.title}</p>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-success mt-1">{liveSummary.persona} profile</p>
            
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="flex text-[#e63946]">
                {[1,2,3,4,5].map(i => <Star key={i} size={16} fill={i <= Math.floor(commonData.rating) ? 'currentColor' : 'none'} />)}
              </div>
              <span className="font-bold text-text-primary">{commonData.rating}</span>
              <span className="text-text-secondary text-sm">({commonData.reviews} reviews)</span>
            </div>

            <div className="mt-8 pt-6 border-t border-border space-y-4 text-sm">
              <div className="flex justify-between items-center group">
                <span className="text-text-secondary flex items-center gap-2"><MapPin size={16} /> From</span>
                <span className="font-bold text-text-primary flex items-center gap-1.5">
                  {currentProfile.location}
                  <button onClick={openLocationModal} className="text-text-secondary hover:text-success opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit size={14} />
                  </button>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary flex items-center gap-2"><Clock size={16} /> Member since</span>
                <span className="font-bold text-text-primary">{commonData.memberSince}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary flex items-center gap-2"><DollarSign size={16} /> Hourly Rate</span>
                <span className="font-black text-[#222222] text-sm">
                  {currentProfile.hourlyRate
                    ? `KES ${Number(currentProfile.hourlyRate).toLocaleString()}/hr`
                    : '—'}
                </span>
              </div>
              {profileKey !== 'INDIVIDUAL' && (
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary flex items-center gap-2"><Users size={16} /> Team Size</span>
                  <span className="font-bold text-text-primary">{currentProfile.teamSize}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Linked Social Accounts */}
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
            <h2 className="font-bold text-text-primary mb-4 flex items-center gap-2">
              <Link2 size={16} className="text-success" /> Linked Accounts
            </h2>
            <div className="space-y-3">
              {['GitHub', 'LinkedIn', 'Google', 'Twitter'].map(net => {
                const isLinked = currentProfile.linkedAccounts.includes(net);
                return (
                  <div key={net} className="flex justify-between items-center text-xs p-2.5 bg-light-gray/40 rounded-xl">
                    <span className="font-bold text-text-primary">{net}</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider",
                      isLinked ? "bg-success/15 text-success" : "bg-light-gray text-text-secondary"
                    )}>
                      {isLinked ? 'Linked' : 'Not Linked'}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column: Main Content Tabs / Fiverr Settings Form */}
        <div className="lg:col-span-2 space-y-8 mt-20 lg:mt-0">
          
          <div className="flex gap-4 border-b border-border">
            <button 
              onClick={() => setActiveTab('gigs')} 
              className={cn("pb-4 text-sm font-bold transition-all border-b-2", activeTab === 'gigs' ? "border-success text-text-primary" : "border-transparent text-text-secondary hover:text-text-primary")}
            >
              Active Gigs
            </button>
            <button 
              onClick={() => setActiveTab('portfolio')} 
              className={cn("pb-4 text-sm font-bold transition-all border-b-2", activeTab === 'portfolio' ? "border-success text-text-primary" : "border-transparent text-text-secondary hover:text-text-primary")}
            >
              Portfolio Showcase
            </button>
            <button 
              onClick={() => setActiveTab('reviews')} 
              className={cn("pb-4 text-sm font-bold transition-all border-b-2", activeTab === 'reviews' ? "border-success text-text-primary" : "border-transparent text-text-secondary hover:text-text-primary")}
            >
              Reviews ({commonData.reviews})
            </button>
            {activeTab === 'fiverr_edit' && (
              <button 
                className="pb-4 text-sm font-black transition-all border-b-2 border-success text-success flex items-center gap-1.5"
              >
                <Settings size={14} className="animate-spin-slow" />
                Fiverr Seller Portal
              </button>
            )}
          </div>

          {activeTab === 'gigs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-300">
              {commonData.gigs.map(gig => (
                <div key={gig.id} className="bg-white border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all group cursor-pointer flex flex-col justify-between">
                  <div>
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img src={gig.image} alt={gig.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-sm text-text-primary line-clamp-2 hover:text-success transition-colors">{gig.title}</h3>
                      <div className="flex items-center gap-1 mt-2 text-sm">
                        <Star size={14} className="text-[#e63946]" fill="currentColor" />
                        <span className="font-bold text-text-primary">{gig.rating}</span>
                        <span className="text-text-secondary">({gig.reviews})</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 border-t border-border flex justify-between items-center bg-light-gray group-hover:bg-white transition-colors">
                    <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Starting At</span>
                    <span className="font-black text-lg text-text-primary">${gig.price}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
              {commonData.portfolio.map(item => (
                <div key={item.id} className="relative rounded-xl overflow-hidden group cursor-pointer border border-border shadow-sm">
                  <div className="aspect-video bg-light-gray">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#222222]/90 via-[#222222]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <span className="text-xs font-bold text-white/70 uppercase tracking-widest mb-1">{item.category}</span>
                    <h3 className="font-bold text-lg text-white">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <Card className="animate-in fade-in duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
              <div className="flex justify-between items-center mb-8 pb-6 border-b border-border">
                <div>
                  <h2 className="text-xl font-black text-text-primary">Reviews as Seller</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex text-[#e63946]">
                      {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                    </div>
                    <span className="font-bold text-text-primary">4.9</span>
                    <span className="text-text-secondary text-sm">({commonData.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {commonData.reviewsList.map(review => (
                  <div key={review.id} className="pb-8 border-b border-border last:border-0 last:pb-0">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-success/20 text-success flex items-center justify-center font-bold shrink-0">
                        {review.user[0].toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-text-primary">{review.user}</h4>
                          <span className="text-text-secondary text-xs flex items-center gap-1">
                            <MapPin size={12} /> {review.country}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 mb-3">
                          <div className="flex text-[#e63946]">
                            {[1,2,3,4,5].map(i => <Star key={i} size={12} fill={i <= review.rating ? 'currentColor' : 'none'} />)}
                          </div>
                          <span className="text-xs text-text-secondary">{review.date}</span>
                        </div>
                        <p className="text-sm text-text-primary leading-relaxed">{review.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Fiverr Seller Setup Form View */}
          {activeTab === 'fiverr_edit' && (
            <form onSubmit={handleSaveFiverrProfile} className="bg-white/90 border border-border p-8 rounded-3xl shadow-xl space-y-8 animate-in fade-in duration-300 relative">
              <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-success/5 blur-[100px] rounded-full pointer-events-none"></div>
              
              <div className="flex justify-between items-center border-b border-border pb-4 relative z-10">
                <div>
                  <h2 className="text-xl font-black text-[#222222] flex items-center gap-2">
                    <Settings className="w-5 h-5 text-success" />
                    Fiverr Seller Profile Setup
                  </h2>
                  <p className="text-xs font-medium text-text-secondary mt-1">Configure your public visibility parameters and marketplace offerings.</p>
                </div>
                <Button type="button" variant="outline" onClick={() => setActiveTab('gigs')}>Cancel</Button>
              </div>

              {/* Step 1: General Professional Credentials */}
              <div className="space-y-4 relative z-10">
                <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest border-l-2 border-success pl-2">1. Profile Overview Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-text-secondary tracking-widest mb-1.5">Professional Tagline</label>
                    <input 
                      type="text"
                      value={fiverrForm.title}
                      onChange={(e) => setFiverrForm({ ...fiverrForm, title: e.target.value })}
                      className="w-full px-4 py-2.5 bg-light-gray/50 border border-border rounded-xl text-sm font-semibold"
                      placeholder="e.g. Senior Fullstack Engineer"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-text-secondary tracking-widest mb-1.5">Hourly Rate (KES)</label>
                    <input 
                      type="number"
                      value={fiverrForm.hourlyRate}
                      onChange={(e) => setFiverrForm({ ...fiverrForm, hourlyRate: e.target.value })}
                      className="w-full px-4 py-2.5 bg-light-gray/50 border border-border rounded-xl text-sm font-semibold text-[#222222]"
                      placeholder="8500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-text-secondary tracking-widest mb-1.5">Availability Status</label>
                  <select
                    value={fiverrForm.availability}
                    onChange={(e) => setFiverrForm({ ...fiverrForm, availability: e.target.value })}
                    className="w-full px-4 py-2.5 bg-light-gray/50 border border-border rounded-xl text-sm font-semibold outline-none"
                  >
                    <option value="Active">Active (Ready to take custom orders)</option>
                    <option value="Vacation">Vacation Mode (Temporary paused)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-text-secondary tracking-widest mb-1.5">Detailed Biography</label>
                  <textarea
                    rows={4}
                    value={fiverrForm.bio}
                    onChange={(e) => setFiverrForm({ ...fiverrForm, bio: e.target.value })}
                    className="w-full px-4 py-2.5 bg-light-gray/50 border border-border rounded-xl text-sm font-medium resize-none"
                    placeholder="Describe your credentials, industry experiences, and core competencies..."
                    required
                  />
                </div>
              </div>

              {/* Step 2: Dynamic Education Setup */}
              <div className="space-y-4 relative z-10 pt-4 border-t border-border/50">
                <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest border-l-2 border-success pl-2 flex items-center gap-1.5">
                  <GraduationCap size={16} /> 2. Academic Background
                </h3>
                
                {/* Dynamic Edu List */}
                {currentProfile.education && currentProfile.education.length > 0 ? (
                  <div className="space-y-2">
                    {currentProfile.education.map((edu, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-light-gray/30 border border-border rounded-xl text-xs font-semibold text-text-primary">
                        <div>
                          <p className="font-bold text-[#222222]">{edu.degree}</p>
                          <p className="text-[10px] text-text-secondary">{edu.school} — Class of {edu.year}</p>
                        </div>
                        <button type="button" onClick={() => handleRemoveFiverrEdu(idx)} className="p-1 hover:text-[#e63946] transition-colors">
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-text-secondary font-medium">No education history added yet. Highlight your college credentials below.</p>
                )}

                {/* Add Edu Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-light-gray/20 p-4 rounded-2xl border border-border/50">
                  <div>
                    <input 
                      type="text"
                      value={fiverrForm.newEduSchool}
                      onChange={(e) => setFiverrForm({ ...fiverrForm, newEduSchool: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-border rounded-lg text-xs font-semibold"
                      placeholder="School / College"
                    />
                  </div>
                  <div>
                    <input 
                      type="text"
                      value={fiverrForm.newEduDegree}
                      onChange={(e) => setFiverrForm({ ...fiverrForm, newEduDegree: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-border rounded-lg text-xs font-semibold"
                      placeholder="Degree / Certificate"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="number"
                      value={fiverrForm.newEduYear}
                      onChange={(e) => setFiverrForm({ ...fiverrForm, newEduYear: e.target.value })}
                      className="flex-1 px-3 py-2 bg-white border border-border rounded-lg text-xs font-semibold"
                      placeholder="Graduation Year"
                    />
                    <button 
                      type="button" 
                      onClick={handleAddFiverrEdu}
                      className="px-3 bg-[#222222] text-white text-xs font-black rounded-lg hover:bg-[#222222]/90"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 3: Dynamic Professional Certifications */}
              <div className="space-y-4 relative z-10 pt-4 border-t border-border/50">
                <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest border-l-2 border-success pl-2 flex items-center gap-1.5">
                  <Award size={16} /> 3. Verified Certifications
                </h3>

                {/* Dynamic Certifications List */}
                {currentProfile.certifications && currentProfile.certifications.length > 0 ? (
                  <div className="space-y-2">
                    {currentProfile.certifications.map((cert, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-light-gray/30 border border-border rounded-xl text-xs font-semibold text-text-primary">
                        <div>
                          <p className="font-bold text-[#222222]">{cert.title}</p>
                          <p className="text-[10px] text-text-secondary">{cert.authority} — Awarded {cert.year}</p>
                        </div>
                        <button type="button" onClick={() => handleRemoveFiverrCert(idx)} className="p-1 hover:text-[#e63946] transition-colors">
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-text-secondary font-medium">No certifications registered yet.</p>
                )}

                {/* Add Cert Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-light-gray/20 p-4 rounded-2xl border border-border/50">
                  <div>
                    <input 
                      type="text"
                      value={fiverrForm.newCertTitle}
                      onChange={(e) => setFiverrForm({ ...fiverrForm, newCertTitle: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-border rounded-lg text-xs font-semibold"
                      placeholder="Certification Title"
                    />
                  </div>
                  <div>
                    <input 
                      type="text"
                      value={fiverrForm.newCertAuth}
                      onChange={(e) => setFiverrForm({ ...fiverrForm, newCertAuth: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-border rounded-lg text-xs font-semibold"
                      placeholder="Issuing Authority"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="number"
                      value={fiverrForm.newCertYear}
                      onChange={(e) => setFiverrForm({ ...fiverrForm, newCertYear: e.target.value })}
                      className="flex-1 px-3 py-2 bg-white border border-border rounded-lg text-xs font-semibold"
                      placeholder="Year Awarded"
                    />
                    <button 
                      type="button" 
                      onClick={handleAddFiverrCert}
                      className="px-3 bg-[#222222] text-white text-xs font-black rounded-lg hover:bg-[#222222]/90"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-border relative z-10">
                <Button type="button" variant="outline" onClick={() => setActiveTab('gigs')}>Discard Changes</Button>
                <Button type="submit" variant="primary" icon={<Save size={16} />}>Save Fiverr Profile</Button>
              </div>
            </form>
          )}

        </div>
      </div>

      {/* --- MODALS --- */}
      {activeModal === 'bio' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <Card className="w-full max-w-lg shadow-2xl relative bg-white border border-border p-6 rounded-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-black text-text-primary mb-4 flex items-center gap-2">
              <Edit className="w-5 h-5 text-success" />
              Edit Description
            </h3>
            <form onSubmit={saveBio} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1">Professional Title</label>
                <input 
                  type="text" 
                  value={tempBioForm.title} 
                  onChange={(e) => setTempBioForm({ ...tempBioForm, title: e.target.value })} 
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-success text-sm text-text-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1">Bio / Overview</label>
                <textarea 
                  rows={5} 
                  value={tempBioForm.bio} 
                  onChange={(e) => setTempBioForm({ ...tempBioForm, bio: e.target.value })} 
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-success text-sm text-text-primary resize-none"
                  required
                />
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <Button type="button" variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
                <Button type="submit" variant="primary">Save Changes</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {activeModal === 'location' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <Card className="w-full max-w-md shadow-2xl relative bg-white border border-border p-6 rounded-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-black text-text-primary mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-success" />
              Update Location
            </h3>
            <form onSubmit={saveLocation} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1">City, Country</label>
                <input 
                  type="text" 
                  value={tempLocation} 
                  onChange={(e) => setTempLocation(e.target.value)} 
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-success text-sm text-text-primary"
                  placeholder="e.g. San Francisco, CA"
                  required
                />
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <Button type="button" variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
                <Button type="submit" variant="primary">Save Changes</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {activeModal === 'skills' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <Card className="w-full max-w-md shadow-2xl relative bg-white border border-border p-6 rounded-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black text-text-primary flex items-center gap-2">
                <Plus className="w-5 h-5 text-success" />
                Add Skill Tags
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1.5 hover:bg-light-gray rounded-md transition-colors text-text-secondary"><X size={18} /></button>
            </div>
            
            <form onSubmit={addSkill} className="flex gap-2 mb-6">
              <input 
                type="text" 
                value={tempSkill} 
                onChange={(e) => setTempSkill(e.target.value)} 
                placeholder="e.g. Next.js, Docker..." 
                className="flex-1 px-4 py-2 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-success text-sm text-text-primary"
              />
              <Button type="submit" variant="primary">Add</Button>
            </form>

            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1 border border-border/50 rounded-xl bg-light-gray/20">
              {currentProfile.skills.map((skill, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-light-gray border border-border rounded-full text-xs font-bold text-text-primary">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="text-text-secondary hover:text-[#e63946] transition-colors">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeModal === 'languages' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <Card className="w-full max-w-md shadow-2xl relative bg-white border border-border p-6 rounded-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black text-text-primary flex items-center gap-2">
                <Languages className="w-5 h-5 text-success" />
                Manage Languages
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1.5 hover:bg-light-gray rounded-md transition-colors text-text-secondary"><X size={18} /></button>
            </div>
            
            <form onSubmit={addLanguage} className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1">Language Name</label>
                <input 
                  type="text" 
                  value={tempLanguage.name} 
                  onChange={(e) => setTempLanguage({ ...tempLanguage, name: e.target.value })} 
                  placeholder="e.g. French, German..." 
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-success text-sm text-text-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1">Fluency Level</label>
                <select 
                  value={tempLanguage.level} 
                  onChange={(e) => setTempLanguage({ ...tempLanguage, level: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-success text-sm text-text-primary appearance-none"
                >
                  <option value="Basic">Basic</option>
                  <option value="Conversational">Conversational</option>
                  <option value="Fluent">Fluent</option>
                  <option value="Native/Bilingual">Native/Bilingual</option>
                </select>
              </div>
              <Button type="submit" variant="primary" className="w-full">Add Language</Button>
            </form>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {languages.map((lang, idx) => (
                <div key={idx} className="flex justify-between items-center p-2.5 bg-light-gray/40 rounded-xl">
                  <div className="text-sm">
                    <span className="font-bold text-text-primary">{lang.name}</span>
                    <span className="text-text-secondary text-xs ml-2">({lang.level})</span>
                  </div>
                  <button onClick={() => removeLanguage(lang.name)} className="text-text-secondary hover:text-[#e63946] p-1 hover:bg-light-gray rounded-md">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

    </div>
  );
}

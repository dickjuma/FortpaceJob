// src/pages/freelancer/ProfilePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Clock, ShieldCheck, Star,
  Award, Edit, Languages, Users,
  X, Plus, Save, Settings, Link2, GraduationCap, DollarSign, Check, Camera
} from 'lucide-react';
import { useFreelancerProfile, useUpdateFreelancerProfile } from '../services/freelancerHooks';

// Keep original API structure - preserve for actual implementation
// import { useFreelancer } from '../context/FreelancerContext';
// import { FREELANCER_WORK_MODES, FREELANCER_ACCOUNT_TYPES } from '../../platform/common/constants/accountTypes';
import { profileAPI } from '../../platform/common/services/api';
// import { getProfileSummary } from '../../platform/common/utils/profile';

const defaultProfileData = {
  firstName: '',
  lastName: '',
  title: '',
  location: '',
  avatar: '',
  bio: '',
  skills: [],
  hourlyRate: 0,
  availability: '',
  education: [],
  certifications: [],
  linkedAccounts: [],
  teamSize: 0,
  companyName: ''
};

const commonData = {
  memberSince: '',
  avgResponseTime: '',
  lastDelivery: '',
  rating: 0,
  reviews: 0,
  gigs: [],
  portfolio: [],
  reviewsList: []
};

export default function ProfilePage() {
  const { data: backendProfile = {} } = useFreelancerProfile();
  const updateProfile = useUpdateFreelancerProfile();
  const [profileData, setProfileData] = useState(defaultProfileData);
  const [activeTab, setActiveTab] = useState('gigs');
  const [activeModal, setActiveModal] = useState(null);
  const [tempLocation, setTempLocation] = useState('');
  const [tempSkill, setTempSkill] = useState('');
  const [showSuccess, setShowSuccess] = useState(null);
  const [accountType] = useState('INDIVIDUAL');
  const [workMode, setWorkMode] = useState('ONLINE');

  const [uploadingImage, setUploadingImage] = useState(null);
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  useEffect(() => {
    if (!backendProfile) return;
    setProfileData(prev => ({
      ...prev,
      firstName: backendProfile.firstName || backendProfile.name || prev.firstName,
      lastName: backendProfile.lastName || backendProfile.surname || prev.lastName,
      title: backendProfile.title || backendProfile.professionalTitle || prev.title,
      location: backendProfile.location || backendProfile.address || prev.location,
      avatar: backendProfile.avatar || backendProfile.picture || prev.avatar,
      bio: backendProfile.bio || backendProfile.summary || prev.bio,
      skills: backendProfile.skills || prev.skills,
      hourlyRate: backendProfile.hourlyRate || backendProfile.rate || prev.hourlyRate,
      availability: backendProfile.availability || prev.availability,
      education: backendProfile.education || prev.education,
      certifications: backendProfile.certifications || prev.certifications,
      linkedAccounts: backendProfile.linkedAccounts || prev.linkedAccounts,
      teamSize: backendProfile.teamSize || prev.teamSize,
      companyName: backendProfile.companyName || backendProfile.company || prev.companyName,
    }));
  }, [backendProfile]);

  const openLocationModal = () => {
    setTempLocation(profileData.location);
    setActiveModal('location');
  };

  const saveLocation = async (e) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync({ location: tempLocation });
      setProfileData(prev => ({ ...prev, location: tempLocation }));
      setShowSuccess({ message: 'Location updated' });
      setActiveModal(null);
    } catch (err) {
      setShowSuccess({ message: 'Failed to update location', isError: true });
    }
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const addSkill = async (e) => {
    e.preventDefault();
    if (!tempSkill.trim()) return;
    if (profileData.skills.includes(tempSkill.trim())) {
      setShowSuccess({ message: 'Skill already exists', isError: true });
      setTimeout(() => setShowSuccess(null), 2000);
      return;
    }
    try {
      const newSkills = [...profileData.skills, tempSkill.trim()];
      await updateProfile.mutateAsync({ skills: newSkills });
      setProfileData(prev => ({ ...prev, skills: newSkills }));
      setTempSkill('');
      setShowSuccess({ message: 'Skill added' });
    } catch (err) {
      setShowSuccess({ message: 'Failed to add skill', isError: true });
    }
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const removeSkill = async (skillToRemove) => {
    try {
      const newSkills = profileData.skills.filter(s => s !== skillToRemove);
      await updateProfile.mutateAsync({ skills: newSkills });
      setProfileData(prev => ({ ...prev, skills: newSkills }));
      setShowSuccess({ message: 'Skill removed' });
    } catch (err) {
      setShowSuccess({ message: 'Failed to remove skill', isError: true });
    }
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const handleEditProfile = () => {
    setShowSuccess({ message: 'Edit profile form would open' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const FREELANCER_ACCOUNT_TYPES = [
    { id: 'INDIVIDUAL', label: 'Individual', description: 'Solo freelancer working independently' },
    { id: 'SME', label: 'Small Business', description: 'Small team of 2-10 members' },
    { id: 'CORPORATE', label: 'Corporate', description: 'Large organization with 10+ members' }
  ];

  const FREELANCER_WORK_MODES = [
    { id: 'ONLINE', label: 'Online', description: 'Remote work only' },
    { id: 'OFFLINE', label: 'Offline', description: 'On-site work only' },
    { id: 'HYBRID', label: 'Hybrid', description: 'Mix of remote and on-site' }
  ];

  const handleImageUpload = async (type, file) => {
    setUploadingImage(type);
    try {
      const response =
        type === "avatar"
          ? await profileAPI.uploadAvatar(file)
          : await profileAPI.uploadCoverPhoto(file);

      const imageUrl =
        type === 'avatar'
          ? response?.user?.profile?.avatar || response?.user?.avatar || response?.url
          : response?.user?.profile?.coverPhoto || response?.user?.coverPhoto || response?.url;

      const stateKey = type === 'avatar' ? 'avatar' : 'coverPhoto';
      setProfileData((prev) => ({ ...prev, [stateKey]: imageUrl }));
      setShowSuccess({ message: `${type === 'avatar' ? 'Profile picture' : 'Cover photo'} updated` });
      setTimeout(() => setShowSuccess(null), 3000);
    } catch (error) {
      setShowSuccess({ message: `Failed to upload ${type}`, isError: true });
      setTimeout(() => setShowSuccess(null), 3000);
    } finally {
      setUploadingImage(null);
    }
  };

  const onAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload("avatar", e.target.files[0]);
    }
  };

  const onCoverChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload("cover", e.target.files[0]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Success Toast */}
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

      {/* Banner */}
      <div className="h-40 rounded-2xl bg-gradient-to-r from-brand-900 to-accent DEFAULT relative overflow-hidden shadow-sm mb-12 group">
        {profileData.coverPhoto ? (
          <img
            src={profileData.coverPhoto}
            alt="Cover"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,transparent_1px)] [background-size:24px_24px]" />
        )}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={() => coverInputRef.current?.click()}
            disabled={uploadingImage === 'cover'}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg text-white text-sm font-medium transition-all"
          >
            <Camera className="w-4 h-4" />
            {uploadingImage === 'cover' ? 'Uploading...' : 'Update Cover Photo'}
          </button>
          <input
            type="file"
            ref={coverInputRef}
            onChange={onCoverChange}
            accept="image/*"
            className="hidden"
          />
        </div>
        
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={handleEditProfile}
            className="px-4 py-1.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-lg text-xs font-body font-medium transition-colors border border-white/20"
          >
            Edit profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 -mt-20 relative z-10">

        {/* Left Column */}
        <div className="lg:col-span-1 space-y-5">
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm text-center">
            <div className="relative inline-block mb-4 group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
              <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-white shadow-sm relative">
                <img
                  src={profileData.avatar || `https://ui-avatars.com/api/?name=${profileData.firstName}+${profileData.lastName}&background=172554&color=fff`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  width={112}
                  height={112}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-accent DEFAULT border-2 border-white rounded-full" />
              <input
                type="file"
                ref={avatarInputRef}
                onChange={onAvatarChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            <h1 className="font-body font-semibold text-xl text-ink-primary">
              {profileData.firstName} {profileData.lastName}
            </h1>
            <p className="text-sm text-ink-secondary mt-1">{profileData.title}</p>

            <div className="flex items-center justify-center gap-1 mt-3">
              <Star className="w-4 h-4 fill-accent DEFAULT text-accent DEFAULT" />
              <span className="font-body font-semibold text-sm text-ink-primary">{commonData.rating}</span>
              <span className="text-sm text-ink-tertiary">({commonData.reviews} reviews)</span>
            </div>

            <div className="mt-5 pt-4 border-t border-border space-y-3 text-sm">
              <div className="flex justify-between items-center group">
                <span className="text-ink-tertiary flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Location
                </span>
                <span className="font-body font-medium text-ink-primary flex items-center gap-1">
                  {profileData.location}
                  <button onClick={openLocationModal} className="text-ink-tertiary hover:text-accent DEFAULT transition-colors">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ink-tertiary flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Member since
                </span>
                <span className="font-body font-medium text-ink-primary">{commonData.memberSince}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ink-tertiary flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Hourly rate
                </span>
                <span className="font-mono font-semibold text-ink-primary">KES {profileData.hourlyRate}/hr</span>
              </div>
            </div>
          </div>

          {/* Skills Card */}
          <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-body font-semibold text-ink-primary">Skills</h3>
              <button onClick={() => setActiveModal('skills')} className="text-accent DEFAULT hover:text-accent-dark transition-colors">
                <Edit className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profileData.skills.map(skill => (
                <span key={skill} className="px-2 py-0.5 bg-accent-light text-accent-dark text-xs font-body font-medium rounded-md">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Account Type & Work Mode */}
          <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
            <h2 className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-3">Account type</h2>
            <div className="space-y-2 mb-4">
              {FREELANCER_ACCOUNT_TYPES.map((type) => (
                <div
                  key={type.id}
                  className={`p-2 rounded-lg border text-left ${
                    accountType === type.id ? 'border-accent DEFAULT bg-accent-light' : 'border-border'
                  }`}
                >
                  <p className="text-sm font-body font-medium text-ink-primary">{type.label}</p>
                  <p className="text-xs text-ink-tertiary">{type.description}</p>
                </div>
              ))}
            </div>
            <h2 className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-2">Work mode</h2>
            <div className="grid grid-cols-3 gap-2">
              {FREELANCER_WORK_MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setWorkMode(mode.id)}
                  className={`p-2 rounded-lg border text-center transition-colors ${
                    workMode === mode.id ? 'border-accent DEFAULT bg-accent-light' : 'border-border'
                  }`}
                >
                  <p className="text-xs font-body font-medium text-ink-primary">{mode.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-5">

          {/* Tabs */}
          <div className="flex gap-5 border-b border-border">
            {['gigs', 'portfolio', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-body font-medium transition-all border-b-2 ${
                  activeTab === tab
                    ? "border-accent DEFAULT text-accent DEFAULT"
                    : "border-transparent text-ink-tertiary hover:text-ink-primary"
                }`}
              >
                {tab === 'gigs' ? 'Active gigs' : tab === 'portfolio' ? 'Portfolio' : 'Reviews'}
              </button>
            ))}
          </div>

          {/* Gigs Tab */}
          {activeTab === 'gigs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {commonData.gigs.map((gig, idx) => (
                <motion.div
                  key={gig.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white border border-border rounded-xl overflow-hidden hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={gig.image}
                      alt={gig.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      width={500}
                      height={300}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-body font-semibold text-sm text-ink-primary line-clamp-2">{gig.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <Star className="w-3.5 h-3.5 fill-accent DEFAULT text-accent DEFAULT" />
                      <span className="text-sm font-body font-medium text-ink-primary">{gig.rating}</span>
                      <span className="text-xs text-ink-tertiary">({gig.reviews})</span>
                    </div>
                    <div className="mt-3 pt-2 border-t border-border flex justify-between items-center">
                      <span className="text-xs text-ink-tertiary">Starting at</span>
                      <span className="font-mono font-bold text-ink-primary">KES {gig.price}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Portfolio Tab */}
          {activeTab === 'portfolio' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {commonData.portfolio.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="relative rounded-xl overflow-hidden group cursor-pointer border border-border shadow-sm"
                >
                  <div className="aspect-video bg-surface-muted">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      width={600}
                      height={400}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    <span className="text-xs text-white/80">{item.category}</span>
                    <h3 className="font-body font-semibold text-base text-white">{item.title}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-border">
                <div>
                  <h2 className="font-display font-semibold text-lg text-brand-900">Reviews</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-4 h-4 fill-accent DEFAULT text-accent DEFAULT" />
                    <span className="font-body font-semibold text-ink-primary">{commonData.rating}</span>
                    <span className="text-sm text-ink-tertiary">({commonData.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                {commonData.reviewsList.map(review => (
                  <div key={review.id} className="pb-5 border-b border-border last:border-0">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent-light flex items-center justify-center font-mono font-semibold text-accent-dark text-sm">
                        {review.user.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-body font-semibold text-sm text-ink-primary">{review.user}</h4>
                          <span className="text-xs text-ink-tertiary flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {review.country}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 mb-2">
                          <div className="flex">
                            {[1,2,3,4,5].map(i => (
                              <Star key={i} className={`w-3 h-3 ${i <= review.rating ? 'fill-accent DEFAULT text-accent DEFAULT' : 'text-border'}`} />
                            ))}
                          </div>
                          <span className="text-xs text-ink-tertiary">{review.date}</span>
                        </div>
                        <p className="text-sm text-ink-secondary leading-relaxed">{review.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Skills Modal */}
      <AnimatePresence>
        {activeModal === 'skills' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-border"
            >
              <div className="flex justify-between items-center p-5 border-b border-border">
                <h3 className="font-display font-semibold text-lg text-brand-900">Manage skills</h3>
                <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-surface-muted transition-colors">
                  <X className="w-5 h-5 text-ink-tertiary" />
                </button>
              </div>
              <div className="p-5">
                <form onSubmit={addSkill} className="flex gap-2 mb-5">
                  <input
                    type="text"
                    value={tempSkill}
                    onChange={(e) => setTempSkill(e.target.value)}
                    placeholder="e.g., Next.js, Docker..."
                    className="flex-1 h-10 px-3 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
                  />
                  <button type="submit" className="px-4 py-2 rounded-lg bg-brand-900 text-white hover:bg-brand-800 text-sm font-body font-medium transition-colors">
                    Add
                  </button>
                </form>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                  {profileData.skills.map((skill, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-accent-light text-accent-dark rounded-md text-xs font-body font-medium">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="hover:text-danger transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Location Modal */}
      <AnimatePresence>
        {activeModal === 'location' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-border"
            >
              <div className="flex justify-between items-center p-5 border-b border-border">
                <h3 className="font-display font-semibold text-lg text-brand-900">Update location</h3>
                <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-surface-muted transition-colors">
                  <X className="w-5 h-5 text-ink-tertiary" />
                </button>
              </div>
              <form onSubmit={saveLocation} className="p-5">
                <input
                  type="text"
                  value={tempLocation}
                  onChange={(e) => setTempLocation(e.target.value)}
                  className="w-full h-11 px-4 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900 mb-5"
                  placeholder="e.g., San Francisco, CA"
                  required
                />
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-lg border border-border text-ink-primary hover:bg-surface-muted text-sm font-body font-medium transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 rounded-lg bg-brand-900 text-white hover:bg-brand-800 text-sm font-body font-medium transition-colors">
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

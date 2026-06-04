import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BadgeInfo,
  Briefcase,
  Building2,
  Camera,
  Check,
  CheckCircle2,
  FileText,
  Globe,
  ImageIcon,
  Languages,
  Link2,
  Loader2,
  MapPin,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import { useAuthStore } from '../../common/authStore';
import { onboardingAPI, profileAPI } from '../../common/services/api';
import { getDashboardPathForRole } from '../utils/authRouting';
import { clearOnboardingDraft, loadOnboardingDraft, saveOnboardingDraft } from '../utils/onboardingDraft';

const STEPS = [
  { id: 'identity', label: 'Identity', description: 'Name, location, and media' },
  { id: 'role', label: 'Role setup', description: 'Client or freelancer profile core' },
  { id: 'profile', label: 'Profile story', description: 'Bio and public links' },
  { id: 'launch', label: 'Launch', description: 'Payment setup and review' },
];

const blankBackendStatus = {
  isComplete: false,
  completionPercentage: 0,
  currentStep: 'BASIC_INFO',
  steps: {},
};

const summarizeName = (value) => {
  const trimmed = String(value || '').trim();
  if (!trimmed) {
    return { firstName: '', lastName: '' };
  }

  const parts = trimmed.split(/\s+/).filter(Boolean);
  const firstName = parts.shift() || trimmed;
  const lastName = parts.join(' ');
  return { firstName, lastName };
};

const listToText = (value) => {
  if (Array.isArray(value)) return value.map((item) => String(item || '').trim()).filter(Boolean).join(', ');
  return String(value || '');
};

const textToList = (value) =>
  String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const SummaryRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 text-sm">
    <span className="text-zinc-500 dark:text-zinc-400">{label}</span>
    <span className="text-right font-semibold text-zinc-900 dark:text-white">{value}</span>
  </div>
);

const StepPill = ({ active, label, description }) => (
  <div
    className={cn(
      'rounded-2xl border px-4 py-3 transition-all',
      active
        ? 'border-[#2bb75c]/20 bg-[#2bb75c]/5 shadow-[0_14px_30px_rgba(20,168,0,0.08)]'
        : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'
    )}
  >
    <p className={cn('text-sm font-black uppercase tracking-[0.18em]', active ? 'text-[#2bb75c]' : 'text-zinc-400')}>
      {label}
    </p>
    <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">{description}</p>
  </div>
);

export default function ProfileCompletionPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const completionDestination = getDashboardPathForRole(user?.role);
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const draft = useMemo(() => loadOnboardingDraft(), []);
  const role = String(user?.role || '').toUpperCase();
  const isFreelancer = role === 'FREELANCER';

  const [activeStep, setActiveStep] = useState(1);
  const [backendStatus, setBackendStatus] = useState(blankBackendStatus);
  const [isFetchingStatus, setIsFetchingStatus] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [formData, setFormData] = useState({
    fullName: user?.name || draft.fullName || draft.name || '',
    country: draft.country || user?.country || '',
    city: draft.city || user?.city || '',
    timezone:
      draft.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'Africa/Nairobi',
    avatar: user?.avatar || draft.avatar || '',
    coverPhoto: user?.coverPhoto || draft.coverPhoto || '',
    professionalTitle: draft.professionalTitle || user?.professionalTitle || '',
    serviceCategory: draft.serviceCategory || draft.primarySkillCategory || user?.serviceCategory || '',
    skillsText: listToText(draft.skills),
    languagesText: listToText(draft.languages || user?.languages),
    hourlyRate: draft.hourlyRate || user?.hourlyRate || 50,
    currency: draft.currency || 'USD',
    availability: draft.availability || 'Available now',
    availabilityType: draft.availabilityType || 'FULL_TIME',
    bio: draft.bio || user?.bio || '',
    website: draft.website || user?.website || '',
    linkedin: draft.linkedin || user?.linkedin || '',
    github: draft.github || user?.github || '',
    companyName: draft.companyName || user?.companyName || '',
    companyDescription: draft.companyDescription || user?.companyDescription || '',
    industry: draft.industry || user?.industry || '',
    companySize: draft.companySize || user?.companySize || '',
    hiringType: draft.hiringType || user?.hiringType || 'PROJECT_BASED',
  });

  useEffect(() => {
    let mounted = true;

    onboardingAPI
      .getStatus()
      .then((response) => {
        if (!mounted) return;
        const data = response?.data ?? response ?? blankBackendStatus;
        setBackendStatus({
          ...blankBackendStatus,
          ...data,
          steps: data?.steps || {},
        });

        const steps = data?.steps || {};
        if (!steps.BASIC_INFO?.completed) {
          setActiveStep(1);
        } else if (!steps.ROLE_SETUP?.completed) {
          setActiveStep(2);
        } else if (!steps.PROFILE_DETAIL?.completed) {
          setActiveStep(3);
        } else {
          setActiveStep(4);
        }
      })
      .catch(() => {
        if (!mounted) return;
        setBackendStatus(blankBackendStatus);
      })
      .finally(() => {
        if (!mounted) return;
        setIsFetchingStatus(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    saveOnboardingDraft({
      ...formData,
      skills: textToList(formData.skillsText),
      languages: textToList(formData.languagesText),
    });
  }, [formData]);

  const completionChecklist = useMemo(() => {
    const steps = backendStatus.steps || {};
    return [
      { label: 'Basic info', completed: Boolean(steps.BASIC_INFO?.completed) },
      { label: 'Role setup', completed: Boolean(steps.ROLE_SETUP?.completed) },
      { label: 'Profile detail', completed: Boolean(steps.PROFILE_DETAIL?.completed) },
      { label: 'Payment setup', completed: Boolean(steps.PAYMENT_SETUP?.completed) },
    ];
  }, [backendStatus.steps]);

  const progressValue = backendStatus.completionPercentage || Math.round((completionChecklist.filter((item) => item.completed).length / completionChecklist.length) * 100);

  const refreshBackendStatus = async () => {
    const response = await onboardingAPI.getStatus();
    const data = response?.data ?? response ?? blankBackendStatus;
    const normalized = {
      ...blankBackendStatus,
      ...data,
      steps: data?.steps || {},
    };

    setBackendStatus(normalized);
    return normalized;
  };

  const updateField = (field, value) => {
    setNotice('');
    setError('');
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const uploadAvatar = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    setError('');
    setNotice('');

    try {
      const response = await profileAPI.uploadAvatar(file);
      const avatarUrl = response.user?.avatar || '';
      updateField('avatar', avatarUrl);
      setNotice('Avatar uploaded and linked to your profile.');
    } catch (uploadError) {
      setError(uploadError.message || 'Could not upload your avatar right now.');
    } finally {
      setIsUploadingAvatar(false);
      event.target.value = '';
    }
  };

  const uploadCoverPhoto = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    setError('');
    setNotice('');

    try {
      const response = await profileAPI.uploadCoverPhoto(file);
      const coverUrl = response.user?.coverPhoto || '';
      updateField('coverPhoto', coverUrl);
      setNotice('Cover photo uploaded.');
    } catch (uploadError) {
      setError(uploadError.message || 'Could not upload your cover photo right now.');
    } finally {
      setIsUploadingCover(false);
      event.target.value = '';
    }
  };

  const persistBasicInfo = async () => {
    const { firstName, lastName } = summarizeName(formData.fullName);
    await Promise.all([
      onboardingAPI.completeStep('BASIC_INFO', { firstName, lastName }),
      profileAPI.updateMyProfile({
        name: formData.fullName.trim(),
        country: formData.country.trim() || undefined,
        city: formData.city.trim() || undefined,
        timezone: formData.timezone.trim() || undefined,
        avatar: formData.avatar || undefined,
        coverPhoto: formData.coverPhoto || undefined,
      }),
    ]);
  };

  const persistRoleSetup = async () => {
    if (isFreelancer) {
      const skills = textToList(formData.skillsText);
      const languages = textToList(formData.languagesText);

      await Promise.all([
        onboardingAPI.completeStep('ROLE_SETUP', {
          professionalTitle: formData.professionalTitle.trim(),
          hourlyRate: Number(formData.hourlyRate) || 0,
          availability: formData.availability,
          availabilityType: formData.availabilityType,
        }),
        profileAPI.updateMyProfile({
          professionalTitle: formData.professionalTitle.trim() || undefined,
          serviceCategory: formData.serviceCategory.trim() || undefined,
          skills,
          languages,
          hourlyRate: Number(formData.hourlyRate) || undefined,
          currency: formData.currency,
          availability: formData.availability,
          availabilityType: formData.availabilityType,
          country: formData.country.trim() || undefined,
          city: formData.city.trim() || undefined,
        }),
      ]);
      return;
    }

    await Promise.all([
      onboardingAPI.completeStep('ROLE_SETUP', {
        companyName: formData.companyName.trim(),
        industry: formData.industry.trim(),
        companySize: formData.companySize.trim(),
        hiringType: formData.hiringType.trim(),
      }),
      profileAPI.updateMyProfile({
        companyName: formData.companyName.trim() || undefined,
        companyDescription: formData.companyDescription.trim() || undefined,
        industry: formData.industry.trim() || undefined,
        companySize: formData.companySize.trim() || undefined,
        hiringType: formData.hiringType.trim() || undefined,
        country: formData.country.trim() || undefined,
        city: formData.city.trim() || undefined,
      }),
    ]);
  };

  const persistProfileStory = async () => {
    if (isFreelancer) {
      await Promise.all([
        onboardingAPI.completeStep('PROFILE_DETAIL', {
          bio: formData.bio.trim(),
          website: formData.website.trim() || undefined,
          linkedin: formData.linkedin.trim() || undefined,
          github: formData.github.trim() || undefined,
        }),
        profileAPI.updateMyProfile({
          bio: formData.bio.trim() || undefined,
          website: formData.website.trim() || undefined,
          linkedin: formData.linkedin.trim() || undefined,
          github: formData.github.trim() || undefined,
          skills: textToList(formData.skillsText),
          languages: textToList(formData.languagesText),
        }),
      ]);
      return;
    }

    await Promise.all([
      onboardingAPI.completeStep('PROFILE_DETAIL', {
        companyDescription: formData.companyDescription.trim(),
      }),
      profileAPI.updateMyProfile({
        companyDescription: formData.companyDescription.trim() || undefined,
        website: formData.website.trim() || undefined,
        linkedin: formData.linkedin.trim() || undefined,
      }),
    ]);
  };

  const launchProfile = async () => {
    await onboardingAPI.completeStep('PAYMENT_SETUP', {});
    const refreshedData = await refreshBackendStatus();

    if (refreshedData?.isComplete) {
      clearOnboardingDraft();
      navigate(completionDestination, { replace: true });
      return;
    }

    setNotice('Your profile is saved, but a few required backend checks still need to finish.');
  };

  const handleNext = async () => {
    if (isSaving) return;

    setIsSaving(true);
    setError('');
    setNotice('');

    try {
      if (activeStep === 1) {
        if (!formData.fullName.trim() || !formData.country.trim() || !formData.city.trim()) {
          throw new Error('Please add your full name, country, and city.');
        }

        await persistBasicInfo();
        await refreshBackendStatus();
        setActiveStep(2);
      } else if (activeStep === 2) {
        if (isFreelancer) {
          if (
            !formData.professionalTitle.trim() ||
            !formData.serviceCategory.trim() ||
            !formData.skillsText.trim() ||
            !Number(formData.hourlyRate)
          ) {
            throw new Error('Complete your freelancer foundation before continuing.');
          }
        } else if (
          !formData.companyName.trim() ||
          !formData.industry.trim() ||
          !formData.companySize.trim() ||
          !formData.hiringType.trim()
        ) {
          throw new Error('Complete your company foundation before continuing.');
        }

        await persistRoleSetup();
        await refreshBackendStatus();
        setActiveStep(3);
      } else if (activeStep === 3) {
        if (isFreelancer && formData.bio.trim().length < 50) {
          throw new Error('Please add a bio with at least 50 characters.');
        }

        await persistProfileStory();
        await refreshBackendStatus();
        setActiveStep(4);
      } else if (activeStep === 4) {
        await launchProfile();
        await refreshBackendStatus();
        return;
      }
    } catch (stepError) {
      setError(stepError.message || 'We could not save this step.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    setError('');
    setNotice('');

    if (activeStep === 1) {
      navigate(-1);
      return;
    }

    setActiveStep((current) => Math.max(1, current - 1));
  };

  if (!role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface dark:bg-surface-dark px-6">
        <div className="max-w-lg rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <ShieldCheck className="mx-auto h-10 w-10 text-[#2bb75c]" />
          <h1 className="mt-4 text-2xl font-black text-zinc-950 dark:text-white">Choose your role first</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            We need to know whether this account is a client or freelancer before we can build the profile setup.
          </p>
          <button
            type="button"
            onClick={() => navigate('/auth/role-selection', { replace: true })}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2bb75c] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1d8d38]"
          >
            Select role
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans selection:bg-[#2bb75c]/30">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -right-40 top-16 h-[34rem] w-[34rem] rounded-full bg-[#2bb75c]/5 blur-[120px]" />
        <div className="absolute left-0 top-1/2 h-[28rem] w-[28rem] rounded-full bg-violet-500/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col pb-24">
        <header className="flex items-center justify-between px-4 py-5 sm:px-6">
          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2bb75c] text-white shadow-lg shadow-[#2bb75c]/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-black tracking-tight text-zinc-950 dark:text-white">Forte</div>
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#2bb75c]">Profile launch wizard</div>
            </div>
          </motion.div>

          <div className="hidden items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 sm:flex">
            <Sparkles className="h-4 w-4 text-[#2bb75c]" />
            Saved to the production API
          </div>
        </header>

        <main className="grid flex-1 gap-8 px-4 sm:px-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
          <section className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="border-b border-zinc-200/80 px-6 py-6 dark:border-zinc-800">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#2bb75c]/15 bg-[#2bb75c]/5 px-3 py-1 text-xs font-black uppercase tracking-[0.25em] text-[#2bb75c]">
                      <BadgeInfo className="h-3.5 w-3.5" />
                      {isFreelancer ? 'Freelancer setup' : 'Client setup'}
                    </div>
                    <h1 className="mt-4 text-3xl font-black tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
                      Build a profile that looks launch-ready from day one.
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                      This wizard saves every important field into the backend onboarding system and keeps your public profile data synced for dashboards, matching, and search.
                    </p>
                  </div>

                  <div className="min-w-[18rem] rounded-3xl border border-zinc-200 bg-zinc-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900/70">
                    <div className="flex items-center justify-between text-xs font-black uppercase tracking-[0.25em] text-zinc-400">
                      <span>Completion</span>
                      <span>{progressValue}%</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#2bb75c] to-emerald-400 transition-all"
                        style={{ width: `${progressValue}%` }}
                      />
                    </div>
                    <p className="mt-3 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                      {backendStatus.isComplete
                        ? 'Your backend onboarding state is complete.'
                        : 'Finish the remaining steps to unlock the client and freelancer dashboards.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 border-b border-zinc-200 px-6 py-4 dark:border-zinc-800 md:grid-cols-4">
                {STEPS.map((step, index) => (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveStep(index + 1)}
                    className="text-left"
                  >
                    <StepPill active={activeStep === index + 1} label={step.label} description={step.description} />
                  </button>
                ))}
              </div>

              <div className="px-6 py-6">
                {error && (
                  <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
                    {error}
                  </div>
                )}

                {notice && (
                  <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                    {notice}
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {activeStep === 1 && (
                    <motion.div
                      key="identity"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-6"
                    >
                      <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
                        <div className="rounded-[1.75rem] border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/60">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#2bb75c]">Avatar</p>
                              <h2 className="mt-2 text-lg font-black text-zinc-950 dark:text-white">Profile identity</h2>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2bb75c]/10 text-[#2bb75c]">
                              <UserRound className="h-5 w-5" />
                            </div>
                          </div>

                          <div className="mt-6">
                            <div className="mx-auto flex h-48 w-48 items-center justify-center overflow-hidden rounded-[2rem] border border-dashed border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-950">
                              {formData.avatar ? (
                                <img src={formData.avatar} alt="Avatar preview" className="h-full w-full object-cover" />
                              ) : (
                                <div className="text-center">
                                  <ImageIcon className="mx-auto h-10 w-10 text-zinc-300 dark:text-zinc-600" />
                                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                                    No avatar yet
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="mt-4 grid gap-3">
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploadingAvatar}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2bb75c] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1d8d38] disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {isUploadingAvatar ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                                {formData.avatar ? 'Replace avatar' : 'Upload avatar'}
                              </button>
                              <button
                                type="button"
                                onClick={() => coverInputRef.current?.click()}
                                disabled={isUploadingCover}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-bold text-zinc-700 transition-colors hover:border-[#2bb75c]/20 hover:text-[#2bb75c] dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
                              >
                                {isUploadingCover ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                                {formData.coverPhoto ? 'Replace cover' : 'Upload cover'}
                              </button>
                            </div>

                            <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadAvatar} className="hidden" />
                            <input ref={coverInputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadCoverPhoto} className="hidden" />
                          </div>
                        </div>

                        <div className="space-y-5">
                          <div className="grid gap-5 md:grid-cols-2">
                            <Field
                              label="Full name"
                              icon={UserRound}
                              value={formData.fullName}
                              onChange={(event) => updateField('fullName', event.target.value)}
                              placeholder="e.g. Amina Hassan"
                            />
                            <Field
                              label="Timezone"
                              icon={Globe}
                              value={formData.timezone}
                              onChange={(event) => updateField('timezone', event.target.value)}
                              placeholder="Africa/Nairobi"
                            />
                            <Field
                              label="Country"
                              icon={MapPin}
                              value={formData.country}
                              onChange={(event) => updateField('country', event.target.value)}
                              placeholder="Kenya"
                            />
                            <Field
                              label="City"
                              icon={MapPin}
                              value={formData.city}
                              onChange={(event) => updateField('city', event.target.value)}
                              placeholder="Nairobi"
                            />
                          </div>

                          <div className="rounded-[1.75rem] border border-dashed border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/60">
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2bb75c]/10 text-[#2bb75c]">
                                <CheckCircle2 className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-zinc-900 dark:text-white">Why we collect this first</p>
                                <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                                  Name and location data power profile pages, trust checks, search filters, and dashboard routing.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeStep === 2 && (
                    <motion.div
                      key="role"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-6"
                    >
                      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                        <div className="space-y-5 rounded-[1.75rem] border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
                          <div>
                            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#2bb75c]">Role foundation</p>
                            <h2 className="mt-2 text-2xl font-black tracking-tight text-zinc-950 dark:text-white">
                              {isFreelancer ? 'Shape your freelancer profile' : 'Shape your client company profile'}
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                              These are the fields the backend uses to determine whether your account is ready for the main workspace.
                            </p>
                          </div>

                          {isFreelancer ? (
                            <div className="grid gap-5 md:grid-cols-2">
                              <div className="md:col-span-2">
                                <Field
                                  label="Professional title"
                                  icon={Briefcase}
                                  value={formData.professionalTitle}
                                  onChange={(event) => updateField('professionalTitle', event.target.value)}
                                  placeholder="Full-Stack Developer specializing in React and Node.js"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <Field
                                  label="Primary skill category"
                                  icon={FileText}
                                  value={formData.serviceCategory}
                                  onChange={(event) => updateField('serviceCategory', event.target.value)}
                                  placeholder="Web Development"
                                />
                              </div>
                              <Field
                                label="Hourly rate"
                                icon={BadgeInfo}
                                type="number"
                                value={formData.hourlyRate}
                                onChange={(event) => updateField('hourlyRate', event.target.value)}
                                placeholder="65"
                              />
                              <Field
                                label="Currency"
                                icon={Globe}
                                value={formData.currency}
                                onChange={(event) => updateField('currency', event.target.value)}
                                placeholder="USD"
                              />
                              <div className="md:col-span-2">
                                <Field
                                  label="Skills"
                                  icon={Sparkles}
                                  value={formData.skillsText}
                                  onChange={(event) => updateField('skillsText', event.target.value)}
                                  placeholder="React, Node.js, TypeScript, Tailwind CSS"
                                  helper="Comma separated list"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <Field
                                  label="Languages"
                                  icon={Languages}
                                  value={formData.languagesText}
                                  onChange={(event) => updateField('languagesText', event.target.value)}
                                  placeholder="English, Swahili"
                                  helper="Comma separated list"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="grid gap-5 md:grid-cols-2">
                              <div className="md:col-span-2">
                                <Field
                                  label="Company name"
                                  icon={Building2}
                                  value={formData.companyName}
                                  onChange={(event) => updateField('companyName', event.target.value)}
                                  placeholder="Acme Studio Ltd"
                                />
                              </div>
                              <Field
                                label="Industry"
                                icon={FileText}
                                value={formData.industry}
                                onChange={(event) => updateField('industry', event.target.value)}
                                placeholder="Technology"
                              />
                              <Field
                                label="Company size"
                                icon={UserRound}
                                value={formData.companySize}
                                onChange={(event) => updateField('companySize', event.target.value)}
                                placeholder="1-10"
                              />
                              <Field
                                label="Hiring type"
                                icon={Briefcase}
                                value={formData.hiringType}
                                onChange={(event) => updateField('hiringType', event.target.value)}
                                placeholder="PROJECT_BASED"
                              />
                              <div className="md:col-span-2">
                                <Field
                                  label="Company description"
                                  icon={FileText}
                                  value={formData.companyDescription}
                                  onChange={(event) => updateField('companyDescription', event.target.value)}
                                  placeholder="Tell freelancers what your business does and what you need help with."
                                  multiline
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        <aside className="space-y-4 rounded-[1.75rem] border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/60">
                          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#2bb75c]">Backend sync</p>
                          <div className="space-y-3">
                            <SummaryRow label="Role" value={isFreelancer ? 'Freelancer' : 'Client'} />
                            <SummaryRow label="Country" value={formData.country || 'Not set'} />
                            <SummaryRow label="City" value={formData.city || 'Not set'} />
                            <SummaryRow
                              label="Type"
                              value={isFreelancer ? formData.availabilityType : formData.hiringType}
                            />
                          </div>
                          <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                            <p className="text-sm font-semibold text-zinc-900 dark:text-white">How this helps</p>
                            <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                              The backend onboarding service uses this step to decide whether your account is ready for the marketplace.
                            </p>
                          </div>
                        </aside>
                      </div>
                    </motion.div>
                  )}

                  {activeStep === 3 && (
                    <motion.div
                      key="profile"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.25 }}
                      className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"
                    >
                      <div className="space-y-5 rounded-[1.75rem] border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#2bb75c]">Profile story</p>
                          <h2 className="mt-2 text-2xl font-black tracking-tight text-zinc-950 dark:text-white">
                            Tell people what you do best
                          </h2>
                          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                            Strong bios and public links help search ranking, credibility, and shortlisting.
                          </p>
                        </div>

                        <div className="space-y-5">
                          {isFreelancer ? (
                            <>
                              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
                                <Field
                                  label="Bio"
                                  icon={FileText}
                                  value={formData.bio}
                                  onChange={(event) => updateField('bio', event.target.value)}
                                  placeholder="Summarise your expertise, communication style, and the kind of work you deliver."
                                  multiline
                                  helper="At least 50 characters is recommended."
                                />
                              </div>
                              <div className="grid gap-5 md:grid-cols-2">
                                <Field
                                  label="Website"
                                  icon={Link2}
                                  value={formData.website}
                                  onChange={(event) => updateField('website', event.target.value)}
                                  placeholder="https://yourportfolio.com"
                                />
                                <Field
                                  label="LinkedIn"
                                  icon={Link2}
                                  value={formData.linkedin}
                                  onChange={(event) => updateField('linkedin', event.target.value)}
                                  placeholder="https://linkedin.com/in/..."
                                />
                                <Field
                                  label="GitHub"
                                  icon={Link2}
                                  value={formData.github}
                                  onChange={(event) => updateField('github', event.target.value)}
                                  placeholder="https://github.com/..."
                                />
                                <Field
                                  label="Availability"
                                  icon={CheckCircle2}
                                  value={formData.availability}
                                  onChange={(event) => updateField('availability', event.target.value)}
                                  placeholder="Available now"
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
                                <Field
                                  label="Company description"
                                  icon={FileText}
                                  value={formData.companyDescription}
                                  onChange={(event) => updateField('companyDescription', event.target.value)}
                                  placeholder="Describe your company, goals, and the type of talent you want to hire."
                                  multiline
                                />
                              </div>
                              <div className="grid gap-5 md:grid-cols-2">
                                <Field
                                  label="Website"
                                  icon={Link2}
                                  value={formData.website}
                                  onChange={(event) => updateField('website', event.target.value)}
                                  placeholder="https://company.com"
                                />
                                <Field
                                  label="LinkedIn"
                                  icon={Link2}
                                  value={formData.linkedin}
                                  onChange={(event) => updateField('linkedin', event.target.value)}
                                  placeholder="https://linkedin.com/company/..."
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <aside className="space-y-4 rounded-[1.75rem] border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/60">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#2bb75c]">Live preview</p>
                            <h3 className="mt-2 text-lg font-black text-zinc-950 dark:text-white">How your profile reads</h3>
                          </div>
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2bb75c]/10 text-[#2bb75c]">
                            <Sparkles className="h-5 w-5" />
                          </div>
                        </div>

                        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                          <div className="flex items-center gap-3">
                            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
                              {formData.avatar ? (
                                <img src={formData.avatar} alt="Preview avatar" className="h-full w-full object-cover" />
                              ) : (
                                <UserRound className="h-6 w-6 text-zinc-300 dark:text-zinc-600" />
                              )}
                            </div>
                            <div>
                              <h4 className="text-base font-black text-zinc-950 dark:text-white">{formData.fullName || 'Your name'}</h4>
                              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                {isFreelancer ? formData.professionalTitle || 'Professional title' : formData.companyName || 'Company name'}
                              </p>
                            </div>
                          </div>

                          <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                            {isFreelancer
                              ? formData.bio || 'Your bio will appear here once you add a short summary.'
                              : formData.companyDescription || 'Your company description will appear here once you add it.'}
                          </p>
                        </div>
                      </aside>
                    </motion.div>
                  )}

                  {activeStep === 4 && (
                    <motion.div
                      key="launch"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.25 }}
                      className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"
                    >
                      <div className="space-y-5 rounded-[1.75rem] border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#2bb75c]">Launch check</p>
                          <h2 className="mt-2 text-2xl font-black tracking-tight text-zinc-950 dark:text-white">
                            Review everything before we publish your profile
                          </h2>
                          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                            The final save writes the onboarding payment step and confirms your profile state with the production backend.
                          </p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <SummaryCard
                            title="Identity"
                            items={[
                              `Name: ${formData.fullName || 'Not set'}`,
                              `Location: ${formData.city || 'Not set'}, ${formData.country || 'Not set'}`,
                              `Timezone: ${formData.timezone || 'Not set'}`,
                            ]}
                          />
                          <SummaryCard
                            title={isFreelancer ? 'Freelancer setup' : 'Client setup'}
                            items={
                              isFreelancer
                                ? [
                                    `Title: ${formData.professionalTitle || 'Not set'}`,
                                    `Rate: ${formData.currency} ${formData.hourlyRate || 0}/hr`,
                                    `Skills: ${formData.skillsText || 'Not set'}`,
                                  ]
                                : [
                                    `Company: ${formData.companyName || 'Not set'}`,
                                    `Industry: ${formData.industry || 'Not set'}`,
                                    `Hiring type: ${formData.hiringType || 'Not set'}`,
                                  ]
                            }
                          />
                        </div>

                        <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
                          <p className="text-sm font-semibold text-zinc-900 dark:text-white">What happens when you click finish</p>
                          <ul className="mt-3 space-y-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-[#2bb75c]" /> Your profile data is saved to the backend.
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-[#2bb75c]" /> The onboarding payment step creates your wallet.
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-[#2bb75c]" /> Once the backend reports complete, we send you to the dashboard.
                            </li>
                          </ul>
                        </div>
                      </div>

                      <aside className="space-y-4 rounded-[1.75rem] border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/60">
                        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#2bb75c]">Backend checklist</p>
                        <div className="space-y-3">
                          {completionChecklist.map((item) => (
                            <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
                              <div className={cn('flex h-8 w-8 items-center justify-center rounded-full', item.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-400')}>
                                <Check className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-zinc-900 dark:text-white">{item.label}</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">{item.completed ? 'Complete' : 'Still pending'}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                          <p className="text-sm font-semibold text-zinc-900 dark:text-white">Ready to launch?</p>
                          <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                            The launch step is the final backend handshake that marks the onboarding flow complete.
                          </p>
                        </div>
                      </aside>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </section>

          <aside className="space-y-5">
            <div className="rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#2bb75c]">Backend status</p>
                  <h3 className="mt-2 text-lg font-black text-zinc-950 dark:text-white">
                    {isFetchingStatus ? 'Checking...' : backendStatus.isComplete ? 'Complete' : 'In progress'}
                  </h3>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2bb75c]/10 text-[#2bb75c]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                <div className="h-full rounded-full bg-gradient-to-r from-[#2bb75c] to-emerald-400" style={{ width: `${progressValue}%` }} />
              </div>

              <div className="mt-4 space-y-3">
                <SummaryRow label="Current step" value={backendStatus.currentStep || 'BASIC_INFO'} />
                <SummaryRow label="Completion" value={`${progressValue}%`} />
                <SummaryRow label="Dashboard" value={completionDestination.replace('/', '')} />
              </div>
            </div>

            <div className="rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#2bb75c]">Checklist</p>
              <div className="mt-4 space-y-3">
                {completionChecklist.map((item) => (
                  <div key={item.label} className="flex items-center gap-3 text-sm">
                    <div className={cn('flex h-5 w-5 items-center justify-center rounded-full', item.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-400')}>
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span className={item.completed ? 'font-medium text-zinc-700 dark:text-zinc-200' : 'text-zinc-400'}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-zinc-200 bg-zinc-50 p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2bb75c]/10 text-[#2bb75c]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">Production ready flow</p>
                  <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                    The wizard writes to the backend onboarding service and profile API, so we do not depend on browser-only state to unlock dashboards.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </main>

        <footer className="fixed bottom-0 left-0 right-0 z-20 border-t border-zinc-200 bg-white/90 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/90">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-bold text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              {activeStep === 1 ? 'Back' : 'Previous'}
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2bb75c] px-6 py-3 text-sm font-black text-white transition-colors hover:bg-[#1d8d38] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              {activeStep === 4 ? 'Finish setup' : 'Save and continue'}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, helper, multiline = false, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white">
        {Icon ? <Icon className="h-4 w-4 text-[#2bb75c]" /> : null}
        {label}
      </span>
      {multiline ? (
        <textarea
          rows={6}
          className={cn(
            'w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-[#2bb75c]/20 focus:ring-2 focus:ring-[#2bb75c]/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white',
            props.className
          )}
          {...props}
        />
      ) : (
        <input
          className={cn(
            'w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-[#2bb75c]/20 focus:ring-2 focus:ring-[#2bb75c]/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white',
            props.className
          )}
          {...props}
        />
      )}
      {helper && <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">{helper}</p>}
    </label>
  );
}

function SummaryCard({ title, items }) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
      <p className="text-sm font-black uppercase tracking-[0.22em] text-[#2bb75c]">{title}</p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}


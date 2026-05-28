import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Camera,
  Check,
  ChevronLeft,
  Globe,
  Loader2,
  Save,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import { useAuthStore } from '../../common/authStore';
import { profileAPI } from '../../common/services/api';
import { getDashboardPathForRole } from '../utils/authRouting';
import {
  buildProfilePayloadFromDraft,
  clearOnboardingDraft,
  loadOnboardingDraft,
  saveOnboardingDraft,
} from '../utils/onboardingDraft';

const STEPS = ['Account', 'Role', 'Skills', 'Experience', 'Availability', 'Rate', 'Profile', 'Done'];

const checklistItems = [
  { id: 'skills', label: 'Skills selected' },
  { id: 'experience', label: 'Experience level chosen' },
  { id: 'availability', label: 'Availability configured' },
  { id: 'rate', label: 'Rate configured' },
  { id: 'headline', label: 'Headline added' },
  { id: 'bio', label: 'Bio added' },
];

const SummaryRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 text-sm">
    <span className="text-zinc-500 dark:text-zinc-400">{label}</span>
    <span className="text-right font-semibold text-zinc-900 dark:text-white">{value}</span>
  </div>
);

export default function ProfileCompletionPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const completionDestination = getDashboardPathForRole(user?.role);
  const fileInputRef = useRef(null);
  const draft = useMemo(() => loadOnboardingDraft(), []);

  const [formData, setFormData] = useState({
    photo: user?.avatar || null,
    headline: user?.professionalTitle || draft.headline || '',
    bio: user?.bio || draft.bio || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    saveOnboardingDraft({
      headline: formData.headline,
      bio: formData.bio,
    });
  }, [formData.bio, formData.headline]);

  const checklistState = useMemo(
    () => ({
      skills: Array.isArray(draft.skills) && draft.skills.length > 0,
      experience: Boolean(draft.experienceLevel),
      availability: Boolean(draft.workType && draft.commitment),
      rate: Boolean(draft.hourlyRate),
      headline: formData.headline.trim().length >= 5,
      bio: formData.bio.trim().length >= 50,
    }),
    [draft, formData.bio, formData.headline]
  );

  const completionScore = useMemo(() => {
    const completed = checklistItems.filter((item) => checklistState[item.id]).length;
    return Math.round((completed / checklistItems.length) * 100);
  }, [checklistState]);

  const handleTextChange = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handlePhotoSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    setError('');
    setNotice('');

    try {
      const response = await profileAPI.uploadAvatar(file);
      const avatarUrl = response.user?.avatar || formData.photo;

      setFormData((current) => ({
        ...current,
        photo: avatarUrl,
      }));
      setNotice('Profile photo uploaded.');
    } catch (uploadError) {
      setError(uploadError.message || 'Could not upload your profile photo.');
    } finally {
      setIsUploadingPhoto(false);
      event.target.value = '';
    }
  };

  const handleFinish = async () => {
    if (formData.headline.trim().length < 5) {
      setError('Add a headline with at least 5 characters.');
      return;
    }

    if (formData.bio.trim().length < 50) {
      setError('Add a short bio with at least 50 characters.');
      return;
    }

    setIsSaving(true);
    setError('');
    setNotice('');

    try {
      const payload = buildProfilePayloadFromDraft(
        {
          ...draft,
          headline: formData.headline,
          bio: formData.bio,
        },
        {
          headline: formData.headline,
          bio: formData.bio,
        }
      );

      await profileAPI.updateMyProfile(payload);
      clearOnboardingDraft();
      navigate(completionDestination, { replace: true });
    } catch (saveError) {
      setError(saveError.message || 'Could not finish profile setup.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans selection:bg-brand-500/30 overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-brand-500/5 blur-[120px]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col pb-24">
        <div className="flex items-center justify-between px-6 py-5 max-w-7xl mx-auto w-full">
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
            <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30">
              <Camera className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Forte.</span>
          </motion.div>
          <div className="flex items-center gap-2 text-sm font-bold text-zinc-500 bg-white dark:bg-surface-dark px-4 py-2 rounded-full shadow-sm border border-zinc-200 dark:border-zinc-800">
            <Save className="w-4 h-4" /> Draft saved in this browser
          </div>
        </div>

        <div className="w-full max-w-6xl mx-auto px-4 mb-8 hidden sm:block">
          <div className="flex items-center justify-center gap-0">
            {STEPS.map((step, idx) => {
              const isCompleted = idx < 6;
              const isCurrent = idx === 6;
              const isLast = idx === STEPS.length - 1;

              return (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center gap-1">
                    <motion.div
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center shadow-sm z-10 relative',
                        isCompleted
                          ? 'bg-brand-600 text-white'
                          : isCurrent
                            ? 'bg-brand-600 text-white ring-4 ring-brand-500/20 scale-110'
                            : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400'
                      )}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                    </motion.div>
                    <span className={cn('text-[10px] font-bold uppercase tracking-wide absolute top-10', isCurrent ? 'text-brand-600' : isCompleted ? 'text-zinc-500' : 'text-zinc-400')}>
                      {step}
                    </span>
                  </div>
                  {!isLast && <div className={cn('h-[2px] w-6 md:w-12 mx-1 rounded-full', isCompleted ? 'bg-brand-600' : 'bg-zinc-200 dark:bg-zinc-800')} />}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 mt-8 sm:mt-12 flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 w-full min-w-0 space-y-6">
            <section className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
                <div className="w-40 h-40 rounded-full border-4 border-zinc-100 dark:border-zinc-800 bg-surface dark:bg-zinc-800/50 flex items-center justify-center overflow-hidden shrink-0">
                  {formData.photo ? (
                    <img src={formData.photo} alt="Profile preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-10 h-10 text-zinc-300 dark:text-zinc-600" />
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-2">
                      Complete your profile
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400">
                      This final step saves your freelancer profile to the production API so your dashboard, search ranking, and profile completeness all stay in sync.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingPhoto}
                      className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-colors shadow-sm inline-flex items-center gap-2"
                    >
                      {isUploadingPhoto ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                      {formData.photo ? 'Replace photo' : 'Upload photo'}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(completionDestination)}
                      className="px-6 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-sm font-bold rounded-xl transition-colors"
                    >
                      Finish later
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </div>
              </div>
            </section>

            <section className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white mb-2">Headline</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Make it specific. This appears in profile previews and search results.
                </p>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="e.g. Full-Stack Developer specializing in React and Node.js"
                  value={formData.headline}
                  onChange={(event) => handleTextChange('headline', event.target.value)}
                  className="w-full p-4 bg-surface dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-zinc-900 dark:text-white font-semibold focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
                />
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 font-medium">Aim for 5-100 characters.</span>
                  <span className={cn('font-bold', formData.headline.length > 100 ? 'text-rose-500' : 'text-zinc-400')}>
                    {formData.headline.length}/100
                  </span>
                </div>
              </div>
            </section>

            <section className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white mb-2">About you</h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    A concise, trustworthy summary converts better than generic hype.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleTextChange(
                      'bio',
                      "I help clients ship reliable digital products with clear communication, practical problem solving, and consistent delivery. My work focuses on maintainable implementation, fast iteration, and measurable business outcomes."
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-xl text-xs font-bold hover:bg-brand-100 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Add starter draft
                </button>
              </div>

              <div className="space-y-2">
                <textarea
                  rows="7"
                  placeholder="Describe your expertise, project strengths, communication style, and the kinds of work you do best."
                  value={formData.bio}
                  onChange={(event) => handleTextChange('bio', event.target.value)}
                  className="w-full p-4 bg-surface dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-zinc-900 dark:text-white font-medium focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all resize-none"
                />
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 font-medium">Minimum recommended: 50 characters.</span>
                  <span className={cn('font-bold', formData.bio.length < 50 ? 'text-amber-500' : 'text-zinc-400')}>
                    {formData.bio.length}/5000
                  </span>
                </div>
              </div>
            </section>

            <section className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white mb-3">What happens next</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Portfolio items, languages, and deeper profile polish continue inside your main workspace after onboarding. This page now saves the core production profile fields first so nothing important is lost.
              </p>
            </section>

            {(error || notice) && (
              <div className={cn(
                'rounded-2xl border px-4 py-3 text-sm font-medium',
                error ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'
              )}>
                {error || notice}
              </div>
            )}
          </div>

          <aside className="w-full lg:w-80 shrink-0 space-y-6">
            <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Onboarding summary</h3>
              <div className="space-y-3">
                <SummaryRow label="Skills" value={Array.isArray(draft.skills) && draft.skills.length ? `${draft.skills.length} selected` : 'Not set'} />
                <SummaryRow label="Experience" value={draft.experienceLevel || 'Not set'} />
                <SummaryRow label="Availability" value={draft.workType ? `${draft.workType} / ${draft.commitment || 'unspecified'}` : 'Not set'} />
                <SummaryRow label="Rate" value={draft.hourlyRate ? `${draft.currency || 'USD'} ${draft.hourlyRate}/hr` : 'Not set'} />
                <SummaryRow label="Timezone" value={draft.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'Not set'} />
              </div>
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Profile readiness</h3>
                <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 text-brand-700 px-3 py-1 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" /> {completionScore}%
                </div>
              </div>

              <div className="space-y-3">
                {checklistItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-sm">
                    <div className={cn(
                      'w-5 h-5 rounded-full flex items-center justify-center',
                      checklistState[item.id] ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-400'
                    )}>
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className={checklistState[item.id] ? 'text-zinc-700 dark:text-zinc-200 font-medium' : 'text-zinc-400'}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-brand-600 to-violet-600 rounded-3xl p-6 text-white shadow-xl shadow-brand-500/20">
              <Globe className="w-6 h-6 mb-3 text-brand-200" />
              <h3 className="text-lg font-bold mb-2">Production save</h3>
              <p className="text-sm text-brand-100 leading-relaxed">
                Finishing this step writes your core profile data to the backend, so the dashboard and profile completion logic use the same source of truth.
              </p>
            </div>
          </aside>
        </div>

        <div className="fixed bottom-0 left-0 right-0 border-t border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>

            <button
              type="button"
              onClick={handleFinish}
              disabled={isSaving}
              className="flex items-center gap-2 px-8 py-3 bg-surface-dark dark:bg-white text-white dark:text-zinc-900 hover:bg-brand-600 dark:hover:bg-brand-500 hover:text-white disabled:opacity-50 text-sm font-bold rounded-xl shadow-lg hover:shadow-brand-500/25 transition-all"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUpRight className="w-4 h-4" />}
              {isSaving ? 'Saving profile...' : 'Finish setup'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

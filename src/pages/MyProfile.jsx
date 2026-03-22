import React, { useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  Building2,
  Camera,
  ChevronRight,
  FileText,
  Globe,
  MapPin,
  Image as ImageIcon,
  Save,
  Sparkles,
  Star,
  Upload,
  Video,
  Wrench,
  ShieldCheck,
} from "lucide-react";
import { getToken, profileAPI } from "../Services/api";
import "./MyProfile.css";

const SERVICE_GROUPS = [
  { label: "Online Services", options: ["Web Development", "UI/UX Design", "Graphic Design", "Video Editing", "Content Writing", "SEO", "Digital Marketing", "Business Consulting", "Data Entry"] },
  { label: "Onsite Trades", options: ["Plumbing", "Electrical", "HVAC", "Carpentry", "Painting", "Cleaning", "Landscaping", "Roofing", "Handyman", "Appliance Repair"] },
];

const CLIENT_INDUSTRIES = ["Technology", "Construction", "Real Estate", "Healthcare", "Education", "Finance", "Retail", "Hospitality", "Marketing", "Other"];
const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "500+"];
const HIRING_TYPES = ["One-off project", "Long-term support", "Ongoing retainer", "Full-time hire"];
const SERVICE_MODES = ["Remote", "Onsite", "Hybrid"];
const RESPONSE_TIMES = ["Within 1 hour", "Within 1 day", "Within 2 days", "Within a week"];
const AVAILABILITY_TYPES = ["Full-time", "Part-time", "Weekdays", "Weekends", "Anytime"];
const SKILL_LEVELS = ["Beginner", "Intermediate", "Expert"];
const PROJECT_TYPES = ["Short-term", "Long-term", "Both"];
const CURRENCIES = ["USD", "EUR", "GBP", "KES", "NGN", "ZAR"];
const SOCIAL_FIELDS = [
  ["website", "Website"],
  ["linkedin", "LinkedIn"],
  ["github", "GitHub"],
  ["twitter", "X / Twitter"],
  ["facebook", "Facebook"],
  ["instagram", "Instagram"],
  ["dribbble", "Dribbble"],
  ["behance", "Behance"],
  ["medium", "Medium"],
];

const splitList = (value) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const joinList = (value) => (Array.isArray(value) ? value.join(", ") : String(value || ""));

const emptySocialLinks = () => SOCIAL_FIELDS.reduce((acc, [key]) => ({ ...acc, [key]: "" }), {});

const emptyDraft = (role = "freelancer") => ({
  role,
  name: "",
  username: "",
  professionalTitle: "",
  phoneNumber: "",
  country: "",
  city: "",
  timezone: "",
  companyName: "",
  companySize: "",
  companyDescription: "",
  industry: "",
  hiringType: "",
  hiringCapacity: "",
  preferredFreelancerLevel: "",
  preferredProjectType: "",
  serviceCategory: "",
  serviceMode: "Hybrid",
  serviceArea: "",
  bio: "",
  skillsText: "",
  primarySkillsText: "",
  toolsTechnologiesText: "",
  preferredSkillsText: "",
  industriesOfInterestText: "",
  languagesText: "",
  hourlyRate: "",
  currency: "USD",
  budget: "",
  yearsOfExperience: "",
  skillLevel: "Intermediate",
  availableHours: "",
  availabilityType: "Anytime",
  responseTime: "Within 1 day",
  website: "",
  linkedin: "",
  github: "",
  twitter: "",
  facebook: "",
  instagram: "",
  dribbble: "",
  behance: "",
  medium: "",
  socialLinks: emptySocialLinks(),
});

const toDraft = (profile) => {
  const social = profile?.socialLinks || {};
  return {
    ...emptyDraft(profile?.role || "freelancer"),
    ...profile,
    skillsText: joinList(profile?.skills),
    primarySkillsText: joinList(profile?.primarySkills),
    toolsTechnologiesText: joinList(profile?.toolsTechnologies),
    preferredSkillsText: joinList(profile?.preferredSkills),
    industriesOfInterestText: joinList(profile?.industriesOfInterest),
    languagesText: joinList(profile?.languages),
    socialLinks: {
      ...emptySocialLinks(),
      ...social,
      website: profile?.website || social.website || "",
      linkedin: profile?.linkedin || social.linkedin || "",
      github: profile?.github || social.github || "",
      twitter: profile?.twitter || social.twitter || "",
      facebook: profile?.facebook || social.facebook || "",
      instagram: profile?.instagram || social.instagram || "",
      dribbble: profile?.dribbble || social.dribbble || "",
      behance: profile?.behance || social.behance || "",
      medium: profile?.medium || social.medium || "",
    },
    website: profile?.website || social.website || "",
    linkedin: profile?.linkedin || social.linkedin || "",
    github: profile?.github || social.github || "",
    twitter: profile?.twitter || social.twitter || "",
    facebook: profile?.facebook || social.facebook || "",
    instagram: profile?.instagram || social.instagram || "",
    dribbble: profile?.dribbble || social.dribbble || "",
    behance: profile?.behance || social.behance || "",
    medium: profile?.medium || social.medium || "",
  };
};

const Section = ({ icon: Icon, title, subtitle, children }) => (
  <section className="profile-section">
    <div className="profile-section__header">
      <h2>{Icon ? <Icon size={18} /> : null}{title}</h2>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
    <div className="profile-section__body">{children}</div>
  </section>
);

const Field = ({ label, children, hint }) => (
  <label className="profile-field">
    <span>{label}</span>
    {children}
    {hint ? <small>{hint}</small> : null}
  </label>
);

const UploadButton = ({ label, accept, multiple, onChange, icon: Icon = Upload, loading }) => (
  <label className={`upload-button ${loading ? "is-loading" : ""}`}>
    <Icon size={16} />
    <span>{loading ? "Uploading..." : label}</span>
    <input
      type="file"
      accept={accept}
      multiple={multiple}
      hidden
      onChange={(e) => {
        const value = multiple ? Array.from(e.target.files || []) : e.target.files?.[0];
        if (value && (!Array.isArray(value) || value.length)) onChange(value);
        e.target.value = "";
      }}
    />
  </label>
);

export const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [draft, setDraft] = useState(emptyDraft());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [missingFields, setMissingFields] = useState([]);
  const [uploading, setUploading] = useState({ avatar: false, coverPhoto: false, companyLogo: false, introVideo: false, portfolio: false });

  const role = profile?.role || draft.role || "freelancer";
  const isFreelancer = role === "freelancer";
  const isClient = role === "client";
  const completeness = useMemo(() => {
    const total = isClient ? 7 : 9;
    return Math.max(0, Math.round(((total - missingFields.length) / total) * 100));
  }, [isClient, missingFields.length]);

  useEffect(() => {
    if (!getToken()) {
      window.location.href = "/signin";
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const [profileRes, missingRes] = await Promise.all([
          profileAPI.getMyProfile(),
          profileAPI.getMissingFields().catch(() => ({ missing: [] })),
        ]);
        if (!mounted) return;
        setProfile(profileRes.user);
        setDraft(toDraft(profileRes.user));
        setMissingFields(missingRes.missing || []);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load profile");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(""), 4500);
    return () => clearTimeout(timer);
  }, [notice]);

  const updateField = (field, value) => setDraft((prev) => ({ ...prev, [field]: value }));
  const updateSocialField = (field, value) => setDraft((prev) => ({ ...prev, [field]: value, socialLinks: { ...(prev.socialLinks || emptySocialLinks()), [field]: value } }));

  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...draft,
        skills: splitList(draft.skillsText),
        primarySkills: splitList(draft.primarySkillsText),
        toolsTechnologies: splitList(draft.toolsTechnologiesText),
        preferredSkills: splitList(draft.preferredSkillsText),
        industriesOfInterest: splitList(draft.industriesOfInterestText),
        languages: splitList(draft.languagesText),
        hourlyRate: draft.hourlyRate === "" ? "" : Number(draft.hourlyRate),
        budget: draft.budget === "" ? "" : Number(draft.budget),
        yearsOfExperience: draft.yearsOfExperience === "" ? "" : Number(draft.yearsOfExperience),
        availableHours: draft.availableHours === "" ? "" : Number(draft.availableHours),
        hiringCapacity: draft.hiringCapacity === "" ? "" : Number(draft.hiringCapacity),
        socialLinks: { ...emptySocialLinks(), ...(draft.socialLinks || {}) },
      };
      const res = await profileAPI.updateMyProfile(payload);
      setProfile(res.user);
      setDraft(toDraft(res.user));
      setMissingFields(res.missingFields || []);
      setNotice("Profile saved successfully.");
    } catch (err) {
      setError(err.message || "Could not save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (kind, file) => {
    if (!file) return;
    setUploading((prev) => ({ ...prev, [kind]: true }));
    setError("");
    try {
      let res = null;
      if (kind === "avatar") res = await profileAPI.uploadAvatar(file);
      if (kind === "coverPhoto") res = await profileAPI.uploadCoverPhoto(file);
      if (kind === "companyLogo") res = await profileAPI.uploadCompanyLogo(file);
      if (kind === "introVideo") res = await profileAPI.uploadIntroVideo(file);
      if (kind === "portfolio") res = await profileAPI.uploadPortfolio(file);
      if (res?.user) {
        setProfile(res.user);
        setDraft(toDraft(res.user));
      }
      const missingRes = await profileAPI.getMissingFields().catch(() => ({ missing: [] }));
      setMissingFields(missingRes.missing || []);
      setNotice(`${kind === "coverPhoto" ? "Cover photo" : kind} uploaded successfully.`);
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading((prev) => ({ ...prev, [kind]: false }));
    }
  };

  if (loading) {
    return <div className="profile-page"><div className="profile-loading"><div className="skeleton hero" /><div className="skeleton card" /><div className="skeleton card" /></div></div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-shell">
        <div className="profile-hero">
          <div className="profile-hero__cover" style={profile?.coverPhoto ? { backgroundImage: `url(${profile.coverPhoto})` } : undefined}>
            {!profile?.coverPhoto ? <div className="profile-hero__placeholder"><Sparkles size={28} /><p>Upload a cover photo that makes the profile feel premium.</p></div> : null}
            <div className="profile-hero__actions">
              <UploadButton label="Change cover" accept="image/*" onChange={(file) => handleUpload("coverPhoto", file)} icon={Camera} loading={uploading.coverPhoto} />
            </div>
          </div>

          <div className="profile-hero__body">
            <div className="profile-avatar">
              {profile?.avatar ? <img src={profile.avatar} alt="Profile avatar" /> : <span><ImageIcon size={26} /></span>}
              <div className="profile-avatar__upload">
                <UploadButton label="Update" accept="image/*" onChange={(file) => handleUpload("avatar", file)} icon={Camera} loading={uploading.avatar} />
              </div>
            </div>

            <div className="profile-hero__text">
              <p className="profile-kicker">{isFreelancer ? "Freelancer profile" : "Client profile"}</p>
              <h1>{profile?.name || profile?.companyName || "Complete your profile"}</h1>
              <p className="profile-subtitle">{profile?.professionalTitle || (isFreelancer ? "Showcase your services, skills, pricing, and proof of work." : "Tell freelancers what your company does and how you hire.")}</p>
              <div className="profile-meta-row">
                <span className="profile-meta-item"><MapPin size={14} /> {profile?.city || profile?.country || "Location not set"}</span>
                <span className="profile-meta-item">{profile?.serviceMode || "Hybrid"}</span>
                <span className="profile-meta-item">{profile?.serviceCategory || profile?.industry || "General services"}</span>
              </div>
              <div className="profile-badges">
                <div className="status-chip"><ShieldCheck size={14} /><span>{profile?.emailVerified ? "Email verified" : "Email pending"}</span></div>
                <div className="status-chip"><ShieldCheck size={14} /><span>{profile?.phoneVerified ? "Phone verified" : "Phone pending"}</span></div>
                <div className="status-chip"><Star size={14} /><span>{profile?.isVerified ? "Identity verified" : "Verification pending"}</span></div>
              </div>
            </div>
          </div>

          <div className="profile-tabs">
            <button type="button" className="profile-tab is-active">Overview</button>
            <button type="button" className="profile-tab">Services</button>
            <button type="button" className="profile-tab">Portfolio</button>
            <button type="button" className="profile-tab">Reviews</button>
            <button type="button" className="profile-tab profile-tab--ghost">
              Public preview <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {notice ? <div className="profile-alert success">{notice}</div> : null}
        {error ? <div className="profile-alert error">{error}</div> : null}

        <div className="profile-layout">
          <aside className="profile-sidebar">
            <div className="sidebar-card">
              <p className="sidebar-card__label">Completion</p>
              <div className="progress"><div style={{ width: `${completeness}%` }} /></div>
              <p className="sidebar-card__text">Fill the missing fields to improve your profile and search visibility.</p>
            </div>
            <div className="sidebar-card">
              <p className="sidebar-card__label">Missing fields</p>
              <ul className="missing-list">
                {missingFields.length ? missingFields.map((field) => <li key={field}>{field}</li>) : <li>Nothing missing right now.</li>}
              </ul>
            </div>
            <div className="sidebar-card">
              <p className="sidebar-card__label">Quick uploads</p>
              <div className="upload-stack">
                <UploadButton label="Company logo" accept="image/*" onChange={(file) => handleUpload("companyLogo", file)} loading={uploading.companyLogo} />
                <UploadButton label="Intro video" accept="video/*" onChange={(file) => handleUpload("introVideo", file)} icon={Video} loading={uploading.introVideo} />
                <UploadButton label="Portfolio files" accept="image/*,application/pdf" multiple onChange={(files) => handleUpload("portfolio", files)} loading={uploading.portfolio} />
              </div>
            </div>
          </aside>

          <main className="profile-main">
            <form className="profile-form" onSubmit={saveProfile}>
              <Section icon={Briefcase} title="Basics" subtitle="These fields are shared by freelancers and clients.">
                <div className="profile-grid">
                  <Field label="Full name"><input value={draft.name} onChange={(e) => updateField("name", e.target.value)} /></Field>
                  <Field label="Username"><input value={draft.username} onChange={(e) => updateField("username", e.target.value)} /></Field>
                  <Field label="Professional title"><input value={draft.professionalTitle} onChange={(e) => updateField("professionalTitle", e.target.value)} /></Field>
                  <Field label="Phone number"><input value={draft.phoneNumber} onChange={(e) => updateField("phoneNumber", e.target.value)} /></Field>
                  <Field label="Country"><input value={draft.country} onChange={(e) => updateField("country", e.target.value)} /></Field>
                  <Field label="City"><input value={draft.city} onChange={(e) => updateField("city", e.target.value)} /></Field>
                  <Field label="Timezone"><input value={draft.timezone} onChange={(e) => updateField("timezone", e.target.value)} /></Field>
                  <Field label="Service mode"><select value={draft.serviceMode} onChange={(e) => updateField("serviceMode", e.target.value)}>{SERVICE_MODES.map((item) => <option key={item} value={item}>{item}</option>)}</select></Field>
                </div>
              </Section>

              {isFreelancer ? (
                <Section icon={Wrench} title="Services and skills" subtitle="This is the part that should feel like Fiverr and Upwork, but tailored to your service.">
                  <div className="profile-grid">
                    <Field label="Service category"><select value={draft.serviceCategory || ""} onChange={(e) => updateField("serviceCategory", e.target.value)}><option value="">Select a category</option>{SERVICE_GROUPS.map((group) => <optgroup key={group.label} label={group.label}>{group.options.map((item) => <option key={item} value={item}>{item}</option>)}</optgroup>)}</select></Field>
                    <Field label="Service area"><input value={draft.serviceArea} onChange={(e) => updateField("serviceArea", e.target.value)} /></Field>
                    <Field label="Years of experience"><input type="number" min="0" value={draft.yearsOfExperience} onChange={(e) => updateField("yearsOfExperience", e.target.value)} /></Field>
                    <Field label="Skill level"><select value={draft.skillLevel} onChange={(e) => updateField("skillLevel", e.target.value)}>{SKILL_LEVELS.map((item) => <option key={item} value={item}>{item}</option>)}</select></Field>
                    <Field label="Hourly rate"><input type="number" min="0" value={draft.hourlyRate} onChange={(e) => updateField("hourlyRate", e.target.value)} /></Field>
                    <Field label="Currency"><select value={draft.currency} onChange={(e) => updateField("currency", e.target.value)}>{CURRENCIES.map((item) => <option key={item} value={item}>{item}</option>)}</select></Field>
                    <Field label="Availability"><select value={draft.availabilityType} onChange={(e) => updateField("availabilityType", e.target.value)}>{AVAILABILITY_TYPES.map((item) => <option key={item} value={item}>{item}</option>)}</select></Field>
                    <Field label="Response time"><select value={draft.responseTime} onChange={(e) => updateField("responseTime", e.target.value)}>{RESPONSE_TIMES.map((item) => <option key={item} value={item}>{item}</option>)}</select></Field>
                  </div>
                  <Field label="Bio" hint="A short, sharp summary works best."><textarea rows="5" value={draft.bio} onChange={(e) => updateField("bio", e.target.value)} /></Field>
                  <div className="profile-grid">
                    <Field label="Skills"><textarea rows="4" value={draft.skillsText} onChange={(e) => updateField("skillsText", e.target.value)} /></Field>
                    <Field label="Tools / technologies"><textarea rows="4" value={draft.toolsTechnologiesText} onChange={(e) => updateField("toolsTechnologiesText", e.target.value)} /></Field>
                    <Field label="Primary skills"><textarea rows="4" value={draft.primarySkillsText} onChange={(e) => updateField("primarySkillsText", e.target.value)} /></Field>
                    <Field label="Languages"><textarea rows="4" value={draft.languagesText} onChange={(e) => updateField("languagesText", e.target.value)} /></Field>
                  </div>
                </Section>
              ) : (
                <Section icon={Building2} title="Company profile" subtitle="Tell freelancers what your business does and how you hire.">
                  <div className="profile-grid">
                    <Field label="Company name"><input value={draft.companyName} onChange={(e) => updateField("companyName", e.target.value)} /></Field>
                    <Field label="Industry"><select value={draft.industry} onChange={(e) => updateField("industry", e.target.value)}><option value="">Select industry</option>{CLIENT_INDUSTRIES.map((item) => <option key={item} value={item}>{item}</option>)}</select></Field>
                    <Field label="Company size"><select value={draft.companySize} onChange={(e) => updateField("companySize", e.target.value)}><option value="">Select size</option>{COMPANY_SIZES.map((item) => <option key={item} value={item}>{item}</option>)}</select></Field>
                    <Field label="Hiring type"><select value={draft.hiringType} onChange={(e) => updateField("hiringType", e.target.value)}><option value="">Select hiring type</option>{HIRING_TYPES.map((item) => <option key={item} value={item}>{item}</option>)}</select></Field>
                    <Field label="Budget"><input type="number" min="0" value={draft.budget} onChange={(e) => updateField("budget", e.target.value)} /></Field>
                    <Field label="Hiring capacity"><input type="number" min="1" value={draft.hiringCapacity} onChange={(e) => updateField("hiringCapacity", e.target.value)} /></Field>
                    <Field label="Preferred freelancer level"><select value={draft.preferredFreelancerLevel} onChange={(e) => updateField("preferredFreelancerLevel", e.target.value)}><option value="">Select level</option>{SKILL_LEVELS.map((item) => <option key={item} value={item}>{item}</option>)}</select></Field>
                    <Field label="Response time"><select value={draft.responseTime} onChange={(e) => updateField("responseTime", e.target.value)}><option value="">Select response time</option>{RESPONSE_TIMES.map((item) => <option key={item} value={item}>{item}</option>)}</select></Field>
                    <Field label="Preferred project type"><select value={draft.preferredProjectType} onChange={(e) => updateField("preferredProjectType", e.target.value)}><option value="">Select project type</option>{PROJECT_TYPES.map((item) => <option key={item} value={item}>{item}</option>)}</select></Field>
                  </div>
                  <Field label="Company description"><textarea rows="5" value={draft.companyDescription} onChange={(e) => updateField("companyDescription", e.target.value)} /></Field>
                  <div className="profile-grid">
                    <Field label="Preferred skills"><textarea rows="4" value={draft.preferredSkillsText} onChange={(e) => updateField("preferredSkillsText", e.target.value)} /></Field>
                    <Field label="Industries of interest"><textarea rows="4" value={draft.industriesOfInterestText} onChange={(e) => updateField("industriesOfInterestText", e.target.value)} /></Field>
                  </div>
                </Section>
              )}

              <Section icon={Globe} title="Media and links" subtitle="Add trust signals and outside links.">
                <div className="profile-grid">
                  {SOCIAL_FIELDS.map(([key, label]) => (
                    <Field key={key} label={label}>
                      <input value={draft[key] || ""} onChange={(e) => updateSocialField(key, e.target.value)} />
                    </Field>
                  ))}
                </div>
              </Section>

              <Section icon={Sparkles} title="Uploads" subtitle="Cover photo, avatar, company logo, intro video, and portfolio files.">
                <div className="profile-upload-grid">
                  <UploadButton label="Avatar" accept="image/*" onChange={(file) => handleUpload("avatar", file)} icon={Camera} loading={uploading.avatar} />
                  <UploadButton label="Cover photo" accept="image/*" onChange={(file) => handleUpload("coverPhoto", file)} icon={Camera} loading={uploading.coverPhoto} />
                  <UploadButton label={isClient ? "Company logo" : "Brand logo"} accept="image/*" onChange={(file) => handleUpload("companyLogo", file)} icon={Camera} loading={uploading.companyLogo} />
                  <UploadButton label="Intro video" accept="video/*" onChange={(file) => handleUpload("introVideo", file)} icon={Video} loading={uploading.introVideo} />
                  {isFreelancer ? <UploadButton label="Portfolio files" accept="image/*,application/pdf" multiple onChange={(files) => handleUpload("portfolio", files)} icon={Upload} loading={uploading.portfolio} /> : null}
                </div>
                {isFreelancer ? (
                  <div className="portfolio-list">
                    {Array.isArray(profile?.portfolio) && profile.portfolio.length ? profile.portfolio.map((item, index) => (
                      <div className="portfolio-item" key={`${item}-${index}`}>
                        <div className="portfolio-item__icon"><FileText size={18} /></div>
                        <div className="portfolio-item__meta">
                          <strong>{profile?.portfolioFileNames?.[index] || `Portfolio item ${index + 1}`}</strong>
                          <span>{item}</span>
                        </div>
                      </div>
                    )) : <p className="empty-note">No portfolio files uploaded yet.</p>}
                  </div>
                ) : null}
              </Section>

              <div className="profile-footer">
                <button type="submit" className="save-button" disabled={saving}><Save size={16} /><span>{saving ? "Saving profile..." : "Save profile"}</span></button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;

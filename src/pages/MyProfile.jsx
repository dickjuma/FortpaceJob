import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { getToken, profileAPI } from "../Services/api";
import "./MyProfile.css";

const toCsv = (arr) => (Array.isArray(arr) ? arr.join(", ") : "");
const fromCsv = (text) =>
  (text || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

const MyProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingPortfolio, setUploadingPortfolio] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [openSection, setOpenSection] = useState("personal");
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    companyName: "",
    bio: "",
    skills: "",
    hourlyRate: 10,
    currency: "USD",
    serviceMode: "",
    physicalCategory: "",
    serviceArea: "",
    companyDescription: "",
    industry: "",
    budget: 0,
    hiringCapacity: 1,
    country: "",
    languages: "",
  });

  useEffect(() => {
    if (!getToken()) {
      navigate("/signin");
      return;
    }
    let mounted = true;
    profileAPI
      .getMyProfile()
      .then((res) => {
        if (!mounted) return;
        setProfile(res.user);
        setForm({
          name: res.user.name || "",
          phoneNumber: res.user.phoneNumber || "",
          companyName: res.user.companyName || "",
          bio: res.user.bio || "",
          skills: toCsv(res.user.skills),
          hourlyRate: res.user.hourlyRate || 10,
          currency: res.user.currency || "USD",
          serviceMode: res.user.serviceMode || "",
          physicalCategory: res.user.physicalCategory || "",
          serviceArea: res.user.serviceArea || "",
          companyDescription: res.user.companyDescription || "",
          industry: res.user.industry || "",
          budget: res.user.budget || 0,
          hiringCapacity: res.user.hiringCapacity || 1,
          country: res.user.country || "",
          languages: toCsv(res.user.languages),
        });
      })
      .catch((e) => setError(e.message || "Failed to load profile"))
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, [navigate]);

  const completeness = useMemo(() => {
    if (!profile) return 0;
    const checks = [
      profile.name || profile.companyName,
      profile.bio,
      profile.skills?.length,
      profile.country,
      profile.languages?.length,
      profile.introVideo,
      profile.avatar,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [profile]);
  const isClient = profile?.role === "client";
  const isTalent = profile?.role === "freelancer";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveSection = async (section) => {
    setSavingSection(section);
    setError("");
    setNotice("");
    try {
      let payload = {};
      if (section === "personal") {
        payload = {
          name: form.name,
          companyName: form.companyName,
          phoneNumber: form.phoneNumber,
          country: form.country,
          languages: fromCsv(form.languages),
        };
      } else if (section === "skills") {
        payload = {
          bio: form.bio,
          skills: fromCsv(form.skills),
          serviceMode: form.serviceMode,
          physicalCategory: form.physicalCategory,
          serviceArea: form.serviceArea,
          hourlyRate: Number(form.hourlyRate || 0),
          currency: form.currency,
        };
      } else if (section === "business") {
        payload = {
          companyDescription: form.companyDescription,
          industry: form.industry,
          budget: Number(form.budget || 0),
          hiringCapacity: Number(form.hiringCapacity || 1),
        };
      }

      const res = await profileAPI.updateMyProfile(payload);
      setProfile(res.user);
      setNotice(`${section[0].toUpperCase() + section.slice(1)} section updated.`);
    } catch (e) {
      setError(e.message || "Could not update section");
    } finally {
      setSavingSection("");
    }
  };

  const uploadWithFeedback = async (task, doneMessage) => {
    setError("");
    setNotice("");
    try {
      const res = await task();
      setProfile(res.user);
      setNotice(doneMessage);
    } catch (err) {
      setError(err.message || "Upload failed");
    }
  };

  if (loading) return <div className="profile-page"><p>Loading profile...</p></div>;

  return (
    <div className="profile-page">
      <div className="profile-shell">
        <aside className="profile-aside">
          <h2>My Profile</h2>
          <div className="meter">
            <div className="meter-fill" style={{ width: `${completeness}%` }} />
          </div>
          <p className="meter-label">{completeness}% complete</p>

          <div className="media-box">
            <p className="box-title">{isClient ? "Client Contact Photo" : "Talent Profile Photo"}</p>
            {profile?.avatar ? <img src={profile.avatar} alt="avatar" className="avatar-preview" /> : <p>No avatar yet</p>}
            <label className="upload-btn">
              {uploadingAvatar ? "Uploading..." : "Upload Avatar"}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploadingAvatar(true);
                  await uploadWithFeedback(() => profileAPI.uploadAvatar(file), "Avatar uploaded.");
                  setUploadingAvatar(false);
                }}
              />
            </label>
          </div>

          {isClient && (
            <div className="media-box">
              <p className="box-title">Company Logo</p>
              {profile?.companyLogo ? <img src={profile.companyLogo} alt="company logo" className="avatar-preview" /> : <p>No company logo yet</p>}
              <label className="upload-btn">
                {uploadingLogo ? "Uploading..." : "Upload Company Logo"}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploadingLogo(true);
                    await uploadWithFeedback(() => profileAPI.uploadCompanyLogo(file), "Company logo uploaded.");
                    setUploadingLogo(false);
                  }}
                />
              </label>
            </div>
          )}
        </aside>

        <section className="profile-main">
          {notice && <div className="notice success">{notice}</div>}
          {error && <div className="notice error">{error}</div>}

          <div className="accordion">
            <button className="acc-head" onClick={() => setOpenSection(openSection === "personal" ? "" : "personal")}>
              <span>Personal Details</span>
              <ChevronDown className={openSection === "personal" ? "rotate" : ""} size={18} />
            </button>
            {openSection === "personal" && (
              <div className="acc-body">
                <p className="section-note">Keep your public identity complete and consistent. These details appear in your profile and conversations.</p>
                <div className="account-strip">
                  <div className="account-card">
                    <span className="label">Role</span>
                    <strong>{profile?.role || "-"}</strong>
                  </div>
                  <div className="account-card">
                    <span className="label">Email</span>
                    <strong>{profile?.email || "-"}</strong>
                  </div>
                  <div className="account-card">
                    <span className="label">Joined</span>
                    <strong>{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "-"}</strong>
                  </div>
                </div>

                <div className="grid personal-layout">
                  <label className="profile-field">
                    <span>Full Name</span>
                    <input name="name" value={form.name} onChange={handleChange} />
                  </label>
                  <label className="profile-field">
                    <span>Company Name</span>
                    <input name="companyName" value={form.companyName} onChange={handleChange} />
                  </label>
                  <label className="profile-field">
                    <span>Phone Number</span>
                    <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
                  </label>
                  <label className="profile-field">
                    <span>Country</span>
                    <input name="country" value={form.country} onChange={handleChange} />
                  </label>
                  <label className="profile-field full">
                    <span>Languages (comma separated)</span>
                    <input name="languages" value={form.languages} onChange={handleChange} />
                  </label>
                </div>
                <div className="save-row">
                  <button className="save-btn" onClick={() => saveSection("personal")} disabled={savingSection === "personal"}>
                    {savingSection === "personal" ? "Saving..." : "Update Personal Details"}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="accordion">
            <button className="acc-head" onClick={() => setOpenSection(openSection === "skills" ? "" : "skills")}>
              <span>{isClient ? "Hiring Requirements" : "Skills & Service"}</span>
              <ChevronDown className={openSection === "skills" ? "rotate" : ""} size={18} />
            </button>
            {openSection === "skills" && (
              <div className="acc-body">
                <div className="grid">
                  <label>Skills (comma separated)<input name="skills" value={form.skills} onChange={handleChange} /></label>
                  <label>Service Mode<input name="serviceMode" value={form.serviceMode} onChange={handleChange} /></label>
                  <label>Physical Category<input name="physicalCategory" value={form.physicalCategory} onChange={handleChange} /></label>
                  <label>Service Area<input name="serviceArea" value={form.serviceArea} onChange={handleChange} /></label>
                  <label>Hourly Rate<input type="number" name="hourlyRate" value={form.hourlyRate} onChange={handleChange} /></label>
                  <label>Currency<input name="currency" value={form.currency} onChange={handleChange} /></label>
                </div>
                <label>Bio<textarea name="bio" value={form.bio} onChange={handleChange} rows={4} /></label>
                <button className="save-btn" onClick={() => saveSection("skills")} disabled={savingSection === "skills"}>
                  {savingSection === "skills" ? "Saving..." : "Update Skills & Service"}
                </button>
              </div>
            )}
          </div>

          <div className="accordion">
            <button className="acc-head" onClick={() => setOpenSection(openSection === "business" ? "" : "business")}>
              <span>Business Details</span>
              <ChevronDown className={openSection === "business" ? "rotate" : ""} size={18} />
            </button>
            {openSection === "business" && (
              <div className="acc-body">
                <div className="grid">
                  <label>Industry<input name="industry" value={form.industry} onChange={handleChange} /></label>
                  <label>Budget<input type="number" name="budget" value={form.budget} onChange={handleChange} /></label>
                  <label>Hiring Capacity<input type="number" name="hiringCapacity" value={form.hiringCapacity} onChange={handleChange} /></label>
                  <label>Email Verified<input value={profile?.emailVerified ? "Yes" : "No"} disabled /></label>
                  <label>Phone Verified<input value={profile?.phoneVerified ? "Yes" : "No"} disabled /></label>
                  <label>Account Verified<input value={profile?.isVerified ? "Yes" : "No"} disabled /></label>
                </div>
                <label>Company Description<textarea name="companyDescription" value={form.companyDescription} onChange={handleChange} rows={4} /></label>
                <button className="save-btn" onClick={() => saveSection("business")} disabled={savingSection === "business"}>
                  {savingSection === "business" ? "Saving..." : "Update Business"}
                </button>
              </div>
            )}
          </div>

          <div className="accordion">
            <button className="acc-head" onClick={() => setOpenSection(openSection === "media" ? "" : "media")}>
              <span>{isTalent ? "Media & Portfolio" : "Branding Media"}</span>
              <ChevronDown className={openSection === "media" ? "rotate" : ""} size={18} />
            </button>
            {openSection === "media" && (
              <div className="acc-body">
                {isTalent && (
                  <>
                    <div className="portfolio-row">
                      <p className="box-title">Intro Video</p>
                      {profile?.introVideo ? <video src={profile.introVideo} controls className="video-preview" /> : <p>No intro video yet</p>}
                      <label className="upload-btn">
                        {uploadingVideo ? "Uploading..." : "Upload Intro Video"}
                        <input
                          type="file"
                          accept="video/*"
                          hidden
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setUploadingVideo(true);
                            await uploadWithFeedback(() => profileAPI.uploadIntroVideo(file), "Intro video uploaded.");
                            setUploadingVideo(false);
                          }}
                        />
                      </label>
                    </div>

                    <div className="portfolio-row">
                      <p className="box-title">Portfolio Files</p>
                      <label className="upload-btn">
                        {uploadingPortfolio ? "Uploading..." : "Upload Portfolio Files"}
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          multiple
                          hidden
                          onChange={async (e) => {
                            const files = Array.from(e.target.files || []);
                            if (!files.length) return;
                            setUploadingPortfolio(true);
                            await uploadWithFeedback(() => profileAPI.uploadPortfolio(files), "Portfolio files uploaded.");
                            setUploadingPortfolio(false);
                          }}
                        />
                      </label>
                    </div>
                  </>
                )}

                {profile?.portfolio?.length > 0 && (
                  <div className="portfolio-grid">
                    {profile.portfolio.map((url, idx) => (
                      <a key={idx} href={url} target="_blank" rel="noreferrer">
                        {profile?.portfolioFileNames?.[idx] || `Portfolio #${idx + 1}`}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MyProfile;

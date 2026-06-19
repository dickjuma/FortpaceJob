import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { faqs, categories } from "./data";
import { talentAPI } from "../../../platform/common/services/talentAPI";
import { createJob } from "../../services/clientApi";

const TalentRequest = () => {
  const [searchParams] = useSearchParams();
  const presetQuery = searchParams.get("q") || "";
  const presetType = searchParams.get("serviceMode") || searchParams.get("type") || "All services";
  const presetTalent = searchParams.get("talent") || "";
  const presetCategory = searchParams.get("category") || "";
  const presetPackage = searchParams.get("package") || "";
  const presetServiceType = presetType === "Onsite" ? "Physical on-site" : presetType;

  const [selectedTalent, setSelectedTalent] = useState(null);
  const [talentLoading, setTalentLoading] = useState(Boolean(presetTalent));
  const [submitting, setSubmitting] = useState(false);
  const [submittedJob, setSubmittedJob] = useState(null);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let active = true;

    const loadSelectedTalent = async () => {
      if (!presetTalent) {
        setSelectedTalent(null);
        setTalentLoading(false);
        return;
      }

      try {
        setTalentLoading(true);
        const isNumeric = /^\d+$/.test(presetTalent);
        const result = isNumeric
          ? await talentAPI.getTalentProfile(presetTalent)
          : await talentAPI.searchTalents({ q: presetTalent, limit: 1, sort: "relevance" });
        if (!active) return;
        setSelectedTalent(result?.user || result?.data?.[0] || null);
      } catch (error) {
        if (!active) return;
        setSelectedTalent(null);
      } finally {
        if (active) setTalentLoading(false);
      }
    };

    loadSelectedTalent();

    return () => {
      active = false;
    };
  }, [presetTalent]);

  const [formData, setFormData] = useState({
    service: presetQuery,
    serviceType: presetServiceType,
    location: "",
    budget: "",
    timeline: "",
    details: "",
    contactName: "",
    contactEmail: "",
    urgent: false
  });

  const categoryLabel = categories.find((item) => item.slug === presetCategory)?.title;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError("");

    const title = formData.service.trim() || selectedTalent?.name || "Talent request";
    const description = formData.details.trim();
    if (!title || !description) {
      setSubmitError("Please add the service needed and the project details.");
      return;
    }

    const numericBudget = Number(String(formData.budget).replace(/[^0-9.]/g, ""));
    const isHourly = /hr|hour/i.test(formData.budget);
    if (!Number.isFinite(numericBudget) || numericBudget <= 0) {
      setSubmitError("Please enter a budget amount so we can create the request.");
      return;
    }

    const payload = {
      title,
      description: [
        description,
        formData.location ? `Location: ${formData.location}` : null,
        formData.timeline ? `Timeline: ${formData.timeline}` : null,
        formData.contactName ? `Contact: ${formData.contactName}` : null,
        formData.contactEmail ? `Email: ${formData.contactEmail}` : null,
      ].filter(Boolean).join("\n\n"),
      category: presetCategory || categoryLabel || "Other",
      type: /onsite/i.test(formData.serviceType) ? "ONSITE" : formData.serviceType === "Hybrid" ? "HYBRID" : "REMOTE",
      budgetType: isHourly ? "HOURLY" : "FIXED",
      budgetMin: numericBudget,
      budgetMax: numericBudget,
      skills: (selectedTalent?.skills || selectedTalent?.primarySkills || []).slice(0, 8),
      experienceLevel: "INTERMEDIATE",
      isUrgent: Boolean(formData.urgent),
    };

    setSubmitting(true);
    createJob(payload)
      .then((result) => setSubmittedJob(result))
      .catch((error) => setSubmitError(error?.message || "Could not submit the request right now."))
      .finally(() => setSubmitting(false));
  };

  if (submittedJob) {
    return (
      <div className="talent-page">
        <section className="talent-section empty-state">
          <p className="eyebrow">Request sent</p>
          <h2>Your talent request is live.</h2>
          <p>We’ve stored the request and opened it to matching talent. You can now keep browsing or go back to your dashboard.</p>
          <div className="empty-state__actions">
            <Link className="cta-btn" to={`/find-work/work/${submittedJob.id}`}>
              View request
            </Link>
            <Link className="ghost" to="/client/dashboard">Open dashboard</Link>
            <Link className="ghost" to="/talent">Browse talent</Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="talent-page">
      <section className="request-hero">
        <div>
          <p className="eyebrow">Post a request</p>
          <h1>Tell us what you need and get matched fast</h1>
          <p className="subhead">
            Share scope, budget, and location. Forte connects you with vetted professionals.
          </p>
        </div>
        <div className="request-badges">
          <span>Guaranteed response within 24 hours</span>
          <span>Secure escrow payments</span>
          <span>Dedicated support</span>
        </div>
      </section>

      <section className="request-grid">
        <form className="request-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div>
              <label>Service needed</label>
              <input
                name="service"
                value={formData.service}
                onChange={handleChange}
                placeholder="e.g., panel upgrade, UI redesign"
              />
            </div>
            <div>
              <label>Service type</label>
              <select name="serviceType" value={formData.serviceType} onChange={handleChange}>
                <option>All services</option>
                <option>Physical on-site</option>
                <option>Fully online</option>
                <option>Hybrid</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div>
              <label>Location</label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City or remote"
              />
            </div>
            <div>
              <label>Budget</label>
              <input
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="$2000 total or $40/hr"
              />
            </div>
          </div>

          <div className="form-row">
            <div>
              <label>Timeline</label>
              <input
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                placeholder="Start date or timeline"
              />
            </div>
            <div className="checkbox-field">
              <label>Urgent request</label>
              <div>
                <input
                  id="urgent"
                  name="urgent"
                  type="checkbox"
                  checked={formData.urgent}
                  onChange={handleChange}
                />
                <label htmlFor="urgent">I need a pro within 24 hours</label>
              </div>
            </div>
          </div>

          <div>
            <label>Project details</label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              placeholder="Outline the work, preferred tools, or access needs"
              rows="5"
            />
          </div>

          <div className="form-row">
            <div>
              <label>Contact name</label>
              <input
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                placeholder="Full name"
              />
            </div>
            <div>
              <label>Contact email</label>
              <input
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="you@company.com"
              />
            </div>
          </div>

          {submitError ? <p className="error-message">{submitError}</p> : null}
          <button type="submit" className="cta-btn" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit request"}
          </button>
        </form>

        <aside className="request-summary">
          <h3>Request summary</h3>
          <div className="summary-box">
            <p><strong>Selected talent:</strong> {talentLoading ? "Loading..." : selectedTalent ? selectedTalent.name : "Not selected"}</p>
            <p><strong>Category:</strong> {categoryLabel || "Any"}</p>
            <p><strong>Package:</strong> {presetPackage || "Flexible"}</p>
            <p><strong>Service type:</strong> {formData.serviceType}</p>
          </div>

          {selectedTalent && (
            <div className="summary-card">
              <div>
                <h4>{selectedTalent.name}</h4>
                <p>{selectedTalent.title || selectedTalent.professionalTitle || selectedTalent.serviceSummary || "Freelancer"}</p>
                <span>{selectedTalent.location}</span>
              </div>
              <div className="talent-tags">
                {((Array.isArray(selectedTalent.skills) ? selectedTalent.skills : Array.isArray(selectedTalent.primarySkills) ? selectedTalent.primarySkills : Array.isArray(selectedTalent.tags) ? selectedTalent.tags : [])).slice(0, 4).map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
                <Link className="ghost" to={`/talent/${selectedTalent.id || selectedTalent._id}`}>View profile</Link>
              </div>
          )}

          <div className="summary-help">
            <h4>Need help?</h4>
            <p>Our team can shortlist the best-fit pros based on your budget and timeline.</p>
            <Link className="ghost" to="/contact">Talk to support</Link>
          </div>
        </aside>
      </section>

      <section className="talent-section">
        <div className="section-header">
          <h2>Frequently asked questions</h2>
          <p>Everything you need to know before posting.</p>
        </div>
        <div className="faq-grid">
          {faqs.map((item) => (
            <div key={item.q} className="faq-card">
              <h4>{item.q}</h4>
              <p>{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TalentRequest;

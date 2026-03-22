import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  ChevronDown,
  TrendingUp,
  FileText,
  FileImage,
  FileVideo,
  FileArchive,
  FileSpreadsheet,
  X,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Download,
  Award,
  Shield,
  CheckCircle,
  Camera,
  Video,
  User,
  Briefcase,
  Wrench,
  BookOpen,
  Award as AwardIcon,
  DollarSign,
  Image as ImageIcon,
  Globe,
  Linkedin,
  Github,
  Twitter,
  Facebook,
  Clock,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { getToken, profileAPI } from '../Services/api';
import debounce from 'lodash/debounce';

// ----------------------------------------------------------------------
//  Constants & Helpers
// ----------------------------------------------------------------------
const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica",
  "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
  "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon",
  "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel",
  "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo",
  "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania",
  "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius",
  "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia",
  "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman",
  "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
  "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
  "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan",
  "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
  "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City",
  "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
];

// ----- Expanded Service Categories (blended onsite + online) -----
const ONSITE_TRADES = [
  "Plumbing", "Electrical", "HVAC", "Carpentry", "Painting", "Landscaping",
  "Roofing", "Flooring", "Masonry", "Drywall", "Insulation", "Siding",
  "Windows & Doors", "Fencing", "Concrete", "Pest Control", "Cleaning",
  "Moving", "Handyman", "Appliance Repair", "Auto Repair / Mechanics",
  "Locksmith", "Paving", "Tree Service", "Pool Maintenance", "Solar Installation",
  "Security System Installation", "Smart Home Setup", "Furniture Assembly"
];

const ONLINE_SERVICES = [
  // Development & IT
  "Web Development", "Mobile App Development", "Software Development",
  "Game Development", "DevOps & Cloud", "Cybersecurity", "Database Administration",
  "API Integration", "Blockchain / Crypto", "AI / Machine Learning",
  // Design & Creative
  "Graphic Design", "UI/UX Design", "Logo Design", "Illustration",
  "Video Editing", "Motion Graphics", "3D Modeling & Rendering", "Architectural Design",
  "Interior Design", "Photoshop Editing", "CAD Design",
  // Writing & Translation
  "Content Writing", "Copywriting", "Blog Writing", "Technical Writing",
  "Proofreading & Editing", "Translation", "Transcription",
  // Marketing & Sales
  "SEO", "Social Media Marketing", "Email Marketing", "PPC Advertising",
  "Market Research", "Sales Copy", "Influencer Marketing", "Brand Strategy",
  // Business & Consulting
  "Business Consulting", "Financial Consulting", "Legal Consulting",
  "Project Management", "Virtual Assistant", "Customer Service",
  "Data Entry", "Excel / Spreadsheets", "Accounting / Bookkeeping",
  // Audio & Video
  "Voice Over", "Podcast Editing", "Music Production", "Audio Engineering",
  // Engineering & Architecture
  "Civil Engineering", "Mechanical Engineering", "Electrical Engineering",
  "Structural Engineering", "Architecture", "Landscape Architecture",
  // Other
  "Other"
];

const SERVICE_GROUPS = [
  { label: "Onsite Trades", options: ONSITE_TRADES },
  { label: "Online Services", options: ONLINE_SERVICES },
];

const SERVICE_MODES = ["Remote", "Onsite", "Hybrid"];
const CURRENCIES = ["USD", "EUR", "GBP", "INR", "AUD", "CAD"];
const INDUSTRIES = [
  "Residential", "Commercial", "Industrial", "Property Management", "Construction", "Other",
];
const SKILL_LEVELS = ["Beginner", "Intermediate", "Expert"];
const PROJECT_TYPES = ["Short-term", "Long-term", "Both"];
const RESPONSE_TIMES = ["Within 1 hour", "Within 1 day", "Within 2 days", "Within a week"];
const AVAILABILITY_TYPES = ["Full-time", "Part-time", "Weekdays", "Weekends", "Anytime"];

// Client-specific constants
const COMPANY_SIZES = ["1–10", "11–50", "51–200", "201–500", "500+"];
const HIRING_TYPES = ["Full-time", "Part-time", "Project-based", "Freelance only"];
const FREELANCER_LEVELS = ["Beginner", "Intermediate", "Expert"];
const CLIENT_INDUSTRIES = [
  "Technology", "Marketing", "Education", "Healthcare", "Finance", "Real Estate",
  "Construction", "Retail", "Hospitality", "Other"
];

const SECTION_WEIGHTS = {
  personal: 15,
  trade: 20,
  skills: 15,
  experience: 15,
  education: 10,
  certifications: 10,
  pricing: 15,
  media: 10,
  social: 5,
  clientBasic: 10,
  clientCompany: 20,
  clientPreferences: 15,
  clientAdvanced: 10,
};

const toCsv = (arr) => (Array.isArray(arr) ? arr.join(", ") : "");
const fromCsv = (text) =>
  (text || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

const getFileType = (url) => {
  const ext = url.split(".").pop().toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return "image";
  if (["mp4", "webm", "ogg", "mov"].includes(ext)) return "video";
  if (ext === "pdf") return "pdf";
  return "other";
};

const getFileIcon = (url) => {
  const ext = url.split(".").pop().toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return FileImage;
  if (["mp4", "webm", "ogg", "mov"].includes(ext)) return FileVideo;
  if (["pdf", "doc", "docx", "ppt", "pptx"].includes(ext)) return FileText;
  if (["xls", "xlsx"].includes(ext)) return FileSpreadsheet;
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return FileArchive;
  return FileText;
};

const computeCompleteness = (profile, experiences, education, certifications, portfolioItems, packages, languages, socialLinks, pastProjects) => {
  if (!profile) return 0;
  let total = 0;
  // Personal (shared)
  if (profile.name || profile.companyName) total += SECTION_WEIGHTS.personal * 0.2;
  if (profile.username) total += SECTION_WEIGHTS.personal * 0.1;
  if (profile.professionalTitle) total += SECTION_WEIGHTS.personal * 0.1;
  if (profile.country) total += SECTION_WEIGHTS.personal * 0.2;
  if (profile.city) total += SECTION_WEIGHTS.personal * 0.1;
  if (languages?.length) total += SECTION_WEIGHTS.personal * 0.2;
  if (profile.phoneNumber) total += SECTION_WEIGHTS.personal * 0.1;

  if (profile.role === 'freelancer') {
    // Trade/Skills
    if (profile.tradeCategory) total += SECTION_WEIGHTS.trade * 0.2;
    if (profile.yearsOfExperience > 0) total += SECTION_WEIGHTS.trade * 0.2;
    if (profile.licenseNumber) total += SECTION_WEIGHTS.trade * 0.2;
    if (profile.insured || profile.bonded) total += SECTION_WEIGHTS.trade * 0.2;
    if (profile.serviceRadius) total += SECTION_WEIGHTS.trade * 0.2;
    // Skills
    if (profile.primarySkills?.length) total += SECTION_WEIGHTS.skills * 0.3;
    if (profile.skillLevel) total += SECTION_WEIGHTS.skills * 0.2;
    if (profile.toolsTechnologies?.length) total += SECTION_WEIGHTS.skills * 0.2;
    if (profile.bio) total += SECTION_WEIGHTS.skills * 0.3;
    // Experience
    if (experiences.length > 0) total += SECTION_WEIGHTS.experience * 0.5;
    if (profile.skills?.length) total += SECTION_WEIGHTS.experience * 0.5;
    // Education
    if (education.length > 0) total += SECTION_WEIGHTS.education;
    // Certifications
    if (certifications.length > 0) total += SECTION_WEIGHTS.certifications;
    // Pricing
    if (profile.hourlyRate > 0) total += SECTION_WEIGHTS.pricing * 0.5;
    if (packages?.length > 0) total += SECTION_WEIGHTS.pricing * 0.5;
    // Media
    if (profile.avatar) total += SECTION_WEIGHTS.media * 0.2;
    if (profile.coverPhoto) total += SECTION_WEIGHTS.media * 0.2;
    if (profile.introVideo) total += SECTION_WEIGHTS.media * 0.2;
    if (portfolioItems.length > 0) total += SECTION_WEIGHTS.media * 0.2 * Math.min(portfolioItems.length, 5) / 5;
    if (profile.companyLogo) total += SECTION_WEIGHTS.media * 0.2;
  } else if (profile.role === 'client') {
    // Basic Info
    if (profile.name) total += SECTION_WEIGHTS.clientBasic * 0.3;
    if (profile.companyName) total += SECTION_WEIGHTS.clientBasic * 0.2;
    if (profile.username) total += SECTION_WEIGHTS.clientBasic * 0.1;
    if (profile.avatar) total += SECTION_WEIGHTS.clientBasic * 0.2;
    if (profile.emailVerified) total += SECTION_WEIGHTS.clientBasic * 0.1;
    if (profile.phoneVerified) total += SECTION_WEIGHTS.clientBasic * 0.1;
    // Company Info
    if (profile.industry) total += SECTION_WEIGHTS.clientCompany * 0.25;
    if (profile.companySize) total += SECTION_WEIGHTS.clientCompany * 0.25;
    if (profile.website) total += SECTION_WEIGHTS.clientCompany * 0.15;
    if (profile.companyDescription) total += SECTION_WEIGHTS.clientCompany * 0.25;
    if (profile.country && profile.city) total += SECTION_WEIGHTS.clientCompany * 0.1;
    // Preferences
    if (profile.hiringType) total += SECTION_WEIGHTS.clientPreferences * 0.2;
    if (profile.preferredSkills?.length) total += SECTION_WEIGHTS.clientPreferences * 0.2;
    if (languages?.length) total += SECTION_WEIGHTS.clientPreferences * 0.2;
    if (profile.responseTime) total += SECTION_WEIGHTS.clientPreferences * 0.2;
    if (profile.paymentVerified) total += SECTION_WEIGHTS.clientPreferences * 0.2;
    // Social
    if (socialLinks && Object.values(socialLinks).some(v => v)) total += SECTION_WEIGHTS.social;
    // Advanced
    if (profile.industriesOfInterest?.length) total += SECTION_WEIGHTS.clientAdvanced * 0.25;
    if (pastProjects?.length > 0) total += SECTION_WEIGHTS.clientAdvanced * 0.25;
    if (profile.preferredFreelancerLevel) total += SECTION_WEIGHTS.clientAdvanced * 0.25;
    if (profile.introVideo) total += SECTION_WEIGHTS.clientAdvanced * 0.25;
  }

  return Math.min(Math.round(total), 100);
};

// Enhanced badges with descriptions for tooltips
const getBadges = (profile, completeness, portfolioCount, hasIntroVideo) => {
  const badges = [];
  if (profile?.emailVerified) badges.push({ name: "Email Verified", icon: CheckCircle, color: "text-green-600", description: "Your email address has been confirmed." });
  if (profile?.phoneVerified) badges.push({ name: "Phone Verified", icon: CheckCircle, color: "text-green-600", description: "Your phone number has been verified." });
  if (profile?.isVerified) badges.push({ name: "Identity Verified", icon: Shield, color: "text-blue-600", description: "Your identity has been verified." });
  if (profile?.paymentVerified) badges.push({ name: "Payment Verified", icon: Shield, color: "text-purple-600", description: "Your payment method is verified." });
  if (profile?.topRated) badges.push({ name: "Top Rated", icon: Award, color: "text-yellow-600", description: "You are among the highest-rated professionals." });
  if (profile?.risingTalent) badges.push({ name: "Rising Talent", icon: TrendingUp, color: "text-green-600", description: "You are quickly gaining recognition." });
  if (completeness >= 50) badges.push({ name: "50% Complete", icon: Award, color: "text-yellow-600", description: "Your profile is halfway there!" });
  if (completeness >= 80) badges.push({ name: "80% Complete", icon: Award, color: "text-yellow-600", description: "Almost done – keep going!" });
  if (completeness === 100) badges.push({ name: "All-Star Profile", icon: Award, color: "text-purple-600", description: "Perfect! Your profile is complete." });
  if (profile?.role === 'freelancer') {
    if (portfolioCount >= 3) badges.push({ name: "Portfolio Starter", icon: Award, color: "text-indigo-600", description: "You have at least 3 portfolio items." });
    if (hasIntroVideo) badges.push({ name: "Video Introduction", icon: Award, color: "text-indigo-600", description: "You've uploaded an intro video." });
  }
  return badges;
};

// ----------------------------------------------------------------------
//  Custom Hooks
// ----------------------------------------------------------------------
const useProfileData = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [lastSaved, setLastSaved] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [packages, setPackages] = useState([]);
  const [socialLinks, setSocialLinks] = useState({ website: '', linkedin: '', github: '', dribbble: '', behance: '', medium: '', facebook: '', twitter: '' });
  const [languages, setLanguages] = useState([]);
  const [pastProjects, setPastProjects] = useState([]);

  useEffect(() => {
    if (!getToken()) {
      navigate('/signin');
      return;
    }
    let mounted = true;
    profileAPI.getMyProfile()
      .then(res => {
        if (!mounted) return;
        setProfile(res.user);
        setExperiences(res.user.experiences || []);
        setEducation(res.user.education || []);
        setCertifications(res.user.certifications || []);
        setPackages(res.user.packages || []);
        setSocialLinks(res.user.socialLinks || { website: '', linkedin: '', github: '', dribbble: '', behance: '', medium: '', facebook: '', twitter: '' });
        setLanguages(res.user.languages || []);
        setPastProjects(res.user.pastProjects || []);
        if (res.user.portfolio && res.user.portfolioFileNames) {
          const items = res.user.portfolio.map((url, idx) => ({
            id: idx,
            url,
            name: res.user.portfolioFileNames[idx] || `Portfolio #${idx + 1}`,
            size: null,
            uploadedAt: null,
            type: getFileType(url),
            title: res.user.portfolioTitles?.[idx] || '',
            description: res.user.portfolioDescriptions?.[idx] || '',
            liveLink: res.user.portfolioLinks?.[idx] || '',
            role: res.user.portfolioRoles?.[idx] || '',
            technologies: res.user.portfolioTechnologies?.[idx] || [],
          }));
          setPortfolioItems(items);
        } else {
          setPortfolioItems([]);
        }
      })
      .catch(e => setError(e.message || 'Failed to load profile'))
      .finally(() => setLoading(false));

    return () => { mounted = false; };
  }, [navigate]);

  const updateSection = async (payload, sectionName) => {
    setError('');
    setNotice('');
    try {
      const res = await profileAPI.updateMyProfile(payload);
      setProfile(res.user);
      setNotice(`${sectionName} section updated.`);
      setLastSaved(new Date());
      return res.user;
    } catch (e) {
      setError(e.message || 'Could not update section');
      throw e;
    }
  };

  const uploadFile = async (uploadFn, files, successMessage, setUploading) => {
    setError('');
    setNotice('');
    setUploading(true);
    try {
      const res = await uploadFn(files);
      setProfile(res.user);
      if (res.user.portfolio && res.user.portfolioFileNames) {
        const items = res.user.portfolio.map((url, idx) => ({
          id: idx,
          url,
          name: res.user.portfolioFileNames[idx] || `Portfolio #${idx + 1}`,
          size: null,
          uploadedAt: null,
          type: getFileType(url),
          title: res.user.portfolioTitles?.[idx] || '',
          description: res.user.portfolioDescriptions?.[idx] || '',
          liveLink: res.user.portfolioLinks?.[idx] || '',
          role: res.user.portfolioRoles?.[idx] || '',
          technologies: res.user.portfolioTechnologies?.[idx] || [],
        }));
        setPortfolioItems(items);
      }
      setNotice(successMessage);
      setLastSaved(new Date());
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const deletePortfolioItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      // Uncomment when backend endpoint is available
      // await profileAPI.deletePortfolioItem(itemId);
      setPortfolioItems(prev => prev.filter(item => item.id !== itemId));
      setNotice('Portfolio item deleted.');
      setLastSaved(new Date());
    } catch (err) {
      setError(err.message || 'Delete failed');
    }
  };

  const updatePortfolioItem = async (itemId, updatedFields) => {
    try {
      // Uncomment when backend endpoint is available
      // await profileAPI.updatePortfolioItem(itemId, updatedFields);
      setPortfolioItems(prev => prev.map(item => item.id === itemId ? { ...item, ...updatedFields } : item));
      setNotice('Portfolio item updated.');
      setLastSaved(new Date());
    } catch (err) {
      setError(err.message || 'Update failed');
    }
  };

  return {
    profile,
    loading,
    error,
    notice,
    lastSaved,
    setError,
    setNotice,
    experiences, setExperiences,
    education, setEducation,
    certifications, setCertifications,
    portfolioItems, setPortfolioItems,
    packages, setPackages,
    socialLinks, setSocialLinks,
    languages, setLanguages,
    pastProjects, setPastProjects,
    updateSection,
    uploadFile,
    deletePortfolioItem,
    updatePortfolioItem,
  };
};

const useDynamicList = (initialItems = []) => {
  const [items, setItems] = useState(initialItems);
  const addItem = (newItem) => setItems([...items, newItem]);
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));
  const updateItem = (index, field, value) => {
    setItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };
  return { items, setItems, addItem, removeItem, updateItem };
};

// ----------------------------------------------------------------------
//  Reusable Subcomponents
// ----------------------------------------------------------------------
const AccordionSection = ({ title, isOpen, onToggle, children, icon: Icon }) => (
  <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm transition-all hover:shadow-md">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between bg-gray-50 px-4 py-3 text-left font-semibold text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-300"
      aria-expanded={isOpen}
    >
      <span className="flex items-center gap-2">
        {Icon && <Icon size={18} className="text-gray-600" />}
        {title}
      </span>
      <ChevronDown
        className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        size={18}
      />
    </button>
    {isOpen && <div className="p-5 bg-white">{children}</div>}
  </div>
);

const DynamicList = ({ items, onAdd, onRemove, renderItem, addLabel = 'Add' }) => (
  <div>
    {items.map((item, index) => (
      <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg relative bg-white hover:shadow-sm transition">
        <button
          onClick={() => onRemove(index)}
          className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
          aria-label="Remove item"
        >
          <Trash2 size={18} />
        </button>
        {renderItem(item, index)}
      </div>
    ))}
    <button
      onClick={onAdd}
      className="flex items-center gap-2 text-red-600 font-semibold hover:text-red-700 transition"
    >
      <Plus size={18} /> {addLabel}
    </button>
  </div>
);

const FileUploader = ({
  accept,
  multiple = false,
  onUpload,
  uploading = false,
  label,
  icon: Icon = Camera,
  className = '',
}) => {
  const inputRef = useRef();

  const handleChange = (e) => {
    const files = multiple ? Array.from(e.target.files) : e.target.files?.[0];
    if (!files || (Array.isArray(files) && files.length === 0)) return;
    onUpload(files);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <label className={`inline-flex items-center gap-2 cursor-pointer transition hover:opacity-80 ${className}`}>
      <Icon size={18} />
      <span>{uploading ? 'Uploading...' : label}</span>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        hidden
        onChange={handleChange}
        disabled={uploading}
      />
    </label>
  );
};

const PreviewModal = ({ file, onClose, onPrev, onNext, hasMultiple }) => {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext) onNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, onPrev, onNext]);

  if (!file) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-4xl w-full max-h-full overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-bold truncate">{file.name}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded"
            aria-label="Close preview"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4 flex justify-center relative">
          {file.type === 'image' && (
            <>
              <img src={file.url} alt="" className="max-w-full max-h-[70vh]" />
              {hasMultiple && (
                <>
                  <button
                    onClick={onPrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-100"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={onNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-100"
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </>
          )}
          {file.type === 'video' && (
            <video src={file.url} controls className="max-w-full max-h-[70vh]" />
          )}
          {file.type === 'pdf' && (
            <iframe src={file.url} className="w-full h-[70vh]" title="PDF preview" />
          )}
          {file.type === 'other' && (
            <div className="text-center">
              <FileText size={48} className="mx-auto text-gray-400" />
              <p className="mt-2">
                Cannot preview.{' '}
                <a
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline inline-flex items-center gap-1"
                >
                  <Download size={16} /> Download
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProgressBar = ({ completeness }) => {
  const milestones = [
    { threshold: 25, label: 'Basic' },
    { threshold: 50, label: 'Skills' },
    { threshold: 75, label: 'Experience' },
    { threshold: 100, label: 'Complete' },
  ];
  return (
    <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gray-800">Profile Strength</h3>
        <span className="text-sm font-medium text-red-600">{completeness}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full relative">
        <div
          className="h-full bg-red-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${completeness}%` }}
        />
      </div>
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        {milestones.map((m) => (
          <span key={m.threshold} className={completeness >= m.threshold ? 'text-red-600 font-medium' : ''}>
            {m.label}
          </span>
        ))}
      </div>
    </div>
  );
};

const ProfileHeader = ({
  profile,
  badges,
  onUploadAvatar,
  onUploadCover,
  onUploadIntroVideo,
  uploadingAvatar,
  uploadingCover,
  uploadingVideo,
  onPreviewFile,
}) => {
  const isTalent = profile?.role === 'freelancer';

  return (
    <>
      <div className="relative h-64 md:h-80 bg-gray-300 overflow-hidden">
        {profile?.coverPhoto ? (
          <img src={profile.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white">
            <Camera size={32} />
            <span className="text-lg ml-2">Upload a cover photo</span>
          </div>
        )}
        <div className="absolute bottom-4 right-4">
          <FileUploader
            accept="image/*"
            onUpload={onUploadCover}
            uploading={uploadingCover}
            label=""
            icon={Camera}
            className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-100"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 relative">
        <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 mb-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
              {profile?.avatar ? (
                <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <Camera size={32} />
                </div>
              )}
            </div>
            <div className="absolute bottom-0 right-0">
              <FileUploader
                accept="image/*"
                onUpload={onUploadAvatar}
                uploading={uploadingAvatar}
                label=""
                icon={Camera}
                className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
              />
            </div>
          </div>

          <div className="mt-4 md:mt-0 md:ml-6 flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              {profile?.name || profile?.companyName || 'Your Name'}
            </h1>
            <p className="text-gray-600 flex items-center gap-1 mt-1">
              {isTalent ? 'Service Provider' : profile?.role === 'client' ? 'Client' : profile?.role} • {profile?.country || 'Location not set'}
            </p>

            {badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {badges.slice(0, 4).map((badge, idx) => {
                  const Icon = badge.icon;
                  return (
                    <span
                      key={idx}
                      className="relative group inline-flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full cursor-help"
                    >
                      <Icon size={12} className={badge.color} />
                      <span className={badge.color}>{badge.name}</span>
                      <span className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                        {badge.description}
                      </span>
                    </span>
                  );
                })}
                {badges.length > 4 && (
                  <span className="text-xs text-gray-500">+{badges.length - 4} more</span>
                )}
              </div>
            )}
          </div>

          {profile?.introVideo && (
            <div className="mt-4 md:mt-0 md:ml-4">
              <div
                className="relative w-32 h-20 bg-black rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => onPreviewFile({ url: profile.introVideo, name: 'Intro Video', type: 'video' })}
              >
                <video src={profile.introVideo} className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-40 transition">
                  <Video size={24} className="text-white" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Intro Video</p>
            </div>
          )}
        </div>

        {isTalent && !profile?.introVideo && (
          <div className="mb-4">
            <FileUploader
              accept="video/*"
              onUpload={onUploadIntroVideo}
              uploading={uploadingVideo}
              label="Upload Intro Video"
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            />
          </div>
        )}
      </div>
    </>
  );
};

const Field = ({ label, error, className = '', children }) => (
  <label className={`block ${className}`}>
    <span className="block text-sm font-semibold text-gray-700 mb-1">
      {label}
      {error && <span className="text-red-500 text-xs ml-2">{error}</span>}
    </span>
    {children}
  </label>
);

const SaveButton = ({ onClick, loading, children }) => (
  <button
    type={onClick ? 'button' : 'submit'}
    onClick={onClick}
    disabled={loading}
    className="bg-gray-900 text-white px-5 py-2 rounded-lg font-bold hover:bg-gray-800 disabled:opacity-50 transition"
  >
    {loading ? 'Saving...' : children}
  </button>
);

// ----------------------------------------------------------------------
//  Main Component
// ----------------------------------------------------------------------
export const MyProfile = () => {
  const {
    profile,
    loading,
    error,
    notice,
    lastSaved,
    setError,
    setNotice,
    experiences, setExperiences,
    education, setEducation,
    certifications, setCertifications,
    portfolioItems, setPortfolioItems,
    packages, setPackages,
    socialLinks, setSocialLinks,
    languages, setLanguages,
    pastProjects, setPastProjects,
    updateSection,
    uploadFile,
    deletePortfolioItem,
    updatePortfolioItem,
  } = useProfileData();

  const [openSection, setOpenSection] = useState('personal');
  const [previewFile, setPreviewFile] = useState(null);
  const [uploadingStates, setUploadingStates] = useState({
    avatar: false,
    cover: false,
    video: false,
    portfolio: false,
  });

  const isClient = profile?.role === 'client';
  const isTalent = profile?.role === 'freelancer';

  // Dynamic lists
  const expList = useDynamicList(experiences);
  const eduList = useDynamicList(education);
  const certList = useDynamicList(certifications);
  const packageList = useDynamicList(packages);
  const languageList = useDynamicList(languages);
  const pastProjectsList = useDynamicList(pastProjects);

  useEffect(() => {
    expList.setItems(experiences);
  }, [experiences]);
  useEffect(() => {
    eduList.setItems(education);
  }, [education]);
  useEffect(() => {
    certList.setItems(certifications);
  }, [certifications]);
  useEffect(() => {
    packageList.setItems(packages);
  }, [packages]);
  useEffect(() => {
    languageList.setItems(languages);
  }, [languages]);
  useEffect(() => {
    pastProjectsList.setItems(pastProjects);
  }, [pastProjects]);

  const completeness = useMemo(
    () => computeCompleteness(
      profile,
      experiences,
      education,
      certifications,
      portfolioItems,
      packages,
      languages,
      socialLinks,
      pastProjects
    ),
    [profile, experiences, education, certifications, portfolioItems, packages, languages, socialLinks, pastProjects]
  );

  const badges = useMemo(
    () => getBadges(profile, completeness, portfolioItems.length, !!profile?.introVideo),
    [profile, completeness, portfolioItems.length]
  );

  // Auto-dismiss notice after 5 seconds
  useEffect(() => {
    if (notice) {
      const timer = setTimeout(() => setNotice(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [notice, setNotice]);

  // Keyboard shortcut: Cmd/Ctrl + S to save current section
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        const form = document.getElementById(`form-${openSection}`);
        if (form) form.requestSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openSection]);

  // Forms
  const personalSchema = yup.object({
    name: yup.string().required('Name is required'),
    username: yup.string(),
    professionalTitle: yup.string(),
    phoneNumber: yup.string(),
    country: yup.string(),
    city: yup.string(),
    timezone: yup.string(),
  });

  const skillsSchema = yup.object({
    primarySkills: yup.string(),
    subSkills: yup.string(),
    skillLevel: yup.string(),
    yearsOfExperience: yup.number().min(0).nullable(),
    toolsTechnologies: yup.string(),
    serviceMode: yup.string(),
    physicalCategory: yup.string(),
    serviceArea: yup.string(),
    hourlyRate: yup.number().min(0).nullable(),
    currency: yup.string(),
    bio: yup.string(),
  });

  const workPrefSchema = yup.object({
    availableHours: yup.number().min(0).nullable(),
    preferredProjectType: yup.string(),
    responseTime: yup.string(),
    availabilityType: yup.string(),
  });

  const tradeSchema = yup.object({
    tradeCategory: yup.string(),
    yearsOfExperience: yup.number().min(0).nullable(),
    licenseNumber: yup.string(),
    insured: yup.boolean(),
    bonded: yup.boolean(),
    serviceRadius: yup.number().min(0).nullable(),
    availability: yup.string(),
  });

  const businessSchema = yup.object({
    companyDescription: yup.string(),
    industry: yup.string(),
    budget: yup.number().min(0).nullable(),
    hiringCapacity: yup.number().min(1).nullable(),
  });

  const socialSchema = yup.object({
    website: yup.string().url().nullable(),
    linkedin: yup.string().url().nullable(),
    github: yup.string().url().nullable(),
    dribbble: yup.string().url().nullable(),
    behance: yup.string().url().nullable(),
    medium: yup.string().url().nullable(),
    facebook: yup.string().url().nullable(),
    twitter: yup.string().url().nullable(),
  });

  const clientBasicSchema = yup.object({
    name: yup.string().required('Full name is required'),
    companyName: yup.string(),
    username: yup.string(),
    phoneNumber: yup.string(),
    country: yup.string(),
    city: yup.string(),
    timezone: yup.string(),
  });

  const clientCompanySchema = yup.object({
    industry: yup.string(),
    companySize: yup.string(),
    website: yup.string().url().nullable(),
    companyDescription: yup.string(),
  });

  const clientPreferencesSchema = yup.object({
    hiringType: yup.string(),
    preferredSkills: yup.string(),
    responseTime: yup.string(),
  });

  const clientAdvancedSchema = yup.object({
    industriesOfInterest: yup.string(),
    preferredFreelancerLevel: yup.string(),
  });

  // Initialize forms
  const personalForm = useForm({
    resolver: yupResolver(personalSchema),
    defaultValues: profile ? {
      name: profile.name || '',
      username: profile.username || '',
      professionalTitle: profile.professionalTitle || '',
      phoneNumber: profile.phoneNumber || '',
      country: profile.country || '',
      city: profile.city || '',
      timezone: profile.timezone || '',
    } : {},
  });

  const tradeForm = useForm({
    resolver: yupResolver(tradeSchema),
    defaultValues: profile ? {
      tradeCategory: profile.tradeCategory || '',
      yearsOfExperience: profile.yearsOfExperience || 0,
      licenseNumber: profile.licenseNumber || '',
      insured: profile.insured || false,
      bonded: profile.bonded || false,
      serviceRadius: profile.serviceRadius || 50,
      availability: profile.availability || 'weekdays',
    } : {},
  });

  const skillsForm = useForm({
    resolver: yupResolver(skillsSchema),
    defaultValues: profile ? {
      primarySkills: toCsv(profile.primarySkills),
      subSkills: toCsv(profile.subSkills),
      skillLevel: profile.skillLevel || '',
      yearsOfExperience: profile.yearsOfExperience || 0,
      toolsTechnologies: toCsv(profile.toolsTechnologies),
      serviceMode: profile.serviceMode || '',
      physicalCategory: profile.physicalCategory || '',
      serviceArea: profile.serviceArea || '',
      hourlyRate: profile.hourlyRate || 10,
      currency: profile.currency || 'USD',
      bio: profile.bio || '',
    } : {},
  });

  const workPrefForm = useForm({
    resolver: yupResolver(workPrefSchema),
    defaultValues: profile ? {
      availableHours: profile.availableHours || 40,
      preferredProjectType: profile.preferredProjectType || 'Both',
      responseTime: profile.responseTime || 'Within 1 day',
      availabilityType: profile.availability || 'Full-time',
    } : {},
  });

  const businessForm = useForm({
    resolver: yupResolver(businessSchema),
    defaultValues: profile ? {
      companyDescription: profile.companyDescription || '',
      industry: profile.industry || '',
      budget: profile.budget || 0,
      hiringCapacity: profile.hiringCapacity || 1,
    } : {},
  });

  const socialForm = useForm({
    resolver: yupResolver(socialSchema),
    defaultValues: profile?.socialLinks || { website: '', linkedin: '', github: '', dribbble: '', behance: '', medium: '', facebook: '', twitter: '' },
  });

  const clientBasicForm = useForm({
    resolver: yupResolver(clientBasicSchema),
    defaultValues: profile ? {
      name: profile.name || '',
      companyName: profile.companyName || '',
      username: profile.username || '',
      phoneNumber: profile.phoneNumber || '',
      country: profile.country || '',
      city: profile.city || '',
      timezone: profile.timezone || '',
    } : {},
  });

  const clientCompanyForm = useForm({
    resolver: yupResolver(clientCompanySchema),
    defaultValues: profile ? {
      industry: profile.industry || '',
      companySize: profile.companySize || '',
      website: profile.website || '',
      companyDescription: profile.companyDescription || '',
    } : {},
  });

  const clientPreferencesForm = useForm({
    resolver: yupResolver(clientPreferencesSchema),
    defaultValues: profile ? {
      hiringType: profile.hiringType || '',
      preferredSkills: toCsv(profile.preferredSkills),
      responseTime: profile.responseTime || '',
    } : {},
  });

  const clientAdvancedForm = useForm({
    resolver: yupResolver(clientAdvancedSchema),
    defaultValues: profile ? {
      industriesOfInterest: toCsv(profile.industriesOfInterest),
      preferredFreelancerLevel: profile.preferredFreelancerLevel || '',
    } : {},
  });

  useEffect(() => {
    if (!profile) return;
    // Reset all forms when profile loads
    personalForm.reset({
      name: profile.name || '',
      username: profile.username || '',
      professionalTitle: profile.professionalTitle || '',
      phoneNumber: profile.phoneNumber || '',
      country: profile.country || '',
      city: profile.city || '',
      timezone: profile.timezone || '',
    });
    tradeForm.reset({
      tradeCategory: profile.tradeCategory || '',
      yearsOfExperience: profile.yearsOfExperience || 0,
      licenseNumber: profile.licenseNumber || '',
      insured: profile.insured || false,
      bonded: profile.bonded || false,
      serviceRadius: profile.serviceRadius || 50,
      availability: profile.availability || 'weekdays',
    });
    skillsForm.reset({
      primarySkills: toCsv(profile.primarySkills),
      subSkills: toCsv(profile.subSkills),
      skillLevel: profile.skillLevel || '',
      yearsOfExperience: profile.yearsOfExperience || 0,
      toolsTechnologies: toCsv(profile.toolsTechnologies),
      serviceMode: profile.serviceMode || '',
      physicalCategory: profile.physicalCategory || '',
      serviceArea: profile.serviceArea || '',
      hourlyRate: profile.hourlyRate || 10,
      currency: profile.currency || 'USD',
      bio: profile.bio || '',
    });
    workPrefForm.reset({
      availableHours: profile.availableHours || 40,
      preferredProjectType: profile.preferredProjectType || 'Both',
      responseTime: profile.responseTime || 'Within 1 day',
      availabilityType: profile.availability || 'Full-time',
    });
    businessForm.reset({
      companyDescription: profile.companyDescription || '',
      industry: profile.industry || '',
      budget: profile.budget || 0,
      hiringCapacity: profile.hiringCapacity || 1,
    });
    socialForm.reset(profile.socialLinks || { website: '', linkedin: '', github: '', dribbble: '', behance: '', medium: '', facebook: '', twitter: '' });
    clientBasicForm.reset({
      name: profile.name || '',
      companyName: profile.companyName || '',
      username: profile.username || '',
      phoneNumber: profile.phoneNumber || '',
      country: profile.country || '',
      city: profile.city || '',
      timezone: profile.timezone || '',
    });
    clientCompanyForm.reset({
      industry: profile.industry || '',
      companySize: profile.companySize || '',
      website: profile.website || '',
      companyDescription: profile.companyDescription || '',
    });
    clientPreferencesForm.reset({
      hiringType: profile.hiringType || '',
      preferredSkills: toCsv(profile.preferredSkills),
      responseTime: profile.responseTime || '',
    });
    clientAdvancedForm.reset({
      industriesOfInterest: toCsv(profile.industriesOfInterest),
      preferredFreelancerLevel: profile.preferredFreelancerLevel || '',
    });
  }, [profile]);

  // Save handlers - Freelancer
  const onSavePersonal = personalForm.handleSubmit(async (data) => {
    const payload = {
      name: data.name,
      username: data.username,
      professionalTitle: data.professionalTitle,
      phoneNumber: data.phoneNumber,
      country: data.country,
      city: data.city,
      timezone: data.timezone,
    };
    await updateSection(payload, 'Personal');
  });

  const onSaveTrade = tradeForm.handleSubmit(async (data) => {
    const payload = {
      tradeCategory: data.tradeCategory,
      yearsOfExperience: Number(data.yearsOfExperience),
      licenseNumber: data.licenseNumber,
      insured: data.insured,
      bonded: data.bonded,
      serviceRadius: Number(data.serviceRadius),
      availability: data.availability,
    };
    await updateSection(payload, 'Trade');
  });

  const onSaveSkills = skillsForm.handleSubmit(async (data) => {
    const payload = {
      primarySkills: fromCsv(data.primarySkills),
      subSkills: fromCsv(data.subSkills),
      skillLevel: data.skillLevel,
      yearsOfExperience: Number(data.yearsOfExperience),
      toolsTechnologies: fromCsv(data.toolsTechnologies),
      serviceMode: data.serviceMode,
      physicalCategory: data.physicalCategory,
      serviceArea: data.serviceArea,
      hourlyRate: Number(data.hourlyRate),
      currency: data.currency,
      bio: data.bio,
    };
    await updateSection(payload, 'Skills & Expertise');
  });

  const onSaveWorkPref = workPrefForm.handleSubmit(async (data) => {
    const payload = {
      availableHours: Number(data.availableHours),
      preferredProjectType: data.preferredProjectType,
      responseTime: data.responseTime,
      availability: data.availabilityType,
    };
    await updateSection(payload, 'Work Preferences');
  });

  const onSaveBusiness = businessForm.handleSubmit(async (data) => {
    const payload = {
      companyDescription: data.companyDescription,
      industry: data.industry,
      budget: Number(data.budget),
      hiringCapacity: Number(data.hiringCapacity),
    };
    await updateSection(payload, 'Business');
  });

  const onSaveExperiences = async () => {
    await updateSection({ experiences: expList.items }, 'Experience');
    setExperiences(expList.items);
  };

  const onSaveEducation = async () => {
    await updateSection({ education: eduList.items }, 'Education');
    setEducation(eduList.items);
  };

  const onSaveCertifications = async () => {
    await updateSection({ certifications: certList.items }, 'Certifications');
    setCertifications(certList.items);
  };

  const onSaveLanguages = async () => {
    await updateSection({ languages: languageList.items }, 'Languages');
    setLanguages(languageList.items);
  };

  const onSavePackages = async () => {
    await updateSection({ packages: packageList.items }, 'Service Packages');
    setPackages(packageList.items);
  };

  const onSaveSocial = socialForm.handleSubmit(async (data) => {
    await updateSection({ socialLinks: data }, 'Social Links');
    setSocialLinks(data);
  });

  // Save handlers - Client
  const onSaveClientBasic = clientBasicForm.handleSubmit(async (data) => {
    const payload = {
      name: data.name,
      companyName: data.companyName,
      username: data.username,
      phoneNumber: data.phoneNumber,
      country: data.country,
      city: data.city,
      timezone: data.timezone,
    };
    await updateSection(payload, 'Basic Info');
  });

  const onSaveClientCompany = clientCompanyForm.handleSubmit(async (data) => {
    const payload = {
      industry: data.industry,
      companySize: data.companySize,
      website: data.website,
      companyDescription: data.companyDescription,
    };
    await updateSection(payload, 'Company Info');
  });

  const onSaveClientPreferences = clientPreferencesForm.handleSubmit(async (data) => {
    const payload = {
      hiringType: data.hiringType,
      preferredSkills: fromCsv(data.preferredSkills),
      responseTime: data.responseTime,
    };
    await updateSection(payload, 'Preferences');
  });

  const onSaveClientAdvanced = clientAdvancedForm.handleSubmit(async (data) => {
    const payload = {
      industriesOfInterest: fromCsv(data.industriesOfInterest),
      preferredFreelancerLevel: data.preferredFreelancerLevel,
    };
    await updateSection(payload, 'Advanced Info');
  });

  const onSavePastProjects = async () => {
    await updateSection({ pastProjects: pastProjectsList.items }, 'Past Projects');
    setPastProjects(pastProjectsList.items);
  };

  // Upload handlers
  const handleUploadAvatar = (file) => uploadFile(
    (f) => profileAPI.uploadAvatar(f),
    file,
    'Avatar updated.',
    (val) => setUploadingStates(prev => ({ ...prev, avatar: val }))
  );
  const handleUploadCover = (file) => uploadFile(
    (f) => profileAPI.uploadCoverPhoto(f),
    file,
    'Cover photo updated.',
    (val) => setUploadingStates(prev => ({ ...prev, cover: val }))
  );
  const handleUploadVideo = (file) => uploadFile(
    (f) => profileAPI.uploadIntroVideo(f),
    file,
    'Intro video uploaded.',
    (val) => setUploadingStates(prev => ({ ...prev, video: val }))
  );
  const handleUploadPortfolio = (files) => uploadFile(
    (f) => profileAPI.uploadPortfolio(f),
    files,
    'Portfolio uploaded.',
    (val) => setUploadingStates(prev => ({ ...prev, portfolio: val }))
  );

  // Preview navigation
  const handlePrevPreview = () => {
    const images = portfolioItems.filter(item => item.type === 'image');
    if (images.length <= 1) return;
    const current = images.findIndex(img => img.url === previewFile.url);
    const prev = (current - 1 + images.length) % images.length;
    setPreviewFile(images[prev]);
  };
  const handleNextPreview = () => {
    const images = portfolioItems.filter(item => item.type === 'image');
    if (images.length <= 1) return;
    const current = images.findIndex(img => img.url === previewFile.url);
    const next = (current + 1) % images.length;
    setPreviewFile(images[next]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto animate-pulse">
          <div className="h-64 bg-gray-300 rounded-lg mb-4" />
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-4" />
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-200 rounded" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      <ProfileHeader
        profile={profile}
        badges={badges}
        onUploadAvatar={handleUploadAvatar}
        onUploadCover={handleUploadCover}
        onUploadIntroVideo={handleUploadVideo}
        uploadingAvatar={uploadingStates.avatar}
        uploadingCover={uploadingStates.cover}
        uploadingVideo={uploadingStates.video}
        onPreviewFile={setPreviewFile}
      />

      <div className="max-w-6xl mx-auto px-4">
        <ProgressBar completeness={completeness} />

        {lastSaved && (
          <p className="text-xs text-gray-400 mb-2">Last saved: {lastSaved.toLocaleTimeString()}</p>
        )}

        {notice && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 animate-slideDown flex items-center justify-between">
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice('')} className="text-green-800 font-medium hover:underline">
              OK
            </button>
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 animate-slideDown flex items-center justify-between">
            <span>{error}</span>
            <button type="button" onClick={() => setError('')} className="text-red-800 font-medium hover:underline">
              OK
            </button>
          </div>
        )}

        {isTalent ? (
          /* ---------- FREELANCER SECTIONS ---------- */
          <>
            <AccordionSection
              title="Personal Details"
              icon={User}
              isOpen={openSection === 'personal'}
              onToggle={() => setOpenSection(openSection === 'personal' ? '' : 'personal')}
            >
              <form id="form-personal" onSubmit={onSavePersonal} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Full Name" error={personalForm.formState.errors.name?.message}>
                    <div className="relative">
                      <input {...personalForm.register('name')} className="w-full border rounded-lg p-2 pr-10" />
                      {personalForm.watch('name') && !personalForm.formState.errors.name && (
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" size={18} />
                      )}
                    </div>
                  </Field>
                  <Field label="Username">
                    <input {...personalForm.register('username')} className="w-full border rounded-lg p-2" />
                  </Field>
                  <Field label="Professional Title">
                    <input {...personalForm.register('professionalTitle')} placeholder="e.g., Full Stack Developer" className="w-full border rounded-lg p-2" />
                  </Field>
                  <Field label="Phone Number">
                    <input {...personalForm.register('phoneNumber')} className="w-full border rounded-lg p-2" />
                  </Field>
                  <Field label="Country">
                    <select {...personalForm.register('country')} className="w-full border rounded-lg p-2">
                      <option value="">Select country</option>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="City">
                    <input {...personalForm.register('city')} className="w-full border rounded-lg p-2" />
                  </Field>
                  <Field label="Time Zone">
                    <input {...personalForm.register('timezone')} placeholder="e.g., America/New_York" className="w-full border rounded-lg p-2" />
                  </Field>
                </div>
                <div className="flex justify-end md:sticky md:bottom-4 md:bg-white md:p-4 md:shadow-lg md:rounded-lg">
                  <SaveButton>Update Personal Details</SaveButton>
                </div>
              </form>
            </AccordionSection>

            <AccordionSection
              title="Languages"
              icon={Globe}
              isOpen={openSection === 'languages'}
              onToggle={() => setOpenSection(openSection === 'languages' ? '' : 'languages')}
            >
              <DynamicList
                items={languageList.items}
                onAdd={() => languageList.addItem({ language: '', proficiency: 'Fluent' })}
                onRemove={languageList.removeItem}
                renderItem={(item, idx) => (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      placeholder="Language"
                      value={item.language}
                      onChange={(e) => languageList.updateItem(idx, 'language', e.target.value)}
                      className="p-2 border rounded"
                    />
                    <select
                      value={item.proficiency}
                      onChange={(e) => languageList.updateItem(idx, 'proficiency', e.target.value)}
                      className="p-2 border rounded"
                    >
                      <option value="Basic">Basic</option>
                      <option value="Conversational">Conversational</option>
                      <option value="Fluent">Fluent</option>
                      <option value="Native">Native</option>
                    </select>
                  </div>
                )}
                addLabel="Add Language"
              />
              <div className="flex justify-end mt-4 md:sticky md:bottom-4 md:bg-white md:p-4 md:shadow-lg md:rounded-lg">
                <SaveButton onClick={onSaveLanguages}>Save Languages</SaveButton>
              </div>
            </AccordionSection>

            <AccordionSection
              title="Trade & Business Details"
              icon={Wrench}
              isOpen={openSection === 'trade'}
              onToggle={() => setOpenSection(openSection === 'trade' ? '' : 'trade')}
            >
              <form id="form-trade" onSubmit={onSaveTrade} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Primary Trade">
                    <select {...tradeForm.register('tradeCategory')} className="w-full border rounded-lg p-2">
                      <option value="">Select trade / service</option>
                      {SERVICE_GROUPS.map(group => (
                        <optgroup key={group.label} label={group.label}>
                          {group.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </Field>
                  <Field label="Years of Experience">
                    <input
                      type="number"
                      {...tradeForm.register('yearsOfExperience')}
                      min="0"
                      className="w-full border rounded-lg p-2"
                    />
                  </Field>
                  <Field label="License Number (if applicable)">
                    <input {...tradeForm.register('licenseNumber')} className="w-full border rounded-lg p-2" />
                  </Field>
                  <Field label="Insurance & Bonding">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" {...tradeForm.register('insured')} className="rounded" />
                        <span>Insured</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" {...tradeForm.register('bonded')} className="rounded" />
                        <span>Bonded</span>
                      </label>
                    </div>
                  </Field>
                  <Field label="Service Radius (miles)">
                    <input
                      type="number"
                      {...tradeForm.register('serviceRadius')}
                      min="0"
                      className="w-full border rounded-lg p-2"
                    />
                  </Field>
                  <Field label="Availability">
                    <select {...tradeForm.register('availability')} className="w-full border rounded-lg p-2">
                      <option value="weekdays">Weekdays</option>
                      <option value="weekends">Weekends</option>
                      <option value="anytime">Anytime</option>
                    </select>
                  </Field>
                </div>
                <div className="flex justify-end md:sticky md:bottom-4 md:bg-white md:p-4 md:shadow-lg md:rounded-lg">
                  <SaveButton>Update Trade Details</SaveButton>
                </div>
              </form>
            </AccordionSection>

            <AccordionSection
              title="Skills & Expertise"
              icon={AwardIcon}
              isOpen={openSection === 'skills'}
              onToggle={() => setOpenSection(openSection === 'skills' ? '' : 'skills')}
            >
              <form id="form-skills" onSubmit={onSaveSkills} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Primary Skills (comma separated)">
                    <input {...skillsForm.register('primarySkills')} placeholder="e.g., React, Node.js" className="w-full border rounded-lg p-2" />
                  </Field>
                  <Field label="Sub-Skills / Technologies (comma separated)">
                    <input {...skillsForm.register('subSkills')} placeholder="e.g., Redux, Express" className="w-full border rounded-lg p-2" />
                  </Field>
                  <Field label="Skill Level">
                    <select {...skillsForm.register('skillLevel')} className="w-full border rounded-lg p-2">
                      <option value="">Select level</option>
                      {SKILL_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
                    </select>
                  </Field>
                  <Field label="Years of Experience">
                    <input type="number" {...skillsForm.register('yearsOfExperience')} min="0" className="w-full border rounded-lg p-2" />
                  </Field>
                  <Field label="Tools & Technologies (comma separated)">
                    <input {...skillsForm.register('toolsTechnologies')} placeholder="e.g., Figma, Photoshop" className="w-full border rounded-lg p-2" />
                  </Field>
                  <Field label="Service Mode">
                    <select {...skillsForm.register('serviceMode')} className="w-full border rounded-lg p-2">
                      <option value="">Select mode</option>
                      {SERVICE_MODES.map(m => <option key={m} value={m.toLowerCase()}>{m}</option>)}
                    </select>
                  </Field>
                  <Field label="Category">
                    <select {...skillsForm.register('physicalCategory')} className="w-full border rounded-lg p-2">
                      <option value="">Select category</option>
                      {SERVICE_GROUPS.map(group => (
                        <optgroup key={group.label} label={group.label}>
                          {group.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </Field>
                  <Field label="Service Area">
                    <input {...skillsForm.register('serviceArea')} placeholder="e.g., City, State" className="w-full border rounded-lg p-2" />
                  </Field>
                  <Field label="Hourly Rate">
                    <input type="number" {...skillsForm.register('hourlyRate')} min="0" className="w-full border rounded-lg p-2" />
                  </Field>
                  <Field label="Currency">
                    <select {...skillsForm.register('currency')} className="w-full border rounded-lg p-2">
                      {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="Bio / Description" className="md:col-span-2">
                    <textarea
                      {...skillsForm.register('bio')}
                      rows={4}
                      maxLength={500}
                      className="w-full border rounded-lg p-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {skillsForm.watch('bio')?.length || 0}/500 characters
                    </p>
                  </Field>
                </div>
                <div className="flex justify-end md:sticky md:bottom-4 md:bg-white md:p-4 md:shadow-lg md:rounded-lg">
                  <SaveButton>Update Skills</SaveButton>
                </div>
              </form>
            </AccordionSection>

            <AccordionSection
              title="Work Preferences"
              icon={Clock}
              isOpen={openSection === 'preferences'}
              onToggle={() => setOpenSection(openSection === 'preferences' ? '' : 'preferences')}
            >
              <form id="form-workPref" onSubmit={onSaveWorkPref} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Available Hours per Week">
                    <input type="number" {...workPrefForm.register('availableHours')} min="0" className="w-full border rounded-lg p-2" />
                  </Field>
                  <Field label="Preferred Project Type">
                    <select {...workPrefForm.register('preferredProjectType')} className="w-full border rounded-lg p-2">
                      {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </Field>
                  <Field label="Response Time">
                    <select {...workPrefForm.register('responseTime')} className="w-full border rounded-lg p-2">
                      {RESPONSE_TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </Field>
                  <Field label="Availability">
                    <select {...workPrefForm.register('availabilityType')} className="w-full border rounded-lg p-2">
                      {AVAILABILITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </Field>
                </div>
                <div className="flex justify-end md:sticky md:bottom-4 md:bg-white md:p-4 md:shadow-lg md:rounded-lg">
                  <SaveButton>Update Preferences</SaveButton>
                </div>
              </form>
            </AccordionSection>

            <AccordionSection
              title="Work Experience"
              icon={Briefcase}
              isOpen={openSection === 'experience'}
              onToggle={() => setOpenSection(openSection === 'experience' ? '' : 'experience')}
            >
              <DynamicList
                items={expList.items}
                onAdd={() => expList.addItem({ title: '', company: '', start: '', end: '', description: '' })}
                onRemove={expList.removeItem}
                renderItem={(item, idx) => (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      placeholder="Job Title"
                      value={item.title}
                      onChange={(e) => expList.updateItem(idx, 'title', e.target.value)}
                      className="p-2 border rounded"
                    />
                    <input
                      placeholder="Company"
                      value={item.company}
                      onChange={(e) => expList.updateItem(idx, 'company', e.target.value)}
                      className="p-2 border rounded"
                    />
                    <input
                      type="month"
                      placeholder="Start"
                      value={item.start}
                      onChange={(e) => expList.updateItem(idx, 'start', e.target.value)}
                      className="p-2 border rounded"
                    />
                    <input
                      type="month"
                      placeholder="End"
                      value={item.end}
                      onChange={(e) => expList.updateItem(idx, 'end', e.target.value)}
                      className="p-2 border rounded"
                    />
                    <textarea
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => expList.updateItem(idx, 'description', e.target.value)}
                      rows={2}
                      className="md:col-span-2 p-2 border rounded"
                    />
                  </div>
                )}
                addLabel="Add Experience"
              />
              <div className="flex justify-end mt-4 md:sticky md:bottom-4 md:bg-white md:p-4 md:shadow-lg md:rounded-lg">
                <SaveButton onClick={onSaveExperiences}>Save Experiences</SaveButton>
              </div>
            </AccordionSection>

            <AccordionSection
              title="Education"
              icon={BookOpen}
              isOpen={openSection === 'education'}
              onToggle={() => setOpenSection(openSection === 'education' ? '' : 'education')}
            >
              <DynamicList
                items={eduList.items}
                onAdd={() => eduList.addItem({ degree: '', institution: '', start: '', end: '', description: '' })}
                onRemove={eduList.removeItem}
                renderItem={(item, idx) => (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      placeholder="Degree/Certificate"
                      value={item.degree}
                      onChange={(e) => eduList.updateItem(idx, 'degree', e.target.value)}
                      className="p-2 border rounded"
                    />
                    <input
                      placeholder="Institution"
                      value={item.institution}
                      onChange={(e) => eduList.updateItem(idx, 'institution', e.target.value)}
                      className="p-2 border rounded"
                    />
                    <input
                      type="month"
                      placeholder="Start"
                      value={item.start}
                      onChange={(e) => eduList.updateItem(idx, 'start', e.target.value)}
                      className="p-2 border rounded"
                    />
                    <input
                      type="month"
                      placeholder="End"
                      value={item.end}
                      onChange={(e) => eduList.updateItem(idx, 'end', e.target.value)}
                      className="p-2 border rounded"
                    />
                    <textarea
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => eduList.updateItem(idx, 'description', e.target.value)}
                      rows={2}
                      className="md:col-span-2 p-2 border rounded"
                    />
                  </div>
                )}
                addLabel="Add Education"
              />
              <div className="flex justify-end mt-4 md:sticky md:bottom-4 md:bg-white md:p-4 md:shadow-lg md:rounded-lg">
                <SaveButton onClick={onSaveEducation}>Save Education</SaveButton>
              </div>
            </AccordionSection>

            <AccordionSection
              title="Certifications & Licenses"
              icon={AwardIcon}
              isOpen={openSection === 'certifications'}
              onToggle={() => setOpenSection(openSection === 'certifications' ? '' : 'certifications')}
            >
              <DynamicList
                items={certList.items}
                onAdd={() => certList.addItem({ name: '', issuer: '', date: '', expires: '', credentialUrl: '' })}
                onRemove={certList.removeItem}
                renderItem={(item, idx) => (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      placeholder="Certification Name"
                      value={item.name}
                      onChange={(e) => certList.updateItem(idx, 'name', e.target.value)}
                      className="p-2 border rounded"
                    />
                    <input
                      placeholder="Issuing Organization"
                      value={item.issuer}
                      onChange={(e) => certList.updateItem(idx, 'issuer', e.target.value)}
                      className="p-2 border rounded"
                    />
                    <input
                      type="month"
                      placeholder="Date Obtained"
                      value={item.date}
                      onChange={(e) => certList.updateItem(idx, 'date', e.target.value)}
                      className="p-2 border rounded"
                    />
                    <input
                      type="month"
                      placeholder="Expiration Date"
                      value={item.expires}
                      onChange={(e) => certList.updateItem(idx, 'expires', e.target.value)}
                      className="p-2 border rounded"
                    />
                    <input
                      placeholder="Credential URL"
                      value={item.credentialUrl}
                      onChange={(e) => certList.updateItem(idx, 'credentialUrl', e.target.value)}
                      className="md:col-span-2 p-2 border rounded"
                    />
                  </div>
                )}
                addLabel="Add Certification"
              />
              <div className="flex justify-end mt-4 md:sticky md:bottom-4 md:bg-white md:p-4 md:shadow-lg md:rounded-lg">
                <SaveButton onClick={onSaveCertifications}>Save Certifications</SaveButton>
              </div>
            </AccordionSection>

            <AccordionSection
              title="Services & Pricing"
              icon={DollarSign}
              isOpen={openSection === 'pricing'}
              onToggle={() => setOpenSection(openSection === 'pricing' ? '' : 'pricing')}
            >
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Hourly Rate</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Hourly Rate">
                      <input
                        type="number"
                        value={profile?.hourlyRate || ''}
                        onChange={(e) => updateSection({ hourlyRate: Number(e.target.value) }, 'Hourly Rate')}
                        className="w-full border rounded-lg p-2"
                      />
                    </Field>
                    <Field label="Currency">
                      <select
                        value={profile?.currency || 'USD'}
                        onChange={(e) => updateSection({ currency: e.target.value }, 'Currency')}
                        className="w-full border rounded-lg p-2"
                      >
                        {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </Field>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Service Packages</h3>
                  <DynamicList
                    items={packageList.items}
                    onAdd={() => packageList.addItem({ name: 'Basic', price: 0, deliveryTime: '3 days', revisions: 1, features: [] })}
                    onRemove={packageList.removeItem}
                    renderItem={(item, idx) => (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          placeholder="Package Name"
                          value={item.name}
                          onChange={(e) => packageList.updateItem(idx, 'name', e.target.value)}
                          className="p-2 border rounded"
                        />
                        <input
                          type="number"
                          placeholder="Price"
                          value={item.price}
                          onChange={(e) => packageList.updateItem(idx, 'price', Number(e.target.value))}
                          className="p-2 border rounded"
                        />
                        <input
                          placeholder="Delivery Time"
                          value={item.deliveryTime}
                          onChange={(e) => packageList.updateItem(idx, 'deliveryTime', e.target.value)}
                          className="p-2 border rounded"
                        />
                        <input
                          type="number"
                          placeholder="Revisions"
                          value={item.revisions}
                          onChange={(e) => packageList.updateItem(idx, 'revisions', Number(e.target.value))}
                          className="p-2 border rounded"
                        />
                        <input
                          placeholder="Features (comma separated)"
                          value={item.features?.join(', ')}
                          onChange={(e) => packageList.updateItem(idx, 'features', fromCsv(e.target.value))}
                          className="md:col-span-2 p-2 border rounded"
                        />
                      </div>
                    )}
                    addLabel="Add Package"
                  />
                  <div className="flex justify-end mt-4 md:sticky md:bottom-4 md:bg-white md:p-4 md:shadow-lg md:rounded-lg">
                    <SaveButton onClick={onSavePackages}>Save Packages</SaveButton>
                  </div>
                </div>
              </div>
            </AccordionSection>

            <AccordionSection
              title="Portfolio"
              icon={ImageIcon}
              isOpen={openSection === 'portfolio'}
              onToggle={() => setOpenSection(openSection === 'portfolio' ? '' : 'portfolio')}
            >
              <div className="space-y-4">
                <FileUploader
                  accept="image/*,video/*,.pdf"
                  multiple
                  onUpload={handleUploadPortfolio}
                  uploading={uploadingStates.portfolio}
                  label="Upload Portfolio Files"
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                />

                {portfolioItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {portfolioItems.map((item) => (
                      <div key={item.id} className="border rounded-lg p-3 bg-white">
                        <div className="flex items-start gap-3">
                          {item.type === 'image' ? (
                            <img src={item.url} alt={item.name} className="w-20 h-20 object-cover rounded" />
                          ) : (
                            <div className="w-20 h-20 bg-gray-100 flex items-center justify-center rounded">
                              <FileText size={32} className="text-gray-500" />
                            </div>
                          )}
                          <div className="flex-1">
                            <input
                              placeholder="Project Title"
                              value={item.title || ''}
                              onChange={(e) => updatePortfolioItem(item.id, { title: e.target.value })}
                              className="w-full p-1 border rounded mb-1"
                            />
                            <textarea
                              placeholder="Description"
                              value={item.description || ''}
                              onChange={(e) => updatePortfolioItem(item.id, { description: e.target.value })}
                              rows={2}
                              className="w-full p-1 border rounded mb-1"
                            />
                            <input
                              placeholder="Live Link"
                              value={item.liveLink || ''}
                              onChange={(e) => updatePortfolioItem(item.id, { liveLink: e.target.value })}
                              className="w-full p-1 border rounded mb-1"
                            />
                            <input
                              placeholder="Your Role"
                              value={item.role || ''}
                              onChange={(e) => updatePortfolioItem(item.id, { role: e.target.value })}
                              className="w-full p-1 border rounded mb-1"
                            />
                            <input
                              placeholder="Technologies Used (comma separated)"
                              value={item.technologies?.join(', ') || ''}
                              onChange={(e) => updatePortfolioItem(item.id, { technologies: fromCsv(e.target.value) })}
                              className="w-full p-1 border rounded"
                            />
                          </div>
                          <button
                            onClick={() => deletePortfolioItem(item.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                    <ImageIcon size={48} className="mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-500">No portfolio items yet</p>
                    <p className="text-sm text-gray-400">Upload images, videos, or PDFs above</p>
                  </div>
                )}
              </div>
            </AccordionSection>

            <AccordionSection
              title="Social & Contact Links"
              icon={Globe}
              isOpen={openSection === 'social'}
              onToggle={() => setOpenSection(openSection === 'social' ? '' : 'social')}
            >
              <form id="form-social" onSubmit={onSaveSocial} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Personal Website">
                    <input {...socialForm.register('website')} placeholder="https://..." className="w-full border rounded-lg p-2" />
                  </Field>
                  <Field label="LinkedIn">
                    <input {...socialForm.register('linkedin')} placeholder="https://linkedin.com/in/..." className="w-full border rounded-lg p-2" />
                  </Field>
                  <Field label="GitHub">
                    <input {...socialForm.register('github')} placeholder="https://github.com/..." className="w-full border rounded-lg p-2" />
                  </Field>
                  <Field label="Dribbble">
                    <input {...socialForm.register('dribbble')} placeholder="https://dribbble.com/..." className="w-full border rounded-lg p-2" />
                  </Field>
                  <Field label="Behance">
                    <input {...socialForm.register('behance')} placeholder="https://behance.net/..." className="w-full border rounded-lg p-2" />
                  </Field>
                  <Field label="Medium">
                    <input {...socialForm.register('medium')} placeholder="https://medium.com/..." className="w-full border rounded-lg p-2" />
                  </Field>
                </div>
                <div className="flex justify-end md:sticky md:bottom-4 md:bg-white md:p-4 md:shadow-lg md:rounded-lg">
                  <SaveButton>Save Social Links</SaveButton>
                </div>
              </form>
            </AccordionSection>

            <AccordionSection
              title="Verification & Trust"
              icon={Shield}
              isOpen={openSection === 'verification'}
              onToggle={() => setOpenSection(openSection === 'verification' ? '' : 'verification')}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-semibold">Email Verified</p>
                  <p className={profile?.emailVerified ? 'text-green-600' : 'text-red-600'}>
                    {profile?.emailVerified ? 'Yes' : 'No'}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-semibold">Phone Verified</p>
                  <p className={profile?.phoneVerified ? 'text-green-600' : 'text-red-600'}>
                    {profile?.phoneVerified ? 'Yes' : 'No'}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-semibold">Identity Verified</p>
                  <p className={profile?.isVerified ? 'text-green-600' : 'text-red-600'}>
                    {profile?.isVerified ? 'Yes' : 'No'}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-semibold">Payment Verified</p>
                  <p className={profile?.paymentVerified ? 'text-green-600' : 'text-red-600'}>
                    {profile?.paymentVerified ? 'Yes' : 'No'}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-semibold">Average Rating</p>
                  <p className="text-yellow-600">{profile?.averageRating || 'N/A'}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-semibold">Total Completed Jobs</p>
                  <p>{profile?.completedJobs || 0}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-semibold">Repeat Clients %</p>
                  <p>{profile?.repeatClients || 0}%</p>
                </div>
              </div>
            </AccordionSection>

            <AccordionSection
              title="Media & Branding"
              icon={Camera}
              isOpen={openSection === 'media'}
              onToggle={() => setOpenSection(openSection === 'media' ? '' : 'media')}
            >
              {isTalent && (
                <>
                  <div className="mb-6">
                    <p className="font-semibold text-gray-800 mb-3">Intro Video</p>
                    {profile?.introVideo ? (
                      <video src={profile.introVideo} controls className="w-full max-w-md rounded-lg border" />
                    ) : (
                      <p className="text-sm text-gray-500">No intro video yet</p>
                    )}
                    <FileUploader
                      accept="video/*"
                      onUpload={handleUploadVideo}
                      uploading={uploadingStates.video}
                      label="Upload Intro Video"
                      className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    />
                  </div>
                </>
              )}
            </AccordionSection>
          </>
        ) : isClient ? (
          /* ---------- CLIENT SECTIONS ---------- */
          <>
            <AccordionSection
              title="Basic Info"
              icon={User}
              isOpen={openSection === 'clientBasic'}
              onToggle={() => setOpenSection(openSection === 'clientBasic' ? '' : 'clientBasic')}
            >
              <form id="form-clientBasic" onSubmit={onSaveClientBasic} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Full Name / Contact Person" error={clientBasicForm.formState.errors.name?.message}>
                    <div className="relative">
                      <input {...clientBasicForm.register('name')} className="w-full border rounded-lg p-2 pr-10" />
                      {clientBasicForm.watch('name') && !clientBasicForm.formState.errors.name && (
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" size={18} />
                      )}
                    </div>
                  </Field>
                  <Field label="Company Name">
                    <input {...clientBasicForm.register('companyName')} className="w-full border rounded-lg p-2" />
                  </Field>
                  <Field label="Username">
                    <input {...clientBasicForm.register('username')} className="w-full border rounded-lg p-2" />
                  </Field>
                  <Field label="Phone Number">
                    <input {...clientBasicForm.register('phoneNumber')} className="w-full border rounded-lg p-2" />
                  </Field>
                  <Field label="Country">
                    <select {...clientBasicForm.register('country')} className="w-full border rounded-lg p-2">
                      <option value="">Select country</option>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="City">
                    <input {...clientBasicForm.register('city')} className="w-full border rounded-lg p-2" />
                  </Field>
                  <Field label="Time Zone">
                    <input {...clientBasicForm.register('timezone')} placeholder="e.g., America/New_York" className="w-full border rounded-lg p-2" />
                  </Field>
                </div>
                <div className="flex justify-end md:sticky md:bottom-4 md:bg-white md:p-4 md:shadow-lg md:rounded-lg">
                  <SaveButton>Update Basic Info</SaveButton>
                </div>
              </form>
            </AccordionSection>

            <AccordionSection
              title="Company Info"
              icon={Briefcase}
              isOpen={openSection === 'clientCompany'}
              onToggle={() => setOpenSection(openSection === 'clientCompany' ? '' : 'clientCompany')}
            >
              <form id="form-clientCompany" onSubmit={onSaveClientCompany} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Industry">
                    <select {...clientCompanyForm.register('industry')} className="w-full border rounded-lg p-2">
                      <option value="">Select industry</option>
                      {CLIENT_INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </Field>
                  <Field label="Company Size">
                    <select {...clientCompanyForm.register('companySize')} className="w-full border rounded-lg p-2">
                      <option value="">Select size</option>
                      {COMPANY_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </Field>
                  <Field label="Website">
                    <input {...clientCompanyForm.register('website')} placeholder="https://..." className="w-full border rounded-lg p-2" />
                  </Field>
                  <Field label="Company Description" className="md:col-span-2">
                    <textarea
                      {...clientCompanyForm.register('companyDescription')}
                      rows={4}
                      maxLength={500}
                      className="w-full border rounded-lg p-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {clientCompanyForm.watch('companyDescription')?.length || 0}/500 characters
                    </p>
                  </Field>
                </div>
                <div className="flex justify-end md:sticky md:bottom-4 md:bg-white md:p-4 md:shadow-lg md:rounded-lg">
                  <SaveButton>Update Company Info</SaveButton>
                </div>
              </form>
            </AccordionSection>

            <AccordionSection
              title="Languages"
              icon={Globe}
              isOpen={openSection === 'languages'}
              onToggle={() => setOpenSection(openSection === 'languages' ? '' : 'languages')}
            >
              <DynamicList
                items={languageList.items}
                onAdd={() => languageList.addItem({ language: '', proficiency: 'Fluent' })}
                onRemove={languageList.removeItem}
                renderItem={(item, idx) => (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      placeholder="Language"
                      value={item.language}
                      onChange={(e) => languageList.updateItem(idx, 'language', e.target.value)}
                      className="p-2 border rounded"
                    />
                    <select
                      value={item.proficiency}
                      onChange={(e) => languageList.updateItem(idx, 'proficiency', e.target.value)}
                      className="p-2 border rounded"
                    >
                      <option value="Basic">Basic</option>
                      <option value="Conversational">Conversational</option>
                      <option value="Fluent">Fluent</option>
                      <option value="Native">Native</option>
                    </select>
                  </div>
                )}
                addLabel="Add Language"
              />
              <div className="flex justify-end mt-4 md:sticky md:bottom-4 md:bg-white md:p-4 md:shadow-lg md:rounded-lg">
                <SaveButton onClick={onSaveLanguages}>Save Languages</SaveButton>
              </div>
            </AccordionSection>

            <AccordionSection
              title="Hiring Preferences"
              icon={Settings}
              isOpen={openSection === 'clientPreferences'}
              onToggle={() => setOpenSection(openSection === 'clientPreferences' ? '' : 'clientPreferences')}
            >
              <form id="form-clientPreferences" onSubmit={onSaveClientPreferences} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Hiring Type">
                    <select {...clientPreferencesForm.register('hiringType')} className="w-full border rounded-lg p-2">
                      <option value="">Select type</option>
                      {HIRING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </Field>
                  <Field label="Preferred Skills (comma separated)">
                    <input
                      {...clientPreferencesForm.register('preferredSkills')}
                      placeholder="e.g., React, Python"
                      className="w-full border rounded-lg p-2"
                    />
                  </Field>
                  <Field label="Response Time">
                    <select {...clientPreferencesForm.register('responseTime')} className="w-full border rounded-lg p-2">
                      <option value="">Select response time</option>
                      {RESPONSE_TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </Field>
                </div>
                <div className="flex justify-end md:sticky md:bottom-4 md:bg-white md:p-4 md:shadow-lg md:rounded-lg">
                  <SaveButton>Update Preferences</SaveButton>
                </div>
              </form>
            </AccordionSection>

            <AccordionSection
              title="Social & Contact Links"
              icon={Globe}
              isOpen={openSection === 'social'}
              onToggle={() => setOpenSection(openSection === 'social' ? '' : 'social')}
            >
              <form id="form-social" onSubmit={onSaveSocial} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="LinkedIn">
                    <input {...socialForm.register('linkedin')} placeholder="https://linkedin.com/company/..." className="w-full border rounded-lg p-2" />
                  </Field>
                  <Field label="Facebook">
                    <input {...socialForm.register('facebook')} placeholder="https://facebook.com/..." className="w-full border rounded-lg p-2" />
                  </Field>
                  <Field label="Twitter">
                    <input {...socialForm.register('twitter')} placeholder="https://twitter.com/..." className="w-full border rounded-lg p-2" />
                  </Field>
                  <Field label="Website">
                    <input {...socialForm.register('website')} placeholder="https://..." className="w-full border rounded-lg p-2" />
                  </Field>
                </div>
                <div className="flex justify-end md:sticky md:bottom-4 md:bg-white md:p-4 md:shadow-lg md:rounded-lg">
                  <SaveButton>Save Social Links</SaveButton>
                </div>
              </form>
            </AccordionSection>

            <AccordionSection
              title="Verification & Trust"
              icon={Shield}
              isOpen={openSection === 'verification'}
              onToggle={() => setOpenSection(openSection === 'verification' ? '' : 'verification')}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-semibold">Email Verified</p>
                  <p className={profile?.emailVerified ? 'text-green-600' : 'text-red-600'}>
                    {profile?.emailVerified ? 'Yes' : 'No'}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-semibold">Phone Verified</p>
                  <p className={profile?.phoneVerified ? 'text-green-600' : 'text-red-600'}>
                    {profile?.phoneVerified ? 'Yes' : 'No'}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-semibold">Payment Verified</p>
                  <p className={profile?.paymentVerified ? 'text-green-600' : 'text-red-600'}>
                    {profile?.paymentVerified ? 'Yes' : 'No'}
                  </p>
                </div>
                {profile?.isVerified && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-semibold">Identity Verified</p>
                    <p className="text-green-600">Yes</p>
                  </div>
                )}
              </div>
            </AccordionSection>

            <AccordionSection
              title="Advanced Info"
              icon={Settings}
              isOpen={openSection === 'clientAdvanced'}
              onToggle={() => setOpenSection(openSection === 'clientAdvanced' ? '' : 'clientAdvanced')}
            >
              <form id="form-clientAdvanced" onSubmit={onSaveClientAdvanced} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Industries of Interest (comma separated)">
                    <input
                      {...clientAdvancedForm.register('industriesOfInterest')}
                      placeholder="e.g., Tech, Healthcare"
                      className="w-full border rounded-lg p-2"
                    />
                  </Field>
                  <Field label="Preferred Freelancer Level">
                    <select {...clientAdvancedForm.register('preferredFreelancerLevel')} className="w-full border rounded-lg p-2">
                      <option value="">Select level</option>
                      {FREELANCER_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </Field>
                </div>
                <div className="flex justify-end md:sticky md:bottom-4 md:bg-white md:p-4 md:shadow-lg md:rounded-lg">
                  <SaveButton>Update Advanced Info</SaveButton>
                </div>
              </form>

              <div className="mt-6">
                <h3 className="font-semibold text-gray-800 mb-2">Past Projects / Job History</h3>
                <DynamicList
                  items={pastProjectsList.items}
                  onAdd={() => pastProjectsList.addItem({ title: '', description: '', year: '' })}
                  onRemove={pastProjectsList.removeItem}
                  renderItem={(item, idx) => (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        placeholder="Project Title"
                        value={item.title}
                        onChange={(e) => pastProjectsList.updateItem(idx, 'title', e.target.value)}
                        className="p-2 border rounded"
                      />
                      <input
                        placeholder="Year"
                        value={item.year}
                        onChange={(e) => pastProjectsList.updateItem(idx, 'year', e.target.value)}
                        className="p-2 border rounded"
                      />
                      <textarea
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => pastProjectsList.updateItem(idx, 'description', e.target.value)}
                        rows={1}
                        className="md:col-span-3 p-2 border rounded"
                      />
                    </div>
                  )}
                  addLabel="Add Past Project"
                />
                <div className="flex justify-end mt-4 md:sticky md:bottom-4 md:bg-white md:p-4 md:shadow-lg md:rounded-lg">
                  <SaveButton onClick={onSavePastProjects}>Save Past Projects</SaveButton>
                </div>
              </div>

              <div className="mt-6">
                <p className="font-semibold text-gray-800 mb-3">Intro Video (Optional)</p>
                {profile?.introVideo ? (
                  <video src={profile.introVideo} controls className="w-full max-w-md rounded-lg border" />
                ) : (
                  <p className="text-sm text-gray-500">No intro video yet</p>
                )}
                <FileUploader
                  accept="video/*"
                  onUpload={handleUploadVideo}
                  uploading={uploadingStates.video}
                  label="Upload Intro Video"
                  className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                />
              </div>
            </AccordionSection>
          </>
        ) : null}
      </div>

      {/* Preview Modal */}
      {previewFile && (
        <PreviewModal
          file={previewFile}
          onClose={() => setPreviewFile(null)}
          onPrev={handlePrevPreview}
          onNext={handleNextPreview}
          hasMultiple={portfolioItems.filter(i => i.type === 'image').length > 1}
        />
      )}
    </div>
  );
};

export default MyProfile;
// src/pages/freelancer/SkillsCertificationsPage.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, CheckCircle, Search, Plus, X, AlertCircle, Trash2 } from 'lucide-react';
import { useGetSkillsCertifications, useUpdateSkillsCertifications } from '../services/freelancerHooks';

// ---------- Shared UI Components (inline) ----------
const Button = ({ children, variant = 'primary', disabled = false, className = '', onClick, type = 'button' }) => {
  const base = 'px-5 py-2.5 rounded-lg font-body font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-900 focus:ring-offset-2 inline-flex items-center justify-center gap-2';
  const variants = {
    primary: 'bg-brand-900 text-white hover:bg-brand-800 disabled:opacity-40',
    ghost: 'border border-brand-900 text-brand-900 hover:bg-surface-muted disabled:opacity-40',
    danger: 'bg-danger text-white hover:bg-red-700 disabled:opacity-40',
    outline: 'border border-border text-ink-primary hover:bg-surface-muted disabled:opacity-40',
  };
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      type={type}
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

const Card = ({ children, className = '', hover = true }) => (
  <motion.div
    whileHover={hover ? { y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' } : {}}
    transition={{ duration: 0.2 }}
    className={`bg-white border border-border rounded-2xl p-6 shadow-sm ${className}`}
  >
    {children}
  </motion.div>
);

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-surface-muted text-ink-secondary',
    success: 'bg-accent-light text-accent-dark',
    warning: 'bg-warn-light text-warn',
    danger: 'bg-danger-light text-danger',
    info: 'bg-info-light text-info',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Input = ({ value, onChange, placeholder, className = '', icon: Icon }) => (
  <div className="relative">
    {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />}
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent bg-white ${Icon ? 'pl-9' : ''} ${className}`}
    />
  </div>
);

// ---------- Main Component ----------
export default function SkillsCertificationsPage() {
  const { data: response, isLoading } = useGetSkillsCertifications();
  const apiData = response?.data || response;
  const updateSkillsMutation = useUpdateSkillsCertifications();

  const [skills, setSkills] = useState(['React', 'Node.js', 'TypeScript', 'GraphQL']);
  const [newSkill, setNewSkill] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (apiData?.skills) setSkills(apiData.skills);
  }, [apiData]);

  const addSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) {
      setToast({ type: 'error', message: 'Skill cannot be empty' });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    if (skills.includes(newSkill.trim())) {
      setToast({ type: 'error', message: 'Skill already exists' });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    const updatedSkills = [...skills, newSkill.trim()];
    updateSkillsMutation.mutate({ skills: updatedSkills }, {
      onSuccess: () => {
        setSkills(updatedSkills);
        setNewSkill('');
        setToast({ type: 'success', message: 'Skill added' });
        setTimeout(() => setToast(null), 3000);
      }
    });
  };

  const removeSkill = (skillToRemove) => {
    const updatedSkills = skills.filter(s => s !== skillToRemove);
    updateSkillsMutation.mutate({ skills: updatedSkills }, {
      onSuccess: () => {
        setSkills(updatedSkills);
        setToast({ type: 'success', message: 'Skill removed' });
        setTimeout(() => setToast(null), 3000);
      }
    });
  };

  const fallbackCertifications = [
    {
      id: 1,
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services (AWS)',
      date: 'Jan 2023',
      credentialId: 'AWS-12345678'
    },
    {
      id: 2,
      name: 'React Developer Certification',
      issuer: 'Meta',
      date: 'Mar 2024',
      credentialId: 'META-98765432'
    }
  ];
  
  const certifications = apiData?.certifications || fallbackCertifications;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-md text-sm font-medium flex items-center gap-2 ${
              toast.type === 'success' ? 'bg-accent text-white' : 'bg-danger text-white'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-accent-light text-accent-dark rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-display font-bold text-brand-900">Skills & certifications</h1>
        </div>
        <p className="text-sm text-ink-secondary">
          Manage your expertise tags and verified credentials.
        </p>
      </div>

      {/* Skills Section */}
      <Card className="mb-6">
        <h2 className="text-lg font-display font-semibold text-brand-900 mb-4">Your skills</h2>
        <form onSubmit={addSkill} className="flex gap-2 mb-4">
          <div className="flex-1">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="E.g., Python, UI Design, AWS..."
              icon={Search}
            />
          </div>
          <Button type="submit" variant="primary">
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </form>

        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <motion.div
              key={skill}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-surface-muted text-ink-primary border border-border"
            >
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="text-ink-tertiary hover:text-danger transition-colors focus:outline-none focus:ring-2 focus:ring-danger rounded"
                aria-label={`Remove ${skill}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
          {skills.length === 0 && (
            <p className="text-sm text-ink-tertiary">No skills added yet. Add your first skill above.</p>
          )}
        </div>
      </Card>

      {/* Certifications Section */}
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-display font-semibold text-brand-900">Verified certifications</h2>
          <Button variant="outline" icon={Plus}>
            Add manual
          </Button>
        </div>

        <div className="space-y-4">
          {certifications.map((cert) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-4 p-4 bg-surface-soft rounded-xl border border-border"
            >
              <Award className="w-8 h-8 text-warn shrink-0" />
              <div className="flex-1">
                <h4 className="font-display font-semibold text-ink-primary">{cert.name}</h4>
                <p className="text-sm text-ink-secondary mt-0.5">
                  {cert.issuer} • Issued {cert.date}
                </p>
                {cert.verified && (
                  <div className="mt-2 flex items-center gap-1 text-xs font-medium text-accent">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Credential verified
                  </div>
                )}
              </div>
              <button
                className="text-ink-tertiary hover:text-danger transition-colors focus:outline-none focus:ring-2 focus:ring-danger rounded p-1"
                aria-label="Remove certification"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}

          {/* Add Credly Account CTA */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-accent hover:bg-accent-light/30 transition-all"
          >
            <Award className="w-8 h-8 text-ink-tertiary mx-auto mb-2" />
            <p className="text-sm font-medium text-ink-primary">Connect Credly account</p>
            <p className="text-xs text-ink-tertiary mt-1">Import verified certifications automatically</p>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}

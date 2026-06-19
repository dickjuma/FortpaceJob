import React from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, FileText, Upload, AlertCircle, CheckCircle, Calendar, ShieldCheck } from 'lucide-react';
import { useAgencyVerification } from '../services/agencyHooks';

const Step = ({ title, status, description }) => {
  const pending = status !== 'Complete';
  return (
    <div className="flex gap-4 rounded-2xl border border-border p-4">
      <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center ${pending ? 'bg-amber-50 text-amber-700' : 'bg-success/10 text-success'}`}>
        {pending ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
      </div>
      <div>
        <h3 className="font-display font-bold text-brand-900">{title}</h3>
        <p className="text-sm text-ink-secondary mt-1">{description}</p>
        <p className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${pending ? 'bg-amber-50 text-amber-700' : 'bg-success/10 text-success'}`}>{status}</p>
      </div>
    </div>
  );
};

export default function AgencyVerificationPage() {
  const { data, isLoading } = useAgencyVerification();
  const verification = data || {
    status: 'In Review',
    documents: [
      { name: 'Certificate of Incorporation', uploaded: 'Jun 02, 2026', status: 'Verified' },
      { name: 'Tax Compliance Certificate', uploaded: 'Jun 04, 2026', status: 'Pending Review' },
      { name: 'Director Identification', uploaded: 'Jun 05, 2026', status: 'Verified' },
    ],
    tax: 'KRA PIN: A123456789X',
    registration: 'CPR/2022/004812',
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="rounded-[28px] bg-[#222222] text-white p-6 md:p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-success/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BadgeCheck className="w-5 h-5 text-success" />
              <span className="text-xs font-black uppercase tracking-widest text-success">Business verification</span>
            </div>
            <h1 className="font-display text-3xl font-black">Agency verification</h1>
            <p className="text-white/70 text-sm mt-2 max-w-2xl">Submit documents, tax information, and registration details to verify your agency account.</p>
          </div>
          <div className="rounded-2xl bg-white/10 border border-white/20 px-5 py-4 text-center">
            <p className="text-xs text-white/60">Verification status</p>
            <p className="font-display text-2xl font-black mt-1">{verification.status}</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-32 rounded-2xl bg-surface-muted animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <h3 className="font-display font-bold text-xl text-brand-900 mb-4">Submitted documents</h3>
              <div className="space-y-3">
                {verification.documents.map((doc) => (
                  <div key={doc.name} className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-xl border border-border p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-[#4C1D95]" />
                      <div>
                        <p className="font-bold text-ink-primary">{doc.name}</p>
                        <p className="text-xs text-ink-secondary flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Uploaded {doc.uploaded}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-success/10 text-success px-2.5 py-1 text-xs font-bold">{doc.status}</span>
                  </div>
                ))}
              </div>
              <button className="mt-5 rounded-xl bg-[#4C1D95] px-5 py-2.5 text-sm font-bold text-white inline-flex items-center gap-2"><Upload className="w-4 h-4" /> Upload documents</button>
            </div>

            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <h3 className="font-display font-bold text-xl text-brand-900 mb-4">Verification stages</h3>
              <div className="space-y-4">
                <Step title="Document upload" status="Complete" description="Business registration and identity documents received." />
                <Step title="Tax validation" status="Complete" description="Tax identifier validated against official records." />
                <Step title="Compliance review" status="In Review" description="Final compliance team review is underway." />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <h3 className="font-display font-bold text-xl text-brand-900 mb-4">Registration details</h3>
              <div className="space-y-3 text-sm">
                <div className="rounded-xl bg-surface-soft p-4"><p className="text-ink-secondary">Registration number</p><p className="font-bold text-ink-primary mt-1">{verification.registration}</p></div>
                <div className="rounded-xl bg-surface-soft p-4"><p className="text-ink-secondary">Tax information</p><p className="font-bold text-ink-primary mt-1">{verification.tax}</p></div>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <h3 className="font-display font-bold text-xl text-brand-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button className="w-full rounded-xl bg-[#4C1D95] py-2.5 text-sm font-bold text-white inline-flex items-center justify-center gap-2"><Upload className="w-4 h-4" /> Upload documents</button>
                <button className="w-full rounded-xl border border-border py-2.5 text-sm font-bold text-ink-primary">Resubmit verification</button>
                <button className="w-full rounded-xl border border-border py-2.5 text-sm font-bold text-ink-primary inline-flex items-center justify-center gap-2"><ShieldCheck className="w-4 h-4" /> View compliance checklist</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

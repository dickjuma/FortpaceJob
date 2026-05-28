import React from 'react';
import { Save, Building2, Globe, Mail, MapPin, Hash, FileText } from 'lucide-react';
import useConfigStore from '../../store/configStore';
import toast from 'react-hot-toast';

export default function GeneralSettingsPage() {
  const { companyDetails, updateCompanyDetails } = useConfigStore();

  const handleChange = (e) => {
    updateCompanyDetails({ [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-zinc-800 text-white rounded-xl shadow-sm">
              <Building2 size={24} />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">System & Branding</h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium">
            Configure global company details. These will reflect on all generated invoices, receipts, and official documents.
          </p>
        </div>
        <button 
          onClick={() => toast.success('Branding & System settings saved!')}
          className="px-5 py-2.5 bg-surface-dark text-white dark:bg-brand-600 rounded-xl text-sm font-bold shadow-sm hover:bg-zinc-800 transition-colors flex items-center gap-2"
        >
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-lg font-black text-zinc-900 dark:text-white">Corporate Identity</h2>
          <p className="text-xs text-zinc-500 mt-1">Updates to these fields instantly apply to the Document Template engine.</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Building2 size={14}/> Company Name</label>
              <input 
                type="text" 
                name="name"
                value={companyDetails.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-bold text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500" 
              />
            </div>
            <div>
              <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Hash size={14}/> Official Tax ID (KRA PIN)</label>
              <input 
                type="text" 
                name="taxId"
                value={companyDetails.taxId}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-bold text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2"><MapPin size={14}/> Headquarters Address</label>
              <input 
                type="text" 
                name="address"
                value={companyDetails.address}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-bold text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500" 
              />
            </div>
            <div>
              <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Mail size={14}/> Billing Email</label>
              <input 
                type="email" 
                name="email"
                value={companyDetails.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-bold text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500" 
              />
            </div>
            <div>
              <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Globe size={14}/> Website URL</label>
              <input 
                type="text" 
                name="website"
                value={companyDetails.website}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-bold text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2"><FileText size={14}/> Footer Marketing Message</label>
              <textarea 
                name="footerMessage"
                value={companyDetails.footerMessage}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 resize-none" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

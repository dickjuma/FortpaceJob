import React, { useEffect, useState } from 'react';
import { Save, Building2, Globe, Mail, MapPin, Hash, FileText, Share2 } from 'lucide-react';
import { useCompanySettings } from '../../hooks/useSettings';
import { useSocialSettings } from '../../hooks/useSocialSettings';
import toast from 'react-hot-toast';

export default function GeneralSettingsPage() {
  const { companyDetails, updateCompanyDetails, isUpdating, isLoading } = useCompanySettings();
  const { socialLinks, saveSocialLinks, isSaving, isLoading: socialLoading } = useSocialSettings();
  const [localSocial, setLocalSocial] = useState([]);

  useEffect(() => {
    if (socialLinks?.length) setLocalSocial(socialLinks);
  }, [socialLinks]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateCompanyDetails({ ...companyDetails, [name]: value });
  };

  const handleSave = () => {
    updateCompanyDetails(companyDetails);
  };

  const updateSocial = (index, field, value) => {
    setLocalSocial((rows) => rows.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  };

  const handleSaveSocial = () => {
    saveSocialLinks(localSocial);
  };

  if (isLoading || socialLoading) return <div className="p-8">Loading settings...</div>;

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
          onClick={handleSave}
          disabled={isUpdating}
          className="px-5 py-2.5 bg-surface-dark text-white dark:bg-[#4C1D95] rounded-xl text-sm font-bold shadow-sm hover:bg-zinc-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={16} /> {isUpdating ? 'Saving...' : 'Save Changes'}
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
                value={companyDetails?.name || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-bold text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4C1D95]" 
              />
            </div>
            <div>
              <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Hash size={14}/> Official Tax ID (KRA PIN)</label>
              <input 
                type="text" 
                name="taxId"
                value={companyDetails?.taxId || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-bold text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4C1D95]" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2"><MapPin size={14}/> Headquarters Address</label>
              <input 
                type="text" 
                name="address"
                value={companyDetails?.address || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-bold text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4C1D95]" 
              />
            </div>
            <div>
              <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Mail size={14}/> Billing Email</label>
              <input 
                type="email" 
                name="email"
                value={companyDetails?.email || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-bold text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4C1D95]" 
              />
            </div>
            <div>
              <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Globe size={14}/> Website URL</label>
              <input 
                type="text" 
                name="website"
                value={companyDetails?.website || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-bold text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4C1D95]" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2"><FileText size={14}/> Footer Marketing Message</label>
              <textarea 
                name="footerMessage"
                value={companyDetails?.footerMessage || ''}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#4C1D95] resize-none" 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2">
              <Share2 size={18} /> Social media (footer icons)
            </h2>
            <p className="text-xs text-zinc-500 mt-1">Icons appear in the marketplace footer when enabled and URL is set.</p>
          </div>
          <button
            type="button"
            onClick={handleSaveSocial}
            disabled={isSaving}
            className="px-4 py-2 bg-[#4C1D95] text-white rounded-xl text-sm font-bold disabled:opacity-50"
          >
            {isSaving ? 'Saving…' : 'Save social'}
          </button>
        </div>
        <div className="p-6 space-y-4">
          {localSocial.map((link, index) => (
            <div key={link.id} className="grid md:grid-cols-4 gap-3 items-center border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <span className="font-bold text-sm text-zinc-700 dark:text-zinc-300 capitalize">{link.label || link.id}</span>
              <input
                type="url"
                placeholder="https://"
                value={link.url || ''}
                onChange={(e) => updateSocial(index, 'url', e.target.value)}
                className="md:col-span-2 px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-surface dark:bg-zinc-800 text-sm"
              />
              <label className="flex items-center gap-2 text-sm font-bold text-zinc-600">
                <input
                  type="checkbox"
                  checked={link.enabled !== false}
                  onChange={(e) => updateSocial(index, 'enabled', e.target.checked)}
                />
                Show in footer
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



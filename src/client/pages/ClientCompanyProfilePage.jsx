import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, Camera, Link as LinkIcon, Users, 
  MapPin, CheckCircle2, ShieldCheck, Star, Briefcase, 
  UploadCloud, Settings, Eye
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

export default function ClientCompanyProfilePage() {
  const [activeTab, setActiveTab] = useState('edit'); // 'edit' | 'preview'
  const [formData, setFormData] = useState({
    name: 'TechFlow Solutions',
    industry: 'Software Development',
    size: '50-200 employees',
    website: 'https://techflow.io',
    location: 'San Francisco, CA',
    description: 'We are a fast-growing software company building the future of enterprise productivity.',
    logo: 'https://ui-avatars.com/api/?name=TechFlow&background=2563eb&color=fff&size=128',
    banner: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&h=300&fit=crop'
  });

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans pb-24">
      
      {/* Header */}
      <div className="bg-white dark:bg-surface-dark border-b border-zinc-200 dark:border-zinc-800 pt-12 pb-8 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-2">Company Profile</h1>
            <p className="text-zinc-500 font-medium">Build a trusted brand to attract the best freelancers.</p>
          </div>
          
          <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('edit')}
              className={cn("px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2", activeTab === 'edit' ? "bg-white dark:bg-surface-dark text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 hover:text-zinc-700")}
            >
              <Settings className="w-4 h-4" /> Edit Profile
            </button>
            <button 
              onClick={() => setActiveTab('preview')}
              className={cn("px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2", activeTab === 'preview' ? "bg-white dark:bg-surface-dark text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 hover:text-zinc-700")}
            >
              <Eye className="w-4 h-4" /> Public Preview
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        
        {activeTab === 'edit' ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            
            {/* Branding Assets */}
            <section className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-48 bg-zinc-200 dark:bg-zinc-800 group cursor-pointer overflow-hidden">
                <img src={formData.banner} alt="Banner" className="w-full h-full object-cover group-hover:opacity-75 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-black/50 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 text-sm backdrop-blur-sm">
                    <Camera className="w-4 h-4" /> Change Cover
                  </div>
                </div>
              </div>
              
              <div className="relative mt-24 flex justify-between items-end mb-8">
                <div className="relative group cursor-pointer inline-block">
                  <img src={formData.logo} alt="Logo" className="w-32 h-32 rounded-2xl border-4 border-white dark:border-zinc-900 shadow-md object-cover bg-white" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-2xl">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-bold text-zinc-900 dark:text-white mb-2 block">Company Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-brand-500" />
                </div>
                <div>
                  <label className="text-sm font-bold text-zinc-900 dark:text-white mb-2 block">Industry</label>
                  <input type="text" value={formData.industry} onChange={(e) => setFormData({...formData, industry: e.target.value})} className="w-full bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-brand-500" />
                </div>
                <div>
                  <label className="text-sm font-bold text-zinc-900 dark:text-white mb-2 block">Company Size</label>
                  <select value={formData.size} onChange={(e) => setFormData({...formData, size: e.target.value})} className="w-full bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-brand-500">
                    <option>1-10 employees</option>
                    <option>11-50 employees</option>
                    <option>50-200 employees</option>
                    <option>201-500 employees</option>
                    <option>500+ employees</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-zinc-900 dark:text-white mb-2 block">Location</label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-brand-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-zinc-900 dark:text-white mb-2 block">About Us</label>
                  <textarea rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-brand-500 resize-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-zinc-900 dark:text-white mb-2 block">Website URL</label>
                  <input type="url" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} className="w-full bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-brand-500" />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                <button className="px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-sm transition-all">
                  Save Profile Info
                </button>
              </div>
            </section>

            {/* Verification Center */}
            <section className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-success" /> Verification Center
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-zinc-900 dark:text-white">Business Registration</h3>
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    </div>
                    <p className="text-xs text-zinc-500 mb-4">Verified on May 10, 2026</p>
                  </div>
                  <button className="text-sm font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors text-left">Update Document</button>
                </div>

                <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 flex flex-col justify-between bg-surface dark:bg-zinc-800/50">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-zinc-900 dark:text-white">Tax Certificate</h3>
                      <span className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 rounded-md">Pending</span>
                    </div>
                    <p className="text-xs text-zinc-500 mb-4">Upload your VAT/Tax certificate to get the Verified Business badge.</p>
                  </div>
                  <button className="text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors text-left flex items-center gap-1">
                    <UploadCloud className="w-4 h-4" /> Upload PDF
                  </button>
                </div>
              </div>
            </section>

          </motion.div>
        ) : (
          
          /* Public Preview (LinkedIn Style) */
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl mx-auto">
            
            <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
              <div className="h-48 w-full bg-zinc-200 dark:bg-zinc-800">
                <img src={formData.banner} alt="Banner" className="w-full h-full object-cover" />
              </div>
              
              <div className="px-8 pb-8 relative">
                <div className="flex justify-between items-end mb-4">
                  <img src={formData.logo} alt="Logo" className="w-32 h-32 rounded-2xl border-4 border-white dark:border-zinc-900 shadow-sm object-cover bg-white -mt-16" />
                  <div className="flex gap-2">
                    <button className="px-6 py-2 bg-surface-dark dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl shadow-sm transition-all text-sm">
                      Follow
                    </button>
                    <button className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-sm transition-all text-sm">
                      View Open Jobs
                    </button>
                  </div>
                </div>

                <div>
                  <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                    {formData.name} <CheckCircle2 className="w-6 h-6 text-brand-500" />
                  </h1>
                  <p className="text-lg font-medium text-zinc-600 dark:text-zinc-400 mt-1">{formData.industry}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-zinc-500 mt-4">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {formData.location}</span>
                    <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {formData.size}</span>
                    <a href={formData.website} className="flex items-center gap-1 text-brand-600 hover:underline"><LinkIcon className="w-4 h-4" /> Website</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                
                <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">About</h2>
                  <p className="text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap">{formData.description}</p>
                </div>

                <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-brand-500" /> Open Roles (3)</h2>
                  <div className="space-y-4">
                    {[1,2,3].map(i => (
                      <div key={i} className="p-4 border border-zinc-100 dark:border-zinc-800 rounded-xl hover:border-brand-500 transition-colors cursor-pointer group">
                        <h3 className="font-bold text-zinc-900 dark:text-white group-hover:text-brand-600 transition-colors">Senior React Developer</h3>
                        <p className="text-sm font-medium text-zinc-500 mt-1">Full-time contract • $50-$80/hr</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
              
              <div className="space-y-6">
                <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
                  <h2 className="font-bold text-zinc-900 dark:text-white mb-4">Hiring Stats</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-zinc-500">Total Spent</span>
                        <span className="text-sm font-black text-zinc-900 dark:text-white">$45k+</span>
                      </div>
                      <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                        <div className="w-[80%] bg-brand-500 h-full rounded-full"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-zinc-500">Hire Rate</span>
                        <span className="text-sm font-black text-zinc-900 dark:text-white">72%</span>
                      </div>
                      <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                        <div className="w-[72%] bg-success h-full rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                      <span className="font-bold text-lg text-zinc-900 dark:text-white">4.9</span>
                      <span className="text-xs font-bold text-zinc-400">(42 reviews)</span>
                    </div>
                    <p className="text-xs font-medium text-zinc-500">Highly rated by freelancers.</p>
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
}

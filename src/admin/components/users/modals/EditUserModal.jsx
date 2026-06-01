import React, { useState, useEffect } from 'react';
import { X, User, Mail, Shield, Smartphone, Globe, Save, AlertCircle } from 'lucide-react';
import { cn } from '../../../utils/cn';
import useUserManagementStore from '../../../store/userManagementStore';
import { useUserActions } from '../../../hooks/users/useUserActions';
import { updateUserApi } from '../../../api/users/users.api';
import Button from '../../../components/ui/Button';
import toast from 'react-hot-toast';

export default function EditUserModal() {
  const { activeModal, closeModal, modalTargetUser: user } = useUserManagementStore();
  const { suspendUser } = useUserActions();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    status: '',
    userGroup: '',
    phoneNumber: '',
    country: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        status: user.status || 'active',
        userGroup: user.userGroup || 'freelancer',
        phoneNumber: user.phoneNumber || '',
        country: user.country || 'Kenya'
      });
    }
  }, [user]);

  if (activeModal !== 'EDIT_USER' || !user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateUserApi(user.id, formData);
      toast.success('User profile updated successfully!');
      closeModal();
    } catch (error) {
      toast.error(error.message || 'Failed to update user profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[170] flex items-center justify-center p-4 bg-surface-dark/60 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="bg-white dark:bg-surface-dark w-full max-w-2xl rounded-[3rem] shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-surface/50 dark:bg-zinc-800/30">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#14a800] text-white rounded-2xl shadow-lg shadow-#14a800]/20">
              <User size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">Edit User Profile</h2>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{user.id}</p>
            </div>
          </div>
          <button 
            onClick={closeModal}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-zinc-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#14a800] transition-colors" size={16} />
                <input 
                  type="text" 
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-surface dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-sm font-bold outline-none focus:border-[#14a800]/20 transition-all"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#14a800] transition-colors" size={16} />
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-surface dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-sm font-bold outline-none focus:border-[#14a800]/20 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">User Group</label>
              <select 
                value={formData.userGroup}
                onChange={e => setFormData({...formData, userGroup: e.target.value})}
                className="w-full px-4 py-3 bg-surface dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-sm font-bold outline-none focus:border-[#14a800]/20 transition-all appearance-none cursor-pointer"
              >
                <option value="freelancer">Freelancer</option>
                <option value="client">Client</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Account Status</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="w-full px-4 py-3 bg-surface dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-sm font-bold outline-none focus:border-[#14a800]/20 transition-all appearance-none cursor-pointer"
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
                <option value="banned">Banned</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Phone Number</label>
              <div className="relative group">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#14a800] transition-colors" size={16} />
                <input 
                  type="tel" 
                  value={formData.phoneNumber}
                  onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-surface dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-sm font-bold outline-none focus:border-[#14a800]/20 transition-all"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Country</label>
              <div className="relative group">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#14a800] transition-colors" size={16} />
                <input 
                  type="text" 
                  value={formData.country}
                  onChange={e => setFormData({...formData, country: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-surface dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-sm font-bold outline-none focus:border-[#14a800]/20 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="p-5 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800 rounded-[2rem] flex gap-4">
             <AlertCircle className="text-amber-500 shrink-0" size={20} />
             <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 leading-relaxed">
               Changing the email address will require the user to re-verify their account. Updating the User Group may affect platform access and commission rates.
             </p>
          </div>

<div className="pt-4 flex gap-4">
             <button 
               type="button"
               onClick={closeModal}
               className="flex-1 py-4 text-sm font-black text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
             >
               Discard Changes
             </button>
             <button 
               type="submit"
               disabled={isSubmitting}
               className="flex-2 px-12 py-4 bg-[#14a800] hover:bg-[#118a00] text-white rounded-2xl text-sm font-black shadow-xl shadow-#14a800]/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
             >
               <Save size={18} />
               Save Updates
             </button>
           </div>
        </form>
      </div>
    </div>
  );
}

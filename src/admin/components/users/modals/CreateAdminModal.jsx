import React, { useState } from 'react';
import { Shield, Lock, X, Check, Copy, RefreshCw, Camera, Trash2, UploadCloud } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { uploadImage, revokeMockUrl } from '../../../utils/cloudinary';
import useUserManagementStore from '../../../store/userManagementStore';
import { useUserActions } from '../../../hooks/users/useUserActions';
import { ADMIN_ROLES, MODULE_PERMISSIONS } from '../../../config/users/userRoleConfig';
import Button from '../../../components/ui/Button';
import toast from 'react-hot-toast';

/**
 * Modal for creating a new Administrative staff account.
 */
const CreateAdminModal = () => {
  const { activeModal, closeModal } = useUserManagementStore();
  const { createAdmin } = useUserActions();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'admin',
    permissions: [],
    avatar: ''
  });

  const [isUploading, setIsUploading] = useState(false);
  const [password, setPassword] = useState('Fort-2024-' + Math.random().toString(36).substring(7).toUpperCase());

  if (activeModal !== 'CREATE_ADMIN') return null;

  const handleRoleChange = (roleId) => {
    // Basic auto-assignment of permissions based on role tier
    const roleLevel = ADMIN_ROLES[roleId].level;
    const autoPerms = MODULE_PERMISSIONS
      .filter(p => {
        if (roleLevel >= 5) return true; // Super Admin
        if (roleLevel >= 3 && p.module !== 'Settings') return true;
        return p.id.includes('read');
      })
      .map(p => p.id);

    setFormData({ ...formData, role: roleId, permissions: autoPerms });
  };

  const togglePermission = (permId) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permId)
        ? prev.permissions.filter(p => p !== permId)
        : [...prev.permissions, permId]
    }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const result = await uploadImage(file, { folder: 'admin_avatars' });
      
      // Clean up previous mock URL if it was a blob
      if (formData.avatar) revokeMockUrl(formData.avatar);
      
      setFormData(prev => ({ ...prev, avatar: result.secure_url }));
      toast.success('Photo uploaded successfully');
    } catch (err) {
      toast.error('Upload failed: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const removeAvatar = () => {
    if (formData.avatar) revokeMockUrl(formData.avatar);
    setFormData(prev => ({ ...prev, avatar: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createAdmin.mutateAsync({ ...formData, password });
    closeModal();
  };

  const groupedPermissions = MODULE_PERMISSIONS.reduce((acc, perm) => {
    if (!acc[perm.module]) acc[perm.module] = [];
    acc[perm.module].push(perm);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div className="absolute inset-0 bg-surface-dark/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={closeModal} />
      
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-surface-dark rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 bg-brand-50 dark:bg-brand-900/20 text-brand-600 rounded-xl flex items-center justify-center">
                <Shield size={24} />
             </div>
             <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Onboard Administrator</h2>
          </div>
          <button onClick={closeModal} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
             <X size={20} className="text-zinc-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          {/* Section: Basic Info */}
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-brand-600 flex items-center gap-2">
               <div className="h-1 w-4 bg-brand-600 rounded-full" />
               Basic Identification
            </h3>
            
            <div className="flex flex-col md:flex-row gap-10 items-start">
               {/* Avatar Upload */}
               <div className="relative group shrink-0 self-center md:self-start">
                  <div className={cn(
                    "h-32 w-32 rounded-[40px] border-4 border-zinc-50 dark:border-zinc-800 shadow-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center transition-all group-hover:scale-105",
                    isUploading && "animate-pulse"
                  )}>
                     {formData.avatar ? (
                       <img src={formData.avatar} alt="Preview" className="h-full w-full object-cover" />
                     ) : (
                       <Camera size={40} className="text-zinc-300 dark:text-zinc-600" />
                     )}
                  </div>
                  
                  <label className="absolute -bottom-2 -right-2 h-10 w-10 bg-brand-600 text-white rounded-2xl flex items-center justify-center shadow-lg cursor-pointer hover:bg-brand-700 transition-all">
                     <UploadCloud size={18} />
                     <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} disabled={isUploading} />
                  </label>

                  {formData.avatar && (
                    <button 
                      type="button"
                      onClick={removeAvatar}
                      className="absolute -top-2 -right-2 h-8 w-8 bg-rose-500 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-rose-600 transition-all opacity-0 group-hover:opacity-100"
                    >
                       <Trash2 size={14} />
                    </button>
                  )}
                  
                  <div className="mt-4 text-center">
                     <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Profile Photo</p>
                  </div>
               </div>

               {/* Info Grid */}
               <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">First Name</label>
                    <input required type="text" className="w-full h-12 px-4 bg-surface dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-xl text-sm font-bold outline-none focus:border-brand-500 transition-all" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Last Name</label>
                    <input required type="text" className="w-full h-12 px-4 bg-surface dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-xl text-sm font-bold outline-none focus:border-brand-500 transition-all" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Corporate Email</label>
                    <input required type="email" className="w-full h-12 px-4 bg-surface dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-xl text-sm font-bold outline-none focus:border-brand-500 transition-all" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Phone Number</label>
                    <input required type="tel" className="w-full h-12 px-4 bg-surface dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-xl text-sm font-bold outline-none focus:border-brand-500 transition-all" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
               </div>
            </div>
          </div>

          {/* Section: Security */}
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-brand-600 flex items-center gap-2">
               <div className="h-1 w-4 bg-brand-600 rounded-full" />
               Security Credentials
            </h3>
            <div className="p-6 bg-surface-dark rounded-2xl border border-white/5 shadow-inner relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 text-white/5 -mr-8 -mt-8">
                  <Lock size={120} />
               </div>
               <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                  <div className="flex-1 w-full">
                     <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2">Temporary Access Key</p>
                     <div className="flex items-center gap-4">
                        <code className="text-2xl font-black text-white tracking-widest">{password}</code>
                        <button 
                          type="button" 
                          onClick={() => {
                            navigator.clipboard.writeText(password);
                            toast.success('Password copied');
                          }}
                          className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
                        >
                           <Copy size={18} />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setPassword('Fort-2024-' + Math.random().toString(36).substring(7).toUpperCase())}
                          className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
                        >
                           <RefreshCw size={18} />
                        </button>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-[11px] font-bold text-amber-400 leading-tight">Must be changed<br/>on first login.</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Section: Roles & Permissions */}
          <div className="space-y-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-brand-600 flex items-center gap-2">
               <div className="h-1 w-4 bg-brand-600 rounded-full" />
               Governance Roles & Access
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
               {Object.entries(ADMIN_ROLES).map(([id, role]) => (
                 <button
                    key={id}
                    type="button"
                    onClick={() => handleRoleChange(id)}
                    className={cn(
                      "p-4 rounded-2xl border-2 transition-all text-left group",
                      formData.role === id 
                        ? "border-brand-600 bg-brand-50/50 dark:bg-brand-900/10" 
                        : "border-zinc-100 dark:border-zinc-800 hover:border-brand-200"
                    )}
                 >
                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", formData.role === id ? "bg-brand-600 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400")}>
                       <role.icon size={20} />
                    </div>
                    <p className="text-xs font-black text-zinc-900 dark:text-white leading-none mb-1">{role.label}</p>
                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">Tier {role.level} Access</p>
                 </button>
               ))}
            </div>

            <div className="space-y-6 pt-6">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Granular Permissions</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Object.entries(groupedPermissions).map(([module, perms]) => (
                    <div key={module} className="space-y-3">
                       <p className="text-[10px] font-black text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-2">{module}</p>
                       <div className="space-y-2">
                          {perms.map(p => (
                            <label key={p.id} className="flex items-center gap-3 cursor-pointer group">
                               <div 
                                  className={cn(
                                    "h-5 w-5 rounded-md flex items-center justify-center border-2 transition-all",
                                    formData.permissions.includes(p.id) ? "bg-brand-600 border-brand-600 text-white" : "border-zinc-200 dark:border-zinc-700"
                                  )}
                                  onClick={() => togglePermission(p.id)}
                               >
                                  {formData.permissions.includes(p.id) && <Check size={12} strokeWidth={4} />}
                               </div>
                               <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 transition-colors">
                                  {p.label}
                               </span>
                            </label>
                          ))}
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </form>

        <div className="p-8 border-t border-zinc-100 dark:border-zinc-800 bg-surface/50 dark:bg-zinc-800/50 flex justify-end gap-4">
           <Button variant="secondary" className="h-12 px-8" onClick={closeModal}>Discard</Button>
           <Button 
             variant="primary" 
             className="h-12 px-10" 
             onClick={handleSubmit}
             isLoading={createAdmin.isPending}
           >
             Confirm Onboarding
           </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateAdminModal;

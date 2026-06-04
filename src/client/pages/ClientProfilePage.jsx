import React, { useState, useEffect } from 'react';
import {
  User, Edit2, Camera, Building, MapPin, Globe, Mail,
  Phone, Star, Briefcase, CheckCircle, Calendar, Save,
  X, Loader2, AlertCircle, DollarSign
} from 'lucide-react';
import { useMyProfile, useUpdateProfile, useUpdateCompanyProfile } from '../services/clientHooks';
import { profileAPI } from '../../common/services/api';
import { CLIENT_ACCOUNT_TYPES, normalizeClientType } from '../../common/constants/accountTypes';
import toast, { Toaster } from 'react-hot-toast';

export default function ClientProfilePage() {
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [clientType, setClientType] = useState('INDIVIDUAL');
  const [formErrors, setFormErrors] = useState({});

  const { data: profile, isLoading, error } = useMyProfile();
  const updateProfile = useUpdateProfile();
  const updateCompany = useUpdateCompanyProfile();

  useEffect(() => {
    if (profile) {
      setClientType(normalizeClientType(profile.accountType || profile.clientProfile?.clientType));
    }
  }, [profile?.id]);

  const startEdit = () => {
    setClientType(normalizeClientType(profile?.accountType || profile?.clientProfile?.clientType));
    setEditForm({
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      bio: profile?.bio || profile?.clientProfile?.companyBio || '',
      phone: profile?.phone || '',
      location: profile?.clientProfile?.location || '',
      website: profile?.clientProfile?.website || '',
      companyName: profile?.clientProfile?.companyName || '',
      industry: profile?.clientProfile?.industry || '',
      companySize: profile?.clientProfile?.companySize || '',
    });
    setEditing(true);
  };

  const cancelEdit = () => { setEditing(false); setEditForm(null); setFormErrors({}); };

  const validateForm = () => {
    const errors = {};
    if (!editForm?.firstName?.trim()) errors.firstName = 'First name is required.';
    if (!editForm?.lastName?.trim()) errors.lastName = 'Last name is required.';
    if (clientType !== 'INDIVIDUAL' && !editForm?.companyName?.trim()) errors.companyName = 'Company name is required for business accounts.';
    if (editForm?.website && !/^https?:\/\/[\w\-]+(\.[\w\-]+)+([\w\-\._~:/?#[\]@!$&'()*+,;=.]+)?$/.test(editForm.website)) {
      errors.website = 'Please enter a valid website URL (https://...).';
    }
    if (editForm?.phone && !/^\+?[0-9]{7,15}$/.test(editForm.phone)) {
      errors.phone = 'Please enter a valid phone number with country code.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const inputClass = (field) =>
    `w-full rounded-xl px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 ${
      formErrors[field]
        ? 'border-rose-400 bg-rose-50 text-rose-900 ring-rose-200'
        : 'border-zinc-200 bg-zinc-50 text-zinc-900 focus:border-[#2bb75c] focus:ring-success/20'
    }`;

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fix the highlighted fields before saving.');
      return;
    }

    try {
      await updateProfile.mutateAsync({
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        bio: editForm.bio,
        phone: editForm.phone,
        accountType: clientType,
        clientType,
      });
      if (clientType !== 'INDIVIDUAL' || editForm.companyName) {
        await updateCompany.mutateAsync({
          companyName: editForm.companyName,
          location: editForm.location,
          website: editForm.website,
          industry: editForm.industry,
          companySize: editForm.companySize,
        });
      }
      setEditing(false);
      setEditForm(null);
      setFormErrors({});
      toast.success('Profile saved');
    } catch (err) {
      toast.error(err.message || 'Save failed');
    }
  };

  const isSaving = updateProfile.isPending || updateCompany.isPending;
  const p = profile;
  const cp = p?.clientProfile;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-zinc-900/40 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (error || !p) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-12 h-12 text-red-400 opacity-60" />
        <p className="text-zinc-400">Failed to load profile.</p>
      </div>
    );
  }

  const displayName = `${p.firstName || ''} ${p.lastName || ''}`.trim() || p.username || 'Client';
  const initials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 p-6 overflow-y-auto custom-scrollbar">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Client account type */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-wide mb-3">Client account type</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {CLIENT_ACCOUNT_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                disabled={!editing && clientType !== type.id}
                onClick={() => editing && setClientType(type.id)}
                className={`text-left p-4 rounded-xl border-2 transition-all ${
                  clientType === type.id
                    ? 'border-[#2bb75c] bg-[#2bb75c]/5'
                    : 'border-zinc-200 bg-zinc-50 opacity-80'
                } ${editing ? 'cursor-pointer hover:border-[#2bb75c]/40' : 'cursor-default'}`}
              >
                <p className="font-bold text-zinc-900 text-sm">{type.label}</p>
                <p className="text-xs text-zinc-500 mt-1">{type.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Cover */}
          <div className="h-32 bg-gradient-to-br from-success/30 via-success/20 to-zinc-900/80 relative">
            <div className="absolute inset-0 bg-zinc-900/40" />
          </div>

          {/* Avatar + Info */}
          <div className="px-6 pb-6 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-8 relative z-10">
              <div className="flex items-end gap-4">
                <div className="w-20 h-20 rounded-2xl bg-zinc-800 border-4 border-zinc-950 flex items-center justify-center text-2xl font-bold text-white overflow-hidden shrink-0">
                  {p.avatar ? <img src={p.avatar} alt={displayName} className="w-full h-full object-cover" /> : initials}
                </div>
                <div className="pb-1">
                  <h1 className="text-xl font-bold text-zinc-900">{displayName}</h1>
                  <p className="text-sm text-zinc-600 mt-0.5">{cp?.companyName || p.email}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {p.isVerified && <span className="flex items-center gap-1 text-[10px] text-success font-bold"><CheckCircle className="w-3 h-3" />Verified</span>}
                    {p.role && <span className="text-[10px] text-zinc-500 capitalize ml-2">• {p.role.toLowerCase()}</span>}
                  </div>
                </div>
              </div>
              {!editing ? (
                <button onClick={startEdit} className="flex items-center gap-1.5 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 rounded-xl text-sm font-bold transition-colors">
                  <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={cancelEdit} className="flex items-center gap-1.5 px-3 py-2 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-xl text-xs font-bold hover:bg-zinc-700 transition-colors">
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                  <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-1.5 px-4 py-2 bg-success text-white rounded-xl text-xs font-bold hover:bg-success transition-colors disabled:opacity-50">
                    {isSaving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Saving...</> : <><Save className="w-3.5 h-3.5" />Save Changes</>}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Jobs Posted', value: cp?.totalJobsPosted ?? '—', icon: Briefcase, color: 'text-success' },
            { label: 'Total Hires', value: cp?.totalHires ?? '—', icon: CheckCircle, color: 'text-success' },
            { label: 'Active Jobs', value: cp?.activeJobsCount ?? '—', icon: Star, color: 'text-orange-400' },
            { label: 'Member Since', value: p.createdAt ? new Date(p.createdAt).getFullYear() : '—', icon: Calendar, color: 'text-blue-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white border border-zinc-200 rounded-2xl p-4 text-center shadow-sm">
              <Icon className={`w-5 h-5 mx-auto mb-2 ${color}`} />
              <p className="text-lg font-bold text-zinc-900">{value}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Edit Form or View */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-5 shadow-sm">
          <h2 className="font-bold text-zinc-900">Profile Details</h2>

          {editing ? (
            <div className="space-y-4">
              {Object.keys(formErrors).length > 0 && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
                  Please fix the highlighted fields before saving.
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-400 mb-1.5 block">First Name</label>
                  <input
                    value={editForm.firstName}
                    onChange={(e) => setEditForm(f => ({ ...f, firstName: e.target.value }))}
                    className={inputClass('firstName')}
                    aria-invalid={Boolean(formErrors.firstName)}
                  />
                  {formErrors.firstName && <p className="mt-1 text-xs text-rose-500">{formErrors.firstName}</p>}
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1.5 block">Last Name</label>
                  <input
                    value={editForm.lastName}
                    onChange={(e) => setEditForm(f => ({ ...f, lastName: e.target.value }))}
                    className={inputClass('lastName')}
                    aria-invalid={Boolean(formErrors.lastName)}
                  />
                  {formErrors.lastName && <p className="mt-1 text-xs text-rose-500">{formErrors.lastName}</p>}
                </div>
              </div>
              {(clientType === 'SME' || clientType === 'CORPORATE') && (
                <>
                  <div>
                    <label className="text-xs text-zinc-500 mb-1.5 block">Company Name</label>
                    <input
                      value={editForm.companyName}
                      onChange={(e) => setEditForm(f => ({ ...f, companyName: e.target.value }))}
                      className={inputClass('companyName')}
                      aria-invalid={Boolean(formErrors.companyName)}
                    />
                    {formErrors.companyName && <p className="mt-1 text-xs text-rose-500">{formErrors.companyName}</p>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-zinc-500 mb-1.5 block">Industry</label>
                      <input
                        value={editForm.industry}
                        onChange={(e) => setEditForm(f => ({ ...f, industry: e.target.value }))}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-[#2bb75c]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500 mb-1.5 block">Company size</label>
                      <input
                        value={editForm.companySize}
                        onChange={(e) => setEditForm(f => ({ ...f, companySize: e.target.value }))}
                        placeholder="e.g. 11-50"
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-[#2bb75c]"
                      />
                    </div>
                  </div>
                </>
              )}
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Bio / About</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm(f => ({ ...f, bio: e.target.value }))}
                  rows={3}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-success resize-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-400 mb-1.5 block">Phone</label>
                  <input
                    value={editForm.phone}
                    onChange={(e) => setEditForm(f => ({ ...f, phone: e.target.value }))}
                    className={inputClass('phone')}
                    aria-invalid={Boolean(formErrors.phone)}
                  />
                  {formErrors.phone && <p className="mt-1 text-xs text-rose-500">{formErrors.phone}</p>}
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1.5 block">Location</label>
                  <input
                    value={editForm.location}
                    onChange={(e) => setEditForm(f => ({ ...f, location: e.target.value }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-success"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Website</label>
                <input
                  value={editForm.website}
                  onChange={(e) => setEditForm(f => ({ ...f, website: e.target.value }))}
                  placeholder="https://..."
                  className={inputClass('website')}
                  aria-invalid={Boolean(formErrors.website)}
                />
                {formErrors.website && <p className="mt-1 text-xs text-rose-500">{formErrors.website}</p>}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {p.bio || cp?.companyBio ? (
                <div>
                  <p className="text-xs text-zinc-500 mb-1">About</p>
                  <p className="text-sm text-zinc-300 leading-relaxed">{p.bio || cp?.companyBio}</p>
                </div>
              ) : (
                <p className="text-sm text-zinc-500 italic">No bio added yet. Click "Edit Profile" to add one.</p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  { label: 'Email', value: p.email, icon: Mail },
                  { label: 'Phone', value: p.phone || '—', icon: Phone },
                  { label: 'Location', value: cp?.location || '—', icon: MapPin },
                  { label: 'Website', value: cp?.website || '—', icon: Globe },
                  { label: 'Company', value: cp?.companyName || '—', icon: Building },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5 text-success" />
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500">{label}</p>
                      <p className="text-sm text-zinc-300">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Wallet & Deposits */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-5">
          <h2 className="font-bold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-success" /> Wallet & Deposits
          </h2>
          <p className="text-sm text-zinc-400">Add funds to your escrow wallet via M-Pesa to hire talent.</p>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const amount = fd.get('amount');
              const phone = fd.get('phone');
              if (!amount || !phone) return toast.error('Enter amount and M-Pesa number');

              const id = toast.loading('Initiating M-Pesa STK Push...');
              try {
                // Call backend deposit endpoint
                const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
                const r = await fetch(`${apiBase}/escorow_wallet/payment/deposit`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('accessToken')}`
                  },
                  body: JSON.stringify({ provider: 'MPESA', amount: Number(amount), phoneNumber: phone, currency: 'KES' })
                });
                if (!r.ok) throw new Error('Deposit request failed');
                toast.success('STK Push sent to your phone! Enter PIN to complete.', { id });
                e.target.reset();
              } catch (err) {
                toast.error(err.message || 'Failed to initiate deposit', { id });
              }
            }}
            className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-5 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Amount (KES)</label>
                <input name="amount" type="number" min="10" placeholder="e.g. 5000" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-success" required />
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">M-Pesa Phone Number</label>
                <input name="phone" placeholder="e.g. 254700000000" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-success" required />
              </div>
            </div>
            <button type="submit" className="px-5 py-2.5 bg-success text-zinc-950 font-bold text-sm rounded-xl hover:bg-success/90 transition-colors w-full sm:w-auto">
              Deposit via M-Pesa
            </button>
            <p className="text-[10px] text-zinc-500 mt-2">Enter your Safaricom number starting with 254. A prompt will appear on your phone to enter your M-Pesa PIN.</p>
          </form>
        </div>
      </div>
    </div>
  );
}


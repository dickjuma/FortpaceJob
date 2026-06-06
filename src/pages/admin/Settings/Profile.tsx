// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/common/Card';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { Avatar } from '../../../components/common/Avatar';
import { api } from '../../../common/services/api';

export const ProfileSettings = () => {
  const [profile, setProfile] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    api
      .get('/admin_rbc/profile')
      .then(({ data }) => {
        if (!active) return;
        const user = data.user || {};
        setProfile(user);
        setFirstName(user.firstName || '');
        setLastName(user.lastName || '');
        setEmail(user.email || '');
        setPhone(user.phone || '');
        setBio(user.bio || '');
      })
      .catch((err) => {
        if (!active) return;
        setError(err?.message || 'Unable to load profile information.');
      })
      .finally(() => {
        if (!active) return;
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage('');
    setIsSaving(true);

    try {
      await api.patch('/admin_rbc/profile', {
        firstName,
        lastName,
        email,
        phone,
        bio,
      });
      setSuccessMessage('Profile updated successfully.');
      setProfile((prev) => ({
        ...prev,
        email,
        phone,
        bio,
        firstName,
        lastName,
        name: [firstName, lastName].filter(Boolean).join(' ').trim() || prev?.name,
      }));
    } catch (err) {
      setError(err?.message || 'Unable to save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#222222]">Profile Settings</h1>
        <p className="text-text-secondary mt-1">Manage your public profile information.</p>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {successMessage}
        </div>
      )}

      <Card>
        <div className="max-w-2xl">
          <div className="mb-8 flex items-center space-x-6">
            <Avatar size="lg" name={profile?.name || 'Admin User'} />
            <div>
              <Button variant="outline" size="sm" className="mb-2">Change Avatar</Button>
              <p className="text-xs text-text-secondary">JPG, GIF or PNG. Max size of 800K</p>
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-100 p-8 text-center text-zinc-500 animate-pulse">
              Loading profile...
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleProfileSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                <Input label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>

              <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

              <Input label="Phone Number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />

              <div className="flex flex-col mb-4">
                <label className="mb-1 text-sm font-semibold text-text-primary">Bio / About</label>
                <textarea
                  className="w-full rounded-md border border-border bg-white px-4 py-3 text-sm transition-colors focus:border-[#e63946] focus:outline-none focus:ring-1 focus:ring-[#e63946] custom-scrollbar min-h-[120px] resize-y"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <div className="pt-4 border-t border-border">
                <Button type="submit" variant="primary" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProfileSettings;

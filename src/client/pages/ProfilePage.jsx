import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../common/authStore';
import { profileAPI } from '../../common/services/api';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await profileAPI.getMyProfile();
      setProfile(data.user);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="p-8">Loading profile...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white dark:bg-surface-dark-secondary rounded-xl shadow p-6">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 rounded-full bg-brand-200 flex items-center justify-center text-brand-700 text-3xl font-bold">
            {profile?.firstName?.[0] || user?.email?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold dark:text-white">
              {profile?.firstName} {profile?.lastName}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">{profile?.email}</p>
            <div className="mt-2 inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Client
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Company Details</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400">Company Name</label>
              <p className="mt-1 font-medium dark:text-gray-200">
                {profile?.clientProfile?.companyName || 'Not set'}
              </p>
            </div>
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400">Industry</label>
              <p className="mt-1 font-medium dark:text-gray-200">
                {profile?.clientProfile?.industry || 'Not set'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

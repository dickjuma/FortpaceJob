import React from 'react';
import { useFreelancerSettings, useUpdateFreelancerSettings } from '../services/freelancerHooks';

const PreferencesPage = () => {
  const { data: settings, isLoading } = useFreelancerSettings();
  const updateSettings = useUpdateFreelancerSettings();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Preferences</h1>
      <p className="text-ink-secondary">Manage Language, Timezone, Currency, Email Preferences, Theme.</p>
      
      {isLoading ? (
        <p className="mt-4 text-ink-secondary">Loading preferences...</p>
      ) : (
        <div className="mt-8 p-8 border border-dashed border-border rounded-xl flex flex-col gap-4 bg-surface-muted/50">
          <div>
            <label className="block text-sm font-medium text-ink-primary mb-1">Language</label>
            <select 
              className="w-full max-w-sm rounded-lg border border-border px-3 py-2 text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
              defaultValue={settings?.language || 'English'}
              onChange={(e) => updateSettings.mutate({ language: e.target.value })}
            >
              <option>English</option>
              <option>French</option>
              <option>Spanish</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-primary mb-1">Timezone</label>
            <select 
              className="w-full max-w-sm rounded-lg border border-border px-3 py-2 text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
              defaultValue={settings?.timezone || 'UTC'}
              onChange={(e) => updateSettings.mutate({ timezone: e.target.value })}
            >
              <option>UTC</option>
              <option>EST</option>
              <option>PST</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreferencesPage;

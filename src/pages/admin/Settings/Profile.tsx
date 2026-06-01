// @ts-nocheck
import React from 'react';
import { Card } from '../../../components/common/Card';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { Avatar } from '../../../components/common/Avatar';

export const ProfileSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#222222]">Profile Settings</h1>
        <p className="text-text-secondary mt-1">Manage your public profile information.</p>
      </div>

      <Card>
        <div className="max-w-2xl">
          <div className="mb-8 flex items-center space-x-6">
            <Avatar size="lg" name="Admin User" />
            <div>
              <Button variant="outline" size="sm" className="mb-2">Change Avatar</Button>
              <p className="text-xs text-text-secondary">JPG, GIF or PNG. Max size of 800K</p>
            </div>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="First Name" defaultValue="Admin" required />
              <Input label="Last Name" defaultValue="User" required />
            </div>
            
            <Input label="Email Address" type="email" defaultValue="admin@fortespace.com" required />
            
            <Input label="Phone Number" type="tel" defaultValue="+1 (555) 000-0000" />
            
            <div className="flex flex-col mb-4">
              <label className="mb-1 text-sm font-semibold text-text-primary">
                Bio / About
              </label>
              <textarea 
                className="w-full rounded-md border border-border bg-white px-4 py-3 text-sm transition-colors focus:border-[#e63946] focus:outline-none focus:ring-1 focus:ring-[#e63946] custom-scrollbar min-h-[120px] resize-y"
                defaultValue="I am the system administrator for The Fortespace platform."
              />
            </div>
            
            <div className="pt-4 border-t border-border">
              <Button variant="primary">Save Changes</Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default ProfileSettings;

// @ts-nocheck
import React from 'react';
import { Card } from '../../../components/common/Card';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';

export const PasswordSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#222222]">Update Password</h1>
        <p className="text-text-secondary mt-1">Ensure your account is using a long, random password to stay secure.</p>
      </div>

      <Card>
        <form className="max-w-md space-y-4">
          <Input 
            label="Current Password" 
            type="password" 
            placeholder="Enter current password"
            required 
          />
          <Input 
            label="New Password" 
            type="password" 
            placeholder="Enter new password"
            required 
          />
          <Input 
            label="Confirm New Password" 
            type="password" 
            placeholder="Confirm new password"
            required 
          />
          
          <div className="pt-4">
            <Button variant="primary">Update Password</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PasswordSettings;

import React from 'react';
import { Loader2 } from 'lucide-react';
import { useFreelancerProfile } from '../services/freelancerHooks';
import { normalizeClientType } from '../../common/constants/accountTypes';
import MyProfile from '../../common/pages/MyProfile';
import FreelancerProfilePage from './ProfilePage';

/**
 * Routes freelancers to the correct profile experience by account type:
 * INDIVIDUAL → personal profile; SME / CORPORATE → agency/company profile.
 */
export default function FreelancerProfileRouter() {
  const { data: profile, isLoading } = useFreelancerProfile();

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#14a800]" />
      </div>
    );
  }

  const accountType = normalizeClientType(profile?.accountType || profile?.freelancerType);

  if (accountType === 'SME' || accountType === 'CORPORATE') {
    return <FreelancerProfilePage />;
  }

  return <MyProfile />;
}

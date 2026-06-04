import React from 'react';
import { Loader2 } from 'lucide-react';
import { useMyProfile } from '../services/clientHooks';
import { normalizeClientType } from '../../common/constants/accountTypes';
import ClientProfilePage from './ClientProfilePage';
import ClientCompanyProfilePage from './ClientCompanyProfilePage';

/**
 * Routes clients to the correct profile experience by account type:
 * INDIVIDUAL → personal profile; SME / CORPORATE → company profile.
 */
export default function ClientProfileRouter() {
  const { data: profile, isLoading } = useMyProfile();

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#2bb75c]" />
      </div>
    );
  }

  const accountType = normalizeClientType(profile?.accountType || profile?.clientType);

  if (accountType === 'SME' || accountType === 'CORPORATE') {
    return <ClientCompanyProfilePage accountType={accountType} />;
  }

  return <ClientProfilePage />;
}


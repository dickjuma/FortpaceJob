import React from 'react';
import { Loader2 } from 'lucide-react';
import { useMyProfile } from '../services/clientHooks';
import ClientProfilePage from './ClientProfilePage';

export default function ClientProfileRouter() {
  const { isLoading } = useMyProfile();

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#4C1D95]" />
      </div>
    );
  }

  return <ClientProfilePage />;
}



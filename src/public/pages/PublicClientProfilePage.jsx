import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Building2, MapPin, ArrowLeft, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { userAPI } from '../../common/services/api';

export default function PublicClientProfilePage() {
  const { clientId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['publicClient', clientId],
    queryFn: () => userAPI.getProfile(clientId),
    enabled: !!clientId,
  });

  const user = data?.user || data;
  const cp = user?.clientProfile || user?.profile || {};
  const name =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    cp?.companyName ||
    user?.username ||
    'Client';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 pt-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#14a800]" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-zinc-50 pt-28 px-4 text-center">
        <p className="text-zinc-600 mb-4">Client profile is not available.</p>
        <Link to="/find-talent" className="text-[#14a800] font-bold">
          Browse talent
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 pt-28 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#14a800] mb-6">
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
        <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-[#14a800]/10 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-[#14a800]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-zinc-900">{name}</h1>
              {cp?.companyName && <p className="text-zinc-600 mt-1">{cp.companyName}</p>}
              {cp?.location && (
                <p className="flex items-center gap-1 text-sm text-zinc-500 mt-2">
                  <MapPin className="w-4 h-4" /> {cp.location}
                </p>
              )}
            </div>
          </div>
          {(user?.bio || cp?.companyBio) && (
            <p className="mt-6 text-zinc-600 leading-relaxed">{user.bio || cp.companyBio}</p>
          )}
        </div>
      </div>
    </div>
  );
}

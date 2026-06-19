// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Card } from '../../platform/components/common/Card';
import { Avatar } from '../../platform/components/common/Avatar';
import { Button } from '../../platform/components/common/Button';
import { Badge } from '../../platform/components/common/Badge';
import { Mail, MoreVertical } from 'lucide-react';
import { api } from '../../platform/common/services/api';

export const TeamPage = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    api
      .get('/admin_rbc/team')
      .then(({ data }) => {
        if (!active) return;
        setTeamMembers(data.items || data.team || []);
      })
      .catch((err) => {
        if (!active) return;
        setError(err?.message || 'Unable to load team members.');
      })
      .finally(() => {
        if (!active) return;
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#222222]">Team Management</h1>
          <p className="text-text-secondary mt-1">Manage internal staff and administrative access.</p>
        </div>
        <Button variant="primary">Invite Member</Button>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-100 p-8 text-center text-zinc-500 animate-pulse">
          Loading team members...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-border">
              <p className="text-text-secondary">No team members found.</p>
            </div>
          ) : (
            teamMembers.map((member) => (
              <Card key={member.id} className="text-center p-6" hover>
                <div className="flex justify-end mb-2">
                  <button className="text-text-secondary hover:bg-light-gray p-1 rounded-full">
                    <MoreVertical size={18} />
                  </button>
                </div>
                <Avatar name={member.name} size="lg" className="mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#222222]">{member.name}</h3>
                <p className="text-sm font-medium text-text-primary mb-1">{member.role}</p>
                <p className="text-xs text-text-secondary mb-4">{member.email}</p>
                <div className="mb-6">
                  <Badge variant={member.status === 'Active' ? 'success' : 'default'}>
                    {member.status || 'Unknown'}
                  </Badge>
                </div>
                <Button variant="outline" className="w-full" icon={<Mail size={16} />}>
                  Send Message
                </Button>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TeamPage;

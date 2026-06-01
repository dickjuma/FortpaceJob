// @ts-nocheck
import React from 'react';
import { Card } from '../../components/common/Card';
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Mail, MoreVertical } from 'lucide-react';

const teamMembers = [
  { id: '1', name: 'Alice Smith', role: 'System Admin', email: 'alice@fortespace.com', status: 'Active' },
  { id: '2', name: 'Bob Johnson', role: 'Moderator', email: 'bob@fortespace.com', status: 'Active' },
  { id: '3', name: 'Charlie Brown', role: 'Support Agent', email: 'charlie@fortespace.com', status: 'Inactive' },
];

export const TeamPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#222222]">Team Management</h1>
          <p className="text-text-secondary mt-1">Manage internal staff and administrative access.</p>
        </div>
        <Button variant="primary">Invite Member</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map(member => (
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
                {member.status}
              </Badge>
            </div>

            <Button variant="outline" className="w-full" icon={<Mail size={16} />}>
              Send Message
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TeamPage;

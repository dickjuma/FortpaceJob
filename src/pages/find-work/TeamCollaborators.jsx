import React, { useState } from 'react';
import { Users, UserPlus, Shield, XCircle, ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const MOCK_TEAM = [
  { id: 1, name: 'Alex Manager', email: 'alex@company.com', role: 'Owner', access: 'Full Access' },
  { id: 2, name: 'Sarah Tech', email: 'sarah@company.com', role: 'Editor', access: 'Can hire & message' },
  { id: 3, name: 'John Finance', email: 'john@company.com', role: 'Viewer', access: 'Read only' },
];

const TeamCollaborators = () => {
  const { workId } = useParams();
  const [email, setEmail] = useState('');

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          
          <Link to={`/find-work/work/${workId || 1}/applications`} className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-brand-600 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Job Dashboard
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-zinc-900 mb-2">Team Collaborators</h1>
            <p className="text-zinc-600 font-medium">Invite colleagues to help manage applicants and interviews for this job.</p>
          </div>

          <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-sm mb-8">
            <h2 className="text-xl font-bold text-zinc-900 mb-6">Invite New Member</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="colleague@company.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 bg-surface border border-zinc-200 rounded-xl focus:border-brand-500 focus:outline-none font-medium text-zinc-900"
              />
              <select className="px-4 py-3 bg-surface border border-zinc-200 rounded-xl focus:border-brand-500 focus:outline-none font-bold text-zinc-700 cursor-pointer w-full sm:w-auto">
                <option>Editor</option>
                <option>Viewer</option>
              </select>
              <button className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                <UserPlus className="w-5 h-5" /> Invite
              </button>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface border-b border-zinc-200">
                <tr>
                  <th className="p-6 font-bold text-zinc-500 text-sm">Team Member</th>
                  <th className="p-6 font-bold text-zinc-500 text-sm hidden sm:table-cell">Permissions</th>
                  <th className="p-6 font-bold text-zinc-500 text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {MOCK_TEAM.map(member => (
                  <tr key={member.id} className="hover:bg-surface transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-zinc-600 shrink-0">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-zinc-900">{member.name}</div>
                          <div className="text-xs font-medium text-zinc-500">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <Shield className={`w-4 h-4 ${member.role === 'Owner' ? 'text-rose-500' : 'text-brand-500'}`} />
                        <div>
                          <div className="font-bold text-zinc-700 text-sm">{member.role}</div>
                          <div className="text-xs text-zinc-500">{member.access}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      {member.role !== 'Owner' && (
                        <button className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Remove Access">
                          <XCircle className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </>
  );
};

export default TeamCollaborators;

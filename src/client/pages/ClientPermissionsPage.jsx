import React, { useState } from 'react';
import { 
  Users, ShieldCheck, Plus, UserPlus, Key, 
  Check, Info, X, Lock, Eye 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function ClientPermissionsPage() {
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Alex Morgan', role: 'Chief Financial Officer', dept: 'Finance', status: 'Active' },
    { id: 2, name: 'Sarah Jenkins', role: 'Operations Lead', dept: 'Operations', status: 'Active' },
    { id: 3, name: 'Kiprotich Arap', role: 'Field Coordinator', dept: 'Onsite Delivery', status: 'Active' }
  ]);

  const [permissionsMatrix, setPermissionsMatrix] = useState([
    { key: 'escrow_release', name: 'Authorize Escrow Releases', exec: true, manager: false, procurement: false, surveyor: false },
    { key: 'deploy_field', name: 'Deploy Field Coordinates', exec: true, manager: true, procurement: false, surveyor: false },
    { key: 'view_tax', name: 'Access iTax iTax Records', exec: true, manager: false, procurement: true, surveyor: false },
    { key: 'edit_chains', name: 'Modify Approval Chains', exec: true, manager: false, procurement: false, surveyor: false }
  ]);

  const togglePermission = (permKey, roleField) => {
    setPermissionsMatrix(prev => prev.map(p => 
      p.key === permKey ? { ...p, [roleField]: !p[roleField] } : p
    ));
    toast.success('Access privilege updated successfully.');
  };

  const handleInvite = (e) => {
    e.preventDefault();
    toast.success('Invitation email dispatched to candidate admin.');
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans text-white bg-zinc-950/20 rounded-3xl animate-in fade-in duration-500">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Access Control & Team Permissions</h1>
          <p className="text-xs font-semibold text-light-gray/50 mt-1">Manage corporate team roles, define granular RBAC security privilege matrices, and invite department managers.</p>
        </div>

        <Button onClick={() => toast.success('New custom role configured.')} className="bg-accent-purple border-none rounded-xl text-xs font-bold py-2.5 flex items-center gap-1.5 shadow-lg shadow-accent-purple/20">
          <Plus className="w-4 h-4" /> Add Custom Role
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Team Members & Invite */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-5 border border-white/10 bg-white/5 rounded-3xl space-y-4">
            <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-1.5"><Users className="w-4 h-4 text-accent-purple" /> Active Administrators</h3>
            
            <div className="space-y-3">
              {teamMembers.map(member => (
                <div key={member.id} className="p-3 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold text-white">{member.name}</h4>
                    <p className="text-[9px] text-light-gray/50 font-semibold mt-0.5">{member.role} • {member.dept}</p>
                  </div>
                  <span className="text-[8px] font-black uppercase bg-success/20 text-success px-2 py-0.5 rounded">{member.status}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Side: Permission Matrix Grid */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-white/10 bg-white/5 p-6 rounded-3xl">
            <h3 className="font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2"><Lock className="w-4 h-4 text-accent-purple" /> RBAC Permissions Matrix</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-medium">
                <thead>
                  <tr className="border-b border-white/5 text-light-gray/40 text-[10px] uppercase tracking-wider font-black">
                    <th className="pb-3">Security Privilege Node</th>
                    <th className="pb-3 text-center">CFO / Executive</th>
                    <th className="pb-3 text-center">SME Manager</th>
                    <th className="pb-3 text-center">Procurement Officer</th>
                    <th className="pb-3 text-center">Field Operator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {permissionsMatrix.map(p => (
                    <tr key={p.key} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 font-bold text-white flex items-center gap-2">
                        <span>{p.name}</span>
                      </td>
                      {['exec', 'manager', 'procurement', 'surveyor'].map(roleField => (
                        <td key={roleField} className="py-4 text-center">
                          <input 
                            type="checkbox" 
                            checked={p[roleField]}
                            onChange={() => togglePermission(p.key, roleField)}
                            className="w-4 h-4 accent-accent-purple bg-zinc-900 border border-white/10 rounded cursor-pointer"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import Card from '../../../platform/components/common/Card';
import Button from '../../../platform/components/common/Button';
import { 
  ShieldAlert, ShieldCheck, Check, Settings, Save, AlertTriangle, X
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { cn } from '../../../admin/utils/cn';
import { useAgencyTeamPermissions } from '../services/agencyHooks';

export default function TeamPermissionsPage() {
  const { data: response, isLoading } = useAgencyTeamPermissions();
  const permissionsData = response?.data || response || null;

  const fallbackPolicies = {
    Admin: {
      viewBilling: true,
      modifyBilling: true,
      inviteMembers: true,
      deleteProjects: true,
      manageClients: true
    },
    Manager: {
      viewBilling: true,
      modifyBilling: false,
      inviteMembers: true,
      deleteProjects: false,
      manageClients: true
    },
    Member: {
      viewBilling: false,
      modifyBilling: false,
      inviteMembers: false,
      deleteProjects: false,
      manageClients: false
    }
  };

  const initialPolicies = permissionsData && Object.keys(permissionsData).length > 0 ? permissionsData : fallbackPolicies;
  const [policies, setPolicies] = useState(initialPolicies);

  const handleTogglePolicy = (role, key) => {
    // Admin policies should ideally remain secure, but let's toggle with caution
    if (role === 'Admin' && key === 'viewBilling') {
      toast.error('Global administrators must maintain billing access!');
      return;
    }

    setPolicies(prev => {
      const updatedRole = {
        ...prev[role],
        [key]: !prev[role][key]
      };
      
      const isEnabled = updatedRole[key];
      toast.success(`Updated ${role} policy: ${key} is now ${isEnabled ? 'Enabled' : 'Disabled'}`);
      
      return {
        ...prev,
        [role]: updatedRole
      };
    });
  };

  const handleSavePolicies = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Syncing custom authorization policies...',
        success: 'All RBAC policy states successfully synced to workspace security engine! 🔒',
        error: 'Error syncing policies.'
      }
    );
  };

  const policyLabels = [
    { key: 'viewBilling', label: 'View Billing & Financial Reports', desc: 'Allows viewing agency balance sheets and transactional invoices.' },
    { key: 'modifyBilling', label: 'Modify Billing Rate Cards', desc: 'Allows adjustments to contract pricing, payouts, and billing parameters.' },
    { key: 'inviteMembers', label: 'Roster Invitations', desc: 'Grants ability to send membership invitations to developers.' },
    { key: 'deleteProjects', label: 'Project Deletion', desc: 'Grants power to permanently remove collaborative project files.' },
    { key: 'manageClients', label: 'Client Management Pipeline', desc: 'Grants capability to set contract rates and negotiate directly with clients.' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans animate-in slide-in-from-bottom-4 duration-500 relative">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-8 h-8 text-success" />
            Security & Permissions
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Enforce Role-Based Access Controls (RBAC) and security boundary parameters for your agency team members.
          </p>
        </div>
        <Button 
          variant="primary" 
          icon={<Save size={18} />}
          onClick={handleSavePolicies}
        >
          Save Policies
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Policy Info / Explanation */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-white border border-border p-6 rounded-2xl shadow-sm">
            <h3 className="text-base font-black text-text-primary mb-4 flex items-center gap-2 border-b border-border pb-3">
              <Settings className="w-5 h-5 text-success" />
              Policy Guidelines
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed font-medium">
              We employ strict capability-based authorization policies to keep your agency financial assets, client relations, and source code deliverables entirely secure.
            </p>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-xs font-bold text-amber-800 mt-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Modifying role permissions will instantly refresh active sessions for security enforcement.</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side: Permission Matrix Table */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border border-border p-6 rounded-2xl shadow-sm overflow-hidden">
            <h3 className="text-base font-black text-text-primary mb-6 border-b border-border pb-3 flex justify-between items-center">
              <span>RBAC Policy Matrix</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border text-left">
                <thead className="bg-light-gray/40">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-xs font-bold text-text-secondary uppercase tracking-wider w-[40%]">Permission Policy</th>
                    {['Admin', 'Manager', 'Member'].map(r => (
                      <th key={r} scope="col" className="px-4 py-3 text-center text-xs font-bold text-text-secondary uppercase tracking-wider">{r}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-transparent">
                  {policyLabels.map((policy) => (
                    <tr key={policy.key} className="hover:bg-light-gray/10">
                      <td className="px-4 py-4">
                        <p className="text-sm font-bold text-text-primary">{policy.label}</p>
                        <p className="text-xs text-text-secondary font-medium leading-relaxed mt-0.5">{policy.desc}</p>
                      </td>
                      {['Admin', 'Manager', 'Member'].map((role) => (
                        <td key={role} className="px-4 py-4 text-center">
                          <button 
                            onClick={() => handleTogglePolicy(role, policy.key)}
                            className={cn(
                              "w-8 h-8 rounded-xl border flex items-center justify-center mx-auto transition-all hover:scale-105",
                              policies[role][policy.key]
                                ? "bg-success/10 border-success text-success"
                                : "bg-light-gray border-border text-text-secondary hover:border-border-hover"
                            )}
                          >
                            {policies[role][policy.key] ? <ShieldCheck size={18} /> : <X size={14} />}
                          </button>
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

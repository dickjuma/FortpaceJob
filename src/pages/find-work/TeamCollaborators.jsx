import React, { useCallback, useEffect, useState } from 'react';
import { Shield, XCircle, ArrowLeft, UserPlus, Loader2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useConfirm } from '../../common/context/ConfirmContext';
import { extractList, workAPI } from './findWorkWorkflow';

const ROLE_ACCESS = {
  Editor: 'Can hire & message',
  Viewer: 'Read only',
  Reviewer: 'Can review applicants',
  Owner: 'Full Access',
};

const TeamCollaborators = () => {
  const { workId } = useParams();
  const { confirm } = useConfirm();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Editor');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [team, setTeam] = useState([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await workAPI.getCollaborators(workId);
      setTeam(extractList(response));
    } catch (err) {
      toast.error(err.message || 'Could not load collaborators.');
      setTeam([]);
    } finally {
      setLoading(false);
    }
  }, [workId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSubmitting(true);
    try {
      await workAPI.addCollaborator(workId, { email: email.trim(), role });
      toast.success('Collaborator invited.');
      setEmail('');
      await loadData();
    } catch (err) {
      toast.error(err.message || 'Could not invite collaborator.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (memberId) => {
    const approved = await confirm({
      title: 'Remove collaborator?',
      message: 'They will lose access to this job dashboard.',
      confirmLabel: 'Remove',
      variant: 'danger',
    });
    if (!approved) return;

    setRemovingId(memberId);
    try {
      await workAPI.removeCollaborator(workId, memberId);
      toast.success('Collaborator removed.');
      setTeam((current) => current.filter((m) => m.id !== memberId));
    } catch (err) {
      toast.error(err.message || 'Could not remove collaborator.');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <Link to={`/find-work/work/${workId}/applications`} className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-[#4C1D95] transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Job Dashboard
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-zinc-900 mb-2">Team Collaborators</h1>
            <p className="text-zinc-600 font-medium">Invite colleagues to help manage applicants and interviews for this job.</p>
          </div>

          <form onSubmit={handleInvite} className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-sm mb-8">
            <h2 className="text-xl font-bold text-zinc-900 mb-6">Invite New Member</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                required
                placeholder="colleague@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 bg-surface border border-zinc-200 rounded-xl focus:border-[#4C1D95]/20 focus:outline-none font-medium text-zinc-900"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="px-4 py-3 bg-surface border border-zinc-200 rounded-xl focus:border-[#4C1D95]/20 focus:outline-none font-bold text-zinc-700 cursor-pointer w-full sm:w-auto"
              >
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
                <option value="Reviewer">Reviewer</option>
              </select>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-[#4C1D95] hover:bg-[#22C55E] text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
                Invite
              </button>
            </div>
          </form>

          <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
                <Loader2 className="w-10 h-10 animate-spin text-[#4C1D95] mb-4" />
                <p className="font-medium">Loading team…</p>
              </div>
            ) : team.length === 0 ? (
              <div className="p-12 text-center text-zinc-600 font-medium">No collaborators yet. Invite a teammate above.</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface border-b border-zinc-200">
                  <tr>
                    <th className="p-6 font-bold text-zinc-500 text-sm">Team Member</th>
                    <th className="p-6 font-bold text-zinc-500 text-sm hidden sm:table-cell">Permissions</th>
                    <th className="p-6 font-bold text-zinc-500 text-sm text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {team.map((member) => (
                    <tr key={member.id} className="hover:bg-surface transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-zinc-600 shrink-0">
                            {(member.name || member.email || '?').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-zinc-900">{member.name || member.email}</div>
                            <div className="text-xs font-medium text-zinc-500">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <Shield className={`w-4 h-4 ${member.role === 'Owner' ? 'text-rose-500' : 'text-[#4C1D95]'}`} />
                          <div>
                            <div className="font-bold text-zinc-700 text-sm">{member.role}</div>
                            <div className="text-xs text-zinc-500">{ROLE_ACCESS[member.role] || 'Team access'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        {member.role !== 'Owner' && (
                          <button
                            type="button"
                            disabled={removingId === member.id}
                            onClick={() => handleRemove(member.id)}
                            className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-60"
                            title="Remove Access"
                          >
                            {removingId === member.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamCollaborators;



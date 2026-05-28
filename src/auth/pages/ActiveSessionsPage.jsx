import React, { useEffect, useMemo, useState } from 'react';
import { Smartphone, Monitor, Globe, LogOut, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { authAPI } from '../../common/services/api';

const getSessionIcon = (userAgent = '') => {
  const agent = userAgent.toLowerCase();
  if (agent.includes('iphone') || agent.includes('android') || agent.includes('mobile')) {
    return Smartphone;
  }
  return Monitor;
};

const formatSessionLabel = (session, index) => {
  if (index === 0) return 'Current session';
  if (session.createdAt) {
    return new Date(session.createdAt).toLocaleString();
  }
  return 'Recently active';
};

export default function ActiveSessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRevokingAll, setIsRevokingAll] = useState(false);
  const [revokingId, setRevokingId] = useState(null);
  const [error, setError] = useState('');

  const hydratedSessions = useMemo(
    () =>
      sessions.map((session, index) => ({
        ...session,
        icon: getSessionIcon(session.userAgent),
        label: formatSessionLabel(session, index),
      })),
    [sessions]
  );

  useEffect(() => {
    const loadSessions = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await authAPI.getSessions();
        setSessions(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Could not load active sessions.');
      } finally {
        setIsLoading(false);
      }
    };

    loadSessions();
  }, []);

  const handleRevoke = async (id) => {
    try {
      setRevokingId(id);
      await authAPI.revokeSession(id);
      setSessions((prev) => prev.filter((session) => session.id !== id));
    } catch (err) {
      setError(err.message || 'Could not revoke that session.');
    } finally {
      setRevokingId(null);
    }
  };

  const handleRevokeAll = async () => {
    try {
      setIsRevokingAll(true);
      await authAPI.revokeAllSessions();
      setSessions([]);
    } catch (err) {
      setError(err.message || 'Could not revoke sessions.');
    } finally {
      setIsRevokingAll(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <Link to="/auth/security" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Security
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Active Sessions</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Review every browser and device currently signed in to your account.</p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center gap-3 p-10 text-sm text-gray-500 dark:text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading active sessions...
          </div>
        ) : hydratedSessions.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-500 dark:text-gray-400">
            No active sessions found. Once you sign in on more devices, they will appear here.
          </div>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {hydratedSessions.map((session, index) => (
              <li key={session.id} className="p-6 flex items-center justify-between gap-4">
                <div className="flex items-center space-x-4 min-w-0">
                  <div className="w-12 h-12 bg-surface dark:bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                    <session.icon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                      {session.userAgent || 'Unknown device'}
                      {index === 0 && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          Current
                        </span>
                      )}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center"><Globe className="w-3 h-3 mr-1" /> {session.ipAddress || 'Unknown IP'}</span>
                      <span>{session.label}</span>
                    </div>
                  </div>
                </div>

                {index !== 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRevoke(session.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    icon={revokingId === session.id ? Loader2 : LogOut}
                    isLoading={revokingId === session.id}
                  >
                    Revoke
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <Button variant="danger" icon={LogOut} isLoading={isRevokingAll} onClick={handleRevokeAll} disabled={hydratedSessions.length === 0}>
          Sign out of all sessions
        </Button>
      </div>
    </div>
  );
}

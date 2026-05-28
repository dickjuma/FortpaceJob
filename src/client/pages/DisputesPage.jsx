import React, { useEffect, useState } from 'react';
import { disputeAPI } from '../../common/services/api';

export default function DisputesPage() {
  const [disputes, setDisputes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDisputes();
  }, []);

  const loadDisputes = async () => {
    try {
      const data = await disputeAPI.getMyDisputes();
      setDisputes(data.disputes || data.data || []);
    } catch (err) {
      setError('Failed to load disputes');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="p-8">Loading disputes...</div>;

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Dispute Resolution Center</h1>
        <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md transition-colors">
          Open New Dispute
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="bg-white dark:bg-surface-dark-secondary rounded-xl shadow overflow-hidden">
        {disputes.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No active disputes.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {disputes.map(dispute => (
              <li key={dispute.id} className="p-6 hover:bg-surface dark:hover:bg-surface-dark transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Dispute for Contract #{dispute.contractId}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-red-500">
                      Reason: {dispute.reason}
                    </p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                      {dispute.description}
                    </p>
                    <div className="mt-2 flex items-center space-x-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Status: <span className="font-medium text-red-600">{dispute.status}</span>
                      </span>
                    </div>
                  </div>
                  <button className="border border-brand-600 text-brand-600 hover:bg-brand-50 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    View Case
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

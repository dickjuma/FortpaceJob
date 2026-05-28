import React, { useEffect, useState } from 'react';
import { proposalAPI, buyerRequestAPI } from '../../common/services/api';

export default function ProposalsPage() {
  const [proposals, setProposals] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      loadProposals(selectedJobId);
    } else {
      setProposals([]);
    }
  }, [selectedJobId]);

  const loadJobs = async () => {
    try {
      const data = await buyerRequestAPI.getMyRequests();
      const myJobs = data.requests || data.data || [];
      setJobs(myJobs);
      if (myJobs.length > 0) {
        setSelectedJobId(myJobs[0].id);
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      setError('Failed to load jobs');
      setIsLoading(false);
    }
  };

  const loadProposals = async (jobId) => {
    setIsLoading(true);
    try {
      const data = await proposalAPI.getProposalsForRequest(jobId);
      setProposals(data.proposals || data.data || []);
    } catch (err) {
      setError('Failed to load proposals');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (proposalId) => {
    try {
      await proposalAPI.updateProposalStatus(proposalId, 'ACCEPTED');
      loadProposals(selectedJobId);
    } catch (err) {
      alert('Failed to accept proposal');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Job Proposals</h1>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select a Job</label>
        <select 
          className="block w-full max-w-md rounded-md border-gray-300 dark:border-gray-600 bg-surface-white dark:bg-surface-dark focus:border-brand-500 focus:ring-brand-500"
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(e.target.value)}
        >
          {jobs.length === 0 && <option value="">No jobs found</option>}
          {jobs.map(job => (
            <option key={job.id} value={job.id}>{job.title}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="p-8">Loading proposals...</div>
      ) : (
        <div className="bg-white dark:bg-surface-dark-secondary rounded-xl shadow overflow-hidden">
          {proposals.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No proposals received for this job yet.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {proposals.map(proposal => (
                <li key={proposal.id} className="p-6 hover:bg-surface dark:hover:bg-surface-dark transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {proposal.freelancer?.firstName || 'Freelancer'} {proposal.freelancer?.lastName || ''}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {proposal.coverLetter}
                      </p>
                      <div className="mt-2 flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                          Bid: ${proposal.bidAmount}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Status: <span className="font-medium text-brand-600">{proposal.status}</span>
                        </span>
                      </div>
                    </div>
                    {proposal.status === 'PENDING' && (
                      <button 
                        onClick={() => handleAccept(proposal.id)}
                        className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-md text-sm transition-colors"
                      >
                        Accept Proposal
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

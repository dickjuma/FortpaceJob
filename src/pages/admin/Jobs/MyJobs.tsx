// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Search, Edit, Trash2, Eye } from 'lucide-react';
import { api } from '../../../common/services/api';

const STATUS_OPTIONS = ['All', 'OPEN', 'ACTIVE', 'DRAFT', 'COMPLETED', 'ARCHIVED'];

export const MyJobs = () => {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    api
      .get('/admin_rbc/marketplace/jobs?limit=50')
      .then((response) => {
        if (!active) return;
        const payload = response?.data ?? response;
        setJobs(payload.items || payload.data || []);
      })
      .catch((err) => {
        if (!active) return;
        setError(err?.message || 'Unable to load jobs.');
      })
      .finally(() => {
        if (!active) return;
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const getStatusBadge = (status) => {
    switch ((status || '').toUpperCase()) {
      case 'OPEN':
      case 'ACTIVE':
        return <Badge variant="success">Active</Badge>;
      case 'COMPLETED':
        return <Badge variant="info">Completed</Badge>;
      case 'DRAFT':
        return <Badge variant="default">Draft</Badge>;
      case 'ARCHIVED':
        return <Badge variant="warning">Archived</Badge>;
      default:
        return <Badge variant="default">{status || 'Unknown'}</Badge>;
    }
  };

  const formatBudget = (job) => {
    if (job.budgetMin != null && job.budgetMax != null) {
      const min = Number(job.budgetMin).toLocaleString();
      const max = Number(job.budgetMax).toLocaleString();
      return `${job.currency || 'KES'} ${min} - ${max}`;
    }
    if (job.price != null) {
      return `${job.currency || 'KES'} ${Number(job.price).toLocaleString()}`;
    }
    return job.budget || 'N/A';
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesStatus = filter === 'All' || (job.status || '').toUpperCase() === filter.toUpperCase();
    const query = searchTerm.toLowerCase();
    const matchesSearch = [job.title, job.category, job.clientName, job.description]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(query);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#222222]">My Jobs</h1>
          <p className="text-text-secondary mt-1">Manage the jobs you have posted.</p>
        </div>
        <Button variant="primary">Post New Job</Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg border border-border shadow-sm">
        <div className="flex space-x-1 overflow-x-auto w-full md:w-auto custom-scrollbar pb-1 md:pb-0">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                filter === option ? 'bg-success/20 text-[#e63946]' : 'text-text-secondary hover:bg-light-gray'
              }`}
            >
              {option === 'OPEN' ? 'Active' : option.charAt(0) + option.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <div className="w-full md:w-64">
          <Input
            placeholder="Search jobs..."
            icon={<Search size={16} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-0"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-lg border border-zinc-200 bg-zinc-100 p-8 text-center text-zinc-500 animate-pulse">
          Loading jobs...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-border">
              <p className="text-text-secondary">No jobs found matching your criteria.</p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <Card key={job.id} hover className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6">
                <div className="mb-4 sm:mb-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-bold text-[#222222]">{job.title}</h3>
                    {getStatusBadge(job.status)}
                  </div>
                  <div className="flex flex-wrap text-sm text-text-secondary gap-y-2">
                    <span className="mr-4"><strong>Category:</strong> {job.category || job.categoryId || 'N/A'}</span>
                    <span className="mr-4"><strong>Budget:</strong> {formatBudget(job)}</span>
                    <span className="mr-4"><strong>Posted:</strong> {job.postedAt ? new Date(job.postedAt).toLocaleDateString() : 'Unknown'}</span>
                    <span><strong>Applicants:</strong> {job.proposalsCount ?? job.applicants ?? 0}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                  <Button variant="ghost" size="sm" icon={<Eye size={16} />}>View</Button>
                  <Button variant="ghost" size="sm" icon={<Edit size={16} />}>Edit</Button>
                  <Button variant="ghost" size="sm" className="text-error hover:text-error hover:bg-red-50" icon={<Trash2 size={16} />}></Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MyJobs;

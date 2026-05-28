// @ts-nocheck
import React, { useState } from 'react';
import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Search, Edit, Trash2, Eye } from 'lucide-react';



const mockJobs: Job[] = [
  { id: '1', title: 'Senior Frontend Developer Needed', category: 'Web Development', budget: '$5,000 - $8,000', status: 'Active', postedDate: '2025-05-20', applicants: 12 },
  { id: '2', title: 'UI/UX Designer for Mobile App', category: 'Design', budget: '$2,500', status: 'Active', postedDate: '2025-05-18', applicants: 34 },
  { id: '3', title: 'Database Migration Expert', category: 'Database', budget: '$1,000', status: 'Completed', postedDate: '2025-04-10', applicants: 5 },
  { id: '4', title: 'SEO Optimization for E-commerce', category: 'Marketing', budget: '$500', status: 'Draft', postedDate: '2025-05-25', applicants: 0 },
];

export const MyJobs = () => {
  const [filter, setFilter] = useState<'All' | 'Active' | 'Draft' | 'Completed' | 'Archived'>('All');
  
  const filteredJobs = mockJobs.filter(job => filter === 'All' || job.status === filter);

  const getStatusBadge = (status: Job['status']) => {
    switch (status) {
      case 'Active': return <Badge variant="success">Active</Badge>;
      case 'Completed': return <Badge variant="info">Completed</Badge>;
      case 'Draft': return <Badge variant="default">Draft</Badge>;
      case 'Archived': return <Badge variant="warning">Archived</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">My Jobs</h1>
          <p className="text-text-secondary mt-1">Manage the jobs you have posted.</p>
        </div>
        <Button variant="primary">Post New Job</Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg border border-border shadow-sm">
        <div className="flex space-x-1 overflow-x-auto w-full md:w-auto custom-scrollbar pb-1 md:pb-0">
          {['All', 'Active', 'Draft', 'Completed', 'Archived'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                filter === f ? 'bg-accent-purple/20 text-accent-red' : 'text-text-secondary hover:bg-light-gray'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        
        <div className="w-full md:w-64">
          <Input 
            placeholder="Search jobs..." 
            icon={<Search size={16} />} 
            className="mb-0" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-border">
            <p className="text-text-secondary">No jobs found matching your criteria.</p>
          </div>
        ) : (
          filteredJobs.map(job => (
            <Card key={job.id} hover className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6">
              <div className="mb-4 sm:mb-0">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-bold text-navy">{job.title}</h3>
                  {getStatusBadge(job.status)}
                </div>
                <div className="flex flex-wrap text-sm text-text-secondary gap-y-2">
                  <span className="mr-4"><strong>Category:</strong> {job.category}</span>
                  <span className="mr-4"><strong>Budget:</strong> {job.budget}</span>
                  <span className="mr-4"><strong>Posted:</strong> {job.postedDate}</span>
                  <span><strong>Applicants:</strong> {job.applicants}</span>
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
    </div>
  );
};

export default MyJobs;

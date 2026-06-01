// @ts-nocheck
import React from 'react';
import { Card } from '../../../components/common/Card';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { Select } from '../../../components/common/Select';

export const PostJob = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#222222]">Post a Job</h1>
        <p className="text-text-secondary mt-1">Fill out the form below to post a new job to the marketplace.</p>
      </div>

      <Card>
        <form className="space-y-6 max-w-3xl">
          <Input 
            label="Job Title" 
            placeholder="e.g. Senior React Developer Needed"
            required 
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select 
              label="Category" 
              options={[
                { label: 'Web Development', value: 'web' },
                { label: 'Mobile Development', value: 'mobile' },
                { label: 'Design', value: 'design' },
                { label: 'Marketing', value: 'marketing' },
              ]}
              required
            />
            
            <Select 
              label="Duration" 
              options={[
                { label: 'Ongoing', value: 'ongoing' },
                { label: '1 Week', value: '1w' },
                { label: '1 Month', value: '1m' },
                { label: '3 Months', value: '3m' },
                { label: '6 Months+', value: '6m' },
              ]}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select 
              label="Budget Type" 
              options={[
                { label: 'Fixed Price', value: 'fixed' },
                { label: 'Hourly Rate', value: 'hourly' },
              ]}
              required
            />
            <Input 
              label="Budget ($)" 
              type="number"
              placeholder="e.g. 5000"
              required 
            />
          </div>

          <div className="flex flex-col mb-4">
            <label className="mb-1 text-sm font-semibold text-text-primary">
              Job Description <span className="text-[#e63946]">*</span>
            </label>
            <textarea 
              className="w-full rounded-md border border-border bg-white px-4 py-3 text-sm transition-colors focus:border-[#e63946] focus:outline-none focus:ring-1 focus:ring-[#e63946] custom-scrollbar min-h-[200px] resize-y"
              placeholder="Describe the project details, requirements, and deliverables..."
              required
            />
          </div>

          <Input 
            label="Skills Required" 
            placeholder="e.g. React, TypeScript, TailwindCSS (comma separated)"
            required 
          />

          <div className="pt-4 flex justify-end space-x-3 border-t border-border">
            <Button variant="outline">Save as Draft</Button>
            <Button variant="primary">Publish Job</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PostJob;

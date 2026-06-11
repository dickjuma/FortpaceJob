// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/common/Card';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { Select } from '../../../components/common/Select';
import { marketplaceAPI, publicAPI } from '../../../common/services/api';

export const PostJob = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState('ongoing');
  const [budgetType, setBudgetType] = useState('fixed');
  const [budget, setBudget] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let active = true;
    publicAPI.getCategoryTree()
      .then((res) => {
        if (!active) return;
        const tree = Array.isArray(res?.tree) ? res.tree : [];
        const flat = [];
        const flatten = (nodes) => {
          for (const node of nodes) {
            flat.push({ label: node.name, value: node.slug || node.id });
            if (node.children) flatten(node.children);
          }
        };
        flatten(tree);
        setCategories(flat.length ? flat : [{ label: 'General', value: 'general' }]);
      })
      .catch(() => {
        if (!active) return;
        setCategories([{ label: 'General', value: 'general' }]);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (event, status = 'OPEN') => {
    event.preventDefault();
    setError(null);
    setSuccessMessage('');

    if (!title || !category || !description || !budget) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const jobPayload = {
        title,
        category,
        duration,
        budgetType,
        budget,
        budgetMin: budgetType === 'fixed' ? Number(budget) : Number(budgetMin) || Number(budget),
        budgetMax: budgetType === 'fixed' ? Number(budget) : Number(budgetMax) || Number(budget),
        description,
        skills: skills.split(',').map((skill) => skill.trim()).filter(Boolean),
        status,
      };
      await marketplaceAPI.createJob(jobPayload);
      setSuccessMessage(`Job ${status === 'DRAFT' ? 'saved as draft' : 'published'} successfully.`);
      setTitle('');
      setCategory('');
      setDuration('ongoing');
      setBudgetType('fixed');
      setBudget('');
      setBudgetMin('');
      setBudgetMax('');
      setDescription('');
      setSkills('');
    } catch (err) {
      setError(err?.message || 'Unable to create job.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#222222]">Post a Job</h1>
        <p className="text-text-secondary mt-1">Fill out the form below to post a new job to the marketplace.</p>
      </div>

      <Card>
        <form className="space-y-6 max-w-3xl" onSubmit={(event) => handleSubmit(event, 'OPEN')}>
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              {successMessage}
            </div>
          )}

          <Input
            label="Job Title"
            placeholder="e.g. Senior React Developer Needed"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Category"
              options={categories.length ? categories : [{ label: 'Loading categories...', value: '' }]}
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              disabled={isLoading}
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
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
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
              value={budgetType}
              onChange={(event) => setBudgetType(event.target.value)}
              required
            />
            <Input
              label="Budget ($)"
              type="number"
              placeholder="e.g. 5000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <Input
            label="Skills Required"
            placeholder="e.g. React, TypeScript, TailwindCSS (comma separated)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            required
          />

          <div className="pt-4 flex justify-end space-x-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={(event) => handleSubmit(event, 'DRAFT')}
            >
              {isSubmitting ? 'Saving...' : 'Save as Draft'}
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Publishing...' : 'Publish Job'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PostJob;

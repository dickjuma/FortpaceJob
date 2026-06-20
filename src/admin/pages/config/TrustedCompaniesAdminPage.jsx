import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTrustedCompanies, updateTrustedCompanies } from '../../api/settings.api';
import { Plus, Trash2, Building, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TrustedCompaniesAdminPage() {
  const queryClient = useQueryClient();
  const [localCompanies, setLocalCompanies] = useState(null);

  const { data: serverCompanies, isLoading } = useQuery({
    queryKey: ['admin-trusted-companies'],
    queryFn: getTrustedCompanies,
    onSuccess: (data) => {
      if (!localCompanies) setLocalCompanies(data || []);
    }
  });

  const companies = localCompanies !== null ? localCompanies : (serverCompanies || []);

  const saveMutation = useMutation({
    mutationFn: updateTrustedCompanies,
    onSuccess: () => {
      toast.success('Trusted companies updated successfully');
      queryClient.invalidateQueries(['admin-trusted-companies']);
      queryClient.invalidateQueries(['trusted-clients']); // Also invalidate public hook
    },
    onError: (err) => {
      toast.error('Failed to save: ' + err.message);
    }
  });

  const handleAdd = () => {
    setLocalCompanies([...companies, { name: '', url: '' }]);
  };

  const handleRemove = (index) => {
    const newCompanies = [...companies];
    newCompanies.splice(index, 1);
    setLocalCompanies(newCompanies);
  };

  const handleChange = (index, field, value) => {
    const newCompanies = [...companies];
    newCompanies[index][field] = value;
    setLocalCompanies(newCompanies);
  };

  const handleSave = () => {
    // Basic validation
    const valid = companies.filter(c => c.name.trim() && c.url.trim());
    saveMutation.mutate(valid);
  };

  if (isLoading) return <div className="p-8 animate-pulse bg-zinc-100 h-96 rounded-xl m-6"></div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
            <Building className="w-6 h-6 text-emerald-600" />
            Trusted Companies
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manage the partner logos displayed on the homepage. If empty, the platform defaults to high-spending clients.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saveMutation.isLoading}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saveMutation.isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-zinc-200 bg-zinc-50 flex justify-between items-center">
          <h2 className="font-semibold text-zinc-800">Company Logos</h2>
          <button
            onClick={handleAdd}
            className="text-emerald-600 text-sm font-medium hover:text-emerald-700 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Company
          </button>
        </div>

        <div className="divide-y divide-zinc-100">
          {companies.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">
              No manual companies defined. The homepage is currently auto-generating these from top clients.
            </div>
          ) : (
            companies.map((company, index) => (
              <div key={index} className="p-4 flex items-start gap-4 hover:bg-zinc-50 transition">
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={company.name}
                      onChange={(e) => handleChange(index, 'name', e.target.value)}
                      placeholder="e.g. Google, Shopify"
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Logo Image URL</label>
                    <input
                      type="text"
                      value={company.url}
                      onChange={(e) => handleChange(index, 'url', e.target.value)}
                      placeholder="https://example.com/logo.svg"
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div className="w-32 h-32 border border-zinc-200 rounded-lg bg-zinc-50 flex items-center justify-center p-4 shrink-0 overflow-hidden relative group">
                  {company.url ? (
                    <img 
                      src={company.url} 
                      alt="Preview" 
                      className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Invalid+URL'; }}
                    />
                  ) : (
                    <span className="text-xs text-zinc-400">Preview</span>
                  )}
                </div>

                <button
                  onClick={() => handleRemove(index)}
                  className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition mt-6"
                  title="Remove"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

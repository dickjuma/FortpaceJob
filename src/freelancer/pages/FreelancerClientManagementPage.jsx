// src/pages/freelancer/FreelancerClientManagementPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, TrendingUp, Search, Filter,
  MessageSquare, Star, Edit3, Tag, Building2,
  Clock, DollarSign, Check
} from 'lucide-react';
import { useFreelancerContracts } from '../services/freelancerHooks';

const FALLBACK_AVATAR = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop';

const formatDateLabel = (dateString) => {
  if (!dateString) return 'Unknown';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};

const getClientTags = (contract) => {
  const tags = [];
  const status = String(contract.status || '').toLowerCase();
  if (status.includes('active') || status.includes('in progress')) tags.push('Active');
  if (status.includes('pending')) tags.push('Pending');
  if ((contract.totalAmount || contract.totalEscrow || contract.amount || 0) >= 5000) tags.push('High value');
  if ((contract.totalAmount || contract.totalEscrow || contract.amount || 0) <= 1000) tags.push('Quick win');
  return tags;
};

export default function FreelancerClientManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showSuccess, setShowSuccess] = useState(null);

  const { data, isLoading } = useFreelancerContracts({ limit: 50 });
  const contracts = data?.items || [];

  const clients = useMemo(() => {
    const map = new Map();

    contracts.forEach((contract) => {
      const client = contract.client || {};
      const clientId = client.id || contract.clientId || client.name || contract.clientName || `client-${contract.id}`;
      const name = client.name || client.clientName || contract.clientName || 'Client';
      const company = client.companyName || client.company || contract.clientCompany || name;
      const avatar = client.avatar || client.profile?.avatar || FALLBACK_AVATAR;
      const lastActivity = formatDateLabel(contract.updatedAt || contract.createdAt || contract.completedAt);
      const revenue = contract.totalAmount || contract.totalEscrow || contract.amount || 0;
      const tags = getClientTags(contract);

      const existing = map.get(clientId) || {
        id: clientId,
        name,
        company,
        avatar,
        totalRevenue: 0,
        contracts: 0,
        lastActivity,
        satisfaction: 4.9,
        tags: [],
        notes: `Recent contract: ${contract.title || 'Project'}`
      };

      existing.totalRevenue += revenue;
      existing.contracts += 1;
      existing.lastActivity = lastActivity;
      existing.company = company;
      existing.avatar = existing.avatar || avatar;
      existing.tags = Array.from(new Set([...existing.tags, ...tags])).slice(0, 3);
      map.set(clientId, existing);
    });

    return Array.from(map.values()).sort((a, b) => b.totalRevenue - a.totalRevenue);
  }, [contracts]);

  useEffect(() => {
    if (!selectedClient && clients.length > 0) {
      setSelectedClient(clients[0]);
    }
  }, [clients, selectedClient]);

  const totalClients = clients.length;
  const repeatRate = totalClients ? Math.round((clients.filter(client => client.contracts > 1).length / totalClients) * 100) : 0;
  const avgLtv = totalClients ? Math.round(clients.reduce((sum, client) => sum + client.totalRevenue, 0) / totalClients) : 0;

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleMessage = (clientName) => {
    setShowSuccess({ message: `Opening conversation with ${clientName}` });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const handleEditNote = () => {
    setShowSuccess({ message: 'Edit note feature would open here' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const handleAddTag = () => {
    setShowSuccess({ message: 'Add tag feature would open here' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="min-h-screen bg-surface-soft pb-16"
    >
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 bg-accent-dark text-white px-4 py-3 rounded-lg shadow-md font-body text-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            {showSuccess.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-accent-light rounded-xl">
              <Users className="w-6 h-6 text-accent DEFAULT" />
            </div>
            <h1 className="font-display font-bold text-3xl text-brand-900">Client CRM</h1>
          </div>
          <p className="text-ink-secondary font-body">Manage relationships, track revenue, and grow repeat business</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white border border-border rounded-2xl p-5 shadow-sm"
          >
            <p className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1">
              Total clients
            </p>
            <h3 className="font-mono font-semibold text-3xl text-ink-primary">124</h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-border rounded-2xl p-5 shadow-sm"
          >
            <p className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1">
              Repeat rate
            </p>
            <h3 className="font-mono font-semibold text-3xl text-ink-primary">42%</h3>
            <p className="text-xs font-body font-semibold text-accent DEFAULT mt-1">+4% this month</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white border border-border rounded-2xl p-5 shadow-sm"
          >
            <p className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1">
              Avg client value (LTV)
            </p>
            <h3 className="font-mono font-semibold text-3xl text-ink-primary">KES 3,450</h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-brand-900 to-brand-800 rounded-2xl p-5 shadow-sm text-white"
          >
            <h3 className="font-body font-semibold mb-1 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent-light" /> Top client
            </h3>
            <p className="font-display font-bold text-xl mb-1">Sarah Mitchell</p>
            <p className="text-sm font-body text-white/80">KES 12,450 lifetime</p>
          </motion.div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Client List */}
          <div className="flex-1 space-y-4">

            {/* Search Bar */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-ink-tertiary absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search clients by name, company, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 h-10 bg-white border border-border rounded-lg text-ink-primary text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                />
              </div>
              <button className="px-4 h-10 bg-white border border-border rounded-lg text-sm font-body font-medium text-ink-primary hover:bg-surface-muted transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-900">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>

            {/* Client Table */}
            <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-muted">
                    <tr className="border-b border-border">
                      <th className="py-3 px-5 text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide">Client</th>
                      <th className="py-3 px-5 text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide">Revenue</th>
                      <th className="py-3 px-5 text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide">Rating</th>
                      <th className="py-3 px-5 text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide hidden md:table-cell">Tags</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredClients.map((client, idx) => (
                      <motion.tr
                        key={client.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => setSelectedClient(client)}
                        className={`cursor-pointer transition-colors hover:bg-surface-soft ${
                          selectedClient?.id === client.id ? 'bg-accent-light' : ''
                        }`}
                      >
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <img
                              src={client.avatar}
                              alt={client.name}
                              className="w-10 h-10 rounded-full object-cover"
                              width={40}
                              height={40}
                            />
                            <div>
                              <p className="text-sm font-body font-semibold text-ink-primary">{client.name}</p>
                              <p className="text-xs font-body text-ink-tertiary flex items-center gap-1">
                                <Building2 className="w-3 h-3" /> {client.company}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          <p className="text-sm font-mono font-semibold text-ink-primary">KES {client.totalRevenue.toLocaleString()}</p>
                          <p className="text-xs font-body text-ink-tertiary">{client.contracts} contracts</p>
                        </td>
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-accent DEFAULT fill-accent DEFAULT" />
                            <span className="text-sm font-body font-semibold text-ink-primary">{client.satisfaction}</span>
                          </div>
                        </td>
                        <td className="py-4 px-5 hidden md:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {client.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="text-xs font-body font-medium px-2 py-0.5 bg-surface-muted text-ink-secondary rounded-md border border-border">
                                {tag}
                              </span>
                            ))}
                            {client.tags.length > 2 && (
                              <span className="text-xs font-body font-medium px-2 py-0.5 text-ink-tertiary">
                                +{client.tags.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Panel: Client Details */}
          <AnimatePresence mode="wait">
            {selectedClient && (
              <motion.div
                key={selectedClient.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="w-full lg:w-96 shrink-0"
              >
                <div className="sticky top-8 bg-white border border-border rounded-2xl shadow-lg overflow-hidden flex flex-col max-h-[calc(100vh-8rem)]">

                  {/* Header */}
                  <div className="p-5 border-b border-border bg-surface-soft">
                    <div className="flex justify-between items-start mb-4">
                      <img
                        src={selectedClient.avatar}
                        alt={selectedClient.name}
                        className="w-14 h-14 rounded-xl object-cover shadow-sm"
                        width={56}
                        height={56}
                      />
                      <button
                        onClick={() => handleMessage(selectedClient.name)}
                        className="p-2 text-ink-tertiary hover:text-accent DEFAULT bg-white rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-900"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                    <h2 className="font-body font-semibold text-xl text-ink-primary">{selectedClient.name}</h2>
                    <p className="text-sm font-body text-ink-secondary mb-3">{selectedClient.company}</p>

                    <div className="flex flex-wrap gap-2">
                      {selectedClient.tags.map(tag => (
                        <span key={tag} className="text-xs font-body font-medium px-2 py-1 bg-surface-muted text-ink-secondary rounded-md border border-border flex items-center gap-1">
                          <Tag className="w-3 h-3" /> {tag}
                        </span>
                      ))}
                      <button
                        onClick={handleAddTag}
                        className="text-xs font-body font-medium px-2 py-1 border border-dashed border-border text-ink-tertiary hover:text-accent DEFAULT hover:border-accent DEFAULT rounded-md transition-colors"
                      >
                        + Add tag
                      </button>
                    </div>
                  </div>

                  {/* Scrollable Body */}
                  <div className="p-5 flex-1 overflow-y-auto space-y-5">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-surface-soft rounded-xl border border-border">
                        <p className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1">LTV</p>
                        <p className="text-base font-mono font-semibold text-ink-primary flex items-center gap-1">
                          KES {selectedClient.totalRevenue.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-3 bg-surface-soft rounded-xl border border-border">
                        <p className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1">Last active</p>
                        <p className="text-base font-body font-semibold text-ink-primary flex items-center gap-1">
                          <Clock className="w-4 h-4 text-accent DEFAULT" />
                          {selectedClient.lastActivity}
                        </p>
                      </div>
                    </div>

                    {/* Private Notes */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-body font-semibold text-ink-primary flex items-center gap-2">
                          <Edit3 className="w-4 h-4 text-accent DEFAULT" /> Private notes
                        </h3>
                        <button
                          onClick={handleEditNote}
                          className="text-xs font-body font-medium text-accent DEFAULT hover:text-accent-dark transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="p-4 bg-accent-light/30 border border-accent DEFAULT/20 rounded-xl">
                        <p className="text-sm font-body text-ink-primary italic">"{selectedClient.notes}"</p>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div>
                      <h3 className="text-sm font-body font-semibold text-ink-primary mb-4">Relationship timeline</h3>
                      <div className="space-y-4 relative before:absolute before:left-2.5 before:top-0 before:bottom-0 before:w-0.5 before:bg-border">

                        <div className="relative flex gap-3">
                          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-accent DEFAULT border-2 border-white shadow-sm z-10 flex-shrink-0" />
                          <div className="flex-1 p-3 rounded-xl border border-border bg-white shadow-sm">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-body font-semibold text-xs text-ink-primary">Order completed</span>
                            </div>
                            <div className="text-xs font-mono text-ink-tertiary mb-1">2 days ago</div>
                            <div className="text-xs font-body text-ink-secondary">KES 1,200 · 5 stars</div>
                          </div>
                        </div>

                        <div className="relative flex gap-3">
                          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-border border-2 border-white z-10 flex-shrink-0" />
                          <div className="flex-1 p-3 rounded-xl border border-border bg-white shadow-sm">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-body font-semibold text-xs text-ink-primary">First contact</span>
                            </div>
                            <div className="text-xs font-mono text-ink-tertiary">Mar 12, 2025</div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

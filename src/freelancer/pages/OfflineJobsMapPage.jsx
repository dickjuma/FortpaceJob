// src/pages/freelancer/OfflineJobsMapPage.jsx
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Star, Laptop, DollarSign, Clock, X, Navigation, Award, Briefcase, Eye, ChevronRight, SlidersHorizontal, Search, Check
} from 'lucide-react';
import { useGetJobs } from '../services/freelancerHooks';

export default function OfflineJobsMapPage() {
  const { data: response, isLoading } = useGetJobs({ type: 'offline' });
  const apiJobs = response?.data || response || [];

  const [selectedPin, setSelectedPin] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [maxDistance, setMaxDistance] = useState(5.0);
  const [showSuccess, setShowSuccess] = useState(null);

  const fallbackPins = [
    { id: 1, title: 'Server Room Configuration', x: '35%', y: '42%', client: 'Apex Holdings', distance: 1.2, budget: 1500, type: 'Fixed Price', duration: '2 days' },
    { id: 2, title: 'On-site Commercial Photography', x: '65%', y: '30%', client: 'Cloudfront Media', distance: 3.4, budget: 2800, type: 'Fixed Price', duration: '3 days' },
    { id: 3, title: 'Cybersecurity System Hardening', x: '48%', y: '68%', client: 'Bay Area Cyberlabs', distance: 0.5, budget: 140, type: 'Hourly Rate', duration: '15 hours' },
    { id: 4, title: 'Retail LAN Network Deployment', x: '20%', y: '72%', client: 'Downtown Retailers', distance: 6.8, budget: 3200, type: 'Fixed Price', duration: '5 days' },
    { id: 5, title: 'Fibre Optic Splice Inspection', x: '80%', y: '50%', client: 'Symmetric Telecom', distance: 8.5, budget: 450, type: 'Hourly Rate', duration: '5 hours' }
  ];

  const mapPins = apiJobs.length > 0 ? apiJobs : fallbackPins;

  const filteredPins = useMemo(() => {
    return mapPins.filter(pin => {
      const matchesSearch = pin.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            pin.client.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDistance = pin.distance <= maxDistance;
      return matchesSearch && matchesDistance;
    });
  }, [searchQuery, maxDistance]);

  const handleApply = (title) => {
    setShowSuccess({ message: `Applied to "${title}"` });
    setTimeout(() => setShowSuccess(null), 2000);
    setSelectedPin(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-accent-light rounded-xl">
              <Navigation className="w-6 h-6 text-accent DEFAULT" />
            </div>
            <h1 className="font-display font-bold text-3xl text-brand-900">Offline contracts map</h1>
          </div>
          <p className="text-ink-secondary font-body">Browse in-person job vacancies mapped by distance</p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
          <input
            type="text"
            placeholder="Search keywords or client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 h-10 bg-white border border-border rounded-lg text-sm font-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900"
          />
        </div>

        <div className="md:col-span-2 flex items-center gap-3 bg-white border border-border p-2 rounded-lg">
          <SlidersHorizontal className="w-4 h-4 text-accent DEFAULT shrink-0" />
          <div className="flex-1 flex items-center gap-3">
            <span className="text-xs font-body font-medium text-ink-tertiary">Radius:</span>
            <input
              type="range"
              min="0.5"
              max="10.0"
              step="0.5"
              value={maxDistance}
              onChange={(e) => setMaxDistance(parseFloat(e.target.value))}
              className="flex-1 h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-accent DEFAULT"
            />
            <span className="text-xs font-mono font-semibold text-accent DEFAULT shrink-0 min-w-[50px] text-right">
              {maxDistance.toFixed(1)} miles
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[550px]">

        {/* Map Area */}
        <div className="lg:col-span-2 relative rounded-xl overflow-hidden border border-border bg-brand-900 shadow-sm">
          {/* Map Grid Background */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />
          <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
          <div className="absolute w-80 h-80 bg-accent-light/20 blur-[100px] rounded-full pointer-events-none" />

          {/* Pins */}
          {filteredPins.map(pin => (
            <button
              key={pin.id}
              onClick={() => setSelectedPin(pin)}
              className={`absolute p-2 rounded-full shadow-md border-2 transition-all z-20 group ${
                selectedPin?.id === pin.id
                  ? "bg-white border-accent DEFAULT"
                  : "bg-accent DEFAULT border-white hover:scale-110"
              }`}
              style={{ left: pin.x, top: pin.y }}
            >
              <MapPin className={`w-4 h-4 ${selectedPin?.id === pin.id ? "text-accent DEFAULT" : "text-white"}`} />
              <span className="absolute left-1/2 transform -translate-x-1/2 -top-8 bg-ink-primary text-white text-xs font-body font-medium px-2 py-0.5 rounded shadow-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                KES {pin.budget.toLocaleString()} ({pin.distance}mi)
              </span>
            </button>
          ))}

          <div className="absolute bottom-3 left-3 bg-ink-primary/80 border border-white/10 px-3 py-1 rounded-lg text-xs font-body font-medium text-white/80 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-light animate-pulse" />
            {filteredPins.length} jobs found
          </div>
        </div>

        {/* Selected Job Details */}
        <div className="lg:col-span-1">
          {selectedPin ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-border rounded-xl p-5 shadow-sm h-full flex flex-col"
            >
              <div className="flex justify-between items-start mb-4 pb-3 border-b border-border">
                <div>
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-body font-medium bg-accent-light text-accent-dark">
                    {selectedPin.distance} miles away
                  </span>
                  <h3 className="font-body font-semibold text-base text-ink-primary mt-2">{selectedPin.title}</h3>
                  <p className="text-sm text-ink-secondary">Client: {selectedPin.client}</p>
                </div>
                <button onClick={() => setSelectedPin(null)} className="p-1 text-ink-tertiary hover:text-ink-primary rounded transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-sm font-body text-ink-secondary mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent DEFAULT" />
                  <span>Duration: {selectedPin.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-accent DEFAULT" />
                  <span>Budget: KES {selectedPin.budget.toLocaleString()} ({selectedPin.type})</span>
                </div>
              </div>

              <button
                onClick={() => handleApply(selectedPin.title)}
                className="w-full py-2.5 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-sm transition-colors mt-auto"
              >
                Apply on-site
              </button>
            </motion.div>
          ) : (
            <div className="bg-white border border-border rounded-xl p-8 shadow-sm h-full flex flex-col items-center justify-center text-center">
              <Navigation className="w-12 h-12 text-ink-tertiary mb-3" />
              <h4 className="font-body font-semibold text-base text-ink-primary mb-1">Select a job</h4>
              <p className="text-sm text-ink-secondary">Click on any map marker to view job details</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

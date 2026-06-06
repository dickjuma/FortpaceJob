// src/pages/freelancer/GigPreviewPage.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Clock, RefreshCw, CheckCircle2, ChevronRight,
  Smartphone, Monitor, Eye, Pencil, Send, Check
} from 'lucide-react';
import { useFreelancerGigById } from '../services/freelancerHooks';

export default function GigPreviewPage() {
  const { gigId } = useParams();
  const { data: gigData, isLoading: loadingGig, error: gigError } = useFreelancerGigById(gigId);
  const [device, setDevice] = useState('desktop');
  const [activeTab, setActiveTab] = useState('standard');
  const [showSuccess, setShowSuccess] = useState(null);

  const gig = gigData?.gig ?? gigData?.data ?? gigData;

  if (loadingGig) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent DEFAULT border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (gigError) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-center">
        <p className="text-ink-secondary">Unable to load gig preview.</p>
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-center">
        <p className="text-ink-secondary">Unable to load gig preview.</p>
      </div>
    );
  }

  const handlePublish = () => {
    setShowSuccess({ message: 'Gig published successfully!' });
    setTimeout(() => setShowSuccess(null), 3000);
  };

  const handleEditDetails = () => {
    setShowSuccess({ message: 'Opening edit mode' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  return (
    <div className="min-h-screen bg-surface-soft font-body flex flex-col">

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

      {/* Top Action Bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-border px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-surface-muted p-1 rounded-lg">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-1.5 rounded-md transition-colors ${
                device === 'desktop'
                  ? "bg-white shadow-sm text-accent DEFAULT"
                  : "text-ink-tertiary hover:text-ink-primary"
              }`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-1.5 rounded-md transition-colors ${
                device === 'mobile'
                  ? "bg-white shadow-sm text-accent DEFAULT"
                  : "text-ink-tertiary hover:text-ink-primary"
              }`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
          <span className="text-sm font-body font-medium text-ink-tertiary flex items-center gap-1.5">
            <Eye className="w-4 h-4" /> Preview mode
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleEditDetails}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-body font-medium text-ink-primary hover:bg-surface-muted rounded-lg transition-colors"
          >
            <Pencil className="w-4 h-4" /> Edit details
          </button>
          <button
            onClick={handlePublish}
            className="flex items-center gap-2 px-5 py-1.5 rounded-lg bg-brand-900 text-white hover:bg-brand-800 text-sm font-body font-medium transition-colors"
          >
            Publish gig <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex justify-center">

        {/* Device Frame */}
        <motion.div
          layout
          className={`bg-white border border-border shadow-xl overflow-hidden relative ${
            device === 'desktop'
              ? "w-full max-w-6xl rounded-xl"
              : "w-full max-w-[380px] rounded-3xl border-4 border-ink-primary min-h-[700px]"
          }`}
        >
          <div className="h-full overflow-y-auto">

            {/* Mock Header */}
            <div className="h-14 border-b border-border flex items-center justify-between px-5 bg-white sticky top-0 z-40">
              <span className="font-display font-bold text-lg text-brand-900">ForteSpace</span>
              <div className="hidden sm:flex items-center gap-4 text-sm font-body font-medium text-ink-tertiary">
                <span>Explore</span>
                <span>Messages</span>
                <div className="w-7 h-7 rounded-full bg-surface-muted" />
              </div>
            </div>

            {/* Breadcrumb */}
            <div className="px-5 py-3 text-xs font-body font-medium text-ink-tertiary flex items-center gap-1">
              <span>{gig.category}</span>
              <ChevronRight className="w-3 h-3" />
              <span>Web Programming</span>
            </div>

            {/* Main Content */}
            <div className={`p-5 flex gap-6 ${device === 'mobile' ? "flex-col" : "flex-row"}`}>

              {/* Left Column */}
              <div className={device === 'desktop' ? "flex-1" : "w-full"}>

                <h1 className={`font-display font-bold text-brand-900 mb-3 ${
                  device === 'desktop' ? "text-2xl leading-tight" : "text-xl"
                }`}>
                  {gig.title}
                </h1>
                  <div className="flex items-center gap-3 mb-5">
                  <img
                    src={gig.seller?.avatar}
                    alt={gig.seller?.name}
                    className="w-10 h-10 rounded-full object-cover"
                    width={40}
                    height={40}
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-body font-semibold text-sm text-ink-primary">{gig.seller?.name}</span>
                      <span className="text-xs font-body font-medium text-accent DEFAULT bg-accent-light px-2 py-0.5 rounded-md">
                        {gig.seller?.level}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm mt-0.5">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-accent DEFAULT text-accent DEFAULT" />
                        <span className="font-body font-semibold text-sm text-ink-primary">{gig.rating}</span>
                        <span className="text-xs text-ink-tertiary">({gig.reviews})</span>
                      </div>
                      <span className="text-ink-tertiary">|</span>
                      <span className="text-xs text-ink-tertiary">{gig.seller?.ordersInQueue} orders in queue</span>
                    </div>
                  </div>
                </div>

                {/* Gallery */}
                <div className="aspect-[16/9] rounded-xl overflow-hidden bg-surface-muted border border-border mb-6">
                  <img
                    src={gig.gallery?.[0]}
                    alt="Gig cover"
                    className="w-full h-full object-cover"
                    width={800}
                    height={450}
                  />
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h2 className="font-display font-semibold text-lg text-brand-900 mb-3">About this gig</h2>
                  <div className="text-ink-secondary text-sm leading-relaxed whitespace-pre-wrap font-body">
                    {gig.description}
                  </div>
                </div>
              </div>

              {/* Right Column - Pricing Panel */}
              <div className={device === 'desktop' ? "w-80 shrink-0" : "w-full"}>
                <div className="sticky top-20 bg-white border border-border rounded-xl overflow-hidden shadow-lg">

                  {/* Package Tabs */}
                  <div className="flex border-b border-border">
                    {['basic', 'standard', 'premium'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 text-xs font-body font-semibold uppercase tracking-wide transition-colors ${
                          activeTab === tab
                            ? "text-accent DEFAULT bg-white"
                            : "text-ink-tertiary hover:text-ink-primary bg-surface-soft"
                        }`}
                      >
                        {tab}
                        {activeTab === tab && (
                          <motion.div layoutId="preview-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent DEFAULT" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Package Content */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="p-4"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-body font-semibold text-ink-primary">
                          {gig.packages?.[activeTab]?.name}
                        </h3>
                        <span className="font-mono font-bold text-lg text-brand-900">
                          KES {gig.packages?.[activeTab]?.price}
                        </span>
                      </div>
                      <p className="text-xs text-ink-secondary mb-4">
                        {activeTab === 'basic' ? 'A simple single-page React app for landing pages.' :
                         activeTab === 'standard' ? 'A fully responsive multi-page web app with API integrations.' :
                         'A complete SaaS frontend solution with state management.'}
                      </p>

                      <div className="flex items-center gap-3 text-xs font-body text-ink-secondary mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {gig.packages?.[activeTab]?.delivery}
                        </div>
                        <div className="flex items-center gap-1">
                          <RefreshCw className="w-3.5 h-3.5" /> {gig.packages?.[activeTab]?.revisions}
                        </div>
                      </div>

                      <div className="space-y-2 mb-5">
                        {gig.packages?.[activeTab]?.features?.map((feat, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-accent DEFAULT" />
                            <span className="text-xs font-body text-ink-secondary">{feat}</span>
                          </div>
                        ))}
                      </div>

                      <button className="w-full py-2.5 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-sm transition-colors">
                        Continue (KES {gig.packages?.[activeTab]?.price})
                      </button>
                      <button className="w-full py-2 mt-2 rounded-lg border border-border text-ink-primary hover:bg-surface-muted font-body font-medium text-sm transition-colors">
                        Compare packages
                      </button>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

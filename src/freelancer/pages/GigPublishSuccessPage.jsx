// src/pages/freelancer/GigPublishSuccessPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2, Share2, Facebook, Twitter, Linkedin,
  Copy, ArrowRight, TrendingUp, Search, Eye, Sparkles, Check
} from 'lucide-react';

export default function GigPublishSuccessPage() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(null);
  const gigUrl = 'https://forte.com/gig/alexrivera/react-web-app';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(gigUrl);
    setCopied(true);
    setShowSuccess({ message: 'Link copied to clipboard' });
    setTimeout(() => {
      setCopied(false);
      setShowSuccess(null);
    }, 2000);
  };

  const handleShare = (platform) => {
    setShowSuccess({ message: `Share via ${platform} would open here` });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  return (
    <div className="min-h-screen bg-surface-soft flex items-center justify-center py-12 px-4 sm:px-6 relative overflow-hidden">

      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-light/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent-light/30 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-5xl w-full z-10 flex flex-col md:flex-row gap-8 items-stretch">

        {/* Main Success Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="flex-1 bg-white rounded-3xl p-8 shadow-lg border border-border text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-5 pointer-events-none opacity-10">
            <Sparkles className="w-24 h-24 text-accent DEFAULT" />
          </div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-6 shadow-md"
          >
            <CheckCircle2 className="w-10 h-10 text-accent DEFAULT" />
          </motion.div>

          <h1 className="font-display font-bold text-3xl sm:text-4xl text-brand-900 mb-3">
            Gig published successfully!
          </h1>
          <p className="text-ink-secondary font-body max-w-sm mx-auto mb-8 leading-relaxed">
            Your gig is now live and visible to thousands of buyers on the marketplace.
          </p>

          <div className="bg-surface-soft rounded-xl p-5 mb-6 border border-border">
            <h3 className="text-sm font-body font-semibold text-ink-primary mb-4">Share your gig to get your first order</h3>

            <div className="flex justify-center gap-3 mb-5">
              <button
                onClick={() => handleShare('Facebook')}
                className="w-10 h-10 rounded-full bg-accent-light text-accent DEFAULT flex items-center justify-center hover:bg-accent-light/80 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleShare('Twitter')}
                className="w-10 h-10 rounded-full bg-accent-light text-accent DEFAULT flex items-center justify-center hover:bg-accent-light/80 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleShare('LinkedIn')}
                className="w-10 h-10 rounded-full bg-accent-light text-accent DEFAULT flex items-center justify-center hover:bg-accent-light/80 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 bg-white p-1.5 rounded-lg border border-border">
              <div className="flex-1 truncate px-2 text-xs font-mono text-ink-tertiary">{gigUrl}</div>
              <button
                onClick={copyToClipboard}
                className={`px-3 py-1.5 rounded-md text-xs font-body font-medium transition-all flex items-center gap-1.5 ${
                  copied
                    ? "bg-accent-light text-accent-dark"
                    : "bg-surface-muted text-ink-primary hover:bg-surface-soft"
                }`}
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy link'}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <button
              onClick={() => navigate('/freelancer/gigs')}
              className="px-6 py-2.5 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-medium text-sm transition-colors inline-flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              View my gigs <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/freelancer/dashboard')}
              className="px-6 py-2.5 rounded-lg border border-border text-ink-primary hover:bg-surface-muted font-body font-medium text-sm transition-colors w-full sm:w-auto"
            >
              Go to dashboard
            </button>
          </div>
        </motion.div>

        {/* Sidebar Insights */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full md:w-72 shrink-0 space-y-5 flex flex-col justify-center"
        >
          {/* Visibility Card */}
          <div className="bg-white rounded-2xl p-5 border border-border shadow-sm">
            <h3 className="text-sm font-body font-semibold text-ink-primary mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4 text-accent DEFAULT" /> Marketplace visibility
            </h3>

            <div className="flex items-end gap-2 mb-2">
              <span className="font-mono font-bold text-3xl text-ink-primary">~450</span>
              <span className="text-xs font-body text-ink-tertiary mb-1">impressions / week</span>
            </div>

            <div className="h-1.5 w-full bg-border rounded-full overflow-hidden mb-3">
              <div className="w-[70%] h-full bg-accent DEFAULT rounded-full" />
            </div>
            <p className="text-xs text-ink-tertiary leading-relaxed font-body">
              Based on your gig's quality score. It may take up to 24 hours to fully index in search.
            </p>
          </div>

          {/* Quick Tips */}
          <div className="bg-gradient-to-br from-brand-900 to-brand-800 rounded-2xl p-5 text-white shadow-sm">
            <h3 className="text-sm font-body font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent-light" /> Get your first order
            </h3>

            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-mono font-bold text-accent-light">1</span>
                </div>
                <p className="text-xs text-white/80 leading-relaxed">Share your gig link on professional networks</p>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-mono font-bold text-accent-light">2</span>
                </div>
                <p className="text-xs text-white/80 leading-relaxed">Stay online — buyers filter by "online sellers"</p>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-mono font-bold text-accent-light">3</span>
                </div>
                <p className="text-xs text-white/80 leading-relaxed">Respond to messages within 1 hour</p>
              </li>
            </ul>
          </div>

          {/* Quick Stats */}
          <div className="bg-accent-light border border-accent DEFAULT rounded-2xl p-4">
            <h4 className="text-sm font-body font-semibold text-accent-dark mb-1">Pro tip</h4>
            <p className="text-xs text-accent-dark">
              Gigs with a video receive 200% more orders. Consider adding a video to your gallery.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

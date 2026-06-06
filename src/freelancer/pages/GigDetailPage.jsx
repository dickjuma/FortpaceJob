// src/pages/public/GigDetailPage.jsx
import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  Star, ChevronRight, ChevronLeft, Clock, RefreshCw,
  CheckCircle2, Heart, Share2, MessageSquare, ShieldCheck,
  ChevronDown, MessageCircle, Pencil, Check
} from 'lucide-react';
import { gigAPI } from '../../common/services/api';
// import { useSavedGigIds, useToggleSaveGig } from '../../common/hooks/useSavedGig';
const SAMPLE_GIG = {
  rating: 4.9,
  reviews: 128,
  ordersInQueue: 4,
  seller: {
    name: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    level: 'Top Rated Seller',
    memberSince: 'Oct 2021',
    avgResponse: '1 hour',
    lastDelivery: 'about 2 hours ago',
    location: 'United States',
    description: 'Senior Frontend Developer specializing in React, Next.js, and modern UI frameworks.'
  },
  gallery: [
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80',
    'https://images.unsplash.com/photo-1455390582262-044cdead27d8?w=1200&q=80'
  ],
  packages: {
    basic: { name: 'Basic App', price: 15000, delivery: '3 Days', revisions: '1 Revision', desc: 'A simple single-page React app.', features: ['1 Page', 'Responsive Design', 'Source Code'] },
    standard: { name: 'Standard App', price: 45000, delivery: '7 Days', revisions: '3 Revisions', desc: 'A fully responsive multi-page web app.', features: ['5 Pages', 'Responsive Design', 'API Integration', 'Source Code'] },
    premium: { name: 'Full SaaS', price: 120000, delivery: '14 Days', revisions: 'Unlimited', desc: 'A complete SaaS frontend solution.', features: ['10+ Pages', 'Responsive Design', 'Database Setup', 'API Integration', 'Source Code'] }
  },
  description: `Hi there! I am a senior React developer with 5+ years of experience. I specialize in building fast, accessible, and beautiful web applications.\n\nWhat you will get:\n- Clean, maintainable code\n- Fully responsive design\n- SEO optimization\n- Fast load times`,
  faqs: [
    { q: 'Do you provide the source code?', a: 'Yes, all packages include the full source code.' },
    { q: 'Can you work with my existing design?', a: 'Absolutely! I can convert your designs into pixel-perfect React code.' }
  ],
  reviewsList: [
    { name: 'Sarah M.', rating: 5, date: '2 weeks ago', country: 'United Kingdom', comment: 'Alex delivered a high-quality React application ahead of schedule.' },
    { name: 'David K.', rating: 5, date: '1 month ago', country: 'Canada', comment: 'Great communication and excellent technical skills.' }
  ]
};

export default function GigDetailPage() {
  const { gigId } = useParams();
  // Keep original hooks commented - preserve structure
  // const { data: savedGigIds } = useSavedGigIds();
  // const toggleSaveGig = useToggleSaveGig();
  // const isSaved = gigId && (savedGigIds?.has?.(gigId) || savedGigIds?.has?.(String(gigId)));

  const [activeTab, setActiveTab] = useState('standard');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [showSuccess, setShowSuccess] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  const { data: fetchedGig, isLoading, error } = useQuery({
    queryKey: ['gigDetail', gigId],
    queryFn: () => gigAPI.getGig(gigId),
    enabled: !!gigId,
    staleTime: 1000 * 60,
  });

  const GIG = fetchedGig?.gig ?? fetchedGig?.data ?? fetchedGig;

  const nextImage = () => setCurrentImageIndex(prev => (prev + 1) % (GIG?.gallery?.length || 1));
  const prevImage = () => setCurrentImageIndex(prev => (prev === 0 ? (GIG?.gallery?.length || 1) - 1 : prev - 1));

  const handleSave = () => {
    setIsSaved(!isSaved);
    setShowSuccess({ message: isSaved ? 'Removed from saved' : 'Saved to your list' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const handleShare = () => {
    setShowSuccess({ message: 'Link copied to clipboard' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const handleContact = () => {
    setShowSuccess({ message: 'Messaging thread would open' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const handleCheckout = () => {
    setShowSuccess({ message: 'Proceeding to checkout' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent DEFAULT border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-ink-secondary mb-4">Could not load this service</p>
        <Link to="/gigs" className="text-accent font-body font-medium hover:text-accent-dark">
          Back to services
        </Link>
      </div>
    );
  }

  if (!isLoading && !GIG) {
    return (
      <div className="py-16 text-center">
        <p className="text-ink-secondary mb-4">Service not found.</p>
        <Link to="/gigs" className="text-accent font-body font-medium hover:text-accent-dark">
          Back to services
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-16 lg:pb-0">

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

      {/* Breadcrumb */}
      <div className="border-b border-border bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between text-xs font-body font-medium text-ink-tertiary">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
            <Link to="/gigs" className="hover:text-ink-primary transition-colors">Services</Link>
            <ChevronRight className="w-3 h-3" />
            <span>{GIG.category}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-ink-primary">{GIG.subcategory}</span>
          </div>
          <div className="flex items-center gap-4 hidden sm:flex">
            <button
              onClick={handleSave}
              className={`flex items-center gap-1.5 transition-colors ${
                isSaved ? 'text-danger' : 'text-ink-tertiary hover:text-ink-primary'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-danger' : ''}`} />
              {isSaved ? 'Saved' : 'Save'}
            </button>
            <button onClick={handleShare} className="flex items-center gap-1.5 text-ink-tertiary hover:text-ink-primary transition-colors">
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-10">

        {/* Left Column */}
        <div className="flex-1 min-w-0 w-full space-y-10">

          {/* Header */}
          <section>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-brand-900 mb-5 leading-tight">
              {GIG.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-sm mb-6">
              <div className="flex items-center gap-2">
                <img
                  src={GIG.seller.avatar}
                  alt={GIG.seller.name}
                  className="w-8 h-8 rounded-full object-cover"
                  width={32}
                  height={32}
                />
                <span className="font-body font-semibold text-ink-primary">{GIG.seller.name}</span>
                <span className="text-xs font-body font-medium text-accent DEFAULT bg-accent-light px-2 py-0.5 rounded-md">
                  {GIG.seller.level}
                </span>
              </div>
              <div className="w-1 h-1 rounded-full bg-border" />
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-accent DEFAULT text-accent DEFAULT" />
                <span className="font-body font-semibold text-ink-primary">{GIG.rating}</span>
                <span className="text-ink-tertiary">({GIG.reviews})</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-border" />
              <span className="text-ink-tertiary font-body">{GIG.ordersInQueue} orders in queue</span>
            </div>

            {/* Gallery */}
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-surface-muted border border-border group">
              <img
                src={GIG.gallery[currentImageIndex]}
                alt="Gig media"
                className="w-full h-full object-cover"
                width={1200}
                height={675}
              />

              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all focus:outline-none focus:ring-2 focus:ring-brand-900"
              >
                <ChevronLeft className="w-5 h-5 text-ink-primary" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all focus:outline-none focus:ring-2 focus:ring-brand-900"
              >
                <ChevronRight className="w-5 h-5 text-ink-primary" />
              </button>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-1.5">
                {GIG.gallery.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      currentImageIndex === i ? "w-6 bg-white" : "w-1.5 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* About This Gig */}
          <section>
            <h2 className="font-display font-semibold text-xl text-brand-900 mb-4">About this gig</h2>
            <div className="text-ink-secondary font-body leading-relaxed whitespace-pre-wrap">
              {GIG.description}
            </div>
          </section>

          {/* About The Seller */}
          <section>
            <h2 className="font-display font-semibold text-xl text-brand-900 mb-4">About the seller</h2>
            <div className="bg-surface-soft rounded-2xl border border-border p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left mb-6">
                <img
                  src={GIG.seller.avatar}
                  alt={GIG.seller.name}
                  className="w-20 h-20 rounded-full border-2 border-white shadow-sm object-cover"
                  width={80}
                  height={80}
                />
                <div>
                  <h3 className="font-body font-semibold text-xl text-ink-primary">{GIG.seller.name}</h3>
                  <p className="text-accent DEFAULT font-body text-sm font-medium mb-2">{GIG.seller.level}</p>
                  <div className="flex items-center justify-center sm:justify-start gap-1 mb-4">
                    <Star className="w-4 h-4 fill-accent DEFAULT text-accent DEFAULT" />
                    <span className="font-body font-semibold text-ink-primary">{GIG.rating}</span>
                    <span className="text-ink-tertiary text-sm">({GIG.reviews} reviews)</span>
                  </div>
                  <button
                    onClick={handleContact}
                    className="px-5 py-2 rounded-lg border-2 border-brand-900 text-brand-900 hover:bg-brand-900 hover:text-white font-body font-medium text-sm transition-colors"
                  >
                    Contact me
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-white rounded-xl border border-border mb-5">
                <div>
                  <p className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1">From</p>
                  <p className="text-sm font-body font-semibold text-ink-primary">{GIG.seller.location}</p>
                </div>
                <div>
                  <p className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1">Member since</p>
                  <p className="text-sm font-body font-semibold text-ink-primary">{GIG.seller.memberSince}</p>
                </div>
                <div>
                  <p className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1">Avg response</p>
                  <p className="text-sm font-body font-semibold text-ink-primary">{GIG.seller.avgResponse}</p>
                </div>
                <div>
                  <p className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1">Last delivery</p>
                  <p className="text-sm font-body font-semibold text-ink-primary">{GIG.seller.lastDelivery}</p>
                </div>
              </div>

              <p className="text-ink-secondary text-sm font-body leading-relaxed">
                {GIG.seller.description}
              </p>
            </div>
          </section>

          {/* FAQs */}
          <section>
            <h2 className="font-display font-semibold text-xl text-brand-900 mb-4">FAQ</h2>
            <div className="space-y-3">
              {GIG.faqs.map((faq, index) => (
                <div key={index} className="border border-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-5 py-4 flex items-center justify-between bg-white hover:bg-surface-soft transition-colors text-left"
                  >
                    <span className="font-body font-semibold text-ink-primary">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-ink-tertiary transition-transform ${openFaq === index ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 py-4 text-ink-secondary text-sm font-body border-t border-border bg-surface-soft">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </section>

          {/* Reviews */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-display font-semibold text-xl text-brand-900">Reviews</h2>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-accent DEFAULT text-accent DEFAULT" />
                <span className="font-body font-semibold text-ink-primary">{GIG.rating}</span>
                <span className="text-ink-tertiary text-sm">({GIG.reviews})</span>
              </div>
            </div>

            <div className="space-y-5">
              {GIG.reviewsList.map((review, i) => (
                <div key={i} className="pb-5 border-b border-border last:border-0">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-9 h-9 rounded-full bg-accent-light flex items-center justify-center font-mono font-semibold text-accent-dark text-sm">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-body font-semibold text-sm text-ink-primary">{review.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-ink-tertiary">
                        <span>{review.country}</span>
                        <span>•</span>
                        <span>{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 mb-2">
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} className={`w-3.5 h-3.5 ${star <= review.rating ? 'fill-accent DEFAULT text-accent DEFAULT' : 'text-border'}`} />
                    ))}
                  </div>
                  <p className="text-ink-secondary text-sm font-body leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
              <button className="w-full py-2.5 bg-white border border-border text-ink-primary font-body font-medium text-sm rounded-lg hover:bg-surface-soft transition-colors">
                Load more reviews
              </button>
            </div>
          </section>
        </div>

        {/* Right Sidebar - Pricing */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="sticky top-24 bg-white border border-border rounded-2xl overflow-hidden shadow-lg">

            {/* Package Tabs */}
            <div className="flex border-b border-border">
              {['basic', 'standard', 'premium'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-xs font-body font-semibold uppercase tracking-wide transition-colors relative ${
                    activeTab === tab
                      ? "text-accent DEFAULT"
                      : "text-ink-tertiary hover:text-ink-primary bg-surface-soft"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div layoutId="package-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent DEFAULT" />
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
                className="p-5"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-body font-semibold text-lg text-ink-primary">
                    {GIG.packages[activeTab].name}
                  </h3>
                  <span className="font-mono font-bold text-xl text-brand-900">
                    KES {GIG.packages[activeTab].price.toLocaleString()}
                  </span>
                </div>

                <p className="text-sm text-ink-secondary font-body mb-4">
                  {GIG.packages[activeTab].desc}
                </p>

                <div className="flex items-center gap-4 text-sm font-body text-ink-secondary mb-5">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> {GIG.packages[activeTab].delivery}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RefreshCw className="w-4 h-4" /> {GIG.packages[activeTab].revisions}
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  {GIG.packages[activeTab].features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent DEFAULT shrink-0" />
                      <span className="text-sm font-body text-ink-secondary">{feat}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-3 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-semibold text-sm transition-colors flex items-center justify-center gap-2 mb-3"
                >
                  Continue (KES {GIG.packages[activeTab].price.toLocaleString()})
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button className="w-full py-2.5 rounded-lg border border-border text-ink-primary hover:bg-surface-soft font-body font-medium text-sm transition-colors">
                  Compare packages
                </button>
              </motion.div>
            </AnimatePresence>

            {/* Trust Badges */}
            <div className="p-5 bg-surface-soft border-t border-border">
              <div className="flex items-center gap-2 text-xs font-body font-medium text-ink-secondary mb-2">
                <ShieldCheck className="w-4 h-4 text-accent DEFAULT" /> Forte payment protection
              </div>
              <div className="flex items-center gap-2 text-xs font-body font-medium text-ink-secondary">
                <MessageSquare className="w-4 h-4 text-accent DEFAULT" /> Secure communications
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-border shadow-lg z-50 flex items-center justify-between gap-4">
        <div>
          <span className="block text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide">Starting at</span>
          <span className="block font-mono font-bold text-lg text-brand-900">KES {GIG.packages.basic.price.toLocaleString()}</span>
        </div>
        <button
          onClick={handleCheckout}
          className="flex-1 py-3 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-body font-semibold text-sm transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

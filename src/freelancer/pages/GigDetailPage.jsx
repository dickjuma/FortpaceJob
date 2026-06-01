import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, ChevronRight, ChevronLeft, Clock, RefreshCw, 
  CheckCircle2, Heart, Share2, MessageSquare, ShieldCheck,
  ChevronDown, MessageCircle, Loader2, Pencil
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import toast, { Toaster } from 'react-hot-toast';
import { gigAPI } from '../../common/services/api';
import { useSavedGigIds, useToggleSaveGig } from '../../common/hooks/useSavedGig';

const DEFAULT_GIG = {
  title: 'I will build a responsive modern React JS web application',
  category: 'Programming & Tech',
  subcategory: 'Web Development',
  rating: 4.9,
  reviews: 128,
  ordersInQueue: 4,
  seller: {
    name: 'Alex Rivera',
    avatar: 'https://i.pravatar.cc/150?u=alex',
    level: 'Top Rated Seller',
    memberSince: 'Oct 2021',
    avgResponse: '1 hour',
    lastDelivery: 'about 2 hours ago',
    location: 'United States',
    description: 'Senior Frontend Developer specializing in React, Next.js, and modern UI frameworks. I build scalable, high-performance web applications that users love.'
  },
  gallery: [
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80',
    'https://images.unsplash.com/photo-1455390582262-044cdead27d8?w=1200&q=80'
  ],
  packages: {
    basic: { name: 'Basic App', price: 15000, delivery: '3 Days', revisions: '1 Revision', desc: 'A simple single-page React app perfect for landing pages.', features: ['1 Page', 'Responsive Design', 'Source Code'] },
    standard: { name: 'Standard App', price: 45000, delivery: '7 Days', revisions: '3 Revisions', desc: 'A fully responsive multi-page web app with API integrations.', features: ['5 Pages', 'Responsive Design', 'API Integration', 'Source Code'] },
    premium: { name: 'Full SaaS', price: 120000, delivery: '14 Days', revisions: 'Unlimited', desc: 'A complete SaaS frontend solution with state management and routing.', features: ['10+ Pages', 'Responsive Design', 'Database Setup', 'API Integration', 'Source Code'] }
  },
  description: `Hi there! I am a senior React developer with 5+ years of experience. I specialize in building fast, accessible, and beautiful web applications using modern technologies like React, Tailwind CSS, and Framer Motion.\n\nWhat you will get:\n- Clean, maintainable code\n- Fully responsive design\n- SEO optimization\n- Fast load times\n\nWhy choose me?\n- 100% Client Satisfaction\n- Excellent Communication\n- On-time Delivery\n\nPlease message me before placing an order so we can discuss your specific requirements.`,
  faqs: [
    { q: 'Do you provide the source code?', a: 'Yes, all packages include the full source code delivered via GitHub repository or zip file.' },
    { q: 'Can you work with my existing design?', a: 'Absolutely! I can convert your Figma, Adobe XD, or Sketch designs into pixel-perfect React code.' }
  ],
  reviewsList: [
    { name: 'Sarah M.', rating: 5, date: '2 weeks ago', country: 'United Kingdom', comment: 'Alex is an exceptional developer. He understood my requirements perfectly and delivered a high-quality React application ahead of schedule.' },
    { name: 'David K.', rating: 5, date: '1 month ago', country: 'Canada', comment: 'Great communication and excellent technical skills. Will definitely hire again for future projects.' }
  ]
};

function mapPackagesFromApi(raw, fallback) {
  if (!raw) return fallback;
  if (raw.basic || raw.standard || raw.premium) {
    return {
      basic: { ...fallback.basic, ...raw.basic },
      standard: { ...fallback.standard, ...raw.standard },
      premium: { ...fallback.premium, ...raw.premium },
    };
  }
  if (Array.isArray(raw) && raw.length) {
    const keys = ['basic', 'standard', 'premium'];
    const mapped = { ...fallback };
    raw.slice(0, 3).forEach((pkg, i) => {
      const key = keys[i] || keys[0];
      mapped[key] = {
        name: pkg.name || pkg.title || fallback[key].name,
        price: Number(pkg.price ?? pkg.amount ?? fallback[key].price),
        delivery: pkg.deliveryTime || pkg.delivery || fallback[key].delivery,
        revisions: pkg.revisions || fallback[key].revisions,
        desc: pkg.description || pkg.desc || fallback[key].desc,
        features: pkg.features || fallback[key].features,
      };
    });
    return mapped;
  }
  return fallback;
}

function mapGigFromApi(raw, defaults) {
  const g = raw?.gig || raw?.data || raw;
  if (!g || typeof g !== 'object') return defaults;
  const seller = g.freelancer || g.seller || g.user || {};
  const gallery = []
    .concat(g.images || [], g.gallery || [], g.thumbnail ? [g.thumbnail] : [], g.image ? [g.image] : [])
    .filter(Boolean);
  return {
    ...defaults,
    title: g.title || defaults.title,
    category: g.category?.name || g.category || defaults.category,
    subcategory: g.subcategory?.name || g.subcategory || defaults.subcategory,
    rating: g.rating ?? g.averageRating ?? defaults.rating,
    reviews: g.reviewCount ?? g.reviews ?? defaults.reviews,
    ordersInQueue: g.ordersInQueue ?? g.queueCount ?? defaults.ordersInQueue,
    description: g.description || g.summary || defaults.description,
    gallery: gallery.length ? gallery : defaults.gallery,
    packages: mapPackagesFromApi(g.packages || g.pricing, defaults.packages),
    seller: {
      ...defaults.seller,
      name: seller.name || seller.fullName || [seller.firstName, seller.lastName].filter(Boolean).join(' ') || defaults.seller.name,
      avatar: seller.avatar || seller.profileImage || defaults.seller.avatar,
      level: seller.level || seller.tier || defaults.seller.level,
      location: seller.location || seller.country || defaults.seller.location,
      description: seller.bio || seller.description || defaults.seller.description,
    },
    faqs: g.faqs?.length ? g.faqs : defaults.faqs,
    reviewsList: g.reviews?.length ? g.reviews.map((r) => ({
      name: r.user?.name || r.author || 'Client',
      rating: r.rating || 5,
      date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '',
      country: r.country || '',
      comment: r.comment || r.text || '',
    })) : defaults.reviewsList,
  };
}

export default function GigDetailPage() {
  const { gigId } = useParams();
  const { data: savedGigIds } = useSavedGigIds();
  const toggleSaveGig = useToggleSaveGig();
  const isSaved = gigId && (savedGigIds?.has?.(gigId) || savedGigIds?.has?.(String(gigId)));
  const [activeTab, setActiveTab] = useState('standard');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ['freelancer', 'gig', gigId],
    queryFn: () => gigAPI.getGig(gigId),
    enabled: !!gigId,
  });

  const GIG = useMemo(() => mapGigFromApi(data, DEFAULT_GIG), [data]);

  const nextImage = () => setCurrentImageIndex(prev => (prev + 1) % GIG.gallery.length);
  const prevImage = () => setCurrentImageIndex(prev => (prev === 0 ? GIG.gallery.length - 1 : prev - 1));

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#14a800]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 mb-4">Could not load this service.</p>
        <Link to="/freelancer/gigs" className="text-[#14a800] font-bold">Back to my services</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-surface-dark font-sans pb-24 lg:pb-0">
      <Toaster position="top-center" />
      
      {/* Breadcrumb Navigation */}
      <div className="border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-surface-dark sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between text-xs font-bold text-zinc-500">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <Link to="/freelancer/gigs" className="hover:text-zinc-900 dark:hover:text-white">My services</Link> <ChevronRight className="w-3 h-3" />
            <span>{GIG.category}</span> <ChevronRight className="w-3 h-3" />
            <span className="text-zinc-900 dark:text-white">{GIG.subcategory}</span>
          </div>
          <div className="flex items-center gap-4 hidden sm:flex">
            {gigId && (
              <Link to={`/freelancer/gigs/${gigId}/edit`} className="flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-white transition-colors">
                <Pencil className="w-4 h-4" /> Edit
              </Link>
            )}
            <button
              type="button"
              onClick={() => gigId && toggleSaveGig.mutate({ gigId, saved: isSaved })}
              className={`flex items-center gap-1.5 transition-colors ${
                isSaved
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} /> {isSaved ? 'Saved' : 'Save'}
            </button>
            <button onClick={() => toast('Link copied to clipboard!', { icon: '🔗' })} className="flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-white transition-colors"><Share2 className="w-4 h-4" /> Share</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-12">
        
        {/* Left Content Column */}
        <div className="flex-1 min-w-0 w-full space-y-12">
          
          {/* Header Section */}
          <section>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white mb-6 leading-tight">
              {GIG.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm mb-8">
              <div className="flex items-center gap-2">
                <img src={GIG.seller.avatar} alt="Seller" className="w-8 h-8 rounded-full" />
                <span className="font-bold text-zinc-900 dark:text-white">{GIG.seller.name}</span>
                <span className="text-xs font-bold text-[#14a800] bg-[#14a800]/5 dark:bg-[#14a800]/10 px-2 py-0.5 rounded-md">{GIG.seller.level}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <div className="flex items-center text-amber-500 font-bold gap-1">
                <Star className="w-4 h-4 fill-amber-500" /> {GIG.rating} <span className="text-zinc-400 font-medium">({GIG.reviews})</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <span className="text-zinc-500 font-medium">{GIG.ordersInQueue} Orders in Queue</span>
            </div>

            {/* Image Gallery */}
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 group">
              <img src={GIG.gallery[currentImageIndex]} alt="Gig Media" className="w-full h-full object-cover transition-opacity duration-300" />
              
              <button onClick={prevImage} className="absolute left-4 top-1/2 -tranzinc-y-1/2 w-10 h-10 bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black backdrop-blur-md rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all">
                <ChevronLeft className="w-6 h-6 text-zinc-900 dark:text-white" />
              </button>
              <button onClick={nextImage} className="absolute right-4 top-1/2 -tranzinc-y-1/2 w-10 h-10 bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black backdrop-blur-md rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all">
                <ChevronRight className="w-6 h-6 text-zinc-900 dark:text-white" />
              </button>

              <div className="absolute bottom-4 left-1/2 -tranzinc-x-1/2 flex items-center gap-2">
                {GIG.gallery.map((_, i) => (
                  <button key={i} onClick={() => setCurrentImageIndex(i)} className={cn("h-1.5 rounded-full transition-all", currentImageIndex === i ? "w-6 bg-white" : "w-1.5 bg-white/50")} />
                ))}
              </div>
            </div>
          </section>

          {/* About This Gig */}
          <section>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">About This Gig</h2>
            <div className="prose prose-slate dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed whitespace-pre-wrap">
              {GIG.description}
            </div>
          </section>

          {/* About The Seller */}
          <section>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">About The Seller</h2>
            <div className="bg-surface dark:bg-surface-dark/50 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left mb-8">
                <img src={GIG.seller.avatar} alt="Seller" className="w-24 h-24 rounded-full border-4 border-white dark:border-zinc-800 shadow-lg object-cover" />
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{GIG.seller.name}</h3>
                  <p className="text-[#14a800] font-bold text-sm mb-2">{GIG.seller.level}</p>
                  <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-500 font-bold text-sm mb-4">
                    <Star className="w-4 h-4 fill-amber-500" /> {GIG.rating} <span className="text-zinc-500">({GIG.reviews} reviews)</span>
                  </div>
                  <button 
                    onClick={() => { setIsContactModalOpen(true); toast('Opening secure message thread...', { icon: '💬' }); }}
                    className="px-6 py-2 border-2 border-zinc-900 dark:border-white text-zinc-900 dark:text-white font-bold rounded-xl hover:bg-surface-dark hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 transition-colors"
                  >
                    Contact Me
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white dark:bg-surface-dark rounded-2xl border border-zinc-100 dark:border-zinc-800 mb-6">
                <div><p className="text-xs font-bold text-zinc-400 uppercase mb-1">From</p><p className="text-sm font-bold text-zinc-900 dark:text-white">{GIG.seller.location}</p></div>
                <div><p className="text-xs font-bold text-zinc-400 uppercase mb-1">Member Since</p><p className="text-sm font-bold text-zinc-900 dark:text-white">{GIG.seller.memberSince}</p></div>
                <div><p className="text-xs font-bold text-zinc-400 uppercase mb-1">Avg Response</p><p className="text-sm font-bold text-zinc-900 dark:text-white">{GIG.seller.avgResponse}</p></div>
                <div><p className="text-xs font-bold text-zinc-400 uppercase mb-1">Last Delivery</p><p className="text-sm font-bold text-zinc-900 dark:text-white">{GIG.seller.lastDelivery}</p></div>
              </div>

              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed font-medium">
                {GIG.seller.description}
              </p>
            </div>
          </section>

          {/* FAQs */}
          <section>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">FAQ</h2>
            <div className="space-y-4">
              {GIG.faqs.map((faq, index) => (
                <div key={index} className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
                  <button 
                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                    className="w-full px-6 py-4 flex items-center justify-between bg-surface dark:bg-surface-dark/50 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <span className="font-bold text-zinc-900 dark:text-white text-left">{faq.q}</span>
                    <ChevronDown className={cn("w-5 h-5 text-zinc-400 transition-transform", openFaq === index && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div 
                        initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 py-4 text-zinc-600 dark:text-zinc-400 text-sm font-medium border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-surface-dark">
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
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Reviews</h2>
              <div className="flex items-center text-amber-500 font-bold gap-1">
                <Star className="w-5 h-5 fill-amber-500" /> {GIG.rating} <span className="text-zinc-400 font-medium text-sm">({GIG.reviews})</span>
              </div>
            </div>
            
            <div className="space-y-6">
              {GIG.reviewsList.map((review, i) => (
                <div key={i} className="pb-6 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#14a800]/10 dark:bg-[#14a800] text-[#14a800] dark:text-[#14a800] flex items-center justify-center font-bold">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-white text-sm">{review.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                        <span>{review.country}</span> • <span>{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-amber-500 mb-2">
                    {[1,2,3,4,5].map(star => <Star key={star} className="w-3 h-3 fill-amber-500" />)}
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed font-medium">
                    {review.comment}
                  </p>
                </div>
              ))}
              <button onClick={() => toast('Fetching older reviews...')} className="w-full py-3 bg-surface dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-bold rounded-xl transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800">
                Load More Reviews
              </button>
            </div>
          </section>

        </div>

        {/* Right Sidebar (Pricing) */}
        <div className="w-full lg:w-96 shrink-0 relative">
          <div className="sticky top-24 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xl shadow-zinc-200/50 dark:shadow-none">
            
            {/* Tabs */}
            <div className="flex border-b border-zinc-200 dark:border-zinc-800">
              {['basic', 'standard', 'premium'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-colors relative",
                    activeTab === tab ? "text-[#14a800]" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white bg-surface dark:bg-zinc-800/50"
                  )}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div layoutId="detail-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#14a800]" />
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                className="p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-zinc-900 dark:text-white text-lg">{GIG.packages[activeTab].name}</h3>
                  <span className="text-xl font-black text-zinc-900 dark:text-white">KES {GIG.packages[activeTab].price.toLocaleString()}</span>
                </div>
                
                <p className="text-sm text-zinc-500 mb-6 font-medium leading-relaxed">
                  {GIG.packages[activeTab].desc}
                </p>
                
                <div className="flex items-center gap-4 text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-6">
                  <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-zinc-400" /> {GIG.packages[activeTab].delivery}</div>
                  <div className="flex items-center gap-1.5"><RefreshCw className="w-4 h-4 text-zinc-400" /> {GIG.packages[activeTab].revisions}</div>
                </div>

                <div className="space-y-3 mb-8">
                  {GIG.packages[activeTab].features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                      <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{feat}</span>
                    </div>
                  ))}
                </div>

                <button onClick={() => toast('Proceeding to secure checkout...', { icon: '🔒' })} className="w-full py-4 bg-[#14a800] hover:bg-[#118a00] text-white font-bold rounded-xl shadow-lg shadow-[#14a800]/25/25 transition-all flex items-center justify-center gap-2 mb-4">
                  Continue (KES {GIG.packages[activeTab].price.toLocaleString()}) <ChevronRight className="w-4 h-4" />
                </button>
                <button onClick={() => toast('Opening comparison matrix...', { icon: '📊' })} className="w-full py-3 bg-transparent border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl hover:bg-surface dark:hover:bg-zinc-800 transition-colors">
                  Compare Packages
                </button>
              </motion.div>
            </AnimatePresence>

            {/* Trust Badges */}
            <div className="p-6 bg-surface dark:bg-surface-dark/50 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3 text-xs font-bold text-zinc-500 mb-3">
                <ShieldCheck className="w-4 h-4 text-success" /> Forte Payment Protection
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-zinc-500">
                <MessageSquare className="w-4 h-4 text-[#14a800]" /> Secure Communications
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-surface-dark border-t border-zinc-200 dark:border-zinc-800 shadow-2xl z-50 flex items-center justify-between gap-4">
        <div>
          <span className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">Starting at</span>
          <span className="block text-lg font-black text-zinc-900 dark:text-white">KES {GIG.packages.basic.price.toLocaleString()}</span>
        </div>
        <button onClick={() => toast('Proceeding to secure checkout...', { icon: '🔒' })} className="flex-1 py-3 bg-[#14a800] text-white font-bold rounded-xl shadow-sm">
          Continue
        </button>
      </div>

    </div>
  );
}

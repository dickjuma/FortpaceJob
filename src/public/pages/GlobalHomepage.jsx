import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Code, PenTool, TrendingUp,
  Star, PlayCircle, Zap, Video, Music, BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  { name: 'Graphics & Design', icon: PenTool, color: 'bg-emerald-50 text-success', link: '/categories/design' },
  { name: 'Programming & Tech', icon: Code, color: 'bg-brand-50 text-brand-600', link: '/categories/tech' },
  { name: 'Digital Marketing', icon: TrendingUp, color: 'bg-rose-50 text-rose-600', link: '/categories/marketing' },
  { name: 'Video & Animation', icon: Video, color: 'bg-brand-50 text-brand-600', link: '/categories/video' },
  { name: 'Writing & Translation', icon: BookOpen, color: 'bg-amber-50 text-amber-600', link: '/categories/writing' },
  { name: 'Music & Audio', icon: Music, color: 'bg-cyan-50 text-cyan-600', link: '/categories/audio' },
  { name: 'Business', icon: BriefcaseIcon, color: 'bg-brand-50 text-brand-600', link: '/categories/business' },
  { name: 'AI Services', icon: Zap, color: 'bg-fuchsia-50 text-fuchsia-600', link: '/categories/ai' }
];

const FEATURED_GIGS = [
  { id: 1, title: 'I will design a modern minimal UI/UX for your app', author: 'Sarah Mitchell', rating: 5.0, reviews: 89, price: 350, image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80', avatar: 'https://i.pravatar.cc/150?u=s1', level: 'Top Rated' },
  { id: 2, title: 'I will develop a scalable Node.js backend API', author: 'David Kim', rating: 4.9, reviews: 210, price: 800, image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80', avatar: 'https://i.pravatar.cc/150?u=d2', level: 'Level 2' },
  { id: 3, title: 'I will create professional video ads for social media', author: 'Elena Rossi', rating: 4.8, reviews: 156, price: 200, image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&q=80', avatar: 'https://i.pravatar.cc/150?u=e3', level: 'Top Rated' },
  { id: 4, title: 'I will write SEO optimized articles and blog posts', author: 'James Wilson', rating: 4.9, reviews: 342, price: 50, image: 'https://images.unsplash.com/photo-1455390582262-044cdead27d8?w=600&q=80', avatar: 'https://i.pravatar.cc/150?u=j4', level: 'Level 2' },
];

export default function GlobalHomepage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      {/* Hero Section - Fiverr Style */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 px-4 bg-brand-900 text-white overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&q=80" 
            alt="Freelancer working" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-900 via-brand-900/80 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col justify-center min-h-[450px]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-8 text-white">
              Find the right <span className="font-serif italic text-accent-light">freelance</span> service, right away
            </h1>
            
            {/* Search Bar */}
            <div className="bg-white rounded-lg p-2 flex items-center mb-8 shadow-2xl">
              <input 
                type="text" 
                placeholder="Search for any service..." 
                className="w-full bg-transparent border-none outline-none px-4 py-3 text-zinc-900 font-medium text-lg placeholder:text-zinc-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="bg-success hover:bg-success-dark text-white px-8 py-4 rounded-md font-bold transition-all shrink-0 flex items-center gap-2">
                <Search className="w-5 h-5" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
            
            {/* Popular Searches */}
            <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
              <span className="opacity-80">Popular:</span>
              {['Website Design', 'WordPress', 'Logo Design', 'AI Services'].map(term => (
                <span key={term} className="px-4 py-1.5 rounded-full border border-white/40 hover:bg-white hover:text-brand-900 cursor-pointer transition-colors backdrop-blur-sm">
                  {term}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trusted By Logos */}
      <section className="bg-surface py-6 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-center gap-8">
          <span className="text-zinc-400 font-bold text-sm uppercase tracking-widest">Trusted by:</span>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            <h3 className="text-2xl font-black text-zinc-800">META</h3>
            <h3 className="text-2xl font-black text-zinc-800">GOOGLE</h3>
            <h3 className="text-2xl font-black text-zinc-800">NETFLIX</h3>
            <h3 className="text-2xl font-black text-zinc-800">P&G</h3>
            <h3 className="text-2xl font-black text-zinc-800">PAYPAL</h3>
          </div>
        </div>
      </section>

      {/* Popular Services Slider (Grid representation) */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl font-bold text-zinc-900 mb-10">Popular professional services</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[
            { title: 'Logo Design', subtitle: 'Build your brand', img: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&q=80', color: 'bg-emerald-900' },
            { title: 'WordPress', subtitle: 'Customize your site', img: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=400&q=80', color: 'bg-orange-900' },
            { title: 'Voice Over', subtitle: 'Share your message', img: 'https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?w=400&q=80', color: 'bg-surface-dark' },
            { title: 'Video Explainer', subtitle: 'Engage your audience', img: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=400&q=80', color: 'bg-rose-900' },
            { title: 'SEO', subtitle: 'Unlock growth online', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80', color: 'bg-brand-900' },
          ].map((service, i) => (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={service.title} 
              className={`relative h-[340px] rounded-xl overflow-hidden cursor-pointer group ${service.color}`}
            >
              <img src={service.img} alt={service.title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300 mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute top-0 left-0 p-4">
                <p className="text-white font-medium text-sm drop-shadow-md">{service.subtitle}</p>
                <h3 className="text-white font-bold text-2xl leading-tight mt-1 drop-shadow-md">{service.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Value Proposition - The Best Part */}
      <section className="bg-emerald-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-zinc-900">A whole world of freelance talent at your fingertips</h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircleIcon className="w-6 h-6 text-success" />
                  <h4 className="text-xl font-bold text-zinc-900">The best for every budget</h4>
                </div>
                <p className="text-zinc-600 font-medium pl-9">Find high-quality services at every price point. No hourly rates, just project-based pricing.</p>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircleIcon className="w-6 h-6 text-success" />
                  <h4 className="text-xl font-bold text-zinc-900">Quality work done quickly</h4>
                </div>
                <p className="text-zinc-600 font-medium pl-9">Find the right freelancer to begin working on your project within minutes.</p>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircleIcon className="w-6 h-6 text-success" />
                  <h4 className="text-xl font-bold text-zinc-900">Protected payments, every time</h4>
                </div>
                <p className="text-zinc-600 font-medium pl-9">Always know what you'll pay upfront. Your payment isn't released until you approve the work.</p>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircleIcon className="w-6 h-6 text-success" />
                  <h4 className="text-xl font-bold text-zinc-900">24/7 support</h4>
                </div>
                <p className="text-zinc-600 font-medium pl-9">Find high-quality services at every price point. No hourly rates, just project-based pricing.</p>
              </div>
            </div>
          </div>
          
          <div className="relative rounded-xl overflow-hidden shadow-2xl">
            <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80" alt="Collaboration" className="w-full h-[500px] object-cover" />
            <button className="absolute top-1/2 left-1/2 -tranzinc-x-1/2 -tranzinc-y-1/2 w-20 h-20 bg-success/90 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform backdrop-blur-sm">
              <PlayCircle className="w-10 h-10 ml-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Explore the marketplace */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl font-bold text-zinc-900 mb-12">Explore the marketplace</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
          {CATEGORIES.map((cat, i) => (
            <Link key={cat.name} to={cat.link} className="group flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center mb-4 group-hover:bg-brand-50 transition-colors border border-surface-border shadow-sm group-hover:shadow-md">
                <cat.icon className="w-8 h-8 text-zinc-700 group-hover:text-accent transition-colors" />
              </div>
              <h3 className="font-medium text-zinc-800 group-hover:text-accent transition-colors relative">
                {cat.name}
                <span className="absolute -bottom-2 left-1/2 -tranzinc-x-1/2 w-0 h-0.5 bg-accent group-hover:w-8 transition-all duration-300"></span>
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Enterprise Solutions Banner (Fiverr Pro style) */}
      <section className="bg-surface-dark py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Fortspace <span className="font-light text-success">Enterprise.</span>
            </h2>
            <h3 className="text-2xl md:text-3xl font-medium mb-8">
              Advanced solutions and professional talent for businesses
            </h3>
            
            <ul className="space-y-4 mb-10">
              <li className="flex items-start gap-3">
                <CheckCircleIcon className="w-6 h-6 text-success shrink-0" />
                <span className="text-lg">Connect with freelancers with proven business experience</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircleIcon className="w-6 h-6 text-success shrink-0" />
                <span className="text-lg">Get matched with the perfect talent by a customer success manager</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircleIcon className="w-6 h-6 text-success shrink-0" />
                <span className="text-lg">Manage teamwork and boost productivity with one powerful workspace</span>
              </li>
            </ul>
            
            <button className="px-8 py-3 bg-success hover:bg-success-dark text-white font-bold rounded-md shadow-lg transition-colors text-lg">
              Explore Fortspace Enterprise
            </button>
          </div>
          
          <div className="w-full lg:w-1/2">
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80" alt="Enterprise Team" className="rounded-xl shadow-2xl" />
          </div>
        </div>
      </section>

      {/* Featured Gigs / Inspiring Work */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 bg-surface">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl font-bold text-zinc-900">Inspiring work made on Fortspace</h2>
          <Link to="/find-work" className="text-success font-semibold hover:underline hidden md:block">See more work &gt;</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_GIGS.map(gig => (
            <div key={gig.id} className="bg-white rounded-md overflow-hidden border border-zinc-200 shadow-sm hover:shadow-xl transition-all group cursor-pointer flex flex-col">
              <div className="h-48 overflow-hidden relative">
                <img src={gig.image} alt={gig.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <button className="absolute top-3 right-3 text-white hover:text-rose-500 transition-colors drop-shadow-md">
                  <HeartIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <div className="flex items-center gap-3 mb-3">
                  <img src={gig.avatar} alt={gig.author} className="w-8 h-8 rounded-full" />
                  <div>
                    <span className="font-bold text-zinc-900 text-sm block">{gig.author}</span>
                    <span className="text-xs text-amber-600 font-semibold">{gig.level}</span>
                  </div>
                </div>
                <h3 className="font-medium text-zinc-800 hover:underline leading-snug mb-3 line-clamp-2">
                  {gig.title}
                </h3>
                <div className="flex items-center gap-1 mt-auto">
                  <Star className="w-4 h-4 text-zinc-900 fill-zinc-900" />
                  <span className="font-bold text-zinc-900">{gig.rating}</span>
                  <span className="text-zinc-400 text-sm font-medium">({gig.reviews})</span>
                </div>
              </div>
              <div className="px-4 py-3 border-t border-zinc-100 flex justify-between items-center">
                <HeartIcon className="w-4 h-4 text-zinc-300" />
                <div className="text-right text-xs text-zinc-500 font-bold uppercase">
                  Starting at <span className="text-lg text-zinc-900 ml-1">${gig.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </>
  );
}

function CheckCircleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
}

function HeartIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  );
}

function BriefcaseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
  );
}

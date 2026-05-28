import React, { useState } from 'react';
import { Star, Clock, RefreshCw, Check, MessageSquare, ChevronRight, Share2, Heart } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const MOCK_TIERS = {
  basic: { name: 'Basic', price: 25, desc: '1 Initial Concept Included, Logo Transparency, High Resolution', delivery: 2, revisions: 1 },
  standard: { name: 'Standard', price: 65, desc: '3 Initial Concepts, Source File, Logo Transparency, High Resolution', delivery: 3, revisions: 3 },
  premium: { name: 'Premium', price: 120, desc: '5 Initial Concepts, Source File, Social Media Kit, Vector File', delivery: 4, revisions: 'Unlimited' }
};

const GigDetail = () => {
  const { gigId } = useParams();
  const [activeTier, setActiveTier] = useState('standard');

  return (
    <>
      <div className="bg-white min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 mb-6">
            <Link to="/gigs" className="hover:text-success">Gigs</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/gigs/category/graphics-design" className="hover:text-success">Graphics & Design</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-zinc-900">Logo Design</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            
            {/* Left Content */}
            <div className="lg:w-2/3 space-y-8">
              
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-zinc-900 mb-4 leading-tight">
                  I will design a unique minimalist logo for your business
                </h1>
                
                <div className="flex items-center gap-4 text-sm mb-6 pb-6 border-b border-zinc-100">
                  <div className="flex items-center gap-2 font-bold text-zinc-900">
                    <img src="https://i.pravatar.cc/100" alt="Seller" className="w-8 h-8 rounded-full" />
                    DesignPro_Studio <span className="text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Top Rated</span>
                  </div>
                  <div className="w-px h-4 bg-zinc-200"></div>
                  <div className="flex items-center gap-1 font-bold text-zinc-900">
                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                    4.9 <span className="text-zinc-400 font-medium underline cursor-pointer">(1,024 reviews)</span>
                  </div>
                  <div className="w-px h-4 bg-zinc-200"></div>
                  <div className="font-medium text-zinc-500">12 Orders in Queue</div>
                </div>
              </div>

              {/* Gallery Image */}
              <div className="rounded-2xl overflow-hidden border border-zinc-200 shadow-sm">
                <img src="https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80" alt="Gig Gallery" className="w-full aspect-video object-cover" />
              </div>

              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 mb-4">About This Gig</h2>
                <div className="prose prose-slate max-w-none text-zinc-700 space-y-4">
                  <p>Welcome to my professional minimalist logo design service!</p>
                  <p>A minimalist logo removes all the distracting flaws and focuses on the message to be delivered. This makes it easier for anyone to remember and recognize your brand.</p>
                  <p><strong>Why me?</strong></p>
                  <ul className="list-disc pl-5">
                    <li>Reliable and Premium support</li>
                    <li>Fast and professional service</li>
                    <li>Copyrights will be with the customer</li>
                    <li>Get source and editable files ai, eps, psd, pdf and High-quality files</li>
                  </ul>
                  <p>Minimalist Logo | Minimal | Professional | Modern | Text | Vintage | Badge | Hand drawn | Feminine | Signature | Custom Design</p>
                </div>
              </div>

              <hr className="border-zinc-200" />

              {/* Seller Profile Card */}
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 mb-6">About The Seller</h2>
                <div className="bg-surface border border-zinc-200 rounded-3xl p-8 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
                  <img src="https://i.pravatar.cc/150" alt="Seller" className="w-24 h-24 rounded-full border-4 border-white shadow-lg" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-zinc-900 mb-1">DesignPro_Studio</h3>
                    <p className="text-zinc-600 font-medium mb-3">Brand Identity Specialist</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm font-bold text-zinc-900 mb-4">
                      <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-500 fill-current" /> 4.9 (1k+ reviews)</span>
                      <span className="px-2 py-0.5 bg-zinc-200 rounded-md">From: United States</span>
                    </div>
                    <button className="px-6 py-2.5 bg-white border border-zinc-900 text-zinc-900 hover:bg-surface-dark hover:text-white font-bold rounded-xl transition-colors">
                      Contact Me
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Sidebar - Pricing */}
            <div className="lg:w-1/3">
              <div className="sticky top-24 border border-zinc-200 rounded-3xl bg-white shadow-xl overflow-hidden">
                
                <div className="flex border-b border-zinc-100 bg-surface">
                  {Object.keys(MOCK_TIERS).map(tier => (
                    <button 
                      key={tier}
                      onClick={() => setActiveTier(tier)}
                      className={`flex-1 py-4 font-bold text-sm text-center transition-colors capitalize ${activeTier === tier ? 'bg-white border-t-2 border-t-emerald-500 text-success shadow-[0_-2px_0_0_transparent_inset]' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'}`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-xl text-zinc-900">{MOCK_TIERS[activeTier].name} Package</h3>
                    <div className="text-3xl font-black text-zinc-900">${MOCK_TIERS[activeTier].price}</div>
                  </div>
                  
                  <p className="text-zinc-600 font-medium text-sm mb-6 h-16">
                    {MOCK_TIERS[activeTier].desc}
                  </p>

                  <div className="flex items-center gap-6 text-sm font-bold text-zinc-700 mb-6 pb-6 border-b border-zinc-100">
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {MOCK_TIERS[activeTier].delivery} Days Delivery</span>
                    <span className="flex items-center gap-1.5"><RefreshCw className="w-4 h-4" /> {MOCK_TIERS[activeTier].revisions} Revisions</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {['Source File', 'Logo Transparency', 'High Resolution', '3D Mockup'].map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-zinc-600">
                        <Check className={`w-4 h-4 ${idx < 2 || activeTier !== 'basic' ? 'text-success' : 'text-zinc-300'}`} />
                        <span className={idx < 2 || activeTier !== 'basic' ? 'font-medium' : 'text-zinc-400'}>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button className="w-full py-4 bg-success hover:bg-emerald-700 text-white font-bold rounded-xl text-lg shadow-md transition-colors flex items-center justify-center gap-2 mb-3">
                    Continue (${MOCK_TIERS[activeTier].price}) <ChevronRight className="w-5 h-5" />
                  </button>
                  <button className="w-full py-3 bg-white text-zinc-600 hover:text-zinc-900 font-bold rounded-xl transition-colors">
                    Compare Packages
                  </button>
                </div>

              </div>

              <div className="mt-6 flex justify-center gap-4">
                <button className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-rose-600 transition-colors">
                  <Heart className="w-4 h-4" /> Save
                </button>
                <button className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-brand-600 transition-colors">
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </>
  );
};

export default GigDetail;

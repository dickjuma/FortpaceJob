import React from 'react';
import { Star, MapPin, Clock, Shield, MessageCircle, ChevronRight, Verified } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const MOCK_SELLER = {
  name: 'DesignPro_Studio',
  avatar: 'https://i.pravatar.cc/150',
  tagline: 'Award-winning Brand Identity Specialist',
  rating: 4.9,
  reviews: 1240,
  tier: 'Top Rated Seller',
  country: 'United States',
  memberSince: 'Oct 2021',
  response: '1 hour',
  delivery: 'On time (98%)',
  bio: 'Hi! I am a professional graphic designer with over 8 years of experience in the industry. I specialize in logo design, brand identity, and UI/UX design. I have worked with over 500 startups to help them establish their visual presence. Let us work together to make your brand stand out!',
  skills: ['Logo Design', 'Brand Identity', 'Adobe Illustrator', 'Figma', 'UI/UX Design', 'Web Design'],
  languages: ['English (Native)', 'Spanish (Conversational)']
};

const MOCK_GIGS = [
  { id: 1, title: 'I will design a modern minimalist logo', img: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400', rating: 4.9, reviews: 856, price: 25 },
  { id: 2, title: 'I will create a complete brand identity guideline', img: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=400', rating: 5.0, reviews: 312, price: 150 },
  { id: 3, title: 'I will design a stunning landing page in Figma', img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400', rating: 4.8, reviews: 72, price: 80 }
];

const SellerProfile = () => {
  const { sellerSlug } = useParams();

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar - Profile Info */}
          <div className="lg:w-1/3 shrink-0">
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-sm mb-6">
              <div className="flex flex-col items-center text-center relative mb-6">
                <div className="relative inline-block mb-4">
                  <img src={MOCK_SELLER.avatar} alt={MOCK_SELLER.name} className="w-32 h-32 rounded-full border-4 border-white shadow-lg" />
                  <div className="absolute bottom-1 right-1 w-6 h-6 bg-success border-2 border-white rounded-full"></div>
                </div>
                <h1 className="text-2xl font-black text-zinc-900 mb-1 flex items-center justify-center gap-2">
                  {MOCK_SELLER.name} 
                  <Verified className="w-5 h-5 text-brand-500 fill-current bg-white rounded-full" />
                </h1>
                <p className="text-zinc-600 font-medium mb-3">{MOCK_SELLER.tagline}</p>
                <div className="flex items-center justify-center gap-2 mb-4 text-sm font-bold text-zinc-900">
                  <Star className="w-4 h-4 text-amber-500 fill-current" /> {MOCK_SELLER.rating} <span className="text-zinc-400 font-medium">({MOCK_SELLER.reviews} reviews)</span>
                </div>
                <div className="inline-block px-3 py-1 bg-amber-50 text-amber-700 font-bold text-xs uppercase tracking-wider rounded-lg border border-amber-200">
                  {MOCK_SELLER.tier}
                </div>
              </div>

              <button className="w-full py-4 bg-success hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 mb-6">
                <MessageCircle className="w-5 h-5" /> Contact Me
              </button>

              <div className="space-y-4 pt-6 border-t border-zinc-100">
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2 text-zinc-500 font-medium"><MapPin className="w-4 h-4" /> From</span>
                  <span className="font-bold text-zinc-900">{MOCK_SELLER.country}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2 text-zinc-500 font-medium"><Shield className="w-4 h-4" /> Member since</span>
                  <span className="font-bold text-zinc-900">{MOCK_SELLER.memberSince}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2 text-zinc-500 font-medium"><Clock className="w-4 h-4" /> Avg. response time</span>
                  <span className="font-bold text-zinc-900">{MOCK_SELLER.response}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2 text-zinc-500 font-medium"><Clock className="w-4 h-4" /> Recent delivery</span>
                  <span className="font-bold text-success">{MOCK_SELLER.delivery}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm">
              <h3 className="font-bold text-zinc-900 mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {MOCK_SELLER.skills.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-zinc-100 text-zinc-600 text-sm font-medium rounded-lg border border-zinc-200">
                    {skill}
                  </span>
                ))}
              </div>

              <h3 className="font-bold text-zinc-900 mb-4">Languages</h3>
              <ul className="space-y-2">
                {MOCK_SELLER.languages.map(lang => (
                  <li key={lang} className="text-sm font-medium text-zinc-600">{lang}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Main Content */}
          <div className="flex-1 space-y-8">
            
            {/* Bio */}
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">About Me</h2>
              <div className="prose prose-slate max-w-none text-zinc-700 font-medium">
                <p>{MOCK_SELLER.bio}</p>
              </div>
            </div>

            {/* Active Gigs */}
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-6 flex items-center justify-between">
                My Active Gigs
                <span className="text-sm font-bold text-success bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  {MOCK_GIGS.length} Gigs
                </span>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_GIGS.map(gig => (
                  <Link key={gig.id} to={`/gigs/gig/${gig.id}`} className="bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-emerald-300 transition-all group flex flex-col cursor-pointer">
                    <div className="h-40 overflow-hidden relative">
                      <img src={gig.img} alt={gig.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-medium text-zinc-900 mb-3 line-clamp-2 group-hover:text-success transition-colors leading-relaxed">
                        {gig.title}
                      </h3>
                      
                      <div className="mt-auto pt-3 border-t border-zinc-100 flex items-center justify-between">
                        <div className="flex items-center gap-1 font-bold text-zinc-900 text-sm">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                          {gig.rating} <span className="text-zinc-400 font-medium">({gig.reviews})</span>
                        </div>
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                          From <span className="text-base text-zinc-900 ml-0.5">${gig.price}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Reviews Summary */}
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-zinc-900">Recent Reviews</h2>
                <Link to="/gigs/1/reviews" className="text-success font-bold text-sm hover:underline flex items-center">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="space-y-6">
                {[1, 2, 3].map(review => (
                  <div key={review} className="pb-6 border-b border-zinc-100 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4 mb-3">
                      <img src={`https://i.pravatar.cc/50?img=${review+10}`} alt="Buyer" className="w-10 h-10 rounded-full" />
                      <div>
                        <div className="font-bold text-zinc-900">BuyerName_{review}</div>
                        <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                          United Kingdom • 2 weeks ago
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-3.5 h-3.5 text-amber-500 fill-current" />)}
                    </div>
                    <p className="text-zinc-700 text-sm leading-relaxed">
                      "Absolutely fantastic experience! The design exceeded my expectations and communication was top-notch throughout the entire process. Highly recommended!"
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </>
  );
};

export default SellerProfile;

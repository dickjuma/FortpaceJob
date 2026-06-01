import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import Container from '../common/Container';
import { usePlatformReviews } from '../../common/services/publicHooks';

const FALLBACK_TESTIMONIALS = [
  {
    content: "We needed a senior React engineer for a critical launch. Forte's AI matched us with David in 2 hours. He integrated flawlessly with our team and we shipped a week early.",
    author: "Michael Chang",
    role: "CTO at NexusTech",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600&h=600",
    rating: 5,
    companyLogo: "NexusTech"
  },
  {
    content: "The escrow system gives us complete peace of mind. We've scaled our entire content marketing team through Forte, saving over $100k annually compared to traditional agencies.",
    author: "Sarah O'Connor",
    role: "VP Marketing, GrowthScale",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600&h=600",
    rating: 5,
    companyLogo: "GrowthScale"
  }
];

export default function Testimonials() {
  const { data: apiReviews, isLoading } = usePlatformReviews();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const reviews = apiReviews && apiReviews.length > 0 ? apiReviews : FALLBACK_TESTIMONIALS;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  if (isLoading || reviews.length === 0) {
    return (
      <section className="py-24 bg-zinc-50">
        <Container>
          <div className="h-[400px] bg-zinc-200 animate-pulse rounded-xl"></div>
        </Container>
      </section>
    );
  }

  const currentReview = reviews[currentIndex];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <Container>
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24"
            >
              {/* Media Section */}
              <div className="w-full lg:w-2/5 relative">
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-2xl">
                  <img 
                    src={currentReview.image || currentReview.authorAvatar || `https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&h=800&q=80`} 
                    alt={currentReview.author || currentReview.reviewerName}
                    className="w-full h-full object-cover"
                  />
                  {/* Faux Play Button for video feel */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group cursor-pointer hover:bg-black/30 transition-colors">
                    <div className="w-16 h-16 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 ml-1" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="w-full lg:w-3/5">
                <div className="flex items-center gap-4 mb-6">
                  <h4 className="font-bold text-xl text-zinc-500 border-l-2 border-emerald-500 pl-4 uppercase tracking-wider">
                    {currentReview.companyLogo || 'Forte Client'}
                  </h4>
                </div>
                
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-emerald-950 leading-tight mb-8">
                  "{currentReview.content || currentReview.comment}"
                </h3>
                
                <div className="mb-10">
                  <h5 className="text-xl font-bold text-zinc-900">{currentReview.author || currentReview.reviewerName}</h5>
                  <p className="text-zinc-500">{currentReview.role || 'Verified Buyer'}</p>
                </div>

                <div className="flex items-center gap-2 mb-8">
                  <div className="flex text-emerald-500">
                    {[...Array(currentReview.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <span className="font-bold text-zinc-900 ml-2">{(currentReview.rating || 5).toFixed(1)}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          {reviews.length > 1 && (
            <div className="flex items-center gap-4 justify-center lg:justify-start lg:absolute lg:bottom-0 lg:right-0 mt-12 lg:mt-0">
              <button onClick={handlePrev} className="p-4 rounded-full bg-white border border-zinc-200 hover:bg-zinc-50 hover:border-emerald-200 shadow-sm transition-colors text-zinc-600">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={handleNext} className="p-4 rounded-full bg-white border border-zinc-200 hover:bg-zinc-50 hover:border-emerald-200 shadow-sm transition-colors text-zinc-600">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

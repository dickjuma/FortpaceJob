import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import Container from '../common/Container';
import SectionTitle from '../common/SectionTitle';
import { useTrendingCategories } from '../../common/services/publicHooks';

export default function Categories() {
  const { data: trendingCategories, isLoading } = useTrendingCategories();
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section id="categories" className="py-24 bg-white overflow-hidden">
      <Container>
        <div className="flex items-end justify-between mb-8">
          <SectionTitle 
            title="Popular Professional Services" 
            subtitle=""
          />
          <div className="flex gap-2 mb-8 hidden md:flex">
            <button onClick={scrollLeft} className="p-2 rounded-full border border-zinc-200 hover:bg-zinc-50 hover:border-emerald-200 text-zinc-600 transition-colors shadow-sm">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={scrollRight} className="p-2 rounded-full border border-zinc-200 hover:bg-zinc-50 hover:border-emerald-200 text-zinc-600 transition-colors shadow-sm">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="min-w-[200px] h-36 bg-zinc-100 animate-pulse rounded-2xl border border-zinc-200"></div>
            ))}
          </div>
        ) : (
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {trendingCategories?.map((category, index) => (
              <motion.a
                href={`/search?category=${encodeURIComponent(category.name || category.slug)}`}
                key={category.id || index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="snap-start shrink-0 w-[200px] group p-6 rounded-2xl bg-white border border-zinc-200 hover:border-emerald-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer min-h-[160px] transform hover:-translate-y-1"
              >
                <Layers className="w-8 h-8 text-zinc-700 group-hover:text-emerald-600 transition-colors duration-300" />
                <div className="mt-4">
                  <h3 className="font-bold text-lg leading-tight text-zinc-900 group-hover:text-emerald-700 transition-colors">
                    {category.name || category.title}
                  </h3>
                  <div className="w-8 h-1 bg-emerald-100 mt-3 rounded-full group-hover:w-12 group-hover:bg-emerald-500 transition-all duration-300"></div>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

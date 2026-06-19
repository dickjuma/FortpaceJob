import React from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2, Award, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Container from '../common/Container';
import SectionTitle from '../common/SectionTitle';
import Card from '../common/Card';
import Button from '../common/Button';
import { useTopFreelancers } from '../../common/services/publicHooks';

// Loading skeleton matching Fiverr gig card layout
function FreelancerCardSkeleton() {
  return (
    <div className="rounded-2xl border border-zinc-100 shadow-sm bg-white overflow-hidden animate-pulse">
      {/* Thumbnail area */}
      <div className="h-48 w-full bg-zinc-200" />
      <div className="p-5 space-y-3">
        {/* Title lines */}
        <div className="h-4 bg-zinc-200 rounded w-full" />
        <div className="h-4 bg-zinc-200 rounded w-3/4" />
        {/* Rating row */}
        <div className="flex items-center gap-3 mt-2">
          <div className="h-4 bg-zinc-200 rounded w-16" />
          <div className="h-4 bg-zinc-200 rounded w-20" />
        </div>
        {/* Skills */}
        <div className="flex gap-2 mt-2">
          <div className="h-6 bg-zinc-100 rounded-full w-16" />
          <div className="h-6 bg-zinc-100 rounded-full w-16" />
          <div className="h-6 bg-zinc-100 rounded-full w-14" />
        </div>
      </div>
      {/* Footer */}
      <div className="px-5 pb-5 flex justify-between items-center">
        <div className="space-y-1">
          <div className="h-3 bg-zinc-100 rounded w-16" />
          <div className="h-5 bg-zinc-200 rounded w-12" />
        </div>
        <div className="h-8 bg-zinc-200 rounded w-24" />
      </div>
    </div>
  );
}

// Empty / error state
function EmptyState({ isError }) {
  return (
    <div className="col-span-3 flex flex-col items-center justify-center py-20 text-center">
      <AlertCircle className="w-12 h-12 text-zinc-300 mb-4" />
      <h3 className="text-lg font-semibold text-zinc-700 mb-2">
        {isError ? 'Could not load freelancers' : 'No freelancers found'}
      </h3>
      <p className="text-zinc-500 text-sm max-w-xs">
        {isError
          ? 'There was a problem fetching data from the server. Please try again later.'
          : 'Check back soon — top-rated freelancers will appear here.'}
      </p>
    </div>
  );
}

export default function FeaturedFreelancers() {
  const { data: freelancers = [], isLoading, isError } = useTopFreelancers(6);
  const navigate = useNavigate();

  return (
    <section id="freelancers" className="py-24 bg-zinc-50">
      <Container>
        <SectionTitle
          title="Meet the Freelcrew"
          subtitle="Top-tier independent professionals ready to tackle your most important projects."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            [1, 2, 3].map((i) => <FreelancerCardSkeleton key={i} />)
          ) : isError || freelancers.length === 0 ? (
            <EmptyState isError={isError} />
          ) : (
            freelancers.map((freelancer, index) => (
              <motion.div
                key={freelancer.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="flex flex-col h-full group hover:border-emerald-300 hover:shadow-xl transition-all duration-300 overflow-hidden bg-white p-0 cursor-pointer">
                  {/* Gig Thumbnail Header */}
                  <div
                    className="relative h-48 w-full bg-zinc-100 overflow-hidden"
                    onClick={() => navigate(`/freelancer/${freelancer.id}`)}
                  >
                    <img
                      src={
                        freelancer.thumbnail ||
                        `https://images.unsplash.com/photo-1507238692062-8a0cb9c1415e?auto=format&fit=crop&q=80&w=600&h=400`
                      }
                      alt={freelancer.primaryGigTitle || 'Freelancer Portfolio'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = `https://images.unsplash.com/photo-1507238692062-8a0cb9c1415e?auto=format&fit=crop&q=80&w=600&h=400`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Floating Avatar & Name over thumbnail */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-end gap-3">
                      <div className="relative shrink-0">
                        <img
                          src={
                            freelancer.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              freelancer.name || freelancer.firstName || 'F'
                            )}&background=10b981&color=fff`
                          }
                          alt={freelancer.name || freelancer.firstName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm bg-white"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=F&background=10b981&color=fff`;
                          }}
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5 shadow-sm">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        </div>
                      </div>
                      <div className="pb-1 text-white">
                        <h3 className="font-bold text-base leading-tight">
                          {freelancer.name ||
                            `${freelancer.firstName || ''} ${freelancer.lastName || ''}`.trim() ||
                            'Freelancer'}
                        </h3>
                        <p className="text-xs text-zinc-200 line-clamp-1">
                          {freelancer.title || 'Professional Freelancer'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    {/* Gig Title / Bio snippet */}
                    <p
                      className="text-sm font-medium text-zinc-900 mb-4 line-clamp-2 hover:text-emerald-700 transition-colors"
                      onClick={() => navigate(`/freelancer/${freelancer.id}`)}
                    >
                      {freelancer.primaryGigTitle ||
                        freelancer.bio ||
                        freelancer.description ||
                        'Experienced professional dedicated to delivering high-quality results on time and within budget.'}
                    </p>

                    {/* Rating & Level badge — Fiverr gig card pattern */}
                    <div className="flex items-center gap-3 mb-4 text-sm bg-zinc-50 p-2.5 rounded-lg border border-zinc-100">
                      <div className="flex items-center gap-1 font-bold text-zinc-900">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span>{freelancer.rating || '5.0'}</span>
                        <span className="font-normal text-zinc-500">
                          ({freelancer.reviewCount || '10+'})
                        </span>
                      </div>
                      <div className="w-px h-4 bg-zinc-300" />
                      <div className="font-semibold text-zinc-900 flex items-center gap-1 text-xs">
                        <Award className="w-3.5 h-3.5 text-emerald-600" />
                        {freelancer.level || 'Top Rated'}
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mb-4 overflow-hidden max-h-7">
                      {(freelancer.skills || ['React', 'Design', 'Strategy'])
                        .slice(0, 3)
                        .map((skill, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs rounded-full font-medium"
                          >
                            {typeof skill === 'string' ? skill : skill?.name || skill}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Price + CTA — Fiverr "Starting at $X" footer */}
                  <div className="flex items-center justify-between p-5 pt-0 mt-auto border-t border-zinc-100">
                    <div>
                      <span className="text-xs text-zinc-500 uppercase font-semibold tracking-wider block">
                        Starting at
                      </span>
                      <span className="font-bold text-lg text-zinc-900">
                        ${freelancer.hourlyRate || freelancer.basePrice || '45'}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                      size="sm"
                      onClick={() => navigate(`/freelancer/${freelancer.id}`)}
                    >
                      View Profile
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* View all CTA */}
        {!isLoading && !isError && freelancers.length > 0 && (
          <div className="flex justify-center mt-10">
            <Button
              variant="outline"
              className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 px-8 py-3 text-sm font-bold"
              onClick={() => navigate('/search')}
            >
              View All Freelancers
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}

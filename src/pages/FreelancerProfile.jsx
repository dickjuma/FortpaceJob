import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  Clock,
  Heart,
  MapPin,
  Share2,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import FreelancerCard from '../components/marketplace/FreelancerCard';
import {
  getFeaturedTalent,
  getRelatedTalent,
  getTalentById,
} from './find-talent/talentMarketplaceData';

const tabs = ['services', 'portfolio', 'reviews', 'experience'];

const FreelancerProfile = () => {
  const { talentId } = useParams();
  const talent = getTalentById(talentId) || getFeaturedTalent()[0];
  const [activeTab, setActiveTab] = useState('services');
  const relatedTalent = getRelatedTalent(talent.id);

  return (
    <>
      <div className="w-full h-48 md:h-64 lg:h-80 bg-zinc-200 relative">
        <img
          alt={talent.name}
          className="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/55 to-transparent" />
      </div>

      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-8 -mt-20 md:-mt-24 relative z-10 pb-16">
          <div className="flex-1">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-zinc-200 mb-6">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-end mb-6">
                <div className="relative">
                  <img
                    alt={talent.name}
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg object-cover bg-white"
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(talent.name)}&background=random`}
                  />
                  <div className="absolute bottom-2 right-2 w-5 h-5 bg-success border-2 border-white rounded-full" title="Online now" />
                </div>

                <div className="flex-1 w-full">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 flex items-center gap-2 mb-1">
                        {talent.name}
                        {talent.verified ? <ShieldCheck className="w-6 h-6 text-brand-500" title="Identity Verified" /> : null}
                      </h1>
                      <h2 className="text-lg text-zinc-600 font-medium">{talent.title}</h2>
                      <p className="text-sm text-zinc-500 mt-2">{talent.headline}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-rose-500 hover:bg-rose-50 transition-colors" type="button">
                        <Heart className="w-5 h-5" />
                      </button>
                      <button className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-brand-600 hover:bg-brand-50 transition-colors" type="button">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-x-8 gap-y-4 pt-6 border-t border-zinc-100 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400 fill-current" />
                  <div>
                    <div className="font-bold text-zinc-900">{talent.rating} ({talent.reviews} reviews)</div>
                    <div className="text-zinc-500">{talent.badges[0]}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-brand-500" />
                  <div>
                    <div className="font-bold text-zinc-900">{talent.jobSuccess}% Job Success</div>
                    <div className="text-zinc-500">{talent.completedJobs} jobs completed</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-zinc-400" />
                  <div>
                    <div className="font-bold text-zinc-900">{talent.location}</div>
                    <div className="text-zinc-500">{talent.localTime} local time</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-success" />
                  <div>
                    <div className="font-bold text-zinc-900">{talent.availability}</div>
                    <div className="text-zinc-500">Responds in about {talent.responseTime}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-zinc-200 mb-6">
              <h3 className="text-xl font-bold text-zinc-900 mb-4">About</h3>
              <div className="prose max-w-none text-zinc-600 space-y-4">
                {talent.bio.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 mb-6 overflow-hidden">
              <div className="flex overflow-x-auto border-b border-zinc-200">
                {tabs.map((tab) => (
                  <button
                    className={`px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === tab ? 'border-brand-600 text-brand-600' : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:bg-surface'
                    }`}
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    type="button"
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="p-6 md:p-8 min-h-[300px]">
                {activeTab === 'services' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {talent.services.map((service) => (
                      <div className="border border-zinc-200 rounded-xl p-5 hover:border-brand-300 transition-colors group" key={service.id}>
                        <div className="flex justify-between items-start mb-3 gap-3">
                          <h4 className="font-bold text-zinc-900 group-hover:text-brand-600 transition-colors">{service.title}</h4>
                          <span className="font-bold text-zinc-900">From ${service.price}</span>
                        </div>
                        <p className="text-sm text-zinc-500 mb-4">{service.summary}</p>
                        <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {service.delivery}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}

                {activeTab === 'portfolio' ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {talent.portfolio.map((item) => (
                      <div className="rounded-2xl border border-zinc-200 p-5 bg-surface" key={item.title}>
                        <div className="font-bold text-zinc-900">{item.title}</div>
                        <div className="text-sm text-zinc-600 mt-2">{item.summary}</div>
                        <div className="text-sm font-semibold text-success mt-4">{item.impact}</div>
                      </div>
                    ))}
                  </div>
                ) : null}

                {activeTab === 'reviews' ? (
                  <div className="space-y-4">
                    {talent.reviewsList.map((review) => (
                      <div className="rounded-2xl border border-zinc-200 p-5" key={review.author}>
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-zinc-900">{review.author}</div>
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star className="w-4 h-4 fill-current" /> {review.rating}
                          </div>
                        </div>
                        <p className="text-zinc-600 mt-3">{review.quote}</p>
                      </div>
                    ))}
                  </div>
                ) : null}

                {activeTab === 'experience' ? (
                  <div className="space-y-4">
                    {talent.experience.map((item) => (
                      <div className="rounded-2xl border border-zinc-200 p-5" key={`${item.company}-${item.period}`}>
                        <div className="font-bold text-zinc-900">{item.role}</div>
                        <div className="text-zinc-600">{item.company}</div>
                        <div className="text-sm text-zinc-400 mt-2">{item.period}</div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-2xl font-bold text-zinc-900">Related talent</h3>
                <Link className="text-brand-600 font-bold hover:text-brand-700" to="/search-results">
                  Search more talent
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {relatedTalent.map((entry) => (
                  <FreelancerCard freelancer={entry} key={entry.id} />
                ))}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-80 flex-shrink-0 lg:mt-24">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-zinc-200">
                <div className="flex items-baseline justify-between mb-6">
                  <div className="text-2xl font-bold text-zinc-900">
                    ${talent.hourlyRate}
                    <span className="text-sm font-normal text-zinc-500">/hr</span>
                  </div>
                  <div className="text-sm font-medium text-success">{talent.availability}</div>
                </div>

                <Link className="w-full block text-center bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-4 rounded-xl transition-colors mb-3" to={`/talent/${talent.id}/hire`}>
                  Hire {talent.name.split(' ')[0]}
                </Link>
                <Link className="w-full block text-center bg-white border border-zinc-300 hover:bg-surface text-zinc-700 font-bold py-3 px-4 rounded-xl transition-colors mb-4" to={`/talent/${talent.id}/invite`}>
                  Invite to Job
                </Link>

                <p className="text-xs text-center text-zinc-500">
                  <ShieldCheck className="w-3 h-3 inline mr-1 text-zinc-400" />
                  Hiring and invite flows now preserve the selected talent context
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm">
                <h3 className="font-bold text-zinc-900 mb-4">Top skills</h3>
                <div className="flex flex-wrap gap-2">
                  {talent.skills.map((skill) => (
                    <span className="px-3 py-1.5 bg-zinc-100 text-zinc-700 text-sm font-medium rounded-lg" key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm">
                <h3 className="font-bold text-zinc-900 mb-4">Verifications</h3>
                <ul className="space-y-3 mb-6">
                  {talent.verifications.map((item) => (
                    <li className="flex items-center gap-3 text-sm text-zinc-700" key={item}>
                      <CheckCircle2 className="w-5 h-5 text-success" /> {item}
                    </li>
                  ))}
                </ul>

                <h3 className="font-bold text-zinc-900 mb-4">Certifications</h3>
                <ul className="space-y-4">
                  {talent.certifications.map((certification) => (
                    <li className="flex gap-3" key={certification.title}>
                      <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-zinc-900">{certification.title}</div>
                        <div className="text-xs text-zinc-500">{certification.issuer}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FreelancerProfile;

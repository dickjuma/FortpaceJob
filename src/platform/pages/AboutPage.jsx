import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';
import { useSiteSettings } from '../common/hooks/useSiteSettings';

export default function AboutPage() {
  const { data, isLoading } = useSiteSettings();
  const about = data?.about || {};
  const team = about.team?.length ? about.team : [];

  return (
    <div className="min-h-screen bg-zinc-50 pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#4C1D95] mb-8 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back home
        </Link>

        <header className="mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-[#4C1D95]">About Fortespace</span>
          <h1 className="text-4xl md:text-5xl font-black text-zinc-900 mt-3 mb-4">
            {about.headline || 'Building East Africa\'s trusted freelance marketplace'}
          </h1>
          <p className="text-lg text-zinc-600 leading-relaxed max-w-3xl">
            {about.mission ||
              'Fortespace connects clients and professionals across online, on-site, and hybrid work — with escrow, compliance, and admin oversight built in.'}
          </p>
        </header>

        <section className="mb-16 grid md:grid-cols-3 gap-6">
          {[
            { title: 'Verified talent', text: 'Browse by Fortespace categories with role-level matching.' },
            { title: 'Protected payments', text: 'Escrow, subscriptions, and master wallet compliance.' },
            { title: 'Admin oversight', text: 'Platform settings, forms, and reviews under one console.' },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
              <h3 className="font-black text-zinc-900 mb-2">{item.title}</h3>
              <p className="text-sm text-zinc-600">{item.text}</p>
            </div>
          ))}
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-black text-zinc-900 mb-4">Our Mission</h2>
          <p className="text-zinc-700 leading-relaxed">
            Bring Opportunity to All Talent. We empower the African youth and everyday entrepreneurs to build personal brands and businesses and make a living doing what they love best.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-black text-zinc-900 mb-4">Our Vision</h2>
          <p className="text-zinc-700 leading-relaxed">
            To create a world where people can make a living doing what they love and where every client can find trusted, verified expertise with confidence.
          </p>
        </section>

        <section className="mb-16 bg-white rounded-3xl border border-zinc-200 p-8 shadow-sm">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Verified talent', description: 'Professionals and teams are vetted, rated, and ready to deliver.' },
              { title: 'Escrow security', description: 'Your funds are protected until work is completed and approved.' },
              { title: 'Category taxonomy', description: 'Find talent using marketplace categories and role-level matching.' },
              { title: 'Local + remote', description: 'Hire online, onsite, or hybrid professionals across every project type.' },
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-zinc-100 p-6">
                <h3 className="font-black text-zinc-900 mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {about.stats?.length ? (
          <section className="mb-16">
            <h2 className="text-2xl font-black text-zinc-900 mb-6">Our Impact</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {about.stats.map((stat) => (
                <div key={stat.label} className="bg-[#f8faf8] rounded-3xl p-6 text-center">
                  <div className="text-3xl font-black text-zinc-900">{stat.value}</div>
                  <p className="text-sm text-zinc-500 mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="mb-16">
            <h2 className="text-2xl font-black text-zinc-900 mb-6">Our impact so far</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { value: '5K+', label: 'Talents onboarded' },
                { value: '12K+', label: 'Projects completed' },
                { value: '98%', label: 'Client satisfaction' },
              ].map((stat) => (
                <div key={stat.label} className="bg-[#f8faf8] rounded-3xl p-6 text-center">
                  <div className="text-3xl font-black text-zinc-900">{stat.value}</div>
                  <p className="text-sm text-zinc-500 mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mb-16">
          <h2 className="text-2xl font-black text-zinc-900 mb-4">What Makes Us Different</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
              <h3 className="font-black text-zinc-900 mb-2">Talent and teams</h3>
              <p className="text-sm text-zinc-600">
                We match individual freelancers, SMEs, and boutique teams so clients can hire the right type of delivery model for every project.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
              <h3 className="font-black text-zinc-900 mb-2">Process-first hiring</h3>
              <p className="text-sm text-zinc-600">
                Our platform combines marketplace discovery with proposal management, contracts, and secure payments in one experience.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
              <h3 className="font-black text-zinc-900 mb-2">Built for growth</h3>
              <p className="text-sm text-zinc-600">
                Freelancers scale from individual gigs to thriving agencies, while clients scale from one project to long-term teams.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
              <h3 className="font-black text-zinc-900 mb-2">Trust and transparency</h3>
              <p className="text-sm text-zinc-600">
                Clear pricing, verified profiles, and platform protections mean fewer surprises and better outcomes.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-8">
            <Users className="w-6 h-6 text-[#4C1D95]" />
            <h2 className="text-2xl font-black text-zinc-900">Our team</h2>
          </div>
          {isLoading ? (
            <p className="text-zinc-500">Loading team…</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member) => (
                <article key={member.id || member.name} className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
                  <h3 className="font-black text-zinc-900">{member.name}</h3>
                  <p className="text-sm font-bold text-[#4C1D95] mt-1">{member.role}</p>
                  <p className="text-sm text-zinc-600 mt-3 leading-relaxed">{member.bio}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="mt-14 text-center">
          <Link
            to="/contact"
            className="inline-flex px-6 py-3 bg-[#4C1D95] text-white font-bold rounded-xl hover:bg-[#22C55E]"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </div>
  );
}



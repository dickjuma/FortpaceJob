import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';
import { useSiteSettings } from '../../common/hooks/useSiteSettings';

const FALLBACK_TEAM = [
  {
    id: 1,
    name: 'Dickson Juma',
    role: 'Lead Software Engineer',
    bio: 'Leads platform architecture, engineering standards, and delivery across the Fortespace ecosystem.',
  },
];

export default function AboutPage() {
  const { data, isLoading } = useSiteSettings();
  const about = data?.about || {};
  const team = about.team?.length ? about.team : FALLBACK_TEAM;

  return (
    <div className="min-h-screen bg-zinc-50 pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#2bb75c] mb-8 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back home
        </Link>

        <header className="mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-[#2bb75c]">About Fortespace</span>
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
            To create a world where people can make a living doing what they love to do and what they know how to do best.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-black text-zinc-900 mb-4">What Makes Us Different</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
              <h3 className="font-black text-zinc-900 mb-2">Service breadth</h3>
              <p className="text-sm text-zinc-600">
                Fortespace focuses exclusively on services and talent labor. We offer a vast marketplace covering all skill categories — digital, professional, and practical.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
              <h3 className="font-black text-zinc-900 mb-2">KYC Vetted</h3>
              <p className="text-sm text-zinc-600">
                Every professional and SME is verified with National ID, ensuring you hire a human.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
              <h3 className="font-black text-zinc-900 mb-2">Escrow Protected</h3>
              <p className="text-sm text-zinc-600">
                All funds are secured in an intermediary account before a job or gig starts. No more non-payment anxiety.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
              <h3 className="font-black text-zinc-900 mb-2">Fortescore</h3>
              <p className="text-sm text-zinc-600">
                Our proprietary, data-backed rating system that gives Clients the precision to hire based on proven, verified performance and contract success.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-8">
            <Users className="w-6 h-6 text-[#2bb75c]" />
            <h2 className="text-2xl font-black text-zinc-900">Our team</h2>
          </div>
          {isLoading ? (
            <p className="text-zinc-500">Loading team…</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member) => (
                <article key={member.id || member.name} className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
                  <h3 className="font-black text-zinc-900">{member.name}</h3>
                  <p className="text-sm font-bold text-[#2bb75c] mt-1">{member.role}</p>
                  <p className="text-sm text-zinc-600 mt-3 leading-relaxed">{member.bio}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="mt-14 text-center">
          <Link
            to="/contact"
            className="inline-flex px-6 py-3 bg-[#2bb75c] text-white font-bold rounded-xl hover:bg-[#1d8d38]"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </div>
  );
}


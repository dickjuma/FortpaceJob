import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';
import { useSiteSettings } from '../../common/hooks/useSiteSettings';

const FALLBACK_TEAM = [
  {
    name: 'Trevor Asun',
    role: 'Founder & CEO',
    bio: 'Product and marketplace strategy. Leading Fortespace vision for trusted work in Africa.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
  },
  {
    name: 'Operations Lead',
    role: 'Head of Operations',
    bio: 'Escrow, payouts, and partner operations.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
  },
  {
    name: 'Engineering Lead',
    role: 'CTO (placeholder)',
    bio: 'Platform architecture, security, and integrations.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  },
];

export default function AboutPage() {
  const { data, isLoading } = useSiteSettings();
  const about = data?.about || {};
  const team = about.team?.length ? about.team : FALLBACK_TEAM;

  return (
    <div className="min-h-screen bg-zinc-50 pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#14a800] mb-8 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back home
        </Link>

        <header className="mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-[#14a800]">About Fortespace</span>
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
            { title: 'Verified talent', text: 'Browse by Fiverr-style categories with role-level matching.' },
            { title: 'Protected payments', text: 'Escrow, subscriptions, and master wallet compliance.' },
            { title: 'Admin oversight', text: 'Platform settings, forms, and reviews under one console.' },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
              <h3 className="font-black text-zinc-900 mb-2">{item.title}</h3>
              <p className="text-sm text-zinc-600">{item.text}</p>
            </div>
          ))}
        </section>

        <section>
          <div className="flex items-center gap-2 mb-8">
            <Users className="w-6 h-6 text-[#14a800]" />
            <h2 className="text-2xl font-black text-zinc-900">Our team</h2>
          </div>
          {isLoading ? (
            <p className="text-zinc-500">Loading team…</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member) => (
                <article key={member.id || member.name} className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-48 object-cover bg-zinc-100"
                  />
                  <div className="p-5">
                    <h3 className="font-black text-zinc-900">{member.name}</h3>
                    <p className="text-sm font-bold text-[#14a800] mt-1">{member.role}</p>
                    <p className="text-sm text-zinc-600 mt-3 leading-relaxed">{member.bio}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="mt-14 text-center">
          <Link
            to="/contact"
            className="inline-flex px-6 py-3 bg-[#14a800] text-white font-bold rounded-xl hover:bg-[#118a00]"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, CheckCircle2 } from 'lucide-react';
import Container from '../common/Container';
import SectionTitle from '../common/SectionTitle';
import Card from '../common/Card';
import Button from '../common/Button';

const FREELANCERS = [
  {
    name: 'Sarah Jenkins',
    role: 'Senior UI/UX Designer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256&h=256',
    rate: '$85/hr',
    rating: 5.0,
    reviews: 124,
    location: 'United States',
    successRate: '100%',
    skills: ['Figma', 'Prototyping', 'User Research'],
    bio: 'Award-winning designer with 8+ years helping startups build scalable products.',
  },
  {
    name: 'David Chen',
    role: 'Full-Stack Developer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256&h=256',
    rate: '$110/hr',
    rating: 4.9,
    reviews: 89,
    location: 'Canada',
    successRate: '98%',
    skills: ['React', 'Node.js', 'PostgreSQL'],
    bio: 'Specializing in high-performance web applications and scalable architecture.',
  },
  {
    name: 'Elena Rodriguez',
    role: 'Product Marketing Manager',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256&h=256',
    rate: '$95/hr',
    rating: 5.0,
    reviews: 210,
    location: 'Spain',
    successRate: '99%',
    skills: ['GTM Strategy', 'Copywriting', 'SEO'],
    bio: 'Helped 3 startups reach successful exits. Data-driven growth expert.',
  }
];

export default function FeaturedFreelancers() {
  return (
    <section id="freelancers" className="py-24 bg-white">
      <Container>
        <SectionTitle 
          title="Top Rated Professionals" 
          subtitle="Work with the best independent talent from around the world."
        />

        <div className="grid md:grid-cols-3 gap-8">
          {FREELANCERS.map((freelancer, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="flex flex-col h-full group hover:border-emerald-200">
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <img 
                      src={freelancer.image} 
                      alt={freelancer.name} 
                      className="w-16 h-16 rounded-full object-cover border border-zinc-200"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-900 leading-tight">{freelancer.name}</h3>
                    <p className="text-sm text-zinc-500 mt-0.5">{freelancer.role}</p>
                    <div className="flex items-center gap-1 mt-1.5 text-xs text-zinc-500">
                      <MapPin className="w-3 h-3" />
                      {freelancer.location}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1 font-semibold text-zinc-900">
                    <Star className="w-4 h-4 fill-emerald-500 text-success" />
                    {freelancer.rating} <span className="font-normal text-zinc-500">({freelancer.reviews})</span>
                  </div>
                  <div className="w-px h-4 bg-zinc-200" />
                  <div className="font-semibold text-zinc-900">
                    {freelancer.successRate} <span className="font-normal text-zinc-500">Job Success</span>
                  </div>
                </div>

                <p className="text-sm text-zinc-600 mb-4 line-clamp-2 flex-grow">
                  "{freelancer.bio}"
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {freelancer.skills.map(skill => (
                    <span key={skill} className="px-2 py-1 bg-zinc-100 text-zinc-600 text-xs rounded-md font-medium">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-zinc-100 mt-auto">
                  <span className="font-bold text-lg text-zinc-900">{freelancer.rate}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="hidden lg:flex">Invite</Button>
                    <Button variant="primary" size="sm">View Profile</Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

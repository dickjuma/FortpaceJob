import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, PenTool, Smartphone, Video, TrendingUp, FileText, Database, LayoutTemplate } from 'lucide-react';
import Container from '../common/Container';
import SectionTitle from '../common/SectionTitle';

const CATEGORIES = [
  { icon: Monitor, name: 'Web Development', count: '15,302' },
  { icon: PenTool, name: 'Graphic Design', count: '12,491' },
  { icon: Smartphone, name: 'Mobile Apps', count: '8,211' },
  { icon: Video, name: 'Video Editing', count: '6,842' },
  { icon: TrendingUp, name: 'Digital Marketing', count: '11,209' },
  { icon: FileText, name: 'Writing & Translation', count: '9,500' },
  { icon: Database, name: 'Data Entry & Analysis', count: '5,123' },
  { icon: LayoutTemplate, name: 'UI/UX Design', count: '4,890' },
];

export default function Categories() {
  return (
    <section id="categories" className="py-24 bg-white">
      <Container>
        <SectionTitle 
          title="Explore Popular Categories" 
          subtitle="Find the exact expertise you need from our comprehensive marketplace of skilled professionals."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.a
                href={`/search?category=${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="group p-6 rounded-2xl bg-surface hover:bg-emerald-50 border border-zinc-100 hover:border-emerald-100 transition-colors flex flex-col items-start gap-4 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:text-success transition-colors">
                  <Icon className="w-6 h-6 text-zinc-700 group-hover:text-success transition-colors" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 group-hover:text-emerald-700 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-zinc-500 mt-1">
                    {category.count} skills
                  </p>
                </div>
              </motion.a>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

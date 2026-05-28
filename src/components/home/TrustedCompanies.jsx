import React from 'react';
import { motion } from 'framer-motion';
import Container from '../common/Container';

const COMPANIES = [
  { name: 'Google', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
  { name: 'Shopify', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Shopify_logo_2018.svg' },
  { name: 'Netflix', url: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
  { name: 'Microsoft', url: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
  { name: 'Airbnb', url: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg' },
  { name: 'Stripe', url: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg' },
];

export default function TrustedCompanies() {
  return (
    <section className="py-12 border-b border-zinc-100 bg-white">
      <Container>
        <p className="text-center text-sm font-medium text-zinc-400 mb-8 uppercase tracking-wider">
          Trusted by teams worldwide
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          {COMPANIES.map((company, index) => (
            <motion.div 
              key={company.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <img 
                src={company.url} 
                alt={`${company.name} logo`} 
                className="h-6 sm:h-8 object-contain transition-all duration-300 filter"
              />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

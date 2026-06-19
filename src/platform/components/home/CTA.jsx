import React from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../common/Container';
import Button from '../common/Button';

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-surface relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      
      <Container className="relative z-10 text-center">
        <div className="max-w-3xl mx-auto bg-surface-dark rounded-3xl p-10 md:p-16 shadow-2xl overflow-hidden relative">
          
          {/* Subtle glow inside the card */}
          <div className="absolute top-0 left-1/2 -tranzinc-x-1/2 w-full h-full bg-gradient-to-b from-emerald-500/20 to-transparent opacity-50 blur-3xl pointer-events-none" />

          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6 relative z-10">
            Ready to Build Your Next Project?
          </h2>
          <p className="text-lg text-zinc-300 mb-10 relative z-10 max-w-xl mx-auto">
            Join thousands of businesses and professionals who are doing their best work on Forte.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate('/auth/register', { state: { role: 'CLIENT' }})}>
              Hire Freelancers
            </Button>
            <Button variant="white" size="lg" className="w-full sm:w-auto bg-transparent border-zinc-700 text-white hover:bg-zinc-800" onClick={() => navigate('/auth/register', { state: { role: 'FREELANCER' }})}>
              Start Freelancing
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

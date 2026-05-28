import React, { useEffect } from 'react';

// Components
import Navbar from '../components/home/Navbar';
import Hero from '../components/home/Hero';
import TrustedCompanies from '../components/home/TrustedCompanies';
import Categories from '../components/home/Categories';
import HowItWorks from '../components/home/HowItWorks';
import FeaturedFreelancers from '../components/home/FeaturedFreelancers';
import BusinessBenefits from '../components/home/BusinessBenefits';
import EnterpriseSection from '../components/home/EnterpriseSection';
import Features from '../components/home/Features';
import Testimonials from '../components/home/Testimonials';
import SuccessStories from '../components/home/SuccessStories';
import FAQ from '../components/home/FAQ';
import CTA from '../components/home/CTA';
import Footer from '../components/home/Footer';

export default function Home() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 selection:bg-emerald-200 selection:text-emerald-900">
      <Navbar />
      
      <main>
        <Hero />
        <TrustedCompanies />
        <Categories />
        <HowItWorks />
        <FeaturedFreelancers />
        <BusinessBenefits />
        <EnterpriseSection />
        <Features />
        <Testimonials />
        <SuccessStories />
        <FAQ />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}

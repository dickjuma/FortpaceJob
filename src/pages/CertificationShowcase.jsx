import React from 'react';
import { Award, CheckCircle2, Search, Filter } from 'lucide-react';
import FreelancerCard from '../components/marketplace/FreelancerCard';

const CertificationShowcase = () => {
  return (
    <>
      <div className="bg-surface-dark text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2bb75c]/20 rounded-full blur-3xl -mr-40 -mt-40"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center max-w-4xl">
          <Award className="w-16 h-16 text-[#2bb75c] mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-black mb-6">Certified Experts</h1>
          <p className="text-xl text-zinc-300 mb-10">
            Hire talent possessing verified industry certifications from AWS, Google, Microsoft, Cisco, and more.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3">
            {['AWS Certified', 'Google Cloud', 'PMP', 'Cisco CCNA', 'HubSpot', 'Salesforce'].map(cert => (
              <button key={cert} className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-sm font-bold transition-colors">
                {cert}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-surface min-h-screen py-16 border-t border-zinc-200">
        <div className="container mx-auto px-4 md:px-8">
          
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-zinc-900">Showing AWS Certified Architects</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-zinc-200 text-zinc-700 font-bold text-sm rounded-lg hover:bg-surface transition-colors flex items-center gap-2">
                <Filter className="w-4 h-4" /> Filters
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-16">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <FreelancerCard key={i} freelancer={{
                id: i,
                name: `AWS Expert ${i}`,
                title: 'Cloud Solutions Architect',
                rating: 5.0,
                reviews: 120 + i,
                hourlyRate: 150 + i * 10,
                verified: true,
                jobSuccess: 100,
                location: 'Remote',
                workType: 'Remote Available',
                skills: ['AWS Solutions Architect', 'Terraform', 'Kubernetes']
              }} />
            ))}
          </div>

        </div>
      </div>
    </>
  );
};

export default CertificationShowcase;


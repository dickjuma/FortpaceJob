import React from 'react';
import { Package, Check, Clock, Shield, ArrowRight } from 'lucide-react';

const PACKAGES = [
  {
    id: 'basic',
    name: 'Starter Setup',
    price: 500,
    delivery: '5 Days',
    revisions: 2,
    description: 'Perfect for simple landing pages or basic React components.',
    features: ['1 Page setup', 'Responsive design', 'Basic animations', 'Source code included']
  },
  {
    id: 'standard',
    name: 'Full Application',
    price: 1500,
    delivery: '14 Days',
    revisions: 5,
    isPopular: true,
    description: 'Complete frontend application with state management and API integration.',
    features: ['Up to 5 Pages', 'Redux/Context setup', 'API Integration', 'Advanced animations', 'Source code included', '1 Week Support']
  },
  {
    id: 'premium',
    name: 'Enterprise Architecture',
    price: 3500,
    delivery: '30 Days',
    revisions: 'Unlimited',
    description: 'Scalable architecture, testing, and full deployment setup for complex platforms.',
    features: ['Unlimited Pages', 'Full stack integration', 'Unit & E2E Testing', 'CI/CD Setup', 'Source code included', '1 Month Support', 'SEO Optimization']
  }
];

const ServiceCatalog = () => {
  return (
    <>
      <div className="bg-surface-dark text-white py-16 text-center">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          <Package className="w-12 h-12 text-[#4C1D95] mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sarah's Service Catalog</h1>
          <p className="text-zinc-400 text-lg">
            Choose a pre-defined service package for clear deliverables, timeline, and pricing.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-16 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PACKAGES.map((pkg) => (
            <div key={pkg.id} className={`bg-white rounded-2xl border ${pkg.isPopular ? 'border-[#4C1D95]/20 shadow-xl shadow-#4C1D95]/10 relative' : 'border-zinc-200 shadow-sm'} flex flex-col overflow-hidden`}>
              {pkg.isPopular && (
                <div className="bg-[#4C1D95] text-white text-xs font-bold uppercase tracking-wider text-center py-1.5">
                  Most Popular
                </div>
              )}
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-zinc-900 mb-2">{pkg.name}</h3>
                <p className="text-zinc-500 text-sm mb-6 h-10">{pkg.description}</p>
                <div className="text-4xl font-black text-zinc-900 mb-6">
                  ${pkg.price}
                </div>
                
                <div className="flex items-center gap-4 text-sm font-medium text-zinc-700 mb-6 pb-6 border-b border-zinc-100">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-zinc-400" /> {pkg.delivery}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-zinc-400" /> {pkg.revisions} Revisions
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8 flex-1">
                  {pkg.features.map(feature => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-success flex-shrink-0" />
                      <span className="text-sm text-zinc-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-3.5 rounded-xl font-bold transition-colors ${
                  pkg.isPopular 
                    ? 'bg-[#4C1D95] hover:bg-[#22C55E] text-white' 
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900'
                }`}>
                  Select {pkg.name}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-surface rounded-2xl p-8 max-w-4xl mx-auto border border-zinc-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2">Need a custom solution?</h3>
            <p className="text-zinc-600">If your project doesn't fit into these packages, we can create a custom milestone-based contract.</p>
          </div>
          <button className="flex items-center gap-2 bg-surface-dark text-white px-6 py-3 rounded-xl font-medium whitespace-nowrap hover:bg-zinc-800 transition-colors">
            Request Custom Quote <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
};

export default ServiceCatalog;



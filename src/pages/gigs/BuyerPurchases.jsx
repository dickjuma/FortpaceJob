import React, { useState } from 'react';
import { ShoppingBag, Download, Star, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_PURCHASES = [
  { id: 'ORD-9823', seller: 'DesignPro_Studio', gig: 'Modern minimalist logo', tier: 'Premium', price: 120, status: 'delivered', date: 'Oct 24, 2026' },
  { id: 'ORD-9810', seller: 'DevMaster', gig: 'React Landing Page', tier: 'Standard', price: 65, status: 'in_progress', date: 'Oct 20, 2026' },
  { id: 'ORD-9750', seller: 'SEO_Guru', gig: 'Website SEO Audit', tier: 'Basic', price: 25, status: 'completed', date: 'Sep 15, 2026' },
];

const BuyerPurchases = () => {
  const [activeTab, setActiveTab] = useState('active'); // active, completed, cancelled

  const getFiltered = () => {
    if(activeTab === 'active') return MOCK_PURCHASES.filter(p => ['in_progress', 'delivered'].includes(p.status));
    return MOCK_PURCHASES.filter(p => p.status === activeTab);
  };

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center shadow-sm">
              <ShoppingBag className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-zinc-900">My Purchases</h1>
              <p className="text-zinc-600 font-medium">Track your bought gigs, download deliveries, and leave reviews.</p>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="flex border-b border-zinc-200 bg-surface/50">
              {['active', 'completed', 'cancelled'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 sm:flex-none px-8 py-4 font-bold text-sm transition-colors border-b-2 capitalize ${activeTab === tab ? 'border-brand-600 text-brand-600 bg-white' : 'border-transparent text-zinc-500 hover:text-zinc-900 hover:bg-surface'}`}
                >
                  {tab} Orders
                </button>
              ))}
            </div>

            <div className="p-6 md:p-8">
              {getFiltered().length === 0 ? (
                <div className="py-20 text-center text-zinc-500">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="font-medium">No purchases found.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {getFiltered().map(order => (
                    <div key={order.id} className="border border-zinc-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                        <div>
                          <div className="text-xs font-bold text-zinc-400 mb-1">{order.id} • Purchased {order.date}</div>
                          <Link to={`/gigs/gig/1`} className="text-lg font-bold text-zinc-900 hover:text-brand-600 transition-colors block mb-1">
                            {order.gig}
                          </Link>
                          <div className="text-sm font-medium text-zinc-500">
                            Seller: <Link to={`/profile`} className="text-zinc-900 font-bold hover:underline">{order.seller}</Link> • {order.tier} Tier
                          </div>
                        </div>
                        <div className="text-2xl font-black text-zinc-900">
                          ${order.price}
                        </div>
                      </div>

                      <div className="bg-surface border border-zinc-100 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${order.status === 'delivered' ? 'bg-brand-500' : order.status === 'completed' ? 'bg-success' : 'bg-brand-500'}`}></span>
                          <span className="font-bold text-sm text-zinc-700 capitalize">{order.status.replace('_', ' ')}</span>
                        </div>
                        <div className="flex w-full sm:w-auto gap-2">
                          <button className="flex-1 sm:flex-none p-2.5 bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900 rounded-lg shadow-sm transition-colors flex items-center justify-center">
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          {order.status === 'delivered' && (
                            <>
                              <button className="flex-1 sm:flex-none px-4 py-2.5 bg-brand-100 hover:bg-brand-200 text-brand-700 font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                                <Download className="w-4 h-4" /> Files
                              </button>
                              <button className="flex-1 sm:flex-none px-4 py-2.5 bg-success hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition-colors text-sm">
                                Approve Delivery
                              </button>
                            </>
                          )}
                          {order.status === 'completed' && (
                            <button className="flex-1 sm:flex-none px-4 py-2.5 bg-white border border-zinc-300 hover:bg-surface text-zinc-700 font-bold rounded-lg shadow-sm transition-colors text-sm flex items-center justify-center gap-2">
                              <Star className="w-4 h-4 text-amber-500 fill-current" /> Leave Review
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default BuyerPurchases;

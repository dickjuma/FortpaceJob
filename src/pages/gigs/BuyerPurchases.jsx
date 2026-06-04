import React, { useMemo, useState } from 'react';
import { ShoppingBag, Download, Star, MessageSquare, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMyOrders } from '../../common/hooks/useGigsMarketplace';

const mapPurchase = (order) => ({
  id: order.id || order._id || order.orderNumber,
  seller: order.seller?.name || order.freelancerName || 'Seller',
  gig: order.gigTitle || order.gig?.title || order.title || 'Purchase',
  gigId: order.gigId || order.gig?.id,
  tier: order.packageName || order.tier || 'Standard',
  price: order.amount || order.price || order.total || 0,
  status: (order.status || 'pending').toLowerCase().replace(/\s+/g, '_'),
  date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : order.date || '—',
});

const BuyerPurchases = () => {
  const [activeTab, setActiveTab] = useState('active');
  const { orders, loading } = useMyOrders('buyer');

  const purchases = useMemo(() => orders.map(mapPurchase), [orders]);

  const getFiltered = () => {
    if (activeTab === 'active') {
      return purchases.filter((p) => ['in_progress', 'delivered', 'pending'].includes(p.status));
    }
    return purchases.filter((p) => p.status === activeTab);
  };

  const filtered = getFiltered();

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">

          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-[#2bb75c]/10 text-[#2bb75c] rounded-xl flex items-center justify-center shadow-sm">
              <ShoppingBag className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-zinc-900">My Purchases</h1>
              <p className="text-zinc-600 font-medium">Track your bought gigs, download deliveries, and leave reviews.</p>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="flex border-b border-zinc-200 bg-surface/50">
              {['active', 'completed', 'cancelled'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 sm:flex-none px-8 py-4 font-bold text-sm transition-colors border-b-2 capitalize ${activeTab === tab ? 'border-[#2bb75c]/20 text-[#2bb75c] bg-white' : 'border-transparent text-zinc-500 hover:text-zinc-900 hover:bg-surface'}`}
                >
                  {tab} Orders
                </button>
              ))}
            </div>

            <div className="p-6 md:p-8">
              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-[#2bb75c]" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-20 text-center text-zinc-500">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="font-medium">No purchases found.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filtered.map((order) => (
                    <div key={order.id} className="border border-zinc-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                        <div>
                          <div className="text-xs font-bold text-zinc-400 mb-1">{order.id} • Purchased {order.date}</div>
                          <Link to={`/gigs/gig/${order.gigId || ''}`} className="text-lg font-bold text-zinc-900 hover:text-[#2bb75c] transition-colors block mb-1">
                            {order.gig}
                          </Link>
                          <div className="text-sm font-medium text-zinc-500">
                            Seller: <span className="text-zinc-900 font-bold">{order.seller}</span> • {order.tier} Tier
                          </div>
                        </div>
                        <div className="text-2xl font-black text-zinc-900">${order.price}</div>
                      </div>

                      <div className="bg-surface border border-zinc-100 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${order.status === 'delivered' ? 'bg-[#2bb75c]' : order.status === 'completed' ? 'bg-success' : 'bg-amber-500'}`}></span>
                          <span className="font-bold text-sm text-zinc-700 capitalize">{order.status.replace('_', ' ')}</span>
                        </div>
                        <div className="flex w-full sm:w-auto gap-2">
                          <button type="button" className="flex-1 sm:flex-none p-2.5 bg-white border border-zinc-200 text-zinc-600 rounded-lg shadow-sm transition-colors flex items-center justify-center">
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          {order.status === 'delivered' && (
                            <>
                              <button type="button" className="flex-1 sm:flex-none px-4 py-2.5 bg-[#2bb75c]/10 text-[#2bb75c] font-bold rounded-lg flex items-center justify-center gap-2">
                                <Download className="w-4 h-4" /> Files
                              </button>
                              <button type="button" className="flex-1 sm:flex-none px-4 py-2.5 bg-success text-white font-bold rounded-lg shadow-sm text-sm">
                                Approve Delivery
                              </button>
                            </>
                          )}
                          {order.status === 'completed' && (
                            <button type="button" className="flex-1 sm:flex-none px-4 py-2.5 bg-white border border-zinc-300 text-zinc-700 font-bold rounded-lg shadow-sm text-sm flex items-center justify-center gap-2">
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


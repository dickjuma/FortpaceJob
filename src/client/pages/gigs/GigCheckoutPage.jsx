import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Check, ChevronRight, Loader2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { gigAPI, orderAPI } from '../../../platform/common/services/api';
import { useAuthStore } from '../../../platform/common/authStore';
import CheckoutFeeBreakdown from '../../../platform/components/payments/CheckoutFeeBreakdown';

function buildPackages(gig) {
  if (Array.isArray(gig?.packages) && gig.packages.length > 0) {
    return gig.packages.reduce((acc, pkg, index) => {
      const key = ['basic', 'standard', 'premium'][index] || `tier-${index}`;
      acc[key] = {
        name: pkg.name || key,
        price: Number(pkg.price || gig.price || 0),
        delivery: pkg.deliveryTime || gig.deliveryTime || 3,
        revisions: pkg.revisions ?? 1,
      };
      return acc;
    }, {});
  }

  const base = Number(gig?.price || 0);
  return {
    basic: { name: 'Basic', price: base, delivery: gig?.deliveryTime || 3, revisions: 1 },
    standard: { name: 'Standard', price: base * 2, delivery: (gig?.deliveryTime || 3) + 2, revisions: 3 },
    premium: { name: 'Premium', price: base * 3, delivery: (gig?.deliveryTime || 3) + 5, revisions: 'Unlimited' },
  };
}

export default function GigCheckoutPage() {
  const { gigId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const initialTier = searchParams.get('tier') || 'standard';
  const [selectedTier, setSelectedTier] = useState(initialTier);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login', { state: { from: `/gigs/checkout/${gigId}` }, replace: true });
    }
  }, [isAuthenticated, gigId, navigate]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const data = await gigAPI.getGig(gigId);
        if (!cancelled) setGig(data);
      } catch (err) {
        if (!cancelled) {
          toast.error(err.message || 'Could not load gig');
          navigate(`/gigs/gig/${gigId}`);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [gigId, navigate]);

  const packages = useMemo(() => (gig ? buildPackages(gig) : {}), [gig]);
  const activePackage = packages[selectedTier] || packages[Object.keys(packages)[0]];

  const handleCheckout = async () => {
    if (!gig) return;
    setProcessing(true);
    try {
      const order = await orderAPI.createOrder({
        gigId: gig.id || gigId,
        packageTier: selectedTier,
        amount: activePackage?.price,
      });
      const createdId = order?.id || order?.order?.id;
      setOrderId(createdId);
      setSuccess(true);
      toast.success('Order placed successfully');
    } catch (err) {
      toast.error(err.message || 'Checkout failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#4C1D95]" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4 pt-24">
        <div className="max-w-md w-full bg-white rounded-2xl border border-zinc-200 p-8 text-center shadow-lg">
          <div className="w-16 h-16 rounded-full bg-[#4C1D95]/10 text-[#4C1D95] flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Order confirmed</h1>
          <p className="text-zinc-600 mb-6">
            Your order{orderId ? ` #${orderId}` : ''} has been created. The seller will be notified to start work.
          </p>
          <Link
            to="/gigs/purchases"
            className="block w-full py-3 bg-[#4C1D95] text-white font-bold rounded-xl hover:bg-[#22C55E]"
          >
            View purchases
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        <Link to={`/gigs/gig/${gigId}`} className="text-sm font-medium text-zinc-500 hover:text-[#4C1D95] mb-6 inline-block">
          ← Back to gig
        </Link>

        <h1 className="text-3xl font-bold text-zinc-900 mb-2">Complete your order</h1>
        <p className="text-zinc-600 mb-8">{gig?.title}</p>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {Object.entries(packages).map(([key, pkg]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedTier(key)}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                  selectedTier === key ? 'border-[#4C1D95] bg-[#4C1D95]/5' : 'border-zinc-200 bg-white hover:border-zinc-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-zinc-900 capitalize">{pkg.name || key}</h3>
                    <p className="text-sm text-zinc-500 mt-1">
                      {pkg.delivery} day delivery · {pkg.revisions} revisions
                    </p>
                  </div>
                  <span className="text-xl font-black text-zinc-900">${pkg.price}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-6 h-fit shadow-sm">
            <h2 className="font-bold text-lg mb-4">Order summary</h2>
            <div className="flex justify-between text-zinc-600 mb-2">
              <span>Package</span>
              <span className="font-semibold text-zinc-900 capitalize">{selectedTier}</span>
            </div>
            <CheckoutFeeBreakdown
              subtotal={activePackage?.price}
              appliesTo="HIRE_COMMITMENT"
              className="mb-4"
            />
            <div className="flex items-start gap-2 text-xs text-zinc-500 mb-6 p-3 bg-zinc-50 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-[#4C1D95] shrink-0 mt-0.5" />
              Payment is held in the Forte Vault (escrow) until you approve delivery. Third-party escrow agent — not a bank.
            </div>
            <button
              type="button"
              onClick={handleCheckout}
              disabled={processing}
              className="w-full py-3.5 bg-[#4C1D95] hover:bg-[#22C55E] text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Place order <ChevronRight className="w-5 h-5" /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Tag, Percent, DollarSign, Calendar, TrendingUp, 
  Plus, Edit2, Trash2, Copy, CheckCircle2, BarChart3, Clock, AlertCircle, X, Search, Filter
} from 'lucide-react';

const formSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters").max(20),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.preprocess((val) => Number(val), z.number().min(1, "Value must be at least 1")),
  minPurchase: z.preprocess((val) => val ? Number(val) : undefined, z.number().min(0).optional()),
  maxUses: z.preprocess((val) => val ? Number(val) : undefined, z.number().min(1).optional()),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
});

const STATS = [
  { label: 'Active Promotions', value: '12', icon: Tag, color: 'text-[#14a800]', bg: 'bg-[#14a800]/5 dark:bg-[#14a800]/20' },
  { label: 'Total Redemptions', value: '1,248', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
  { label: 'Revenue Impact', value: '+$14.2k', icon: TrendingUp, color: 'text-[#14a800]', bg: 'bg-[#14a800]/5 dark:bg-[#14a800]/20' },
  { label: 'Expiring Soon', value: '3', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
];

export default function PromotionsCouponsCenterPage() {
  const [promotions, setPromotions] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      discountType: 'percentage',
      discountValue: 10
    }
  });

  const discountType = watch('discountType');

  const onSubmit = (data) => {
    const newPromo = {
      id: Math.random(),
      code: data.code.toUpperCase(),
      type: data.discountType,
      value: data.discountValue,
      status: 'active',
      redemptions: 0,
      maxUses: data.maxUses || null,
      expires: data.endDate
    };
    setPromotions([newPromo, ...promotions]);
    setIsCreateModalOpen(false);
    reset();
  };

  const copyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="px-2.5 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-medium border border-green-200 dark:border-green-800">Active</span>;
      case 'expired':
        return <span className="px-2.5 py-1 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 rounded-full text-xs font-medium border border-gray-200 dark:border-gray-700">Expired</span>;
      case 'scheduled':
        return <span className="px-2.5 py-1 bg-[#14a800]/10 text-[#14a800] dark:bg-[#14a800]/30 dark:text-[#14a800] rounded-full text-xs font-medium border border-[#14a800]/20 dark:border-[#14a800]/20">Scheduled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-gray-950 font-sans pb-20">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Promotions & Coupons</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your discount campaigns and track redemptions.</p>
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#14a800] hover:bg-[#118a00] text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Create Promotion
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* List of Promotions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Campaigns</h2>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -tranzinc-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search codes..." 
                      className="pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-surface dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#14a800] transition-shadow w-full sm:w-64"
                    />
                  </div>
                  <button className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 hover:bg-surface dark:hover:bg-gray-800 transition-colors">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-surface dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Code</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Discount</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Usage</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Expires</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    <AnimatePresence>
                      {promotions.map((promo) => (
                        <motion.tr 
                          key={promo.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-surface dark:hover:bg-gray-800/50 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-[#14a800] dark:text-[#14a800] bg-[#14a800]/5 dark:bg-[#14a800]/20 px-2 py-1 rounded">{promo.code}</span>
                              <button 
                                onClick={() => copyCode(promo.code, promo.id)}
                                className="text-gray-400 hover:text-[#14a800] transition-colors p-1"
                                title="Copy code"
                              >
                                {copiedId === promo.id ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                            {promo.type === 'percentage' ? `${promo.value}% OFF` : `$${promo.value} OFF`}
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(promo.status)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{promo.redemptions} used</span>
                              {promo.maxUses && (
                                <span className="text-xs text-gray-500 mt-0.5">out of {promo.maxUses}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {new Date(promo.expires).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 text-gray-400 hover:text-[#14a800] hover:bg-[#14a800]/5 dark:hover:bg-[#14a800]/20 rounded-lg transition-colors">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                onClick={() => setPromotions(promotions.filter(p => p.id !== promo.id))}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
                {promotions.length === 0 && (
                  <div className="p-12 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <Tag className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-900 dark:text-white font-medium">No promotions found</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Create your first promotion to get started.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Analytics Chart Widget */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Redemption Trend</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Past 7 days</p>
                </div>
                <div className="p-2 bg-surface dark:bg-gray-800 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div className="flex items-end gap-2 h-48 mt-4">
                {[30, 45, 25, 60, 40, 75, 55].map((height, i) => (
                  <div key={i} className="flex-1 bg-[#14a800]/5 dark:bg-[#14a800]/20 rounded-t-md relative group hover:bg-[#14a800]/10 dark:hover:bg-[#14a800]/40 transition-colors cursor-pointer">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="absolute bottom-0 w-full bg-[#14a800] dark:bg-[#14a800] rounded-t-md"
                    ></motion.div>
                    {/* Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -tranzinc-x-1/2 bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded pointer-events-none transition-opacity whitespace-nowrap shadow-lg">
                      {height * 10} Uses
                      <div className="absolute -bottom-1 left-1/2 -tranzinc-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-xs text-gray-500 dark:text-gray-400 font-medium">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#14a800] to-[#118a00] rounded-2xl p-6 text-white shadow-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                <TrendingUp className="w-32 h-32" />
              </div>
              <div className="flex items-center gap-2 mb-3 relative z-10">
                <AlertCircle className="w-5 h-5 text-[#14a800]" />
                <h3 className="text-lg font-bold">Pro Tips</h3>
              </div>
              <p className="text-[#14a800] text-sm mb-6 relative z-10 leading-relaxed">
                Offer a 20% discount on first-time orders to increase your conversion rate by up to 35%. Time-limited campaigns create a strong sense of urgency!
              </p>
              <button className="bg-white text-[#14a800] hover:bg-surface text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors relative z-10 w-full shadow-sm">
                Read Marketing Guide
              </button>
            </div>
          </div>
        </div>

        {/* Create Promotion Modal */}
        <AnimatePresence>
          {isCreateModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                onClick={() => setIsCreateModalOpen(false)}
              ></motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] md:max-h-[85vh]"
              >
                <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900 sticky top-0 z-10">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Promotion</h2>
                  <button onClick={() => setIsCreateModalOpen(false)} className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6 overflow-y-auto">
                  <form id="promo-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Coupon Code</label>
                      <div className="relative">
                        <Tag className="absolute left-3.5 top-1/2 -tranzinc-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                          type="text"
                          {...register('code')}
                          placeholder="e.g. SUMMER24"
                          className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white uppercase font-mono tracking-wide focus:ring-2 focus:ring-[#14a800] focus:border-[#14a800]/20 outline-none transition-shadow"
                        />
                      </div>
                      {errors.code && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.code.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Discount Type</label>
                        <select 
                          {...register('discountType')}
                          className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-[#14a800] focus:border-[#14a800]/20 outline-none transition-shadow appearance-none"
                        >
                          <option value="percentage">Percentage (%)</option>
                          <option value="fixed">Fixed Amount ($)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Value</label>
                        <div className="relative">
                          {discountType === 'percentage' ? (
                            <Percent className="absolute left-3.5 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-gray-400" />
                          ) : (
                            <DollarSign className="absolute left-3.5 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-gray-400" />
                          )}
                          <input 
                            type="number"
                            {...register('discountValue')}
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-[#14a800] focus:border-[#14a800]/20 outline-none transition-shadow"
                          />
                        </div>
                        {errors.discountValue && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.discountValue.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Min. Purchase ($)</label>
                        <input 
                          type="number"
                          {...register('minPurchase')}
                          placeholder="Optional"
                          className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-[#14a800] focus:border-[#14a800]/20 outline-none transition-shadow"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Max Uses</label>
                        <input 
                          type="number"
                          {...register('maxUses')}
                          placeholder="Unlimited"
                          className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-[#14a800] focus:border-[#14a800]/20 outline-none transition-shadow"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Start Date</label>
                        <div className="relative">
                          <Calendar className="absolute left-3.5 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-gray-400" />
                          <input 
                            type="date"
                            {...register('startDate')}
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-[#14a800] focus:border-[#14a800]/20 outline-none transition-shadow [&::-webkit-calendar-picker-indicator]:dark:filter [&::-webkit-calendar-picker-indicator]:dark:invert"
                          />
                        </div>
                        {errors.startDate && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.startDate.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">End Date</label>
                        <div className="relative">
                          <Calendar className="absolute left-3.5 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-gray-400" />
                          <input 
                            type="date"
                            {...register('endDate')}
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-[#14a800] focus:border-[#14a800]/20 outline-none transition-shadow [&::-webkit-calendar-picker-indicator]:dark:filter [&::-webkit-calendar-picker-indicator]:dark:invert"
                          />
                        </div>
                        {errors.endDate && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.endDate.message}</p>}
                      </div>
                    </div>

                  </form>
                </div>
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-surface dark:bg-gray-800/50 flex justify-end gap-3 sticky bottom-0 z-10">
                  <button 
                    type="button" 
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-5 py-2.5 font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 hover:bg-surface dark:hover:bg-gray-800 rounded-lg transition-colors shadow-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    form="promo-form"
                    type="submit"
                    className="px-6 py-2.5 font-medium text-white bg-[#14a800] hover:bg-[#118a00] rounded-lg transition-colors shadow-sm"
                  >
                    Generate Coupon
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

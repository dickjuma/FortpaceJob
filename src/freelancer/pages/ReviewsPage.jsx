import React, { useState, useMemo } from 'react';
import { 
  Star, MessageCircle, Filter, Search, ThumbsUp, MoreVertical, Reply, 
  MessageSquare, ShieldCheck, Sparkles, Check, AlertTriangle, Share2, Loader2
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import toast, { Toaster } from 'react-hot-toast';
import { useMyReceivedReviews, useReplyToReview } from '../../common/hooks/useReviews';

function mapReview(r) {
  return {
    id: r.id,
    client: r.reviewerName || 'Client',
    rating: Number(r.overallRating || r.rating) || 5,
    date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '',
    project: r.projectTitle || 'Project',
    content: r.comment || '',
    reply: r.reply || null,
    type: 'Contract',
    verified: true,
  };
}

export default function ReviewsPage() {
  const [filter, setFilter] = useState('All');
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const { data: apiReviews = [], isLoading, refetch } = useMyReceivedReviews();
  const replyMutation = useReplyToReview();

  const reviews = useMemo(() => apiReviews.map(mapReview), [apiReviews]);

  const handleReplySubmit = async (id) => {
    if (!replyText.trim()) {
      toast.error('Reply content cannot be empty.');
      return;
    }
    try {
      await replyMutation.mutateAsync({ reviewId: id, reply: replyText });
      setReplyingTo(null);
      setReplyText('');
      refetch();
    } catch {
      /* toast from mutation */
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-[#14a800]" />
      </div>
    );
  }

  const filteredReviews = reviews.filter(r => {
    if (filter === '5 Stars') return r.rating === 5;
    if (filter === 'Unanswered') return r.reply === null;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans animate-in slide-in-from-bottom-4 duration-500 relative">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-warning/15 text-warning rounded-xl border border-warning/20 shadow-sm">
              <Star className="w-6 h-6 fill-warning text-warning animate-pulse" />
            </div>
            <h1 className="text-3xl font-black text-text-primary tracking-tight">Reviews & Ratings Center</h1>
          </div>
          <p className="text-sm text-text-secondary mt-1 font-semibold">
            Evaluate client feedback, manage verified listings, and interact with professional responses.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side: Summary Score and Categories */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Main Success Score */}
          <Card className="bg-[#222222] text-white p-6 rounded-3xl border-none shadow-xl text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-warning/10 blur-[40px] rounded-full"></div>
            <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest">Success Rating</h3>
            <div className="flex items-baseline justify-center gap-1.5 mt-3 mb-2">
              <span className="text-5xl font-black">4.9</span>
              <span className="text-sm font-bold text-white/50">/ 5.0</span>
            </div>
            <div className="flex justify-center text-warning mb-4">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-warning" />)}
            </div>
            <p className="text-[10px] font-bold text-white/40">From 142 client projects</p>
          </Card>

          {/* Review Sentiment Analysis */}
          <Card className="p-6 border border-border bg-white shadow-sm space-y-4">
            <h4 className="font-black text-text-primary text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-border pb-2">
              <Sparkles className="w-4 h-4 text-success" /> AI Sentiment Summary
            </h4>
            <div className="space-y-2 text-[11px] font-semibold text-text-secondary leading-relaxed">
              <p>
                💡 Clients frequently praise <strong className="text-text-primary">technical quality</strong>, <strong className="text-text-primary">timely delivery</strong>, and <strong className="text-text-primary">stellar communications</strong>.
              </p>
            </div>
          </Card>

          {/* Categorized ratings sliders */}
          <Card className="p-6 border border-border bg-white shadow-sm space-y-4">
            <h4 className="font-black text-text-primary text-xs uppercase tracking-wider border-b border-border pb-2">
              Performance Indexes
            </h4>
            
            <div className="space-y-3 text-xs font-bold text-text-secondary">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Communication</span>
                  <span className="text-text-primary">5.0</span>
                </div>
                <div className="w-full h-1 bg-light-gray rounded-full overflow-hidden">
                  <div className="h-full bg-success rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Delivery Speed</span>
                  <span className="text-text-primary">4.9</span>
                </div>
                <div className="w-full h-1 bg-light-gray rounded-full overflow-hidden">
                  <div className="h-full bg-success rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Quality of Work</span>
                  <span className="text-text-primary">4.8</span>
                </div>
                <div className="w-full h-1 bg-light-gray rounded-full overflow-hidden">
                  <div className="h-full bg-success rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
            </div>
          </Card>

        </div>

        {/* Right side: Reviews List */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Filters */}
          <div className="flex items-center justify-between p-2.5 bg-white border border-border rounded-2xl shadow-sm">
            <div className="flex gap-1.5">
              {['All', '5 Stars', 'Unanswered'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all",
                    filter === f ? "bg-[#222222] text-white shadow-sm" : "text-text-secondary hover:text-text-primary hover:bg-light-gray"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="space-y-4">
            {filteredReviews.map(rev => (
              <Card key={rev.id} className="p-6 border border-border bg-white shadow-sm space-y-4 hover:border-success/20 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-text-primary text-sm">{rev.client}</h4>
                      {rev.verified && (
                        <span className="text-[9px] font-black uppercase tracking-wider text-success bg-success/15 px-2 py-0.5 rounded-md flex items-center gap-0.5 border border-success/20">
                          <ShieldCheck className="w-3 h-3" /> Verified Project
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] font-bold text-success uppercase tracking-wider mt-1">{rev.project} • {rev.type}</p>
                  </div>

                  <div className="flex items-center gap-1 bg-warning/10 border border-warning/20 rounded-xl px-2.5 py-1 text-xs font-black text-warning">
                    <Star className="w-4 h-4 fill-warning" />
                    <span>{rev.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed font-semibold">
                  "{rev.content}"
                </p>

                {rev.reply ? (
                  <div className="bg-light-gray/40 border border-border rounded-2xl p-4 ml-6 relative">
                    <div className="absolute top-4 -left-3 text-border">
                      <Reply size={20} className="scale-x-[-1]" />
                    </div>
                    <span className="text-[9px] font-black text-[#222222] uppercase tracking-wider block mb-1">Your reply</span>
                    <p className="text-xs text-text-primary font-medium">{rev.reply}</p>
                  </div>
                ) : replyingTo === rev.id ? (
                  <div className="ml-6 space-y-3 animate-in fade-in duration-200">
                    <textarea
                      placeholder="Formulate a polite, professional reply..."
                      rows="3"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full text-xs font-semibold text-text-primary border border-border rounded-xl p-3 bg-light-gray focus:bg-white focus:border-success outline-none"
                    ></textarea>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setReplyingTo(null)}>Cancel</Button>
                      <Button variant="primary" size="sm" onClick={() => handleReplySubmit(rev.id)}>Post Reply</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setReplyingTo(rev.id)} 
                      icon={<MessageSquare size={14} />}
                      className="rounded-xl px-4 py-2 font-bold text-xs"
                    >
                      Write Reply Response
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}

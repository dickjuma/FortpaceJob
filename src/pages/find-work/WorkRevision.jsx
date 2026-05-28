import React, { useState } from 'react';
import { RefreshCw, Paperclip, ArrowLeft, Send } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';

const WorkRevision = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if(description) {
      navigate(`/find-work/orders/${orderId || 'ORD-NEW'}`);
    }
  };

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          
          <Link to={`/find-work/orders/${orderId || 'ORD-NEW'}`} className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-brand-600 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Order
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-zinc-900 mb-2">Request a Revision</h1>
            <p className="text-zinc-600 font-medium">Explain what needs to be changed in the submitted delivery.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-sm">
            
            <div className="flex items-start gap-4 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6">
              <RefreshCw className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-900">Revision Guidelines</h4>
                <p className="text-sm font-medium text-amber-800 mt-1">Be as specific as possible. Point out exact timestamps, page numbers, or visual details that need adjusting so the provider can fix them quickly.</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-zinc-700 mb-2">What needs to be changed?</label>
              <textarea 
                rows="6"
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="E.g., The color on the hero section should be darker, and please fix the typo on page 3..."
                className="w-full p-4 bg-surface border border-zinc-200 rounded-xl focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 font-medium text-zinc-900 resize-y"
              ></textarea>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold text-zinc-700 mb-2">Attach Examples or Marked-up Files (Optional)</label>
              <div className="border-2 border-dashed border-zinc-300 bg-surface rounded-xl p-6 text-center hover:bg-zinc-100 transition-colors cursor-pointer group">
                <Paperclip className="w-6 h-6 text-zinc-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-sm font-bold text-zinc-700">Drop files here or click to browse</div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Link to={`/find-work/orders/${orderId || 'ORD-NEW'}`} className="px-6 py-3 bg-white border border-zinc-200 hover:bg-surface text-zinc-700 font-bold rounded-xl transition-colors">
                Cancel
              </Link>
              <button 
                type="submit" 
                disabled={!description}
                className={`px-8 py-3 font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 ${description ? 'bg-brand-600 hover:bg-brand-700 text-white' : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'}`}
              >
                <Send className="w-5 h-5" /> Send Request
              </button>
            </div>

          </form>

        </div>
      </div>
    </>
  );
};

export default WorkRevision;

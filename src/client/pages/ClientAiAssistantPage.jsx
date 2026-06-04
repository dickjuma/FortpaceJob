import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Send, Bot, User, BrainCircuit, 
  Target, Zap, DollarSign, ArrowRight, ShieldCheck,
  Star, Briefcase
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

const RECOMMENDATIONS = [
  { id: 'f1', name: 'Alex Rivera', role: 'Senior React Developer', matchScore: 98, rate: '$45/hr', avatar: 'https://i.pravatar.cc/150?u=a1', reason: 'Matches your budget and has exact experience in SaaS dashboards.' },
  { id: 'f2', name: 'Sarah Chen', role: 'Frontend Engineer', matchScore: 94, rate: '$55/hr', avatar: 'https://i.pravatar.cc/150?u=s1', reason: 'Highly rated for Framer Motion, but slightly above target budget.' }
];

export default function ClientAiAssistantPage() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hi! I'm your AI Hiring Assistant. I can help you analyze job descriptions, suggest optimal budgets, or recommend the perfect freelancers. What role are you looking to fill today?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const newMsg = { role: 'user', content: inputValue };
    setMessages([...messages, newMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: "I've analyzed your request for a Senior React Developer. Based on current market data, the optimal budget is $40-$60/hr. I've compiled a shortlist of top candidates who perfectly match your requirements." 
      }]);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans pb-24">
      
      {/* Header */}
      <div className="bg-white dark:bg-surface-dark border-b border-zinc-200 dark:border-zinc-800 pt-12 pb-8 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-2 flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-[#2bb75c]" /> AI Hiring Assistant
          </h1>
          <p className="text-zinc-500 font-medium">Automate your hiring workflow with intelligent recommendations.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Chat Interface */}
        <div className="flex-1 flex flex-col bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden h-[calc(100vh-12rem)]">
          
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-[#2bb75c]/5/50 dark:bg-[#2bb75c]/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2bb75c]/10 dark:bg-[#2bb75c]/20 flex items-center justify-center text-[#2bb75c] dark:text-[#2bb75c]">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 dark:text-white leading-tight">Forte AI</h3>
                <p className="text-xs font-bold text-success flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-success"></span> Online</p>
              </div>
            </div>
            <button className="text-xs font-bold text-zinc-400 hover:text-[#2bb75c] transition-colors">Clear Chat</button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {messages.map((msg, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
                key={i} 
                className={cn("flex gap-4 max-w-[85%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}
              >
                <div className={cn(
                  "w-8 h-8 shrink-0 rounded-full flex items-center justify-center", 
                  msg.role === 'user' ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-600" : "bg-[#2bb75c] text-white"
                )}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>
                <div className={cn(
                  "p-4 rounded-2xl text-sm font-medium",
                  msg.role === 'user' ? "bg-[#2bb75c] text-white rounded-tr-sm" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-tl-sm"
                )}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 max-w-[85%]">
                <div className="w-8 h-8 shrink-0 rounded-full bg-[#2bb75c] text-white flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 rounded-tl-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </motion.div>
            )}
          </div>

          <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-surface-dark">
            <div className="flex gap-2 mb-3 overflow-x-auto custom-scrollbar pb-1">
              {['Analyze my job post', 'Find UI Designers', 'Optimize my budget', 'Compare candidates'].map(suggestion => (
                <button 
                  key={suggestion}
                  onClick={() => { setInputValue(suggestion); }}
                  className="px-3 py-1.5 shrink-0 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:border-[#2bb75c]/50 hover:text-[#2bb75c] transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
            <form onSubmit={handleSend} className="relative">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Forte AI to help you hire..."
                className="w-full bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-4 pr-12 py-4 text-sm font-medium outline-none focus:border-[#2bb75c]/20 shadow-sm"
              />
              <button 
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="absolute right-2 top-1/2 -tranzinc-y-1/2 p-2 bg-[#2bb75c] hover:bg-[#1d8d38] disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Insights & Recommendations */}
        <div className="w-full lg:w-[420px] shrink-0 space-y-6">
          
          {/* Active Analysis */}
          <div className="bg-gradient-to-br from-[#2bb75c] to-[#1d8d38] rounded-3xl p-6 shadow-md text-white">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Target className="w-5 h-5" /> Job Analysis Engine</h3>
            
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <p className="text-xs font-bold text-[#2bb75c] uppercase tracking-wider mb-1">Optimal Budget</p>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-success" />
                  <span className="text-xl font-black">$45 - $65/hr</span>
                </div>
                <p className="text-xs font-medium text-white/80 mt-1">Based on 452 similar successful contracts.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <p className="text-xs font-bold text-[#2bb75c] uppercase tracking-wider mb-1">Time to Hire Forecast</p>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <span className="text-xl font-black">2 - 3 Days</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Candidate Recommendations */}
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#2bb75c]" /> Top Matches
              </h3>
              <span className="text-xs font-bold bg-[#2bb75c]/5 dark:bg-[#2bb75c]/10 text-[#2bb75c] dark:text-[#2bb75c] px-2 py-1 rounded-md">Live Update</span>
            </div>

            <div className="space-y-4">
              {RECOMMENDATIONS.map(freelancer => (
                <div key={freelancer.id} className="p-4 border border-zinc-100 dark:border-zinc-800 rounded-2xl hover:border-[#2bb75c]/20 dark:hover:border-[#2bb75c]/20 transition-colors bg-surface/50 dark:bg-zinc-800/50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-3">
                      <img src={freelancer.avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
                      <div>
                        <h4 className="font-bold text-zinc-900 dark:text-white text-sm">{freelancer.name}</h4>
                        <p className="text-xs font-medium text-zinc-500">{freelancer.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-success">{freelancer.matchScore}% Match</div>
                      <div className="text-xs font-bold text-zinc-900 dark:text-white">{freelancer.rate}</div>
                    </div>
                  </div>
                  
                  <div className="bg-[#2bb75c]/5 dark:bg-[#2bb75c]/10 rounded-xl p-3 border border-[#2bb75c]/20 dark:border-[#2bb75c]/20/30 mb-3">
                    <p className="text-xs font-medium text-[#2bb75c] dark:text-[#2bb75c] flex gap-2">
                      <BrainCircuit className="w-4 h-4 shrink-0 text-[#2bb75c]" />
                      {freelancer.reason}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-[#2bb75c] hover:bg-[#1d8d38] text-white text-xs font-bold rounded-lg transition-colors">Invite to Job</button>
                    <button className="px-4 py-2 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-bold rounded-lg transition-colors">Profile</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}


import React, { useState } from 'react';
import { Bot, Send, Sparkles, User, ShieldCheck } from 'lucide-react';

const FreelancerDiscoveryAi = () => {
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hi! I am Fortspace AI. Tell me what you need to build, and I will find the perfect team for you in seconds.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages([...messages, { type: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: `I found 3 exceptional React developers for your dashboard project. They are all Top Rated and available to start immediately.`,
        action: 'show_profiles'
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      <div className="bg-surface min-h-[calc(100vh-80px)] flex flex-col items-center py-10">
        <div className="w-full max-w-3xl bg-white border border-zinc-200 rounded-3xl shadow-xl overflow-hidden flex flex-col h-[700px]">
          
          <div className="bg-surface-dark text-white p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-[#4C1D95] rounded-full flex items-center justify-center shadow-lg border-2 border-zinc-800">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Fortspace Recruitment AI</h1>
              <p className="text-zinc-400 text-xs">Always online • Trained on 1M+ successful contracts</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-surface">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-4 max-w-[85%] ${msg.type === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.type === 'user' ? 'bg-zinc-200 text-zinc-600' : 'bg-[#4C1D95] text-white'}`}>
                  {msg.type === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div>
                  <div className={`p-4 rounded-2xl shadow-sm ${msg.type === 'user' ? 'bg-[#4C1D95] text-white rounded-tr-sm' : 'bg-white border border-zinc-200 text-zinc-800 rounded-tl-sm'}`}>
                    {msg.text}
                  </div>
                  
                  {msg.action === 'show_profiles' && (
                    <div className="mt-4 space-y-3">
                      <div className="bg-white border border-[#4C1D95]/20 rounded-xl p-4 shadow-sm flex items-center justify-between hover:border-[#4C1D95]/20 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <img src="https://ui-avatars.com/api/?name=Sarah+W&background=0D8ABC&color=fff" className="w-10 h-10 rounded-full" alt="avatar" />
                          <div>
                            <div className="font-bold text-sm text-zinc-900 flex items-center gap-1">Sarah W. <ShieldCheck className="w-3 h-3 text-[#4C1D95]" /></div>
                            <div className="text-xs text-zinc-500">React Specialist • $85/hr</div>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-surface-dark text-white text-xs font-bold rounded-lg">View</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-4 max-w-[85%]">
                <div className="w-10 h-10 rounded-full bg-[#4C1D95] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="bg-white border border-zinc-200 p-4 rounded-2xl rounded-tl-sm flex items-center gap-2 shadow-sm">
                  <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-zinc-200">
            <form onSubmit={handleSend} className="relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="E.g., I need a senior React dev for a 2-month dashboard project..."
                className="w-full bg-surface border border-zinc-200 rounded-2xl pl-6 pr-14 py-4 focus:outline-none focus:border-[#4C1D95]/20 focus:ring-1 focus:ring-[#4C1D95] shadow-inner"
              />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 -tranzinc-y-1/2 w-10 h-10 bg-[#4C1D95] hover:bg-[#22C55E] text-white rounded-xl flex items-center justify-center transition-colors shadow-md"
              >
                <Send className="w-4 h-4 ml-1" />
              </button>
            </form>
            <div className="text-center mt-3 text-xs text-zinc-400 font-medium flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3" /> Powered by Fortspace AI
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default FreelancerDiscoveryAi;



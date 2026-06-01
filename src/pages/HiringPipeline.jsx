import React from 'react';
import { Columns, MoreHorizontal, Plus } from 'lucide-react';

const HiringPipeline = () => {
  const KANBAN_DATA = [
    {
      title: 'Sourced (12)',
      color: 'border-[#14a800]/20',
      cards: [
        { name: 'Sarah W.', role: 'React Developer', rate: '$85/hr' },
        { name: 'David C.', role: 'Backend Engineer', rate: '$90/hr' },
        { name: 'Elena R.', role: 'UI/UX Designer', rate: '$70/hr' }
      ]
    },
    {
      title: 'Interviewing (3)',
      color: 'border-amber-500',
      cards: [
        { name: 'Marcus T.', role: 'Electrician', rate: '$95/hr', tag: 'Tomorrow 2PM' }
      ]
    },
    {
      title: 'Offer Sent (1)',
      color: 'border-[#14a800]/50',
      cards: [
        { name: 'TechFlow Agency', role: 'Dev Team', rate: '$150/hr', tag: 'Awaiting Signature' }
      ]
    },
    {
      title: 'Hired (24)',
      color: 'border-emerald-500',
      cards: [
        { name: 'Alex M.', role: 'Motion Designer', rate: '$65/hr' }
      ]
    }
  ];

  return (
    <>
      <div className="bg-surface min-h-screen py-8 h-screen flex flex-col overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 max-w-[1600px] flex-1 flex flex-col h-full">
          
          <div className="flex justify-between items-center mb-8 shrink-0">
            <div>
              <h1 className="text-2xl font-black text-zinc-900 flex items-center gap-2">
                <Columns className="w-6 h-6 text-[#14a800]" /> Hiring Pipeline
              </h1>
              <p className="text-zinc-600 text-sm mt-1">Drag and drop candidates across stages.</p>
            </div>
            <button className="px-4 py-2 bg-[#14a800] hover:bg-[#118a00] text-white text-sm font-bold rounded-lg transition-colors shadow-sm flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add Candidate
            </button>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4 flex-1 items-start snap-x snap-mandatory hide-scrollbar">
            
            {KANBAN_DATA.map((column, i) => (
              <div key={i} className="w-[350px] shrink-0 snap-start bg-zinc-100/50 border border-zinc-200 rounded-2xl flex flex-col max-h-full">
                <div className={`p-4 border-t-4 ${column.color} rounded-t-2xl bg-white border-b border-zinc-200 flex justify-between items-center shrink-0`}>
                  <h3 className="font-bold text-zinc-900">{column.title}</h3>
                  <button className="text-zinc-400 hover:text-zinc-900"><MoreHorizontal className="w-5 h-5" /></button>
                </div>
                
                <div className="p-3 overflow-y-auto flex-1 space-y-3 min-h-[200px]">
                  {column.cards.map((card, j) => (
                    <div key={j} className="bg-white border border-zinc-200 p-4 rounded-xl shadow-sm hover:border-[#14a800]/20 hover:shadow-md transition-all cursor-grab active:cursor-grabbing">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(card.name)}&background=random`} className="w-8 h-8 rounded-full" alt="avatar" />
                          <div>
                            <div className="font-bold text-zinc-900 text-sm">{card.name}</div>
                            <div className="text-xs text-zinc-500">{card.role}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="font-black text-zinc-900 text-sm">{card.rate}</div>
                        {card.tag && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-zinc-100 text-zinc-600 rounded">
                            {card.tag}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <button className="w-full py-3 flex items-center justify-center gap-1 text-sm font-bold text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200/50 rounded-xl transition-colors border border-transparent border-dashed hover:border-zinc-300">
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
              </div>
            ))}

          </div>

        </div>
      </div>
    </>
  );
};

export default HiringPipeline;

import React, { useState } from 'react';
import { 
  KanbanSquare, 
  MoreHorizontal, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MessageSquare,
  Paperclip,
  MapPin
} from 'lucide-react';

const initialColumns = [
  {
    id: 'col-1',
    title: 'Backlog / Pending',
    tasks: [
      { id: 't-1', title: 'Survey site B coordinates', assignee: 'Horizon Ops', tags: ['Onsite'], priority: 'Medium', comments: 2 },
      { id: 't-2', title: 'Draft Phase 2 Designs', assignee: 'Sarah J.', tags: ['Remote'], priority: 'Low', comments: 0 }
    ]
  },
  {
    id: 'col-2',
    title: 'In Progress (Active)',
    tasks: [
      { id: 't-3', title: 'Install CCTV Racks', assignee: 'TechTeam X', tags: ['Onsite', 'Geofenced'], priority: 'High', comments: 5 },
      { id: 't-4', title: 'Backend API Integration', assignee: 'Dev Squad', tags: ['Remote'], priority: 'High', comments: 12 }
    ]
  },
  {
    id: 'col-3',
    title: 'In Review / QA',
    tasks: [
      { id: 't-5', title: 'Security Audit Report', assignee: 'Alex M.', tags: ['Compliance'], priority: 'Critical', comments: 8 }
    ]
  },
  {
    id: 'col-4',
    title: 'Completed (Awaiting Escrow Release)',
    tasks: [
      { id: 't-6', title: 'Initial Server Setup', assignee: 'CloudWorks', tags: ['Remote'], priority: 'Medium', comments: 1 }
    ]
  }
];

export default function ClientTaskWorkspacePage() {
  const [columns] = useState(initialColumns);

  const getPriorityColor = (p) => {
    switch(p) {
      case 'Critical': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'High': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'Medium': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Low': return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20';
      default: return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 p-6 font-sans">
      <div className="max-w-[1600px] mx-auto h-[calc(100vh-48px)] flex flex-col">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-800 pb-6 mb-6 gap-4 shrink-0">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <KanbanSquare className="w-8 h-8 text-[#2bb75c]" />
              Agile Task Workspace
            </h1>
            <p className="text-zinc-400 mt-2 text-sm">
              Trello-inspired kanban boards linked to geofenced operations and escrow releases.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              <div className="w-8 h-8 rounded-full border-2 border-zinc-950 bg-[#2bb75c] flex items-center justify-center text-xs font-bold text-white z-30">SJ</div>
              <div className="w-8 h-8 rounded-full border-2 border-zinc-950 bg-emerald-500 flex items-center justify-center text-xs font-bold text-white z-20">HO</div>
              <div className="w-8 h-8 rounded-full border-2 border-zinc-950 bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300 z-10">+4</div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2bb75c] hover:bg-[#2bb75c] text-white rounded-lg text-sm font-medium transition-colors">
              <Plus className="w-4 h-4" />
              New Task
            </button>
          </div>
        </div>

        {/* Kanban Board Area */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
          <div className="flex gap-6 h-full items-start">
            
            {columns.map(col => (
              <div key={col.id} className="w-[320px] shrink-0 flex flex-col bg-zinc-900/40 border border-zinc-800/60 rounded-xl h-full max-h-full overflow-hidden backdrop-blur-sm">
                {/* Column Header */}
                <div className="p-4 border-b border-zinc-800/60 flex items-center justify-between bg-zinc-900/60 shrink-0">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    {col.title}
                    <span className="bg-zinc-800 text-zinc-300 text-xs px-2 py-0.5 rounded-full">
                      {col.tasks.length}
                    </span>
                  </h3>
                  <button className="text-zinc-500 hover:text-zinc-300">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Tasks List */}
                <div className="p-3 overflow-y-auto flex-1 space-y-3 custom-scrollbar">
                  {col.tasks.map(task => (
                    <div key={task.id} className="bg-zinc-950/80 border border-zinc-800 p-4 rounded-lg hover:border-zinc-700 hover:shadow-lg transition-all cursor-pointer group">
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {task.tags.map(tag => (
                          <span key={tag} className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-sm bg-zinc-800 text-zinc-300">
                            {tag}
                          </span>
                        ))}
                        <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-sm border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      
                      <h4 className="font-medium text-white mb-3 group-hover:text-[#2bb75c] transition-colors">
                        {task.title}
                      </h4>
                      
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-zinc-800/60">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-white">
                            {task.assignee.substring(0,2).toUpperCase()}
                          </div>
                          <span className="text-xs text-zinc-400">{task.assignee}</span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-zinc-500 text-xs">
                          {task.tags.includes('Geofenced') && (
                            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                          )}
                          {task.comments > 0 && (
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>{task.comments}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                    </div>
                  ))}
                  
                  {/* Add task button */}
                  <button className="w-full py-2.5 border border-dashed border-zinc-700 text-zinc-400 rounded-lg hover:border-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30 transition-all text-sm flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" /> Add Task
                  </button>
                </div>
              </div>
            ))}
            
            {/* Add Column */}
            <div className="w-[320px] shrink-0 h-14 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-xl flex items-center justify-center hover:bg-zinc-900/40 hover:border-zinc-600 transition-colors cursor-pointer text-zinc-400 text-sm font-medium">
              <Plus className="w-4 h-4 mr-2" /> Add Column
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}


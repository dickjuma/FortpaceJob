import React from 'react';
import { Hash, FileText, CheckSquare, Users, MessageSquare, Plus, MoreVertical, Video, Download } from 'lucide-react';

export default function WorkspaceDashboard() {
  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-surface-tertiary dark:bg-surface-dark-secondary font-sans">
      
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 bg-white dark:bg-surface-dark border-r border-gray-200 dark:border-surface-dark-border flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-surface-dark-border">
          <h2 className="font-bold text-gray-900 dark:text-white truncate">Enterprise Dashboard Redesign</h2>
          <p className="text-xs text-brand-600 mt-1 font-medium">Active Workspace</p>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-3 mb-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Channels</h3>
            <div className="space-y-1">
              <button className="w-full flex items-center px-2 py-1.5 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 rounded-md text-sm font-medium">
                <Hash className="w-4 h-4 mr-2" /> general
              </button>
              <button className="w-full flex items-center px-2 py-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-dark-tertiary rounded-md text-sm font-medium">
                <Hash className="w-4 h-4 mr-2" /> design-feedback
              </button>
              <button className="w-full flex items-center px-2 py-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-dark-tertiary rounded-md text-sm font-medium">
                <Hash className="w-4 h-4 mr-2" /> api-integration
              </button>
            </div>
          </div>

          <div className="px-3 mb-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Tools</h3>
            <div className="space-y-1">
              <button className="w-full flex items-center px-2 py-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-dark-tertiary rounded-md text-sm font-medium">
                <CheckSquare className="w-4 h-4 mr-2" /> Task Board
              </button>
              <button className="w-full flex items-center px-2 py-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-dark-tertiary rounded-md text-sm font-medium">
                <FileText className="w-4 h-4 mr-2" /> Deliverables
              </button>
              <button className="w-full flex items-center px-2 py-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-dark-tertiary rounded-md text-sm font-medium">
                <Video className="w-4 h-4 mr-2" /> Meetings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat/Activity Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-surface-dark">
        <div className="h-16 border-b border-gray-200 dark:border-surface-dark-border px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center">
            <Hash className="w-5 h-5 text-gray-400 mr-2" />
            <h2 className="font-bold text-lg text-gray-900 dark:text-white">general</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-brand-500 border-2 border-white dark:border-surface-dark z-10"></div>
              <div className="w-8 h-8 rounded-full bg-brand-500 border-2 border-white dark:border-surface-dark z-0"></div>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-500 shrink-0"></div>
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-bold text-gray-900 dark:text-white">Alex Client</span>
                <span className="text-xs text-gray-500">10:42 AM</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">Hey Sarah, could you upload the latest Figma files for Milestone 2? I want to review them before our sync.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-500 shrink-0"></div>
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-bold text-gray-900 dark:text-white">Sarah Jenkins</span>
                <span className="text-xs text-gray-500">10:45 AM</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-3">Sure thing! Here is the exported PDF and the interactive prototype link.</p>
              <div className="flex gap-4">
                <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-surface-dark-border rounded-xl w-64 bg-surface-tertiary dark:bg-surface-dark-secondary">
                  <div className="w-10 h-10 bg-red-100 text-red-500 rounded-lg flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate text-gray-900 dark:text-white">M2_Designs_Final.pdf</p>
                    <p className="text-xs text-gray-500">4.2 MB</p>
                  </div>
                  <button className="text-gray-400 hover:text-brand-600"><Download className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 dark:border-surface-dark-border bg-white dark:bg-surface-dark">
          <div className="flex items-end gap-2 bg-surface dark:bg-surface-dark-secondary border border-gray-200 dark:border-surface-dark-border rounded-2xl p-2 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent transition-all">
            <button className="p-2 text-gray-400 hover:text-brand-600 rounded-full">
              <Plus className="w-5 h-5" />
            </button>
            <textarea 
              rows={1}
              placeholder="Message #general" 
              className="flex-1 bg-transparent border-none outline-none py-2 px-2 text-gray-900 dark:text-white resize-none max-h-32"
            />
            <button className="p-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-md transition-colors">
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

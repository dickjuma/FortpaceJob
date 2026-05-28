import React, { useEffect, useState } from 'react';
import { messageAPI } from '../../common/services/api';

export default function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const data = await messageAPI.getConversations();
      setConversations(data.conversations || data.data || []);
    } catch (err) {
      setError('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="p-8">Loading messages...</div>;

  return (
    <div className="max-w-6xl mx-auto py-8 flex h-[calc(100vh-100px)]">
      {/* Sidebar: Conversations List */}
      <div className="w-1/3 bg-white dark:bg-surface-dark-secondary rounded-l-xl shadow border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold dark:text-white">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No conversations yet.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {conversations.map(conv => (
                <li key={conv.id} className="p-4 hover:bg-surface dark:hover:bg-surface-dark cursor-pointer transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-brand-200 flex-shrink-0 flex items-center justify-center text-brand-700 font-bold">
                      {conv.participantName?.[0] || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {conv.participantName || 'User'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {conv.lastMessage || 'Start a conversation'}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Main Content: Chat Window */}
      <div className="flex-1 bg-surface dark:bg-surface-dark rounded-r-xl shadow flex flex-col">
        <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
          Select a conversation to start chatting.
        </div>
        {/* Placeholder for Message Input Area */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark-secondary rounded-br-xl flex space-x-2">
          <input 
            type="text" 
            placeholder="Type your message..." 
            className="flex-1 rounded-md border-gray-300 dark:border-gray-600 bg-surface-white dark:bg-surface-dark focus:border-brand-500 focus:ring-brand-500"
            disabled
          />
          <button disabled className="bg-brand-600 text-white px-4 py-2 rounded-md opacity-50 cursor-not-allowed">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// @ts-nocheck
import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Avatar } from '../../components/common/Avatar';
import { Search, Star, MoreVertical, Send, Paperclip, MessageSquare } from 'lucide-react';
import clsx from 'clsx';



const mockMessages: Message[] = [
  { id: '1', senderName: 'Alice Smith', preview: 'Could you review the latest designs?', timestamp: '10:30 AM', isRead: false, isStarred: true },
  { id: '2', senderName: 'Bob Johnson', preview: 'I have submitted the invoice for last week.', timestamp: 'Yesterday', isRead: true, isStarred: false },
  { id: '3', senderName: 'Charlie Brown', preview: 'When can we schedule the kickoff meeting?', timestamp: 'May 20', isRead: true, isStarred: false },
  { id: '4', senderName: 'Diana Prince', preview: 'Thanks for the quick response!', timestamp: 'May 18', isRead: true, isStarred: true },
  { id: '5', senderName: 'Evan Wright', preview: 'Here are the assets you requested.', timestamp: 'May 15', isRead: true, isStarred: false },
];

export const MessagesPage = () => {
  const [selectedMessage, setSelectedMessage] = useState('1');
  const [replyText, setReplyText] = useState('');

  return (
    <div className="h-[calc(100vh-8rem)] bg-white rounded-lg shadow-sm border border-border flex overflow-hidden">
      {/* Left Panel: Message List */}
      <div className="w-1/3 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-navy">Messages</h2>
            <Button variant="primary" size="sm">Compose</Button>
          </div>
          <Input 
            placeholder="Search messages..." 
            icon={<Search size={16} />}
            className="mb-0"
          />
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {mockMessages.map(msg => (
            <div 
              key={msg.id}
              onClick={() => setSelectedMessage(msg.id)}
              className={clsx(
                'p-4 border-b border-border cursor-pointer transition-colors flex items-start space-x-3',
                selectedMessage === msg.id ? 'bg-accent-purple/20 border-l-4 border-l-accent-purple' : 'hover:bg-light-gray',
                !msg.isRead && 'bg-gray-50'
              )}
            >
              <Avatar name={msg.senderName} src={msg.senderAvatar} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={clsx('text-sm truncate', !msg.isRead ? 'font-bold text-navy' : 'font-medium text-navy')}>
                    {msg.senderName}
                  </h4>
                  <span className="text-xs text-text-secondary shrink-0">{msg.timestamp}</span>
                </div>
                <p className={clsx('text-xs truncate', !msg.isRead ? 'font-semibold text-text-primary' : 'text-text-secondary')}>
                  {msg.preview}
                </p>
              </div>
              <button className="shrink-0 text-text-secondary hover:text-warning transition-colors">
                <Star size={16} className={msg.isStarred ? 'fill-warning text-warning' : ''} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel: Message Thread */}
      {selectedMessage ? (
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-border flex justify-between items-center bg-white">
            <div className="flex items-center space-x-3">
              <Avatar name="Alice Smith" size="md" status="online" />
              <div>
                <h3 className="font-bold text-navy">Alice Smith</h3>
                <p className="text-xs text-text-secondary">alice@example.com</p>
              </div>
            </div>
            <button className="p-2 text-text-secondary hover:bg-light-gray rounded-full transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 bg-light-gray/30 space-y-6">
            {/* Thread messages */}
            <div className="flex justify-center">
              <span className="text-xs font-medium text-text-secondary bg-white px-3 py-1 rounded-full border border-border shadow-sm">Today</span>
            </div>
            
            <div className="flex items-end space-x-3">
              <Avatar name="Alice Smith" size="sm" />
              <div className="bg-white border border-border p-4 rounded-lg rounded-bl-none max-w-xl shadow-sm">
                <p className="text-sm text-text-primary">Hi Admin, could you please review the latest designs I uploaded to the project folder?</p>
                <p className="text-[10px] text-text-secondary mt-2 text-right">10:30 AM</p>
              </div>
            </div>
            
            <div className="flex items-end space-x-3 flex-row-reverse space-x-reverse">
              <Avatar name="Admin User" size="sm" />
              <div className="bg-accent-purple border border-accent-purple p-4 rounded-lg rounded-br-none max-w-xl shadow-sm text-navy">
                <p className="text-sm font-medium">I'll take a look right now and get back to you within the hour.</p>
                <p className="text-[10px] text-navy/70 mt-2 text-right">10:45 AM</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-white border-t border-border">
            <div className="flex items-end space-x-2">
              <button className="p-3 text-text-secondary hover:bg-light-gray hover:text-navy rounded-full transition-colors">
                <Paperclip size={20} />
              </button>
              <div className="flex-1 bg-light-gray rounded-lg border border-border focus-within:border-accent-red focus-within:ring-1 focus-within:ring-accent-red transition-all">
                <textarea 
                  className="w-full bg-transparent p-3 text-sm focus:outline-none resize-none min-h-[60px] custom-scrollbar"
                  placeholder="Type your message here..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
              </div>
              <Button variant="primary" className="h-[60px] w-[60px] rounded-lg shrink-0">
                <Send size={20} />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-light-gray/30">
          <div className="text-center text-text-secondary">
            <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
            <p>Select a message to view the thread</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;

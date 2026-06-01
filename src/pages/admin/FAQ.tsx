// @ts-nocheck
import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  { id: '1', question: 'How do I change my payout method?', answer: 'You can update your payout method by navigating to Settings > Account > Billing. From there, select "Add Payout Method" and follow the secure prompts.' },
  { id: '2', question: 'What is the platform fee?', answer: 'The Fortespace charges a flat 10% fee on all completed projects. This covers payment processing, dispute resolution, and platform maintenance.' },
  { id: '3', question: 'How do I dispute a contract?', answer: 'If you need to dispute a contract, go to the active job page and click "Report Issue". Our moderation team will step in within 24 hours to mediate.' },
  { id: '4', question: 'Can I change my username?', answer: 'Usernames are currently permanent. However, you can freely change your display name in your Profile Settings.' },
];

export const FAQPage = () => {
  const [openId, setOpenId] = useState('1');

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center py-8 bg-white rounded-lg border border-border shadow-sm mb-8 text-center px-4">
        <h1 className="text-3xl font-bold text-[#222222] mb-4">How can we help?</h1>
        <div className="w-full max-w-xl mx-auto">
          <Input 
            placeholder="Search the knowledge base..." 
            icon={<Search size={20} />} 
            className="mb-0 shadow-sm"
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-[#222222] mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {faqs.map(faq => (
            <Card 
              key={faq.id} 
              className="cursor-pointer transition-all duration-200"
              onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
            >
              <div className="flex justify-between items-center font-medium text-[#222222]">
                <span className="text-lg">{faq.question}</span>
                <span className="text-text-secondary">
                  {openId === faq.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </span>
              </div>
              
              {openId === faq.id && (
                <div className="mt-4 text-text-primary border-t border-border pt-4">
                  <p>{faq.answer}</p>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center bg-light-gray p-8 rounded-lg">
          <h3 className="text-lg font-bold text-[#222222] mb-2">Still need help?</h3>
          <p className="text-text-secondary mb-6">Our support team is available 24/7 to assist you.</p>
          <Button variant="primary">Contact Support</Button>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;

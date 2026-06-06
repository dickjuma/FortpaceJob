// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '../../common/services/api';

export const FAQPage = () => {
  const [openId, setOpenId] = useState('1');
  const [searchTerm, setSearchTerm] = useState('');
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    api
      .get('/admin_rbc/faqs')
      .then(({ data }) => {
        if (!active) return;
        setFaqs(data.items || data.faqs || []);
      })
      .catch((err) => {
        if (!active) return;
        setError(err?.message || 'Unable to load FAQ content.');
      })
      .finally(() => {
        if (!active) return;
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center py-8 bg-white rounded-lg border border-border shadow-sm mb-8 text-center px-4">
        <h1 className="text-3xl font-bold text-[#222222] mb-4">How can we help?</h1>
        <div className="w-full max-w-xl mx-auto">
          <Input
            placeholder="Search the knowledge base..."
            icon={<Search size={20} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-0 shadow-sm"
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-[#222222] mb-6">Frequently Asked Questions</h2>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 mb-4">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-100 p-8 text-center text-zinc-500 animate-pulse">
            Loading FAQ content...
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.length === 0 ? (
              <div className="text-text-secondary py-8 text-center">No FAQ entries found.</div>
            ) : (
              filteredFaqs.map((faq) => (
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
              ))
            )}
          </div>
        )}

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

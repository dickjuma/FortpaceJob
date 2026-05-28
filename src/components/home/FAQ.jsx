import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Container from '../common/Container';
import SectionTitle from '../common/SectionTitle';

const FAQS = [
  {
    question: 'How does the escrow payment system work?',
    answer: 'When a contract is initiated, the client deposits the funds into a secure escrow account. The funds are held there safely and are only released to the freelancer once the agreed-upon milestones are completed and approved by the client.'
  },
  {
    question: 'What happens if there is a dispute?',
    answer: 'Forte offers a built-in dispute resolution center. If a disagreement arises, our mediation team steps in to review the communication, files, and contract terms to ensure a fair resolution for both parties.'
  },
  {
    question: 'Is Forte free to join for freelancers?',
    answer: 'Yes! Creating a profile and browsing jobs is 100% free. Forte only charges a small service fee on earnings when you successfully complete a project and get paid.'
  },
  {
    question: 'How does Forte verify its talent?',
    answer: 'We use a combination of AI-driven portfolio analysis, identity verification checks, and peer reviews. Freelancers can also take skill tests to earn "Verified" badges on their profiles.'
  },
  {
    question: 'Can I hire a full-time employee through Forte?',
    answer: 'Absolutely. Many of our enterprise clients use Forte for long-term contract work and full-time placements. You can use our Enterprise workflows to manage ongoing payroll and compliance.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-24 bg-white border-b border-zinc-100">
      <Container>
        <SectionTitle 
          title="Frequently Asked Questions" 
          subtitle="Everything you need to know about how Forte works."
        />

        <div className="max-w-3xl mx-auto">
          {FAQS.map((faq, index) => (
            <div key={index} className="border-b border-zinc-200 last:border-0">
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full py-6 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="text-lg font-semibold text-zinc-900">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-zinc-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 text-zinc-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

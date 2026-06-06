import React, { useState } from 'react';
import { 
  Search, Book, PlayCircle, MessageCircle, 
  HelpCircle, Shield, CreditCard, User, 
  Briefcase, ArrowRight, Sparkles, PhoneCall, FileText, ChevronDown
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

const CATEGORIES = [
  { title: 'Getting Started', icon: Book, color: 'text-[#4C1D95]', bg: 'bg-[#4C1D95]/5 dark:bg-[#4C1D95]/10' },
  { title: 'Trust & Safety', icon: Shield, color: 'text-success', bg: 'bg-emerald-50 dark:bg-success/10' },
  { title: 'Payments & Billing', icon: CreditCard, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  { title: 'Account Settings', icon: User, color: 'text-[#4C1D95]', bg: 'bg-[#4C1D95]/5 dark:bg-[#4C1D95]/10' },
  { title: 'Finding Work', icon: Briefcase, color: 'text-[#4C1D95]', bg: 'bg-[#4C1D95]/5 dark:bg-[#4C1D95]/10' },
  { title: 'Hiring Talent', icon: Search, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10' },
];

const ARTICLES = [
  { title: 'Getting started with Fortespace', views: '12.4k', category: 'Getting Started' },
  { title: 'How the Fortescore rating works', views: '9.8k', category: 'Trust & Safety' },
  { title: 'Escrow payment protection explained', views: '8.5k', category: 'Payments & Billing' },
  { title: 'How to submit a bid that wins', views: '21k', category: 'Finding Work' },
  { title: 'Setting up two-factor authentication', views: '4.5k', category: 'Account Settings' },
  { title: 'Dispute resolution guidelines', views: '3.2k', category: 'Trust & Safety' },
];

function FAQItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl">
      <button
        type="button"
        className="w-full flex items-center justify-between p-4 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-bold text-zinc-900 dark:text-white text-sm">{item.question}</span>
        <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <p className="px-4 pb-4 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{item.answer}</p>
      )}
    </div>
  );
}

const FAQS = [
  {
    question: 'What is Fortespace?',
    answer: 'Fortespace is an online work marketplace designed to be the safest and most comprehensive platform in Africa. We connect Clients/Job Posters with a wide array of verified talent — from software developers and graphic designers to handymen and event planners — all secured by our proprietary Trust Guarantee (KYC, Escrow, and Fortescore).',
  },
  {
    question: 'How is Fortespace safer than other platforms?',
    answer: 'Because of our Trust Guarantee. We focus on Quality & Trust — every provider is KYC Verified and every transaction uses our secure Escrow system. This elevates our quality far above casual listings.',
  },
  {
    question: 'What is the Fortescore?',
    answer: 'It is our proprietary, custom algorithm for verifying and rating talent. It goes beyond simple stars by factoring in verified job success, verified job completion rate, on-time delivery, and peer reviews. For Clients, it ensures you hire with precision. For Providers, a high Fortescore is the fastest way to get priority visibility and secure high-value jobs.',
  },
  {
    question: 'How fast is the Mobile Money payout?',
    answer: 'Instant. Once the Client approves the job, the funds leave the Escrow account and are immediately processed to your linked Mobile Money wallet. We are optimized for African markets and currencies.',
  },
  {
    question: 'I\'m an SME. Why should I pay $5/month?',
    answer: 'That small fee buys you the Verified Business Badge and Priority Placement. You stop blending in with individual freelancers and get immediately seen by high-value Clients who need reliable, scalable teams. Your paid subscription drives a significantly higher Lifetime Value (LTV) for your business.',
  },
  {
    question: 'How do you prevent fraud and ensure security?',
    answer: 'We combat fraud with a multi-layered approach: KYC Verification: All Providers must complete mandatory verification using their National ID before offering services. Escrow Protection: Funds are held securely in an intermediary account until the work is formally approved by the Client. Secure Technology: Our platform uses advanced encryption and adheres to strict data security regulations to keep all user data protected.',
  },
  {
    question: 'Is Fortespace only for digital services like coding and design?',
    answer: 'Absolutely not. We are a "Name It All" marketplace. While we host top-tier digital talent, our platform is equally strong in physical and logistical services like plumbing, house cleaning, event planning, and moving services. Our goal is to be a one-stop shop for all service needs.',
  },
  {
    question: 'How much does it cost to post a job or hire talent?',
    answer: 'Posting a job and searching for talent are completely free for Clients/Job Posters. You only pay the agreed-upon price for the service itself, which is paid into the secure Escrow account.',
  },
  {
    question: 'What is the process for posting a job?',
    answer: 'You simply define the project scope and budget, use the Fortescore and location filters to select the desired Provider type, and publish the job to receive secured bids.',
  },
  {
    question: 'What if I am unhappy with the service provided?',
    answer: 'Since your funds are held in Escrow, they are protected. If a dispute arises, Fortespace provides a clear, documented dispute resolution process. We review the evidence and communication logs to make a final, binding decision regarding the release or return of funds.',
  },
  {
    question: 'Can I hire an SME Provider instead of an individual freelancer (P-IP)?',
    answer: 'Yes. When posting a job or searching, you can use the Provider Type filter to specifically search for SME Providers (Small-to-Medium Enterprises). These businesses have the Verified Business Badge, indicating they often have teams, processes, and higher capacity for larger or ongoing projects.',
  },
  {
    question: 'How do I become "KYC Verified"?',
    answer: 'After creating your profile, you will be prompted to complete the mandatory Know Your Customer (KYC) process, which requires submitting a copy of your National ID or equivalent government-issued document. This verification is essential to receive the KYC Verified Badge and access paid opportunities.',
  },
  {
    question: 'How long does it take to get paid?',
    answer: 'Payouts are instant upon client approval. Once the Client clicks "Approve Job," the funds are immediately processed from the Escrow account and sent to your linked Mobile Money wallet (e.g., M-Pesa, etc.). No more waiting for bank transfers.',
  },
  {
    question: 'What are the fees and subscription options for Providers?',
    answer: 'We offer a tiered model to match your ambitions: Individuals & Independent Professionals: Basic/Free — Basic profile visibility, 3 bids monthly on posted jobs. Pro/Premium — $2/month, Priority Placement in search results, enhanced portfolio features. SME/Verified Businesses — $5/month, Verified Business Badge, access to higher-value bulk jobs, higher visibility. Enterprise/Large Agencies/Corporates — $100/month, bulk hiring features. Note: Fortespace also takes a small service fee (10%-15%) from the Provider\'s final payment, depending on the job value.',
  },
  {
    question: 'Why should I pay a subscription if I can bid for free?',
    answer: 'The subscription is an investment in your visibility and credibility. Paying for a Pro or SME plan gives you Priority Placement in client searches, putting you at the top of the list when Clients are using the Fortescore filter.',
  },
  {
    question: 'How does the Escrow system work?',
    answer: 'When a Client agrees to hire you, they send the full payment to a holding account managed by Fortespace. This money is secure. The funds are only released to the Provider when the Client digitally signs off on the completed work. If the work is not approved, the funds stay secure until the dispute is resolved.',
  },
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = FAQS;

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans pb-24">
      
      {/* Hero Section */}
      <div className="bg-[#4C1D95] pt-24 pb-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#4C1D95]/30 to-transparent"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#4C1D95]/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">How can we help you?</h1>
          
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-6 top-1/2 -tranzinc-y-1/2 w-6 h-6 text-[#4C1D95]" />
            <input 
              type="text" 
              placeholder="Search for articles, tutorials, or topics..." 
              className="w-full bg-white dark:bg-surface-dark border-none rounded-2xl pl-16 pr-4 py-5 text-lg font-bold text-zinc-900 dark:text-white outline-none shadow-2xl focus:ring-4 focus:ring-[#4C1D95]/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="absolute right-3 top-1/2 -tranzinc-y-1/2 px-6 py-3 bg-[#4C1D95] hover:bg-[#22C55E] text-white font-bold rounded-xl transition-colors">
              Search
            </button>
          </div>

          <div className="mt-8 flex flex-wrap justify-center items-center gap-3 text-sm font-medium text-[#4C1D95]">
            <span>Popular:</span>
            {['Reset Password', 'Fees', 'Contact Support', 'Withdrawals'].map(term => (
              <span key={term} className="px-3 py-1.5 rounded-full border border-[#4C1D95]/20 hover:bg-[#22C55E] cursor-pointer transition-colors bg-[#22C55E]/50 backdrop-blur-sm">
                {term}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-16 relative z-20 flex flex-col lg:flex-row gap-8">
        
        <div className="flex-1 space-y-8">
          
          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map(cat => (
              <div key={cat.title} className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-lg hover:-tranzinc-y-1 transition-all cursor-pointer group">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", cat.bg)}>
                  <cat.icon className={cn("w-6 h-6", cat.color)} />
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-white mb-2">{cat.title}</h3>
                <p className="text-sm font-medium text-zinc-500">Find answers and tutorials related to {cat.title.toLowerCase()}.</p>
              </div>
            ))}
          </div>

          {/* Popular Articles */}
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Popular Articles</h2>
             
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {ARTICLES.map(article => (
                <button key={article.title} type="button" className="flex items-center justify-between p-3 rounded-xl hover:bg-surface dark:hover:bg-zinc-800 transition-colors group text-left">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-zinc-400 group-hover:text-[#4C1D95] transition-colors" />
                    <span className="font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors text-sm">{article.title}</span>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400">{article.views} views</span>
                </button>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-center">
              <button className="text-sm font-bold text-[#4C1D95] hover:underline flex items-center gap-1">
                View all articles <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Video Tutorials */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Video Tutorials</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="group cursor-pointer">
                  <div className="relative aspect-video rounded-2xl overflow-hidden mb-3 border border-zinc-200 dark:border-zinc-800 bg-surface-dark">
                    <img src={`https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80&random=${i}`} alt="Tutorial" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-[#4C1D95] transition-colors">
                        <PlayCircle className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <h3 className="font-bold text-zinc-900 dark:text-white text-sm group-hover:text-[#4C1D95] transition-colors">Getting started with Forte</h3>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Sidebar: Assistant & Contact */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          
          <div className="bg-gradient-to-br from-[#4C1D95] to-[#22C55E] rounded-3xl p-6 shadow-md text-white relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md"><Sparkles className="w-5 h-5" /></div>
              <h3 className="font-bold">AI Support Assistant</h3>
            </div>
            
            <p className="text-sm font-medium text-[#4C1D95] mb-6 leading-relaxed">
              Get instant answers to your questions. Our AI is trained on all support articles and platform rules.
            </p>
            
            <button className="w-full py-3 bg-white text-[#4C1D95] font-bold rounded-xl shadow-sm transition-transform hover:scale-105">
              Ask AI Assistant
            </button>
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <h3 className="font-bold text-zinc-900 dark:text-white mb-6">Need more help?</h3>
            
            <div className="space-y-4">
              <button className="w-full p-4 border border-zinc-200 dark:border-zinc-700 rounded-2xl flex items-center gap-4 hover:border-[#4C1D95]/20 transition-colors group text-left">
                <div className="w-10 h-10 bg-surface dark:bg-zinc-800 rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#4C1D95]/5 dark:group-hover:bg-[#4C1D95]/10 transition-colors">
                  <MessageCircle className="w-5 h-5 text-zinc-400 group-hover:text-[#4C1D95]" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white text-sm mb-0.5">Live Chat</h4>
                  <p className="text-xs font-medium text-zinc-500">Wait time: ~2 mins</p>
                </div>
              </button>

              <button className="w-full p-4 border border-zinc-200 dark:border-zinc-700 rounded-2xl flex items-center gap-4 hover:border-[#4C1D95]/20 transition-colors group text-left">
                <div className="w-10 h-10 bg-surface dark:bg-zinc-800 rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#4C1D95]/5 dark:group-hover:bg-[#4C1D95]/10 transition-colors">
                  <PhoneCall className="w-5 h-5 text-zinc-400 group-hover:text-[#4C1D95]" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white text-sm mb-0.5">Call Us</h4>
                  <p className="text-xs font-medium text-zinc-500">Available 24/7</p>
                </div>
              </button>

              <button className="w-full p-4 border border-zinc-200 dark:border-zinc-700 rounded-2xl flex items-center gap-4 hover:border-[#4C1D95]/20 transition-colors group text-left">
                <div className="w-10 h-10 bg-surface dark:bg-zinc-800 rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#4C1D95]/5 dark:group-hover:bg-[#4C1D95]/10 transition-colors">
                  <HelpCircle className="w-5 h-5 text-zinc-400 group-hover:text-[#4C1D95]" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white text-sm mb-0.5">Community Forum</h4>
                  <p className="text-xs font-medium text-zinc-500">Ask other users</p>
                </div>
              </button>
            </div>
          </div>

          </div>

          {/* FAQ */}
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((item) => (
                <FAQItem key={item.question} item={item} />
              ))}
            </div>
          </div>

        </div>
    </div>
  );
}



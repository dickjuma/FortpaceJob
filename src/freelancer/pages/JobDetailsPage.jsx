import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Clock, DollarSign, Briefcase, Bookmark, Share2, 
  ShieldCheck, Star, Paperclip, ChevronRight, FileText, CheckCircle2,
  AlertCircle, UploadCloud
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import toast, { Toaster } from 'react-hot-toast';

// --- Skeleton Loader ---
const JobDetailsSkeleton = () => (
  <div className="space-y-8 animate-pulse pb-12">
    <div className="h-8 w-32 bg-light-gray rounded-md mb-6"></div>
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1 space-y-6">
        <div className="h-48 bg-light-gray rounded-2xl"></div>
        <div className="h-64 bg-light-gray rounded-2xl"></div>
        <div className="h-48 bg-light-gray rounded-2xl"></div>
      </div>
      <div className="w-full lg:w-96 space-y-6">
        <div className="h-72 bg-light-gray rounded-2xl"></div>
        <div className="h-48 bg-light-gray rounded-2xl"></div>
      </div>
    </div>
  </div>
);

// --- Mock Data ---
const MOCK_JOB_DETAIL = {
  id: '1',
  title: 'Senior React Developer for FinTech Dashboard',
  type: 'Fixed Price',
  budget: 'KES 500,000',
  postedAt: 'Posted 2 hours ago',
  location: 'Worldwide',
  experienceLevel: 'Expert',
  projectLength: '3 to 6 months',
  description: `
We are Global Finance Corp, an emerging fintech startup based in London. We are looking for an experienced Senior React Developer to lead the frontend development of our new analytics dashboard. 

The dashboard will process large volumes of financial data in real-time, so performance and state management are critical. You will work closely with our backend engineering team and UI designers.

**Key Responsibilities:**
- Architect and develop scalable frontend systems using React and TypeScript.
- Implement complex data visualizations using Recharts and D3.js.
- Ensure strict accessibility standards and mobile responsiveness.
- Integrate secure WebSockets for real-time market data.

**Requirements:**
- Minimum 5 years of React experience.
- Deep understanding of Redux Toolkit or Zustand.
- Experience with WebSockets and real-time data feeds.
- Strong portfolio of enterprise SaaS dashboards.
  `,
  skills: ['React', 'TypeScript', 'Tailwind CSS', 'Redux', 'WebSockets', 'FinTech'],
  attachments: [
    { name: 'Dashboard_Wireframes.pdf', size: '2.4 MB' },
    { name: 'API_Documentation.md', size: '150 KB' }
  ],
  milestones: [
    { name: 'Initial Architecture & Auth Setup', amount: 'KES 100,000' },
    { name: 'Core Dashboard UI Implementation', amount: 'KES 200,000' },
    { name: 'Real-time WebSocket Integration', amount: 'KES 150,000' },
    { name: 'Testing & Final Handover', amount: 'KES 50,000' }
  ],
  client: {
    name: 'Global Finance Corp',
    rating: 4.9,
    reviews: 124,
    location: 'United Kingdom',
    joined: 'Jan 2021',
    totalSpent: 'KES 15M+',
    hires: 42,
    verified: true,
    paymentVerified: true
  }
};

export default function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [proposalText, setProposalText] = useState('');

  useEffect(() => {
    // Simulate API fetch
    const fetchJobDetails = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setJob(MOCK_JOB_DETAIL);
      setLoading(false);
    };
    fetchJobDetails();
  }, [id]);

  const handleApply = () => {
    if (!proposalText.trim()) {
      toast.error('Please write a cover letter first');
      return;
    }
    toast.loading('Submitting proposal...', { id: 'submit' });
    setTimeout(() => {
      toast.success('Proposal submitted successfully! 🚀', { id: 'submit' });
      setProposalText('');
    }, 1500);
  };

  if (loading) return <JobDetailsSkeleton />;
  if (!job) return <div className="text-center py-20 text-text-primary font-bold">Job not found.</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <Toaster position="top-right" />
      
      {/* Top Navigation */}
      <div className="flex items-center gap-4 text-sm font-bold text-text-secondary">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 hover:text-navy transition-colors">
          <ArrowLeft size={16} /> Back to Search
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column: Job Content */}
        <div className="flex-1 w-full space-y-6">
          
          {/* Header Card */}
          <Card className="bg-white border-border shadow-sm">
            <h1 className="text-3xl font-black text-text-primary tracking-tight mb-4 leading-tight">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-semibold text-text-secondary border-b border-border pb-6 mb-6">
              <span className="flex items-center gap-1.5"><Clock size={16} className="text-navy" /> {job.postedAt}</span>
              <span className="flex items-center gap-1.5"><MapPin size={16} className="text-navy" /> {job.location}</span>
              <span className="flex items-center gap-1.5"><Briefcase size={16} className="text-navy" /> {job.type}</span>
            </div>

            <div className="whitespace-pre-wrap text-sm text-text-secondary leading-relaxed mb-8">
              {job.description}
            </div>

            {/* Attachments */}
            {job.attachments && job.attachments.length > 0 && (
              <div className="mb-8">
                <h3 className="font-bold text-text-primary mb-3">Attachments</h3>
                <div className="flex flex-wrap gap-3">
                  {job.attachments.map((file, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-light-gray/50 group cursor-pointer hover:border-accent-purple/50 transition-colors" onClick={() => toast.success(`Downloading ${file.name}`)}>
                      <div className="p-2 bg-white rounded-md border border-border group-hover:bg-accent-purple/10 group-hover:text-accent-purple transition-colors">
                        <FileText size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-text-primary">{file.name}</p>
                        <p className="text-[10px] font-semibold text-text-secondary mt-0.5">{file.size}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Required Skills */}
            <div>
              <h3 className="font-bold text-text-primary mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map(skill => (
                  <span key={skill} className="text-[10px] font-bold bg-navy text-white px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </Card>

          {/* Project Milestones */}
          <Card className="bg-white border-border shadow-sm">
            <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-success" /> Project Milestones
            </h3>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-4 before:-tranzinc-x-px md:before:mx-auto md:before:tranzinc-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
              {job.milestones.map((milestone, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  {/* Icon */}
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white bg-light-gray text-text-secondary group-hover:bg-navy group-hover:text-white shrink-0 md:order-1 md:group-odd:-tranzinc-x-1/2 md:group-even:tranzinc-x-1/2 shadow-sm transition-colors z-10">
                    <span className="text-[10px] font-black">{i + 1}</span>
                  </div>
                  {/* Card */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border bg-white shadow-sm hover:border-navy transition-colors">
                    <p className="text-xs font-bold text-text-primary mb-1">{milestone.name}</p>
                    <p className="text-[10px] font-bold text-accent-purple uppercase tracking-widest">{milestone.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Fast Proposal Submission */}
          <Card className="bg-gradient-to-b from-white to-light-gray/30 border-border shadow-sm">
            <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
              <UploadCloud size={18} className="text-accent-red" /> Quick Proposal
            </h3>
            <div className="space-y-4">
              <textarea 
                className="w-full h-32 p-4 rounded-xl border border-border bg-white text-sm font-medium focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all resize-none shadow-sm"
                placeholder="Write a brief cover letter outlining why you are the best fit for this role..."
                value={proposalText}
                onChange={(e) => setProposalText(e.target.value)}
              />
              <div className="flex justify-end">
                <Button variant="primary" onClick={handleApply}>
                  Submit Quick Proposal
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Actions & Client Profile */}
        <div className="w-full lg:w-96 shrink-0 space-y-6 lg:sticky lg:top-24">
          
          {/* Action Card */}
          <Card className="bg-white border-border shadow-sm">
            <div className="space-y-4">
              <Button variant="primary" className="w-full shadow-lg" onClick={() => toast.success('Scrolling to proposal area...', { icon: '👇' })}>
                Apply Now
              </Button>
              <Button 
                variant="outline" 
                className={cn("w-full transition-colors", isSaved && "border-accent-purple text-accent-purple")} 
                onClick={() => {
                  setIsSaved(!isSaved);
                  toast(isSaved ? 'Removed from saved jobs' : 'Job saved successfully', { icon: isSaved ? '🗑️' : '🔖' });
                }}
              >
                <Bookmark size={16} className={cn("mr-2", isSaved && "fill-current")} /> 
                {isSaved ? 'Saved' : 'Save Job'}
              </Button>
              <Button variant="outline" className="w-full" onClick={() => toast.success('Link copied to clipboard')}>
                <Share2 size={16} className="mr-2" /> Share Job
              </Button>
            </div>
            
            <div className="mt-6 pt-6 border-t border-border space-y-4 text-center">
              <div className="flex flex-col items-center">
                <DollarSign size={24} className="text-navy mb-1" />
                <span className="text-xl font-black text-text-primary">{job.budget}</span>
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{job.type}</span>
              </div>
              <div className="flex justify-between items-center bg-light-gray/50 p-3 rounded-lg border border-border">
                <div className="flex items-center gap-2">
                  <Briefcase size={16} className="text-text-secondary" />
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Experience</p>
                    <p className="text-xs font-bold text-text-primary">{job.experienceLevel}</p>
                  </div>
                </div>
                <div className="w-px h-8 bg-border"></div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-text-secondary" />
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Duration</p>
                    <p className="text-xs font-bold text-text-primary">{job.projectLength}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Client Profile Card */}
          <Card className="bg-white border-border shadow-sm">
            <h3 className="font-bold text-text-primary mb-4 text-sm uppercase tracking-widest">About the Client</h3>
            <div className="space-y-4">
              <div>
                <p className="font-bold text-text-primary flex items-center gap-2">
                  {job.client.name}
                  {job.client.verified && <ShieldCheck size={14} className="text-success" />}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Star size={12} className="text-warning fill-current" />
                  <span className="text-xs font-bold text-text-primary">{job.client.rating}</span>
                  <span className="text-[10px] font-semibold text-text-secondary tracking-widest uppercase">({job.client.reviews} Reviews)</span>
                </div>
              </div>
              
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-secondary font-semibold">Location</span>
                  <span className="font-bold text-text-primary">{job.client.location}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-secondary font-semibold">Total Spent</span>
                  <span className="font-bold text-text-primary">{job.client.totalSpent}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-secondary font-semibold">Hires</span>
                  <span className="font-bold text-text-primary">{job.client.hires}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-secondary font-semibold">Member Since</span>
                  <span className="font-bold text-text-primary">{job.client.joined}</span>
                </div>
              </div>

              {job.client.paymentVerified && (
                <div className="mt-4 p-3 bg-success/10 rounded-lg flex items-start gap-2 border border-success/20">
                  <ShieldCheck size={16} className="text-success shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-success">Payment Method Verified</p>
                    <p className="text-[10px] font-semibold text-success/80 mt-0.5">This client has a verified payment method on file.</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

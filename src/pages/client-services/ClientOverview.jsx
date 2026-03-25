import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, BriefcaseBusiness, FilePlus2, Layers3, MessagesSquare, UserCircle2, WalletCards } from "lucide-react";
import { profileAPI } from "../../Services/api";
import { clientWorkspaceAPI } from "../../Services/clientWorkspaceAPI";

export default function ClientOverview() {
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    let mounted = true;

    Promise.allSettled([profileAPI.getMyProfile(), clientWorkspaceAPI.getMyJobs({ limit: 20 })]).then((results) => {
      if (!mounted) return;
      const [profileResult, jobsResult] = results;
      if (profileResult.status === "fulfilled") {
        setProfile(profileResult.value?.user || null);
      }
      if (jobsResult.status === "fulfilled") {
        setJobs(jobsResult.value?.data || jobsResult.value?.requests || []);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const jobStats = useMemo(() => {
    return jobs.reduce(
      (acc, job) => {
        acc.total += 1;
        acc.open += job.status === "open" ? 1 : 0;
        acc.closed += job.status === "closed" ? 1 : 0;
        acc.proposals += Number(job.proposalCount || 0);
        return acc;
      },
      { total: 0, open: 0, closed: 0, proposals: 0 }
    );
  }, [jobs]);

  const cards = [
    {
      title: "Manage profile",
      text: "Update company identity, contact details, phone verification, and hiring preferences.",
      to: "/client-services/profile",
      icon: UserCircle2,
    },
    {
      title: "Create job",
      text: "Post a new service request with scope, budget, location, and timeline.",
      to: "/client-services/create-job",
      icon: FilePlus2,
    },
    {
      title: "Manage jobs",
      text: "Track active requests, review proposal counts, and close completed jobs.",
      to: "/client-services/my-jobs",
      icon: Layers3,
    },
    {
      title: "Messages and payments",
      text: "Stay connected to your inbox and finance tools from the same client flow.",
      to: "/pricing",
      icon: WalletCards,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[32px] border border-[#E5D9D0] bg-[radial-gradient(circle_at_top_left,_#FFF7F2,_#F6EFEA_40%,_#FFFFFF_100%)] p-6 shadow-[0_22px_60px_rgba(33,24,21,0.08)] lg:p-8">
        <p className="text-sm uppercase tracking-[0.18em] text-[#7A665E]">Client Workspace</p>
        <h1 className="mt-3 text-3xl font-semibold text-[#2B211F]">A cleaner system for clients who need services</h1>
        <p className="mt-3 max-w-3xl text-sm text-[#6F5B53]">
          This client-side area is separate from freelancer tools, but it still connects to the same shared backend features for
          buyer requests, proposals, notifications, and admin workflows.
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-4">
          <div className="rounded-2xl bg-white/80 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[#8A766D]">Client</p>
            <p className="mt-2 text-lg font-semibold text-[#2B211F]">{profile?.companyName || profile?.name || "Your account"}</p>
          </div>
          <div className="rounded-2xl bg-white/80 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[#8A766D]">Open jobs</p>
            <p className="mt-2 text-lg font-semibold text-[#2B211F]">{jobStats.open}</p>
          </div>
          <div className="rounded-2xl bg-white/80 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[#8A766D]">Total proposals</p>
            <p className="mt-2 text-lg font-semibold text-[#2B211F]">{jobStats.proposals}</p>
          </div>
          <div className="rounded-2xl bg-white/80 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[#8A766D]">Email verified</p>
            <p className="mt-2 text-lg font-semibold text-[#2B211F]">{profile?.emailVerified ? "Yes" : "No"}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="rounded-[28px] border border-[#E5D9D0] bg-white p-5 shadow-[0_18px_45px_rgba(33,24,21,0.06)] transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="inline-flex rounded-2xl bg-[#FDECE7] p-3 text-[#B53A27]">
              <card.icon size={18} />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-[#2B211F]">{card.title}</h2>
            <p className="mt-2 text-sm text-[#6F5B53]">{card.text}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-[#E5D9D0] bg-white p-6 shadow-[0_18px_45px_rgba(33,24,21,0.06)]">
          <h2 className="text-xl font-semibold text-[#2B211F]">What clients can manage here</h2>
          <div className="mt-4 space-y-3 text-sm text-[#5E4D46]">
            <div className="rounded-2xl bg-[#FCFAF8] px-4 py-3">Keep your company profile polished and verified.</div>
            <div className="rounded-2xl bg-[#FCFAF8] px-4 py-3">Create jobs, edit briefs, and close requests when work is complete.</div>
            <div className="rounded-2xl bg-[#FCFAF8] px-4 py-3">Review proposals and move freelancers to shortlisted, accepted, or rejected.</div>
            <div className="rounded-2xl bg-[#FCFAF8] px-4 py-3">Jump into messages, wallet, and payments from the same client journey.</div>
          </div>
        </div>

        <div className="rounded-[28px] border border-[#E5D9D0] bg-[#2B211F] p-6 text-white shadow-[0_22px_50px_rgba(33,24,21,0.18)]">
          <div className="flex items-center gap-3">
            <BadgeCheck size={18} />
            <p className="text-lg font-semibold">How it stays integrated</p>
          </div>
          <p className="mt-3 text-sm text-white/80">
            Client tools are separate from freelancer tools, but every job still flows through the shared request, proposal, notification, admin, and payment systems underneath.
          </p>
          <Link
            to="/client-services/my-jobs"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-[#2B211F]"
          >
            Open job workspace
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr]">
        <Link to="/messages" className="rounded-[26px] border border-[#E5D9D0] bg-white p-5 shadow-[0_18px_45px_rgba(33,24,21,0.06)] transition hover:-translate-y-0.5">
          <MessagesSquare size={18} className="text-[#B53A27]" />
          <h2 className="mt-4 text-lg font-semibold text-[#2B211F]">Messages</h2>
          <p className="mt-2 text-sm text-[#6F5B53]">Stay in touch with freelancers and keep project communication moving.</p>
        </Link>
        <Link to="/wallet" className="rounded-[26px] border border-[#E5D9D0] bg-white p-5 shadow-[0_18px_45px_rgba(33,24,21,0.06)] transition hover:-translate-y-0.5">
          <WalletCards size={18} className="text-[#B53A27]" />
          <h2 className="mt-4 text-lg font-semibold text-[#2B211F]">Wallet and payments</h2>
          <p className="mt-2 text-sm text-[#6F5B53]">Review finance tools, linked payout methods, and payment readiness.</p>
        </Link>
        <Link to="/talent" className="rounded-[26px] border border-[#E5D9D0] bg-white p-5 shadow-[0_18px_45px_rgba(33,24,21,0.06)] transition hover:-translate-y-0.5">
          <BriefcaseBusiness size={18} className="text-[#B53A27]" />
          <h2 className="mt-4 text-lg font-semibold text-[#2B211F]">Browse talent</h2>
          <p className="mt-2 text-sm text-[#6F5B53]">Explore talent publicly, then come back and post a structured request.</p>
        </Link>
      </div>
    </div>
  );
}

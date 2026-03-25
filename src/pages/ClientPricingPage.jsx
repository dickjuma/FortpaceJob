// ClientPricingPage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  ChevronDown,
  ChevronUp,
  Crown,
  Rocket,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import { getToken, getUser } from "../Services/api";
import pricingPattern from "../Assets/hire-manage.jpg";

const plans = [
  {
    name: "Basic",
    price: "$29",
    period: "/month",
    icon: Sparkles,
    gradient: "from-[#FFF7ED] to-white",
    border: "border-[#F7E5D5]",
    shadow: "shadow-[0_8px_30px_rgba(0,0,0,0.04)]",
    hoverShadow: "hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]",
    cta: "Start Basic",
    summary: "For individuals or very small teams testing the platform.",
    features: [
      "Up to 3 active jobs",
      "Standard job posting tools",
      "Basic proposal review",
      "Email support",
    ],
    tag: null,
  },
  {
    name: "Pro",
    price: "$79",
    period: "/month",
    icon: Rocket,
    gradient: "from-[#FEF5F0] to-white",
    border: "border-[#F2DED4]",
    shadow: "shadow-[0_8px_30px_rgba(0,0,0,0.04)]",
    hoverShadow: "hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)]",
    cta: "Choose Pro",
    highlight: true,
    summary: "For growing clients hiring more often and needing faster delivery.",
    features: [
      "Up to 12 active jobs",
      "Priority proposal visibility",
      "Team-friendly job management",
      "Faster support response",
    ],
  },
  {
    name: "SMEs",
    price: "$169",
    period: "/month",
    icon: Building2,
    gradient: "from-[#F0F9FF] to-white",
    border: "border-[#E1F0FC]",
    shadow: "shadow-[0_8px_30px_rgba(0,0,0,0.04)]",
    hoverShadow: "hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]",
    cta: "Scale With SMEs",
    summary: "For established small and medium businesses managing ongoing hiring.",
    features: [
      "Up to 30 active jobs",
      "Shared hiring workspace",
      "Shortlisting and workflow support",
      "Dedicated onboarding assistance",
    ],
  },
  {
    name: "Corporate",
    price: "Custom",
    period: "",
    icon: Crown,
    gradient: "from-[#F6F0FF] to-white",
    border: "border-[#E9E0FF]",
    shadow: "shadow-[0_8px_30px_rgba(0,0,0,0.04)]",
    hoverShadow: "hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]",
    cta: "Talk To Sales",
    summary: "For larger organizations that need volume, governance, and custom support.",
    features: [
      "Unlimited hiring coordination",
      "Custom onboarding and support",
      "Advanced approval workflows",
      "Enterprise-style account management",
    ],
  },
];

const matrix = [
  { label: "Active client jobs", values: ["3", "12", "30", "Custom"] },
  { label: "Proposal review tools", values: ["Standard", "Priority", "Advanced", "Custom workflow"] },
  { label: "Support level", values: ["Email", "Priority", "Dedicated", "Managed account"] },
  { label: "Best for", values: ["Solo clients", "Growing teams", "SMEs", "Corporate teams"] },
];

const additionalFeatures = [
  "Client profile and company setup",
  "Job posting and job editing workspace",
  "Proposal review and freelancer shortlisting",
  "Messages, wallet, and payment connection",
];

export default function ClientPricingPage() {
  const isAuthenticated = Boolean(getToken());
  const user = getUser();
  const clientCTA = isAuthenticated && user?.role === "client" ? "/client-services/create-job" : "/signup";
  const [expanded, setExpanded] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
    hover: { scale: 1.02, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-[#FDF9F5]">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden border-b border-[#EDE3DB] bg-gradient-to-br from-[#FFF6EF] via-[#FEF7F2] to-[#FDF8F4]"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <img
            src={pricingPattern}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-[0.06]"
          />
          <div className="absolute -left-16 top-8 h-48 w-48 rounded-full bg-[#F7D9CC] blur-3xl opacity-40" />
          <div className="absolute right-10 top-12 h-56 w-56 rounded-full bg-[#F4E7B7] blur-3xl opacity-30" />
          <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-[#E2ECFF] blur-3xl opacity-35" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#F7E8E0] px-3 py-1 text-xs font-medium text-[#B53A27]">
              <Zap size={12} />
              <span>Pricing that scales with your hiring</span>
            </div>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-[#2B211F] sm:text-6xl">
              Plans built for clients
              <span className="block text-[#C9452F]">who manage hiring with less friction</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-7 text-[#6D5A52]">
              Choose a plan that matches your hiring pace. Every tier connects to the same client workspace,
              job posting flow, proposal review tools, messages, and payment system.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to={clientCTA}
                className="group inline-flex items-center gap-2 rounded-full bg-[#C9452F] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#B53A27]"
              >
                {isAuthenticated && user?.role === "client" ? "Create Client Job" : "Start As Client"}
                <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </Link>
              <Link
                to="/client-services/overview"
                className="group inline-flex items-center gap-2 rounded-full border border-[#D6C8BF] bg-white/80 px-6 py-3 text-sm font-medium text-[#2B211F] backdrop-blur-sm transition hover:bg-white"
              >
                View Client Workspace
                <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Pricing Cards */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={cardVariants}
              whileHover="hover"
              className={`relative flex flex-col rounded-3xl border ${plan.border} bg-gradient-to-b ${plan.gradient} ${plan.shadow} ${plan.hoverShadow} transition-all duration-300`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#2B211F] px-3 py-1 text-xs font-medium text-white shadow-md">
                  Most Popular
                </div>
              )}
              <div className="p-6 pb-0">
                <div className="inline-flex rounded-2xl bg-white p-3 shadow-sm">
                  <plan.icon size={22} className="text-[#B53A27]" />
                </div>
                <h2 className="mt-5 text-2xl font-bold text-[#2B211F]">{plan.name}</h2>
                <p className="mt-2 text-sm leading-6 text-[#6A5851]">{plan.summary}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight text-[#2B211F]">{plan.price}</span>
                  {plan.period && <span className="text-sm text-[#7E6B63]">{plan.period}</span>}
                </div>
              </div>
              <div className="flex-1 px-6 pb-6">
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check size={16} className="mt-0.5 shrink-0 text-[#B53A27]" />
                      <span className="text-sm text-[#52413B]">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={plan.name === "Corporate" ? "/messages" : clientCTA}
                  className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    plan.highlight
                      ? "bg-[#2B211F] text-white hover:bg-[#1E1715]"
                      : "border border-[#D7CBC4] bg-white text-[#2B211F] hover:bg-[#FCF7F3]"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight size={15} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Comparison Matrix & Add-ons */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8"
      >
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Comparison Table */}
          <div className="rounded-3xl border border-[#EDE3DB] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[#FDECE7] p-3 text-[#B53A27]">
                <Shield size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-[#2B211F]">Plan comparison</h2>
                <p className="text-sm text-[#6A5851]">A quick view of how the client tiers scale.</p>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-[#EDE3DB]">
              {matrix.map((row, idx) => (
                <div
                  key={row.label}
                  className={`grid gap-3 px-5 py-4 text-sm sm:grid-cols-5 ${
                    idx % 2 === 0 ? "bg-[#FDFAF8]" : "bg-white"
                  }`}
                >
                  <div className="font-medium text-[#2B211F]">{row.label}</div>
                  {row.values.map((value) => (
                    <div key={value} className="text-[#6A5851]">
                      {value}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Included Features & CTA */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-[#EDE3DB] bg-[#2B211F] p-6 text-white shadow-md">
              <div className="flex items-center gap-3">
                <BadgeCheck size={20} />
                <h2 className="text-2xl font-semibold">What every client plan includes</h2>
              </div>
              <ul className="mt-5 space-y-3">
                {additionalFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 rounded-2xl bg-white/10 px-4 py-3">
                    <Check size={16} className="mt-0.5 shrink-0 text-white" />
                    <span className="text-sm text-white/90">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-[#EDE3DB] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#2B211F]">Ready to move faster?</h2>
              <p className="mt-3 text-sm leading-6 text-[#6A5851]">
                Pick a plan, complete your client profile, and start posting jobs through the client workspace right away.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/client-services/profile"
                  className="inline-flex items-center gap-2 rounded-full border border-[#D7CBC4] bg-white px-4 py-2.5 text-sm font-medium text-[#2B211F] transition hover:bg-[#FCF7F3]"
                >
                  Complete Profile
                </Link>
                <Link
                  to={clientCTA}
                  className="group inline-flex items-center gap-2 rounded-full bg-[#C9452F] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#B53A27]"
                >
                  Go To Jobs
                  <ArrowRight size={15} className="transition group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* FAQ / Additional Info (optional) */}
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between rounded-2xl border border-[#EDE3DB] bg-white p-5 text-left"
        >
          <div>
            <h3 className="text-lg font-semibold text-[#2B211F]">Need more than standard features?</h3>
            <p className="text-sm text-[#6A5851]">Custom solutions for high‑volume hiring or enterprise needs</p>
          </div>
          <div className="rounded-full bg-[#F7E8E0] p-2">
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </button>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-3 rounded-2xl border border-[#EDE3DB] bg-white p-5 text-sm text-[#6A5851]">
                <p>
                  If your organization requires custom limits, API access, dedicated account management, or
                  specialized onboarding, contact our sales team. We’ll help you build a plan that fits your
                  hiring workflows.
                </p>
                <Link
                  to="/contact"
                  className="mt-4 inline-flex items-center gap-2 text-[#C9452F] hover:underline"
                >
                  Talk to Sales <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

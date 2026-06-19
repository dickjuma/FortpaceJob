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
import { getToken, getUser } from "../../platform/common/services/api";
import pricingPattern from "../../platform/common/assets/hire-manage.jpg";

const plans = [
  {
    name: "Basic",
    price: "$29",
    period: "/month",
    icon: Sparkles,
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
    summary: "For growing clients hiring more often and needing faster delivery.",
    features: [
      "Up to 12 active jobs",
      "Priority proposal visibility",
      "Team-friendly job management",
      "Faster support response",
    ],
    highlight: true,
  },
  {
    name: "SMEs",
    price: "$169",
    period: "/month",
    icon: Building2,
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
  const clientCTA = isAuthenticated && user?.role === "client" ? "/client-services/create-job" : "/auth/register";
  const [expanded, setExpanded] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
    hover: { scale: 1.02, transition: { duration: 0.2 } },
  };

  const buttonTap = { scale: 0.97 };

  return (
    <div className="min-h-screen bg-surface-soft font-body">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden border-b border-border bg-gradient-to-br from-surface-soft via-surface-muted to-surface-soft"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <img
            src={pricingPattern}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-[0.04]"
          />
          <div className="absolute -left-16 top-8 h-48 w-48 rounded-full bg-accent-light blur-3xl opacity-30" />
          <div className="absolute right-10 top-12 h-56 w-56 rounded-full bg-warn-light blur-3xl opacity-20" />
          <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-info-light blur-3xl opacity-25" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent-light px-3 py-1 text-xs font-medium text-accent-dark">
              <Zap size={12} />
              <span>Pricing that scales with your hiring</span>
            </div>
            <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-brand-900 sm:text-6xl">
              Plans built for clients
              <span className="block text-accent">who manage hiring with less friction</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-7 text-ink-secondary">
              Choose a plan that matches your hiring pace. Every tier connects to the same client workspace,
              job posting flow, proposal review tools, messages, and payment system.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <motion.div whileTap={buttonTap}>
                <Link
                  to={clientCTA}
                  className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition hover:bg-accent-dark"
                >
                  {isAuthenticated && user?.role === "client" ? "Create Client Job" : "Start As Client"}
                  <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                </Link>
              </motion.div>
              <motion.div whileTap={buttonTap}>
                <Link
                  to="/client-services/overview"
                  className="group inline-flex items-center gap-2 rounded-full border border-border bg-white px-6 py-3 text-sm font-medium text-ink-primary backdrop-blur-sm transition hover:bg-surface-soft"
                >
                  View Client Workspace
                  <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                </Link>
              </motion.div>
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
              className={`relative flex flex-col rounded-2xl border border-border bg-white shadow-sm transition-all duration-300 hover:shadow-md`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-900 px-3 py-1 text-xs font-medium text-white shadow-sm">
                  Most Popular
                </div>
              )}
              <div className="p-6 pb-0">
                <div className="inline-flex rounded-xl bg-surface-soft p-3 shadow-sm">
                  <plan.icon size={22} className="text-accent" />
                </div>
                <h2 className="mt-5 font-display text-2xl font-bold text-brand-900">{plan.name}</h2>
                <p className="mt-2 text-sm leading-6 text-ink-secondary">{plan.summary}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight text-ink-primary">{plan.price}</span>
                  {plan.period && <span className="text-sm text-ink-tertiary">{plan.period}</span>}
                </div>
              </div>
              <div className="flex-1 px-6 pb-6">
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check size={16} className="mt-0.5 shrink-0 text-accent" />
                      <span className="text-sm text-ink-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>
                <motion.div whileTap={buttonTap}>
                  <Link
                    to={plan.name === "Corporate" ? "/messages" : clientCTA}
                    className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${
                      plan.highlight
                        ? "bg-brand-900 text-white hover:bg-brand-800"
                        : "border border-border bg-white text-ink-primary hover:bg-surface-soft"
                    }`}
                  >
                    {plan.cta || (plan.name === "Corporate" ? "Talk To Sales" : `Choose ${plan.name}`)}
                    <ArrowRight size={15} />
                  </Link>
                </motion.div>
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
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-accent-light p-3 text-accent">
                <Shield size={20} />
              </div>
              <div>
                <h2 className="font-display text-2xl font-semibold text-brand-900">Plan comparison</h2>
                <p className="text-sm text-ink-secondary">A quick view of how the client tiers scale.</p>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-xl border border-border">
              {matrix.map((row, idx) => (
                <div
                  key={row.label}
                  className={`grid gap-3 px-5 py-4 text-sm sm:grid-cols-5 ${
                    idx % 2 === 0 ? "bg-surface-soft" : "bg-white"
                  }`}
                >
                  <div className="font-medium text-ink-primary">{row.label}</div>
                  {row.values.map((value) => (
                    <div key={value} className="text-ink-secondary">
                      {value}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Included Features & CTA */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-brand-900 p-6 text-white shadow-sm">
              <div className="flex items-center gap-3">
                <BadgeCheck size={20} />
                <h2 className="font-display text-2xl font-semibold">What every client plan includes</h2>
              </div>
              <ul className="mt-5 space-y-3">
                {additionalFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 rounded-xl bg-white/10 px-4 py-3">
                    <Check size={16} className="mt-0.5 shrink-0 text-white" />
                    <span className="text-sm text-white/90">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <h2 className="font-display text-xl font-semibold text-brand-900">Ready to move faster?</h2>
              <p className="mt-3 text-sm leading-6 text-ink-secondary">
                Pick a plan, complete your client profile, and start posting jobs through the client workspace right away.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <motion.div whileTap={buttonTap}>
                  <Link
                    to="/client-services/profile"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-medium text-ink-primary transition hover:bg-surface-soft"
                  >
                    Complete Profile
                  </Link>
                </motion.div>
                <motion.div whileTap={buttonTap}>
                  <Link
                    to={clientCTA}
                    className="group inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent-dark"
                  >
                    Go To Jobs
                    <ArrowRight size={15} className="transition group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* FAQ / Additional Info */}
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between rounded-2xl border border-border bg-white p-5 text-left transition hover:bg-surface-soft"
        >
          <div>
            <h3 className="font-display text-lg font-semibold text-brand-900">Need more than standard features?</h3>
            <p className="text-sm text-ink-secondary">Custom solutions for high‑volume hiring or enterprise needs</p>
          </div>
          <div className="rounded-full bg-accent-light p-2 text-accent-dark">
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
              <div className="mt-3 rounded-2xl border border-border bg-white p-5 text-sm text-ink-secondary">
                <p>
                  If your organization requires custom limits, API access, dedicated account management, or
                  specialized onboarding, contact our sales team. We’ll help you build a plan that fits your
                  hiring workflows.
                </p>
                <motion.div whileTap={buttonTap}>
                  <Link
                    to="/contact"
                    className="mt-4 inline-flex items-center gap-2 text-accent hover:underline"
                  >
                    Talk to Sales <ArrowRight size={14} />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

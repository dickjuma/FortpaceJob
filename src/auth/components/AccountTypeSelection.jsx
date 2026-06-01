import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Building, Building2, User, Users } from 'lucide-react';
import SelectionCard from './SelectionCard';

const roleOptions = [
  {
    id: 'CLIENT',
    title: 'Client',
    icon: Users,
    useCase: 'Hire freelancers, agencies, SMEs, and onsite professionals.',
    features: ['Post jobs', 'Hire talent', 'Manage contracts', 'Build teams'],
    examples: ['Hiring manager', 'Startup founder', 'Agency owner'],
    themeClass: 'cyan',
  },
  {
    id: 'FREELANCER',
    title: 'Freelancer',
    icon: Briefcase,
    useCase: 'Offer services, build your reputation, and grow your business.',
    features: ['Find work', 'Create gigs', 'Get paid', 'Build portfolio'],
    examples: ['Designer', 'Developer', 'Consultant'],
    themeClass: 'brand',
  },
];

const accountTypeOptions = [
  {
    id: 'INDIVIDUAL',
    title: 'Individual',
    icon: User,
    useCase: 'For solo professionals and personal hiring.',
    features: ['Personal Profile', 'Simple Verification', 'Direct Payments'],
    examples: ['Freelancer', 'Remote worker', 'Consultant'],
    themeClass: 'brand',
  },
  {
    id: 'SME',
    title: 'SME',
    icon: Building,
    useCase: 'For small teams, startups, workshops, agencies, and growing businesses.',
    features: ['Business Profile', 'Team-Friendly Setup', 'Invoices', 'Project Tracking'],
    examples: ['Design studio', 'Local workshop', 'Startup'],
    themeClass: 'emerald',
  },
  {
    id: 'CORPORATE',
    title: 'Corporate',
    icon: Building2,
    useCase: 'For larger organizations, managed teams, and enterprise hiring.',
    features: ['Company Verification', 'Procurement', 'Compliance', 'Advanced Controls'],
    examples: ['Enterprise HR', 'Procurement team', 'Large agency'],
    themeClass: 'amber',
  },
];

export default function AccountTypeSelection({
  currentStep,
  selectedRole,
  selectedAccountType,
  onRoleSelect,
  onAccountTypeSelect,
}) {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const item = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full space-y-7 sm:space-y-8">
      {currentStep === 1 ? (
        <section>
          <div className="mb-6 rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-5 dark:border-zinc-800 dark:bg-zinc-900/40 sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#14a800]">Step 1</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Join the Future of Work</h2>
            <p className="mt-3 max-w-2xl text-zinc-500 dark:text-zinc-400">
              Hire top talent or offer your professional services worldwide.
            </p>
          </div>

          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 gap-4 xl:grid-cols-2 xl:gap-5">
            {roleOptions.map((type) => (
              <motion.div key={type.id} variants={item}>
                <SelectionCard
                  id={type.id}
                  title={type.title}
                  icon={type.icon}
                  features={type.features}
                  examples={type.examples}
                  useCase={type.useCase}
                  selected={selectedRole}
                  onSelect={onRoleSelect}
                  themeClass={type.themeClass}
                />
              </motion.div>
            ))}
          </motion.div>
        </section>
      ) : (
        <section>
          <div className="mb-6 rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-5 dark:border-zinc-800 dark:bg-zinc-900/40 sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-500">Step 2</p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">How are you joining?</h2>
                <p className="mt-3 max-w-2xl text-zinc-500 dark:text-zinc-400">
                  Choose the structure that matches your work or hiring setup. Business accounts unlock the right verification and profile fields.
                </p>
              </div>
              {selectedRole && (
                <div className="inline-flex items-center rounded-full bg-[#14a800]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#14a800] dark:text-[#14a800]">
                  {selectedRole === 'CLIENT' ? 'Client account' : 'Freelancer account'}
                </div>
              )}
            </div>
          </div>

          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {accountTypeOptions.map((type) => (
              <motion.div key={type.id} variants={item}>
                <SelectionCard
                  id={type.id}
                  title={type.title}
                  icon={type.icon}
                  features={type.features}
                  examples={type.examples}
                  useCase={type.useCase}
                  selected={selectedAccountType}
                  onSelect={onAccountTypeSelect}
                  themeClass={type.themeClass}
                />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}
    </div>
  );
}

import { Check } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Pricing = () => {

  const navigate = useNavigate()

  return (
      <div className="py-12 max-w-5xl mx-auto px-4 text-[var(--color-primary)]">
            <h1 className="text-center text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">Pricing</h1>
            <p className="text-center md:text-lg mt-2">Join our verified pro team to get more leads on the job market.</p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 mt-10">
                {/*--------------------- free users pricing card------------- */}
                <div className="rounded-2xl border border-[var(--accent-pink)] bg-[var(--accent-mint)] p-6">
                    <div className="flex flex-col items-center border-b border-[var(--accent-pink)] pb-6">
                        <span className="mb-6 text-[var(--color-primary)]">Free</span>
                        <span className="mb-3 text-4xl font-medium">$0/mo</span>
                        <span className="text-[var(--color-primary)]">Personal</span>
                    </div>
                    <div className="space-y-4 py-9">
                        <div className="flex items-center gap-3">
                            <span className="grid size-5 place-content-center rounded-full bg-[var(--color-cta)] text-sm text-[var(--color-secondary)]">
                                <Check size={16}/>
                            </span>
                            <span className="text-sm text-[var(--color-primary)]">Basic Profile Creation</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="grid size-5 place-content-center rounded-full bg-[var(--color-cta)] text-sm text-[var(--color-secondary)]">
                               <Check size={16}/>
                            </span>
                            <span className="text-sm text-[var(--color-primary)]">Browse Jobs / Talent</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="grid size-5 place-content-center rounded-full bg-[var(--color-cta)] text-sm text-[var(--color-secondary)]">
                               <Check size={16}/>
                            </span>
                            <span className="text-sm text-[var(--color-primary)]">Submit Limited Proposals</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="grid size-5 place-content-center rounded-full bg-[var(--color-cta)] text-sm text-[var(--color-secondary)]">
                               <Check size={16}/>
                            </span>
                            <span className="text-sm text-[var(--color-primary)]">Basic Messaging</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="grid size-5 place-content-center rounded-full bg-[var(--color-cta)] text-sm text-[var(--color-secondary)]">
                               <Check size={16}/>
                            </span>
                            <span className="text-sm text-[var(--color-primary)]">Basic Project Posting</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="grid size-5 place-content-center rounded-full bg-[var(--color-cta)] text-sm text-[var(--color-secondary)]">
                               <Check size={16}/>
                            </span>
                            <span className="text-sm text-[var(--color-primary)]">Simple Portfolio Upload</span>
                        </div>
                    </div>
                </div>
        
                {/* -----------------------pro users pricing card------------------- */}
                <div className="rounded-2xl border border-[var(--accent-pink)] bg-[var(--accent-mint)] p-6">
                    <div className="flex flex-col items-center border-b border-[var(--accent-pink)] pb-6">
                        <span className="mb-6 text-[var(--color-primary)]">Pro</span>
                        <span className="mb-3 text-4xl font-medium">$10/mo</span>
                        <span className="text-[var(--color-primary)]">Premium Features</span>
                    </div>
                    <div className="space-y-4 py-9">
                        <div className="flex items-center gap-3">
                            <span className="grid size-5 place-content-center rounded-full bg-[var(--color-cta)] text-sm text-[var(--color-secondary)]">
                                <Check size={16}/>
                            </span>
                            <span className="text-sm text-[var(--color-primary)]">Increased or Unlimited Proposals</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="grid size-5 place-content-center rounded-full bg-[var(--color-cta)] text-sm text-[var(--color-secondary)]">
                               <Check size={16}/>
                            </span>
                            <span className="text-sm text-[var(--color-primary)]">Boosted Profile Visibility</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="grid size-5 place-content-center rounded-full bg-[var(--color-cta)] text-sm text-[var(--color-secondary)]">
                               <Check size={16}/>
                            </span>
                            <span className="text-sm text-[var(--color-primary)]">Advanced Job Filters</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="grid size-5 place-content-center rounded-full bg-[var(--color-cta)] text-sm text-[var(--color-secondary)]">
                               <Check size={16}/>
                            </span>
                            <span className="text-sm text-[var(--color-primary)]">Client Insights / Job Analytics</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="grid size-5 place-content-center rounded-full bg-[var(--color-cta)] text-sm text-[var(--color-secondary)]">
                               <Check size={16}/>
                            </span>
                            <span className="text-sm text-[var(--color-primary)]">Lower Service Fees</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="grid size-5 place-content-center rounded-full bg-[var(--color-cta)] text-sm text-[var(--color-secondary)]">
                               <Check size={16}/>
                            </span>
                            <span className="text-sm text-[var(--color-primary)]">Team Management Features</span>
                        </div>
                    </div>
                </div>
        
                {/* Card 3 */}
                <div className="rounded-2xl border border-[var(--accent-pink)] bg-[var(--accent-mint)] p-6">
                    <div className="flex flex-col items-center border-b border-[var(--accent-pink)] pb-6">
                        <span className="mb-6 text-[var(--color-primary)]">Enterprise</span>
                        <span className="mb-3 text-4xl font-medium">$25/mo</span>
                        <span className="text-[var(--color-primary)]">Team account with unlimited member</span>
                    </div>
                    <div className="space-y-4 py-9">
                        <div className="flex items-center gap-3">
                            <span className="grid size-5 place-content-center rounded-full bg-[var(--color-cta)] text-sm text-[var(--color-secondary)]">
                                <Check size={16}/>
                            </span>
                            <span className="text-sm text-[var(--color-primary)]">Basic Profile Creation</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="grid size-5 place-content-center rounded-full bg-[var(--color-cta)] text-sm text-[var(--color-secondary)]">
                               <Check size={16}/>
                            </span>
                            <span className="text-sm text-[var(--color-primary)]">Browse Jobs / Talent</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="grid size-5 place-content-center rounded-full bg-[var(--color-cta)] text-sm text-[var(--color-secondary)]">
                               <Check size={16}/>
                            </span>
                            <span className="text-sm text-[var(--color-primary)]">Submit Limited Proposals</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="grid size-5 place-content-center rounded-full bg-[var(--color-cta)] text-sm text-[var(--color-secondary)]">
                               <Check size={16}/>
                            </span>
                            <span className="text-sm text-[var(--color-primary)]">Basic Messaging</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="grid size-5 place-content-center rounded-full bg-[var(--color-cta)] text-sm text-[var(--color-secondary)]">
                               <Check size={16}/>
                            </span>
                            <span className="text-sm text-[var(--color-primary)]">Basic Project Posting</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="grid size-5 place-content-center rounded-full bg-[var(--color-cta)] text-sm text-[var(--color-secondary)]">
                               <Check size={16}/>
                            </span>
                            <span className="text-sm text-[var(--color-primary)]">Simple Portfolio Upload</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mt-6 py-16 md:pl-20 md:w-full max-md:text-center mx-2 md:mx-auto flex flex-col md:flex-row items-center justify-between text-left bg-[var(--accent-mint)] rounded-2xl p-10 text-[var(--color-primary)]">
                <div>
                    <h1
                        className="text-4xl md:text-[46px] md:leading-[60px] font-semibold text-[var(--color-primarys)] bg-clip-text">
                        Ready to Upgrade your experience?
                    </h1>
                    <p className=" text-lg text-[var(--color-primary)]">
                        Your next favourite tool is just one click away.
                    </p>
                </div>
                <button onClick={()=>navigate()} className="px-12 py-3 text-[var(--color-secondary)] bg-[var(--color-cta)] rounded-full text-sm mt-4">
                    Upgrade
                </button>
            </div>
        </div>
  );
};

export default Pricing;

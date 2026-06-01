/**
 * dashboard.hooks.js — re-exports from clientHooks for backward compatibility.
 * New code should import directly from clientHooks.js
 */
export {
  useClientDashboard,
  useClientContracts,
  useClientJobs,
  useClientWallet,
  useClientTransactions,
  useClientProposals,
} from './clientHooks.js';
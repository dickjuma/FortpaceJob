# Email / Notification Direct Call Audit

The following table lists every file line that directly triggers an email or notification without using the future centralized Notification Service.

| File | Line | Snippet |
|------|------|---------|
| src/App.jsx | 68 | `import SkillAssessment from './pages/SkillAssessment';` |
| src/App.jsx | 121 | `import BuyerPurchases from './pages/gigs/BuyerPurchases';` |
| src/App.jsx | 387 | `<Route path="/auth/sessions" element={<AuthenticatedRoute><ActiveSessionsPage /></AuthenticatedRoute>} />` |
| src/App.jsx | 397 | `<Route path="/auth/session-expired" element={<SessionExpiredPage />} />` |
| src/App.jsx | 497 | `<Route path="/assessments" element={<SkillAssessment />} />` |
| src/App.jsx | 550 | `<Route path="/gigs/purchases" element={<BuyerPurchases />} />` |
| src/admin/AdminRoutes.jsx | 121 | `endpoint: (row) => `/fraud/cases/${row.id \|\| row._id \|\| row.caseId}/restrict`,` |
| src/admin/AdminRoutes.jsx | 129 | `endpoint: (row) => `/fraud/cases/${row.id \|\| row._id \|\| row.caseId}/escalate`,` |
| src/admin/AdminRoutes.jsx | 136 | `endpoint: (row) => `/fraud/cases/${row.id \|\| row._id \|\| row.caseId}/resolve`,` |
| src/admin/roleConfig.js | 13 | `widgets: ['open_tickets', 'active_disputes', 'pending_responses'],` |
| src/common/authStore.js | 15 | `sessionExpired: false,` |
| src/common/authStore.js | 43 | `sessionExpired: false,` |
| src/common/authStore.js | 58 | `sessionExpired: false` |
| src/common/authStore.js | 79 | `sessionExpired: false` |
| src/common/authStore.js | 100 | `sessionExpired: false` |
| src/common/authStore.js | 106 | `sessionExpired: true,` |
| src/pages/CertificationShowcase.jsx | 14 | `Hire talent possessing verified industry certifications from AWS, Google, Microsoft, Cisco, and more.` |
| src/pages/InstantBooking.jsx | 17 | `Skip the negotiation and proposal phases. Instantly book verified freelancers who offer pre-packaged services with guaranteed delivery timelines.` |
| src/pages/MeetingsPage.jsx | 27 | `<p className="text-sm text-zinc-400 mt-1">Scheduled video calls and interview sessions</p>` |
| src/pages/MeetingsPage.jsx | 74 | `{item.freelancerId \|\| item.participantName \|\| 'Interview session'}` |
| src/pages/SafetyTrustCenter.jsx | 50 | `Every freelancer undergoes strict biometric ID verification and technical assessments before they can offer services on the Fortspace platform.` |
| src/pages/SkillAssessment.jsx | 5 | `const SkillAssessment = () => {` |
| src/pages/SkillAssessment.jsx | 15 | `<h1 className="text-4xl md:text-5xl font-black text-zinc-900 mb-6">Skill Assessments</h1>` |
| src/pages/SkillAssessment.jsx | 17 | `Prove your expertise to top enterprise clients. Pass these timed, proctored assessments to earn verified badges on your profile.` |
| src/pages/SkillAssessment.jsx | 59 | `Start Assessment` |
| src/pages/SkillAssessment.jsx | 72 | `export default SkillAssessment;` |
| src/pages/Verification.jsx | 106 | `<h4 className="font-bold text-zinc-900 text-lg">Skill Assessments</h4>` |
| src/pages/Verification.jsx | 107 | `<p className="text-zinc-600 text-sm">Passed Fortspace React.js & Node.js technical assessments (Top 10%).</p>` |
| src/pages/Verification.jsx | 124 | `Fortspace uses advanced encryption and secure third-party vendors to verify and store this data. Your hiring process is protected by our Trust & Safety Guarantee.` |
| src/pages/VerificationProcess.jsx | 17 | `We employ a rigorous 4-step vetting process to ensure every professional on our platform is exactly who they say they are, and possesses the skills they claim.` |
| src/pages/VerificationProcess.jsx | 38 | `title: 'Technical Skill Assessments',` |
| src/pages/VerificationProcess.jsx | 46 | `desc: 'A final 15-minute live interview with our talent success team to assess communication skills, English proficiency, and professional etiquette.'` |
| src/store/authStore.js | 32 | `getStorage: () => sessionStorage, // Persist across refreshes but clear on tab close` |
| src/agency/pages/TeamPermissionsPage.jsx | 116 | `<span>Modifying role permissions will instantly refresh active sessions for security enforcement.</span>` |
| src/admin/api/dashboard.api.js | 45 | `pendingResponses: 0,` |
| src/admin/components/AdminAuthGuard.jsx | 10 | `<p className="text-sm font-medium text-zinc-500">Verifying admin session…</p>` |
| src/admin/config/roleConfig.js | 259 | `{ id: 'pending_responses', title: 'Pending Responses', dataKey: 'pendingResponses', icon: Clock, iconBg: 'bg-amber-100 dark:bg-amber-900/30', iconColor: 'text-amber-600 dark:text-amber-400', format: 'number', size: 'md', showSparkline: false, showTrend: false, criticalThreshold: 20 },` |
| src/admin/pages/DisputeResolution.jsx | 131 | `<p className="text-xs font-semibold text-zinc-400">{activeDisputes.length} Cases</p>` |
| src/admin/pages/DisputeResolution.jsx | 158 | `{isLoading ? '…' : `${activeDisputes.length} Cases Pending`}` |
| src/admin/pages/DisputeResolution.jsx | 172 | `<p className="text-sm mt-1">All cases are currently resolved.</p>` |
| src/admin/pages/DisputeResolution.jsx | 271 | `<span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">Cases in Queue</span>` |
| src/admin/pages/LoginPage.jsx | 48 | `toast.success('Admin session started');` |
| src/admin/pages/LoginPage.jsx | 124 | `Admin access uses the production auth service and role checks. Demo shortcuts are disabled in this build.` |
| src/auth/components/AccountTypeSelection.jsx | 41 | `useCase: 'For small teams, startups, workshops, agencies, and growing businesses.',` |
| src/auth/components/AuthHeroPanel.jsx | 11 | `const panelClasses = [` |
| src/auth/components/AuthHeroPanel.jsx | 18 | `<div className={panelClasses}>` |
| src/auth/components/AuthLayout.jsx | 17 | `const contentClasses = [` |
| src/auth/components/AuthLayout.jsx | 22 | `const formShellClasses = [` |
| src/auth/components/AuthLayout.jsx | 27 | `const cardClasses = [` |
| src/auth/components/AuthLayout.jsx | 44 | `<div className={`${contentClasses} relative overflow-y-auto custom-scrollbar`}>` |
| src/auth/components/AuthLayout.jsx | 56 | `className={formShellClasses}` |
| src/auth/components/AuthLayout.jsx | 67 | `<div className={cardClasses}>` |
| src/auth/components/SignupForm.jsx | 112 | `sessionStorage.setItem('pendingVerificationEmail', email);` |
| src/auth/components/VerificationStep.jsx | 42 | `setError(err.message \|\| "Failed to resend code");` |
| src/auth/pages/ActiveSessionsPage.jsx | 15 | `const formatSessionLabel = (session, index) => {` |
| src/auth/pages/ActiveSessionsPage.jsx | 16 | `if (index === 0) return 'Current session';` |
| src/auth/pages/ActiveSessionsPage.jsx | 17 | `if (session.createdAt) {` |
| src/auth/pages/ActiveSessionsPage.jsx | 18 | `return new Date(session.createdAt).toLocaleString();` |
| src/auth/pages/ActiveSessionsPage.jsx | 24 | `const [sessions, setSessions] = useState([]);` |
| src/auth/pages/ActiveSessionsPage.jsx | 32 | `sessions.map((session, index) => ({` |
| src/auth/pages/ActiveSessionsPage.jsx | 33 | `...session,` |
| src/auth/pages/ActiveSessionsPage.jsx | 34 | `icon: getSessionIcon(session.userAgent),` |
| src/auth/pages/ActiveSessionsPage.jsx | 35 | `label: formatSessionLabel(session, index),` |
| src/auth/pages/ActiveSessionsPage.jsx | 37 | `[sessions]` |
| src/auth/pages/ActiveSessionsPage.jsx | 48 | `setError(err.message \|\| 'Could not load active sessions.');` |
| src/auth/pages/ActiveSessionsPage.jsx | 61 | `setSessions((prev) => prev.filter((session) => session.id !== id));` |
| src/auth/pages/ActiveSessionsPage.jsx | 63 | `setError(err.message \|\| 'Could not revoke that session.');` |
| src/auth/pages/ActiveSessionsPage.jsx | 75 | `setError(err.message \|\| 'Could not revoke sessions.');` |
| src/auth/pages/ActiveSessionsPage.jsx | 103 | `Loading active sessions...` |
| src/auth/pages/ActiveSessionsPage.jsx | 107 | `No active sessions found. Once you sign in on more devices, they will appear here.` |
| src/auth/pages/ActiveSessionsPage.jsx | 111 | `{hydratedSessions.map((session, index) => (` |
| src/auth/pages/ActiveSessionsPage.jsx | 112 | `<li key={session.id} className="p-6 flex items-center justify-between gap-4">` |
| src/auth/pages/ActiveSessionsPage.jsx | 115 | `<session.icon className="w-6 h-6 text-gray-500 dark:text-gray-400" />` |
| src/auth/pages/ActiveSessionsPage.jsx | 119 | `{session.userAgent \|\| 'Unknown device'}` |
| src/auth/pages/ActiveSessionsPage.jsx | 127 | `<span className="flex items-center"><Globe className="w-3 h-3 mr-1" /> {session.ipAddress \|\| 'Unknown IP'}</span>` |
| src/auth/pages/ActiveSessionsPage.jsx | 128 | `<span>{session.label}</span>` |
| src/auth/pages/ActiveSessionsPage.jsx | 137 | `onClick={() => handleRevoke(session.id)}` |
| src/auth/pages/ActiveSessionsPage.jsx | 139 | `icon={revokingId === session.id ? Loader2 : LogOut}` |
| src/auth/pages/ActiveSessionsPage.jsx | 140 | `isLoading={revokingId === session.id}` |
| src/auth/pages/ActiveSessionsPage.jsx | 153 | `Sign out of all sessions` |
| src/auth/pages/ExperienceLevelPage.jsx | 14 | `function cn(...classes) { return classes.filter(Boolean).join(' '); }` |
| src/auth/pages/ExperienceLevelPage.jsx | 602 | `() => onboardingDraft.experienceLevel \|\| sessionStorage.getItem(STORAGE_KEY) \|\| null` |
| src/auth/pages/ExperienceLevelPage.jsx | 610 | `if (selectedLevel) sessionStorage.setItem(STORAGE_KEY, selectedLevel);` |
| src/auth/pages/ForgotPasswordPage.jsx | 31 | `sessionStorage.setItem('passwordResetEmail', email);` |
| src/auth/pages/ForgotPasswordPage.jsx | 133 | `Click to resend` |
| src/auth/pages/OTPVerificationPage.jsx | 18 | `const email = location.state?.email \|\| user?.email \|\| sessionStorage.getItem('pendingVerificationEmail') \|\| '';` |
| src/auth/pages/OTPVerificationPage.jsx | 67 | `sessionStorage.removeItem('pendingVerificationEmail');` |
| src/auth/pages/OTPVerificationPage.jsx | 72 | `await authAPI.resendOTP(` |
| src/auth/pages/ProfileCompletionPage.jsx | 677 | `These are the fields the backend uses to determine whether your account is ready for the main workspace.` |
| src/auth/pages/ProfileCompletionPage.jsx | 797 | `The backend onboarding service uses this step to decide whether your account is ready for the marketplace.` |
| src/auth/pages/RateSetupPage.jsx | 203 | `This estimate uses common marketplace pricing patterns for mid-market technical profiles. Adjust it to match your real experience and demand.` |
| src/auth/pages/ResetPasswordPage.jsx | 21 | `const initialEmail = searchParams.get('email') \|\| sessionStorage.getItem('passwordResetEmail') \|\| '';` |
| src/auth/pages/ResetPasswordPage.jsx | 76 | `sessionStorage.removeItem('passwordResetEmail');` |
| src/auth/pages/ResetPasswordPage.jsx | 96 | `await authAPI.resendPasswordResetOTP(email);` |
| src/auth/pages/ResetPasswordPage.jsx | 97 | `sessionStorage.setItem('passwordResetEmail', email);` |
| src/auth/pages/ResetPasswordPage.jsx | 99 | `setError(err.message \|\| 'Failed to resend reset code. Please try again.');` |
| src/auth/pages/RoleSelectionPage.jsx | 274 | `return sessionStorage.getItem(STORAGE_KEY) \|\| null;` |
| src/auth/pages/RoleSelectionPage.jsx | 281 | `sessionStorage.setItem(STORAGE_KEY, selected);` |
| src/auth/pages/SecurityDashboard.jsx | 11 | `link: "/auth/sessions",` |
| src/auth/pages/SecurityDashboard.jsx | 49 | `<p className="text-sm text-gray-500 dark:text-gray-400">Manage your account security, sessions, and connected apps.</p>` |
| src/auth/pages/SessionExpiredPage.jsx | 28 | `Your session has expired due to inactivity. Please log in again to continue working on your projects.` |
| src/auth/pages/SuspiciousActivityReviewPage.jsx | 28 | `If an unusual login is detected, it will appear here with location details and recommended steps. In the meantime, you can review your active sessions or reset your password if anything feels off.` |
| src/auth/pages/SuspiciousActivityReviewPage.jsx | 33 | `<Button variant="primary" icon={ShieldCheck} onClick={() => window.location.assign('/auth/sessions')}>` |
| src/auth/pages/SuspiciousActivityReviewPage.jsx | 34 | `Review active sessions` |
| src/auth/pages/VerifyEmailPage.jsx | 16 | `const email = location.state?.email \|\| user?.email \|\| sessionStorage.getItem('pendingVerificationEmail') \|\| '';` |
| src/auth/pages/VerifyEmailPage.jsx | 25 | `sessionStorage.setItem('pendingVerificationEmail', email);` |
| src/auth/pages/VerifyEmailPage.jsx | 32 | `sessionStorage.removeItem('pendingVerificationEmail');` |
| src/auth/pages/VerifyEmailPage.jsx | 37 | `await authAPI.resendOTP(email, null, 'email', 'email_verification', user?.id \|\| null);` |
| src/auth/services/oauthService.js | 7 | `* callback page with a live session payload.` |
| src/auth/utils/onboardingDraft.js | 14 | `export const loadOnboardingDraft = () => safeParse(sessionStorage.getItem(STORAGE_KEY));` |
| src/auth/utils/onboardingDraft.js | 22 | `sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextDraft));` |
| src/auth/utils/onboardingDraft.js | 27 | `sessionStorage.removeItem(STORAGE_KEY);` |
| src/client/pages/ClientCompanyProfilePage.jsx | 3 | `// Uses Tailwind CSS, framer-motion, lucide-react. No external UI libraries.` |
| src/client/pages/ClientCompliancePage.jsx | 174 | `Your corporate wallet releases are currently locked to a KES 150,000 threshold limit` |
| src/client/pages/ClientContractBuilderPage.jsx | 72 | `Draft legally compliant agreements, automatically append Standard NDA clauses, and dispatch documents for e-signatures.` |
| src/client/pages/ClientContractBuilderPage.jsx | 183 | `All contracts include standard clauses compliant with Kenyan law. For custom terms, contact legal support.` |
| src/client/pages/ClientDashboardPage.jsx | 356 | `desc: 'Open or track dispute cases',` |
| src/client/pages/ClientJobPostingPage.jsx | 29 | `// Helper for conditional classes` |
| src/client/pages/ClientJobPostingPage.jsx | 30 | `const cn = (...classes) => classes.filter(Boolean).join(' ');` |
| src/client/pages/ClientJobPostingPage.jsx | 394 | `The average hourly rate for React Native developers with your required skills is <strong className="text-ink-primary">$45 - $80/hr</strong>. Setting a competitive rate increases qualified proposals.` |
| src/client/pages/ClientMpesaSetupPage.jsx | 20 | `// Helper for conditional classes` |
| src/client/pages/ClientMpesaSetupPage.jsx | 21 | `const cn = (...classes) => classes.filter(Boolean).join(' ');` |
| src/client/pages/ClientOfflineMapPage.jsx | 20 | `// Helper for conditional classes` |
| src/client/pages/ClientOfflineMapPage.jsx | 21 | `const cn = (...classes) => classes.filter(Boolean).join(' ');` |
| src/client/pages/ClientPermissionsPage.jsx | 21 | `// Helper for conditional classes` |
| src/client/pages/ClientPermissionsPage.jsx | 22 | `const cn = (...classes) => classes.filter(Boolean).join(' ');` |
| src/client/pages/ClientPermissionsPage.jsx | 32 | `{ key: 'escrow_release', name: 'Authorize Escrow Releases', exec: true, manager: false, procurement: false, surveyor: false },` |
| src/client/pages/ClientPermissionsPage.jsx | 262 | `Permissions are enforced in real‑time. Changes take effect immediately across all sessions.` |
| src/client/pages/ClientPricingPage.jsx | 55 | `summary: "For established small and medium businesses managing ongoing hiring.",` |
| src/client/pages/ClientProcurementDashboardPage.jsx | 20 | `const cn = (...classes) => classes.filter(Boolean).join(' ');` |
| src/client/pages/ClientProcurementEcosystemPage.jsx | 20 | `const cn = (...classes) => classes.filter(Boolean).join(' ');` |
| src/client/pages/ClientProfilePage.jsx | 41 | `// Helper for conditional classes` |
| src/client/pages/ClientProfilePage.jsx | 42 | `const cn = (...classes) => classes.filter(Boolean).join(' ');` |
| src/client/pages/ClientProfilePage.jsx | 61 | `companyBio: 'We build digital solutions for African enterprises.',` |
| src/client/pages/ClientSecurityCenterPage.jsx | 16 | `const { data: sessionsData, isLoading: sessionsLoading } = useSessions();` |
| src/client/pages/ClientSecurityCenterPage.jsx | 18 | `const sessions = sessionsData \|\| [];` |
| src/client/pages/ClientSecurityCenterPage.jsx | 56 | `const handleRevoke = async (sessionId, deviceName) => {` |
| src/client/pages/ClientSecurityCenterPage.jsx | 58 | `await revokeSessionMutation.mutateAsync(sessionId);` |
| src/client/pages/ClientSecurityCenterPage.jsx | 220 | `{sessionsLoading ? (` |
| src/client/pages/ClientSecurityCenterPage.jsx | 221 | `<div className="p-4 text-center text-zinc-500 text-sm">Loading sessions...</div>` |
| src/client/pages/ClientSecurityCenterPage.jsx | 222 | `) : sessions.length === 0 ? (` |
| src/client/pages/ClientSecurityCenterPage.jsx | 223 | `<div className="p-4 text-center text-zinc-500 text-sm">No active sessions.</div>` |
| src/client/pages/ClientSecurityCenterPage.jsx | 225 | `sessions.map(s => {` |
| src/client/pages/ClientSupportHelpdeskPage.jsx | 32 | `{ q: 'How long do disputes take to resolve?', a: 'Our team reviews disputes within 48 hours. Complex cases may take up to 7 business days. You can track progress in the Disputes section.' },` |
| src/client/pages/ClientTaskWorkspacePage.jsx | 72 | `Trello-inspired kanban boards linked to geofenced operations and escrow releases.` |
| src/client/pages/ClientTimeTrackingPage.jsx | 9 | `const cn = (...classes) => classes.filter(Boolean).join(' ');` |
| src/client/pages/ClientVerifyOtpPage.jsx | 7 | `const cn = (...classes) => classes.filter(Boolean).join(' ');` |
| src/client/pages/ClientWalletDashboard.jsx | 12 | `const cn = (...classes) => classes.filter(Boolean).join(' ');` |
| src/client/pages/ClientWelcomePage.jsx | 10 | `const cn = (...classes) => classes.filter(Boolean).join(' ');` |
| src/client/pages/ClientWorkflowBuilderPage.jsx | 9 | `const cn = (...classes) => classes.filter(Boolean).join(' ');` |
| src/client/pages/ClientWorkflowBuilderPage.jsx | 64 | `Design automation sequences, connect field worker telemetry to fintech releases, and configure notification rules.` |
| src/client/pages/ClientWorkspacePage.jsx | 11 | `const cn = (...classes) => classes.filter(Boolean).join(' ');` |
| src/client/pages/ContractDetailsPage.jsx | 16 | `const cn = (...classes) => classes.filter(Boolean).join(' ');` |
| src/client/pages/ContractsPage.jsx | 14 | `const cn = (...classes) => classes.filter(Boolean).join(' ');` |
| src/client/pages/DashboardPage.jsx | 12 | `const cn = (...classes) => classes.filter(Boolean).join(' ');` |
| src/client/pages/DisputesPage.jsx | 12 | `const cn = (...classes) => classes.filter(Boolean).join(' ');` |
| src/client/pages/EnterpriseHiringDashboardPage.jsx | 11 | `const cn = (...classes) => classes.filter(Boolean).join(' ');` |
| src/client/pages/GigPurchaseScreen.jsx | 7 | `const cn = (...classes) => classes.filter(Boolean).join(' ');` |
| src/client/pages/JobApplicantsScreen.jsx | 6 | `const cn = (...classes) => classes.filter(Boolean).join(' ');` |
| src/client/pages/JobDetailsPage.jsx | 7 | `const cn = (...classes) => classes.filter(Boolean).join(' ');` |
| src/client/pages/JobsPage.jsx | 11 | `const cn = (...classes) => classes.filter(Boolean).join(' ');` |
| src/client/pages/NotificationsPage.jsx | 9 | `const cn = (...classes) => classes.filter(Boolean).join(' ');` |
| src/client/pages/PostJobPage.jsx | 37 | `const cn = (...classes) => classes.filter(Boolean).join(' ');` |
| src/client/pages/ProposalComparisonPage.jsx | 29 | `const cn = (...classes) => classes.filter(Boolean).join(' ');` |
| src/client/pages/ProposalsPage.jsx | 31 | `const cn = (...classes) => classes.filter(Boolean).join(' ');` |
| src/client/pages/RecommendationProfilePage.jsx | 18 | `const cn = (...classes) => classes.filter(Boolean).join(' ');` |
| src/client/pages/ReportFreelancerPage.jsx | 36 | `const cn = (...classes) => classes.filter(Boolean).join(' ');` |
| src/client/pages/ReportFreelancerPage.jsx | 190 | `text: "Our Trust & Safety team reviews all reports within 2-3 business days. Complex cases may take up to 7 days.",` |
| src/client/pages/ReviewsPage.jsx | 9 | `const cn = (...classes) => classes.filter(Boolean).join(' ');` |
| src/client/pages/RevisionRequestPage.jsx | 31 | `// Helper for conditional classes` |
| src/client/pages/RevisionRequestPage.jsx | 32 | `const cn = (...classes) => classes.filter(Boolean).join(' ');` |
| src/client/pages/SavedTalentPipelinePage.jsx | 39 | `// Helper for conditional classes` |
| src/client/pages/SavedTalentPipelinePage.jsx | 40 | `const cn = (...classes) => classes.filter(Boolean).join(' ');` |
| src/client/pages/TeamManagementPage.jsx | 13 | `// Helper for conditional classes` |
| src/client/pages/TeamManagementPage.jsx | 14 | `const cn = (...classes) => classes.filter(Boolean).join(' ');` |
| src/client/pages/WalletPage.jsx | 25 | `// Helper for conditional classes` |
| src/client/pages/WalletPage.jsx | 27 | `const cn = (...classes) => classes.filter(Boolean).join(' ');` |
| src/client/services/clientHooks.js | 48 | `sessions: ['client', 'sessions'],` |
| src/client/services/clientHooks.js | 614 | `useQuery({ queryKey: QK.sessions, queryFn: () => authAPI.getSessions(), ...shortOpts() });` |
| src/client/services/clientHooks.js | 619 | `mutationFn: (sessionId) => authAPI.revokeSession(sessionId),` |
| src/client/services/clientHooks.js | 620 | `onSuccess: onSuccess('Session revoked successfully.', [QK.sessions], qc),` |
| src/common/pages/AccountSecurityCenterPage.jsx | 38 | `<p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Manage your security preferences and review active sessions.</p>` |
| src/common/pages/AccountSecurityCenterPage.jsx | 163 | `{activeSessions.map((session) => {` |
| src/common/pages/AccountSecurityCenterPage.jsx | 164 | `const Icon = session.icon;` |
| src/common/pages/AccountSecurityCenterPage.jsx | 166 | `<div key={session.id} className="p-6 flex items-center justify-between">` |
| src/common/pages/AccountSecurityCenterPage.jsx | 173 | `<h3 className="text-sm font-medium text-gray-900 dark:text-white">{session.device}</h3>` |
| src/common/pages/AccountSecurityCenterPage.jsx | 174 | `{session.current && (` |
| src/common/pages/AccountSecurityCenterPage.jsx | 180 | `<p className="text-sm text-gray-500 dark:text-gray-400">{session.browser} • {session.location}</p>` |
| src/common/pages/AccountSecurityCenterPage.jsx | 181 | `<p className="text-xs text-gray-400 mt-0.5">{session.time}</p>` |
| src/common/pages/AccountSecurityCenterPage.jsx | 184 | `{!session.current && (` |
| src/common/pages/MyProfile.jsx | 1868 | `title="Certifications & Licenses"` |
| src/common/pages/PromotionsCouponsCenterPage.jsx | 16 | `maxUses: z.preprocess((val) => val ? Number(val) : undefined, z.number().min(1).optional()),` |
| src/common/pages/PromotionsCouponsCenterPage.jsx | 51 | `maxUses: data.maxUses \|\| null,` |
| src/common/pages/PromotionsCouponsCenterPage.jsx | 188 | `{promo.maxUses && (` |
| src/common/pages/PromotionsCouponsCenterPage.jsx | 189 | `<span className="text-xs text-gray-500 mt-0.5">out of {promo.maxUses}</span>` |
| src/common/pages/PromotionsCouponsCenterPage.jsx | 250 | `{height * 10} Uses` |
| src/common/pages/PromotionsCouponsCenterPage.jsx | 366 | `<label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Max Uses</label>` |
| src/common/pages/PromotionsCouponsCenterPage.jsx | 369 | `{...register('maxUses')}` |
| src/common/services/api.js | 90 | `window.location.href = "/auth/session-expired";` |
| src/common/services/api.js | 94 | `window.location.href = "/auth/session-expired";` |
| src/common/services/api.js | 213 | `resendOTP: async (email, phoneNumber, channel = "email", purpose = "email_verification", userId = null) => {` |
| src/common/services/api.js | 214 | `return apiClient("/auth/resend-otp", {` |
| src/common/services/api.js | 273 | `resendPasswordResetOTP: async (email) => {` |
| src/common/services/api.js | 274 | `return authAPI.resendOTP(email, null, "email", "reset_password");` |
| src/common/services/api.js | 304 | `return apiClient("/auth/sessions");` |
| src/common/services/api.js | 307 | `revokeSession: async (sessionId) => {` |
| src/common/services/api.js | 308 | `return apiClient(`/auth/sessions/${sessionId}`, {` |
| src/common/services/api.js | 314 | `return apiClient("/auth/sessions", {` |
| src/common/services/api.js | 373 | `// If backend returns unwrapped profile directly, bundle it for user session` |
| src/common/services/api.js | 602 | `// Fall through to public browse when session is invalid or listing is restricted.` |
| src/common/store/onboardingStore.js | 82 | `storage: createJSONStorage(() => sessionStorage), // Use sessionStorage so it clears on browser close` |
| src/components/auth/HeroSection.jsx | 8 | `description = "The intelligent freelance marketplace for professionals, businesses, and enterprises.",` |
| src/components/auth/SecurityBadge.jsx | 14 | `<span className="text-xs text-zinc-500 font-medium">Your session is encrypted and protected.</span>` |
| src/components/common/Button.jsx | 30 | `const classes = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`;` |
| src/components/common/Button.jsx | 35 | `className={classes}` |
| src/components/common/Button.tsx | 31 | `const classes = twMerge(` |
| src/components/common/Button.tsx | 42 | `<button ref={ref} className={classes} disabled={disabled \|\| loading} {...props}>` |
| src/components/home/BusinessBenefits.jsx | 47 | `Why leading businesses choose Forte` |
| src/components/home/CTA.jsx | 24 | `Join thousands of businesses and professionals who are doing their best work on Forte.` |
| src/components/home/FAQ.jsx | 14 | `answer: 'Forte offers a built-in dispute resolution center. If a disagreement arises, our mediation team steps in to review the communication, files, and contract terms to ensure a fair resolution for both parties.'` |
| src/components/home/Features.jsx | 17 | `description: 'Upfront quotes mean no surprises. Payments only get released when you approve.'` |
| src/components/home/Footer.jsx | 54 | `Connect with skilled professionals trusted by startups, businesses, and enterprises around the world.` |
| src/escrow/pages/EscrowDashboard.jsx | 14 | `<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage deposits, milestone releases, and view secure transaction history.</p>` |
| src/freelancer/pages/BookingsPage.jsx | 149 | `<p className="text-xs font-body font-medium text-white/70 uppercase tracking-wide mb-1">Upcoming sessions</p>` |
| src/freelancer/pages/DisputesPage.jsx | 110 | `Resolve milestone conflicts, escalate issues, and request escrow releases` |
| src/freelancer/pages/DisputesPage.jsx | 125 | `{/* Left Side: Cases List */}` |
| src/freelancer/pages/EscrowPage.jsx | 150 | `Track funded milestones, request releases, and manage disputes securely` |
| src/freelancer/pages/FeaturedGigShowcasePage.jsx | 216 | `Only 1% of applicants pass our rigorous quality and communication assessments` |
| src/freelancer/pages/FreelancerLearningPage.jsx | 77 | `{['Dashboard', 'All Courses', 'My Certifications'].map((tab, idx) => {` |
| src/freelancer/pages/FreelancerLearningPage.jsx | 78 | `const ids = ['dashboard', 'courses', 'certifications'];` |
| src/freelancer/pages/FreelancerLearningPage.jsx | 127 | `Courses completed` |
| src/freelancer/pages/FreelancerLearningPage.jsx | 293 | `{/* Courses Tab - Coming Soon */}` |
| src/freelancer/pages/FreelancerLearningPage.jsx | 294 | `{activeTab === 'courses' && (` |
| src/freelancer/pages/FreelancerLearningPage.jsx | 301 | `<h3 className="font-body font-semibold text-xl text-ink-primary mb-2">All courses</h3>` |
| src/freelancer/pages/FreelancerLearningPage.jsx | 302 | `<p className="text-ink-secondary">Browse our complete library of courses</p>` |
| src/freelancer/pages/FreelancerSuccessScorePage.jsx | 10 | `const cn = (...classes) => classes.filter(Boolean).join(' ');` |
| src/freelancer/pages/GigCategoryPage.jsx | 144 | `<p className="text-ink-secondary text-sm mt-1">Highly rated services chosen by businesses</p>` |
| src/freelancer/pages/GigPricingPage.jsx | 90 | `<p className="text-sm font-body text-ink-secondary">Offering 3 packages increases your chances of higher-value orders</p>` |
| src/freelancer/pages/NotificationSettingsPage.jsx | 138 | `description="Alerts when client deposits or releases escrow"` |
| src/freelancer/pages/NotificationSettingsPage.jsx | 155 | `description="Send SMS for secure transaction releases"` |
| src/freelancer/pages/NotificationSettingsPage.jsx | 161 | `description="Require OTP for administrative console sessions"` |
| src/freelancer/pages/OtpVerificationPage.jsx | 63 | `const resendCode = () => {` |
| src/freelancer/pages/OtpVerificationPage.jsx | 155 | `onClick={resendCode}` |
| src/freelancer/pages/OtpVerificationPage.jsx | 185 | `<button onClick={resendCode} className="text-accent DEFAULT hover:text-accent-dark transition-colors">` |
| src/freelancer/pages/PrivacySecuritySettingsPage.jsx | 9 | `const [sessions, setSessions] = useState([` |
| src/freelancer/pages/PrivacySecuritySettingsPage.jsx | 47 | `setSessions(sessions.filter(s => s.id !== id));` |
| src/freelancer/pages/PrivacySecuritySettingsPage.jsx | 84 | `<p className="text-ink-secondary font-body">Manage your account security, passwords, and active sessions</p>` |
| src/freelancer/pages/PrivacySecuritySettingsPage.jsx | 171 | `<h3 className="font-body font-semibold text-base text-ink-primary">Active sessions</h3>` |
| src/freelancer/pages/PrivacySecuritySettingsPage.jsx | 175 | `{sessions.map((sess, idx) => (` |
| src/freelancer/pages/PrivacySecuritySettingsPage.jsx | 177 | `key={sess.id}` |
| src/freelancer/pages/PrivacySecuritySettingsPage.jsx | 185 | `<span className="font-body font-semibold text-sm text-ink-primary">{sess.device}</span>` |
| src/freelancer/pages/PrivacySecuritySettingsPage.jsx | 186 | `{sess.active && (` |
| src/freelancer/pages/PrivacySecuritySettingsPage.jsx | 188 | `Current session` |
| src/freelancer/pages/PrivacySecuritySettingsPage.jsx | 192 | `<p className="text-xs text-ink-tertiary">IP: {sess.ip} • Location: {sess.location}</p>` |
| src/freelancer/pages/PrivacySecuritySettingsPage.jsx | 194 | `{!sess.active && (` |
| src/freelancer/pages/PrivacySecuritySettingsPage.jsx | 196 | `onClick={() => revokeSession(sess.id, sess.device)}` |
| src/freelancer/pages/PrivacySecuritySettingsPage.jsx | 198 | `title="Terminate session"` |
| src/freelancer/pages/ReviewsPage.jsx | 171 | `View client feedback and manage your professional responses.` |
| src/freelancer/pages/SkillsManagementPage.jsx | 99 | `// Assessment modal states` |
| src/freelancer/pages/SkillsManagementPage.jsx | 415 | `{/* Assessment Modal */}` |
| src/freelancer/pages/SkillsManagementPage.jsx | 428 | `{testModalSkill.name} assessment` |
| src/freelancer/pages/SkillsManagementPage.jsx | 523 | `You passed the assessment. The verified badge has been added to{' '}` |
| src/freelancer/pages/SkillTestsPage.jsx | 564 | `title="Exit assessment"` |
| src/freelancer/pages/UpgradePlanPage.jsx | 72 | `'Skills assessment badges',` |
| src/pages/find-work/DisputeResolution.jsx | 59 | `message: 'Filing a dispute pauses the contract and freezes Escrow funds while our team investigates.',` |
| src/pages/find-work/DisputeResolution.jsx | 122 | `<p className="text-sm font-medium text-rose-800 mt-1">Filing a dispute pauses the contract and freezes Escrow. This impacts both parties&apos; accounts. Please ensure you have tried resolving the issue directly with the provider first.</p>` |
| src/pages/freelancer/RankingIntelligence.jsx | 124 | `<p className="text-xs text-zinc-400 w-full text-left mb-4">Algorithm assessment of your profile compatibility against top-tier clients.</p>` |
| src/pages/gigs/BuyerPurchases.jsx | 17 | `const BuyerPurchases = () => {` |
| src/pages/gigs/BuyerPurchases.jsx | 21 | `const purchases = useMemo(() => orders.map(mapPurchase), [orders]);` |
| src/pages/gigs/BuyerPurchases.jsx | 25 | `return purchases.filter((p) => ['in_progress', 'delivered', 'pending'].includes(p.status));` |
| src/pages/gigs/BuyerPurchases.jsx | 27 | `return purchases.filter((p) => p.status === activeTab);` |
| src/pages/gigs/BuyerPurchases.jsx | 42 | `<h1 className="text-3xl font-black text-zinc-900">My Purchases</h1>` |
| src/pages/gigs/BuyerPurchases.jsx | 68 | `<p className="font-medium">No purchases found.</p>` |
| src/pages/gigs/BuyerPurchases.jsx | 126 | `export default BuyerPurchases;` |
| src/pages/gigs/GigCheckoutPage.jsx | 117 | `to="/gigs/purchases"` |
| src/pages/gigs/GigCheckoutPage.jsx | 120 | `View purchases` |
| src/pages/shared/LandingPage.jsx | 21 | `function cn(...classes) {` |
| src/pages/shared/LandingPage.jsx | 22 | `return classes.filter(Boolean).join(' ');` |
| src/pages/shared/LandingPage.jsx | 111 | `desc: 'Our engine analyses 200+ data points to connect you with the perfect match in under 60 seconds.',` |
| src/public/pages/AboutPage.jsx | 45 | `Bring Opportunity to All Talent. We empower the African youth and everyday entrepreneurs to build personal brands and businesses and make a living doing what they love best.` |
| src/public/pages/AboutPage.jsx | 126 | `Clear pricing, verified profiles, and platform protections mean fewer surprises and better outcomes.` |
| src/public/pages/GlobalHomepage.jsx | 388 | `Advanced solutions and professional talent for businesses` |
| src/public/pages/HelpCenterPage.jsx | 53 | `answer: 'Because of our Trust Guarantee. We focus on Quality & Trust — every provider is KYC Verified and every transaction uses our secure Escrow system. This elevates our quality far above casual listings.',` |
| src/public/pages/HelpCenterPage.jsx | 69 | `answer: 'We combat fraud with a multi-layered approach: KYC Verification: All Providers must complete mandatory verification using their National ID before offering services. Escrow Protection: Funds are held securely in an intermediary account until the work is formally approved by the Client. Secure Technology: Our platform uses advanced encryption and adheres to strict data security regulations to keep all user data protected.',` |
| src/public/pages/HelpCenterPage.jsx | 85 | `answer: 'Since your funds are held in Escrow, they are protected. If a dispute arises, Fortespace provides a clear, documented dispute resolution process. We review the evidence and communication logs to make a final, binding decision regarding the release or return of funds.',` |
| src/public/pages/HelpCenterPage.jsx | 89 | `answer: 'Yes. When posting a job or searching, you can use the Provider Type filter to specifically search for SME Providers (Small-to-Medium Enterprises). These businesses have the Verified Business Badge, indicating they often have teams, processes, and higher capacity for larger or ongoing projects.',` |
| src/public/pages/HelpCenterPage.jsx | 101 | `answer: 'We offer a tiered model to match your ambitions: Individuals & Independent Professionals: Basic/Free — Basic profile visibility, 3 bids monthly on posted jobs. Pro/Premium — $2/month, Priority Placement in search results, enhanced portfolio features. SME/Verified Businesses — $5/month, Verified Business Badge, access to higher-value bulk jobs, higher visibility. Enterprise/Large Agencies/Corporates — $100/month, bulk hiring features. Note: Fortespace also takes a small service fee (10%-15%) from the Provider\'s final payment, depending on the job value.',` |
| src/public/pages/StaticInfoPage.jsx | 39 | `body: 'Verification: To perform mandatory KYC checks and issue the KYC Verified Badge on profiles, thereby building the foundational trust of our platform. Transaction Security: To manage the Escrow process, process instant Mobile Money payouts, and resolve payment disputes. Service Matching: To use location and skill data to match Clients with the closest and most relevant Providers. Improvement: To analyze Fortescore data and platform usage to enhance security features and service quality.',` |
| src/admin/api/users/users.api.js | 34 | `const response = await apiClient.get(`/users/${userId}/sessions`);` |
| src/admin/components/ui/AdminActionModal.jsx | 80 | `impact: ['Active sessions terminated', 'API keys revoked', 'Marketplace listings hidden']` |
| src/admin/components/ui/AdminActionModal.jsx | 88 | `warning: 'This increases the risk score and may trigger automated restrictions on high-value transactions.',` |
| src/admin/components/ui/Modal.jsx | 25 | `const sizeClasses = {` |
| src/admin/components/ui/Modal.jsx | 41 | `sizeClasses[size]` |
| src/admin/pages/analytics/FraudAnalyticsPage.jsx | 21 | `Statistical analysis of threat patterns, prevented losses, and security performance.` |
| src/admin/pages/audit/ModuleAuditPage.jsx | 14 | `description: 'Detailed records of payments, escrow locks, releases, and invoicing activities.'` |
| src/admin/pages/config/SecuritySettingsPage.jsx | 26 | `updateSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value });` |
| src/admin/pages/config/SecuritySettingsPage.jsx | 109 | `value={securitySettings?.sessionTimeout \|\| '30'}` |
| src/admin/pages/disputes/DisputesInReviewPage.jsx | 38 | `Manage active cases currently assigned to the arbitration queue.` |
| src/admin/pages/marketplace/ContractsPage.jsx | 144 | `<option value="">All Statuses</option>` |
| src/admin/pages/marketplace/GigsManagementPage.jsx | 173 | `<option value="">All Statuses</option>` |
| src/admin/pages/marketplace/ModerationDashboard.jsx | 102 | `const res = await apiClient.post(`/fraud/cases/${reportId}/restrict`, {` |
| src/admin/pages/marketplace/ModerationDashboard.jsx | 118 | `label: 'Active Risk Cases',` |
| src/admin/pages/marketplace/ModerationDashboard.jsx | 119 | `value: kpiLoading ? '…' : (kpiData?.activeRiskCases ?? kpiData?.activeCases ?? '—'),` |
| src/admin/pages/marketplace/ModerationDashboard.jsx | 120 | `trend: kpiData?.activeRiskCasesTrend,` |
| src/admin/pages/marketplace/ProposalsReviewPage.jsx | 132 | `<option value="">All Statuses</option>` |
| src/admin/pages/marketplace/ReviewsPage.jsx | 123 | `<option value="">All Statuses</option>` |
| src/auth/components/onboarding/Step2BusinessStructure.jsx | 17 | `description: 'For small teams, startups, agencies, and growing businesses.',` |
| src/auth/components/onboarding/Step3RegistrationDetails.jsx | 51 | `sessionStorage.setItem('pendingVerificationEmail', payload.email);` |
| src/auth/components/onboarding/Step3RegistrationDetails.jsx | 75 | `Join thousands of {businessStructure === 'individual' ? 'professionals' : 'businesses'} scaling their success on Forte.` |
| src/auth/components/register/RegisterBottomSections.jsx | 42 | `answer: 'Yes. Your onboarding step and entered details are preserved in session storage so you can return without restarting.',` |
| src/auth/components/register/RegisterBottomSections.jsx | 117 | `Helpful answers for clients, freelancers, businesses, and growing teams joining the marketplace.` |
| src/auth/components/register/RegisterDetailsStep.jsx | 117 | `: 'Your progress will be preserved during this session.'}` |
| src/client/pages/client-services/ClientServicesLayout.jsx | 34 | `Client-side workspace for posting jobs and reviewing market responses.` |
| src/common/components/Loginsignup/Forgotpassword.js | 71 | `const [resendTimer, setResendTimer] = useState(0);` |
| src/common/components/Loginsignup/Forgotpassword.js | 83 | `// Countdown timer for resend button` |
| src/common/components/Loginsignup/Forgotpassword.js | 85 | `if (resendTimer <= 0) return;` |
| src/common/components/Loginsignup/Forgotpassword.js | 88 | `}, [resendTimer]);` |
| src/common/components/Loginsignup/Forgotpassword.js | 128 | `if (!email \|\| resendTimer > 0) return;` |
| src/common/components/Loginsignup/Forgotpassword.js | 133 | `const response = await authAPI.resendOTP(email, "", "email", "reset_password");` |
| src/common/components/Loginsignup/Forgotpassword.js | 137 | `setMessage({ type: "error", text: err.message \|\| "Could not resend the code." });` |
| src/common/components/Loginsignup/Forgotpassword.js | 230 | `disabled={loading \|\| resendTimer > 0}` |
| src/common/components/Loginsignup/Forgotpassword.js | 233 | `{resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}` |
| src/common/components/Loginsignup/Forgotpassword.js | 250 | `disabled={loading \|\| resendTimer > 0}` |
| src/common/components/Loginsignup/ResetPassword.js | 11 | `* A polished OTP input with auto-focus, paste support, and inline resend option.` |
| src/common/components/Loginsignup/ResetPassword.js | 13 | `const VerificationCodeInput = ({ value, onChange, onPaste, inputRefs, resendTimer, onResend, loading }) => {` |
| src/common/components/Loginsignup/ResetPassword.js | 32 | `{/* Label and resend button inline */}` |
| src/common/components/Loginsignup/ResetPassword.js | 40 | `disabled={loading \|\| resendTimer > 0}` |
| src/common/components/Loginsignup/ResetPassword.js | 43 | `{resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}` |
| src/common/components/Loginsignup/ResetPassword.js | 65 | `{/* Helper text with alternative resend link */}` |
| src/common/components/Loginsignup/ResetPassword.js | 71 | `disabled={loading \|\| resendTimer > 0}` |
| src/common/components/Loginsignup/ResetPassword.js | 101 | `const [resendTimer, setResendTimer] = useState(0);` |
| src/common/components/Loginsignup/ResetPassword.js | 113 | `// Countdown timer for resend button` |
| src/common/components/Loginsignup/ResetPassword.js | 115 | `if (resendTimer <= 0) return;` |
| src/common/components/Loginsignup/ResetPassword.js | 118 | `}, [resendTimer]);` |
| src/common/components/Loginsignup/ResetPassword.js | 140 | `if (!email \|\| resendTimer > 0) return;` |
| src/common/components/Loginsignup/ResetPassword.js | 145 | `const response = await authAPI.resendOTP(email, "", "email", "reset_password");` |
| src/common/components/Loginsignup/ResetPassword.js | 149 | `setMessage({ type: "error", text: err.message \|\| "Could not resend the code." });` |
| src/common/components/Loginsignup/ResetPassword.js | 238 | `{/* Verification Code Input with integrated resend */}` |
| src/common/components/Loginsignup/ResetPassword.js | 244 | `resendTimer={resendTimer}` |
| src/common/components/Loginsignup/Signin.js | 17 | `"Securing your session",` |
| src/common/components/Loginsignup/Signin.js | 86 | `const [resendLoading, setResendLoading] = useState(false);` |
| src/common/components/Loginsignup/Signin.js | 164 | `await authAPI.resendOTP(identifier, '', 'email');` |
| src/common/components/Loginsignup/Signin.js | 166 | `await authAPI.resendOTP('', identifier, 'phone');` |
| src/common/components/Loginsignup/Signin.js | 169 | `// Auto‑close modal after successful resend? Keep it open so user sees the notice.` |
| src/common/components/Loginsignup/Signin.js | 171 | `setError(err.message \|\| 'Unable to resend code.');` |
| src/common/components/Loginsignup/Signin.js | 225 | `await authAPI.resendOTP(verificationData.pendingEmail, "", "email");` |
| src/common/components/Loginsignup/Signin.js | 227 | `await authAPI.resendOTP("", verificationData.pendingPhoneNumber, "phone");` |
| src/common/components/Loginsignup/Signin.js | 232 | `setError(err.message \|\| "Failed to resend.");` |
| src/common/components/Loginsignup/Signin.js | 481 | `disabled={otpTimer > 0 \|\| resendLoading}` |
| src/common/components/Loginsignup/Signin.js | 514 | `disabled={otpTimer > 0 \|\| resendLoading}` |
| src/common/components/Loginsignup/Signin.js | 564 | `disabled={resendLoading}` |
| src/common/components/Loginsignup/Signin.js | 567 | `{resendLoading ? (` |
| src/common/components/Loginsignup/VerifyOTP.jsx | 12 | `const [resendCooldown, setResendCooldown] = useState(0);` |
| src/common/components/Loginsignup/VerifyOTP.jsx | 32 | `if (resendCooldown > 0) {` |
| src/common/components/Loginsignup/VerifyOTP.jsx | 33 | `const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);` |
| src/common/components/Loginsignup/VerifyOTP.jsx | 36 | `}, [resendCooldown]);` |
| src/common/components/Loginsignup/VerifyOTP.jsx | 93 | `if (resendCooldown > 0) return;` |
| src/common/components/Loginsignup/VerifyOTP.jsx | 96 | `await authAPI.resendOTP(` |
| src/common/components/Loginsignup/VerifyOTP.jsx | 104 | `toast.error(error.message \|\| "Failed to resend OTP");` |
| src/common/components/Loginsignup/VerifyOTP.jsx | 148 | `disabled={resendCooldown > 0}` |
| src/common/components/Loginsignup/VerifyOTP.jsx | 151 | `{resendCooldown > 0` |
| src/common/components/Loginsignup/VerifyOTP.jsx | 152 | `? `Resend in ${resendCooldown}s`` |
| src/modules/financial-control/pages/DepositsPage.jsx | 61 | `<option value="">All Statuses</option>` |
| src/modules/financial-control/pages/EscrowManagementPage.jsx | 52 | `Monitor protected funds, handle milestone releases, and manage disputes.` |
| src/modules/financial-control/pages/EscrowManagementPage.jsx | 85 | `description="Monitoring all fund locks, releases, and dispute-related ledger adjustments."` |
| src/modules/financial-control/pages/EscrowManagementPage.jsx | 107 | `<option value="">All Statuses</option>` |
| src/modules/financial-control/pages/FinancialHubPage.jsx | 112 | `<span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">{stats?.escrow?.pendingRelease \|\| 4} cases</span>` |
| src/modules/financial-control/pages/FinancialHubPage.jsx | 264 | `<option value="">All Statuses</option>` |
| src/modules/financial-control/pages/LedgerPage.jsx | 10 | `function cn(...classes) { return classes.filter(Boolean).join(' '); }` |
| src/modules/financial-control/pages/SubscriptionsPage.jsx | 69 | `<option value="">All Statuses</option>` |
| src/modules/financial-control/pages/WithdrawalsPage.jsx | 75 | `description="Tracking payout authorizations, gateway responses, and failure investigations."` |
| src/modules/financial-control/pages/WithdrawalsPage.jsx | 97 | `<option value="">All Statuses</option>` |
| src/admin/components/users/profile/FreelancerProfilePanel.jsx | 203 | `<SectionHeader title="Risk Assessment" icon={ShieldAlert} />` |
| src/freelancer/components/Findwork/Gigs/ManageGigs.js | 23 | `const baseClasses = "inline-flex items-center font-medium rounded-full";` |
| src/freelancer/components/Findwork/Gigs/ManageGigs.js | 24 | `const sizeClasses = {` |
| src/freelancer/components/Findwork/Gigs/ManageGigs.js | 31 | `const variantClasses = {` |
| src/freelancer/components/Findwork/Gigs/ManageGigs.js | 43 | `<span className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>` |
| src/freelancer/components/Findwork/Gigs/ManageGigs.js | 119 | `const colorClasses = {` |
| src/freelancer/components/Findwork/Gigs/ManageGigs.js | 139 | `className={`h-full ${colorClasses[color]} rounded-full transition-all duration-700`}` |
| src/freelancer/components/Findwork/Gigs/ManageGigs.js | 156 | `const baseClasses = "flex items-center justify-center gap-2 font-medium transition-all rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2";` |
| src/freelancer/components/Findwork/Gigs/ManageGigs.js | 158 | `const sizeClasses = {` |
| src/freelancer/components/Findwork/Gigs/ManageGigs.js | 164 | `const variantClasses = {` |
| src/freelancer/components/Findwork/Gigs/ManageGigs.js | 178 | `${baseClasses}` |
| src/freelancer/components/Findwork/Gigs/ManageGigs.js | 179 | `${sizeClasses[size]}` |
| src/freelancer/components/Findwork/Gigs/ManageGigs.js | 180 | `${variantClasses[variant]}` |
| src/freelancer/components/Findwork/Performance/Analytics.js | 82 | `const colorClasses = {` |
| src/freelancer/components/Findwork/Performance/Analytics.js | 97 | `className={`h-full rounded-full ${colorClasses[color]}`}` |
| src/freelancer/components/Findwork/Performance/SkillLevels.js | 84 | `const colorClasses = {` |
| src/freelancer/components/Findwork/Performance/SkillLevels.js | 115 | `className={`h-full rounded-full ${colorClasses[color]} transition-all duration-500`}` |
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './common/authStore';
import { profileAPI } from './common/services/api';
import LoginPage from './admin/pages/LoginPage';
import AdminRoutes from './admin/AdminRoutes';

import AgencyRoutes from './agency/AgencyRoutes';
import SearchRoutes from './search/SearchRoutes';
import VerificationRoutes from './verification/VerificationRoutes';
import EscrowRoutes from './escrow/EscrowRoutes';
import MarketplaceLayout from './layouts/MarketplaceLayout';
import LandingPage from './pages/shared/LandingPage';
import FindTalentLanding from './pages/FindTalentLanding';
import PricingPage from './pages/PricingPage';
import SubscriptionBootstrap from './common/components/SubscriptionBootstrap';
import OnlineFreelancers from './pages/OnlineFreelancers';

import OnsiteProfessionals from './pages/OnsiteProfessionals';
import HybridTalent from './pages/HybridTalent';
import TalentCategories from './pages/TalentCategories';
import CategoryDetailsOnline from './pages/CategoryDetailsOnline';
import CategoryDetailsOnsite from './pages/CategoryDetailsOnsite';
import SearchResults from './pages/SearchResults';
import SavedSearches from './pages/SavedSearches';
import RecommendedTalent from './pages/RecommendedTalent';
import FreelancerProfile from './pages/FreelancerProfile';
import PortfolioGallery from './pages/PortfolioGallery';
import Reviews from './pages/Reviews';
import ServiceCatalog from './pages/ServiceCatalog';
import Availability from './pages/Availability';
import Verification from './pages/Verification';
import HireFreelancer from './pages/HireFreelancer';
import InviteFreelancer from './pages/InviteFreelancer';
import CreateOffer from './pages/CreateOffer';
import ContractPreview from './pages/ContractPreview';
import EnterpriseHiring from './pages/EnterpriseHiring';
import ManagedTeams from './pages/ManagedTeams';
import TalentShortlist from './pages/TalentShortlist';
import NearbyProfessionals from './pages/NearbyProfessionals';
import CityTalentDirectory from './pages/CityTalentDirectory';
import EmergencyServices from './pages/EmergencyServices';
import TalentComparison from './pages/TalentComparison';
import SavedCollections from './pages/SavedCollections';
import BookConsultation from './pages/BookConsultation';
import PortfolioShowcase from './pages/PortfolioShowcase';
import FreelancerVideoFeeds from './pages/FreelancerVideoFeeds';
import MeetingsPage from './pages/MeetingsPage';
import PublicProjectShowcase from './pages/PublicProjectShowcase';
import TopRatedTalents from './pages/TopRatedTalents';
import RisingTalents from './pages/RisingTalents';
import VerifiedTalents from './pages/VerifiedTalents';
import AgencyDirectory from './pages/AgencyDirectory';
import AITalentMatching from './pages/AITalentMatching';
import RecentlyViewedTalent from './pages/RecentlyViewedTalent';
import CommunityRecommendations from './pages/CommunityRecommendations';
import SuccessStories from './pages/SuccessStories';
import InstantBooking from './pages/InstantBooking';
import LiveAvailability from './pages/LiveAvailability';
import SafetyTrustCenter from './pages/SafetyTrustCenter';
import VerificationProcess from './pages/VerificationProcess';
import TalentHiringHelpCenter from './pages/TalentHiringHelpCenter';
import ClientHiringDashboard from './pages/ClientHiringDashboard';
import FreelancerDiscoveryMap from './pages/FreelancerDiscoveryMap';
import FreelancerLeaderboard from './pages/FreelancerLeaderboard';
import ClientPublicProfile from './pages/ClientPublicProfile';
import AgencyProfile from './pages/AgencyProfile';
import SkillAssessment from './pages/SkillAssessment';
import CertificationShowcase from './pages/CertificationShowcase';
import TalentInsights from './pages/TalentInsights';
import IndustryTalent from './pages/IndustryTalent';
import FreelancerOnboardingLanding from './pages/FreelancerOnboardingLanding';
import ClientOnboardingLanding from './pages/ClientOnboardingLanding';
import FreelancerSuccessScore from './pages/FreelancerSuccessScore';
import TrustScoreExplanation from './pages/TrustScoreExplanation';
import ClientReviewsDirectory from './pages/ClientReviewsDirectory';
import FreelancerDiscoveryAi from './pages/FreelancerDiscoveryAi';
import MobileFindTalent from './pages/MobileFindTalent';
import HiringPipeline from './pages/HiringPipeline';
import TalentRoutes from './client/pages/hire-talent';

// Find Work Module (Freelancer Side)
import FindWorkHub from './pages/find-work/FindWorkHub';
import OnlineWorkListings from './pages/find-work/OnlineWorkListings';
import LocalWorkListings from './pages/find-work/LocalWorkListings';
import WorkDetail from './pages/find-work/WorkDetail';
import FindWorkSearchResults from './pages/find-work/SearchResults';
import CategoryBrowse from './pages/find-work/CategoryBrowse';
import SavedWork from './pages/find-work/SavedWork';
import ClientPostedWork from './pages/find-work/ClientPostedWork';
import ProviderApplications from './pages/find-work/ProviderApplications';

// New Find Work Modules (The 17 Pages Expansion)
import WorkProposal from './pages/find-work/WorkProposal';
import ViewApplications from './pages/find-work/ViewApplications';
import WorkAgreement from './pages/find-work/WorkAgreement';
import WorkProgress from './pages/find-work/WorkProgress';
import WorkCompletion from './pages/find-work/WorkCompletion';
import RatingReview from './pages/find-work/RatingReview';
import WorkRevision from './pages/find-work/WorkRevision';
import DisputeResolution from './pages/find-work/DisputeResolution';
import WorkCancellation from './pages/find-work/WorkCancellation';
import CounterOffer from './pages/find-work/CounterOffer';
import ShortlistedApplicants from './pages/find-work/ShortlistedApplicants';
import WorkHistory from './pages/find-work/WorkHistory';
import ProviderManagement from './pages/find-work/ProviderManagement';
import WithdrawApplication from './pages/find-work/WithdrawApplication';
import WorkTemplates from './pages/find-work/WorkTemplates';
import TeamCollaborators from './pages/find-work/TeamCollaborators';
import WorkAnalytics from './pages/find-work/WorkAnalytics';

// Gigs Module (Freelancer pre-packaged services)
import GigsHub from './pages/gigs/GigsHub';
import GigsByCategory from './pages/gigs/GigsByCategory';
import GigDetail from './pages/gigs/GigDetail';
import GigCheckoutPage from './pages/gigs/GigCheckoutPage';
import GigSearchResults from './pages/gigs/GigSearchResults';
import MyGigs from './pages/gigs/MyGigs';
import CreateEditGig from './pages/gigs/CreateEditGig';
import SellerOrders from './pages/gigs/SellerOrders';
import BuyerPurchases from './pages/gigs/BuyerPurchases';
import SellerProfile from './pages/gigs/SellerProfile';
import TopSellers from './pages/gigs/TopSellers';
import GigReviews from './pages/gigs/GigReviews';

import GlobalHomepage from './public/pages/GlobalHomepage';
import GlobalSearchPage from './public/pages/GlobalSearchPage';
import StaticInfoPage from './public/pages/StaticInfoPage';
import AboutPage from './public/pages/AboutPage';
import ContactPage from './public/pages/ContactPage';
import PublicClientProfilePage from './public/pages/PublicClientProfilePage';
import GlobalJobsPage from './public/pages/GlobalJobsPage';
import PublicFreelancerProfilePage from './public/pages/PublicFreelancerProfilePage';
import PublicGigPage from './public/pages/PublicGigPage';
import HelpCenterPage from './public/pages/HelpCenterPage';
import MessagingCenterPage from './common/pages/MessagingCenterPage';
import NotificationsCenterPage from './common/pages/NotificationsCenterPage';
import DisputeResolutionCenterPage from './common/pages/DisputeResolutionCenterPage';
import IdentityVerificationCenterPage from './common/pages/IdentityVerificationCenterPage';
import AccountSecurityCenterPage from './common/pages/AccountSecurityCenterPage';
import TrustScoreDashboardPage from './common/pages/TrustScoreDashboardPage';
import FeaturedServicesMarketplacePage from './public/pages/FeaturedServicesMarketplacePage';
import PromotionsCouponsCenterPage from './common/pages/PromotionsCouponsCenterPage';
import AffiliateReferralDashboardPage from './common/pages/AffiliateReferralDashboardPage';
import CommunityForumPage from './public/pages/CommunityForumPage';
import SuccessStoriesPage from './public/pages/SuccessStoriesPage';
import ClientLayout from './client/ClientLayout';
import FreelancerLayout from './freelancer/FreelancerLayout';

import AuthLoginPage from './pages/auth/Login';
import RegisterPage from './pages/RegisterPage';
import VerifyEmailPage from './auth/pages/VerifyEmailPage';
import ForgotPasswordPage from './auth/pages/ForgotPasswordPage';
import ResetPasswordPage from './auth/pages/ResetPasswordPage';
import OTPVerificationPage from './auth/pages/OTPVerificationPage';
import SessionExpiredPage from './auth/pages/SessionExpiredPage';
import Verify2FAPage from './auth/pages/Verify2FAPage';
import AccountRecoveryPage from './auth/pages/AccountRecoveryPage';
import AdminLoginPage from './auth/pages/AdminLoginPage';
import AdminSecurityVerificationPage from './auth/pages/AdminSecurityVerificationPage';
import OAuthCallbackPage from './auth/pages/OAuthCallbackPage';
import RoleSelectionPage from './auth/pages/RoleSelectionPage';
import ExperienceLevelPage from './auth/pages/ExperienceLevelPage';
import SkillSelectionPage from './auth/pages/SkillSelectionPage';
import AvailabilitySetupPage from './auth/pages/AvailabilitySetupPage';
import RateSetupPage from './auth/pages/RateSetupPage';
import ProfileCompletionPage from './auth/pages/ProfileCompletionPage';

// Security Dashboard Pages
import SecurityDashboard from './auth/pages/SecurityDashboard';
import ActiveSessionsPage from './auth/pages/ActiveSessionsPage';
import ConnectedAccountsPage from './auth/pages/ConnectedAccountsPage';
import SuspiciousActivityReviewPage from './auth/pages/SuspiciousActivityReviewPage';
import AccessDeniedPage from "./auth/pages/AccessDeniedPage";
import { getDashboardPathForRole } from './auth/utils/authRouting';

import ClientCompanyProfilePage from './client/pages/ClientCompanyProfilePage';
import ClientProfileRouter from './client/pages/ClientProfileRouter';
import ClientInterviewManagementPage from './client/pages/ClientInterviewManagementPage';
import ClientShortlistPage from './client/pages/ClientShortlistPage';
import ClientTeamWorkspacePage from './client/pages/ClientTeamWorkspacePage';
import ClientTeamManagementPage from './client/pages/ClientTeamManagementPage';
import ClientWalletDashboard from './client/pages/ClientWalletDashboard';
import ClientContractsPage from './client/pages/ContractsPage';
import ClientDashboardPage from './client/pages/DashboardPage';
import ClientMessagesPage from './client/pages/MessagesPage';
import ClientPostJobPage from './client/pages/PostJobPage';
import ClientProposalsPage from './client/pages/ProposalsPage';
import ClientReviewsPage from './client/pages/ReviewsPage';
import ClientVerifyOtpPage from './client/pages/ClientVerifyOtpPage';
import ClientSetupWizard from './client/pages/ClientSetupWizard';
import ClientFinancialDashboard from './client/pages/ClientFinancialDashboard';
import ClientOfflineMapPage from './client/pages/ClientOfflineMapPage';
import ClientMpesaSetupPage from './client/pages/ClientMpesaSetupPage';
import ClientGpsTrackingPage from './client/pages/ClientGpsTrackingPage';
import ClientSiteCheckinPage from './client/pages/ClientSiteCheckinPage';
import ClientApprovalChainsPage from './client/pages/ClientApprovalChainsPage';
import ClientSecurityCenterPage from './client/pages/ClientSecurityCenterPage';
import ClientCompliancePage from './client/pages/ClientCompliancePage';
import ClientProcurementEcosystemPage from './client/pages/ClientProcurementEcosystemPage';
import ClientWorkflowBuilderPage from './client/pages/ClientWorkflowBuilderPage';
import ClientTimeTrackingPage from './client/pages/ClientTimeTrackingPage';
import ClientInvoicesPage from './client/pages/ClientInvoicesPage';
import ClientRoiAnalyticsPage from './client/pages/ClientRoiAnalyticsPage';
import ClientAnnouncementsPage from './client/pages/ClientAnnouncementsPage';
import ClientTalentSearchPage from './client/pages/ClientTalentSearchPage';
import ClientContractBuilderPage from './client/pages/ClientContractBuilderPage';
import ClientPermissionsPage from './client/pages/ClientPermissionsPage';
import ClientSupportHelpdeskPage from './client/pages/ClientSupportHelpdeskPage';
import ClientWelcomePage from './client/pages/ClientWelcomePage';
import ClientDeveloperPage from './client/pages/ClientDeveloperPage';
import ClientAgencyManagementPage from './client/pages/ClientAgencyManagementPage';
import ClientErpSystemsPage from './client/pages/ClientErpSystemsPage';
import ClientTaskWorkspacePage from './client/pages/ClientTaskWorkspacePage';
import ClientCreateJob from './client/pages/client-services/CreateJob';
import ClientMyJobs from './client/pages/client-services/MyJobs';
import FreelancerAvailabilitySchedulerPage from './freelancer/pages/AvailabilitySchedulerPage';
import FreelancerBuyerRequestsPage from './freelancer/pages/BuyerRequestsPage';
import FreelancerCertificationManagementPage from './freelancer/pages/CertificationManagementPage';
import FreelancerCertificationsPage from './freelancer/pages/CertificationsPage';
import FreelancerContractsPage from './freelancer/pages/ContractsPage';
import FreelancerGigCreationWizardPage from './freelancer/pages/CreateGigWizardPage';
import FreelancerSavedJobsPage from './freelancer/pages/SavedJobsPage';
import FreelancerDashboardPage from './freelancer/pages/DashboardPage';
import FreelancerRecommendationProfilePage from './freelancer/pages/RecommendationProfilePage';
import ClientRecommendationProfilePage from './client/pages/RecommendationProfilePage';
import FreelancerDisputeResponsePage from './freelancer/pages/DisputeResponsePage';
import FreelancerDisputesPage from './freelancer/pages/DisputesPage';
import FreelancerActivityFeedPage from './freelancer/pages/FreelancerActivityFeedPage';
import FreelancerAnalyticsPage from './freelancer/pages/FreelancerAnalyticsPage';
import FreelancerAvailabilityPage from './freelancer/pages/FreelancerAvailabilityPage';
import FreelancerSkillsManagementPage from './freelancer/pages/SkillsManagementPage';
import FreelancerNotificationSettingsPage from './freelancer/pages/NotificationSettingsPage';
import FreelancerPrivacySecuritySettingsPage from './freelancer/pages/PrivacySecuritySettingsPage';
import FreelancerApiIntegrationsPage from './freelancer/pages/ApiIntegrationsPage';
import FreelancerAppearanceSettingsPage from './freelancer/pages/AppearanceSettingsPage';
import FreelancerHelpCenterPage from './freelancer/pages/HelpCenterPage';
import FreelancerSupportTicketsPage from './freelancer/pages/SupportTicketsPage';
import FreelancerCommunityForumPage from './freelancer/pages/CommunityForumPage';
import FreelancerTutorialOnboardingPage from './freelancer/pages/TutorialOnboardingPage';
import FreelancerOtpVerificationPage from './freelancer/pages/OtpVerificationPage';
import FreelancerNearbyJobsPage from './freelancer/pages/NearbyJobsPage';
import FreelancerOfflineJobsMapPage from './freelancer/pages/OfflineJobsMapPage';
import FreelancerRemoteJobsPage from './freelancer/pages/RemoteJobsPage';
import FreelancerHybridJobsPage from './freelancer/pages/HybridJobsPage';
import FreelancerGlobalSearchResultsPage from './freelancer/pages/GlobalSearchResultsPage';
import FreelancerGlobalBookmarksPage from './freelancer/pages/GlobalBookmarksPage';
import FreelancerUpgradePlanPage from './freelancer/pages/UpgradePlanPage';
import FreelancerClientManagementPage from './freelancer/pages/FreelancerClientManagementPage';
import FreelancerGoalsEarningsTrackerPage from './freelancer/pages/GoalsEarningsTrackerPage';
import FreelancerProposalSubmissionPage from './freelancer/pages/FreelancerProposalSubmissionPage';
import FreelancerReferralPage from './freelancer/pages/FreelancerReferralPage';
import FreelancerTaxInvoicesPage from './freelancer/pages/FreelancerTaxInvoicesPage';
import FreelancerGigDetailPage from './freelancer/pages/GigDetailPage';
import FreelancerGigEditPage from './freelancer/pages/GigEditPage';
import FreelancerJobsPage from './freelancer/pages/JobsPage';
import FreelancerJobDetailsPage from './freelancer/pages/JobDetailsPage';
import FreelancerMessagesPage from './freelancer/pages/MessagesPage';
import FreelancerOrdersPage from './freelancer/pages/OrdersPage';
import FreelancerCalendarPage from './freelancer/pages/CalendarPage';
import FreelancerBookingsPage from './freelancer/pages/BookingsPage';
import FreelancerRevenueReportsPage from './freelancer/pages/RevenueReportsPage';
import FreelancerInvoiceManagementPage from './freelancer/pages/InvoiceManagementPage';
import FreelancerEscrowPage from './freelancer/pages/EscrowPage';
import FreelancerMyGigsDashboardPage from './freelancer/pages/MyGigsDashboardPage';
import FreelancerPortfolioManagementPage from './freelancer/pages/PortfolioManagementPage';
import FreelancerProfileRouter from './freelancer/pages/FreelancerProfileRouter';
import FreelancerPersonalDetailsPage from './freelancer/pages/PersonalDetailsPage';
import FreelancerProposalDetailsPage from './freelancer/pages/ProposalDetailsPage';
import FreelancerProposalsPage from './freelancer/pages/ProposalsPage';
import FreelancerReviewsPage from './freelancer/pages/ReviewsPage';
import FreelancerSkillTestsPage from './freelancer/pages/SkillTestsPage';
import FreelancerWalletPage from './freelancer/pages/WalletPage';
import FreelancerPaymentSetupPage from './freelancer/pages/PaymentSetupPage';
import FreelancerWithdrawalPage from './freelancer/pages/WithdrawalPage';
import FreelancerWorkHistoryPage from './freelancer/pages/WorkHistoryPage';

// Agency / Team workspace page imports
import FreelancerTeamManagementPage from './agency/pages/TeamManagementPage';
import FreelancerSharedProjectsPage from './agency/pages/SharedProjectsPage';
import FreelancerAgencyWorkspacePage from './agency/pages/AgencyWorkspacePage';
import FreelancerDepartmentsPage from './agency/pages/DepartmentsPage';
import FreelancerTeamPermissionsPage from './agency/pages/TeamPermissionsPage';
import FreelancerFileManagerPage from './agency/pages/FileManagerPage';
import FreelancerUploadCenterPage from './agency/pages/UploadCenterPage';
import FreelancerSharedAssetsPage from './agency/pages/SharedAssetsPage';
import FreelancerDownloadsPage from './agency/pages/DownloadsPage';

const PROFILE_BYPASS_PATHS = [
  '/auth/profile-completion',
  '/auth/profile-setup',
  '/auth/role-selection',
  '/auth/skills',
  '/auth/experience-level',
  '/auth/availability',
  '/auth/rate-setup',
  '/dashboard',
  '/client/dashboard',
  '/client/profile',
  '/client/company-profile',
  '/client/setup-wizard',
  '/client/',
  '/freelancer/dashboard',
  '/freelancer/profile',
  '/freelancer/personal-details',
  '/freelancer/',
];

const isPathBypassed = (pathname) =>
  PROFILE_BYPASS_PATHS.some((allowedPath) => pathname === allowedPath || pathname.startsWith(`${allowedPath}/`));

const GuardLoading = ({ label = 'Checking your profile' }) => (
  <div className="flex min-h-screen items-center justify-center bg-surface dark:bg-surface-dark px-6">
    <div className="rounded-3xl border border-zinc-200 bg-white px-6 py-5 text-sm font-semibold text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
      {label}...
    </div>
  </div>
);

const useProfileCompletionStatus = (enabled) => {
  const user = useAuthStore((state) => state.user);
  const [status, setStatus] = useState({
    loading: Boolean(enabled),
    complete: false,
  });

  useEffect(() => {
    let active = true;

    if (!enabled) {
      setStatus({ loading: false, complete: true });
      return () => {
        active = false;
      };
    }

    const explicitCompletion = user?.profileCompleted ?? user?.profile?.profileCompleted;
    if (explicitCompletion === true) {
      setStatus({ loading: false, complete: true });
      return () => {
        active = false;
      };
    }

    setStatus({ loading: true, complete: false });

    profileAPI
      .getMissingFields()
      .then((response) => {
        if (!active) return;
        const data = response?.data ?? response;
        setStatus({
          loading: false,
          complete: Boolean(data?.isComplete),
        });
      })
      .catch(() => {
        if (!active) return;
        const explicitCompletion = user?.profileCompleted ?? user?.profile?.profileCompleted;
        setStatus({
          loading: false,
          complete: explicitCompletion === true,
        });
      });

    return () => {
      active = false;
    };
  }, [enabled, user?.id, user?.role, user?.profileCompleted, user?.profile?.profileCompleted]);

  return status;
};

const RoleProtectedRoute = ({ role, children }) => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();
  const profileStatus = useProfileCompletionStatus(isAuthenticated && String(user?.role || '').toUpperCase() === role);

  if (!isAuthenticated || String(user?.role || '').toUpperCase() !== role) {
    return <Navigate to="/auth/login" replace />;
  }

  if (profileStatus.loading) {
    return <GuardLoading />;
  }

  if (!profileStatus.complete && !isPathBypassed(location.pathname)) {
    return <Navigate to="/auth/profile-completion" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};

const ClientProtectedRoute = ({ children }) => {
  return <RoleProtectedRoute role="CLIENT">{children}</RoleProtectedRoute>;
};

const FreelancerProtectedRoute = ({ children }) => {
  return <RoleProtectedRoute role="FREELANCER">{children}</RoleProtectedRoute>;
};

const AuthenticatedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  return <>{children}</>;
};

const RoleDashboardRedirect = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!user?.role) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Navigate to={getDashboardPathForRole(user?.role)} replace />;
};

function AuthBootstrap({ children }) {
  useEffect(() => {
    useAuthStore.getState().hydrateFromStorage();
  }, []);
  return (
    <>
      <SubscriptionBootstrap />
      {children}
    </>
  );
}

function App() {
  return (
    <AuthBootstrap>
    <Router>
      <Routes>
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* Public Routes with Shared Navbar/Footer */}
        <Route element={<MarketplaceLayout />}>
          <Route path="/freelancer/:username" element={<PublicFreelancerProfilePage />} />
        <Route path="/agency/*" element={<AgencyRoutes />} />
        <Route path="/search" element={<GlobalSearchPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/careers" element={<StaticInfoPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/terms" element={<StaticInfoPage />} />
        <Route path="/privacy" element={<StaticInfoPage />} />
        <Route path="/accessibility" element={<StaticInfoPage />} />
        <Route path="/clients/:clientId" element={<PublicClientProfilePage />} />
        <Route path="/jobs" element={<GlobalJobsPage />} />
        <Route path="/search/*" element={<SearchRoutes />} />
        <Route path="/verification/*" element={<VerificationRoutes />} />
        <Route path="/escrow/*" element={<EscrowRoutes />} />

        <Route path="/gig/:slug" element={<PublicGigPage />} />
        <Route path="/help-center" element={<HelpCenterPage />} />
        <Route path="/messages" element={<MessagingCenterPage />} />
        <Route path="/notifications" element={<NotificationsCenterPage />} />
        <Route path="/disputes/:id" element={<DisputeResolutionCenterPage />} />

        {/* Auth Routes with Shared Navbar/Footer */}
        <Route path="/auth/login" element={<AuthLoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/oauth/callback" element={<OAuthCallbackPage />} />
        <Route path="/auth/verify-email" element={<AuthenticatedRoute><VerifyEmailPage /></AuthenticatedRoute>} />
        <Route path="/auth/verify-otp" element={<OTPVerificationPage />} />
        <Route path="/auth/verify-2fa" element={<Verify2FAPage />} />
        <Route path="/auth/admin" element={<AdminLoginPage />} />
        <Route path="/auth/admin/verify" element={<AdminSecurityVerificationPage />} />
        <Route path="/auth/recovery" element={<AccountRecoveryPage />} />
        <Route path="/auth/security" element={<AuthenticatedRoute><SecurityDashboard /></AuthenticatedRoute>} />
        <Route path="/auth/sessions" element={<AuthenticatedRoute><ActiveSessionsPage /></AuthenticatedRoute>} />
        <Route path="/auth/connected-accounts" element={<AuthenticatedRoute><ConnectedAccountsPage /></AuthenticatedRoute>} />
        <Route path="/auth/suspicious-activity" element={<AuthenticatedRoute><SuspiciousActivityReviewPage /></AuthenticatedRoute>} />
        <Route path="/auth/role-selection" element={<AuthenticatedRoute><RoleSelectionPage /></AuthenticatedRoute>} />
        <Route path="/auth/skills" element={<AuthenticatedRoute><SkillSelectionPage /></AuthenticatedRoute>} />
        <Route path="/auth/experience-level" element={<AuthenticatedRoute><ExperienceLevelPage /></AuthenticatedRoute>} />
        <Route path="/auth/availability" element={<AuthenticatedRoute><AvailabilitySetupPage /></AuthenticatedRoute>} />
        <Route path="/auth/rate-setup" element={<AuthenticatedRoute><RateSetupPage /></AuthenticatedRoute>} />
        <Route path="/auth/profile-completion" element={<AuthenticatedRoute><ProfileCompletionPage /></AuthenticatedRoute>} />
        <Route path="/auth/profile-setup" element={<Navigate to="/auth/profile-completion" replace />} />
        <Route path="/auth/session-expired" element={<SessionExpiredPage />} />
        <Route path="/auth/access-denied" element={<AccessDeniedPage />} />

        {/* Legacy auth redirects */}
        <Route path="/auth/register/freelancer" element={<Navigate to="/auth/register" replace />} />
        <Route path="/auth/register/select" element={<Navigate to="/auth/register" replace />} />
        <Route path="/signup" element={<Navigate to="/auth/register" replace />} />
        <Route path="/register" element={<Navigate to="/auth/register" replace />} />
        <Route path="/signin" element={<Navigate to="/auth/login" replace />} />
        <Route path="/login" element={<Navigate to="/auth/login" replace />} />

        <Route path="/account-security" element={<AccountSecurityCenterPage />} />
        <Route path="/featured-services" element={<FeaturedServicesMarketplacePage />} />
        <Route path="/promotions" element={<PromotionsCouponsCenterPage />} />
        <Route path="/affiliates" element={<AffiliateReferralDashboardPage />} />
        <Route path="/community" element={<CommunityForumPage />} />
        <Route path="/success-stories" element={<SuccessStoriesPage />} />

        <Route path="/marketplace" element={<LandingPage />} />
        <Route path="/" element={<GlobalHomepage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/find-talent" element={<FindTalentLanding />} />
        <Route path="/freelancers" element={<Navigate to="/find-talent" replace />} />
        <Route path="/talent" element={<FindTalentLanding />} />
        <Route path="/talent/*" element={<TalentRoutes />} />
        <Route path="/online" element={<OnlineFreelancers />} />
        <Route path="/onsite" element={<OnsiteProfessionals />} />
        <Route path="/hybrid" element={<HybridTalent />} />
        <Route path="/categories" element={<TalentCategories />} />
        <Route path="/categories/online/:category" element={<CategoryDetailsOnline />} />
        <Route path="/categories/onsite/:category" element={<CategoryDetailsOnsite />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/saved-searches" element={<SavedSearches />} />
        <Route path="/recommended-talent" element={<RecommendedTalent />} />

        {/* Phase 4: Freelancer Profiles */}
        <Route path="/talent/:talentId" element={<FreelancerProfile />} />
        <Route path="/profile" element={<FreelancerProfile />} />
        <Route path="/portfolio" element={<PortfolioGallery />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/services" element={<ServiceCatalog />} />
        <Route path="/availability" element={<Availability />} />
        <Route path="/verify-profile" element={<Verification />} />

        {/* Phase 6: Hiring & Contracts */}
        <Route path="/talent/:talentId/hire" element={<HireFreelancer />} />
        <Route path="/talent/:talentId/invite" element={<InviteFreelancer />} />
        <Route path="/hire" element={<HireFreelancer />} />
        <Route path="/invite" element={<InviteFreelancer />} />
        <Route path="/create-offer" element={<CreateOffer />} />
        <Route path="/contract/preview" element={<ContractPreview />} />

        {/* Phase 7: Enterprise & Teams */}
        <Route path="/enterprise" element={<EnterpriseHiring />} />
        <Route path="/enterprise/teams" element={<ManagedTeams />} />
        <Route path="/shortlist" element={<TalentShortlist />} />

        {/* Phase 8: Location & Emergency */}
        <Route path="/nearby" element={<NearbyProfessionals />} />
        <Route path="/city-directory" element={<CityTalentDirectory />} />
        <Route path="/emergency" element={<EmergencyServices />} />

        {/* Tools & Collections */}
        <Route path="/compare" element={<TalentComparison />} />
        <Route path="/saved" element={<SavedCollections />} />
        <Route path="/book-consultation" element={<BookConsultation />} />

        {/* Advanced Portfolio & Feeds */}
        <Route path="/portfolios" element={<PortfolioShowcase />} />
        <Route path="/videos" element={<FreelancerVideoFeeds />} />
        <Route path="/meetings" element={<MeetingsPage />} />
        <Route path="/delivered" element={<PublicProjectShowcase />} />

        {/* Curated Directories */}
        <Route path="/top-rated" element={<TopRatedTalents />} />
        <Route path="/rising-stars" element={<RisingTalents />} />
        <Route path="/verified" element={<VerifiedTalents />} />
        <Route path="/agencies" element={<AgencyDirectory />} />

        {/* AI Features */}
        <Route path="/ai-match" element={<AITalentMatching />} />

        {/* Phase 9 & 10: Trust, Safety & Booking */}
        <Route path="/recently-viewed" element={<RecentlyViewedTalent />} />
        <Route path="/community-picks" element={<CommunityRecommendations />} />
        <Route path="/success-stories" element={<SuccessStories />} />
        <Route path="/instant-book" element={<InstantBooking />} />
        <Route path="/live-availability" element={<LiveAvailability />} />
        <Route path="/trust-center" element={<SafetyTrustCenter />} />
        <Route path="/verification-process" element={<VerificationProcess />} />
        <Route path="/help-center" element={<TalentHiringHelpCenter />} />


        {/* Moved Freelancer routes outside MarketplaceLayout */}
        <Route path="/map-discovery" element={<FreelancerDiscoveryMap />} />
        <Route path="/leaderboard" element={<FreelancerLeaderboard />} />
        <Route path="/client-profile" element={<ClientPublicProfile />} />

        {/* Phase 12-15: Agencies, Insights, AI & Pipeline */}
        <Route path="/agency/:id" element={<AgencyProfile />} />
        <Route path="/assessments" element={<SkillAssessment />} />
        <Route path="/certifications" element={<CertificationShowcase />} />
        <Route path="/insights" element={<TalentInsights />} />
        <Route path="/industries" element={<IndustryTalent />} />
        <Route path="/join-freelancer" element={<FreelancerOnboardingLanding />} />
        <Route path="/join-client" element={<ClientOnboardingLanding />} />
        <Route path="/success-score" element={<FreelancerSuccessScore />} />
        <Route path="/trust-score" element={<TrustScoreExplanation />} />
        <Route path="/reviews-directory" element={<ClientReviewsDirectory />} />
        <Route path="/ai-discovery" element={<FreelancerDiscoveryAi />} />
        <Route path="/mobile-app" element={<MobileFindTalent />} />
        <Route path="/pipeline" element={<HiringPipeline />} />

        {/* Find Work Module (Freelancer Portal) */}
        <Route path="/find-work" element={<FindWorkHub />} />
        <Route path="/find-work/online" element={<OnlineWorkListings />} />
        <Route path="/find-work/local" element={<LocalWorkListings />} />
        <Route path="/find-work/work/:id" element={<WorkDetail />} />
        <Route path="/find-work/search" element={<FindWorkSearchResults />} />
        <Route path="/find-work/categories" element={<CategoryBrowse />} />
        <Route path="/find-work/category/:categoryId" element={<CategoryBrowse />} />
        <Route path="/find-work/saved" element={<SavedWork />} />
        <Route path="/find-work/my-posted-work" element={<ClientPostedWork />} />
        <Route path="/find-work/my-applications" element={<ProviderApplications />} />

        {/* Find Work 17-Page Expansion Routes */}
        <Route path="/find-work/work/:workId/apply" element={<WorkProposal />} />
        <Route path="/find-work/work/:workId/applications" element={<ViewApplications />} />
        <Route path="/find-work/work/:workId/hire" element={<WorkAgreement />} />
        <Route path="/find-work/orders/:orderId" element={<WorkProgress />} />
        <Route path="/find-work/orders/:orderId/complete" element={<WorkCompletion />} />
        <Route path="/find-work/orders/:orderId/review" element={<RatingReview />} />
        <Route path="/find-work/orders/:orderId/revise" element={<WorkRevision />} />
        <Route path="/find-work/orders/:orderId/dispute" element={<DisputeResolution />} />
        <Route path="/find-work/work/:workId/cancel" element={<WorkCancellation />} />
        <Route path="/find-work/work/:workId/make-offer" element={<CounterOffer />} />
        <Route path="/find-work/work/:workId/shortlisted" element={<ShortlistedApplicants />} />
        <Route path="/find-work/my-posted-work/archive" element={<WorkHistory />} />
        <Route path="/find-work/providers" element={<ProviderManagement />} />
        <Route path="/find-work/my-applications/:appId/withdraw" element={<WithdrawApplication />} />
        <Route path="/find-work/templates" element={<WorkTemplates />} />
        <Route path="/find-work/work/:workId/collaborators" element={<TeamCollaborators />} />
        <Route path="/find-work/analytics" element={<WorkAnalytics />} />

        {/* Gigs Module */}
        <Route path="/gigs" element={<GigsHub />} />
        <Route path="/gigs/category/:categorySlug" element={<GigsByCategory />} />
        <Route path="/gigs/gig/:gigId" element={<GigDetail />} />
        <Route path="/gigs/checkout/:gigId" element={<GigCheckoutPage />} />
        <Route path="/gigs/search" element={<GigSearchResults />} />
        <Route path="/gigs/my-gigs" element={<MyGigs />} />
        <Route path="/gigs/create" element={<CreateEditGig />} />
        <Route path="/gigs/orders" element={<SellerOrders />} />
        <Route path="/gigs/purchases" element={<BuyerPurchases />} />
        <Route path="/seller/:sellerSlug" element={<SellerProfile />} />
        <Route path="/gigs/top-sellers" element={<TopSellers />} />
        <Route path="/gigs/:gigId/reviews" element={<GigReviews />} />

        <Route path="*" element={<div className="h-screen flex items-center justify-center font-bold">404 - Not Found</div>} />
        </Route>

        {/* Phase 11: Dashboards & Maps */}
        <Route path="/dashboard" element={<RoleDashboardRedirect />} />
        <Route path="/client-dashboard" element={<ClientHiringDashboard />} />
        <Route path="/client/dashboard" element={<ClientProtectedRoute><ClientLayout><ClientDashboardPage /></ClientLayout></ClientProtectedRoute>} />
<Route path="/client/profile-intelligence" element={<ClientProtectedRoute><ClientLayout><ClientRecommendationProfilePage /></ClientLayout></ClientProtectedRoute>} />
<Route path="/client/profile" element={<ClientProtectedRoute><ClientLayout><ClientProfileRouter /></ClientLayout></ClientProtectedRoute>} />
<Route path="/client/company-profile" element={<ClientProtectedRoute><ClientLayout><ClientCompanyProfilePage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/verify-otp" element={<ClientVerifyOtpPage />} />
        <Route path="/client/setup-wizard" element={<ClientProtectedRoute><ClientSetupWizard /></ClientProtectedRoute>} />
        <Route path="/client/financial-dashboard" element={<ClientProtectedRoute><ClientLayout><ClientFinancialDashboard /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/wallet" element={<ClientProtectedRoute><ClientLayout><ClientWalletDashboard /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/messages" element={<ClientProtectedRoute><ClientLayout><ClientMessagesPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/offline-map" element={<ClientProtectedRoute><ClientLayout><ClientOfflineMapPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/mpesa-setup" element={<ClientProtectedRoute><ClientLayout><ClientMpesaSetupPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/gps-tracking" element={<ClientProtectedRoute><ClientLayout><ClientGpsTrackingPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/site-checkin" element={<ClientProtectedRoute><ClientLayout><ClientSiteCheckinPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/approval-chains" element={<ClientProtectedRoute><ClientLayout><ClientApprovalChainsPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/security-center" element={<ClientProtectedRoute><ClientLayout><ClientSecurityCenterPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/compliance" element={<ClientProtectedRoute><ClientLayout><ClientCompliancePage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/procurement" element={<ClientProtectedRoute><ClientLayout><ClientProcurementEcosystemPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/workflows" element={<ClientProtectedRoute><ClientLayout><ClientWorkflowBuilderPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/time-tracking" element={<ClientProtectedRoute><ClientLayout><ClientTimeTrackingPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/invoices" element={<ClientProtectedRoute><ClientLayout><ClientInvoicesPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/interviews" element={<ClientProtectedRoute><ClientLayout><ClientInterviewManagementPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/roi-analytics" element={<ClientProtectedRoute><ClientLayout><ClientRoiAnalyticsPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/announcements" element={<ClientProtectedRoute><ClientLayout><ClientAnnouncementsPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/talent-search" element={<ClientProtectedRoute><ClientLayout><ClientTalentSearchPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/contract-builder" element={<ClientProtectedRoute><ClientLayout><ClientContractBuilderPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/permissions" element={<ClientProtectedRoute><ClientLayout><ClientPermissionsPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/support" element={<ClientProtectedRoute><ClientLayout><ClientSupportHelpdeskPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/welcome" element={<ClientWelcomePage />} />
        <Route path="/client/developer" element={<ClientProtectedRoute><ClientLayout><ClientDeveloperPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/agency-management" element={<ClientProtectedRoute><ClientLayout><ClientAgencyManagementPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/erp-systems" element={<ClientProtectedRoute><ClientLayout><ClientErpSystemsPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/task-workspace" element={<ClientProtectedRoute><ClientLayout><ClientTaskWorkspacePage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/collaboration-hub" element={<ClientProtectedRoute><ClientLayout><ClientTeamWorkspacePage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/team" element={<ClientProtectedRoute><ClientLayout><ClientTeamManagementPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client-services/create-job" element={<ClientProtectedRoute><ClientLayout><ClientCreateJob /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client-services/my-jobs" element={<ClientProtectedRoute><ClientLayout><ClientMyJobs /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/proposals" element={<ClientProtectedRoute><ClientLayout><ClientProposalsPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/contracts" element={<ClientProtectedRoute><ClientLayout><ClientContractsPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/reviews" element={<ClientProtectedRoute><ClientLayout><ClientReviewsPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/shortlist" element={<ClientProtectedRoute><ClientLayout><ClientShortlistPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/favorites" element={<ClientProtectedRoute><ClientLayout><ClientShortlistPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/post-job" element={<ClientProtectedRoute><ClientLayout><ClientPostJobPage /></ClientLayout></ClientProtectedRoute>} />

        {/* --- FREELANCER INDEPENDENT ROUTES --- */}
        <Route path="/freelancer-dashboard" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerDashboardPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/dashboard" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerDashboardPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerDashboardPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/portfolio-management" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerPortfolioManagementPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/gigs" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerMyGigsDashboardPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/jobs" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerJobsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/job/:id" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerJobDetailsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/proposals" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerProposalsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/profile" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerProfileRouter /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/profile-intelligence" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerRecommendationProfilePage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/personal-details" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerPersonalDetailsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/contracts" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerContractsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/disputes" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerDisputesPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/orders" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerOrdersPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/calendar" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerCalendarPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/bookings" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerBookingsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/revenue-reports" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerRevenueReportsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/invoices" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerInvoiceManagementPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/clients" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerClientManagementPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/escrow" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerEscrowPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/reviews" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerReviewsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/create-gig" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerGigCreationWizardPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/gigs/create" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerGigCreationWizardPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/gigs/:gigId/edit" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerGigEditPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/gigs/:gigId" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerGigDetailPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/portfolio" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerPortfolioManagementPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/disputes/:id" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerDisputeResponsePage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/proposals/:id" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerProposalDetailsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/jobs/:jobId/propose" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerProposalSubmissionPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/saved-jobs" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerSavedJobsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/skill-tests" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerSkillTestsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/certifications-management" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerCertificationManagementPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/certifications" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerCertificationsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/availability-scheduler" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerAvailabilitySchedulerPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/availability" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerAvailabilityPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/skills" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerSkillsManagementPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/goals-earnings" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerGoalsEarningsTrackerPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/activity-feed" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerActivityFeedPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/tax-invoices" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerTaxInvoicesPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/messages" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerMessagesPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/wallet" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerWalletPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/withdrawal" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerWithdrawalPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/payment-setup" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerPaymentSetupPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/trust-score" element={<FreelancerProtectedRoute><FreelancerLayout><TrustScoreDashboardPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/notification-settings" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerNotificationSettingsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/privacy-security" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerPrivacySecuritySettingsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/api-integrations" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerApiIntegrationsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/appearance-settings" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerAppearanceSettingsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/help-center" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerHelpCenterPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/support-tickets" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerSupportTicketsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/community-forum" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerCommunityForumPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/tutorials" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerTutorialOnboardingPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/otp-verification" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerOtpVerificationPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/nearby-jobs" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerNearbyJobsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/offline-jobs-map" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerOfflineJobsMapPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/remote-jobs" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerRemoteJobsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/hybrid-jobs" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerHybridJobsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/global-search-results" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerGlobalSearchResultsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/global-bookmarks" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerGlobalBookmarksPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/upgrade-plan" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerUpgradePlanPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/verification-center" element={<FreelancerProtectedRoute><FreelancerLayout><IdentityVerificationCenterPage /></FreelancerLayout></FreelancerProtectedRoute>} />

        {/* --- DASHBOARD SIDEBAR ALIASES & DIRECT LINKING --- */}
        <Route path="/freelancer/my-jobs" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerWorkHistoryPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/earnings" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerGoalsEarningsTrackerPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/analytics" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerAnalyticsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/saved" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerSavedJobsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/nearby" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerNearbyJobsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/booking-requests" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerBuyerRequestsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/radius" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerAvailabilityPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/appointments" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerAvailabilitySchedulerPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/notifications" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerNotificationSettingsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/security" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerPrivacySecuritySettingsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/api" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerApiIntegrationsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/appearance" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerAppearanceSettingsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/help" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerHelpCenterPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/tickets" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerSupportTicketsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/community" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerCommunityForumPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/upgrade" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerUpgradePlanPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/referrals" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerReferralPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/referral" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerReferralPage /></FreelancerLayout></FreelancerProtectedRoute>} />

        {/* --- AGENCY / TEAM & FILES WORKSPACE LINKING --- */}
        <Route path="/freelancer/team" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerTeamManagementPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/projects" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerSharedProjectsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/workspace" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerAgencyWorkspacePage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/departments" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerDepartmentsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/permissions" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerTeamPermissionsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/files" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerFileManagerPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/upload" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerUploadCenterPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/assets" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerSharedAssetsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/downloads" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerDownloadsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
      </Routes>
    </Router>
    </AuthBootstrap>
  );
}

export default App;

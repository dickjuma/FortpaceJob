import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './platform/common/authStore.js';
import useChatStore from './platform/store/chatStore';
import LoginPage from './admin/pages/LoginPage';
import AdminRoutes from './admin/AdminRoutes';

import AgencyRoutes from './freelancer/agency/AgencyRoutes';
import SearchRoutes from './platform/search/SearchRoutes';
import VerificationRoutes from './platform/verification/VerificationRoutes';
import EscrowRoutes from './platform/escrow/EscrowRoutes';
import MarketplaceLayout from './platform/layouts/MarketplaceLayout';
import LandingPage from './platform/pages/shared/LandingPage';
import FindTalentLanding from './platform/pages/FindTalentLanding';
import PricingPage from './platform/pages/PricingPage';
import SubscriptionBootstrap from './platform/common/components/SubscriptionBootstrap';
import OnlineFreelancers from './platform/pages/OnlineFreelancers';

import OnsiteProfessionals from './platform/pages/OnsiteProfessionals';
import HybridTalent from './platform/pages/HybridTalent';
import TalentCategories from './platform/pages/TalentCategories';
import CategoryDetailsOnline from './platform/pages/CategoryDetailsOnline';
import CategoryDetailsOnsite from './platform/pages/CategoryDetailsOnsite';
import SearchResults from './platform/pages/GlobalSearchPage';
import SavedSearches from './platform/pages/SavedSearches';
import RecommendedTalent from './platform/pages/RecommendedTalent';
import FreelancerProfile from './freelancer/pages/ProfilePage';
import PortfolioGallery from './freelancer/pages/PortfolioGallery';
import Reviews from './platform/pages/Reviews';
import ServiceCatalog from './platform/pages/ServiceCatalog';
import Availability from './platform/pages/Availability';
import Verification from './platform/pages/Verification';
import HireFreelancer from './client/pages/HireFreelancer';
import InviteFreelancer from './client/pages/InviteFreelancer';
import CreateOffer from './client/pages/CreateOffer';
import ContractPreview from './client/pages/ContractPreview';
import EnterpriseHiring from './client/pages/EnterpriseHiring';
import ManagedTeams from './client/pages/ManagedTeams';
import TalentShortlist from './client/pages/TalentShortlist';
import NearbyProfessionals from './platform/pages/NearbyProfessionals';
import CityTalentDirectory from './platform/pages/CityTalentDirectory';
import EmergencyServices from './platform/pages/EmergencyServices';
import TalentComparison from './platform/pages/TalentComparison';
import SavedCollections from './platform/pages/SavedCollections';
import BookConsultation from './platform/pages/BookConsultation';
import PortfolioShowcase from './freelancer/pages/PortfolioShowcase';
import FreelancerVideoFeeds from './freelancer/pages/FreelancerVideoFeeds';
import MeetingsPage from './platform/pages/MeetingsPage';
import PublicProjectShowcase from './platform/pages/PublicProjectShowcase';
import TopRatedTalents from './platform/pages/TopRatedTalents';
import RisingTalents from './platform/pages/RisingTalents';
import VerifiedTalents from './platform/pages/VerifiedTalents';
import AgencyDirectory from './platform/pages/AgencyDirectory';
import AITalentMatching from './platform/pages/AITalentMatching';
import RecentlyViewedTalent from './platform/pages/RecentlyViewedTalent';
import CommunityRecommendations from './platform/pages/CommunityRecommendations';
import SuccessStories from './platform/pages/SuccessStories';
import InstantBooking from './platform/pages/InstantBooking';
import LiveAvailability from './platform/pages/LiveAvailability';
import SafetyTrustCenter from './platform/pages/SafetyTrustCenter';
import VerificationProcess from './platform/pages/VerificationProcess';
import TalentHiringHelpCenter from './platform/pages/TalentHiringHelpCenter';
import ClientHiringDashboard from './client/pages/ClientHiringDashboard';
import FreelancerDiscoveryMap from './freelancer/pages/FreelancerDiscoveryMap';
import FreelancerLeaderboard from './freelancer/pages/FreelancerLeaderboard';
import ClientPublicProfile from './client/pages/ClientPublicProfileV2';
import ClientBusinessWorkspaces from './client/pages/BusinessWorkspaces';
import OrganizationSettings from './client/pages/OrganizationSettings';
import CategoryTaxonomyAdmin from './admin/pages/CategoryTaxonomyAdmin';
import AdminAuditLogsPage from './admin/pages/AdminAuditLogsPage';
import AdminBillingDashboardPage from './admin/pages/AdminBillingDashboardPage';
import AdminCmsDashboardPage from './admin/pages/AdminCmsDashboardPage';
import AdminFraudDashboardPage from './admin/pages/AdminFraudDashboardPage';
import AdminMarketingDashboardPage from './admin/pages/AdminMarketingDashboardPage';
import AdminRankingEnginePage from './admin/pages/AdminRankingEnginePage';
import AdminReportsDashboardPage from './admin/pages/AdminReportsDashboardPage';
import ClientCalendarPage from './client/pages/ClientCalendarPage';
import ClientComparePage from './client/pages/ClientComparePage';
import TalentDiscoveryPage from './client/pages/TalentDiscoveryPage';
import JobsPage from './client/pages/JobsPage';
import ClientEnterpriseContractsPage from './client/pages/ClientEnterpriseContractsPage';
import ClientProjectFileManagerPage from './client/pages/ClientProjectFileManagerPage';
import ClientJobPostingPage from './client/pages/ClientJobPostingPage';
import JobDetailsPage from './client/pages/JobDetailsPage';
import AgencyProfile from './platform/pages/AgencyProfile';
import SkillAssessment from './platform/pages/SkillAssessment';
import CertificationShowcase from './platform/pages/CertificationShowcase';
import TalentInsights from './platform/pages/TalentInsights';
import IndustryTalent from './platform/pages/IndustryTalent';
import FreelancerOnboardingLanding from './freelancer/pages/FreelancerOnboardingLanding';
import ClientOnboardingLanding from './client/pages/ClientOnboardingLanding';
import FreelancerRegistrationWizard from './freelancer/pages/registration/FreelancerRegistrationWizard';
import FreelancerSuccessScore from './freelancer/pages/FreelancerSuccessScore';
import TrustScoreExplanation from './platform/pages/TrustScoreExplanation';
import FreelancerDiscoveryAi from './freelancer/pages/FreelancerDiscoveryAi';
import MobileFindTalent from './platform/pages/MobileFindTalent';
import HiringPipeline from './platform/pages/HiringPipeline';
import TalentRoutes from './client/pages/hire-talent';

// Find Work Module (Freelancer Side)
import FindWorkHub from './freelancer/pages/find-work/FindWorkHub';
import OnlineWorkListings from './freelancer/pages/find-work/OnlineWorkListings';
import LocalWorkListings from './freelancer/pages/find-work/LocalWorkListings';
import WorkDetail from './freelancer/pages/find-work/WorkDetail';
import FindWorkSearchResults from './freelancer/pages/find-work/SearchResults';
import CategoryBrowse from './freelancer/pages/find-work/CategoryBrowse';
import SavedWork from './freelancer/pages/find-work/SavedWork';
import ClientPostedWork from './freelancer/pages/find-work/ClientPostedWork';
import ProviderApplications from './freelancer/pages/find-work/ProviderApplications';

// New Find Work Modules (The 17 Pages Expansion)
import WorkProposal from './freelancer/pages/find-work/WorkProposal';
import ViewApplications from './freelancer/pages/find-work/ViewApplications';
import WorkAgreement from './freelancer/pages/find-work/WorkAgreement';
import WorkProgress from './freelancer/pages/find-work/WorkProgress';
import WorkCompletion from './freelancer/pages/find-work/WorkCompletion';
import RatingReview from './freelancer/pages/find-work/RatingReview';
import WorkRevision from './freelancer/pages/find-work/WorkRevision';
import DisputeResolution from './freelancer/pages/find-work/DisputeResolution';
import WorkCancellation from './freelancer/pages/find-work/WorkCancellation';
import CounterOffer from './freelancer/pages/find-work/CounterOffer';
import ShortlistedApplicants from './freelancer/pages/find-work/ShortlistedApplicants';
import WorkHistory from './freelancer/pages/find-work/WorkHistory';
import ProviderManagement from './freelancer/pages/find-work/ProviderManagement';
import WithdrawApplication from './freelancer/pages/find-work/WithdrawApplication';
import WorkTemplates from './freelancer/pages/find-work/WorkTemplates';
import TeamCollaborators from './freelancer/pages/find-work/TeamCollaborators';
import WorkAnalytics from './freelancer/pages/find-work/WorkAnalytics';

// Gigs Module (Freelancer pre-packaged services)
import GigsHub from './client/pages/gigs/GigsHub';
import GigsByCategory from './client/pages/gigs/GigsByCategory';
import GigDetail from './client/pages/gigs/GigDetail';
import GigCheckoutPage from './client/pages/gigs/GigCheckoutPage';
import GigSearchResults from './client/pages/gigs/GigSearchResults';
import MyGigs from './client/pages/gigs/MyGigs';
import CreateEditGig from './client/pages/gigs/CreateEditGig';
import SellerOrders from './client/pages/gigs/SellerOrders';
import BuyerPurchases from './client/pages/gigs/BuyerPurchases';
import SellerProfile from './client/pages/gigs/SellerProfile';
import GigReviews from './client/pages/gigs/GigReviews';
import TopSellers from './client/pages/gigs/TopSellers';

import ProfilePage from './freelancer/pages/ProfilePage';
import GlobalHomepage from './platform/pages/GlobalHomepage';
import GlobalJobsPage from './platform/pages/GlobalJobsPage';
import StaticInfoPage from './platform/pages/StaticInfoPage';
import AboutPage from './platform/pages/AboutPage';
import ContactPage from './platform/pages/ContactPage';
import PublicGigPage from './platform/pages/PublicGigPage';
import HelpCenterPage from './platform/pages/HelpCenterPage';
import MessagingCenterPage from './platform/common/pages/MessagingCenterPage';
import NotificationsCenterPage from './platform/common/pages/NotificationsCenterPage';
import DisputeResolutionCenterPage from './platform/common/pages/DisputeResolutionCenterPage';
import IdentityVerificationCenterPage from './platform/common/pages/IdentityVerificationCenterPage';
import AccountSecurityCenterPage from './platform/common/pages/AccountSecurityCenterPage';
import TrustScoreDashboardPage from './platform/common/pages/TrustScoreDashboardPage';
import FeaturedServicesMarketplacePage from './platform/pages/FeaturedServicesMarketplacePage';
import PromotionsCouponsCenterPage from './platform/common/pages/PromotionsCouponsCenterPage';
import AffiliateReferralDashboardPage from './platform/common/pages/AffiliateReferralDashboardPage';
import CommunityForumPage from './platform/pages/CommunityForumPage';
import SuccessStoriesPage from './platform/pages/SuccessStoriesPage';
import ClientLayout from './client/ClientLayout';
import FreelancerLayout from './freelancer/FreelancerLayout';

import AuthLoginPage from './platform/auth/pages/Login';
import RegisterPage from './platform/pages/RegisterPage';
import VerifyEmailPage from './platform/auth/pages/VerifyEmailPage';
import VerifyLoginOTPPage from './platform/auth/pages/VerifyLoginOTPPage';
import ForgotPasswordPage from './platform/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from './platform/auth/pages/ResetPasswordPage';
import OTPVerificationPage from './platform/auth/pages/OTPVerificationPage';
import SessionExpiredPage from './platform/auth/pages/SessionExpiredPage';
import Verify2FAPage from './platform/auth/pages/Verify2FAPage';
import AccountRecoveryPage from './platform/auth/pages/AccountRecoveryPage';
import AdminLoginPage from './platform/auth/pages/AdminLoginPage';
import AdminSecurityVerificationPage from './platform/auth/pages/AdminSecurityVerificationPage';
import OAuthCallbackPage from './platform/auth/pages/OAuthCallbackPage';
import RoleSelectionPage from './platform/auth/pages/RoleSelectionPage';
import ExperienceLevelPage from './platform/auth/pages/ExperienceLevelPage';
import SkillSelectionPage from './platform/auth/pages/SkillSelectionPage';
import AvailabilitySetupPage from './platform/auth/pages/AvailabilitySetupPage';
import RateSetupPage from './platform/auth/pages/RateSetupPage';
import ProfileCompletionPage from './platform/auth/pages/ProfileCompletionPage';

// Security Dashboard Pages
import SecurityDashboard from './platform/auth/pages/SecurityDashboard';
import ActiveSessionsPage from './platform/auth/pages/ActiveSessionsPage';
import ConnectedAccountsPage from './platform/auth/pages/ConnectedAccountsPage';
import SuspiciousActivityReviewPage from './platform/auth/pages/SuspiciousActivityReviewPage';
import AccessDeniedPage from "./platform/auth/pages/AccessDeniedPage";
import { getDashboardPathForRole } from './platform/auth/utils/authRouting';

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
import ClientReviewsDirectory from './client/pages/ClientReviewsDirectory';
import ClientVideoInterviewRoomPage from './client/pages/ClientVideoInterviewRoomPage';
import ClientMarketplaceFeedPage from './client/pages/ClientMarketplaceFeedPage';
import ClientProcurementDashboardPage from './client/pages/ClientProcurementDashboardPage';
import ClientProposalPipelinePage from './client/pages/ClientProposalPipelinePage';
import SavedTalentPipelinePage from './client/pages/SavedTalentPipelinePage';
import ClientReferralProgramPage from './client/pages/ClientReferralProgramPage';
import ClientReviewApprovalPage from './client/pages/ClientReviewApprovalPage';
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
import DeliverablesPage from './freelancer/pages/DeliverablesPage';
import FreelancerConnectedAccountsPage from './freelancer/pages/ConnectedAccountsPage';
import ApiKeysPage from './freelancer/pages/ApiKeysPage';
import PreferencesPage from './freelancer/pages/PreferencesPage';
import GigAnalyticsPage from './freelancer/pages/GigAnalyticsPage';
import AgencyDashboardPage from './freelancer/agency/pages/AgencyDashboardPage';
import RolesPermissionsPage from './freelancer/agency/pages/RolesPermissionsPage';
import AgencyPortfolioPage from './freelancer/agency/pages/AgencyPortfolioPage';
import TalentPoolPage from './freelancer/agency/pages/TalentPoolPage';
import RecruitmentPage from './freelancer/agency/pages/RecruitmentPage';
import EnterpriseContractsPage from './freelancer/agency/pages/EnterpriseContractsPage';
import TeamAnalyticsPage from './freelancer/agency/pages/TeamAnalyticsPage';
import BillingPage from './freelancer/agency/pages/OrganizationBillingPage';

// Agency / Team workspace page imports
import FreelancerTeamManagementPage from './freelancer/agency/pages/TeamManagementPage';
import FreelancerSharedProjectsPage from './freelancer/agency/pages/SharedProjectsPage';
import FreelancerAgencyWorkspacePage from './freelancer/agency/pages/AgencyWorkspacePage';
import FreelancerDepartmentsPage from './freelancer/agency/pages/DepartmentsPage';
import FreelancerTeamPermissionsPage from './freelancer/agency/pages/TeamPermissionsPage';
import FreelancerFileManagerPage from './freelancer/agency/pages/FileManagerPage';
import FreelancerUploadCenterPage from './freelancer/agency/pages/UploadCenterPage';
import FreelancerSharedAssetsPage from './freelancer/agency/pages/SharedAssetsPage';
import FreelancerDownloadsPage from './freelancer/agency/pages/DownloadsPage';

// Autogenerated Freelancer Imports
import AvailabilitySchedulingPage from './freelancer/pages/AvailabilitySchedulingPage';
import CreateGigPage from './freelancer/pages/CreateGigPage';
import FeaturedGigShowcasePage from './freelancer/pages/FeaturedGigShowcasePage';
import FreelancerBoostProfilePage from './freelancer/pages/FreelancerBoostProfilePage';
import FreelancerDeliveryPage from './freelancer/pages/FreelancerDeliveryPage';
import FreelancerDisputeHistoryPage from './freelancer/pages/FreelancerDisputeHistoryPage';
import FreelancerLearningPage from './freelancer/pages/FreelancerLearningPage';
import FreelancerPerformanceInsightsPage from './freelancer/pages/FreelancerPerformanceInsightsPage';
import FreelancerPortfolioPage from './freelancer/pages/FreelancerPortfolioPage';
import FreelancerSubscriptionsPage from './freelancer/pages/FreelancerSubscriptionsPage';
import FreelancerSuccessScorePage from './freelancer/pages/FreelancerSuccessScorePage';
import FreelancerWalletDashboard from './freelancer/pages/FreelancerWalletDashboard';
import GigAnalyticsDashboard from './freelancer/pages/GigAnalyticsDashboard';
import GigCategoryPage from './freelancer/pages/GigCategoryPage';
import GigDeliveryPage from './freelancer/pages/GigDeliveryPage';
import GigDescriptionFaqPage from './freelancer/pages/GigDescriptionFaqPage';
import GigDuplicatePage from './freelancer/pages/GigDuplicatePage';
import GigGalleryUploadPage from './freelancer/pages/GigGalleryUploadPage';
import GigOrderTrackingPage from './freelancer/pages/GigOrderTrackingPage';
import GigPerformanceInsightsPage from './freelancer/pages/GigPerformanceInsightsPage';
import GigPreviewPage from './freelancer/pages/GigPreviewPage';
import GigPricingPage from './freelancer/pages/GigPricingPage';
import GigPublishSuccessPage from './freelancer/pages/GigPublishSuccessPage';
import GigRequirementsPage from './freelancer/pages/GigRequirementsPage';
import GigRequirementsSubmissionPage from './freelancer/pages/GigRequirementsSubmissionPage';
import GigSearchPage from './freelancer/pages/GigSearchPage';
import GigsPage from './freelancer/pages/GigsPage';
import GigTitleSeoPage from './freelancer/pages/GigTitleSeoPage';
import GigVideoUploadPage from './freelancer/pages/GigVideoUploadPage';
import JobInvitationsPage from './freelancer/pages/JobInvitationsPage';
import MilestonesPage from './freelancer/pages/MilestonesPage';
import NotificationsPage from './freelancer/pages/NotificationsPage';
import ProposalAnalyticsPage from './freelancer/pages/ProposalAnalyticsPage';
import RankingDashboard from './freelancer/pages/RankingDashboard';
import SkillsCertificationsPage from './freelancer/pages/SkillsCertificationsPage';
import TrendingGigsPage from './freelancer/pages/TrendingGigsPage';
import WithdrawalsPage from './freelancer/pages/WithdrawalsPage';

const RoleProtectedRoute = ({ role, children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || String(user?.role || '').toUpperCase() !== role) {
    return <Navigate to="/auth/login" replace />;
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
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated || user?.emailVerified === false) {
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
    // Initialize chat socket after auth is hydrated
    useChatStore.getState().initSocket();
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
          <Route path="/freelancer/:username" element={<ProfilePage />} />
        <Route path="/agency/*" element={<AgencyRoutes />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/careers" element={<StaticInfoPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/terms" element={<StaticInfoPage />} />
        <Route path="/privacy" element={<StaticInfoPage />} />
        <Route path="/accessibility" element={<StaticInfoPage />} />
        <Route path="/clients/:clientId" element={<ClientPublicProfile />} />
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
        <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
        <Route path="/auth/verify-login" element={<VerifyLoginOTPPage />} />
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
        <Route path="/admin/category-taxonomy" element={<CategoryTaxonomyAdmin />} />
        <Route path="/admin/audit-logs" element={<AdminAuditLogsPage />} />
        <Route path="/admin/billing" element={<AdminBillingDashboardPage />} />
        <Route path="/admin/cms" element={<AdminCmsDashboardPage />} />
        <Route path="/admin/fraud" element={<AdminFraudDashboardPage />} />
        <Route path="/admin/marketing" element={<AdminMarketingDashboardPage />} />
        <Route path="/admin/ranking" element={<AdminRankingEnginePage />} />
        <Route path="/admin/reports" element={<AdminReportsDashboardPage />} />
        <Route path="/agency/:id" element={<AgencyProfile />} />
        <Route path="/assessments" element={<SkillAssessment />} />
        <Route path="/certifications" element={<CertificationShowcase />} />
        <Route path="/insights" element={<TalentInsights />} />
        <Route path="/industries" element={<IndustryTalent />} />
        <Route path="/join-freelancer" element={<FreelancerOnboardingLanding />} />
        <Route path="/join-client" element={<ClientOnboardingLanding />} />
        <Route path="/freelancer-registration" element={<FreelancerRegistrationWizard />} />
        <Route path="/success-score" element={<FreelancerSuccessScore />} />
        <Route path="/trust-score" element={<TrustScoreExplanation />} />
        <Route path="/reviews-directory" element={<ClientReviewsDirectory />} />
        <Route path="/ai-discovery" element={<FreelancerDiscoveryAi />} />
        <Route path="/mobile-app" element={<MobileFindTalent />} />
        <Route path="/pipeline" element={<HiringPipeline />} />

        {/* Find Work Module (Freelancer Portal) */}
        <Route path="/find-work" element={<Navigate to="/find-work/search?type=all" replace />} />
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
        <Route path="/client/workspaces" element={<ClientProtectedRoute><ClientLayout><ClientBusinessWorkspaces /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/organization-settings" element={<ClientProtectedRoute><ClientLayout><OrganizationSettings /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/calendar" element={<ClientProtectedRoute><ClientLayout><ClientCalendarPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/messages" element={<ClientProtectedRoute><ClientLayout><ClientMessagesPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/compare" element={<ClientProtectedRoute><ClientLayout><ClientComparePage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/search-talent" element={<ClientProtectedRoute><ClientLayout><ClientTalentSearchPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/discover/talent" element={<ClientProtectedRoute><ClientLayout><TalentDiscoveryPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/jobs" element={<ClientProtectedRoute><ClientLayout><JobsPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/jobs/post" element={<ClientProtectedRoute><ClientLayout><ClientJobPostingPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/jobs/:id" element={<ClientProtectedRoute><ClientLayout><JobDetailsPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/gigs" element={<ClientProtectedRoute><ClientLayout><GigsPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/enterprise-contracts" element={<ClientProtectedRoute><ClientLayout><ClientEnterpriseContractsPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/files" element={<ClientProtectedRoute><ClientLayout><ClientProjectFileManagerPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/interviews" element={<ClientProtectedRoute><ClientLayout><ClientInterviewManagementPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/interviews/room/:id" element={<ClientProtectedRoute><ClientLayout><ClientVideoInterviewRoomPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/wallet" element={<ClientProtectedRoute><ClientLayout><ClientWalletDashboard /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/financial" element={<ClientProtectedRoute><ClientLayout><ClientFinancialDashboard /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/feed" element={<ClientProtectedRoute><ClientLayout><ClientMarketplaceFeedPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/offline/checkin" element={<ClientProtectedRoute><ClientLayout><ClientSiteCheckinPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/offline/gps" element={<ClientProtectedRoute><ClientLayout><ClientGpsTrackingPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/offline/map" element={<ClientProtectedRoute><ClientLayout><ClientOfflineMapPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/procurement" element={<ClientProtectedRoute><ClientLayout><ClientProcurementDashboardPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/proposals-pipeline" element={<ClientProtectedRoute><ClientLayout><ClientProposalPipelinePage /></ClientLayout></ClientProtectedRoute>} />
<Route path="/client/proposals" element={<ClientProtectedRoute><ClientLayout><ClientProposalsPage /></ClientLayout></ClientProtectedRoute>} />
         <Route path="/client/contracts" element={<ClientProtectedRoute><ClientLayout><ClientContractsPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/contracts/build" element={<ClientProtectedRoute><ClientLayout><ClientContractBuilderPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/talent-pipeline" element={<ClientProtectedRoute><ClientLayout><SavedTalentPipelinePage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/referrals" element={<ClientProtectedRoute><ClientLayout><ClientReferralProgramPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/reviews" element={<ClientProtectedRoute><ClientLayout><ClientReviewsPage /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/reviews/directory" element={<ClientProtectedRoute><ClientLayout><ClientReviewsDirectory /></ClientLayout></ClientProtectedRoute>} />
        <Route path="/client/reviews/approval" element={<ClientProtectedRoute><ClientLayout><ClientReviewApprovalPage /></ClientLayout></ClientProtectedRoute>} />
<Route path="/client/profile-intelligence" element={<ClientProtectedRoute><ClientLayout><ClientRecommendationProfilePage /></ClientLayout></ClientProtectedRoute>} />
<Route path="/client/profile" element={<ClientProtectedRoute><ClientLayout><ClientProfileRouter /></ClientLayout></ClientProtectedRoute>} />
<Route path="/client/verify-otp" element={<ClientVerifyOtpPage />} />;
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
        
        {/* NEW SIDEBAR ROUTES */}
        <Route path="/freelancer/deliverables" element={<FreelancerProtectedRoute><FreelancerLayout><DeliverablesPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/connected-accounts" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerConnectedAccountsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/api-keys" element={<FreelancerProtectedRoute><FreelancerLayout><ApiKeysPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/preferences" element={<FreelancerProtectedRoute><FreelancerLayout><PreferencesPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/gig-analytics" element={<FreelancerProtectedRoute><FreelancerLayout><GigAnalyticsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/agency-dashboard" element={<FreelancerProtectedRoute><FreelancerLayout><AgencyDashboardPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/roles" element={<FreelancerProtectedRoute><FreelancerLayout><RolesPermissionsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/agency-portfolio" element={<FreelancerProtectedRoute><FreelancerLayout><AgencyPortfolioPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/talent-pool" element={<FreelancerProtectedRoute><FreelancerLayout><TalentPoolPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/recruitment" element={<FreelancerProtectedRoute><FreelancerLayout><RecruitmentPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/enterprise-contracts" element={<FreelancerProtectedRoute><FreelancerLayout><EnterpriseContractsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/team-analytics" element={<FreelancerProtectedRoute><FreelancerLayout><TeamAnalyticsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/billing" element={<FreelancerProtectedRoute><FreelancerLayout><BillingPage /></FreelancerLayout></FreelancerProtectedRoute>} />
              {/* Autogenerated Freelancer Routes */}
        <Route path="/freelancer/availability-scheduling" element={<FreelancerProtectedRoute><FreelancerLayout><AvailabilitySchedulingPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/create-gig" element={<FreelancerProtectedRoute><FreelancerLayout><CreateGigPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/featured-gig-showcase" element={<FreelancerProtectedRoute><FreelancerLayout><FeaturedGigShowcasePage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/boost-profile" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerBoostProfilePage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/delivery" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerDeliveryPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/dispute-history" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerDisputeHistoryPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/learning" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerLearningPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/performance-insights" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerPerformanceInsightsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/portfolio" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerPortfolioPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/subscriptions" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerSubscriptionsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/success-score" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerSuccessScorePage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/wallet-dashboard" element={<FreelancerProtectedRoute><FreelancerLayout><FreelancerWalletDashboard /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/gigs/analytics-dashboard" element={<FreelancerProtectedRoute><FreelancerLayout><GigAnalyticsDashboard /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/gigs/category" element={<FreelancerProtectedRoute><FreelancerLayout><GigCategoryPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/gigs/delivery" element={<FreelancerProtectedRoute><FreelancerLayout><GigDeliveryPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/gigs/description-faq" element={<FreelancerProtectedRoute><FreelancerLayout><GigDescriptionFaqPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/gigs/duplicate" element={<FreelancerProtectedRoute><FreelancerLayout><GigDuplicatePage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/gigs/gallery-upload" element={<FreelancerProtectedRoute><FreelancerLayout><GigGalleryUploadPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/gigs/order-tracking" element={<FreelancerProtectedRoute><FreelancerLayout><GigOrderTrackingPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/gigs/performance-insights" element={<FreelancerProtectedRoute><FreelancerLayout><GigPerformanceInsightsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/gigs/preview" element={<FreelancerProtectedRoute><FreelancerLayout><GigPreviewPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/gigs/pricing" element={<FreelancerProtectedRoute><FreelancerLayout><GigPricingPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/gigs/publish-success" element={<FreelancerProtectedRoute><FreelancerLayout><GigPublishSuccessPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/gigs/requirements" element={<FreelancerProtectedRoute><FreelancerLayout><GigRequirementsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/gigs/requirements-submission" element={<FreelancerProtectedRoute><FreelancerLayout><GigRequirementsSubmissionPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/gigs/search" element={<FreelancerProtectedRoute><FreelancerLayout><GigSearchPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/gigs" element={<FreelancerProtectedRoute><FreelancerLayout><GigsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/gigs/title-seo" element={<FreelancerProtectedRoute><FreelancerLayout><GigTitleSeoPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/gigs/video-upload" element={<FreelancerProtectedRoute><FreelancerLayout><GigVideoUploadPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/job-invitations" element={<FreelancerProtectedRoute><FreelancerLayout><JobInvitationsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/milestones" element={<FreelancerProtectedRoute><FreelancerLayout><MilestonesPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/notifications" element={<FreelancerProtectedRoute><FreelancerLayout><NotificationsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/proposal-analytics" element={<FreelancerProtectedRoute><FreelancerLayout><ProposalAnalyticsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/ranking-dashboard" element={<FreelancerProtectedRoute><FreelancerLayout><RankingDashboard /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/skills-certifications" element={<FreelancerProtectedRoute><FreelancerLayout><SkillsCertificationsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/trending-gigs" element={<FreelancerProtectedRoute><FreelancerLayout><TrendingGigsPage /></FreelancerLayout></FreelancerProtectedRoute>} />
        <Route path="/freelancer/withdrawals" element={<FreelancerProtectedRoute><FreelancerLayout><WithdrawalsPage /></FreelancerLayout></FreelancerProtectedRoute>} />

      </Routes>
    </Router>
    </AuthBootstrap>
  );
}

export default App;

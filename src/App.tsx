import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "@/components/ThemeProvider";
import ScrollToTop from "@/components/ScrollToTop";
import RouteProgress from "@/components/RouteProgress";
import CursorFollower from "@/components/CursorFollower";
import PageLoadingSkeleton from "@/components/PageLoadingSkeleton";
import ErrorBoundary from "@/components/ErrorBoundary";
import SkipLinks from "@/components/SkipLinks";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ProtectedNFTRoute } from "@/components/ProtectedNFTRoute";
import { ComplianceGuard } from "@/components/ComplianceGuard";
import PreLaunchGate from "@/components/PreLaunchGate";
import RegionDevTools from "@/components/RegionDevTools";
import { useRegionGate } from "@/hooks/useRegionGate";

import { ShopProvider } from "@/context/ShopContext";
import { CursorProvider } from "@/context/CursorContext";
import { WalletProvider } from "@/providers/WalletProvider";
import { WalletContextProvider } from "@/context/WalletContext";
import { TenantProvider } from "@/context/TenantContext";


// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Eligibility = lazy(() => import("./pages/Eligibility"));
const Support = lazy(() => import("./pages/Support"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Conditions = lazy(() => import("./pages/Conditions"));
const Traceability = lazy(() => import("./pages/Traceability"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const NotFound = lazy(() => import("./pages/NotFound"));
const NotEligible = lazy(() => import("./pages/NotEligible"));
const Auth = lazy(() => import("./pages/Auth"));
const Shop = lazy(() => import("./pages/Shop"));
const ShopRegister = lazy(() => import("./pages/ShopRegister"));
const CultivarDetail = lazy(() => import("./pages/CultivarDetail"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Orders = lazy(() => import("./pages/Orders"));
const DashboardStatus = lazy(() => import("./pages/DashboardStatus"));
const PatientDashboard = lazy(() => import("./pages/PatientDashboard"));
const ChangePassword = lazy(() => import("./pages/ChangePassword"));
const AccountSettings = lazy(() => import("./pages/AccountSettings"));
const AdminPrescriptions = lazy(() => import("./pages/AdminPrescriptions"));
const AdminStrains = lazy(() => import("./pages/AdminStrains"));
const AdminStrainSync = lazy(() => import("./pages/AdminStrainSync"));
const AdminStrainKnowledge = lazy(() => import("./pages/AdminStrainKnowledge"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminCustomers = lazy(() => import("./pages/AdminCustomers"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));
const AdminOrderAnalytics = lazy(() => import("./pages/AdminOrderAnalytics"));
const Debug = lazy(() => import("./pages/Debug"));
const FlowTester = lazy(() => import("./pages/FlowTester"));
const CountrySelector = lazy(() => import("./pages/CountrySelector"));

const queryClient = new QueryClient();

// Wrapper component that handles region-based routing
const RegionGatedApp = () => {
  const { isGlobal, isPreLaunch } = useRegionGate();

  // Pre-launch regions (UK/PT): Show ONLY the stealth gate - no site access
  if (isPreLaunch) {
    return (
      <>
        <PreLaunchGate />
        <RegionDevTools />
      </>
    );
  }

  // Global AND Operational regions: Full site access (homepage differs)
  return (
    <>
      <AnimatedRoutes isGlobal={isGlobal} />
      <RegionDevTools />
    </>
  );
};

const AnimatedRoutes = ({ isGlobal = false }: { isGlobal?: boolean }) => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Suspense fallback={<PageLoadingSkeleton variant="hero" />}>
        <Routes location={location} key={location.pathname}>
          {/* Core Pages - Home is conditional based on domain */}
          <Route path="/" element={isGlobal ? <CountrySelector /> : <Index />} />
          <Route path="/eligibility" element={<Eligibility />} />
          <Route path="/support" element={<Support />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/conditions" element={<Conditions />} />
          <Route path="/traceability" element={<Traceability />} />
          <Route path="/not-eligible" element={<NotEligible />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Patient Portal */}
          <Route path="/dashboard" element={<PatientDashboard />} />
          <Route path="/dashboard/status" element={<DashboardStatus />} />
          <Route path="/account/change-password" element={<ChangePassword />} />
          <Route path="/account/settings" element={<AccountSettings />} />
          <Route path="/orders" element={
            <ComplianceGuard>
              <Orders />
            </ComplianceGuard>
          } />
          
          {/* Shop - Uses RestrictedRegionGate for per-country access control */}
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/register" element={<ShopRegister />} />
          <Route path="/shop/cultivar/:cultivarId" element={
            <ComplianceGuard>
              <CultivarDetail />
            </ComplianceGuard>
          } />
          <Route path="/checkout" element={
            <ComplianceGuard>
              <Checkout />
            </ComplianceGuard>
          } />
          
          {/* Protected Admin Routes - Dual Auth: Supabase Role + NFT Ownership */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <ProtectedNFTRoute accessDeniedMessage="Admin access requires a Dr. Green Digital Key NFT on Ethereum Mainnet.">
                <AdminDashboard />
              </ProtectedNFTRoute>
            </ProtectedRoute>
          } />
          <Route path="/admin/prescriptions" element={
            <ProtectedRoute requiredRole="admin">
              <ProtectedNFTRoute accessDeniedMessage="Admin access requires a Dr. Green Digital Key NFT.">
                <AdminPrescriptions />
              </ProtectedNFTRoute>
            </ProtectedRoute>
          } />
          <Route path="/admin/strains" element={
            <ProtectedRoute requiredRole="admin">
              <ProtectedNFTRoute accessDeniedMessage="Admin access requires a Dr. Green Digital Key NFT.">
                <AdminStrains />
              </ProtectedNFTRoute>
            </ProtectedRoute>
          } />
          <Route path="/admin/strain-sync" element={
            <ProtectedRoute requiredRole="admin">
              <ProtectedNFTRoute accessDeniedMessage="Admin access requires a Dr. Green Digital Key NFT.">
                <AdminStrainSync />
              </ProtectedNFTRoute>
            </ProtectedRoute>
          } />
          <Route path="/admin/strain-knowledge" element={
            <ProtectedRoute requiredRole="admin">
              <ProtectedNFTRoute accessDeniedMessage="Admin access requires a Dr. Green Digital Key NFT.">
                <AdminStrainKnowledge />
              </ProtectedNFTRoute>
            </ProtectedRoute>
          } />
          <Route path="/admin/customers" element={
            <ProtectedRoute requiredRole="admin">
              <ProtectedNFTRoute accessDeniedMessage="Admin access requires a Dr. Green Digital Key NFT.">
                <AdminCustomers />
              </ProtectedNFTRoute>
            </ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute requiredRole="admin">
              <ProtectedNFTRoute accessDeniedMessage="Admin access requires a Dr. Green Digital Key NFT.">
                <AdminOrders />
              </ProtectedNFTRoute>
            </ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute requiredRole="admin">
              <ProtectedNFTRoute accessDeniedMessage="Admin access requires a Dr. Green Digital Key NFT.">
                <AdminOrderAnalytics />
              </ProtectedNFTRoute>
            </ProtectedRoute>
          } />
          
          {/* Debug/Diagnosis */}
          <Route path="/debug" element={<Debug />} />
          <Route path="/test-flow" element={<FlowTester />} />
          
          {/* Legal */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <ThemeProvider defaultTheme="light" storageKey="healing-buds-theme">
          <CursorProvider>
            <TooltipProvider>
              <WalletContextProvider>
                <ShopProvider>
                  <CursorFollower>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter>
                      <TenantProvider>
                        <SkipLinks />
                        <ScrollToTop />
                        <RouteProgress />
                        <main id="main-content" tabIndex={-1}>
                          <RegionGatedApp />
                        </main>
                      </TenantProvider>
                    </BrowserRouter>
                  </CursorFollower>
                </ShopProvider>
              </WalletContextProvider>
            </TooltipProvider>
          </CursorProvider>
        </ThemeProvider>
      </WalletProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;

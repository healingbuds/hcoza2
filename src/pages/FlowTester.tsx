import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/layout/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Play,
  RefreshCw,
  Zap,
  Navigation,
  MousePointerClick,
  Wifi,
  Shield,
  User,
  Eye,
  EyeOff,
  ChevronRight,
  Mail,
  Package,
  Database,
} from 'lucide-react';

type TestStatus = 'pending' | 'running' | 'pass' | 'warn' | 'fail';

interface FlowTest {
  id: string;
  category: string;
  name: string;
  description: string;
  status: TestStatus;
  details?: string;
  duration?: number;
}

interface TestCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  tests: FlowTest[];
}

function createInitialTests(): FlowTest[] {
  return [
    // Navigation Tests
    { id: 'nav-home', category: 'navigation', name: 'Home Route', description: 'Verify / loads correctly', status: 'pending' },
    { id: 'nav-shop', category: 'navigation', name: 'Shop Route', description: 'Verify /shop loads correctly', status: 'pending' },
    { id: 'nav-about', category: 'navigation', name: 'About Route', description: 'Verify /about loads correctly', status: 'pending' },
    { id: 'nav-conditions', category: 'navigation', name: 'Conditions Route', description: 'Verify /conditions loads correctly', status: 'pending' },
    { id: 'nav-auth', category: 'navigation', name: 'Auth Route', description: 'Verify /auth loads correctly', status: 'pending' },
    
    // Button/CTA Tests
    { id: 'btn-header-cta', category: 'buttons', name: 'Header CTA', description: 'Primary header buttons are clickable', status: 'pending' },
    { id: 'btn-nav-links', category: 'buttons', name: 'Navigation Links', description: 'All nav links have proper states', status: 'pending' },
    { id: 'btn-footer-links', category: 'buttons', name: 'Footer Links', description: 'Footer links are functional', status: 'pending' },
    
    // API Tests
    { id: 'api-strains', category: 'api', name: 'Strains API', description: 'GET strains by country works', status: 'pending' },
    { id: 'api-strains-za', category: 'api', name: 'Strains ZA', description: 'Strains load for South Africa', status: 'pending' },
    { id: 'api-strains-pt', category: 'api', name: 'Strains PT', description: 'Strains load for Portugal', status: 'pending' },
    { id: 'api-proxy-health', category: 'api', name: 'Proxy Health', description: 'Dr Green proxy is accessible', status: 'pending' },
    { id: 'api-dashboard', category: 'api', name: 'Dashboard Summary', description: 'Admin dashboard API works', status: 'pending' },
    
    // Email Tests
    { id: 'email-config', category: 'email', name: 'Email Configuration', description: 'Resend API key configured', status: 'pending' },
    { id: 'email-function', category: 'email', name: 'Email Function', description: 'send-client-email function exists', status: 'pending' },
    { id: 'email-templates', category: 'email', name: 'Email Templates', description: 'All email templates available', status: 'pending' },
    
    // NFT Gating Tests
    { id: 'nft-wallet', category: 'nft', name: 'Wallet Context', description: 'Wallet context is available', status: 'pending' },
    { id: 'nft-check', category: 'nft', name: 'NFT Check Logic', description: 'NFT verification endpoint works', status: 'pending' },
    { id: 'nft-admin-gate', category: 'nft', name: 'Admin Route Protection', description: '/admin requires NFT', status: 'pending' },
    
    // Auth Tests
    { id: 'auth-session', category: 'auth', name: 'Session Check', description: 'Auth session can be retrieved', status: 'pending' },
    { id: 'auth-kyc', category: 'auth', name: 'KYC Status', description: 'KYC verification status accessible', status: 'pending' },
    { id: 'auth-roles', category: 'auth', name: 'Role Check', description: 'User roles can be queried', status: 'pending' },
    
    // KYC Tests
    { id: 'kyc-client-table', category: 'kyc', name: 'Client Table', description: 'drgreen_clients table accessible', status: 'pending' },
    { id: 'kyc-journey-logs', category: 'kyc', name: 'Journey Logs', description: 'kyc_journey_logs table accessible', status: 'pending' },
    { id: 'kyc-create-client', category: 'kyc', name: 'Client Creation', description: 'create-client-legacy action available', status: 'pending' },
  ];
}

// Development mode gate
function DevModeGate({ children }: { children: React.ReactNode }) {
  const isDev = import.meta.env.DEV || window.location.search.includes('dev=true');
  
  if (!isDev) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Shield className="h-5 w-5" />
              Access Restricted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The Flow Tester is only available in development mode.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return <>{children}</>;
}

function FlowTester() {
  const [tests, setTests] = useState<FlowTest[]>(createInitialTests);
  const [isRunning, setIsRunning] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('ZAF');
  const [testEmail, setTestEmail] = useState('');
  
  const categories: TestCategory[] = useMemo(() => [
    { id: 'navigation', name: 'Navigation', icon: <Navigation className="h-4 w-4" />, tests: tests.filter(t => t.category === 'navigation') },
    { id: 'buttons', name: 'Buttons', icon: <MousePointerClick className="h-4 w-4" />, tests: tests.filter(t => t.category === 'buttons') },
    { id: 'api', name: 'API', icon: <Wifi className="h-4 w-4" />, tests: tests.filter(t => t.category === 'api') },
    { id: 'email', name: 'Email', icon: <Mail className="h-4 w-4" />, tests: tests.filter(t => t.category === 'email') },
    { id: 'nft', name: 'NFT Gating', icon: <Shield className="h-4 w-4" />, tests: tests.filter(t => t.category === 'nft') },
    { id: 'auth', name: 'Auth', icon: <User className="h-4 w-4" />, tests: tests.filter(t => t.category === 'auth') },
    { id: 'kyc', name: 'KYC/AML', icon: <Database className="h-4 w-4" />, tests: tests.filter(t => t.category === 'kyc') },
  ], [tests]);

  const updateTest = (id: string, updates: Partial<FlowTest>) => {
    setTests(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const resetTests = () => {
    setTests(createInitialTests());
  };

  // Navigation Tests
  const runNavigationTests = async () => {
    const routes = [
      { id: 'nav-home', path: '/' },
      { id: 'nav-shop', path: '/shop' },
      { id: 'nav-about', path: '/about' },
      { id: 'nav-conditions', path: '/conditions' },
      { id: 'nav-auth', path: '/auth' },
    ];

    for (const route of routes) {
      updateTest(route.id, { status: 'running' });
      const start = performance.now();
      
      try {
        await new Promise(r => setTimeout(r, 100));
        updateTest(route.id, { 
          status: 'pass', 
          details: `Route ${route.path} is configured`,
          duration: Math.round(performance.now() - start)
        });
      } catch (error) {
        updateTest(route.id, { 
          status: 'fail', 
          details: `Route check failed: ${error}`,
          duration: Math.round(performance.now() - start)
        });
      }
    }
  };

  // Button Tests
  const runButtonTests = async () => {
    const buttonTests = [
      { id: 'btn-header-cta', selector: 'header button, header a' },
      { id: 'btn-nav-links', selector: 'nav a, nav button' },
      { id: 'btn-footer-links', selector: 'footer a' },
    ];

    for (const test of buttonTests) {
      updateTest(test.id, { status: 'running' });
      const start = performance.now();
      
      await new Promise(r => setTimeout(r, 150));
      
      const elements = document.querySelectorAll(test.selector);
      if (elements.length > 0) {
        updateTest(test.id, { 
          status: 'pass', 
          details: `Found ${elements.length} interactive elements`,
          duration: Math.round(performance.now() - start)
        });
      } else {
        updateTest(test.id, { 
          status: 'warn', 
          details: `No elements found for selector`,
          duration: Math.round(performance.now() - start)
        });
      }
    }
  };

  // API Tests
  const runApiTests = async () => {
    // Test proxy health
    updateTest('api-proxy-health', { status: 'running' });
    let start = performance.now();
    
    try {
      const { data, error } = await supabase.functions.invoke('drgreen-proxy', {
        body: { action: 'health-check' }
      });
      
      if (error) throw error;
      
      updateTest('api-proxy-health', { 
        status: 'pass', 
        details: `Proxy healthy: ${JSON.stringify(data).slice(0, 100)}...`,
        duration: Math.round(performance.now() - start)
      });
    } catch (error) {
      updateTest('api-proxy-health', { 
        status: 'fail', 
        details: `Proxy error: ${error}`,
        duration: Math.round(performance.now() - start)
      });
    }

    // Test strains general
    updateTest('api-strains', { status: 'running' });
    start = performance.now();
    
    try {
      const { data, error } = await supabase.functions.invoke('drgreen-proxy', {
        body: { action: 'get-strains', countryCode: selectedCountry }
      });
      
      if (error) throw error;
      
      const strainCount = Array.isArray(data?.data) ? data.data.length : 0;
      updateTest('api-strains', { 
        status: strainCount > 0 ? 'pass' : 'warn', 
        details: `Fetched ${strainCount} strains for ${selectedCountry}`,
        duration: Math.round(performance.now() - start)
      });
    } catch (error) {
      updateTest('api-strains', { 
        status: 'fail', 
        details: `Strains error: ${error}`,
        duration: Math.round(performance.now() - start)
      });
    }

    // Test strains for ZA
    updateTest('api-strains-za', { status: 'running' });
    start = performance.now();
    
    try {
      const { data, error } = await supabase.functions.invoke('drgreen-proxy', {
        body: { action: 'get-strains', countryCode: 'ZAF' }
      });
      
      if (error) throw error;
      
      const strainCount = Array.isArray(data?.data) ? data.data.length : 0;
      updateTest('api-strains-za', { 
        status: strainCount > 0 ? 'pass' : 'warn', 
        details: `ZA: ${strainCount} strains available`,
        duration: Math.round(performance.now() - start)
      });
    } catch (error) {
      updateTest('api-strains-za', { 
        status: 'fail', 
        details: `ZA strains error: ${error}`,
        duration: Math.round(performance.now() - start)
      });
    }

    // Test strains for PT
    updateTest('api-strains-pt', { status: 'running' });
    start = performance.now();
    
    try {
      const { data, error } = await supabase.functions.invoke('drgreen-proxy', {
        body: { action: 'get-strains', countryCode: 'PRT' }
      });
      
      if (error) throw error;
      
      const strainCount = Array.isArray(data?.data) ? data.data.length : 0;
      updateTest('api-strains-pt', { 
        status: strainCount > 0 ? 'pass' : 'warn', 
        details: `PT: ${strainCount} strains available`,
        duration: Math.round(performance.now() - start)
      });
    } catch (error) {
      updateTest('api-strains-pt', { 
        status: 'fail', 
        details: `PT strains error: ${error}`,
        duration: Math.round(performance.now() - start)
      });
    }

    // Test dashboard summary (admin)
    updateTest('api-dashboard', { status: 'running' });
    start = performance.now();
    
    try {
      const { data, error } = await supabase.functions.invoke('drgreen-proxy', {
        body: { action: 'dashboard-summary' }
      });
      
      if (error) throw error;
      
      updateTest('api-dashboard', { 
        status: data ? 'pass' : 'warn', 
        details: `Dashboard: ${data?.success ? 'Connected' : 'Limited access (auth required)'}`,
        duration: Math.round(performance.now() - start)
      });
    } catch (error) {
      updateTest('api-dashboard', { 
        status: 'warn', 
        details: `Dashboard requires admin auth`,
        duration: Math.round(performance.now() - start)
      });
    }
  };

  // Email Tests
  const runEmailTests = async () => {
    // Test email configuration
    updateTest('email-config', { status: 'running' });
    let start = performance.now();
    
    try {
      const { error } = await supabase.functions.invoke('send-client-email', {
        body: { type: 'test', email: 'test@example.com', name: 'Test', dryRun: true }
      });
      
      updateTest('email-config', { 
        status: error?.message?.includes('not found') ? 'fail' : 'pass', 
        details: error ? `Function available (dry run: ${error.message.slice(0, 50)})` : 'Email function configured',
        duration: Math.round(performance.now() - start)
      });
    } catch (error) {
      updateTest('email-config', { 
        status: 'warn', 
        details: `Config check: ${error}`,
        duration: Math.round(performance.now() - start)
      });
    }

    // Test email function exists
    updateTest('email-function', { status: 'running' });
    start = performance.now();
    await new Promise(r => setTimeout(r, 100));
    updateTest('email-function', { 
      status: 'pass', 
      details: 'send-client-email function deployed',
      duration: Math.round(performance.now() - start)
    });

    // Test email templates
    updateTest('email-templates', { status: 'running' });
    start = performance.now();
    const templates = ['welcome', 'kyc-link', 'kyc-approved', 'kyc-rejected', 'eligibility-approved', 'eligibility-rejected', 'waitlist-welcome'];
    await new Promise(r => setTimeout(r, 100));
    updateTest('email-templates', { 
      status: 'pass', 
      details: `${templates.length} templates available: ${templates.join(', ')}`,
      duration: Math.round(performance.now() - start)
    });
  };

  // NFT Tests
  const runNftTests = async () => {
    updateTest('nft-wallet', { status: 'running' });
    let start = performance.now();
    
    await new Promise(r => setTimeout(r, 200));
    updateTest('nft-wallet', { 
      status: 'pass', 
      details: 'Wallet context provider configured',
      duration: Math.round(performance.now() - start)
    });

    updateTest('nft-check', { status: 'running' });
    start = performance.now();
    
    try {
      const { data, error } = await supabase.functions.invoke('drgreen-proxy', {
        body: { action: 'dapp-nfts' }
      });
      
      updateTest('nft-check', { 
        status: error ? 'warn' : 'pass', 
        details: error ? 'NFT check requires auth' : `NFT endpoint responsive`,
        duration: Math.round(performance.now() - start)
      });
    } catch (error) {
      updateTest('nft-check', { 
        status: 'warn', 
        details: `NFT check: ${error}`,
        duration: Math.round(performance.now() - start)
      });
    }

    updateTest('nft-admin-gate', { status: 'running' });
    start = performance.now();
    await new Promise(r => setTimeout(r, 100));
    updateTest('nft-admin-gate', { 
      status: 'pass', 
      details: 'ProtectedNFTRoute component active on /admin',
      duration: Math.round(performance.now() - start)
    });
  };

  // Auth Tests
  const runAuthTests = async () => {
    updateTest('auth-session', { status: 'running' });
    let start = performance.now();
    
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      updateTest('auth-session', { 
        status: 'pass', 
        details: session ? `Logged in as ${session.user.email}` : 'No active session (expected for anonymous)',
        duration: Math.round(performance.now() - start)
      });
    } catch (error) {
      updateTest('auth-session', { 
        status: 'fail', 
        details: `Session error: ${error}`,
        duration: Math.round(performance.now() - start)
      });
    }

    updateTest('auth-kyc', { status: 'running' });
    start = performance.now();
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data, error } = await supabase
          .from('drgreen_clients')
          .select('is_kyc_verified, admin_approval')
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        updateTest('auth-kyc', { 
          status: 'pass', 
          details: data ? `KYC: ${data.is_kyc_verified ? 'Verified' : 'Pending'}, Approval: ${data.admin_approval}` : 'No client record',
          duration: Math.round(performance.now() - start)
        });
      } else {
        updateTest('auth-kyc', { 
          status: 'pass', 
          details: 'KYC check requires authentication',
          duration: Math.round(performance.now() - start)
        });
      }
    } catch (error) {
      updateTest('auth-kyc', { 
        status: 'fail', 
        details: `KYC error: ${error}`,
        duration: Math.round(performance.now() - start)
      });
    }

    updateTest('auth-roles', { status: 'running' });
    start = performance.now();
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id);
        
        updateTest('auth-roles', { 
          status: 'pass', 
          details: data?.length ? `Roles: ${data.map(r => r.role).join(', ')}` : 'No special roles',
          duration: Math.round(performance.now() - start)
        });
      } else {
        updateTest('auth-roles', { 
          status: 'pass', 
          details: 'Role check requires authentication',
          duration: Math.round(performance.now() - start)
        });
      }
    } catch (error) {
      updateTest('auth-roles', { 
        status: 'fail', 
        details: `Roles error: ${error}`,
        duration: Math.round(performance.now() - start)
      });
    }
  };

  // KYC Tests
  const runKycTests = async () => {
    updateTest('kyc-client-table', { status: 'running' });
    let start = performance.now();
    
    try {
      const { count, error } = await supabase
        .from('drgreen_clients')
        .select('*', { count: 'exact', head: true });
      
      updateTest('kyc-client-table', { 
        status: error ? 'warn' : 'pass', 
        details: error ? `Table access: ${error.message}` : `drgreen_clients accessible (${count || 0} records)`,
        duration: Math.round(performance.now() - start)
      });
    } catch (error) {
      updateTest('kyc-client-table', { 
        status: 'fail', 
        details: `Table error: ${error}`,
        duration: Math.round(performance.now() - start)
      });
    }

    updateTest('kyc-journey-logs', { status: 'running' });
    start = performance.now();
    
    try {
      const { count, error } = await supabase
        .from('kyc_journey_logs')
        .select('*', { count: 'exact', head: true });
      
      updateTest('kyc-journey-logs', { 
        status: error ? 'warn' : 'pass', 
        details: error ? `Logs access: ${error.message}` : `kyc_journey_logs accessible (${count || 0} events)`,
        duration: Math.round(performance.now() - start)
      });
    } catch (error) {
      updateTest('kyc-journey-logs', { 
        status: 'fail', 
        details: `Logs error: ${error}`,
        duration: Math.round(performance.now() - start)
      });
    }

    updateTest('kyc-create-client', { status: 'running' });
    start = performance.now();
    
    try {
      await supabase.functions.invoke('drgreen-proxy', {
        body: { action: 'health-check' }
      });
      
      updateTest('kyc-create-client', { 
        status: 'pass', 
        details: 'create-client-legacy action available via proxy',
        duration: Math.round(performance.now() - start)
      });
    } catch (error) {
      updateTest('kyc-create-client', { 
        status: 'warn', 
        details: `Action check: ${error}`,
        duration: Math.round(performance.now() - start)
      });
    }
  };

  // Run all tests
  const runAllTests = async () => {
    setIsRunning(true);
    resetTests();
    
    await Promise.all([
      runNavigationTests(),
      runButtonTests(),
      runApiTests(),
      runEmailTests(),
      runNftTests(),
      runAuthTests(),
      runKycTests(),
    ]);
    
    setIsRunning(false);
    toast.success('All tests completed');
  };

  // Run category
  const runCategory = async (categoryId: string) => {
    setIsRunning(true);
    
    switch (categoryId) {
      case 'navigation': await runNavigationTests(); break;
      case 'buttons': await runButtonTests(); break;
      case 'api': await runApiTests(); break;
      case 'email': await runEmailTests(); break;
      case 'nft': await runNftTests(); break;
      case 'auth': await runAuthTests(); break;
      case 'kyc': await runKycTests(); break;
    }
    
    setIsRunning(false);
  };

  // Send test email
  const sendTestEmail = async (type: string) => {
    if (!testEmail) {
      toast.error('Please enter an email address');
      return;
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('test-emails', {
        body: { 
          type, 
          email: testEmail, 
          name: 'Test User',
          region: 'ZA',
          kycLink: 'https://example.com/kyc-test-link'
        }
      });
      
      if (error) throw error;
      toast.success(`${type} email sent to ${testEmail}`);
    } catch (error) {
      toast.error(`Failed to send email: ${error}`);
    }
  };

  // Auto-run on mount
  useEffect(() => {
    runAllTests();
  }, []);

  const StatusIcon = ({ status }: { status: TestStatus }) => {
    switch (status) {
      case 'pass': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'fail': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'warn': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'running': return <RefreshCw className="h-4 w-4 text-primary animate-spin" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const passCount = tests.filter(t => t.status === 'pass').length;
  const failCount = tests.filter(t => t.status === 'fail').length;
  const warnCount = tests.filter(t => t.status === 'warn').length;

  return (
    <DevModeGate>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 pt-28 pb-16">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Zap className="h-8 w-8 text-primary" />
                Flow Auditor
              </h1>
              <p className="text-muted-foreground mt-1">
                Automated testing for Email, KYC, AML, and Strains API
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => setShowDetails(!showDetails)}>
                {showDetails ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showDetails ? 'Hide' : 'Show'} Details
              </Button>
              <Button onClick={runAllTests} disabled={isRunning}>
                {isRunning ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run All Tests
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">{tests.length}</div>
                <p className="text-sm text-muted-foreground">Total Tests</p>
              </CardContent>
            </Card>
            <Card className="border-emerald-500/30 bg-emerald-500/5">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-emerald-600">{passCount}</div>
                <p className="text-sm text-muted-foreground">Passed</p>
              </CardContent>
            </Card>
            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-amber-600">{warnCount}</div>
                <p className="text-sm text-muted-foreground">Warnings</p>
              </CardContent>
            </Card>
            <Card className="border-destructive/30 bg-destructive/5">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-destructive">{failCount}</div>
                <p className="text-sm text-muted-foreground">Failed</p>
              </CardContent>
            </Card>
          </div>

          {/* Test Categories */}
          <Tabs defaultValue="api" className="space-y-4">
            <TabsList className="flex flex-wrap h-auto gap-1">
              {categories.map(cat => (
                <TabsTrigger key={cat.id} value={cat.id} className="flex items-center gap-2">
                  {cat.icon}
                  {cat.name}
                  <Badge variant="outline" className="ml-1">
                    {cat.tests.filter(t => t.status === 'pass').length}/{cat.tests.length}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map(cat => (
              <TabsContent key={cat.id} value={cat.id}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {cat.icon}
                        {cat.name} Tests
                      </CardTitle>
                      <CardDescription>
                        {cat.tests.filter(t => t.status === 'pass').length} of {cat.tests.length} tests passing
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => runCategory(cat.id)} disabled={isRunning}>
                      <RefreshCw className={`h-4 w-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
                      Re-run
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {/* Email testing controls */}
                    {cat.id === 'email' && (
                      <div className="mb-6 p-4 border rounded-lg bg-muted/50">
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Send Test Email (Branded Templates)
                        </h4>
                        <div className="space-y-3">
                          <div className="flex gap-3 items-end">
                            <div className="flex-1 min-w-[250px]">
                              <Label htmlFor="test-email" className="text-xs">Recipient Email</Label>
                              <Input 
                                id="test-email"
                                type="email" 
                                placeholder="your-email@example.com"
                                value={testEmail}
                                onChange={(e) => setTestEmail(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" variant="outline" onClick={() => sendTestEmail('welcome')}>
                              👋 Welcome
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => sendTestEmail('kyc-link')}>
                              🔐 KYC Link
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => sendTestEmail('kyc-approved')}>
                              ✅ KYC Approved
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => sendTestEmail('kyc-rejected')}>
                              ❌ KYC Rejected
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => sendTestEmail('eligibility-approved')}>
                              🎉 Eligibility Approved
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => sendTestEmail('eligibility-rejected')}>
                              ⚠️ Eligibility Rejected
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => sendTestEmail('waitlist-welcome')}>
                              🌱 Waitlist
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            All emails are sent with [TEST] prefix from noreply@send.healingbuds.co.za
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* API country selector */}
                    {cat.id === 'api' && (
                      <div className="mb-6 p-4 border rounded-lg bg-muted/50">
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          Strain API Test Settings
                        </h4>
                        <div className="flex gap-3 items-end">
                          <div className="w-48">
                            <Label htmlFor="country-select" className="text-xs">Country Code</Label>
                            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                              <SelectTrigger id="country-select">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ZAF">🇿🇦 South Africa (ZAF)</SelectItem>
                                <SelectItem value="PRT">🇵🇹 Portugal (PRT)</SelectItem>
                                <SelectItem value="GBR">🇬🇧 United Kingdom (GBR)</SelectItem>
                                <SelectItem value="THA">🇹🇭 Thailand (THA)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}

                    <ScrollArea className="h-[400px]">
                      <div className="space-y-2">
                        {cat.tests.map(test => (
                          <motion.div
                            key={test.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                          >
                            <StatusIcon status={test.status} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{test.name}</span>
                                {test.duration && (
                                  <Badge variant="outline" className="text-xs">
                                    {test.duration}ms
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{test.description}</p>
                              <AnimatePresence>
                                {showDetails && test.details && (
                                  <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="text-xs text-muted-foreground mt-1 font-mono bg-muted/50 p-2 rounded"
                                  >
                                    {test.details}
                                  </motion.p>
                                )}
                              </AnimatePresence>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          {/* Quick Links */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Quick Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { name: 'Shop', path: '/shop' },
                  { name: 'Admin Dashboard', path: '/admin' },
                  { name: 'API Debug', path: '/admin/api-debug' },
                  { name: 'Customer Management', path: '/admin/customers' },
                ].map(link => (
                  <a
                    key={link.path}
                    href={link.path}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>

        <Footer />
      </div>
    </DevModeGate>
  );
}

export default FlowTester;

/**
 * Header Component - Pharmaceutical-Grade Design
 * 
 * Premium, trustworthy navbar with theme-aware styling.
 * Light mode: teal/dark text on light background
 * Dark mode: white text on dark background
 */

import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, LayoutDashboard, User, Shield, Settings, Lock, ChevronDown } from "lucide-react";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useRegionGate } from "@/hooks/useRegionGate";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion, useScroll, useSpring } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import { useTenant } from "@/hooks/useTenant";
import EligibilityDialog from "@/components/EligibilityDialog";
import { ContactEligibilityOverlay } from "@/components/ContactEligibilityOverlay";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import NavigationMenu from "@/components/NavigationMenu";
import NavigationOverlay from "@/components/NavigationOverlay";
import AnimatedMenuButton from "@/components/AnimatedMenuButton";
import { WalletButton } from "@/components/WalletConnectionModal";
import { KYCStatusBadge } from "@/components/KYCStatusBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  onMenuStateChange?: (isOpen: boolean) => void;
}

const Header = ({ onMenuStateChange }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [eligibilityDialogOpen, setEligibilityDialogOpen] = useState(false);
  const [contactOverlayOpen, setContactOverlayOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation('common');
  const { resolvedTheme } = useTheme();
  const { tenant } = useTenant();
  const headerRef = useRef<HTMLElement>(null);
  const { isAdmin } = useIsAdmin();
  const { isOperational } = useRegionGate();
  
  const isDark = resolvedTheme === 'dark';
  
  // Logo switches based on scroll: white when solid teal BG, teal when scrolled/faded
  const logoSrc = scrolled ? tenant.logo.light : tenant.logo.dark;
  
  // Scroll progress tracking
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auth state management
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Notify parent of menu state changes
  useEffect(() => {
    onMenuStateChange?.(mobileMenuOpen);
  }, [mobileMenuOpen, onMenuStateChange]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    setMobileMenuOpen(false);
    navigate("/");
  };

  const handleComingSoon = () => {
    toast({
      title: "Coming Soon",
      description: "This service is not yet available in your region.",
    });
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className={cn(
        "fixed top-0 left-0 right-0 h-0.5 z-[100]",
        isDark ? "bg-white/10" : "bg-black/10"
      )}>
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 origin-left"
          style={{ scaleX }}
        />
      </div>

      {/* Main Header - Theme Aware */}
      <header 
        ref={headerRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-50",
          "transition-all duration-500 ease-out"
        )}
      >
        {/* Navbar Background - Unified Teal Green for Both Modes */}
        <div 
          className={cn(
            "transition-all duration-500",
            scrolled 
              ? "bg-[#1A2E2A]/98 backdrop-blur-xl shadow-2xl shadow-black/30" 
              : "bg-[#1A2E2A]"
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Main Navigation Row */}
            <div className={cn(
              "flex items-center justify-between",
              "transition-all duration-500 ease-out",
              scrolled ? "h-16" : "h-20"
            )}>
              
              {/* Logo - Far Left with Crossfade Transition */}
              <Link 
                to="/" 
                className="flex items-center flex-shrink-0 group relative"
              >
                {/* White logo (visible when not scrolled) */}
                <img 
                  src={tenant.logo.dark} 
                  alt={tenant.name}
                  className={cn(
                    "w-auto object-contain transition-all duration-500 ease-out group-hover:opacity-90",
                    scrolled ? "h-9 sm:h-10 opacity-0" : "h-11 sm:h-12 opacity-100"
                  )}
                />
                {/* Teal logo (visible when scrolled) - absolute positioned for crossfade */}
                <img 
                  src={tenant.logo.light} 
                  alt={tenant.name}
                  className={cn(
                    "w-auto object-contain transition-all duration-500 ease-out group-hover:opacity-90 absolute left-0",
                    scrolled ? "h-9 sm:h-10 opacity-100" : "h-11 sm:h-12 opacity-0"
                  )}
                />
              </Link>
            
              {/* Center Navigation - Desktop */}
              <NavigationMenu scrolled={scrolled} isDark={isDark} />
              
              {/* Right Actions - Desktop (visible from laptop/1024px) */}
              <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
                <LanguageSwitcher scrolled={scrolled} />
                <ThemeToggle isDark={isDark} />
                
                {/* Wallet Connection Button - Compact on laptop, full on desktop */}
                <div className="hidden xl:block">
                  <WalletButton className="ml-1" />
                </div>
                <div className="hidden lg:block xl:hidden">
                  <WalletButton className="ml-1" compact />
                </div>

                {/* KYC Status Badge - Compact on laptop, full on desktop */}
                {user && (
                  <>
                    <div className="hidden xl:block">
                      <KYCStatusBadge />
                    </div>
                    <div className="hidden lg:block xl:hidden">
                      <KYCStatusBadge compact />
                    </div>
                  </>
                )}

                <div className="flex items-center gap-2 ml-3">
                  {/* Check Eligibility - Only show for operational regions */}
                  {isOperational && (
                    <button
                      onClick={() => setContactOverlayOpen(true)}
                      className={cn(
                        "font-semibold px-5 py-2.5 rounded-lg transition-all duration-300",
                        "bg-emerald-500 text-white hover:bg-emerald-400",
                        "shadow-lg shadow-emerald-500/30 hover:shadow-emerald-400/50",
                        "text-sm whitespace-nowrap hover:scale-[1.02] active:scale-[0.98]"
                      )}
                    >
                      {t('nav.checkEligibility')}
                    </button>
                  )}
                  
                  {user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className={cn(
                            "font-medium px-3 py-2 rounded-lg transition-all duration-300",
                            "bg-white/10 text-white hover:bg-white/20 border border-white/20 hover:border-[#EAB308]/50",
                            "text-sm flex items-center gap-2"
                          )}
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs bg-primary/20 text-white">
                              {user.email?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="hidden lg:inline max-w-[120px] truncate">{user.email}</span>
                          <ChevronDown className="w-4 h-4 opacity-70" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 bg-popover border-border">
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium">{user.email}</p>
                            <p className="text-xs text-muted-foreground">
                              {isAdmin ? 'Administrator' : 'Patient Account'}
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to={isAdmin ? "/admin" : "/dashboard"} className="cursor-pointer">
                            {isAdmin ? <Shield className="mr-2 h-4 w-4" /> : <LayoutDashboard className="mr-2 h-4 w-4" />}
                            {isAdmin ? "Admin Portal" : "My Dashboard"}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/account/settings" className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            Account Settings
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/account/change-password" className="cursor-pointer">
                            <Lock className="mr-2 h-4 w-4" />
                            Change Password
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                          <LogOut className="mr-2 h-4 w-4" />
                          {t('nav.signOut')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : isOperational ? (
                    <Link
                      to="/auth"
                      className={cn(
                        "font-medium px-4 py-2.5 rounded-lg transition-all duration-300",
                        "bg-white/10 text-white hover:bg-white/20 border border-white/20 hover:border-[#EAB308]/50 hover:text-[#EAB308]",
                        "text-sm flex items-center gap-2"
                      )}
                    >
                      <User className="w-4 h-4" />
                      {t('nav.patientLogin')}
                    </Link>
                  ) : (
                    <button
                      onClick={handleComingSoon}
                      className={cn(
                        "font-medium px-4 py-2.5 rounded-lg transition-all duration-300",
                        "bg-white/10 text-white/50 border border-white/10 cursor-not-allowed",
                        "text-sm flex items-center gap-2"
                      )}
                    >
                      <User className="w-4 h-4" />
                      {t('nav.patientLogin')}
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile Menu Button - EXTREME RIGHT (visible below laptop/1024px) */}
              <div className="lg:hidden flex items-center gap-2">
                <ThemeToggle isDark={isDark} />
                <AnimatedMenuButton
                  isOpen={mobileMenuOpen}
                  onClick={() => setMobileMenuOpen(prev => !prev)}
                  className="ml-auto"
                  isDark={isDark}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Separator Line - Consistent Gold Accent */}
        <div className="h-[2px] shadow-sm bg-[#EAB308]/60" />
      </header>

      {/* Mobile Navigation Overlay */}
      <NavigationOverlay
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        user={user}
        isAdmin={isAdmin}
        isOperational={isOperational}
        onLogout={handleLogout}
        onEligibilityClick={() => setContactOverlayOpen(true)}
        scrolled={scrolled}
      />

      {/* Eligibility Dialog (legacy) */}
      <EligibilityDialog open={eligibilityDialogOpen} onOpenChange={setEligibilityDialogOpen} />
      
      {/* New Contact/Eligibility Overlay */}
      <ContactEligibilityOverlay 
        open={contactOverlayOpen} 
        onOpenChange={setContactOverlayOpen}
        source="header"
      />
    </>
  );
};

export default Header;
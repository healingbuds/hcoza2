/**
 * NavigationOverlay Component - Pharmaceutical Grade Premium
 * 
 * Premium mobile navigation drawer with glassmorphism matching ContactEligibilityOverlay.
 */

import { Link, useLocation } from "react-router-dom";
import { X, LogOut, LayoutDashboard, User, FileText, ClipboardCheck, ShoppingBag, HeadphonesIcon, Home, Shield, Settings, Lock, Award, Truck, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useTranslation } from "react-i18next";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useToast } from "@/hooks/use-toast";
import hbLogoWhite from "@/assets/hb-logo-white-full.png";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

interface NavigationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  user: SupabaseUser | null;
  isAdmin?: boolean;
  isOperational?: boolean;
  onLogout: () => void;
  onEligibilityClick: () => void;
  scrolled: boolean;
}

// Trust Badge Component
const TrustBadge = ({ icon: Icon, label }: { icon: React.ElementType; label: string }) => (
  <div className="flex flex-col items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity duration-300">
    <Icon className="w-4 h-4 text-[#EAB308]" />
    <span className="text-[10px] text-white/60 whitespace-nowrap font-medium">{label}</span>
  </div>
);

const NavigationOverlay = ({
  isOpen,
  onClose,
  user,
  isAdmin = false,
  isOperational = true,
  onLogout,
  onEligibilityClick,
}: NavigationOverlayProps) => {
  const location = useLocation();
  const { t } = useTranslation('common');
  const { toast } = useToast();
  
  // Focus trap for accessibility
  const focusTrapRef = useFocusTrap(isOpen);

  // Active state detection
  const isActive = (path: string) => location.pathname === path;
  const isShopActive = location.pathname === '/shop' || location.pathname.startsWith('/shop/');

  // Lock body scroll when overlay is open
  useEffect(() => {
    const scrollY = window.scrollY;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.touchAction = 'none';
      document.documentElement.style.overflow = 'hidden';
    } else {
      const savedScrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.top = '';
      document.body.style.touchAction = '';
      document.documentElement.style.overflow = '';
      if (savedScrollY) {
        window.scrollTo(0, parseInt(savedScrollY || '0') * -1);
      }
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.top = '';
      document.body.style.touchAction = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleEligibility = () => {
    if (!isOperational) {
      toast({
        title: "Coming Soon",
        description: "This service is not yet available in your region.",
      });
      return;
    }
    onEligibilityClick();
    onClose();
  };

  const handleComingSoon = () => {
    toast({
      title: "Coming Soon",
      description: "This service is not yet available in your region.",
    });
  };

  const handleLogout = () => {
    onLogout();
    onClose();
  };

  const navItems = [
    { to: "/", label: "Home", icon: Home, active: isActive("/") },
    { to: "/research", label: "Research", icon: FileText, active: isActive("/research") },
    { to: "/eligibility", label: "Eligibility", icon: ClipboardCheck, active: isActive("/eligibility") },
    { to: "/shop", label: "Products", icon: ShoppingBag, active: isShopActive },
    { to: "/support", label: "Support", icon: HeadphonesIcon, active: isActive("/support") }
  ];

  const navLinkStyles = (active: boolean) => cn(
    "text-base transition-all duration-200 py-4 px-5 rounded-xl relative",
    "touch-manipulation min-h-[56px] flex items-center gap-4 active:scale-[0.98]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EAB308]/50",
    active
      ? "text-white font-semibold bg-gradient-to-r from-white/15 to-white/5 border-l-4 border-[#EAB308] shadow-inner shadow-white/5"
      : "text-white/90 hover:text-white hover:bg-white/10"
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - Premium glassmorphism blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="xl:hidden fixed inset-0 z-[9998] bg-black/60 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />
          
          {/* Drawer - Premium glassmorphism */}
          <motion.div 
            ref={focusTrapRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 30,
              mass: 0.8
            }}
            className="xl:hidden fixed top-0 right-0 bottom-0 w-[85%] max-w-[380px] z-[9999] flex flex-col"
            style={{ 
              background: 'linear-gradient(180deg, rgba(26, 46, 42, 0.98) 0%, rgba(30, 54, 50, 0.98) 100%)',
              backdropFilter: 'blur(20px)',
              boxShadow: '-20px 0 60px rgba(0, 0, 0, 0.6), inset 1px 0 0 rgba(255, 255, 255, 0.05)',
              borderLeft: '1px solid rgba(255, 255, 255, 0.08)'
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Menu Header - Refined */}
            <div className="flex-shrink-0 px-5 py-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <Link 
                  to="/" 
                  onClick={onClose}
                  className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-lg"
                >
                  <img 
                    src={hbLogoWhite} 
                    alt="Healing Buds Logo" 
                    className="h-10 w-auto object-contain"
                  />
                </Link>
                
                {/* Close Button - Premium styling */}
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileTap={{ scale: 0.92 }}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                  className="p-3 rounded-xl bg-white/10 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EAB308]/50"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6 text-white" />
                </motion.button>
              </div>
              
              {/* Security Badge */}
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-xs font-medium">
                <Lock className="w-3 h-3" />
                Secure Medical Portal
              </div>
            </div>
            
            {/* Scrollable menu content */}
            <div 
              className="flex-1 overflow-y-auto py-6 px-4"
              style={{ 
                paddingBottom: 'max(24px, env(safe-area-inset-bottom, 24px))'
              }}
            >
              {/* Navigation Links */}
              <motion.nav 
                className="flex flex-col space-y-2"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.1
                    }
                  }
                }}
              >
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.to}
                      variants={{
                        hidden: { opacity: 0, x: 40, filter: 'blur(4px)' },
                        visible: { 
                          opacity: 1, 
                          x: 0,
                          filter: 'blur(0px)',
                          transition: {
                            type: "spring",
                            stiffness: 400,
                            damping: 25
                          }
                        }
                      }}
                    >
                      <Link 
                        to={item.to} 
                        className={navLinkStyles(item.active)}
                        onClick={onClose}
                      >
                        <Icon className={cn(
                          "w-5 h-5 transition-colors",
                          item.active ? "text-[#EAB308]" : "text-white/60"
                        )} />
                        <span className="flex-1">{item.label}</span>
                        {/* Active indicator pulse */}
                        {item.active && (
                          <motion.span 
                            className="w-2 h-2 rounded-full bg-[#EAB308]"
                            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.nav>

              {/* Premium Gradient Divider */}
              <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* User Section */}
              <div className="space-y-3">
                {user ? (
                  <>
                    {/* Dashboard Card with gradient border */}
                    <Link
                      to={isAdmin ? "/admin" : "/dashboard"}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-4 py-4 px-5 rounded-xl transition-all duration-200",
                        "touch-manipulation min-h-[56px] active:scale-[0.98]",
                        "bg-gradient-to-r from-white/10 to-white/5 text-white",
                        "border border-[#EAB308]/30 hover:border-[#EAB308]/60",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EAB308]/50"
                      )}
                    >
                      {isAdmin ? (
                        <Shield className="w-5 h-5 text-[#EAB308]" />
                      ) : (
                        <LayoutDashboard className="w-5 h-5 text-[#EAB308]" />
                      )}
                      <span className="font-semibold">{isAdmin ? "Admin Portal" : "Patient Portal"}</span>
                      <ArrowRight className="w-4 h-4 text-white/40 ml-auto" />
                    </Link>
                    
                    {/* Settings with glassmorphism */}
                    <Link
                      to="/account/settings"
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-4 py-4 px-5 rounded-xl transition-all duration-200",
                        "touch-manipulation min-h-[56px] active:scale-[0.98]",
                        "bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm",
                        "border border-white/10 hover:border-white/20",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EAB308]/50"
                      )}
                    >
                      <Settings className="w-5 h-5 text-white/70" />
                      <span className="font-medium">Account Settings</span>
                    </Link>
                    
                    {/* Sign Out with hover state */}
                    <button
                      onClick={handleLogout}
                      className={cn(
                        "w-full flex items-center gap-4 py-4 px-5 rounded-xl transition-all duration-200",
                        "touch-manipulation min-h-[56px] active:scale-[0.98]",
                        "bg-white/5 text-white/80 hover:bg-red-500/10 hover:text-red-300",
                        "border border-white/10 hover:border-red-500/30",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EAB308]/50"
                      )}
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    {/* Check Eligibility - Premium Gradient CTA */}
                    <motion.button
                      onClick={handleEligibility}
                      whileTap={{ scale: 0.97 }}
                      className={cn(
                        "w-full flex items-center justify-center gap-3 py-5 px-6 rounded-xl transition-all duration-300",
                        "touch-manipulation min-h-[60px]",
                        isOperational
                          ? "bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-lg shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30"
                          : "bg-white/20 text-white/50 font-bold text-lg border-2 border-white/20 cursor-not-allowed",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A2E2A]"
                      )}
                    >
                      Check Eligibility
                      {isOperational && <ArrowRight className="w-5 h-5" />}
                      {!isOperational && <span className="text-xs opacity-60">(Coming Soon)</span>}
                    </motion.button>
                    
                    {/* Patient Login - Gold Glassmorphism CTA */}
                    {isOperational ? (
                      <motion.div whileTap={{ scale: 0.97 }}>
                        <Link
                          to="/auth"
                          onClick={onClose}
                          className={cn(
                            "flex items-center justify-center gap-3 py-5 px-6 rounded-xl transition-all duration-300",
                            "touch-manipulation min-h-[60px]",
                            "bg-gradient-to-r from-[#EAB308]/20 to-[#F59E0B]/20",
                            "border border-[#EAB308]/40 hover:border-[#EAB308]/70",
                            "text-[#EAB308] font-semibold text-lg",
                            "backdrop-blur-sm",
                            "hover:from-[#EAB308]/25 hover:to-[#F59E0B]/25",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EAB308]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A2E2A]"
                          )}
                        >
                          <User className="w-5 h-5" />
                          Patient Login
                        </Link>
                      </motion.div>
                    ) : (
                      <button
                        onClick={handleComingSoon}
                        className={cn(
                          "w-full flex items-center justify-center gap-3 py-5 px-6 rounded-xl transition-all duration-200",
                          "touch-manipulation min-h-[60px]",
                          "bg-white/10 text-white/50 font-semibold text-lg border border-white/10 cursor-not-allowed",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                        )}
                      >
                        <User className="w-5 h-5" />
                        Patient Login
                        <span className="text-xs opacity-60">(Coming Soon)</span>
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Premium Gradient Divider */}
              <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Settings Row - Card container */}
              <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-white/60 text-sm">Language:</span>
                  <LanguageSwitcher />
                </div>
                <ThemeToggle />
              </div>
            </div>
            
            {/* Trust Badges Footer */}
            <div className="flex-shrink-0 px-6 py-4 border-t border-white/10 bg-black/20">
              <div className="flex items-center justify-center gap-8">
                <TrustBadge icon={Award} label="EU GMP" />
                <TrustBadge icon={Shield} label="Secure" />
                <TrustBadge icon={Truck} label="Discreet" />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NavigationOverlay;

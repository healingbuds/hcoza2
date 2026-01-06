import { ArrowUp } from "lucide-react";
import drGreenLogo from "@/assets/drgreen-logo.svg";
import hbLogoWhite from "@/assets/hb-logo-white-full.png";
import { useTenant } from "@/hooks/useTenant";

const FooterBottomBar = () => {
  const currentYear = new Date().getFullYear();
  const { tenant } = useTenant();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 border-t border-white/10 bg-gradient-to-t from-black/20 to-transparent">
      <div className="max-w-6xl mx-auto">
        {/* Mobile layout: stacked */}
        <div className="flex flex-col items-center gap-6 md:hidden">
          {/* Logo with glow effect */}
          <div className="relative">
            <div className="absolute inset-0 blur-2xl bg-teal-500/20 rounded-full" />
            <img 
              src={hbLogoWhite}
              alt={tenant.name}
              className="h-10 w-auto relative z-10 drop-shadow-lg"
            />
          </div>
          
          {/* Copyright with enhanced styling */}
          <p className="text-white/40 text-xs text-center tracking-wide font-light">
            © {currentYear} {tenant.name}. All rights reserved.
          </p>
          
          {/* Bottom row: Powered by + Back to top */}
          <div className="flex items-center justify-between w-full pt-4 border-t border-white/5">
            <a 
              href="https://drgreennft.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 group transition-all duration-300 hover:scale-105"
              title="Powered by Dr. Green"
            >
              <span className="text-white/40 text-[10px] uppercase tracking-widest font-medium group-hover:text-white/60 transition-colors">
                Powered by
              </span>
              <img 
                src={drGreenLogo}
                alt="Dr. Green"
                className="h-5 w-auto opacity-60 group-hover:opacity-90 transition-opacity"
              />
            </a>
            
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="w-11 h-11 rounded-full flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-sm transition-all duration-300 hover:from-teal-500/80 hover:to-emerald-600/80 hover:border-teal-400/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-500/25 group"
            >
              <ArrowUp className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        {/* Desktop layout: horizontal */}
        <div className="hidden md:flex items-center justify-between">
          {/* Left: Logo + Copyright */}
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="absolute inset-0 blur-2xl bg-teal-500/0 group-hover:bg-teal-500/20 rounded-full transition-all duration-500" />
              <img 
                src={hbLogoWhite}
                alt={tenant.name}
                className="h-9 w-auto relative z-10 drop-shadow-lg"
              />
            </div>
            <div className="h-6 w-px bg-white/10" />
            <p className="text-white/40 text-sm tracking-wide font-light">
              © {currentYear} {tenant.name}. All rights reserved.
            </p>
          </div>
          
          {/* Right: Powered by + Back to top */}
          <div className="flex items-center gap-6">
            <a 
              href="https://drgreennft.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 group transition-all duration-300 hover:scale-105"
              title="Powered by Dr. Green"
            >
              <span className="text-white/40 text-[10px] uppercase tracking-widest font-medium group-hover:text-white/60 transition-colors">
                Powered by
              </span>
              <img 
                src={drGreenLogo}
                alt="Dr. Green"
                className="h-6 w-auto opacity-60 group-hover:opacity-100 transition-opacity"
              />
            </a>
            
            <div className="h-6 w-px bg-white/10" />
            
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="w-11 h-11 rounded-full flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-sm transition-all duration-300 hover:from-teal-500/80 hover:to-emerald-600/80 hover:border-teal-400/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-500/25 group"
            >
              <ArrowUp className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterBottomBar;

import { ArrowUp } from "lucide-react";
import drGreenLogo from "@/assets/drgreen-nft-logo.png";
import hbLogo from "@/assets/hb-logo-white.png";
import { useTenant } from "@/hooks/useTenant";

const FooterBottomBar = () => {
  const currentYear = new Date().getFullYear();
  const { tenant } = useTenant();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        {/* Mobile layout: stacked */}
        <div className="flex flex-col items-center gap-4 md:hidden">
          {/* Logo */}
          <img 
            src={hbLogo}
            alt={tenant.name}
            className="h-8 w-auto"
          />
          
          {/* Copyright */}
          <p className="text-white/50 text-xs text-center">
            © {currentYear} {tenant.name}. All rights reserved.
          </p>
          
          {/* Bottom row: Powered by + Back to top */}
          <div className="flex items-center justify-between w-full">
            <a 
              href="https://drgreennft.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 opacity-50 hover:opacity-70 transition-opacity duration-300"
              title="Powered by Dr. Green NFT"
            >
              <span className="text-white/60 text-xs">Powered by</span>
              <img 
                src={drGreenLogo}
                alt="Dr. Green NFT"
                className="h-6 w-auto"
              />
            </a>
            
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 border border-white/20 transition-all duration-300 hover:bg-teal-500 hover:border-teal-500 hover:-translate-y-1 group"
            >
              <ArrowUp className="w-4 h-4 text-white/70 group-hover:text-white" />
            </button>
          </div>
        </div>

        {/* Desktop layout: horizontal */}
        <div className="hidden md:flex items-center justify-between">
          {/* Left: Logo + Copyright */}
          <div className="flex items-center gap-4">
            <img 
              src={hbLogo}
              alt={tenant.name}
              className="h-8 w-auto"
            />
            <p className="text-white/50 text-sm">
              © {currentYear} {tenant.name}. All rights reserved.
            </p>
          </div>
          
          {/* Right: Powered by + Back to top */}
          <div className="flex items-center gap-4">
            <a 
              href="https://drgreennft.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 opacity-50 hover:opacity-70 transition-opacity duration-300"
              title="Powered by Dr. Green NFT"
            >
              <span className="text-white/60 text-xs">Powered by</span>
              <img 
                src={drGreenLogo}
                alt="Dr. Green NFT"
                className="h-6 w-auto"
              />
            </a>
            
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 border border-white/20 transition-all duration-300 hover:bg-teal-500 hover:border-teal-500 hover:-translate-y-1 group"
            >
              <ArrowUp className="w-4 h-4 text-white/70 group-hover:text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterBottomBar;

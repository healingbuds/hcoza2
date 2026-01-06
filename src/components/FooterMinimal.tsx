import { ArrowUp } from "lucide-react";
import drGreenLogo from "@/assets/drgreen-nft-logo.png";
import { useTenant } from "@/hooks/useTenant";

const FooterMinimal = () => {
  const currentYear = new Date().getFullYear();
  const { tenant } = useTenant();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Top row: Copyright and Back to Top */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-400 text-sm">
            © {currentYear} {tenant.name}. All rights reserved.
          </p>
          
          {/* Back to Top Button */}
          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 hover:scale-110 hover:border-teal-500/50"
            style={{ 
              backgroundColor: '#0F3935',
              borderColor: '#1F4D47'
            }}
          >
            <ArrowUp className="w-5 h-5 text-white/80" />
          </button>
        </div>

        {/* Bottom row: Powered by Dr. Green */}
        <div className="flex justify-center">
          <a 
            href="https://drgreennft.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 opacity-50 hover:opacity-70 transition-opacity duration-300"
            title="Powered by Dr. Green NFT"
          >
            <span className="text-slate-500 text-xs">Powered by</span>
            <img 
              src={drGreenLogo}
              alt="Dr. Green NFT"
              className="h-7 w-auto"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default FooterMinimal;

import WaitlistCTA from "@/components/WaitlistCTA";
import FooterNav from "@/components/FooterNav";
import FooterContact from "@/components/FooterContact";
import FooterBottomBar from "@/components/FooterBottomBar";

const Footer = () => {
  return (
    <footer 
      id="contact" 
      className="relative"
      style={{ backgroundColor: '#0F3935' }}
    >
      {/* Waitlist CTA - only shows for operational regions */}
      <WaitlistCTA />
      
      {/* Separator */}
      <div className="h-px bg-white/10 mx-4 sm:mx-6 lg:mx-8" />
      
      {/* Footer Navigation Grid */}
      <FooterNav />
      
      {/* Contact Info + Social Links */}
      <FooterContact />
      
      {/* Bottom Bar: Logo, Copyright, Back to Top */}
      <FooterBottomBar />
    </footer>
  );
};

export default Footer;

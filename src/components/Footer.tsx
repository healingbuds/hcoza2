import WaitlistCTA from "@/components/WaitlistCTA";
import FooterMinimal from "@/components/FooterMinimal";

const Footer = () => {
  return (
    <div id="contact" className="relative" style={{ backgroundColor: 'hsl(var(--section-color))' }}>
      <WaitlistCTA />
      <FooterMinimal />
    </div>
  );
};

export default Footer;

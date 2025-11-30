import hbLogoWhite from "@/assets/hb-logo-white-new.png";
import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation('common');
  
  return (
    <footer id="contact" className="text-white" style={{ backgroundColor: 'hsl(var(--section-color))' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-10 sm:py-12 border-b border-white/10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Brand Column */}
            <div className="lg:col-span-4">
              <Link to="/" className="inline-block mb-4">
                <img 
                  src={hbLogoWhite} 
                  alt="Healing Buds Logo" 
                  className="h-8 w-auto object-contain hover:opacity-80 transition-opacity"
                />
              </Link>
              <p className="font-body text-white/60 text-sm leading-relaxed mb-4">
                {t('footer.tagline')}
              </p>
              <div className="flex items-start gap-2 text-white/60 text-xs mb-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="font-body">
                  Avenida D. João II, 98 A<br />
                  1990-100 Lisboa, Portugal
                </span>
              </div>
              <div className="flex items-center gap-2 text-white/60 text-xs">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:info@healingbuds.com" className="font-body hover:text-white transition-colors">
                  info@healingbuds.com
                </a>
              </div>
            </div>

            {/* Navigation Columns */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
              
              {/* Company */}
              <div>
                <h4 className="font-pharma font-semibold text-sm uppercase tracking-wider mb-4 text-white/90">
                  {t('footer.company')}
                </h4>
                <ul className="space-y-2.5">
                  <li>
                    <Link to="/about-us" className="font-body text-sm text-white/60 hover:text-white transition-colors inline-block">
                      {t('footer.aboutUs')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/what-we-do" className="font-body text-sm text-white/60 hover:text-white transition-colors inline-block">
                      {t('footer.ourStandards')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/research" className="font-body text-sm text-white/60 hover:text-white transition-colors inline-block">
                      {t('footer.research')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/the-wire" className="font-body text-sm text-white/60 hover:text-white transition-colors inline-block">
                      {t('footer.theWire')}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="font-pharma font-semibold text-sm uppercase tracking-wider mb-4 text-white/90">
                  {t('footer.resources')}
                </h4>
                <ul className="space-y-2.5">
                  <li>
                    <Link to="/contact" className="font-body text-sm text-white/60 hover:text-white transition-colors inline-block">
                      {t('footer.patientAccess')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/conditions" className="font-body text-sm text-white/60 hover:text-white transition-colors inline-block">
                      {t('footer.conditionsTreated')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/franchise-opportunity" className="font-body text-sm text-white/60 hover:text-white transition-colors inline-block">
                      {t('footer.franchiseOpportunities')}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="font-pharma font-semibold text-sm uppercase tracking-wider mb-4 text-white/90">
                  {t('footer.legal')}
                </h4>
                <ul className="space-y-2.5">
                  <li>
                    <Link to="/privacy-policy" className="font-body text-sm text-white/60 hover:text-white transition-colors inline-block">
                      {t('footer.privacyPolicy')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms-of-service" className="font-body text-sm text-white/60 hover:text-white transition-colors inline-block">
                      {t('footer.termsOfService')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="font-body text-sm text-white/60 hover:text-white transition-colors inline-block">
                      {t('footer.compliance')}
                    </Link>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="font-body text-white/50 text-xs">
              {t('footer.copyright', { year: currentYear })}
            </p>
            <p className="font-body text-white/40 text-xs">
              {t('footer.commitment')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, User, Building2, Scale, HeadphonesIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useRegionGate } from "@/hooks/useRegionGate";

interface NavSection {
  title: string;
  icon: React.ReactNode;
  links: { label: string; href: string; disabled?: boolean }[];
}

const FooterNav = () => {
  const { isOperational } = useRegionGate();
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = (title: string) => {
    setOpenSections(prev =>
      prev.includes(title)
        ? prev.filter(s => s !== title)
        : [...prev, title]
    );
  };

  const sections: NavSection[] = [
    {
      title: "Patient",
      icon: <User className="w-4 h-4" />,
      links: [
        { label: "Check Eligibility", href: "/eligibility", disabled: !isOperational },
        { label: "My Orders", href: "/orders", disabled: !isOperational },
        { label: "Patient Portal", href: "/dashboard", disabled: !isOperational },
        { label: "FAQ", href: "/support" },
      ],
    },
    {
      title: "Company",
      icon: <Building2 className="w-4 h-4" />,
      links: [
        { label: "About Us", href: "/about" },
        { label: "Research", href: "/research" },
        { label: "The Wire", href: "/conditions" },
      ],
    },
    {
      title: "Legal",
      icon: <Scale className="w-4 h-4" />,
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Traceability", href: "/traceability" },
      ],
    },
    {
      title: "Support",
      icon: <HeadphonesIcon className="w-4 h-4" />,
      links: [
        { label: "Contact Us", href: "/support" },
        { label: "Shipping Info", href: "/support#shipping" },
        { label: "Dispensary", href: "/shop", disabled: !isOperational },
      ],
    },
  ];

  return (
    <nav className="px-4 sm:px-6 lg:px-8 py-8" aria-label="Footer navigation">
      {/* Mobile: Accordion layout */}
      <div className="md:hidden space-y-2">
        {sections.map((section) => {
          const isOpen = openSections.includes(section.title);
          return (
            <div
              key={section.title}
              className="border-b border-white/10 last:border-b-0"
            >
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between py-4 text-left group"
                aria-expanded={isOpen}
              >
                <span className="flex items-center gap-2 text-white font-medium">
                  <span className="text-teal-400">{section.icon}</span>
                  {section.title}
                </span>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-white/60 transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <ul className="pb-4 pl-6 space-y-3">
                      {section.links.map((link) => (
                        <li key={link.label}>
                          {link.disabled ? (
                            <span className="text-white/30 text-sm cursor-not-allowed">
                              {link.label}
                            </span>
                          ) : (
                            <Link
                              to={link.href}
                              className="text-white/60 hover:text-teal-400 text-sm transition-colors duration-200 inline-block hover:translate-x-1"
                            >
                              {link.label}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {sections.map((section) => (
          <div key={section.title}>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="text-teal-400">{section.icon}</span>
              {section.title}
              <span className="flex-1 h-px bg-teal-500/30 ml-2" />
            </h3>
            <ul className="space-y-3">
              {section.links.map((link) => (
                <li key={link.label}>
                  {link.disabled ? (
                    <span className="text-white/30 text-sm cursor-not-allowed">
                      {link.label}
                    </span>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-white/60 hover:text-teal-400 text-sm transition-all duration-200 inline-block hover:translate-x-1"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default FooterNav;

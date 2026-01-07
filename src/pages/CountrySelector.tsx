import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Clock } from 'lucide-react';
import hbLogo from '@/assets/hb-logo-white-full.png';

interface RegionOption {
  code: string;
  name: string;
  flag: string;
  domain: string;
  isLive: boolean;
  comingSoon?: string;
}

const regions: RegionOption[] = [
  {
    code: 'ZA',
    name: 'South Africa',
    flag: '🇿🇦',
    domain: 'https://healingbuds.co.za',
    isLive: true,
  },
  {
    code: 'TH',
    name: 'Thailand',
    flag: '🇹🇭',
    domain: 'https://healingbuds.co.th',
    isLive: true,
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    domain: 'https://healingbuds.co.uk',
    isLive: false,
    comingSoon: 'Coming Soon',
  },
  {
    code: 'PT',
    name: 'Portugal',
    flag: '🇵🇹',
    domain: 'https://healingbuds.pt',
    isLive: false,
    comingSoon: 'Em Breve',
  },
];

const CountrySelector: React.FC = () => {
  const handleRegionClick = (region: RegionOption) => {
    // Navigate to the regional domain
    window.location.href = region.domain;
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0A1F1C]">
      {/* Background decorative elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-teal-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-12">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <img 
            src={hbLogo} 
            alt="Healing Buds" 
            className="h-14 w-auto sm:h-16"
          />
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12 text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-2 text-emerald-400">
            <MapPin className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-wider">
              Select Your Region
            </span>
          </div>
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">
            Where are you located?
          </h1>
          <p className="mt-3 text-emerald-100/60">
            Choose your region to access localized services and support
          </p>
        </motion.div>

        {/* Region Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid w-full max-w-2xl gap-4 sm:grid-cols-2"
        >
          {regions.map((region, index) => (
            <motion.button
              key={region.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              onClick={() => handleRegionClick(region)}
              className={`group relative flex items-center gap-4 rounded-2xl border p-5 text-left transition-all ${
                region.isLive
                  ? 'border-[#1F4D47] bg-[#11302C] hover:border-emerald-400/50 hover:bg-[#153832]'
                  : 'border-[#1F4D47]/50 bg-[#11302C]/50'
              }`}
            >
              {/* Flag */}
              <span className="text-4xl">{region.flag}</span>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">{region.name}</span>
                  {region.isLive ? (
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-400">
                      Live
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-400">
                      <Clock className="h-3 w-3" />
                      {region.comingSoon}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-emerald-100/50">
                  {region.isLive ? 'Access full services' : 'Join the waitlist'}
                </p>
              </div>

              {/* Arrow */}
              <ArrowRight className={`h-5 w-5 transition-transform ${
                region.isLive 
                  ? 'text-emerald-400 group-hover:translate-x-1' 
                  : 'text-emerald-100/30'
              }`} />
            </motion.button>
          ))}
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-12 text-center text-sm text-emerald-100/40"
        >
          Medical cannabis services are subject to local regulations
        </motion.p>
      </div>
    </div>
  );
};

export default CountrySelector;

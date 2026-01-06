import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronUp, RotateCcw, Check } from 'lucide-react';
import { useRegionGate, OPERATIONAL_COUNTRIES, PRELAUNCH_COUNTRIES } from '@/hooks/useRegionGate';

const regions = [
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', type: 'operational' as const },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', type: 'operational' as const },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', type: 'prelaunch' as const },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', type: 'prelaunch' as const },
  { code: 'GLOBAL', name: 'Global', flag: '🌍', type: 'global' as const },
];

export const RegionDevTools: React.FC = () => {
  const { countryCode, isDevMode, overrideCountry, setOverrideCountry, resetOverride } = useRegionGate();
  const [isExpanded, setIsExpanded] = useState(false);

  // Only show in dev mode
  if (!isDevMode) {
    return null;
  }

  const currentRegion = regions.find(r => r.code === countryCode) || regions[0];
  const isOverridden = overrideCountry !== null;

  // Positioned top-left to avoid footer overlap
  return (
    <div className="fixed top-20 left-4 z-[10001]">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 w-56 rounded-xl bg-gray-900/95 backdrop-blur-lg border border-white/10 shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-3 py-2 border-b border-white/10 bg-white/5">
              <p className="text-xs font-medium text-white/60">Region DevTools</p>
            </div>

            {/* Region list */}
            <div className="p-2 space-y-1">
              {regions.map((region) => {
                const isActive = countryCode === region.code;
                const isOperational = region.type === 'operational';
                const isPrelaunch = region.type === 'prelaunch';
                
                return (
                  <button
                    key={region.code}
                    onClick={() => {
                      setOverrideCountry(region.code);
                      setIsExpanded(false);
                      // Force page reload to apply changes
                      window.location.reload();
                    }}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors
                      ${isActive 
                        ? 'bg-white/15 text-white' 
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    <span className="text-lg">{region.flag}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{region.name}</p>
                      <p className={`text-[10px] uppercase tracking-wider ${
                        isOperational ? 'text-emerald-400' :
                        isPrelaunch ? 'text-amber-400' :
                        'text-blue-400'
                      }`}>
                        {region.type}
                      </p>
                    </div>
                    {isActive && (
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Reset button */}
            {isOverridden && (
              <div className="px-2 pb-2">
                <button
                  onClick={() => {
                    resetOverride();
                    setIsExpanded(false);
                    window.location.reload();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset to Domain
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium shadow-lg transition-colors
          ${isOverridden 
            ? 'bg-amber-500 text-amber-950' 
            : 'bg-gray-800/90 text-white/80 hover:bg-gray-700/90'
          }
          backdrop-blur-lg border border-white/10
        `}
      >
        <span className="text-base">{currentRegion.flag}</span>
        <span className="hidden sm:inline">{currentRegion.code}</span>
        {isOverridden && (
          <span className="text-[10px] uppercase bg-amber-600/50 px-1.5 py-0.5 rounded-full">
            Override
          </span>
        )}
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronUp className="w-4 h-4" />
        </motion.div>
      </motion.button>
    </div>
  );
};

export default RegionDevTools;

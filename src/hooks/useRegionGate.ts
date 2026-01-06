import { useState, useEffect, useCallback } from 'react';

// Region classifications
const OPERATIONAL_COUNTRIES = ['ZA', 'TH'];
const PRELAUNCH_COUNTRIES = ['GB', 'PT'];

type RegionType = 'operational' | 'prelaunch' | 'global';

interface RegionGateStatus {
  countryCode: string;
  countryName: string;
  regionType: RegionType;
  isOperational: boolean;
  isPreLaunch: boolean;
  isGlobal: boolean;
  hasJoinedWaitlist: boolean;
  hasDismissedGate: boolean;
  shouldShowGate: boolean;
  shouldShowCountrySelector: boolean;
  dismissGate: () => void;
  markWaitlistJoined: (email: string) => void;
  // DevTools support
  overrideCountry: string | null;
  setOverrideCountry: (code: string | null) => void;
  isDevMode: boolean;
  resetOverride: () => void;
}

const STORAGE_KEYS = {
  WAITLIST_JOINED: 'hb_waitlist_joined',
  GATE_DISMISSED: 'hb_gate_dismissed',
  WAITLIST_COUNTRY: 'hb_waitlist_country',
  WAITLIST_EMAIL: 'hb_waitlist_email',
  REGION_OVERRIDE: 'hb_region_override',
};

const countryNames: Record<string, string> = {
  ZA: 'South Africa',
  TH: 'Thailand',
  GB: 'United Kingdom',
  PT: 'Portugal',
  GLOBAL: 'Global',
};

// Get region type from country code
const getRegionType = (countryCode: string): RegionType => {
  if (OPERATIONAL_COUNTRIES.includes(countryCode)) return 'operational';
  if (PRELAUNCH_COUNTRIES.includes(countryCode)) return 'prelaunch';
  return 'global';
};

// Detect region from domain - runs synchronously
const getRegionFromDomain = (): { countryCode: string; regionType: RegionType } => {
  if (typeof window === 'undefined') {
    return { countryCode: 'ZA', regionType: 'operational' };
  }

  const hostname = window.location.hostname;
  const urlParams = new URLSearchParams(window.location.search);
  
  // Check URL param override first (for testing via ?region=GB)
  const regionParam = urlParams.get('region')?.toUpperCase();
  if (regionParam && (OPERATIONAL_COUNTRIES.includes(regionParam) || PRELAUNCH_COUNTRIES.includes(regionParam) || regionParam === 'GLOBAL')) {
    return { countryCode: regionParam, regionType: getRegionType(regionParam) };
  }

  // Check sessionStorage override (for DevTools)
  const storedOverride = sessionStorage.getItem(STORAGE_KEYS.REGION_OVERRIDE);
  if (storedOverride) {
    return { countryCode: storedOverride, regionType: getRegionType(storedOverride) };
  }

  // Lovable staging/preview domains → South Africa (operational for testing)
  if (hostname.includes('lovable.app') || hostname.includes('lovable.dev')) {
    return { countryCode: 'ZA', regionType: 'operational' };
  }

  // Check specific country TLDs
  if (hostname.endsWith('.pt') || hostname.includes('.pt.')) {
    return { countryCode: 'PT', regionType: 'prelaunch' };
  }
  if (hostname.endsWith('.co.uk') || hostname.includes('.co.uk.')) {
    return { countryCode: 'GB', regionType: 'prelaunch' };
  }
  if (hostname.endsWith('.co.za') || hostname.includes('.co.za.')) {
    return { countryCode: 'ZA', regionType: 'operational' };
  }
  if (hostname.endsWith('.co.th') || hostname.includes('.co.th.')) {
    return { countryCode: 'TH', regionType: 'operational' };
  }

  // Global domains
  if (
    hostname === 'healingbuds.com' ||
    hostname === 'www.healingbuds.com' ||
    hostname.endsWith('.global')
  ) {
    return { countryCode: 'GLOBAL', regionType: 'global' };
  }

  // Default to South Africa (operational)
  return { countryCode: 'ZA', regionType: 'operational' };
};

// Get initial state from localStorage
const getStorageFlag = (key: string): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(key) === 'true';
};

// Check if dev mode is enabled
const isDevModeEnabled = (): boolean => {
  if (typeof window === 'undefined') return false;
  const urlParams = new URLSearchParams(window.location.search);
  return import.meta.env.DEV || urlParams.get('dev') === 'true';
};

export const useRegionGate = (): RegionGateStatus => {
  const [region, setRegion] = useState(() => getRegionFromDomain());
  const [hasJoinedWaitlist, setHasJoinedWaitlist] = useState(() => 
    getStorageFlag(STORAGE_KEYS.WAITLIST_JOINED)
  );
  const [hasDismissedGate, setHasDismissedGate] = useState(() => 
    getStorageFlag(STORAGE_KEYS.GATE_DISMISSED)
  );
  const [overrideCountry, setOverrideState] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem(STORAGE_KEYS.REGION_OVERRIDE);
  });
  const [isDevMode] = useState(() => isDevModeEnabled());

  const { countryCode, regionType } = region;

  const isOperational = OPERATIONAL_COUNTRIES.includes(countryCode);
  const isPreLaunch = PRELAUNCH_COUNTRIES.includes(countryCode);
  const isGlobal = regionType === 'global';

  // For stealth mode, gate ALWAYS shows for pre-launch (no dismissal possible)
  const shouldShowGate = isPreLaunch;
  const shouldShowCountrySelector = isGlobal;

  const dismissGate = useCallback(() => {
    // No-op in stealth mode - gate cannot be dismissed
    console.log('[RegionGate] Dismiss attempted but blocked in stealth mode');
  }, []);

  const markWaitlistJoined = useCallback((email: string) => {
    localStorage.setItem(STORAGE_KEYS.WAITLIST_JOINED, 'true');
    localStorage.setItem(STORAGE_KEYS.WAITLIST_COUNTRY, countryCode);
    localStorage.setItem(STORAGE_KEYS.WAITLIST_EMAIL, email);
    setHasJoinedWaitlist(true);
  }, [countryCode]);

  const setOverrideCountry = useCallback((code: string | null) => {
    if (code) {
      sessionStorage.setItem(STORAGE_KEYS.REGION_OVERRIDE, code);
      setOverrideState(code);
      setRegion({ countryCode: code, regionType: getRegionType(code) });
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.REGION_OVERRIDE);
      setOverrideState(null);
      // Re-detect from domain
      setRegion(getRegionFromDomain());
    }
  }, []);

  const resetOverride = useCallback(() => {
    setOverrideCountry(null);
    // Also clear waitlist state for testing
    localStorage.removeItem(STORAGE_KEYS.WAITLIST_JOINED);
    localStorage.removeItem(STORAGE_KEYS.GATE_DISMISSED);
    setHasJoinedWaitlist(false);
    setHasDismissedGate(false);
  }, [setOverrideCountry]);

  // Listen for URL param changes (for testing)
  useEffect(() => {
    const handlePopState = () => {
      const newRegion = getRegionFromDomain();
      setRegion(newRegion);
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return {
    countryCode,
    countryName: countryNames[countryCode] || 'Global',
    regionType,
    isOperational,
    isPreLaunch,
    isGlobal,
    hasJoinedWaitlist,
    hasDismissedGate,
    shouldShowGate,
    shouldShowCountrySelector,
    dismissGate,
    markWaitlistJoined,
    overrideCountry,
    setOverrideCountry,
    isDevMode,
    resetOverride,
  };
};

export { OPERATIONAL_COUNTRIES, PRELAUNCH_COUNTRIES, getRegionFromDomain };

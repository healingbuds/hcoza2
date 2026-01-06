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
}

const STORAGE_KEYS = {
  WAITLIST_JOINED: 'hb_waitlist_joined',
  GATE_DISMISSED: 'hb_gate_dismissed',
  WAITLIST_COUNTRY: 'hb_waitlist_country',
  WAITLIST_EMAIL: 'hb_waitlist_email',
};

const countryNames: Record<string, string> = {
  ZA: 'South Africa',
  TH: 'Thailand',
  GB: 'United Kingdom',
  PT: 'Portugal',
  GLOBAL: 'Global',
};

// Detect region from domain - runs synchronously
const getRegionFromDomain = (): { countryCode: string; regionType: RegionType } => {
  if (typeof window === 'undefined') {
    return { countryCode: 'ZA', regionType: 'operational' };
  }

  const hostname = window.location.hostname;

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

export const useRegionGate = (): RegionGateStatus => {
  const [region] = useState(() => getRegionFromDomain());
  const [hasJoinedWaitlist, setHasJoinedWaitlist] = useState(() => 
    getStorageFlag(STORAGE_KEYS.WAITLIST_JOINED)
  );
  const [hasDismissedGate, setHasDismissedGate] = useState(() => 
    getStorageFlag(STORAGE_KEYS.GATE_DISMISSED)
  );

  const { countryCode, regionType } = region;

  const isOperational = OPERATIONAL_COUNTRIES.includes(countryCode);
  const isPreLaunch = PRELAUNCH_COUNTRIES.includes(countryCode);
  const isGlobal = regionType === 'global';

  const shouldShowGate = isPreLaunch && !hasJoinedWaitlist && !hasDismissedGate;
  const shouldShowCountrySelector = isGlobal;

  const dismissGate = useCallback(() => {
    localStorage.setItem(STORAGE_KEYS.GATE_DISMISSED, 'true');
    setHasDismissedGate(true);
  }, []);

  const markWaitlistJoined = useCallback((email: string) => {
    localStorage.setItem(STORAGE_KEYS.WAITLIST_JOINED, 'true');
    localStorage.setItem(STORAGE_KEYS.WAITLIST_COUNTRY, countryCode);
    localStorage.setItem(STORAGE_KEYS.WAITLIST_EMAIL, email);
    setHasJoinedWaitlist(true);
  }, [countryCode]);

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
  };
};

export { OPERATIONAL_COUNTRIES, PRELAUNCH_COUNTRIES, getRegionFromDomain };

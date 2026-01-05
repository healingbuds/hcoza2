/**
 * Password Security Utilities
 * Implements HaveIBeenPwned API integration using k-anonymity
 * to check if passwords have been leaked in data breaches
 */

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4; // 0=very weak, 4=very strong
  label: 'veryWeak' | 'weak' | 'medium' | 'strong' | 'veryStrong';
  feedback: string[];
}

export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
  strength: PasswordStrength;
}

export interface PwnedResult {
  isPwned: boolean;
  count: number;
  error?: string;
}

/**
 * Generate SHA-1 hash using Web Crypto API
 */
async function sha1(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

/**
 * Check password against HaveIBeenPwned API using k-anonymity
 * Only sends the first 5 characters of the SHA-1 hash
 * The full password never leaves the browser
 */
export async function checkPasswordPwned(password: string): Promise<PwnedResult> {
  try {
    const hash = await sha1(password);
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5);

    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: {
        'Add-Padding': 'true', // Adds random padding for extra privacy
      },
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const text = await response.text();
    const lines = text.split('\n');

    for (const line of lines) {
      const [hashSuffix, count] = line.split(':');
      if (hashSuffix.trim() === suffix) {
        return {
          isPwned: true,
          count: parseInt(count.trim(), 10) || 0,
        };
      }
    }

    return { isPwned: false, count: 0 };
  } catch (error) {
    console.error('Error checking password against HIBP:', error);
    return {
      isPwned: false,
      count: 0,
      error: 'Unable to check password security',
    };
  }
}

/**
 * Check password strength based on character requirements
 */
export function checkPasswordStrength(password: string): PasswordStrength {
  const checks = {
    length: password.length >= 8,
    lengthStrong: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const feedback: string[] = [];

  if (!checks.length) feedback.push('minLength');
  if (!checks.uppercase) feedback.push('uppercase');
  if (!checks.lowercase) feedback.push('lowercase');
  if (!checks.number) feedback.push('number');
  if (!checks.special) feedback.push('special');

  // Calculate score
  let rawScore = 0;
  if (checks.length) rawScore++;
  if (checks.lengthStrong) rawScore++;
  if (checks.uppercase && checks.lowercase) rawScore++;
  if (checks.number) rawScore++;
  if (checks.special) rawScore++;

  // Normalize to 0-4
  const score = Math.min(4, rawScore) as 0 | 1 | 2 | 3 | 4;

  const labels: Record<number, PasswordStrength['label']> = {
    0: 'veryWeak',
    1: 'weak',
    2: 'medium',
    3: 'strong',
    4: 'veryStrong',
  };

  return {
    score,
    label: labels[score],
    feedback,
  };
}

/**
 * Validate password with all requirements
 * Does NOT check HIBP - use checkPasswordPwned separately for async check
 */
export function validatePassword(password: string): PasswordValidation {
  const strength = checkPasswordStrength(password);
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('minLength');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('uppercase');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('lowercase');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('number');
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('special');
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
}

/**
 * Format breach count for display
 */
export function formatBreachCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

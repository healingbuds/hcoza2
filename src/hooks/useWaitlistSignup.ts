import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface WaitlistSignupParams {
  email: string;
  countryCode: string;
  countryName: string;
  source: 'prelaunch_gate' | 'footer_cta' | 'country_selector';
}

interface UseWaitlistSignupReturn {
  signup: (params: WaitlistSignupParams) => Promise<{ success: boolean; error?: string; alreadySignedUp?: boolean }>;
  isLoading: boolean;
}

export function useWaitlistSignup(): UseWaitlistSignupReturn {
  const [isLoading, setIsLoading] = useState(false);

  const signup = async (params: WaitlistSignupParams) => {
    setIsLoading(true);
    
    try {
      // Insert into waitlist_signups table
      const { error: insertError } = await supabase
        .from('waitlist_signups')
        .insert({
          email: params.email.toLowerCase().trim(),
          country_code: params.countryCode,
          country_name: params.countryName,
          source: params.source,
          user_agent: navigator.userAgent,
          referrer: document.referrer || null,
        });

      // Handle duplicate email gracefully
      if (insertError) {
        if (insertError.code === '23505') { // Unique constraint violation
          console.log('[Waitlist] Email already signed up:', params.email);
          return { success: true, alreadySignedUp: true };
        }
        console.error('[Waitlist] Insert error:', insertError);
        return { success: false, error: 'Failed to join waitlist. Please try again.' };
      }

      console.log('[Waitlist] Signup successful:', params.email);

      // Send confirmation email via edge function
      try {
        const { error: emailError } = await supabase.functions.invoke('send-client-email', {
          body: {
            type: 'waitlist-welcome',
            email: params.email.toLowerCase().trim(),
            name: params.email.split('@')[0], // Use email prefix as name
            region: params.countryCode,
            countryName: params.countryName,
          },
        });

        if (emailError) {
          console.error('[Waitlist] Email send error:', emailError);
          // Don't fail the signup if email fails - just log it
        } else {
          console.log('[Waitlist] Confirmation email sent');
          
          // Update email_sent_at timestamp (best effort, don't block on this)
          supabase
            .from('waitlist_signups')
            .update({ email_sent_at: new Date().toISOString() })
            .eq('email', params.email.toLowerCase().trim())
            .eq('country_code', params.countryCode)
            .then(() => {});
        }
      } catch (emailErr) {
        console.error('[Waitlist] Email function error:', emailErr);
        // Don't fail signup if email fails
      }

      return { success: true };
    } catch (err) {
      console.error('[Waitlist] Unexpected error:', err);
      return { success: false, error: 'Something went wrong. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  return { signup, isLoading };
}

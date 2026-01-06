import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const inquiryTypes = ['eligibility', 'existing_patient', 'referral', 'general'] as const;

export const contactFormSchema = z.object({
  inquiryType: z.enum(inquiryTypes, {
    required_error: "Please select an inquiry type",
  }),
  fullName: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .trim(),
  email: z.string()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters")
    .trim(),
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number must be less than 20 characters")
    .regex(/^[\d\s\-+()]+$/, "Please enter a valid phone number"),
  medicalContext: z.string()
    .max(500, "Please keep your message under 500 characters")
    .optional(),
  termsConsent: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the Terms of Service and Privacy Policy" }),
  }),
  contactConsent: z.literal(true, {
    errorMap: () => ({ message: "You must consent to be contacted by our team" }),
  }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export type FormState = 'idle' | 'submitting' | 'success' | 'error';

export const inquiryTypeLabels: Record<typeof inquiryTypes[number], string> = {
  eligibility: 'Check Eligibility',
  existing_patient: 'Existing Patient Support',
  referral: 'Doctor or Clinic Referral',
  general: 'General Questions',
};

interface UseContactEligibilityFormProps {
  source?: string;
  countryCode?: string;
  onSuccess?: () => void;
}

export function useContactEligibilityForm({
  source = 'homepage',
  countryCode = 'ZA',
  onSuccess,
}: UseContactEligibilityFormProps = {}) {
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      inquiryType: 'eligibility',
      fullName: '',
      email: '',
      phone: '',
      medicalContext: '',
      termsConsent: undefined,
      contactConsent: undefined,
    },
    mode: 'onBlur',
  });

  const inquiryType = form.watch('inquiryType');
  const showMedicalContext = inquiryType === 'eligibility';

  const onSubmit = useCallback(async (data: ContactFormData) => {
    setFormState('submitting');
    setErrorMessage(null);

    try {
      const { data: responseData, error } = await supabase.functions.invoke('send-eligibility-inquiry', {
        body: {
          ...data,
          source,
          countryCode,
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to submit inquiry');
      }

      if (responseData?.error) {
        throw new Error(responseData.error);
      }

      setFormState('success');
      toast({
        title: "Inquiry Submitted",
        description: "A patient care specialist will contact you within 24 hours.",
      });
      onSuccess?.();
    } catch (err) {
      console.error('Form submission error:', err);
      setFormState('error');
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setErrorMessage(message);
      toast({
        title: "Submission Failed",
        description: message,
        variant: "destructive",
      });
    }
  }, [source, countryCode, toast, onSuccess]);

  const reset = useCallback(() => {
    form.reset();
    setFormState('idle');
    setErrorMessage(null);
  }, [form]);

  return {
    form,
    formState,
    errorMessage,
    showMedicalContext,
    inquiryType,
    onSubmit: form.handleSubmit(onSubmit),
    reset,
  };
}

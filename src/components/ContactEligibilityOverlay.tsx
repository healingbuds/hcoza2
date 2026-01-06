import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Shield, CheckCircle, Loader2, AlertCircle, Truck, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useContactEligibilityForm, inquiryTypeLabels } from '@/hooks/useContactEligibilityForm';
import { Link } from 'react-router-dom';

interface ContactEligibilityOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source?: string;
}
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 20,
  },
};

const successCheckVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
  },
};

export function ContactEligibilityOverlay({ 
  open, 
  onOpenChange,
  source = 'homepage',
}: ContactEligibilityOverlayProps) {
  const containerRef = useFocusTrap(open);
  
  const {
    form,
    formState,
    errorMessage,
    showMedicalContext,
    onSubmit,
    reset,
  } = useContactEligibilityForm({ source });

  // Handle escape key
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && open) {
      onOpenChange(false);
    }
  }, [open, onOpenChange]);

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [handleEscape]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleClose = useCallback(() => {
    onOpenChange(false);
    // Reset form after animation completes
    setTimeout(() => reset(), 300);
  }, [onOpenChange, reset]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariants}
          transition={{ duration: 0.25 }}
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-overlay-title"
        >
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Form Card */}
          <motion.div
            ref={containerRef}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-card rounded-2xl shadow-2xl border border-border/50"
            variants={cardVariants}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {formState === 'success' ? (
              <SuccessState onClose={handleClose} />
            ) : (
              <FormContent
                form={form}
                formState={formState}
                errorMessage={errorMessage}
                showMedicalContext={showMedicalContext}
                onSubmit={onSubmit}
                onClose={handleClose}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface FormContentProps {
  form: ReturnType<typeof useContactEligibilityForm>['form'];
  formState: ReturnType<typeof useContactEligibilityForm>['formState'];
  errorMessage: string | null;
  showMedicalContext: boolean;
  onSubmit: () => void;
  onClose: () => void;
}

function FormContent({ form, formState, errorMessage, showMedicalContext, onSubmit, onClose }: FormContentProps) {
  const isSubmitting = formState === 'submitting';

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          {/* Security Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
            <Lock className="w-3 h-3" />
            Secure & Confidential
          </div>
          
          <h2 id="contact-overlay-title" className="text-2xl font-semibold text-foreground">
            Begin Your Patient Journey
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Your information is protected. A specialist will contact you within 24 hours.
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-muted transition-colors -mr-2 -mt-2"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Error Message */}
      {formState === 'error' && errorMessage && (
        <div className="flex items-center gap-2 p-3 mb-6 rounded-lg bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {errorMessage}
        </div>
      )}

      {/* Form */}
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-5">
          {/* Inquiry Type */}
          <FormField
            control={form.control}
            name="inquiryType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What brings you to Healing Buds today?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(inquiryTypeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Name and Email Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Phone Number
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Lock className="w-3 h-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Your information is protected and confidential</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+27 00 000 0000" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Medical Context (Conditional) */}
          <AnimatePresence mode="wait">
            {showMedicalContext && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FormField
                  control={form.control}
                  name="medicalContext"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medical Context (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="To help our medical team, you may share what condition you are seeking treatment for..."
                          className="min-h-[100px] resize-none"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Consent Checkboxes */}
          <div className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="termsConsent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <Label className="text-sm font-normal text-muted-foreground cursor-pointer">
                      I agree to the{' '}
                      <Link to="/terms" className="text-primary hover:underline" target="_blank">
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link to="/privacy" className="text-primary hover:underline" target="_blank">
                        Privacy Policy
                      </Link>
                      . I confirm I am over 18.
                    </Label>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactConsent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <Label className="text-sm font-normal text-muted-foreground cursor-pointer">
                      I consent to be contacted by a Healing Buds patient care specialist via email or phone regarding this inquiry.
                    </Label>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            size="lg"
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium h-12"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Secure Inquiry'
            )}
          </Button>
        </form>
      </Form>

      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-border">
        <TrustBadge icon={Award} label="EU GMP Certified" />
        <TrustBadge icon={Shield} label="Secure & Compliant" />
        <TrustBadge icon={Truck} label="Discreet Delivery" />
      </div>
    </div>
  );
}

function TrustBadge({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <Icon className="w-4 h-4 text-primary" />
      <span className="text-[10px] text-muted-foreground whitespace-nowrap">{label}</span>
    </div>
  );
}

function SuccessState({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-8 sm:p-12 text-center">
      <motion.div
        className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center"
        variants={successCheckVariants}
        initial="hidden"
        animate="visible"
      >
        <CheckCircle className="w-10 h-10 text-white" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-2xl font-semibold text-foreground mb-3">
          Thank You for Your Trust
        </h3>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
          A patient care specialist will contact you confidentially within 24 hours.
        </p>

        <Button onClick={onClose} variant="outline" size="lg">
          Close
        </Button>
      </motion.div>
    </div>
  );
}

export default ContactEligibilityOverlay;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle, Loader2, Sparkles } from 'lucide-react';
import { useRegionGate } from '@/hooks/useRegionGate';
import hbLogo from '@/assets/hb-logo-white.png';

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

// Localized content for each pre-launch country
const localizedContent: Record<string, {
  headline: string;
  subtext: string;
  placeholder: string;
  button: string;
  success: string;
  successSub: string;
  preview: string;
}> = {
  GB: {
    headline: 'Coming Soon to the United Kingdom',
    subtext: 'We\'re bringing medical cannabis care to the UK. Join the waitlist to be first in line.',
    placeholder: 'Enter your email',
    button: 'Join Waitlist',
    success: 'You\'re planted!',
    successSub: 'We\'ll notify you when we launch in the UK.',
    preview: 'Preview site anyway',
  },
  PT: {
    headline: 'Em Breve em Portugal',
    subtext: 'Estamos a trazer cuidados de canábis medicinal para Portugal. Junte-se à lista de espera.',
    placeholder: 'Introduza o seu email',
    button: 'Entrar na Lista',
    success: 'Está plantado!',
    successSub: 'Iremos notificá-lo quando lançarmos em Portugal.',
    preview: 'Ver o site mesmo assim',
  },
};

const defaultContent = localizedContent.GB;

export const PreLaunchGate: React.FC = () => {
  const { countryCode, shouldShowGate, dismissGate, markWaitlistJoined } = useRegionGate();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const content = localizedContent[countryCode] || defaultContent;

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      // Simulate API call - in production, this would save to database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      markWaitlistJoined(email);
      setStatus('success');
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (status === 'error') {
      setStatus('idle');
      setErrorMessage('');
    }
  };

  if (!shouldShowGate) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4, ease: 'easeOut' }}
          className="relative mx-4 w-full max-w-lg rounded-3xl border border-[#1F4D47] bg-[#11302C] p-8 shadow-2xl sm:p-10"
        >
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img 
              src={hbLogo} 
              alt="Healing Buds" 
              className="h-12 w-auto"
            />
          </div>

          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
              >
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h2 className="mb-2 text-2xl font-semibold text-white">
                  {content.success}
                </h2>
                <p className="mb-6 text-emerald-100/70">
                  {content.successSub}
                </p>
                <button
                  onClick={dismissGate}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 px-6 py-3 font-medium text-white shadow-lg transition-all hover:shadow-emerald-500/25"
                >
                  <Sparkles className="h-4 w-4" />
                  Continue to Site
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {/* Headline */}
                <h1 className="mb-3 text-center text-2xl font-semibold text-white sm:text-3xl">
                  {content.headline}
                </h1>
                <p className="mb-8 text-center text-emerald-100/70">
                  {content.subtext}
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                      <Mail className="h-5 w-5 text-emerald-100/50" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={handleInputChange}
                      placeholder={content.placeholder}
                      className="w-full rounded-full border border-[#1F4D47] bg-[#0A1F1C] py-4 pl-12 pr-4 text-white placeholder:text-emerald-100/40 focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                      disabled={status === 'loading'}
                    />
                  </div>

                  {status === 'error' && errorMessage && (
                    <p className="text-center text-sm text-red-400">
                      {errorMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading' || !email}
                    className="w-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 py-4 font-medium text-white shadow-lg transition-all hover:shadow-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {status === 'loading' ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Joining...
                      </span>
                    ) : (
                      content.button
                    )}
                  </button>
                </form>

                {/* Preview link */}
                <div className="mt-6 text-center">
                  <button
                    onClick={dismissGate}
                    className="text-sm text-emerald-100/50 underline-offset-4 transition-colors hover:text-emerald-100/80 hover:underline"
                  >
                    {content.preview}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PreLaunchGate;

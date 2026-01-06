import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle, Loader2, ArrowRight, Leaf } from 'lucide-react';
import { useRegionGate } from '@/hooks/useRegionGate';
import { useWaitlistSignup } from '@/hooks/useWaitlistSignup';
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
}> = {
  GB: {
    headline: 'We are preparing for launch in the United Kingdom',
    subtext: 'Join our exclusive early access list to be first in line when we open doors.',
    placeholder: 'Enter your email for early access & launch updates',
    button: 'Secure Early Access',
    success: "You're on the list",
    successSub: "We'll invite you in soon.",
  },
  PT: {
    headline: 'Estamos a preparar o lançamento em Portugal',
    subtext: 'Junte-se à nossa lista de acesso antecipado exclusiva para ser o primeiro quando abrirmos as portas.',
    placeholder: 'Introduza o seu email para acesso antecipado',
    button: 'Garantir Acesso Antecipado',
    success: 'Está na lista',
    successSub: 'Iremos convidá-lo em breve.',
  },
};

const defaultContent = localizedContent.GB;

// Growing bud animation component
const GrowingBudAnimation: React.FC = () => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    className="relative flex items-center justify-center"
  >
    {/* Outer glow rings */}
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1.5, opacity: [0, 0.3, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
      className="absolute h-24 w-24 rounded-full bg-emerald-400/30"
    />
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1.8, opacity: [0, 0.2, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
      className="absolute h-24 w-24 rounded-full bg-teal-400/20"
    />
    
    {/* Main icon container */}
    <motion.div
      initial={{ scale: 0.8 }}
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 shadow-2xl shadow-emerald-500/40"
    >
      <CheckCircle className="h-10 w-10 text-white" />
    </motion.div>
    
    {/* Floating particles */}
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ 
          y: 0, 
          x: 0,
          opacity: 0,
          scale: 0 
        }}
        animate={{ 
          y: [-10, -40 - (i * 10)],
          x: [(i % 2 === 0 ? -1 : 1) * (10 + i * 5), (i % 2 === 0 ? 1 : -1) * (15 + i * 3)],
          opacity: [0, 1, 0],
          scale: [0, 1, 0.5]
        }}
        transition={{ 
          duration: 2 + (i * 0.3),
          repeat: Infinity,
          delay: i * 0.2,
          ease: 'easeOut'
        }}
        className="absolute"
      >
        <Leaf className="h-3 w-3 text-emerald-400/60" />
      </motion.div>
    ))}
  </motion.div>
);

// Animated leaf watermark
const LeafWatermark: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Large subtle leaf in background */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.03 }}
      transition={{ duration: 2 }}
      className="absolute -right-20 -bottom-20"
    >
      <svg width="600" height="600" viewBox="0 0 100 100" className="text-emerald-400">
        <path
          fill="currentColor"
          d="M50 5C50 5 20 25 20 55C20 75 35 90 50 95C65 90 80 75 80 55C80 25 50 5 50 5ZM50 85C40 80 30 70 30 55C30 35 45 20 50 15C55 20 70 35 70 55C70 70 60 80 50 85Z"
        />
        <path
          fill="currentColor"
          d="M50 20L50 80M35 35L50 50M65 35L50 50M35 55L50 70M65 55L50 70"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.5"
        />
      </svg>
    </motion.div>
    
    {/* Floating organic blur spots */}
    <motion.div
      animate={{
        x: [0, 30, 0],
        y: [0, -20, 0],
        opacity: [0.08, 0.12, 0.08],
      }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl"
    />
    <motion.div
      animate={{
        x: [0, -20, 0],
        y: [0, 30, 0],
        opacity: [0.06, 0.1, 0.06],
      }}
      transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-teal-500/10 blur-3xl"
    />
  </div>
);

export const PreLaunchGate: React.FC = () => {
  const { countryCode, isPreLaunch, markWaitlistJoined, hasJoinedWaitlist } = useRegionGate();
  const { signup, isLoading } = useWaitlistSignup();
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
      setErrorMessage(countryCode === 'PT' 
        ? 'Por favor, introduza um endereço de email válido' 
        : 'Please enter a valid email address');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    const result = await signup({
      email,
      countryCode,
      countryName: countryCode === 'PT' ? 'Portugal' : 'United Kingdom',
      source: 'prelaunch_gate',
    });
    
    if (result.success) {
      markWaitlistJoined(email);
      setStatus('success');
    } else {
      setErrorMessage(result.error || 'Something went wrong. Please try again.');
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

  // Gate shows for ALL pre-launch regions - no escape
  if (!isPreLaunch) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0F3935 0%, #081C1B 100%)',
      }}
    >
      {/* Animated background elements */}
      <LeafWatermark />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative mx-4 w-full max-w-lg"
      >
        {/* Glassmorphism card with emerald glow */}
        <div 
          className="relative rounded-3xl border border-emerald-500/30 p-8 sm:p-10 shadow-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.15), 0 0 0 1px rgba(16, 185, 129, 0.1)',
          }}
        >
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <motion.img 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              src={hbLogo} 
              alt="Healing Buds" 
              className="h-14 w-auto"
            />
          </div>

          <AnimatePresence mode="wait">
            {(status === 'success' || hasJoinedWaitlist) ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
              >
                <div className="mb-6 flex justify-center">
                  <GrowingBudAnimation />
                </div>
                <h2 className="mb-3 text-2xl font-semibold text-white sm:text-3xl">
                  {content.success}
                </h2>
                <p className="text-lg text-emerald-100/80">
                  {content.successSub}
                </p>
                
                {/* Subtle reassurance message */}
                <div className="mt-8 rounded-xl bg-white/5 px-6 py-4 border border-white/10">
                  <p className="text-sm text-emerald-100/60">
                    {countryCode === 'PT' 
                      ? 'Receberá um email de confirmação em breve.'
                      : "You'll receive a confirmation email shortly."}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {/* Headline */}
                <motion.h1 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mb-4 text-center text-2xl font-semibold text-white sm:text-3xl leading-tight"
                >
                  {content.headline}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mb-8 text-center text-emerald-100/70 text-base"
                >
                  {content.subtext}
                </motion.p>

                {/* Form */}
                <motion.form 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  onSubmit={handleSubmit} 
                  className="space-y-4"
                >
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                      <Mail className="h-5 w-5 text-emerald-400/60" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={handleInputChange}
                      placeholder={content.placeholder}
                      className="w-full rounded-xl border border-emerald-500/30 bg-white/5 py-4 pl-12 pr-4 text-white placeholder:text-emerald-100/40 focus:border-emerald-400/60 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all duration-200"
                      disabled={status === 'loading'}
                      autoComplete="email"
                    />
                  </div>

                  {status === 'error' && errorMessage && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center text-sm text-red-400"
                    >
                      {errorMessage}
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading' || isLoading || !email}
                    className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-4 px-6 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-teal-400 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        {countryCode === 'PT' ? 'A processar...' : 'Processing...'}
                      </>
                    ) : (
                      <>
                        {content.button}
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </motion.form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default PreLaunchGate;

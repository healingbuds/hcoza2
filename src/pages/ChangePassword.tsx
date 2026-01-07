import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Header from '@/layout/Header';
import Footer from '@/components/Footer';
import HBIcon from '@/components/HBIcon';
import HBLoader from '@/components/HBLoader';
import { PasswordInput } from '@/components/PasswordInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { checkPasswordPwned, PwnedResult } from '@/lib/passwordSecurity';

const ChangePassword = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('auth');
  const { toast } = useToast();
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordBreachResult, setPasswordBreachResult] = useState<PwnedResult | null>(null);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);

  // Schema changes based on whether this is a recovery (no current password needed)
  const changePasswordSchema = z.object({
    currentPassword: isRecoveryMode 
      ? z.string().optional() 
      : z.string().min(1, t('changePassword.currentRequired', 'Current password is required')),
    newPassword: z.string().min(8, t('validationErrors.passwordMin')),
    confirmNewPassword: z.string(),
  }).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: t('validationErrors.passwordMatch'),
    path: ['confirmNewPassword'],
  }).refine((data) => isRecoveryMode || data.currentPassword !== data.newPassword, {
    message: t('changePassword.samePassword'),
    path: ['newPassword'],
  });

  type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
  });

  const confirmNewPassword = watch('confirmNewPassword');

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          setIsRecoveryMode(true);
          setUser(session?.user ?? null);
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };
    fetchUser();

    return () => subscription.unsubscribe();
  }, []);

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    setValue('newPassword', value, { shouldValidate: true });
  };

  const handleBreachCheck = (result: PwnedResult) => {
    setPasswordBreachResult(result);
  };

  const handleValidationChange = (isValid: boolean) => {
    setIsPasswordValid(isValid);
  };

  const onSubmit = async (data: ChangePasswordForm) => {
    if (!user?.email) return;

    // Block if password is breached
    if (passwordBreachResult?.isPwned) {
      toast({
        title: t('signupFailed'),
        description: t('passwordBreached'),
        variant: 'destructive',
      });
      return;
    }

    // Block if password doesn't meet requirements
    if (!isPasswordValid) {
      toast({
        title: t('signupFailed'),
        description: t('passwordRequirementsError'),
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Only verify current password if NOT in recovery mode
      if (!isRecoveryMode && data.currentPassword) {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: data.currentPassword,
        });

        if (authError) {
          toast({
            title: t('error'),
            description: t('changePassword.incorrectCurrent'),
            variant: 'destructive',
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Final breach check before updating
      const breachCheck = await checkPasswordPwned(data.newPassword);
      if (breachCheck.isPwned) {
        toast({
          title: t('signupFailed'),
          description: t('passwordBreachedCount', { count: breachCheck.count }),
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "✓ Password Updated Successfully",
        description: "Your password has been changed. Redirecting to your dashboard...",
        duration: 5000,
      });
      
      // Small delay for UX before redirect
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Password change error:', error);
      toast({
        title: t('error'),
        description: t('changePassword.updateError', 'Failed to update password. Please try again.'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <HBLoader size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4 text-center">
            <Card className="max-w-md mx-auto bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="pt-12 pb-8">
                <HBIcon size="xl" className="mx-auto mb-6 opacity-50" />
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {t('signIn', 'Sign In Required')}
                </h2>
                <p className="text-muted-foreground mb-6">
                  Please sign in to change your password.
                </p>
                <Button onClick={() => navigate('/auth')}>
                  {t('signIn')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-24 lg:pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            {!isRecoveryMode && (
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="mb-6"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('changePassword.cancel', 'Back to Dashboard')}
              </Button>
            )}

            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">
                  {isRecoveryMode 
                    ? t('changePassword.resetTitle', 'Reset Your Password')
                    : t('changePassword.title', 'Change Password')}
                </CardTitle>
                <CardDescription>
                  {isRecoveryMode
                    ? t('changePassword.resetDescription', 'Enter your new password below')
                    : t('changePassword.description', 'Update your password to keep your account secure')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Current Password - only show if not in recovery mode */}
                  {!isRecoveryMode && (
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">
                        {t('changePassword.currentPassword', 'Current Password')}
                      </Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? 'text' : 'password'}
                          {...register('currentPassword')}
                          className={errors.currentPassword ? 'border-destructive' : ''}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {errors.currentPassword && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.currentPassword.message}
                        </p>
                      )}
                    </div>
                  )}

                  {/* New Password */}
                  <PasswordInput
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    label={t('changePassword.newPassword', 'New Password')}
                    showStrength={true}
                    checkBreaches={true}
                    onBreachCheck={handleBreachCheck}
                    onValidationChange={handleValidationChange}
                    error={errors.newPassword?.message}
                  />

                  {/* Confirm New Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmNewPassword">
                      {t('changePassword.confirmNewPassword', 'Confirm New Password')}
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmNewPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...register('confirmNewPassword')}
                        className={errors.confirmNewPassword ? 'border-destructive' : ''}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.confirmNewPassword && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.confirmNewPassword.message}
                      </p>
                    )}
                    {confirmNewPassword && newPassword === confirmNewPassword && !errors.confirmNewPassword && (
                      <p className="text-sm text-primary flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        {t('changePassword.passwordsMatch', 'Passwords match')}
                      </p>
                    )}
                  </div>

                  {/* Submit Buttons */}
                  <div className={`flex gap-3 pt-4 ${isRecoveryMode ? '' : ''}`}>
                    {!isRecoveryMode && (
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => navigate('/dashboard')}
                        disabled={isSubmitting}
                      >
                        {t('changePassword.cancel', 'Cancel')}
                      </Button>
                    )}
                    <Button
                      type="submit"
                      className={isRecoveryMode ? 'w-full' : 'flex-1'}
                      disabled={isSubmitting || passwordBreachResult?.isPwned || !isPasswordValid}
                    >
                      {isSubmitting ? (
                        <>
                          <HBLoader size="sm" className="mr-2" />
                          {t('changePassword.updating', 'Updating...')}
                        </>
                      ) : isRecoveryMode ? (
                        t('changePassword.setNewPassword', 'Set New Password')
                      ) : (
                        t('changePassword.updateButton', 'Update Password')
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ChangePassword;

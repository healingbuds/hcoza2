import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Shield, ShieldAlert, ShieldCheck, Loader2, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  validatePassword,
  checkPasswordPwned,
  formatBreachCount,
  type PasswordStrength,
  type PwnedResult,
} from "@/lib/passwordSecurity";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  showStrength?: boolean;
  checkBreaches?: boolean;
  onBreachCheck?: (result: PwnedResult) => void;
  onValidationChange?: (isValid: boolean) => void;
  disabled?: boolean;
  id?: string;
}

export function PasswordInput({
  value,
  onChange,
  label,
  placeholder,
  error,
  showStrength = true,
  checkBreaches = true,
  onBreachCheck,
  onValidationChange,
  disabled = false,
  id = "password",
}: PasswordInputProps) {
  const { t } = useTranslation('auth');
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState<PasswordStrength | null>(null);
  const [pwnedResult, setPwnedResult] = useState<PwnedResult | null>(null);
  const [isCheckingBreach, setIsCheckingBreach] = useState(false);
  const [hasCheckedBreach, setHasCheckedBreach] = useState(false);

  // Update strength on password change
  useEffect(() => {
    if (value) {
      const validation = validatePassword(value);
      setStrength(validation.strength);
      
      // Reset breach check when password changes
      if (hasCheckedBreach) {
        setHasCheckedBreach(false);
        setPwnedResult(null);
      }
    } else {
      setStrength(null);
      setPwnedResult(null);
      setHasCheckedBreach(false);
    }
  }, [value]);

  // Notify parent of validation state
  useEffect(() => {
    if (onValidationChange && value) {
      const validation = validatePassword(value);
      const isValid = validation.isValid && (!hasCheckedBreach || !pwnedResult?.isPwned);
      onValidationChange(isValid);
    }
  }, [value, pwnedResult, hasCheckedBreach, onValidationChange]);

  // Check password breach on blur
  const handleBlur = useCallback(async () => {
    if (!checkBreaches || !value || value.length < 8 || hasCheckedBreach) return;

    setIsCheckingBreach(true);
    const result = await checkPasswordPwned(value);
    setPwnedResult(result);
    setHasCheckedBreach(true);
    setIsCheckingBreach(false);

    if (onBreachCheck) {
      onBreachCheck(result);
    }
  }, [value, checkBreaches, hasCheckedBreach, onBreachCheck]);

  const getStrengthColor = () => {
    if (!strength) return 'bg-muted';
    const colors: Record<number, string> = {
      0: 'bg-destructive',
      1: 'bg-destructive',
      2: 'bg-amber-500',
      3: 'bg-primary',
      4: 'bg-primary',
    };
    return colors[strength.score];
  };

  const getStrengthWidth = () => {
    if (!strength) return '0%';
    return `${(strength.score + 1) * 20}%`;
  };

  const getStrengthLabel = () => {
    if (!strength) return '';
    return t(`passwordStrength.${strength.label}`, strength.label);
  };

  const StrengthIcon = () => {
    if (!strength) return <Shield className="w-4 h-4 text-muted-foreground" />;
    if (strength.score <= 1) return <ShieldAlert className="w-4 h-4 text-destructive" />;
    if (strength.score === 2) return <Shield className="w-4 h-4 text-amber-500" />;
    return <ShieldCheck className="w-4 h-4 text-primary" />;
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className="text-foreground font-medium">
          {label}
        </Label>
      )}
      
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`pr-10 ${error || pwnedResult?.isPwned ? 'border-destructive focus:ring-destructive' : ''}`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {/* Strength Meter */}
      {showStrength && value && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                style={{ width: getStrengthWidth() }}
              />
            </div>
            <div className="flex items-center gap-1 text-xs">
              <StrengthIcon />
              <span className="text-muted-foreground">{getStrengthLabel()}</span>
            </div>
          </div>

          {/* Requirements Hints */}
          {strength && strength.feedback.length > 0 && (
            <div className="text-xs text-muted-foreground space-y-0.5">
              {strength.feedback.slice(0, 3).map((req) => (
                <p key={req} className="flex items-center gap-1">
                  <span className="text-amber-500">•</span>
                  {t(`passwordRequirements.${req}`, req)}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Breach Check Status */}
      {checkBreaches && (
        <>
          {isCheckingBreach && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>{t('checkingPassword', 'Checking password security...')}</span>
            </div>
          )}

          {pwnedResult?.isPwned && (
            <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-destructive">
                  {t('passwordBreached', 'This password has been found in data breaches')}
                </p>
                <p className="text-xs text-destructive/80 mt-1">
                  {`${t('passwordBreachedCount')} (${formatBreachCount(pwnedResult.count)}x)`}
                </p>
              </div>
            </div>
          )}

          {hasCheckedBreach && !pwnedResult?.isPwned && !pwnedResult?.error && (
            <div className="flex items-center gap-2 text-xs text-primary">
              <ShieldCheck className="w-3 h-3" />
              <span>{t('passwordSecure', 'Password not found in known breaches')}</span>
            </div>
          )}
        </>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}

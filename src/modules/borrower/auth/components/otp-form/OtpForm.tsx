import React, { useRef, useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputBase, Button } from '@mui/material';
import { ShieldCheck } from 'lucide-react';
import { otpSchema, type OtpFormValues } from '../../schemas/otp.schema';
import styles from './OtpForm.module.scss';

interface OtpFormProps {
  mobileNumber: string;
  onSubmit: (data: OtpFormValues) => void;
  onResend: () => void;
  isLoading?: boolean;
}

export const OtpForm: React.FC<OtpFormProps> = ({ mobileNumber, onSubmit, onResend, isLoading = false }) => {
  const [timer, setTimer] = useState(30);
  
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    mode: 'onChange',
    defaultValues: { otpCode: '' },
  });

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleResend = () => {
    if (timer === 0) {
      setTimer(30);
      onResend();
    }
  };

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (index: number, val: string, currentOtp: string, onChange: (val: string) => void) => {
    // only allow digits
    if (val && !/^\d+$/.test(val)) return;

    const otpArray = currentOtp.split('');
    // Handle paste
    if (val.length > 1) {
      const pastedData = val.slice(0, 6).split('');
      for (let i = 0; i < pastedData.length; i++) {
        otpArray[i] = pastedData[i];
      }
      onChange(otpArray.join(''));
      
      // Focus last filled or next empty
      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    // Normal typing
    otpArray[index] = val;
    const newOtp = otpArray.join('');
    onChange(newOtp);

    // Auto advance focus
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, currentOtp: string) => {
    if (e.key === 'Backspace' && !currentOtp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <ShieldCheck size={24} className={styles.shieldIcon} />
        </div>
        <h2 className={styles.title}>Verify your number</h2>
        <p className={styles.subtitle}>
          Enter the 6-digit OTP sent to <br />
          <strong>+91 {mobileNumber.slice(0, 2)}••••{mobileNumber.slice(-4)}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <Controller
          name="otpCode"
          control={control}
          render={({ field }) => (
            <div className={styles.otpGroup}>
              {Array.from({ length: 6 }).map((_, index) => (
                <InputBase
                  key={index}
                  inputRef={(el) => (inputRefs.current[index] = el)}
                  value={field.value[index] || ''}
                  onChange={(e) => handleOtpChange(index, e.target.value, field.value, field.onChange)}
                  onKeyDown={(e) => handleKeyDown(index, e, field.value)}
                  className={`${styles.otpInput} ${errors.otpCode ? styles.inputError : ''}`}
                  inputProps={{ 
                    maxLength: 6, // to allow paste
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                    'aria-label': `Digit ${index + 1}`
                  }}
                />
              ))}
            </div>
          )}
        />
        {errors.otpCode && (
          <small className={styles.errorText}>{errors.otpCode.message}</small>
        )}

        <div className={styles.resendWrapper}>
          <span className={styles.timerText}>
            {timer > 0 ? `Resend OTP in 00:${timer.toString().padStart(2, '0')}` : "Didn't receive code?"}
          </span>
          <button
            type="button"
            className={styles.resendBtn}
            disabled={timer > 0}
            onClick={handleResend}
          >
            Resend OTP
          </button>
        </div>

        <Button
          type="submit"
          variant="contained"
          disableElevation
          className={styles.submitBtn}
          disabled={!isValid || isLoading}
        >
          {isLoading ? 'Verifying...' : 'Verify & Continue'}
        </Button>
      </form>
    </div>
  );
};

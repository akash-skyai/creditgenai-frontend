import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputBase, Button } from '@mui/material';
import { Lock } from 'lucide-react';
import { phoneSchema, type PhoneFormValues } from '../../schemas/phone.schema';
import styles from './PhoneForm.module.scss';

interface PhoneFormProps {
  onSubmit: (data: PhoneFormValues) => void;
  isLoading?: boolean;
}

export const PhoneForm: React.FC<PhoneFormProps> = ({ onSubmit, isLoading = false }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    mode: 'onChange',
    defaultValues: { mobileNumber: '' },
  });

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <Lock size={24} className={styles.lockIcon} />
        </div>
        <h2 className={styles.title}>Enter Your Mobile Number</h2>
        <p className={styles.subtitle}>
          We will send a 6-digit OTP to verify your number
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.inputGroup}>
          <span className={styles.prefix}>+91</span>
          <Controller
            name="mobileNumber"
            control={control}
            render={({ field }) => (
              <InputBase
                id="mobileNumber"
                {...field}
                className={`${styles.input} ${errors.mobileNumber ? styles.inputError : ''}`}
                placeholder="98765 43210"
                inputProps={{ maxLength: 10, inputMode: 'numeric', pattern: '[0-9]*' }}
              />
            )}
          />
        </div>
        {errors.mobileNumber && (
          <small className={styles.errorText}>{errors.mobileNumber.message}</small>
        )}

        <Button
          type="submit"
          variant="contained"
          disableElevation
          className={styles.submitBtn}
          disabled={!isValid || isLoading}
        >
          {isLoading ? 'Sending...' : 'Send OTP →'}
        </Button>
      </form>

      <p className={styles.termsText}>
        By continuing, you agree to our <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a>.
      </p>
    </div>
  );
};

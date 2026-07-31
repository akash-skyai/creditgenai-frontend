import React from 'react';

import { PhoneForm } from '../../components/phone-form/PhoneForm';
import { useSendOtp } from '../../hooks/useSendOtp';
import type { PhoneFormValues } from '../../schemas/phone.schema';
import styles from './PhoneEntryPage.module.scss';
import { useNavigate } from 'react-router-dom';

export const PhoneEntryPage: React.FC = () => {
  const { mutate: sendOtp, isPending } = useSendOtp();
  const navigate = useNavigate();

  const handleSubmit = (data: PhoneFormValues) => {
    sendOtp(
      { mobileNumber: data.mobileNumber },
      {
        onSuccess: () => {
          navigate('/apply/verify-otp', { state: { mobileNumber: data.mobileNumber } });
        },
        onError: (error) => {
          console.error('Failed to send OTP:', error);
          // Here we would typically show a Toast error message
        }
      }
    );
  };

  return (
    <div className={styles.pageContainer}>
      <PhoneForm onSubmit={handleSubmit} isLoading={isPending} />
    </div>
  );
};

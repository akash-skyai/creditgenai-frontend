import React from 'react';

import { PhoneForm } from '../../components/phone-form/PhoneForm';
import { useSendOtp } from '../../hooks/useSendOtp';
import type { PhoneFormValues } from '../../schemas/phone.schema';
import styles from './PhoneEntryPage.module.scss';
// Note: In a real app we'd use useNavigate from react-router-dom
// import { useNavigate } from 'react-router-dom';

export const PhoneEntryPage: React.FC = () => {
  const { mutate: sendOtp, isPending } = useSendOtp();
  // const navigate = useNavigate();

  const handleSubmit = (data: PhoneFormValues) => {
    sendOtp(
      { mobileNumber: data.mobileNumber },
      {
        onSuccess: () => {
          // navigate('/apply/verify-otp', { state: { mobileNumber: data.mobileNumber } });
          console.log('Success! Navigating to verify-otp with number:', data.mobileNumber);
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

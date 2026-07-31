import React, { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { OtpForm } from '../../components/otp-form/OtpForm';
import { useVerifyOtp } from '../../hooks/useVerifyOtp';
import { useSendOtp } from '../../hooks/useSendOtp';
import type { OtpFormValues } from '../../schemas/otp.schema';
import styles from './OtpVerifyPage.module.scss';

export const OtpVerifyPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mobileNumber = location.state?.mobileNumber as string | undefined;

  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyOtp();
  const { mutate: sendOtp } = useSendOtp();

  // Soft Guard: If no mobile number in state, redirect back to entry
  useEffect(() => {
    if (!mobileNumber) {
      navigate('/apply', { replace: true });
    }
  }, [mobileNumber, navigate]);

  if (!mobileNumber) {
    return null;
  }

  const handleVerify = (data: OtpFormValues) => {
    verifyOtp(
      { mobileNumber, otpCode: data.otpCode },
      {
        onSuccess: (res) => {
          console.log('OTP Verified!', res);
          navigate('/apply/form');
        },
        onError: (err) => {
          console.error('OTP failed', err);
        }
      }
    );
  };

  const handleResend = () => {
    sendOtp({ mobileNumber });
  };

  return (
    <div className={styles.pageContainer}>
      <Link to="/apply" className={styles.backLink}>
        <ArrowLeft size={16} className={styles.backIcon} />
        Change Number
      </Link>
      
      <div className={styles.formWrapper}>
        <OtpForm 
          mobileNumber={mobileNumber} 
          onSubmit={handleVerify} 
          onResend={handleResend}
          isLoading={isVerifying} 
        />
      </div>
    </div>
  );
};

import { useMutation } from '@tanstack/react-query';
import { otpAuthService } from '../services/otp-auth.service';
import type { VerifyOtpPayload, VerifyOtpResponse } from '../types/auth.types';

export const useVerifyOtp = () => {
  return useMutation<VerifyOtpResponse, Error, VerifyOtpPayload>({
    mutationFn: (payload: VerifyOtpPayload) => otpAuthService.verifyOtp(payload),
  });
};

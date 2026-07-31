import { useMutation } from '@tanstack/react-query';
import { otpAuthService } from '../services/otp-auth.service';
import type { SendOtpPayload, SendOtpResponse } from '../types/auth.types';

export const useSendOtp = () => {
  return useMutation<SendOtpResponse, Error, SendOtpPayload>({
    mutationFn: (payload: SendOtpPayload) => otpAuthService.sendOtp(payload),
  });
};

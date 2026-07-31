import { useMutation } from '@tanstack/react-query';
import { sendOtp } from '../services/otp-auth.service';
import type { SendOtpRequest, SendOtpResponse } from '../types/auth.types';

export const useSendOtp = () => {
  return useMutation<SendOtpResponse, Error, SendOtpRequest>({
    mutationFn: (payload: SendOtpRequest) => sendOtp(payload),
  });
};

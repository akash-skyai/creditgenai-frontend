import { environment } from '../../../../config/environment';
import { apiClient } from '../../../../services/api-client';
import { endpoints } from '../../../../services/endpoints';
import mockData from '../../../../mocks/otp-auth.mock.json';
import type { SendOtpPayload, SendOtpResponse, VerifyOtpPayload, VerifyOtpResponse } from '../types/auth.types';

export const otpAuthService = {
  sendOtp: async (payload: SendOtpPayload): Promise<SendOtpResponse> => {
    if (environment.useMock) {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      return mockData.sendOtp;
    }
    const response = await apiClient.post<SendOtpResponse>(endpoints.SEND_OTP, payload);
    return response.data;
  },
  
  verifyOtp: async (payload: VerifyOtpPayload): Promise<VerifyOtpResponse> => {
    if (environment.useMock) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return mockData.verifyOtp;
    }
    const response = await apiClient.post<VerifyOtpResponse>(endpoints.VERIFY_OTP, payload);
    return response.data;
  }
};

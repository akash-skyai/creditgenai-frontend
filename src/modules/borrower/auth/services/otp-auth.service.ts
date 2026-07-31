import { environment } from '../../../../config/environment';
import { apiClient } from '../../../../services/api-client';
import { endpoints } from '../../../../services/endpoints';
import mockData from '../../../../mocks/otp-auth.mock.json';
import type { SendOtpRequest, SendOtpResponse } from '../types/auth.types';

export const sendOtp = async (payload: SendOtpRequest): Promise<SendOtpResponse> => {
  if (environment.useMock) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockData.sendOtp;
  }
  
  const response = await apiClient.post<SendOtpResponse>(endpoints.sendOtp, payload);
  return response.data;
};

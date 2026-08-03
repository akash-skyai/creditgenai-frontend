import { describe, it, expect, vi, beforeEach } from 'vitest';
import { otpAuthService } from './otp-auth.service';
import { apiClient } from '../../../../services/api-client';
import { environment } from '../../../../config/environment';

vi.mock('../../../../services/api-client', () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

vi.mock('../../../../config/environment', () => ({
  environment: {
    useMock: false,
  },
}));

describe('otpAuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sendOtp', () => {
    it('should call apiClient.post with correct endpoint and payload when useMock is false', async () => {
      const mockResponse = { data: { success: true, message: 'OTP Sent' } };
      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      const payload = { phone: '9999999999' };
      const response = await otpAuthService.sendOtp(payload);

      expect(apiClient.post).toHaveBeenCalledWith('/api/v1/auth/send-otp', payload);
      expect(response).toEqual(mockResponse.data);
    });
  });

  describe('verifyOtp', () => {
    it('should call apiClient.post with correct endpoint and payload when useMock is false', async () => {
      const mockResponse = { data: { success: true, token: 'token-abc' } };
      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      const payload = { phone: '9999999999', otp: '123456' };
      const response = await otpAuthService.verifyOtp(payload);

      expect(apiClient.post).toHaveBeenCalledWith('/api/v1/auth/verify-otp', payload);
      expect(response).toEqual(mockResponse.data);
    });
  });
});

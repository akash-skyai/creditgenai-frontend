import { describe, it, expect, vi, beforeEach } from 'vitest';
import { otpAuthService } from './otp-auth.service';
import { apiClient } from '../../../../services/api-client';

vi.mock('../../../../services/api-client', () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

describe('otpAuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sendOtp', () => {
    it('should successfully send OTP', async () => {
      const mockResponse = { data: { success: true, message: 'OTP sent successfully' } };
      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      const result = await otpAuthService.sendOtp({ mobileNumber: '9999999999' });

      expect(apiClient.post).toHaveBeenCalledWith('/auth/send-otp', { mobileNumber: '9999999999' });
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle API errors', async () => {
      vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('API Error'));

      await expect(otpAuthService.sendOtp({ mobileNumber: '9999999999' })).rejects.toThrow('API Error');
    });
  });

  describe('verifyOtp', () => {
    it('should successfully verify OTP', async () => {
      const mockResponse = { data: { success: true, message: 'Verified', data: { token: 'jwt-123' } } };
      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      const result = await otpAuthService.verifyOtp({ mobileNumber: '9999999999', otpCode: '123456' });

      expect(apiClient.post).toHaveBeenCalledWith('/auth/verify-otp', { mobileNumber: '9999999999', otpCode: '123456' });
      expect(result).toEqual(mockResponse.data);
    });
  });
});

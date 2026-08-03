import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useVerifyOtp } from './useVerifyOtp';
import { otpAuthService } from '../services/otp-auth.service';

vi.mock('../services/otp-auth.service', () => ({
  otpAuthService: {
    verifyOtp: vi.fn(),
  },
}));

describe('useVerifyOtp', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  it('should call verifyOtp service with correct payload', async () => {
    const mockResponse = {
      success: true,
      message: 'OTP Verified',
      data: { token: 'fake-jwt-token', isNewUser: false }
    };
    vi.mocked(otpAuthService.verifyOtp).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useVerifyOtp(), { wrapper });

    act(() => {
      result.current.mutate({
        mobileNumber: '9876543210',
        otpCode: '123456',
      });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(otpAuthService.verifyOtp).toHaveBeenCalledWith({ mobileNumber: '9876543210', otpCode: '123456' });
    expect(result.current.data).toEqual(mockResponse);
  });
});

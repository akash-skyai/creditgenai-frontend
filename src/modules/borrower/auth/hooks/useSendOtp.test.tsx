import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSendOtp } from './useSendOtp';
import { otpAuthService } from '../services/otp-auth.service';

vi.mock('../services/otp-auth.service', () => ({
  otpAuthService: {
    sendOtp: vi.fn(),
  },
}));

describe('useSendOtp', () => {
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

  it('should call sendOtp service with correct payload', async () => {
    const mockResponse = { success: true, message: 'OTP Sent' };
    vi.mocked(otpAuthService.sendOtp).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useSendOtp(), { wrapper });

    act(() => {
      result.current.mutate({ mobileNumber: '9876543210' });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(otpAuthService.sendOtp).toHaveBeenCalledWith({ mobileNumber: '9876543210' });
    expect(result.current.data).toEqual(mockResponse);
  });
});

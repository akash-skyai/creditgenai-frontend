import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePinCode } from './usePinCode';
import * as postalService from '../services/postal.service';
import React from 'react';

vi.mock('../services/postal.service', () => ({
  fetchPostalData: vi.fn(),
}));

describe('usePinCode', () => {
  it('should fetch data for valid 6 digit pin code', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const wrapper = ({ children }: { children: React.ReactNode }) => 
      React.createElement(QueryClientProvider, { client: queryClient }, children);

    vi.mocked(postalService.fetchPostalData).mockResolvedValueOnce({ city: 'Pune', state: 'Maharashtra' });

    const { result } = renderHook(() => usePinCode('411001'), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual({ city: 'Pune', state: 'Maharashtra' });
  });
});

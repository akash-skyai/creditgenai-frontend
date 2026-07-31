import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LoanApplicationPage } from './LoanApplicationPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the TanStack Query hook used in child
vi.mock('../../hooks/usePinCode', () => ({
  usePinCode: vi.fn(() => ({ data: null, isLoading: false, error: null }))
}));

const queryClient = new QueryClient();

describe('LoanApplicationPage', () => {
  it('renders stepper and first step', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <LoanApplicationPage />
      </QueryClientProvider>
    );

    // Check Stepper labels (getAllByText because PersonalInfoStep also renders an h2 with same text)
    expect(screen.getAllByText('Personal Details')[0]).toBeInTheDocument();
    expect(screen.getByText('Employment & Loan')).toBeInTheDocument();
    expect(screen.getByText('Review')).toBeInTheDocument();
    
    // Check first step is active (button "Next ->" is from PersonalInfoStep)
    expect(screen.getByRole('button', { name: /Next/i })).toBeInTheDocument();
  });
});

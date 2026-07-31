import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { OtpVerifyPage } from './OtpVerifyPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const renderWithProviders = (initialEntries: string[]) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/apply" element={<div>Home Page (Redirected)</div>} />
          <Route path="/apply/verify-otp" element={<OtpVerifyPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('OtpVerifyPage', () => {
  it('should redirect to home if accessed without mobileNumber state', async () => {
    renderWithProviders(['/apply/verify-otp']);
    
    // It should immediately redirect to "/apply"
    await waitFor(() => {
      expect(screen.getByText('Home Page (Redirected)')).toBeInTheDocument();
    });
  });

  it('should render the form if mobileNumber state is present', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[{ pathname: '/apply/verify-otp', state: { mobileNumber: '9876543210' } }]}>
          <OtpVerifyPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText(/98••••3210/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Change Number/i })).toBeInTheDocument();
  });
});

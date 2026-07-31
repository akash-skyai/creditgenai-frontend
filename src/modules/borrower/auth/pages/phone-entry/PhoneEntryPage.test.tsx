import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PhoneEntryPage } from './PhoneEntryPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PrimeReactProvider } from '@primereact/core';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const renderWithQueryClient = (ui: React.ReactElement) => {
  return render(
    <PrimeReactProvider>
      <QueryClientProvider client={queryClient}>
        {ui}
      </QueryClientProvider>
    </PrimeReactProvider>
  );
};

describe('PhoneEntryPage', () => {
  it('should render the form inside the layout', () => {
    renderWithQueryClient(<PhoneEntryPage />);
    expect(screen.getByText('Enter Your Mobile Number')).toBeInTheDocument(); // From Form
  });

  it('should call mutation on valid form submission', async () => {
    renderWithQueryClient(<PhoneEntryPage />);
    
    const input = screen.getByPlaceholderText('98765 43210');
    fireEvent.change(input, { target: { value: '9876543210' } });
    
    const submitBtn = screen.getByRole('button', { name: /Send OTP/i });
    await waitFor(() => expect(submitBtn).not.toBeDisabled());
    fireEvent.click(submitBtn);

    // Form should go into loading state immediately
    await waitFor(() => {
      // In PrimeReact, a loading button gets a specific class or ARIA attribute we can check,
      // or we can just verify the button is disabled while pending.
      expect(submitBtn).toBeDisabled();
    });
  });
});

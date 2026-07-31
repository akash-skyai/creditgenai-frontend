import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OtpForm } from './OtpForm';

describe('OtpForm', () => {

  it('should render correctly with phone number masked', () => {
    render(<OtpForm mobileNumber="9876543210" onSubmit={vi.fn()} onResend={vi.fn()} isLoading={false} />);
    expect(screen.getByText(/98••••3210/)).toBeInTheDocument();
    
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(6);
  });

  it('should handle OTP input and validation', async () => {
    const mockSubmit = vi.fn();
    render(<OtpForm mobileNumber="9876543210" onSubmit={mockSubmit} onResend={vi.fn()} isLoading={false} />);
    
    const inputs = screen.getAllByRole('textbox');
    
    // Type a full valid OTP
    fireEvent.change(inputs[0], { target: { value: '123456' } });
    
    const submitBtn = screen.getByRole('button', { name: /Verify & Continue/i });
    await waitFor(() => expect(submitBtn).not.toBeDisabled());
    
    fireEvent.click(submitBtn);
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({ otpCode: '123456' }, expect.anything());
    });
  });

  it('should enable resend button after timer expires', async () => {
    vi.useFakeTimers();
    const mockResend = vi.fn();
    render(<OtpForm mobileNumber="9876543210" onSubmit={vi.fn()} onResend={mockResend} isLoading={false} />);
    
    const resendBtn = screen.getByRole('button', { name: /Resend OTP/i });
    expect(resendBtn).toBeDisabled();
    
    // Fast-forward 30 seconds
    vi.advanceTimersByTime(30000);
    vi.useRealTimers();
    
    await waitFor(() => {
      expect(resendBtn).not.toBeDisabled();
    });
    
    fireEvent.click(resendBtn);
    expect(mockResend).toHaveBeenCalled();
  });
});

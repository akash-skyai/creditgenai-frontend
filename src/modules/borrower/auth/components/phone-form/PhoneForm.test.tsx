import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { PhoneForm } from './PhoneForm';

describe('PhoneForm', () => {
  it('should render form elements correctly', () => {
    render(
      <PhoneForm onSubmit={vi.fn()} isLoading={false} />
    );
    expect(screen.getByText('Enter Your Mobile Number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('98765 43210')).toBeInTheDocument();
    expect(screen.getByText('+91')).toBeInTheDocument();
  });

  it('should validate 10-digit mobile number', async () => {
    const mockSubmit = vi.fn();
    render(
      <PhoneForm onSubmit={mockSubmit} isLoading={false} />
    );
    
    const input = screen.getByPlaceholderText('98765 43210');
    fireEvent.change(input, { target: { value: '123' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(screen.getByText('Enter a valid 10-digit Indian mobile number')).toBeInTheDocument();
    });

    const submitBtn = screen.getByRole('button');
    expect(submitBtn).toBeDisabled();
  });
});

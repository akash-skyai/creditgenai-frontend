import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useForm, FormProvider } from 'react-hook-form';
import { ReviewSubmitStep } from './ReviewSubmitStep';

const TestWrapper = ({ children, defaultValues = {} }: { children: React.ReactNode, defaultValues?: any }) => {
  const methods = useForm({ defaultValues });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('ReviewSubmitStep', () => {
  it('renders personal and employment details correctly', () => {
    const mockData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      employmentType: 'salaried',
      loanAmount: 500000,
    };

    render(
      <TestWrapper defaultValues={mockData}>
        <ReviewSubmitStep onBack={vi.fn()} onNext={vi.fn()} />
      </TestWrapper>
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Salaried')).toBeInTheDocument();
    expect(screen.getByText('₹5,00,000')).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', () => {
    const onBack = vi.fn();
    render(
      <TestWrapper>
        <ReviewSubmitStep onBack={onBack} onNext={vi.fn()} />
      </TestWrapper>
    );

    fireEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(onBack).toHaveBeenCalled();
  });

  it('calls onNext when submit button is clicked', async () => {
    const onNext = vi.fn();
    render(
      <TestWrapper>
        <ReviewSubmitStep onBack={vi.fn()} onNext={onNext} />
      </TestWrapper>
    );

    fireEvent.click(screen.getByRole('button', { name: /submit application/i }));
    
    await waitFor(() => {
      expect(onNext).toHaveBeenCalled();
    }, { timeout: 2000 });
  });
});

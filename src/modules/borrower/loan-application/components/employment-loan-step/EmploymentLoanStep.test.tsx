import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EmploymentLoanStep } from './EmploymentLoanStep';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loanApplicationSchema } from '../../schemas/loanApplication.schema';
import type { LoanApplicationFormData } from '../../schemas/loanApplication.schema';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function Wrapper({ children }: { children: React.ReactNode }) {
  const methods = useForm<LoanApplicationFormData>({
    resolver: zodResolver(loanApplicationSchema),
    defaultValues: {
      employmentType: 'salaried',
      monthlyIncome: 50000,
      loanAmount: 100000,
      loanPurpose: 'Debt Consolidation',
    }
  });
  
  return (
    <QueryClientProvider client={queryClient}>
      <FormProvider {...methods}>
        {children}
      </FormProvider>
    </QueryClientProvider>
  );
}

describe('EmploymentLoanStep', () => {
  it('renders correctly', () => {
    const handleNext = vi.fn();
    const handleBack = vi.fn();
    
    render(
      <Wrapper>
        <EmploymentLoanStep onNext={handleNext} onBack={handleBack} />
      </Wrapper>
    );

    expect(screen.getByText('Employment & Loan Details')).toBeInTheDocument();
    expect(screen.getByText('Employment Type')).toBeInTheDocument();
    expect(screen.getByLabelText(/Average Monthly Income/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Desired Loan Amount/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Next Step/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Back/i })).toBeInTheDocument();
  });
});

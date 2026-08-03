import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EmploymentLoanStep } from './EmploymentLoanStep';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loanApplicationSchema } from '../../schemas/loan-application.schema';
import type { LoanApplicationFormData } from '../../schemas/loan-application.schema';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function Wrapper({ children }: { children: React.ReactNode }) {
  const methods = useForm<LoanApplicationFormData>({
    resolver: zodResolver(loanApplicationSchema) as unknown as import('react-hook-form').Resolver<LoanApplicationFormData>,
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      gender: '' as 'male',
      email: '',
      panNumber: '',
      pinCode: '',
      city: '',
      state: '',
      employmentType: 'salaried',
      sector: '',
      organizationEmployer: '',
      companyName: '',
      companyExperience: '',
      businessType: '',
      totalExperience: '',
      monthlyIncome: 50000,
      existingEmi: 0,
      loanAmount: 100000,
      loanPurpose: 'Debt Consolidation',
      loanPurposeOther: '',
      loanTenure: '36',
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
    expect(screen.getByLabelText(/Monthly Take-home Income/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/Loan Amount/i)[0]).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Continue/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Back/i })).toBeInTheDocument();
  });
});

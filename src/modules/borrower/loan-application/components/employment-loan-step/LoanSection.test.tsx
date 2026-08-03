import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { describe, it, expect } from 'vitest';
import { LoanSection } from './LoanSection';
import type { LoanApplicationFormData } from '../../schemas/loan-application.schema';

function Wrapper() {
  const { control, formState: { errors }, setValue } = useForm<LoanApplicationFormData>({
    defaultValues: { loanAmount: 50000, loanPurpose: 'Other' }
  });
  return <LoanSection control={control} errors={errors} setValue={setValue} />;
}

describe('LoanSection', () => {
  it('renders correctly', () => {
    render(<Wrapper />);
    expect(screen.getByText('Loan Details')).toBeInTheDocument();
    expect(screen.getByLabelText(/Current Monthly EMI/i)).toBeInTheDocument();
  });
});

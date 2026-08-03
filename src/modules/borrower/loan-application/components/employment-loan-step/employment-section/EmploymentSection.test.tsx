import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { describe, it, expect } from 'vitest';
import { EmploymentSection } from './EmploymentSection';
import type { LoanApplicationFormData } from '../../../schemas/loan-application.schema';

function Wrapper() {
  const { control, formState: { errors }, setValue } = useForm<LoanApplicationFormData>({
    defaultValues: { employmentType: 'salaried' }
  });
  return <EmploymentSection control={control} errors={errors} setValue={setValue} />;
}

describe('EmploymentSection', () => {
  it('renders correctly', () => {
    render(<Wrapper />);
    expect(screen.getByText('Employment Details')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Salaried/i })).toBeInTheDocument();
  });
});

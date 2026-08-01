import { z } from 'zod';

export const employmentLoanSchema = z.object({
  employmentType: z.enum(['salaried', 'self-employed'], {
    message: 'Please select your employment type',
  }),
  monthlyIncome: z
    .number({ message: 'Monthly income must be a valid number' })
    .min(10000, 'Monthly income must be at least ₹10,000')
    .max(10000000, 'Monthly income exceeds maximum limit'),
  loanAmount: z
    .number({ message: 'Loan amount must be a valid number' })
    .min(10000, 'Loan amount must be at least ₹10,000')
    .max(5000000, 'Loan amount cannot exceed ₹50,00,000'),
  loanPurpose: z
    .string({
      message: 'Please select a loan purpose',
    })
    .min(1, 'Please select a loan purpose'),
});

export type EmploymentLoanFormData = z.infer<typeof employmentLoanSchema>;

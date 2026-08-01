import { z } from 'zod';
import { personalInfoSchema } from './personalInfo.schema';
import { employmentLoanSchema } from './employmentLoan.schema';

export const loanApplicationSchema = personalInfoSchema.merge(employmentLoanSchema);

export type LoanApplicationFormData = z.infer<typeof loanApplicationSchema>;

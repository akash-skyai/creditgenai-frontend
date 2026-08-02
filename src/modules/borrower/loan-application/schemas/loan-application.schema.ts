import { z } from 'zod';
import { personalInfoSchema } from './personal-info.schema';
import { employmentLoanSchema } from './employment-loan.schema';

export const loanApplicationSchema = personalInfoSchema.merge(employmentLoanSchema);

export type LoanApplicationFormData = z.infer<typeof loanApplicationSchema>;

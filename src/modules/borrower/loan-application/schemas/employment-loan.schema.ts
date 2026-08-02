import { z } from 'zod';

export const employmentLoanSchema = z.object({
  employmentType: z.enum(['salaried', 'self-employed'], {
    message: 'Please select your employment type',
  }),
  sector: z.string().optional(),
  organizationEmployer: z.string().optional(),
  companyName: z.string().optional(),
  companyExperience: z.string().optional(),
  businessType: z.string().optional(),
  totalExperience: z.string().optional(),
  monthlyIncome: z
    .number({ message: 'Monthly income must be a valid number' })
    .min(10000, 'Monthly income must be at least ₹10,000')
    .max(10000000, 'Monthly income exceeds maximum limit'),
  existingEmi: z
    .number({ message: 'Existing EMI must be a valid number' })
    .min(0, 'EMI cannot be negative')
    .optional()
    .default(0),
  loanAmount: z
    .number({ message: 'Loan amount must be a valid number' })
    .min(10000, 'Loan amount must be at least ₹10,000')
    .max(5000000, 'Loan amount cannot exceed ₹50,00,000'),
  loanPurpose: z
    .string({
      message: 'Please select a loan purpose',
    })
    .min(1, 'Please select a loan purpose'),
  loanPurposeOther: z.string().optional(),
  loanTenure: z.string({
    message: 'Please select loan tenure',
  }).min(1, 'Please select loan tenure'),
}).superRefine((data, ctx) => {
  if (data.employmentType === 'salaried') {
    if (!data.sector || data.sector.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please select a sector',
        path: ['sector'],
      });
    } else if (data.sector === 'Government Sector') {
      if (!data.organizationEmployer || data.organizationEmployer.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please enter organization/employer name',
          path: ['organizationEmployer'],
        });
      }
    } else if (data.sector === 'Private Sector') {
      if (!data.companyName || data.companyName.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please enter company name',
          path: ['companyName'],
        });
      }
      if (!data.companyExperience || data.companyExperience.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please select company experience',
          path: ['companyExperience'],
        });
      }
    }
  } else if (data.employmentType === 'self-employed') {
    if (!data.businessType || data.businessType.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please select business type',
        path: ['businessType'],
      });
    }
    if (!data.totalExperience || data.totalExperience.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please select total experience',
        path: ['totalExperience'],
      });
    }
  }

  if (data.loanPurpose === 'Other') {
    if (!data.loanPurposeOther || data.loanPurposeOther.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please specify the loan purpose',
        path: ['loanPurposeOther'],
      });
    }
  }
});

export type EmploymentLoanFormData = z.infer<typeof employmentLoanSchema>;

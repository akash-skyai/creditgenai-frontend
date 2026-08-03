import { describe, it, expect } from 'vitest';
import { loanApplicationSchema } from './loan-application.schema';

describe('loanApplicationSchema', () => {
  it('validates a complete combined payload correctly', () => {
    const completePayload = {
      // Personal Info
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      gender: 'male',
      dateOfBirth: '1990-01-01',
      panNumber: 'ABCDE1234F',
      pinCode: '123456',
      city: 'Mumbai',
      state: 'Maharashtra',
      // Employment & Loan Info
      employmentType: 'salaried',
      sector: 'Private Sector',
      companyName: 'Tech Corp',
      companyExperience: '2-5 years',
      monthlyIncome: 60000,
      loanAmount: 200000,
      loanPurpose: 'Education',
      loanTenure: '36',
    };

    const result = loanApplicationSchema.safeParse(completePayload);
    expect(result.success).toBe(true);
  });

  it('fails if any part of the merged schema is invalid', () => {
    const invalidPayload = {
      firstName: 'John',
      lastName: 'Doe',
      // Missing email, gender, dob, etc...
      employmentType: 'salaried',
      sector: 'Private Sector',
    };

    const result = loanApplicationSchema.safeParse(invalidPayload);
    expect(result.success).toBe(false);
  });
});

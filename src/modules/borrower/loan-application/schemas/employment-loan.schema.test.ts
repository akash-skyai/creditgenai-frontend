import { describe, it, expect } from 'vitest';
import { employmentLoanSchema } from './employment-loan.schema';

describe('employmentLoanSchema', () => {
  const validSalariedGovt = {
    employmentType: 'salaried',
    sector: 'Government Sector',
    organizationEmployer: 'State Bank of India',
    monthlyIncome: 50000,
    loanAmount: 100000,
    loanPurpose: 'Home Renovation',
    loanTenure: '24',
  };

  const validSalariedPrivate = {
    employmentType: 'salaried',
    sector: 'Private Sector',
    companyName: 'Tech Corp',
    companyExperience: '2-5 years',
    monthlyIncome: 60000,
    loanAmount: 200000,
    loanPurpose: 'Education',
    loanTenure: '36',
  };

  const validSelfEmployed = {
    employmentType: 'self-employed',
    businessType: 'Retail',
    totalExperience: '5+ years',
    monthlyIncome: 80000,
    loanAmount: 500000,
    loanPurpose: 'Business Expansion',
    loanTenure: '48',
  };

  it('validates salaried government employee correctly', () => {
    const result = employmentLoanSchema.safeParse(validSalariedGovt);
    expect(result.success).toBe(true);
  });

  it('validates salaried private employee correctly', () => {
    const result = employmentLoanSchema.safeParse(validSalariedPrivate);
    expect(result.success).toBe(true);
  });

  it('validates self-employed correctly', () => {
    const result = employmentLoanSchema.safeParse(validSelfEmployed);
    expect(result.success).toBe(true);
  });

  it('fails salaried private if missing company name', () => {
    const result = employmentLoanSchema.safeParse({
      ...validSalariedPrivate,
      companyName: '',
    });
    expect(result.success).toBe(false);
  });

  it('fails self-employed if missing business type', () => {
    const result = employmentLoanSchema.safeParse({
      ...validSelfEmployed,
      businessType: '',
    });
    expect(result.success).toBe(false);
  });

  it('fails if loan purpose is Other but description is missing', () => {
    const result = employmentLoanSchema.safeParse({
      ...validSalariedGovt,
      loanPurpose: 'Other',
    });
    expect(result.success).toBe(false);

    const resultWithDesc = employmentLoanSchema.safeParse({
      ...validSalariedGovt,
      loanPurpose: 'Other',
      loanPurposeOther: 'Medical Emergency',
    });
    expect(resultWithDesc.success).toBe(true);
  });

  it('fails if monthly income is below minimum', () => {
    const result = employmentLoanSchema.safeParse({
      ...validSalariedGovt,
      monthlyIncome: 5000, // min is 10000
    });
    expect(result.success).toBe(false);
  });

  it('fails if loan amount is out of bounds', () => {
    const resultLow = employmentLoanSchema.safeParse({
      ...validSalariedGovt,
      loanAmount: 5000, // min is 10000
    });
    expect(resultLow.success).toBe(false);

    const resultHigh = employmentLoanSchema.safeParse({
      ...validSalariedGovt,
      loanAmount: 10000000, // max is 5000000
    });
    expect(resultHigh.success).toBe(false);
  });
});

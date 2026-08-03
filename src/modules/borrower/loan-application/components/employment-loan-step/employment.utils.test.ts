import { describe, it, expect, vi } from 'vitest';
import {
  isSalaried,
  isSelfEmployed,
  isPrivateSector,
  isGovernmentSector,
  getMonthlyIncomeLabel,
  getEmployerLabel,
  formatCurrency,
  parseCurrency,
  formatNumberInWords,
  normalizeLoanAmount,
  shouldShowLoanPurposeOther,
  resetEmploymentFields,
  shouldShowCompanyFields,
  shouldShowGovernmentFields,
  shouldShowBusinessFields
} from './employment.utils';

vi.mock('@/shared/utils/numberToWords', () => ({
  numberToWords: vi.fn((val) => `Words for ${val}`)
}));

describe('employment.utils', () => {
  it('isSalaried returns correctly', () => {
    expect(isSalaried('salaried')).toBe(true);
    expect(isSalaried('self-employed')).toBe(false);
  });

  it('isSelfEmployed returns correctly', () => {
    expect(isSelfEmployed('self-employed')).toBe(true);
    expect(isSelfEmployed('salaried')).toBe(false);
  });

  it('isPrivateSector returns correctly', () => {
    expect(isPrivateSector('Private Sector')).toBe(true);
    expect(isPrivateSector('Government Sector')).toBe(false);
  });

  it('isGovernmentSector returns correctly', () => {
    expect(isGovernmentSector('Government Sector')).toBe(true);
    expect(isGovernmentSector('Private Sector')).toBe(false);
  });

  it('getMonthlyIncomeLabel returns correctly', () => {
    expect(getMonthlyIncomeLabel('self-employed')).toBe('Average Monthly Income');
    expect(getMonthlyIncomeLabel('salaried')).toBe('Monthly Take-home Income');
  });

  it('getEmployerLabel returns correctly', () => {
    expect(getEmployerLabel('Government Sector')).toBe('Organization / Employer');
    expect(getEmployerLabel('Private Sector')).toBe('Company Name');
  });

  it('formatCurrency returns correctly', () => {
    expect(formatCurrency(100000)).toBe('1,00,000');
    expect(formatCurrency(undefined)).toBe('');
  });

  it('parseCurrency returns correctly', () => {
    expect(parseCurrency('1,00,000')).toBe(100000);
    expect(parseCurrency(undefined)).toBe(0);
  });

  it('formatNumberInWords returns correctly', () => {
    expect(formatNumberInWords(1000)).toBe('Words for 1000');
    expect(formatNumberInWords(undefined)).toBe('');
  });

  it('normalizeLoanAmount returns correctly', () => {
    expect(normalizeLoanAmount(50000)).toBe(50000);
    expect(normalizeLoanAmount(undefined)).toBe(10000);
  });

  it('shouldShowLoanPurposeOther returns correctly', () => {
    expect(shouldShowLoanPurposeOther('Other')).toBe(true);
    expect(shouldShowLoanPurposeOther('Home Loan')).toBe(false);
  });

  it('resetEmploymentFields calls setValue for all fields', () => {
    const setValue = vi.fn();
    resetEmploymentFields(setValue as unknown as import('react-hook-form').UseFormSetValue<import('../../schemas/loan-application.schema').LoanApplicationFormData>);
    expect(setValue).toHaveBeenCalledWith('businessType', '');
    expect(setValue).toHaveBeenCalledWith('totalExperience', '');
    expect(setValue).toHaveBeenCalledWith('sector', '');
    expect(setValue).toHaveBeenCalledWith('companyName', '');
    expect(setValue).toHaveBeenCalledWith('companyExperience', '');
    expect(setValue).toHaveBeenCalledWith('organizationEmployer', '');
  });

  it('shouldShowCompanyFields returns correctly', () => {
    expect(shouldShowCompanyFields('salaried', 'Private Sector')).toBe(true);
    expect(shouldShowCompanyFields('salaried', 'Government Sector')).toBe(false);
    expect(shouldShowCompanyFields('self-employed', 'Private Sector')).toBe(false);
  });

  it('shouldShowGovernmentFields returns correctly', () => {
    expect(shouldShowGovernmentFields('salaried', 'Government Sector')).toBe(true);
    expect(shouldShowGovernmentFields('salaried', 'Private Sector')).toBe(false);
  });

  it('shouldShowBusinessFields returns correctly', () => {
    expect(shouldShowBusinessFields('self-employed')).toBe(true);
    expect(shouldShowBusinessFields('salaried')).toBe(false);
  });
});

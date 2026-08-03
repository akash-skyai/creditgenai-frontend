// employment.utils.ts

import { numberToWords } from '@/shared/utils/numberToWords';

/**
 * ============================================================================
 * Employment Helpers
 * ============================================================================
 */

export const isSalaried = (
  employmentType?: string
): boolean => employmentType === 'salaried';

export const isSelfEmployed = (
  employmentType?: string
): boolean => employmentType === 'self-employed';

export const isPrivateSector = (
  sector?: string
): boolean => sector === 'Private Sector';

export const isGovernmentSector = (
  sector?: string
): boolean => sector === 'Government Sector';

/**
 * ============================================================================
 * Dynamic Labels
 * ============================================================================
 */

export function getMonthlyIncomeLabel(
  employmentType?: string
): string {
  return employmentType === 'self-employed'
    ? 'Average Monthly Income'
    : 'Monthly Take-home Income';
}

export function getEmployerLabel(
  sector?: string
): string {
  return sector === 'Government Sector'
    ? 'Organization / Employer'
    : 'Company Name';
}

/**
 * ============================================================================
 * Currency Helpers
 * ============================================================================
 */

export function formatCurrency(
  value?: number
): string {
  if (!value) return '';

  return new Intl.NumberFormat('en-IN').format(value);
}

export function parseCurrency(
  value?: string
): number {
  if (!value) return 0;

  return Number(value.replace(/,/g, ''));
}

/**
 * ============================================================================
 * Number To Words
 * ============================================================================
 */

export function formatNumberInWords(
  value?: number
): string {
  if (!value || value <= 0) return '';

  return numberToWords(value);
}

/**
 * ============================================================================
 * Slider Helpers
 * ============================================================================
 */

export function normalizeLoanAmount(
  value?: number
): number {
  if (!value) return 10000;

  return value;
}

export function getSliderMarks(
  min: number,
  max: number
) {
  return [
    {
      value: min,
      label: '₹10K',
    },
    {
      value: max,
      label: '₹50L',
    },
  ];
}

/**
 * ============================================================================
 * Form Helpers
 * ============================================================================
 */

export function shouldShowLoanPurposeOther(
  loanPurpose?: string
): boolean {
  return loanPurpose === 'Other';
}

/**
 * ============================================================================
 * Reset Helpers
 * ============================================================================
 */

import type { UseFormSetValue } from 'react-hook-form';
import type { LoanApplicationFormData } from '../../schemas/loan-application.schema';

export function resetEmploymentFields(setValue: UseFormSetValue<LoanApplicationFormData>) {
  setValue('businessType', '');
  setValue('totalExperience', '');
  setValue('sector', '');
  setValue('companyName', '');
  setValue('companyExperience', '');
  setValue('organizationEmployer', '');
}

/**
 * ============================================================================
 * Dynamic Visibility
 * ============================================================================
 */

export function shouldShowCompanyFields(
  employmentType?: string,
  sector?: string
): boolean {
  return (
    employmentType === 'salaried' &&
    sector === 'Private Sector'
  );
}

export function shouldShowGovernmentFields(
  employmentType?: string,
  sector?: string
): boolean {
  return (
    employmentType === 'salaried' &&
    sector === 'Government Sector'
  );
}

export function shouldShowBusinessFields(
  employmentType?: string
): boolean {
  return employmentType === 'self-employed';
}

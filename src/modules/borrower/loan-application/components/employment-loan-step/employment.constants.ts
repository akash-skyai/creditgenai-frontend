// employment.constants.ts

/**
 * Employment Types
 */
export const EMPLOYMENT_TYPES = [
  {
    value: 'salaried',
    label: 'Salaried',
    icon: 'briefcase',
  },
  {
    value: 'self-employed',
    label: 'Self-employed',
    icon: 'user',
  },
] as const;

/**
 * Employee Sectors
 */
export const SECTORS = [
  'Private Sector',
  'Government Sector',
] as const;

/**
 * Self Employment Types
 */
export const BUSINESS_TYPES = [
  'Sole Proprietor / Business Owner',
  'Partnership Firm',
  'Private Limited Director',
  'Freelancer / Consultant',
] as const;

/**
 * Experience Options
 */
export const EXPERIENCE_OPTIONS = [
  '0 - 2 Years',
  '3 - 5 Years',
  '5 - 10 Years',
  '10+ Years',
] as const;

/**
 * Loan Purposes
 */
export const LOAN_PURPOSES = [
  'Personal / Home Improvement',
  'Debt Consolidation',
  'Wedding Expenses',
  'Medical Emergency',
  'Business Expansion',
  'Travel / Vacation',
  'Education',
  'Vehicle Purchase',
  'Other',
] as const;

/**
 * Loan Tenure (Months)
 */
export const LOAN_TENURES = [
  {
    label: '12 Months',
    value: '12',
  },
  {
    label: '24 Months',
    value: '24',
  },
  {
    label: '36 Months',
    value: '36',
  },
  {
    label: '48 Months',
    value: '48',
  },
  {
    label: '60 Months',
    value: '60',
  },
  {
    label: '72 Months',
    value: '72',
  },
  {
    label: '84 Months',
    value: '84',
  },
] as const;

/**
 * Loan Slider Configuration
 */
export const LOAN_AMOUNT = {
  MIN: 10_000,
  MAX: 50_00_000,
  STEP: 10_000,
} as const;

/**
 * Monthly Income Configuration
 */
export const MONTHLY_INCOME = {
  MIN: 10_000,
  MAX: 1_00_00_000,
} as const;

/**
 * Existing EMI Configuration
 */
export const EMI = {
  MIN: 0,
  MAX: 10_00_000,
} as const;

/**
 * Default Values
 */
export const DEFAULT_VALUES = {
  EXISTING_EMI: 0,
  LOAN_AMOUNT: LOAN_AMOUNT.MIN,
} as const;

/**
 * Common Labels
 */
export const LABELS = {
  EMPLOYMENT_TITLE: 'Employment Details',
  LOAN_TITLE: 'Loan Details',

  EMPLOYMENT_TYPE: 'Employment Type',
  SECTOR: 'Employee Sector',
  COMPANY_NAME: 'Company Name',
  ORGANIZATION: 'Organization / Employer',
  BUSINESS_TYPE: 'Business Type',

  COMPANY_EXPERIENCE: 'Years in Current Company',
  TOTAL_EXPERIENCE: 'Total Business Experience',

  MONTHLY_INCOME: 'Monthly Take-home Income',
  MONTHLY_REVENUE: 'Average Monthly Income',

  EXISTING_EMI: 'Current Monthly EMI',

  LOAN_AMOUNT: 'Loan Amount',
  LOAN_PURPOSE: 'Loan Purpose',
  LOAN_TENURE: 'Loan Tenure',

  OTHER_PURPOSE: 'Please Specify Loan Purpose',
} as const;

/**
 * Placeholders
 */
export const PLACEHOLDERS = {
  COMPANY_NAME: 'e.g. Tata Consultancy Services',

  ORGANIZATION:
    'e.g. State Bank of India',

  MONTHLY_INCOME: 'e.g. 50,000',

  EMI: 'e.g. 0',

  LOAN_AMOUNT: 'e.g. 5,00,000',

  OTHER_PURPOSE:
    'Describe your loan purpose',
} as const;

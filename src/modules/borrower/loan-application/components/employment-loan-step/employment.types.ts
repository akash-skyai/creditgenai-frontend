// employment.types.ts

import type {
  Control,
  FieldErrors,
  UseFormSetValue,
  UseFormTrigger,
} from 'react-hook-form';

import type { LoanApplicationFormData } from '../../schemas/loan-application.schema';

/**
 * ============================================================================
 * Common React Hook Form Props
 * ============================================================================
 */

export interface FormSectionProps {
  control: Control<LoanApplicationFormData>;
  errors: FieldErrors<LoanApplicationFormData>;
  setValue: UseFormSetValue<LoanApplicationFormData>;
}

/**
 * ============================================================================
 * Employment Section
 * ============================================================================
 */

export interface EmploymentSectionProps extends FormSectionProps {}

/**
 * ============================================================================
 * Loan Section
 * ============================================================================
 */

export interface LoanSectionProps extends FormSectionProps {}

/**
 * ============================================================================
 * Consent Section
 * ============================================================================
 */

export interface ConsentSectionProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/**
 * ============================================================================
 * Main Step Component
 * ============================================================================
 */

export interface EmploymentLoanStepProps {
  onNext: () => void;
  onBack: () => void;
}

/**
 * ============================================================================
 * Action Buttons
 * ============================================================================
 */

export interface ActionButtonsProps {
  loading?: boolean;
  hasConsent: boolean;

  onBack: () => void;

  onNext: () => Promise<void>;
}

/**
 * ============================================================================
 * Option Types
 * ============================================================================
 */

export interface SelectOption {
  label: string;
  value: string;
}

export interface PillOption {
  label: string;
  value: string;
  icon: React.ReactNode;
}

/**
 * ============================================================================
 * Slider Configuration
 * ============================================================================
 */

export interface SliderConfig {
  min: number;
  max: number;
  step: number;
}

/**
 * ============================================================================
 * Currency Input Props
 * ============================================================================
 */

export interface CurrencyInputProps {
  name: keyof LoanApplicationFormData;

  label: string;

  placeholder?: string;

  helperText?: string;

  required?: boolean;

  min?: number;

  max?: number;
}

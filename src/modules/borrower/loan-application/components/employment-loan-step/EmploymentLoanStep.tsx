import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@mui/material';

import type { LoanApplicationFormData } from '../../schemas/loan-application.schema';
import { EmploymentSection } from './employment-section/EmploymentSection';
import { LoanSection } from './loan-section/LoanSection';
import { ConsentSection } from './consent-section/ConsentSection';
import styles from './EmploymentLoanStep.module.scss';

interface EmploymentLoanStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function EmploymentLoanStep({ onNext, onBack }: EmploymentLoanStepProps) {
  const { 
    control, 
    formState: { errors }, 
    trigger,
    setValue
  } = useFormContext<LoanApplicationFormData>();

  const [hasConsent, setHasConsent] = useState(false);

  const handleNext = async () => {
    const isStepValid = await trigger([
      'employmentType',
      'sector',
      'organizationEmployer',
      'companyName',
      'companyExperience',
      'businessType',
      'totalExperience',
      'monthlyIncome',
      'existingEmi',
      'loanAmount',
      'loanPurpose',
      'loanPurposeOther',
      'loanTenure'
    ]);
    if (isStepValid) {
      onNext();
    }
  };

  return (
    <div className={styles.stepContainer}>
      <h2 className={styles.stepTitle}>Employment & Loan Details</h2>
      <p className={styles.stepSubtitle}>
        Tell us a bit about your income and loan requirements.
      </p>

      <EmploymentSection control={control} errors={errors} setValue={setValue} />
      
      <LoanSection control={control} errors={errors} setValue={setValue} />
      
      <ConsentSection checked={hasConsent} onChange={setHasConsent} />

      <div className={styles.actionContainer}>
        <Button 
          variant="outlined" 
          color="primary" 
          size="large"
          onClick={onBack}
          className={styles.navButton}
        >
          &larr; Back
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          onClick={handleNext}
          disabled={!hasConsent}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

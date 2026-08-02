import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Stepper, Step, StepLabel } from '@mui/material';
import { PersonalInfoStep } from '../../components/personal-info-step/PersonalInfoStep';
import { SuccessScreen } from '../../components/success-screen/SuccessScreen';
import { loanApplicationSchema } from '../../schemas/loanApplication.schema';
import type { LoanApplicationFormData } from '../../schemas/loanApplication.schema';
import { EmploymentLoanStep } from '../../components/employment-loan-step/EmploymentLoanStep';
import styles from './LoanApplicationPage.module.scss';

const DRAFT_STORAGE_KEY = 'loan_application_draft';

const steps = ['Personal Details', 'Employment & Loan', 'Review'];

export function LoanApplicationPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');

  // Setup React Hook Form
  const methods = useForm<LoanApplicationFormData>({
    resolver: zodResolver(loanApplicationSchema),
    mode: 'onSubmit', // Validate on submit, re-validate on change
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      gender: '' as 'male', // To fix MUI Select undefined warning without using any
      email: '',
      panNumber: '',
      pinCode: '',
      city: '',
      state: '',
      employmentType: 'salaried',
      sector: '',
      organizationEmployer: '',
      companyName: '',
      companyExperience: '',
      businessType: '',
      totalExperience: '',
      monthlyIncome: '' as unknown as number,
      existingEmi: 0,
      loanAmount: '' as unknown as number,
      loanPurpose: '',
      loanPurposeOther: '',
      loanTenure: '',
    }
  });

  const { watch, reset, getValues } = methods;

  // Watch all values to save draft using a subscription (avoids React Compiler warning and unneeded rerenders)
  useEffect(() => {
    const subscription = watch((value) => {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        reset(parsedDraft);
        console.log('Loaded draft from local storage');
      } catch (e) {
        console.error('Failed to parse draft', e);
      }
    }
  }, [reset]);



  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  // Temporary submit handler until Step 3 is built
  const handleFinalSubmit = () => {
    console.log('Final Payload:', getValues());
    // TODO: Call API via mutation
    // On success:
    localStorage.removeItem(DRAFT_STORAGE_KEY); // Clear draft
    setReferenceId('REF' + Math.floor(Math.random() * 1000000000));
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return <SuccessScreen referenceId={referenceId} />;
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formCard}>
        <div className={styles.stepperWrapper}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>

        <FormProvider {...methods}>
          <Box className={styles.stepContent}>
            {activeStep === 0 && <PersonalInfoStep onNext={handleNext} />}
            {activeStep === 1 && <EmploymentLoanStep onNext={handleNext} onBack={handleBack} />}
            {activeStep === 2 && (
              <div style={{ padding: '24px', textAlign: 'center' }}>
                <h2>Review & Submit</h2>
                <p>Coming in next phase...</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                  <button onClick={handleBack}>Back</button>
                  <button onClick={handleFinalSubmit}>Submit Application</button>
                </div>
              </div>
            )}
          </Box>
        </FormProvider>
      </div>
    </div>
  );
}

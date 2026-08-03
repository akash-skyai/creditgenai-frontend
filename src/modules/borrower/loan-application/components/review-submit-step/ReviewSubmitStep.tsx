import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button, CircularProgress } from '@mui/material';
import { User, Briefcase } from 'lucide-react';
import type { LoanApplicationFormData } from '../../schemas/loan-application.schema';
import styles from './ReviewSubmitStep.module.scss';

export function ReviewSubmitStep({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const { getValues, handleSubmit } = useFormContext<LoanApplicationFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const data = getValues();

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    // Slight delay to show premium loading state before transitioning
    await new Promise(resolve => setTimeout(resolve, 800));
    onNext();
  };

  const renderField = (label: string, value?: string | number | null) => {
    if (value === undefined || value === null || value === '') return null;
    return (
      <div className={styles.field} key={label}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{value}</span>
      </div>
    );
  };

  const fullName = [data.firstName, data.middleName, data.lastName].filter(Boolean).join(' ');

  return (
    <div className={styles.stepContainer}>
      <h2 className={styles.stepTitle}>Review Application</h2>
      <p className={styles.stepSubtitle}>
        Please review your details carefully before submitting.
      </p>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardIcon}>
            <User size={20} />
          </div>
          <h3 className={styles.cardTitle}>Personal Details</h3>
        </div>
        <div className={styles.grid}>
          {renderField('Full Name', fullName)}
          {renderField('Email Address', data.email)}
          {renderField('Gender', data.gender ? data.gender.charAt(0).toUpperCase() + data.gender.slice(1) : '')}
          {renderField('Date of Birth', data.dateOfBirth)}
          {renderField('PAN Number', data.panNumber)}
          {renderField('PIN Code', data.pinCode)}
          {renderField('City', data.city)}
          {renderField('State', data.state)}
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardIcon}>
            <Briefcase size={20} />
          </div>
          <h3 className={styles.cardTitle}>Employment & Loan</h3>
        </div>
        <div className={styles.grid}>
          {renderField('Employment Type', data.employmentType === 'salaried' ? 'Salaried' : 'Self-Employed')}
          {data.employmentType === 'salaried' && (
            <>
              {renderField('Sector', data.sector)}
              {renderField('Employer', data.sector === 'Government Sector' ? data.organizationEmployer : data.companyName)}
              {renderField('Experience', data.companyExperience)}
            </>
          )}
          {data.employmentType === 'self-employed' && (
            <>
              {renderField('Business Type', data.businessType)}
              {renderField('Total Experience', data.totalExperience)}
            </>
          )}
          {renderField('Monthly Income', data.monthlyIncome ? `₹${Number(data.monthlyIncome).toLocaleString('en-IN')}` : '')}
          {renderField('Existing EMI', data.existingEmi ? `₹${Number(data.existingEmi).toLocaleString('en-IN')}` : '₹0')}
          {renderField('Loan Amount', data.loanAmount ? `₹${Number(data.loanAmount).toLocaleString('en-IN')}` : '')}
          {renderField('Loan Purpose', data.loanPurpose === 'Other' ? data.loanPurposeOther : data.loanPurpose)}
          {renderField('Loan Tenure', data.loanTenure ? `${data.loanTenure} Months` : '')}
        </div>
      </div>

      <div className={styles.actionContainer}>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          onClick={onBack}
          disabled={isSubmitting}
          className={styles.navButton}
        >
          &larr; Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSubmit(handleFinalSubmit)}
          disabled={isSubmitting}
          className={styles.navButton}
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
        >
          Submit Application
        </Button>
      </div>
    </div>
  );
}

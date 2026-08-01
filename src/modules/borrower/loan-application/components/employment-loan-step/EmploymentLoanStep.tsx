import { useFormContext, Controller } from 'react-hook-form';
import { 
  TextField, 
  Grid, 
  InputAdornment,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText
} from '@mui/material';
import type { LoanApplicationFormData } from '../../schemas/loanApplication.schema';
import styles from './EmploymentLoanStep.module.scss';

interface EmploymentLoanStepProps {
  onNext: () => void;
  onBack: () => void;
}

const LOAN_PURPOSES = [
  'Personal / Home Improvement',
  'Debt Consolidation',
  'Wedding Expenses',
  'Medical Emergency',
  'Business Expansion',
  'Travel / Vacation',
  'Other'
];

export function EmploymentLoanStep({ onNext, onBack }: EmploymentLoanStepProps) {
  const { 
    control, 
    register, 
    formState: { errors }, 
    trigger
  } = useFormContext<LoanApplicationFormData>();

  const handleNext = async () => {
    // Validate only Step 2 fields
    const isStepValid = await trigger([
      'employmentType',
      'monthlyIncome',
      'loanAmount',
      'loanPurpose'
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

      <Grid container spacing={3}>
        {/* Employment Type */}
        <Grid size={{ xs: 12 }}>
          <Controller
            name="employmentType"
            control={control}
            render={({ field }) => (
              <div className={styles.pillField}>
                <span className={`${styles.pillLabel} ${errors.employmentType ? styles.errorText : ''}`}>
                  Employment Type
                </span>
                <div className={styles.pillGroup}>
                  {['salaried', 'self-employed'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`${styles.pillButton} ${field.value === type ? styles.pillActive : ''}`}
                      onClick={() => field.onChange(type)}
                    >
                      {type === 'salaried' ? 'Salaried' : 'Self-employed'}
                    </button>
                  ))}
                </div>
                {errors.employmentType && (
                  <span className={styles.errorHelperText}>{errors.employmentType.message}</span>
                )}
              </div>
            )}
          />
        </Grid>

        {/* Average Monthly Income / Revenue */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Average Monthly Income / Revenue"
            placeholder="e.g. 50000"
            type="number"
            error={!!errors.monthlyIncome}
            helperText={errors.monthlyIncome?.message || ' '}
            slotProps={{
              formHelperText: { style: { minHeight: '20px', marginTop: '4px' } },
              input: {
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }
            }}
            {...register('monthlyIncome', { valueAsNumber: true })}
          />
        </Grid>

        {/* Required Loan Amount */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Desired Loan Amount"
            placeholder="e.g. 200000"
            type="number"
            error={!!errors.loanAmount}
            helperText={errors.loanAmount?.message || ' '}
            slotProps={{
              formHelperText: { style: { minHeight: '20px', marginTop: '4px' } },
              input: {
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }
            }}
            {...register('loanAmount', { valueAsNumber: true })}
          />
        </Grid>

        {/* Loan Purpose */}
        <Grid size={{ xs: 12 }}>
          <FormControl fullWidth error={!!errors.loanPurpose}>
            <InputLabel id="loan-purpose-label">Loan Purpose</InputLabel>
            <Controller
              name="loanPurpose"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="loan-purpose-label"
                  label="Loan Purpose"
                >
                  {LOAN_PURPOSES.map((purpose) => (
                    <MenuItem key={purpose} value={purpose}>
                      {purpose}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText style={{ minHeight: '20px', marginTop: '4px' }}>
              {errors.loanPurpose?.message || ' '}
            </FormHelperText>
          </FormControl>
        </Grid>
      </Grid>

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
          className={styles.navButton}
        >
          Next Step &rarr;
        </Button>
      </div>
    </div>
  );
}

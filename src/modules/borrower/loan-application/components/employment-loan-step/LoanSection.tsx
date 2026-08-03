import { memo } from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { 
  TextField, 
  Grid, 
  InputAdornment,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
  Slider
} from '@mui/material';
import { Banknote } from 'lucide-react';

import type { LoanSectionProps } from '../../types/employment.types';
import { LOAN_PURPOSES, LOAN_TENURES, LABELS, PLACEHOLDERS } from './employment.constants';
import { formatNumberInWords, shouldShowLoanPurposeOther } from './employment.utils';
import styles from './EmploymentLoanStep.module.scss';

export const LoanSection = memo(function LoanSection({ control, errors, setValue }: LoanSectionProps) {
  const loanAmount = useWatch({ control, name: 'loanAmount' });
  const loanPurpose = useWatch({ control, name: 'loanPurpose' });

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardIcon}>
          <Banknote size={24} />
        </div>
        <h3 className={styles.cardTitle}>{LABELS.LOAN_TITLE}</h3>
      </div>

      <Grid container spacing={3}>
        {/* Existing EMI */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="existingEmi"
            control={control}
            render={({ field: { onChange, ref, ...field } }) => (
              <NumericFormat
                {...field}
                getInputRef={ref}
                customInput={TextField}
                fullWidth
                label={LABELS.EXISTING_EMI}
                placeholder={PLACEHOLDERS.EMI}
                error={!!errors.existingEmi}
                helperText={errors.existingEmi?.message || '\u00A0'}
                thousandSeparator=","
                thousandsGroupStyle="lakh"
                onValueChange={(values) => {
                  onChange(values.floatValue || 0);
                }}
                slotProps={{
                  formHelperText: { className: styles.helperTextSpacer },
                  input: {
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }
                }}
              />
            )}
          />
        </Grid>

        {/* Loan Tenure */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth error={!!errors.loanTenure}>
            <InputLabel id="loan-tenure-label">{LABELS.LOAN_TENURE}</InputLabel>
            <Controller
              name="loanTenure"
              control={control}
              render={({ field }) => (
                <Select 
                  {...field} 
                  labelId="loan-tenure-label" 
                  label={LABELS.LOAN_TENURE}
                  MenuProps={{ disableScrollLock: true }}
                >
                  {LOAN_TENURES.map((t) => (
                    <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText className={styles.helperTextSpacer}>
              {errors.loanTenure?.message || '\u00A0'}
            </FormHelperText>
          </FormControl>
        </Grid>

        {/* Required Loan Amount - Slider + Input */}
        <Grid size={{ xs: 12 }}>
          <Controller
            name="loanAmount"
            control={control}
            render={({ field: { onChange, ref, ...field } }) => (
              <div>
                <NumericFormat
                  {...field}
                  getInputRef={ref}
                  customInput={TextField}
                  fullWidth
                  label={LABELS.LOAN_AMOUNT}
                  placeholder={PLACEHOLDERS.LOAN_AMOUNT}
                  error={!!errors.loanAmount}
                  helperText={errors.loanAmount?.message || (loanAmount ? formatNumberInWords(loanAmount as number) : '\u00A0')}
                  thousandSeparator=","
                  thousandsGroupStyle="lakh"
                  onValueChange={(values) => {
                    onChange(values.floatValue);
                  }}
                  slotProps={{
                    formHelperText: { className: styles.helperTextSpacer },
                    input: {
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }
                  }}
                />
                
                <div className={styles.sliderContainer}>
                  <Slider
                    value={typeof field.value === 'number' ? field.value : 10000}
                    onChange={(_, newValue) => onChange(newValue as number)}
                    min={10000}
                    max={5000000}
                    step={10000}
                    aria-label="Loan Amount Slider"
                  />
                  <div className={styles.sliderLabels}>
                    <span>₹10,000</span>
                    <span>₹50,00,000</span>
                  </div>
                </div>
              </div>
            )}
          />
        </Grid>

        {/* Loan Purpose */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth error={!!errors.loanPurpose}>
            <InputLabel id="loan-purpose-label">{LABELS.LOAN_PURPOSE}</InputLabel>
            <Controller
              name="loanPurpose"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="loan-purpose-label"
                  label={LABELS.LOAN_PURPOSE}
                  MenuProps={{ disableScrollLock: true }}
                  onChange={(e) => {
                    field.onChange(e);
                    if (!shouldShowLoanPurposeOther(e.target.value)) {
                      setValue('loanPurposeOther', '');
                    }
                  }}
                >
                  {LOAN_PURPOSES.map((purpose) => (
                    <MenuItem key={purpose} value={purpose}>
                      {purpose}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText className={styles.helperTextSpacer}>
              {errors.loanPurpose?.message || '\u00A0'}
            </FormHelperText>
          </FormControl>
        </Grid>
        
        {/* Loan Purpose Other */}
        {shouldShowLoanPurposeOther(loanPurpose) && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="loanPurposeOther"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={LABELS.OTHER_PURPOSE}
                  placeholder={PLACEHOLDERS.OTHER_PURPOSE}
                  error={!!errors.loanPurposeOther}
                  helperText={errors.loanPurposeOther?.message || '\u00A0'}
                  slotProps={{ formHelperText: { className: styles.helperTextSpacer } }}
                />
              )}
            />
          </Grid>
        )}
      </Grid>
    </div>
  );
});

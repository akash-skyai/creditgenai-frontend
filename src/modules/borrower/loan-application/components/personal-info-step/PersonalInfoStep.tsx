import { useFormContext, Controller, useWatch } from 'react-hook-form';
import {
  TextField,
  Grid,
  InputAdornment,
  Button
} from '@mui/material';
import { Lock } from 'lucide-react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import type { PersonalInfoFormData } from '../../schemas/personal-info.schema';
import { usePinCode } from '../../hooks/usePinCode';
import { LocationFields } from '../location-fields/LocationFields';
import styles from './PersonalInfoStep.module.scss';

const NextStepButton = ({ onNext }: { onNext: () => void }) => {
  const { formState: { isSubmitting }, trigger, control } = useFormContext<PersonalInfoFormData>();
  const pinCode = useWatch({ name: 'pinCode', control });
  const { isLoading: isPostalLoading } = usePinCode(pinCode || '');

  const handleNext = async () => {
    const isStepValid = await trigger([
      'firstName',
      'middleName',
      'lastName',
      'email',
      'gender',
      'dateOfBirth',
      'panNumber',
      'pinCode',
      'city',
      'state'
    ]);
    if (isStepValid) {
      onNext();
    }
  };

  return (
    <div className={styles.actionContainer}>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleNext}
        className={styles.nextButton}
        disabled={isPostalLoading || isSubmitting}
      >
        Next Step &rarr;
      </Button>
    </div>
  );
};

export function PersonalInfoStep({ onNext }: { onNext: () => void }) {
  const {
    control,
    register,
    formState: { errors }
  } = useFormContext<PersonalInfoFormData>();

  return (
    <div className={styles.stepContainer}>
      <h2 className={styles.stepTitle}>Personal Details</h2>
      <p className={styles.stepSubtitle}>
        Please provide your information exactly as it appears on your PAN card.
      </p>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            label="First Name"
            placeholder="e.g. Rahul"
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            slotProps={{ formHelperText: { className: styles.helperTextSpacer } }}
            {...register('firstName')}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            label="Middle Name"
            placeholder="Optional"
            error={!!errors.middleName}
            helperText={errors.middleName?.message}
            slotProps={{ formHelperText: { className: styles.helperTextSpacer } }}
            {...register('middleName')}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            label="Last Name"
            placeholder="e.g. Sharma"
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            slotProps={{ formHelperText: { className: styles.helperTextSpacer } }}
            {...register('lastName')}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          {/* Assume mobile number is pre-filled from auth state, we can disable it */}
          <TextField
            fullWidth
            label="Mobile Number"
            disabled
            value="9876543210" // TODO: Read from actual auth context/state
            className={styles.readonlyField}
            slotProps={{
              formHelperText: { className: styles.helperTextSpacer },
              input: {
                startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <Lock size={18} className={styles.lockIcon} />
                  </InputAdornment>
                ),
              }
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Email Address"
            placeholder="rahul@example.com"
            type="email"
            error={!!errors.email}
            helperText={errors.email?.message}
            slotProps={{ formHelperText: { className: styles.helperTextSpacer } }}
            {...register('email')}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <div className={styles.genderField}>
                <span className={`${styles.genderLabel} ${errors.gender ? styles.errorText : ''}`}>
                  Gender
                </span>
                <div className={styles.pillGroup} role="radiogroup" aria-label="Gender">
                  {['male', 'female', 'other'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      role="radio"
                      aria-checked={field.value === g}
                      className={`${styles.pillButton} ${field.value === g ? styles.pillActive : ''}`}
                      onClick={() => field.onChange(g)}
                    >
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </button>
                  ))}
                </div>
                <div className={styles.errorSlot}>
                  {errors.gender && <span className={styles.errorHelperText}>{errors.gender.message}</span>}
                </div>
              </div>
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="Date of Birth"
                value={field.value ? dayjs(field.value) : null}
                onChange={(newValue) => {
                  field.onChange(newValue ? newValue.format('YYYY-MM-DD') : '');
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.dateOfBirth,
                    helperText: errors.dateOfBirth?.message,
                    slotProps: { formHelperText: { className: styles.helperTextSpacer } }
                  }
                }}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="PAN Number"
            placeholder="ABCDE1234F"
            error={!!errors.panNumber}
            helperText={errors.panNumber?.message}
            slotProps={{
              htmlInput: { style: { textTransform: 'uppercase' } },
              formHelperText: { className: styles.helperTextSpacer }
            }}
            {...register('panNumber', {
              onChange: (e) => {
                // Auto uppercase
                e.target.value = e.target.value.toUpperCase();
              }
            })}
          />
        </Grid>

        <LocationFields />
      </Grid>

      <NextStepButton onNext={onNext} />
    </div>
  );
}

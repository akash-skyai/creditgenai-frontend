import { useFormContext, Controller } from 'react-hook-form';
import { 
  TextField, 
  Grid, 
  InputAdornment,
  Button
} from '@mui/material';
import { Lock } from 'lucide-react';
import { useEffect } from 'react';
import type { PersonalInfoFormData } from '../../schemas/personalInfo.schema';
import { usePinCode } from '../../hooks/usePinCode';
import styles from './PersonalInfoStep.module.scss';

export function PersonalInfoStep({ onNext }: { onNext: () => void }) {
  const { 
    control, 
    register, 
    formState: { errors }, 
    watch, 
    setValue,
    trigger
  } = useFormContext<PersonalInfoFormData>();

  const pinCode = watch('pinCode');
  
  const { data: postalData, isLoading: isPostalLoading, error: postalError } = usePinCode(pinCode || '');

  // Auto-fill City and State when valid postal data is fetched
  useEffect(() => {
    if (postalData) {
      setValue('city', postalData.city, { shouldValidate: true });
      setValue('state', postalData.state, { shouldValidate: true });
    } else if (postalError) {
      setValue('city', '');
      setValue('state', '');
      // We could set an error on the pinCode field here, but react-hook-form will handle regex.
      // If regex passes but API fails, we could set custom error:
      // setError('pinCode', { type: 'manual', message: postalError.message });
    }
  }, [postalData, postalError, setValue]);

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
                <div className={styles.pillGroup}>
                  {['male', 'female', 'other'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      className={`${styles.pillButton} ${field.value === g ? styles.pillActive : ''}`}
                      onClick={() => field.onChange(g)}
                    >
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </button>
                  ))}
                </div>
                {errors.gender && <span className={styles.errorHelperText}>{errors.gender.message}</span>}
              </div>
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Date of Birth"
            type="date"
            slotProps={{ inputLabel: { shrink: true } }}
            error={!!errors.dateOfBirth}
            helperText={errors.dateOfBirth?.message}
            {...register('dateOfBirth')}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="PAN Number"
            placeholder="ABCDE1234F"
            slotProps={{ htmlInput: { style: { textTransform: 'uppercase' } } }}
            error={!!errors.panNumber}
            helperText={errors.panNumber?.message}
            {...register('panNumber', {
              onChange: (e) => {
                // Auto uppercase
                e.target.value = e.target.value.toUpperCase();
              }
            })}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="PIN Code"
            placeholder="e.g. 400001"
            slotProps={{ htmlInput: { maxLength: 6 } }}
            error={!!errors.pinCode || !!postalError}
            helperText={errors.pinCode?.message || postalError?.message}
            {...register('pinCode')}
          />
          {isPostalLoading && <span className={styles.loadingText}>Fetching City & State...</span>}
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="City"
            disabled
            className={styles.readonlyField}
            error={!!errors.city}
            helperText={errors.city?.message}
            slotProps={{ 
              inputLabel: { shrink: !!watch('city') },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Lock size={18} className={styles.lockIcon} />
                  </InputAdornment>
                ),
              }
            }}
            {...register('city')}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="State"
            disabled
            className={styles.readonlyField}
            error={!!errors.state}
            helperText={errors.state?.message}
            slotProps={{ 
              inputLabel: { shrink: !!watch('state') },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Lock size={18} className={styles.lockIcon} />
                  </InputAdornment>
                ),
              }
            }}
            {...register('state')}
          />
        </Grid>
      </Grid>

      <div className={styles.actionContainer}>
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          onClick={handleNext}
          className={styles.nextButton}
        >
          Next Step &rarr;
        </Button>
      </div>
    </div>
  );
}

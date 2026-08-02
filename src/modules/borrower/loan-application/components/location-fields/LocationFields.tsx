import { useFormContext } from 'react-hook-form';
import {
  TextField,
  Grid,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { Lock, CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';
import type { PersonalInfoFormData } from '../../schemas/personal-info.schema';
import { usePinCode } from '../../hooks/usePinCode';
import styles from '../personal-info-step/PersonalInfoStep.module.scss';

export function LocationFields() {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<PersonalInfoFormData>();

  const pinCode = watch('pinCode');
  const city = watch('city');
  const state = watch('state');

  const { data: postalData, isLoading: isPostalLoading, error: postalError } = usePinCode(pinCode || '');

  // Auto-fill City and State when valid postal data is fetched
  useEffect(() => {
    if (postalData) {
      setValue('city', postalData.city, { shouldValidate: true });
      setValue('state', postalData.state, { shouldValidate: true });
    } else if (postalError) {
      setValue('city', '');
      setValue('state', '');
    }
  }, [postalData, postalError, setValue]);

  return (
    <>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="PIN Code"
          placeholder="e.g. 400001"
          error={!!errors.pinCode || !!postalError}
          helperText={errors.pinCode?.message || postalError?.message}
          slotProps={{
            htmlInput: { maxLength: 6 },
            formHelperText: { className: styles.helperTextSpacer }
          }}
          {...register('pinCode')}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="City"
          error={!!errors.city}
          helperText={errors.city?.message}
          slotProps={{
            inputLabel: { shrink: !!city || isPostalLoading },
            formHelperText: { className: styles.helperTextSpacer },
            input: {
              endAdornment: isPostalLoading ? (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              ) : (postalData && city === postalData.city) ? (
                <InputAdornment position="end">
                  <CheckCircle2 size={18} className={styles.successIcon} />
                </InputAdornment>
              ) : null,
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
            inputLabel: { shrink: !!state || isPostalLoading },
            formHelperText: { className: styles.helperTextSpacer },
            input: {
              endAdornment: isPostalLoading ? (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              ) : postalData ? (
                <InputAdornment position="end">
                  <CheckCircle2 size={18} className={styles.successIcon} />
                </InputAdornment>
              ) : (
                <InputAdornment position="end">
                  <Lock size={18} className={styles.lockIcon} />
                </InputAdornment>
              ),
            }
          }}
          {...register('state')}
        />
      </Grid>
    </>
  );
}

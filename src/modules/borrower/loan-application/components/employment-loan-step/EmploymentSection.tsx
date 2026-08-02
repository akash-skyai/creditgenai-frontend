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
  FormHelperText
} from '@mui/material';
import { Briefcase, User, Building2 } from 'lucide-react';

import type { EmploymentSectionProps } from './employment.types';
import { 
  EMPLOYMENT_TYPES, 
  SECTORS, 
  BUSINESS_TYPES, 
  EXPERIENCE_OPTIONS, 
  LABELS, 
  PLACEHOLDERS
} from './employment.constants';
import { 
  isSalaried, 
  shouldShowCompanyFields, 
  shouldShowGovernmentFields, 
  shouldShowBusinessFields,
  getMonthlyIncomeLabel,
  getEmployerLabel,
  formatNumberInWords,
  resetEmploymentFields
} from './employment.utils';
import styles from './EmploymentLoanStep.module.scss';

const EmploymentIcons = {
  briefcase: <Briefcase size={18} />,
  user: <User size={18} />
};

export const EmploymentSection = memo(function EmploymentSection({ control, errors, setValue }: EmploymentSectionProps) {
  const [employmentType, sector, monthlyIncome] = useWatch({ 
    control, 
    name: ['employmentType', 'sector', 'monthlyIncome'] 
  });

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardIcon}>
          <Building2 size={24} />
        </div>
        <h3 className={styles.cardTitle}>{LABELS.EMPLOYMENT_TITLE}</h3>
      </div>

      <Grid container spacing={3}>
        {/* Employment Type */}
        <Grid size={{ xs: 12 }}>
          <Controller
            name="employmentType"
            control={control}
            render={({ field }) => (
              <div className={styles.pillField}>
                <span 
                  id="employment-type-label"
                  className={`${styles.pillLabel} ${errors.employmentType ? styles.errorText : ''}`}
                >
                  {LABELS.EMPLOYMENT_TYPE}
                </span>
                <div className={styles.pillGroup} role="radiogroup" aria-labelledby="employment-type-label">
                  {EMPLOYMENT_TYPES.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      role="radio"
                      aria-checked={field.value === type.value}
                      className={`${styles.pillButton} ${field.value === type.value ? styles.pillActive : ''}`}
                      onClick={() => {
                        field.onChange(type.value);
                        resetEmploymentFields(setValue);
                      }}
                    >
                      {EmploymentIcons[type.icon as keyof typeof EmploymentIcons]}
                      {type.label}
                    </button>
                  ))}
                </div>
                <div className={styles.errorSlot}>
                  {errors.employmentType && (
                    <span className={styles.errorHelperText}>{errors.employmentType.message}</span>
                  )}
                </div>
              </div>
            )}
          />
        </Grid>

        {/* Dynamic adjacent field (Sector or Business Type) */}
        {isSalaried(employmentType) && (
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth error={!!errors.sector}>
              <InputLabel id="sector-label">{LABELS.SECTOR}</InputLabel>
              <Controller
                name="sector"
                control={control}
                render={({ field }) => (
                  <Select 
                    {...field} 
                    labelId="sector-label" 
                    label={LABELS.SECTOR}
                    MenuProps={{ disableScrollLock: true }}
                    onChange={(e) => {
                      field.onChange(e);
                      setValue('companyName', '');
                      setValue('companyExperience', '');
                      setValue('organizationEmployer', '');
                    }}
                  >
                    {SECTORS.map((s) => (
                      <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText className={styles.helperTextSpacer}>
                {errors.sector?.message || '\u00A0'}
              </FormHelperText>
            </FormControl>
          </Grid>
        )}

        {shouldShowBusinessFields(employmentType) && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!errors.businessType}>
              <InputLabel id="business-type-label">{LABELS.BUSINESS_TYPE}</InputLabel>
              <Controller
                name="businessType"
                control={control}
                render={({ field }) => (
                  <Select 
                    {...field} 
                    labelId="business-type-label" 
                    label={LABELS.BUSINESS_TYPE}
                    MenuProps={{ disableScrollLock: true }}
                  >
                    {BUSINESS_TYPES.map((b) => (
                      <MenuItem key={b} value={b}>{b}</MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText className={styles.helperTextSpacer}>
                {errors.businessType?.message || '\u00A0'}
              </FormHelperText>
            </FormControl>
          </Grid>
        )}

        {/* Salaried - Private Sector Fields */}
        {shouldShowCompanyFields(employmentType, sector) && (
          <>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="companyName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={LABELS.COMPANY_NAME}
                    placeholder={PLACEHOLDERS.COMPANY_NAME}
                    error={!!errors.companyName}
                    helperText={errors.companyName?.message || '\u00A0'}
                    slotProps={{ formHelperText: { className: styles.helperTextSpacer } }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth error={!!errors.companyExperience}>
                <InputLabel id="company-experience-label">{LABELS.COMPANY_EXPERIENCE}</InputLabel>
                <Controller
                  name="companyExperience"
                  control={control}
                  render={({ field }) => (
                    <Select 
                      {...field} 
                      labelId="company-experience-label" 
                      label={LABELS.COMPANY_EXPERIENCE}
                      MenuProps={{ disableScrollLock: true }}
                    >
                      {EXPERIENCE_OPTIONS.map((e) => (
                        <MenuItem key={e} value={e}>{e}</MenuItem>
                      ))}
                    </Select>
                  )}
                />
                <FormHelperText className={styles.helperTextSpacer}>
                  {errors.companyExperience?.message || '\u00A0'}
                </FormHelperText>
              </FormControl>
            </Grid>
          </>
        )}

        {/* Salaried - Government Sector Fields */}
        {shouldShowGovernmentFields(employmentType, sector) && (
          <Grid size={{ xs: 12 }}>
            <Controller
              name="organizationEmployer"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={getEmployerLabel(sector)}
                  placeholder={PLACEHOLDERS.ORGANIZATION}
                  error={!!errors.organizationEmployer}
                  helperText={errors.organizationEmployer?.message || '\u00A0'}
                  slotProps={{ formHelperText: { className: styles.helperTextSpacer } }}
                />
              )}
            />
          </Grid>
        )}

        {/* Self Employed - Total Experience */}
        {shouldShowBusinessFields(employmentType) && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!errors.totalExperience}>
              <InputLabel id="experience-label">{LABELS.TOTAL_EXPERIENCE}</InputLabel>
              <Controller
                name="totalExperience"
                control={control}
                render={({ field }) => (
                  <Select 
                    {...field} 
                    labelId="experience-label" 
                    label={LABELS.TOTAL_EXPERIENCE}
                    MenuProps={{ disableScrollLock: true }}
                  >
                    {EXPERIENCE_OPTIONS.map((e) => (
                      <MenuItem key={e} value={e}>{e}</MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText className={styles.helperTextSpacer}>
                {errors.totalExperience?.message || '\u00A0'}
              </FormHelperText>
            </FormControl>
          </Grid>
        )}

        {/* Monthly Income / Revenue */}
        <Grid size={{ xs: 12 }}>
          <Controller
            name="monthlyIncome"
            control={control}
            render={({ field }) => (
              <div>
                <NumericFormat
                  {...field}
                  customInput={TextField}
                  fullWidth
                  label={getMonthlyIncomeLabel(employmentType)}
                  placeholder={PLACEHOLDERS.MONTHLY_INCOME}
                  error={!!errors.monthlyIncome}
                  helperText={errors.monthlyIncome?.message ?? (monthlyIncome ? formatNumberInWords(monthlyIncome as number) : ' ')}
                  thousandSeparator=","
                  onValueChange={(values) => {
                    field.onChange(values.floatValue);
                  }}
                  slotProps={{
                    formHelperText: { className: styles.helperTextSpacer },
                    input: {
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }
                  }}
                />
              </div>
            )}
          />
        </Grid>
      </Grid>
    </div>
  );
});

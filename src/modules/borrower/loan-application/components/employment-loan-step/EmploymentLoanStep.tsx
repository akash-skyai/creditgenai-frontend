import { useFormContext, Controller, useWatch } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { 
  TextField, 
  Grid, 
  InputAdornment,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
  Collapse,
  Slider,
  Checkbox
} from '@mui/material';
import { Briefcase, Banknote, User, ShieldCheck } from 'lucide-react';
import type { LoanApplicationFormData } from '../../schemas/loan-application.schema';
import { numberToWords } from '@/shared/utils/numberToWords';
import styles from './EmploymentLoanStep.module.scss';
import { useState } from 'react';

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

const SECTORS = ['Private Sector', 'Government Sector'];
const BUSINESS_TYPES = ['Sole Proprietor / Business Owner', 'Partnership Firm', 'Pvt Ltd Director', 'Freelancer / Consultant'];
const EXPERIENCES = ['0-2 Years', '3-5 Years', '5-10 Years', '10+ Years'];
const LOAN_TENURES = ['12', '24', '36', '48', '60', '72', '84'];

export function EmploymentLoanStep({ onNext, onBack }: EmploymentLoanStepProps) {
  const { 
    control, 
    formState: { errors }, 
    trigger,
    setValue
  } = useFormContext<LoanApplicationFormData>();

  const [hasConsent, setHasConsent] = useState(false);

  const employmentType = useWatch({ control, name: 'employmentType' });
  const loanPurpose = useWatch({ control, name: 'loanPurpose' });
  const sector = useWatch({ control, name: 'sector' });
  const monthlyIncome = useWatch({ control, name: 'monthlyIncome' });
  const loanAmount = useWatch({ control, name: 'loanAmount' });

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

      {/* Employment Details Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardIcon}>
            <Briefcase size={24} />
          </div>
          <h3 className={styles.cardTitle}>Employment Details</h3>
        </div>

        <Grid container spacing={3}>
          {/* Employment Type */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="employmentType"
            control={control}
            render={({ field }) => (
              <div className={styles.pillField}>
                <span className={`${styles.pillLabel} ${errors.employmentType ? styles.errorText : ''}`}>
                  Employment Type
                </span>
                <div className={styles.pillGroup} role="radiogroup" aria-label="Employment Type">
                  {['salaried', 'self-employed'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      role="radio"
                      aria-checked={field.value === type}
                      className={`${styles.pillButton} ${field.value === type ? styles.pillActive : ''}`}
                      onClick={() => {
                        field.onChange(type);
                        if (type === 'salaried') {
                          setValue('businessType', '');
                          setValue('totalExperience', '');
                        } else {
                          setValue('sector', '');
                          setValue('companyName', '');
                          setValue('companyExperience', '');
                          setValue('organizationEmployer', '');
                        }
                      }}
                    >
                      {type === 'salaried' ? <Briefcase size={18} /> : <User size={18} />}
                      {type === 'salaried' ? 'Salaried' : 'Self-employed'}
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
        <Grid size={{ xs: 12, sm: 6 }}>
          {employmentType === 'salaried' && (
            <FormControl fullWidth error={!!errors.sector}>
              <InputLabel id="sector-label">Employee Sector</InputLabel>
              <Controller
                name="sector"
                control={control}
                render={({ field }) => (
                  <Select 
                    {...field} 
                    labelId="sector-label" 
                    label="Employee Sector"
                    MenuProps={{ disableScrollLock: true }}
                    onChange={(e) => {
                      field.onChange(e);
                      if (e.target.value === 'Government Sector') {
                        setValue('companyName', '');
                        setValue('companyExperience', '');
                      } else {
                        setValue('organizationEmployer', '');
                      }
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
          )}

          {employmentType === 'self-employed' && (
            <FormControl fullWidth error={!!errors.businessType}>
              <InputLabel id="business-type-label">Self-Employed Status</InputLabel>
              <Controller
                name="businessType"
                control={control}
                render={({ field }) => (
                  <Select 
                    {...field} 
                    labelId="business-type-label" 
                    label="Self-Employed Status"
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
          )}
        </Grid>

        {/* Salaried - Private Sector Fields */}
        {employmentType === 'salaried' && sector === 'Private Sector' && (
          <>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="companyName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Company Name"
                    placeholder="e.g. Acme Corp"
                    error={!!errors.companyName}
                    helperText={errors.companyName?.message || '\u00A0'}
                    slotProps={{ formHelperText: { className: styles.helperTextSpacer } }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth error={!!errors.companyExperience}>
                <InputLabel id="company-experience-label">Company Experience</InputLabel>
                <Controller
                  name="companyExperience"
                  control={control}
                  render={({ field }) => (
                    <Select 
                      {...field} 
                      labelId="company-experience-label" 
                      label="Company Experience"
                      MenuProps={{ disableScrollLock: true }}
                    >
                      {EXPERIENCES.map((e) => (
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
        {employmentType === 'salaried' && sector === 'Government Sector' && (
          <Grid size={{ xs: 12 }}>
            <Controller
              name="organizationEmployer"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Organization / Employer"
                  placeholder="e.g. State Bank of India, Indian Railways"
                  error={!!errors.organizationEmployer}
                  helperText={errors.organizationEmployer?.message || '\u00A0'}
                  slotProps={{ formHelperText: { className: styles.helperTextSpacer } }}
                />
              )}
            />
          </Grid>
        )}

        {/* Self Employed - Total Experience */}
        {employmentType === 'self-employed' && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!errors.totalExperience}>
              <InputLabel id="experience-label">Total Experience</InputLabel>
              <Controller
                name="totalExperience"
                control={control}
                render={({ field }) => (
                  <Select 
                    {...field} 
                    labelId="experience-label" 
                    label="Total Experience"
                    MenuProps={{ disableScrollLock: true }}
                  >
                    {EXPERIENCES.map((e) => (
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
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="monthlyIncome"
            control={control}
            render={({ field }) => (
              <div>
                <NumericFormat
                  {...field}
                  customInput={TextField}
                  fullWidth
                  label={employmentType === 'salaried' ? 'Take-Home Salary' : 'Average Monthly Income'}
                  placeholder="e.g. 50,000"
                  error={!!errors.monthlyIncome}
                  helperText={errors.monthlyIncome?.message || (monthlyIncome ? numberToWords(monthlyIncome as number) : '\u00A0')}
                  thousandSeparator=","
                  valueIsNumericString
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

      {/* Loan Details Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardIcon}>
            <Banknote size={24} />
          </div>
          <h3 className={styles.cardTitle}>Loan Details</h3>
        </div>

        <Grid container spacing={3}>
          {/* Existing EMI */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="existingEmi"
            control={control}
            render={({ field }) => (
              <NumericFormat
                {...field}
                customInput={TextField}
                fullWidth
                label="Existing Total EMI (if any)"
                placeholder="e.g. 0"
                error={!!errors.existingEmi}
                helperText={errors.existingEmi?.message || '\u00A0'}
                thousandSeparator=","
                valueIsNumericString
                onValueChange={(values) => {
                  field.onChange(values.floatValue || 0);
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

        {/* Required Loan Amount - Slider + Input */}
        <Grid size={{ xs: 12 }}>
          <Controller
            name="loanAmount"
            control={control}
            render={({ field }) => (
              <div>
                <NumericFormat
                  {...field}
                  customInput={TextField}
                  fullWidth
                  label="Required Loan Amount"
                  placeholder="e.g. 2,00,000"
                  error={!!errors.loanAmount}
                  helperText={errors.loanAmount?.message || (loanAmount ? numberToWords(loanAmount as number) : '\u00A0')}
                  thousandSeparator=","
                  valueIsNumericString
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
                
                <div className={styles.sliderContainer}>
                  <Slider
                    value={typeof field.value === 'number' ? field.value : 10000}
                    onChange={(_, newValue) => field.onChange(newValue as number)}
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
            <InputLabel id="loan-purpose-label">Loan Purpose</InputLabel>
            <Controller
              name="loanPurpose"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="loan-purpose-label"
                  label="Loan Purpose"
                  MenuProps={{ disableScrollLock: true }}
                  onChange={(e) => {
                    field.onChange(e);
                    if (e.target.value !== 'Other') {
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
        
        {/* Loan Tenure */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth error={!!errors.loanTenure}>
            <InputLabel id="loan-tenure-label">Loan Tenure (Months)</InputLabel>
            <Controller
              name="loanTenure"
              control={control}
              render={({ field }) => (
                <Select 
                  {...field} 
                  labelId="loan-tenure-label" 
                  label="Loan Tenure (Months)"
                  MenuProps={{ disableScrollLock: true }}
                >
                  {LOAN_TENURES.map((t) => (
                    <MenuItem key={t} value={t}>{t} Months</MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText className={styles.helperTextSpacer}>
              {errors.loanTenure?.message || '\u00A0'}
            </FormHelperText>
          </FormControl>
        </Grid>

        {/* Loan Purpose Other */}
        {loanPurpose === 'Other' && (
          <Grid size={{ xs: 12 }}>
            <Controller
              name="loanPurposeOther"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Please Specify Loan Purpose"
                  placeholder="E.g. Buying a new laptop"
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

      <div className={styles.consentContainer}>
        <div className={styles.consentIcon}>
          <ShieldCheck size={28} />
        </div>
        <div className={styles.consentCheckboxWrapper}>
          <Checkbox 
            id="consent-checkbox"
            checked={hasConsent} 
            onChange={(e) => setHasConsent(e.target.checked)} 
          />
          <label htmlFor="consent-checkbox" className={styles.consentLabel}>
            I confirm that the above information is correct to the best of my knowledge.
          </label>
        </div>
      </div>

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
          className={styles.navButton}
        >
          Next Step &rarr;
        </Button>
      </div>
    </div>
  );
}

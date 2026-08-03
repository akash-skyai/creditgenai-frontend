import { Checkbox } from '@mui/material';
import { ShieldCheck } from 'lucide-react';
import type { ConsentSectionProps } from '../../../types/employment.types';
import styles from '../EmploymentLoanStep.module.scss';

export function ConsentSection({ checked, onChange }: ConsentSectionProps) {
  return (
    <div className={styles.consentContainer}>
      <div className={styles.consentIcon}>
        <ShieldCheck size={28} />
      </div>
      <div className={styles.consentCheckboxWrapper}>
        <Checkbox 
          id="consent-checkbox"
          checked={checked} 
          onChange={(e) => onChange(e.target.checked)} 
        />
        <label htmlFor="consent-checkbox" className={styles.consentLabel}>
          I confirm that the above information is correct to the best of my knowledge.
        </label>
      </div>
    </div>
  );
}

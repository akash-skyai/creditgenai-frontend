import { CheckCircle2 } from 'lucide-react';
import styles from './SuccessScreen.module.scss';
import { Button } from '@mui/material';

export function SuccessScreen({ referenceId }: { referenceId: string }) {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <CheckCircle2 size={64} className={styles.successIcon} />
      </div>
      
      <h2 className={styles.title}>Application Submitted Successfully!</h2>
      <p className={styles.subtitle}>
        Your loan application is currently under review.
      </p>
      
      <div className={styles.referenceBox}>
        <span className={styles.referenceLabel}>Application Reference ID</span>
        <span className={styles.referenceValue}>{referenceId}</span>
      </div>
      
      <div className={styles.nextSteps}>
        <h3>Next Steps</h3>
        <ul>
          <li>Our underwriting team will verify your details.</li>
          <li>You will receive an update via SMS and Email within 24 hours.</li>
          <li>Our advisor will contact you for any additional requirements.</li>
        </ul>
      </div>
      
      <Button 
        variant="outlined" 
        color="primary"
        onClick={() => window.location.href = '/'}
        className={styles.homeButton}
      >
        Return to Home
      </Button>
    </div>
  );
}

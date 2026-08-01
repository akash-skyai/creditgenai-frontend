import type { ReactNode } from 'react';
import styles from './BorrowerAuthLayout.module.scss';
import { ShieldCheck } from 'lucide-react';
import { BorrowerNavbar } from '../components/borrower-navbar/BorrowerNavbar';

interface BorrowerAuthLayoutProps {
  children: ReactNode;
}

export function BorrowerAuthLayout({ children }: BorrowerAuthLayoutProps) {
  return (
    <div className={styles.layoutContainer}>
      <BorrowerNavbar />
      <div className={styles.splitContainer}>
        {/* Left Side: Branding / Marketing */}
        <div className={styles.leftPanel}>
          <div className={styles.brandingContent}>
            <h1 className={styles.heading}>
              Your fast track to financial freedom.
            </h1>
            <p className={styles.subheading}>
              Zero hidden fees. Instant approvals. See why 500,00+ Indians trust CreditGenAI.
            </p>

            <div className={styles.trustBadge}>
              <ShieldCheck size={20} className={styles.trustIcon} />
              <span>RBI Registered NBFC Partner</span>
            </div>
          </div>
        </div>

        {/* Right Side: Dynamic Form Area */}
        <div className={styles.rightPanel}>
          <div className={styles.formContainer}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

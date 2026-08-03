import type { ReactNode } from 'react';
import styles from './BorrowerAuthLayout.module.scss';
import { ShieldCheck, Zap, Lock, FileCheck } from 'lucide-react';
import { BorrowerNavbar } from '../../components/borrower-navbar/BorrowerNavbar';

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
            <div className={styles.trustBadge}>
              <ShieldCheck size={18} className={styles.trustIcon} />
              <span>RBI Registered NBFC Partner</span>
            </div>

            <h1 className={styles.heading}>
              Your fast track to financial freedom.
            </h1>
            <p className={styles.subheading}>
              Zero hidden fees. Instant approvals. See why over 5 Lakh+ Indians trust CreditGenAI for instant loans.
            </p>

            <div className={styles.featuresList}>
              <div className={styles.featureItem}>
                <div className={styles.featureIconWrapper}>
                  <Zap size={18} className={styles.featureIcon} />
                </div>
                <div>
                  <h4 className={styles.featureTitle}>2-Minute Approval</h4>
                  <p className={styles.featureDesc}>Instant decision with digital verification</p>
                </div>
              </div>

              <div className={styles.featureItem}>
                <div className={styles.featureIconWrapper}>
                  <Lock size={18} className={styles.featureIcon} />
                </div>
                <div>
                  <h4 className={styles.featureTitle}>256-bit Bank Grade Security</h4>
                  <p className={styles.featureDesc}>Your data is fully encrypted and safe</p>
                </div>
              </div>

              <div className={styles.featureItem}>
                <div className={styles.featureIconWrapper}>
                  <FileCheck size={18} className={styles.featureIcon} />
                </div>
                <div>
                  <h4 className={styles.featureTitle}>Zero Physical Documents</h4>
                  <p className={styles.featureDesc}>100% paperless digital experience</p>
                </div>
              </div>
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


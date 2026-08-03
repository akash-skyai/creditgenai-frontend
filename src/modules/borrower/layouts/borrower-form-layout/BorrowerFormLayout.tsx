import type { ReactNode } from 'react';
import styles from './BorrowerFormLayout.module.scss';
import { BorrowerNavbar } from '../../components/borrower-navbar/BorrowerNavbar';

interface BorrowerFormLayoutProps {
  children: ReactNode;
}

export function BorrowerFormLayout({ children }: BorrowerFormLayoutProps) {
  // In a real app we might determine step text via context or route matching
  const stepText = "Step 1 of 3 — Personal Details";

  return (
    <div className={styles.layoutContainer}>
      <BorrowerNavbar stepText={stepText} />
      <div className={styles.contentContainer}>
        <div className={styles.formCardWrapper}>
          {children}
        </div>
      </div>
    </div>
  );
}

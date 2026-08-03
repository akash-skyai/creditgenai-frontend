import React from 'react';
import styles from './BorrowerNavbar.module.scss';

interface BorrowerNavbarProps {
  stepText?: string;
}

export const BorrowerNavbar: React.FC<BorrowerNavbarProps> = ({ stepText }) => {
  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logoArea}>
          <div className={styles.logoPlaceholder}>
            <span className={styles.logoIcon}>G</span>
            <span className={styles.logoText}>CreditGenAI</span>
          </div>
        </div>
        {stepText && (
          <div className={styles.stepArea}>
            <span className={styles.stepText}>{stepText}</span>
          </div>
        )}
      </div>
    </header>
  );
};

import React from 'react';
import styles from './BorrowerLayout.module.scss';
import { BadgeCheck, ShieldCheck, Layers, Briefcase } from 'lucide-react';

interface BorrowerLayoutProps {
  children: React.ReactNode;
}

const trustBadges = [
  { label: 'Feature Badges', icon: BadgeCheck },
  { label: '100% Payments', icon: ShieldCheck },
  { label: 'KYC Cleaning', icon: Layers },
  { label: 'Loan Design', icon: Briefcase },
];

export const BorrowerLayout: React.FC<BorrowerLayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      {/* Left Panel - Hidden on Mobile */}
      <div className={styles.leftPanel}>
        <div className={styles.brandingContainer}>
          <h1 className={styles.logo}>CreditGenAI</h1>
          <div className={styles.badgesGrid}>
            {trustBadges.map((badge, index) => (
              <div key={index} className={styles.badge}>
                <badge.icon size={16} className={styles.badgeIcon} />
                <span>{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Contains the actual form/page content */}
      <div className={styles.rightPanel}>
        <div className={styles.contentContainer}>
          {children}
        </div>
      </div>
    </div>
  );
};

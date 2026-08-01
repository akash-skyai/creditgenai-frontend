import React from 'react';
import { Skeleton } from '@mui/material';
import styles from './AuthCardSkeleton.module.scss';

export const AuthCardSkeleton: React.FC = () => {
  return (
    <div className={styles.formContent} data-testid="auth-card-skeleton">
      {/* Header mimics PhoneForm/OtpForm header */}
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <Skeleton variant="circular" width={48} height={48} animation="wave" />
        </div>
        <Skeleton 
          variant="text" 
          width="75%" 
          height={32} 
          animation="wave" 
          className={styles.titleSkeleton} 
        />
        <Skeleton 
          variant="text" 
          width="90%" 
          height={20} 
          animation="wave" 
          className={styles.subtitleSkeleton} 
        />
      </div>

      {/* Form Area mimics PhoneForm inputs */}
      <div className={styles.form}>
        <div className={styles.inputSkeletonGroup}>
          <Skeleton 
            variant="rectangular" 
            height={52} 
            animation="wave" 
            className={styles.inputSkeleton} 
          />
        </div>
        <div className={styles.errorSlot} />
        <Skeleton 
          variant="rectangular" 
          height={48} 
          animation="wave" 
          className={styles.buttonSkeleton} 
        />
      </div>

      {/* Terms Area mimics PhoneForm terms */}
      <Skeleton 
        variant="text" 
        width="80%" 
        height={16} 
        animation="wave" 
        className={styles.termsSkeleton} 
      />
    </div>
  );
};

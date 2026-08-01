import React from 'react';
import { Skeleton, Grid, Box } from '@mui/material';
import pageStyles from '../../pages/loan-application/LoanApplicationPage.module.scss';
import stepStyles from '../personal-info-step/PersonalInfoStep.module.scss';
import styles from './FormPageSkeleton.module.scss';

export const FormPageSkeleton: React.FC = () => {
  return (
    <div className={pageStyles.pageContainer} data-testid="form-page-skeleton">
      <div className={pageStyles.formCard}>
        {/* Stepper Skeleton (mimics real stepper padding and border) */}
        <div className={pageStyles.stepperWrapper}>
          <div className={styles.stepperSkeletonFlex}>
             <Skeleton variant="circular" width={32} height={32} animation="wave" />
             <Skeleton variant="text" width={100} height={20} animation="wave" />
             <div className={styles.stepperLine} />
             <Skeleton variant="circular" width={32} height={32} animation="wave" />
             <Skeleton variant="text" width={140} height={20} animation="wave" />
             <div className={styles.stepperLine} />
             <Skeleton variant="circular" width={32} height={32} animation="wave" />
             <Skeleton variant="text" width={80} height={20} animation="wave" />
          </div>
        </div>

        {/* Content Skeleton (mimics PersonalInfoStep) */}
        <Box className={pageStyles.stepContent}>
          <div className={stepStyles.stepContainer}>
            <Skeleton variant="text" width="40%" height={40} animation="wave" className={styles.titleSkeleton} />
            <Skeleton variant="text" width="70%" height={24} animation="wave" className={styles.subtitleSkeleton} />

            <Grid container spacing={3}>
              {Array.from({ length: 6 }).map((_, index) => (
                <Grid size={{ xs: 12, sm: 6 }} key={index}>
                  <Skeleton variant="rectangular" height={56} animation="wave" className={styles.fieldSkeleton} />
                </Grid>
              ))}
            </Grid>

            <div className={stepStyles.actionContainer}>
              <Skeleton variant="rectangular" width={140} height={44} animation="wave" className={styles.buttonSkeleton} />
            </div>
          </div>
        </Box>
      </div>
    </div>
  );
};

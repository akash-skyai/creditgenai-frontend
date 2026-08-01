import { lazy, Suspense } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { BorrowerAuthLayout } from '@/modules/borrower/layouts/borrower-auth-layout/BorrowerAuthLayout';
import { BorrowerFormLayout } from '@/modules/borrower/layouts/borrower-form-layout/BorrowerFormLayout';
import { AuthCardSkeleton } from '@/modules/borrower/auth/components/auth-card-skeleton/AuthCardSkeleton';
import { FormPageSkeleton } from '@/modules/borrower/loan-application/components/form-page-skeleton/FormPageSkeleton';

// Lazy load the pages
const PhoneEntryPage = lazy(() => import('@/modules/borrower/auth/pages/phone-entry/PhoneEntryPage').then(m => ({ default: m.PhoneEntryPage })));
const OtpVerifyPage = lazy(() => import('@/modules/borrower/auth/pages/otp-verify/OtpVerifyPage').then(m => ({ default: m.OtpVerifyPage })));
const LoanApplicationPage = lazy(() => import('@/modules/borrower/loan-application/pages/loan-application/LoanApplicationPage').then(m => ({ default: m.LoanApplicationPage })));

export default function BorrowerRoutes() {
  return (
    <Routes>
      {/* PUBLIC ROUTES (Auth Layout) */}
      <Route element={<BorrowerAuthLayout><Outlet /></BorrowerAuthLayout>}>
        <Route 
          path="/" 
          element={
            <Suspense fallback={<AuthCardSkeleton />}>
              <PhoneEntryPage />
            </Suspense>
          } 
        />
        <Route 
          path="verify-otp" 
          element={
            <Suspense fallback={<AuthCardSkeleton />}>
              <OtpVerifyPage />
            </Suspense>
          } 
        />
      </Route>

      {/* FORM ROUTES (Form Layout) */}
      <Route element={<BorrowerFormLayout><Outlet /></BorrowerFormLayout>}>
        <Route 
          path="form" 
          element={
            <Suspense fallback={<FormPageSkeleton />}>
              <LoanApplicationPage />
            </Suspense>
          } 
        />
      </Route>
    </Routes>
  );
}

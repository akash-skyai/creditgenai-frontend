import { lazy, Suspense } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { BorrowerLayout } from '@/modules/borrower/layouts/borrower-layout/BorrowerLayout';

// Lazy load the pages
const PhoneEntryPage = lazy(() => import('@/modules/borrower/auth/pages/phone-entry/PhoneEntryPage').then(m => ({ default: m.PhoneEntryPage })));
const OtpVerifyPage = lazy(() => import('@/modules/borrower/auth/pages/otp-verify/OtpVerifyPage').then(m => ({ default: m.OtpVerifyPage })));
const LoanApplicationPage = lazy(() => import('@/modules/borrower/loan-application/pages/LoanApplicationPage/LoanApplicationPage').then(m => ({ default: m.LoanApplicationPage })));

// A simple fallback until we build the real PageLoader
const Loader = () => <div>Loading...</div>;

export default function BorrowerRoutes() {
  return (
    <Routes>
      <Route element={<BorrowerLayout><Outlet /></BorrowerLayout>}>
        {/* PUBLIC ROUTE */}
        <Route 
          path="/" 
          element={
            <Suspense fallback={<Loader />}>
              <PhoneEntryPage />
            </Suspense>
          } 
        />
        
        <Route 
          path="verify-otp" 
          element={
            <Suspense fallback={<Loader />}>
              <OtpVerifyPage />
            </Suspense>
          } 
        />
        
        <Route 
          path="form" 
          element={
            <Suspense fallback={<Loader />}>
              <LoanApplicationPage />
            </Suspense>
          } 
        />
      </Route>
    </Routes>
  );
}

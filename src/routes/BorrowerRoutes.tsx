import { lazy, Suspense } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { BorrowerLayout } from '@/modules/borrower/layouts/borrower-layout/BorrowerLayout';

// Lazy load the pages
const PhoneEntryPage = lazy(() => import('@/modules/borrower/auth/pages/phone-entry/PhoneEntryPage').then(m => ({ default: m.PhoneEntryPage })));

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
        
        {/* We will add OtpVerifyPage and LoanApplicationPage here later */}
      </Route>
    </Routes>
  );
}

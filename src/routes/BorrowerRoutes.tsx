import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import BorrowerLayout from '@/modules/borrower/layouts/BorrowerLayout/BorrowerLayout';

// Lazy load the pages
const PhoneEntryPage = lazy(() => import('@/modules/borrower/auth/pages/PhoneEntryPage/PhoneEntryPage'));

// A simple fallback until we build the real PageLoader
const Loader = () => <div>Loading...</div>;

export default function BorrowerRoutes() {
  return (
    <Routes>
      <Route element={<BorrowerLayout />}>
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

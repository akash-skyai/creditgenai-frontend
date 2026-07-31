import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BorrowerRoutes from './BorrowerRoutes';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Mount the borrower flow at /apply */}
        <Route path="/apply/*" element={<BorrowerRoutes />} />
        
        {/* Redirect root to /apply for now since it's the only module we have */}
        <Route path="/" element={<Navigate to="/apply" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

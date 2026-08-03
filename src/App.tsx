import AppRoutes from './routes/AppRoutes';
import { ErrorBoundary } from './shared/components/ErrorBoundary/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  );
}

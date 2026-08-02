import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PersonalInfoStep } from './PersonalInfoStep';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personalInfoSchema } from '../../schemas/personal-info.schema';
import type { PersonalInfoFormData } from '../../schemas/personal-info.schema';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// Mock the TanStack Query hook
vi.mock('../../hooks/usePinCode', () => ({
  usePinCode: vi.fn(() => ({ data: null, isLoading: false, error: null }))
}));

const queryClient = new QueryClient();

function Wrapper({ children }: { children: React.ReactNode }) {
  const methods = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema)
  });
  
  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <FormProvider {...methods}>
          {children}
        </FormProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  );
}

describe('PersonalInfoStep', () => {
  it('renders correctly', () => {
    const handleNext = vi.fn();
    render(
      <Wrapper>
        <PersonalInfoStep onNext={handleNext} />
      </Wrapper>
    );

    expect(screen.getByText('Personal Details')).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/PAN Number/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Next/i })).toBeInTheDocument();
  });
});

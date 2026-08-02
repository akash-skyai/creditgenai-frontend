import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LocationFields } from './LocationFields';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personalInfoSchema } from '../../schemas/personal-info.schema';
import type { PersonalInfoFormData } from '../../schemas/personal-info.schema';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
      <FormProvider {...methods}>
        {children}
      </FormProvider>
    </QueryClientProvider>
  );
}

describe('LocationFields', () => {
  it('renders LocationFields components correctly', () => {
    render(
      <Wrapper>
        <LocationFields />
      </Wrapper>
    );

    expect(screen.getByLabelText(/PIN Code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/State/i)).toBeInTheDocument();
  });
});

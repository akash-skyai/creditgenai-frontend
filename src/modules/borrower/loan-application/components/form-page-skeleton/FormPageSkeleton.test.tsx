import { render, screen } from '@testing-library/react';
import { FormPageSkeleton } from './FormPageSkeleton';
import { describe, it, expect } from 'vitest';

describe('FormPageSkeleton', () => {
  it('renders form page skeleton correctly', () => {
    render(<FormPageSkeleton />);
    expect(screen.getByTestId('form-page-skeleton')).toBeInTheDocument();
  });
});

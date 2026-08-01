import { render, screen } from '@testing-library/react';
import { AuthCardSkeleton } from './AuthCardSkeleton';
import { describe, it, expect } from 'vitest';

describe('AuthCardSkeleton', () => {
  it('renders skeleton container correctly', () => {
    render(<AuthCardSkeleton />);
    expect(screen.getByTestId('auth-card-skeleton')).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BorrowerFormLayout } from './BorrowerFormLayout';

vi.mock('../../components/borrower-navbar/BorrowerNavbar', () => ({
  BorrowerNavbar: ({ stepText }: { stepText?: string }) => (
    <div data-testid="borrower-navbar-mock">{stepText || 'Navbar'}</div>
  )
}));

describe('BorrowerFormLayout', () => {
  it('renders correctly with children', () => {
    render(
      <BorrowerFormLayout>
        <div data-testid="form-content-mock">Form Content</div>
      </BorrowerFormLayout>
    );

    expect(screen.getByTestId('borrower-navbar-mock')).toBeInTheDocument();
    expect(screen.getByText('Step 1 of 3 — Personal Details')).toBeInTheDocument();
    expect(screen.getByTestId('form-content-mock')).toBeInTheDocument();
  });
});

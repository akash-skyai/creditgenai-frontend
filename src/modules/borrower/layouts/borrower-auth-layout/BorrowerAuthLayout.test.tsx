import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BorrowerAuthLayout } from './BorrowerAuthLayout';

vi.mock('../../components/borrower-navbar/BorrowerNavbar', () => ({
  BorrowerNavbar: () => <div data-testid="borrower-navbar-mock">Navbar</div>
}));

describe('BorrowerAuthLayout', () => {
  it('renders correctly with children and marketing content', () => {
    render(
      <BorrowerAuthLayout>
        <div data-testid="auth-form-mock">Form Content</div>
      </BorrowerAuthLayout>
    );

    expect(screen.getByTestId('borrower-navbar-mock')).toBeInTheDocument();
    expect(screen.getByText('Your fast track to financial freedom.')).toBeInTheDocument();
    expect(screen.getByTestId('auth-form-mock')).toBeInTheDocument();
  });
});

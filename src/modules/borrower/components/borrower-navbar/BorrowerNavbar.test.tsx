import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BorrowerNavbar } from './BorrowerNavbar';

describe('BorrowerNavbar', () => {
  it('renders correctly without step text', () => {
    render(<BorrowerNavbar />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders correctly with step text', () => {
    render(<BorrowerNavbar stepText="Step 2 of 3" />);
    expect(screen.getByText('Step 2 of 3')).toBeInTheDocument();
  });
});

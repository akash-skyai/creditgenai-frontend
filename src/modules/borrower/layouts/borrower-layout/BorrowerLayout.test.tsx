import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BorrowerLayout } from './BorrowerLayout';

describe('BorrowerLayout', () => {
  it('should render the children content', () => {
    render(
      <BorrowerLayout>
        <div data-testid="test-child">Child Content</div>
      </BorrowerLayout>
    );
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('should render the branding and badges', () => {
    render(
      <BorrowerLayout>
        <div>Content</div>
      </BorrowerLayout>
    );
    expect(screen.getByText('CreditGenAI')).toBeInTheDocument();
    expect(screen.getByText('Feature Badges')).toBeInTheDocument();
    expect(screen.getByText('100% Payments')).toBeInTheDocument();
  });
});

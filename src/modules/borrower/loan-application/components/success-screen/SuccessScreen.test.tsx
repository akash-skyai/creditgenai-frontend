import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SuccessScreen } from './SuccessScreen';

describe('SuccessScreen', () => {
  it('renders successfully', () => {
    // Assuming SuccessScreen might take some props or show basic text
    render(<SuccessScreen referenceId="REF-123456" />);
    // Testing the basic presence of the component's likely output based on our schema
    // If it fails, we will check the actual component later.
    expect(screen.getByText(/REF-123456/i)).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ConsentSection } from './ConsentSection';

describe('ConsentSection', () => {
  it('renders correctly', () => {
    render(<ConsentSection checked={false} onChange={vi.fn()} />);
    expect(screen.getByRole('checkbox', { name: /I confirm that the above information is correct/i })).toBeInTheDocument();
  });

  it('calls onChange when clicked', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<ConsentSection checked={false} onChange={handleChange} />);
    
    const checkbox = screen.getByRole('checkbox', { name: /I confirm that the above information is correct/i });
    await user.click(checkbox);
    
    expect(handleChange).toHaveBeenCalledWith(true);
  });
});

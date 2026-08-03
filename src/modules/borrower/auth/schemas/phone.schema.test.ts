import { describe, it, expect } from 'vitest';
import { phoneSchema } from './phone.schema';

describe('phoneSchema', () => {
  it('validates a correct 10-digit Indian mobile number', () => {
    const result = phoneSchema.safeParse({ mobileNumber: '9876543210' });
    expect(result.success).toBe(true);
  });

  it('validates a correct 10-digit number starting with 6', () => {
    const result = phoneSchema.safeParse({ mobileNumber: '6123456789' });
    expect(result.success).toBe(true);
  });

  it('fails if number starts with 5 or below', () => {
    const result = phoneSchema.safeParse({ mobileNumber: '5876543210' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Enter a valid 10-digit Indian mobile number');
    }
  });

  it('fails if number is less than 10 digits', () => {
    const result = phoneSchema.safeParse({ mobileNumber: '987654321' });
    expect(result.success).toBe(false);
  });

  it('fails if number is more than 10 digits', () => {
    const result = phoneSchema.safeParse({ mobileNumber: '98765432101' });
    expect(result.success).toBe(false);
  });

  it('fails if number contains non-numeric characters', () => {
    const result = phoneSchema.safeParse({ mobileNumber: '98765a3210' });
    expect(result.success).toBe(false);
  });

  it('trims whitespace before validation', () => {
    const result = phoneSchema.safeParse({ mobileNumber: ' 9876543210 ' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.mobileNumber).toBe('9876543210');
    }
  });
});

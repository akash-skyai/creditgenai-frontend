import { describe, it, expect } from 'vitest';
import { otpSchema } from './otp.schema';

describe('otpSchema', () => {
  it('validates a correct 6-digit OTP', () => {
    const result = otpSchema.safeParse({ otpCode: '123456' });
    expect(result.success).toBe(true);
  });

  it('fails if OTP is less than 6 digits', () => {
    const result = otpSchema.safeParse({ otpCode: '12345' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('OTP must be exactly 6 digits');
    }
  });

  it('fails if OTP is more than 6 digits', () => {
    const result = otpSchema.safeParse({ otpCode: '1234567' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('OTP must be exactly 6 digits');
    }
  });

  it('fails if OTP contains non-numeric characters', () => {
    const result = otpSchema.safeParse({ otpCode: '123a56' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('OTP must contain only numbers');
    }
  });

  it('trims whitespace before validation', () => {
    const result = otpSchema.safeParse({ otpCode: ' 123456 ' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.otpCode).toBe('123456');
    }
  });
});

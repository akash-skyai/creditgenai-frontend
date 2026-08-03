import { describe, it, expect } from 'vitest';
import { personalInfoSchema } from './personal-info.schema';

describe('personalInfoSchema', () => {
  const validData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    gender: 'male',
    dateOfBirth: '1990-01-01',
    panNumber: 'ABCDE1234F',
    pinCode: '123456',
    city: 'Mumbai',
    state: 'Maharashtra',
  };

  it('validates correct data', () => {
    const result = personalInfoSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('validates with optional middle name', () => {
    const result = personalInfoSchema.safeParse({ ...validData, middleName: 'Smith' });
    expect(result.success).toBe(true);
  });

  it('fails if first name has invalid characters', () => {
    const result = personalInfoSchema.safeParse({ ...validData, firstName: 'John123' });
    expect(result.success).toBe(false);
  });

  it('fails if email is invalid', () => {
    const result = personalInfoSchema.safeParse({ ...validData, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('fails if PAN format is incorrect', () => {
    const result = personalInfoSchema.safeParse({ ...validData, panNumber: '12345ABCDE' });
    expect(result.success).toBe(false);
    
    const result2 = personalInfoSchema.safeParse({ ...validData, panNumber: 'ABCDE1234' }); // Too short
    expect(result2.success).toBe(false);
  });

  it('fails if PIN code is not 6 digits', () => {
    const result = personalInfoSchema.safeParse({ ...validData, pinCode: '12345' });
    expect(result.success).toBe(false);
  });

  it('validates age correctly (between 21 and 65)', () => {
    const today = new Date();
    
    // Too young (20 years old)
    const youngYear = today.getFullYear() - 20;
    const youngDate = `${youngYear}-01-01`;
    expect(personalInfoSchema.safeParse({ ...validData, dateOfBirth: youngDate }).success).toBe(false);

    // Too old (66 years old)
    const oldYear = today.getFullYear() - 66;
    const oldDate = `${oldYear}-01-01`;
    expect(personalInfoSchema.safeParse({ ...validData, dateOfBirth: oldDate }).success).toBe(false);

    // Valid age (30 years old)
    const validYear = today.getFullYear() - 30;
    const validDate = `${validYear}-01-01`;
    expect(personalInfoSchema.safeParse({ ...validData, dateOfBirth: validDate }).success).toBe(true);
  });
});

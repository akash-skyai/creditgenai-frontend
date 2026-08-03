import { describe, it, expect } from 'vitest';
import { numberToWords } from './numberToWords';

describe('numberToWords', () => {
  it('returns empty string for falsy values and zero', () => {
    expect(numberToWords(0)).toBe('');
    expect(numberToWords('0')).toBe('');
    expect(numberToWords('')).toBe('');
    expect(numberToWords('invalid')).toBe('');
  });

  it('converts single digits correctly', () => {
    expect(numberToWords(5)).toBe('Rupees Five Only');
    expect(numberToWords(9)).toBe('Rupees Nine Only');
  });

  it('converts double digits (teens and tens) correctly', () => {
    expect(numberToWords(12)).toBe('Rupees Twelve Only');
    expect(numberToWords(18)).toBe('Rupees Eighteen Only');
    expect(numberToWords(25)).toBe('Rupees Twenty Five Only');
    expect(numberToWords(99)).toBe('Rupees Ninety Nine Only');
  });

  it('converts hundreds correctly', () => {
    expect(numberToWords(100)).toBe('Rupees One Hundred Only');
    expect(numberToWords(543)).toBe('Rupees Five Hundred Forty Three Only');
  });

  it('converts thousands correctly', () => {
    expect(numberToWords(1000)).toBe('Rupees One Thousand Only');
    expect(numberToWords(45000)).toBe('Rupees Forty Five Thousand Only');
    expect(numberToWords(99999)).toBe('Rupees Ninety Nine Thousand Nine Hundred Ninety Nine Only');
  });

  it('converts lakhs correctly (Indian numbering system)', () => {
    expect(numberToWords(100000)).toBe('Rupees One Lakh Only');
    expect(numberToWords(150000)).toBe('Rupees One Lakh Fifty Thousand Only');
    expect(numberToWords(9999999)).toBe('Rupees Ninety Nine Lakh Ninety Nine Thousand Nine Hundred Ninety Nine Only');
  });

  it('converts crores correctly', () => {
    expect(numberToWords(10000000)).toBe('Rupees One Crore Only');
    expect(numberToWords(15000000)).toBe('Rupees One Crore Fifty Lakh Only');
    expect(numberToWords(123456789)).toBe('Rupees Twelve Crore Thirty Four Lakh Fifty Six Thousand Seven Hundred Eighty Nine Only');
  });

  it('handles string numbers with commas', () => {
    expect(numberToWords('1,50,000')).toBe('Rupees One Lakh Fifty Thousand Only');
    expect(numberToWords('10,00,000')).toBe('Rupees Ten Lakh Only');
  });
});

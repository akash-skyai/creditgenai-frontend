import { z } from 'zod';

const nameRegex = /^[A-Za-z \-']+$/;
const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const pinCodeRegex = /^[0-9]{6}$/;

export const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name cannot exceed 50 characters')
    .regex(nameRegex, 'First name can only contain letters, spaces, hyphens, and apostrophes'),
  middleName: z
    .string()
    .max(50, 'Middle name cannot exceed 50 characters')
    .regex(nameRegex, 'Middle name can only contain letters, spaces, hyphens, and apostrophes')
    .optional()
    .or(z.literal('')),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name cannot exceed 50 characters')
    .regex(nameRegex, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),
  email: z.string().email('Please enter a valid email address'),
  gender: z.enum(['male', 'female', 'other']),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((dob) => {
      // Basic age validation: 21 to 65 years old
      const dobDate = new Date(dob);
      if (isNaN(dobDate.getTime())) return false;
      const today = new Date();
      let age = today.getFullYear() - dobDate.getFullYear();
      const m = today.getMonth() - dobDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
        age--;
      }
      return age >= 21 && age <= 65;
    }, 'You must be between 21 and 65 years old to apply'),
  panNumber: z
    .string()
    .min(10, 'PAN number must be exactly 10 characters')
    .max(10, 'PAN number must be exactly 10 characters')
    .toUpperCase()
    .regex(panRegex, 'Please enter a valid PAN number (Format: ABCDE1234F)'),
  pinCode: z
    .string()
    .length(6, 'Please enter a valid 6-digit Indian PIN Code')
    .regex(pinCodeRegex, 'PIN Code must contain only numbers'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

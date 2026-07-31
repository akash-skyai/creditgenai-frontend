import { z } from 'zod';

export const otpSchema = z.object({
  otpCode: z
    .string()
    .trim()
    .length(6, { message: 'OTP must be exactly 6 digits' })
    .regex(/^\d+$/, { message: 'OTP must contain only numbers' }),
});

export type OtpFormValues = z.infer<typeof otpSchema>;

import { z } from 'zod';

export const phoneSchema = z.object({
  mobileNumber: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, {
      message: 'Enter a valid 10-digit Indian mobile number',
    }),
});

export type PhoneFormValues = z.infer<typeof phoneSchema>;

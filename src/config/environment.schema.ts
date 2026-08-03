import { z } from 'zod';

export const environmentSchema = z.object({
  VITE_USE_MOCK: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
  VITE_API_BASE_URL: z
    .string()
    .url('VITE_API_BASE_URL must be a valid URL')
    .optional()
    .default('http://localhost:3000/api'),
});

export type Environment = z.infer<typeof environmentSchema>;

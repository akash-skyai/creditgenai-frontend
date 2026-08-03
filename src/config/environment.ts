import { environmentSchema } from './environment.schema';

const parsedEnv = environmentSchema.safeParse(import.meta.env);

if (!parsedEnv.success) {
  console.error(
    '❌ Invalid environment variables:',
    JSON.stringify(parsedEnv.error.format(), null, 2)
  );
  throw new Error('Invalid environment variables. Check console for details.');
}

export const environment = {
  useMock: parsedEnv.data.VITE_USE_MOCK,
  apiBaseUrl: parsedEnv.data.VITE_API_BASE_URL,
};

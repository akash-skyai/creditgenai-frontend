import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Only retry once by default
      staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
      refetchOnWindowFocus: false, // Don't refetch on every tab switch
    },
    mutations: {
      retry: 0, // Never retry mutations by default
      onError: (error) => {
        console.error('Mutation error:', error);
        // TODO: Global error toast notification hook-in can be placed here
      },
    },
  },
});

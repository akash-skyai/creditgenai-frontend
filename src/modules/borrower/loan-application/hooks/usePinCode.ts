import { useQuery } from '@tanstack/react-query';
import { fetchPostalData } from '../services/postal.service';
import type { PostalData } from '../services/postal.service';

export function usePinCode(pincode: string) {
  return useQuery<PostalData, Error>({
    queryKey: ['postalData', pincode],
    queryFn: async () => {
      // Artificial delay (Labor Illusion UX) to ensure spinner is visible
      const [data] = await Promise.all([
        fetchPostalData(pincode),
        new Promise(resolve => setTimeout(resolve, 500))
      ]);
      return data;
    },
    enabled: pincode.length === 6 && /^[0-9]{6}$/.test(pincode), // Only run if it's a valid 6 digit format
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
    retry: 1, // Only retry once if failed
  });
}

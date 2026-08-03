import { describe, it, expect, vi } from 'vitest';
import { fetchPostalData } from './postal.service';

globalThis.fetch = vi.fn();

describe('fetchPostalData', () => {
  it('should return city and state on successful fetch', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ([{
        Status: 'Success',
        PostOffice: [{ District: 'Mumbai', State: 'Maharashtra' }]
      }])
    } as unknown as Response);

    const data = await fetchPostalData('400001');
    expect(data).toEqual({ city: 'Mumbai', state: 'Maharashtra' });
  });

  it('should throw error on invalid pin code', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ([{
        Status: 'Error'
      }])
    } as unknown as Response);

    await expect(fetchPostalData('000000')).rejects.toThrow('Invalid PIN Code');
  });
});

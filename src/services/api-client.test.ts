import { describe, it, expect } from 'vitest';
import { apiClient } from './api-client';
import { environment } from '../config/environment';

describe('apiClient', () => {
  it('is configured with the correct base URL', () => {
    expect(apiClient.defaults.baseURL).toBe(environment.apiBaseUrl);
  });

  it('is configured with application/json content type', () => {
    expect(apiClient.defaults.headers['Content-Type']).toBe('application/json');
  });
});

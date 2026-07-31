export const environment = {
  useMock: import.meta.env.VITE_USE_MOCK === "true" || true, // Fallback to true if undefined
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
};

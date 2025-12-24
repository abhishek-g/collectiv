// Production environment configuration
// For Vercel: Frontend and API are on the same domain, so use relative URLs
// This allows the API to be accessed via /api/users without CORS issues
export const environment = {
  production: true,
  apiUrl: '/api/users', // Relative URL - works on same domain (Vercel)
};


// This will be replaced at build time with actual environment variables
// For Vercel, set API_URL in environment variables
declare const process: {
  env: {
    [key: string]: string;
  };
};

export const environment = {
  production: true,
  apiUrl: (typeof process !== 'undefined' && process.env && process.env['API_URL']) 
    ? `${process.env['API_URL']}/api/users`
    : 'https://your-backend.railway.app/api/users',
};


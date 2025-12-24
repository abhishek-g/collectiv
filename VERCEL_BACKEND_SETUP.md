# Vercel Backend Setup Guide

## Overview

Your Express.js backend is now configured to run on Vercel as serverless functions. This allows you to deploy both frontend and backend to the same Vercel project.

## How It Works

1. **API Function**: `api/index.ts` is the serverless function entry point
2. **Routes**: All `/api/*` requests are routed to the Express app
3. **Build**: Backend is built and included in the Vercel deployment
4. **Database**: Database initialization happens on cold start

## Configuration

### vercel.json
- Builds both backend and frontend
- Routes `/api/*` to the serverless function
- Includes backend build artifacts in the function

### api/index.ts
- Wraps Express app for Vercel serverless
- Handles database initialization
- Imports routes from built backend

## Environment Variables

Set these in Vercel Dashboard → Project → Settings → Environment Variables:

```
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
JWT_SECRET=your-jwt-secret
```

## Deployment

The deployment workflow (`.github/workflows/deploy-vercel.yml`) will:
1. Build backend
2. Build frontend
3. Deploy both to Vercel

## API Endpoints

Once deployed, your API will be available at:
- `https://your-app.vercel.app/api/users`
- `https://your-app.vercel.app/api/health`
- All other routes from your Express app

## Important Notes

### Database Connections
- Vercel serverless functions are stateless
- Database connections should use connection pooling
- Consider using Vercel Postgres or external database services

### Cold Starts
- First request after inactivity may be slower
- Database initialization happens on cold start
- Subsequent requests are faster

### File Size Limits
- Vercel has limits on function size
- Large dependencies may need optimization
- Consider using external services for heavy operations

## Troubleshooting

### Routes Not Loading
- Check that backend build completed successfully
- Verify `dist/backend/src/routes/user.routes.js` exists
- Check Vercel function logs

### Database Connection Issues
- Verify environment variables are set
- Check database allows connections from Vercel IPs
- Consider using Vercel Postgres for easier setup

### Import Errors
- Ensure all dependencies are in `package.json`
- Check that TypeScript compilation succeeded
- Verify module resolution paths

## Alternative: Separate Backend Project

If you prefer to keep backend separate:
1. Create a separate Vercel project for backend
2. Use `vercel-backend.json` configuration
3. Update frontend `API_URL` to backend Vercel URL

## Benefits of Vercel Backend

✅ **Single Deployment**: Frontend and backend in one project
✅ **Automatic Scaling**: Serverless functions scale automatically
✅ **Global CDN**: Fast API responses worldwide
✅ **Zero Configuration**: Works out of the box
✅ **Free Tier**: Generous free tier for testing

## Limitations

⚠️ **Cold Starts**: First request after inactivity may be slow
⚠️ **Function Timeout**: 10s (Hobby) or 60s (Pro) timeout limit
⚠️ **Database**: Need external database (Vercel Postgres recommended)
⚠️ **File System**: Read-only filesystem (use external storage)

## Next Steps

1. Set up database (Vercel Postgres or external)
2. Configure environment variables in Vercel
3. Deploy and test API endpoints
4. Update frontend `API_URL` to use same domain


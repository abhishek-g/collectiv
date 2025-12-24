# Vercel Deployment Guide (Frontend + Backend)

## Overview

Your application is now configured to deploy both frontend (Angular) and backend (Express.js) to Vercel as a single project.

## Architecture

- **Frontend**: Angular app served as static files
- **Backend**: Express.js app running as Vercel serverless functions
- **API Routes**: All `/api/*` requests are handled by the serverless function

## Setup Steps

### 1. Configure Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com)
2. Import your GitHub repository
3. Configure project settings:
   - **Framework Preset**: Angular
   - **Root Directory**: Leave empty (root)
   - **Build Command**: `npm ci && npx nx build backend --configuration=production && npx nx build frontend --configuration=production`
   - **Output Directory**: `dist/frontend/browser`
   - **Install Command**: `npm ci`

### 2. Set Environment Variables

In Vercel Dashboard → Project → Settings → Environment Variables:

**Backend Variables:**
```
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
JWT_SECRET=your-random-secret-string
```

**Frontend Variables:**
```
API_URL=https://your-app.vercel.app
```

### 3. Deploy

The GitHub Actions workflow will automatically deploy on push to `main` branch.

Or deploy manually:
```bash
vercel --prod
```

## File Structure

```
.
├── api/
│   └── index.ts          # Serverless function entry point
├── apps/
│   ├── frontend/         # Angular frontend
│   └── backend/          # Express backend
├── libs/                 # Shared libraries
└── vercel.json          # Vercel configuration
```

## How It Works

1. **Build Process**:
   - Backend is built first (creates `dist/backend/`)
   - Frontend is built second (creates `dist/frontend/browser/`)

2. **Deployment**:
   - Frontend static files are served from `dist/frontend/browser/`
   - API requests to `/api/*` are routed to `api/index.ts`
   - `api/index.ts` imports routes from `apps/backend/src/routes/`
   - Vercel compiles TypeScript on deployment

3. **Routing**:
   - `/api/*` → Serverless function (`api/index.ts`)
   - `/*` → Angular app (SPA routing)

## API Endpoints

Once deployed, your API will be available at:
- `https://your-app.vercel.app/api` - Welcome message
- `https://your-app.vercel.app/api/health` - Health check
- `https://your-app.vercel.app/api/users` - User endpoints
- All other routes from your Express app

## Database Setup

### Option 1: Vercel Postgres (Recommended)

1. Go to Vercel Dashboard → Storage → Create Database
2. Select "Postgres"
3. Vercel will automatically set `POSTGRES_URL` environment variable
4. Update your backend to use `POSTGRES_URL` instead of individual DB vars

### Option 2: External Database

Use any MySQL/Postgres database provider:
- Railway
- Render
- PlanetScale
- Supabase
- AWS RDS
- etc.

Set the connection variables in Vercel environment variables.

## Important Notes

### Serverless Functions

- **Cold Starts**: First request after inactivity may take 1-2 seconds
- **Timeout**: 10 seconds (Hobby) or 60 seconds (Pro)
- **Memory**: 1024 MB (Hobby) or up to 3008 MB (Pro)
- **Stateless**: No persistent connections between requests

### Database Connections

- Use connection pooling for better performance
- Consider using Vercel Postgres for easier setup
- External databases need to allow Vercel IPs (or use connection strings)

### File System

- Read-only filesystem in serverless functions
- Use external storage (S3, Cloudinary, etc.) for file uploads
- Environment variables for configuration

## Troubleshooting

### API Not Working

1. Check Vercel function logs: Dashboard → Deployments → Click deployment → Functions tab
2. Verify environment variables are set
3. Check that routes are imported correctly
4. Verify database connection

### Build Failures

1. Check build logs in Vercel dashboard
2. Verify all dependencies are in `package.json`
3. Check TypeScript compilation errors
4. Verify Nx build commands work locally

### Import Errors

1. Ensure path mappings in `tsconfig.base.json` are correct
2. Check that libraries are built before frontend
3. Verify module resolution paths

## Benefits

✅ **Single Deployment**: One project, one URL
✅ **Automatic HTTPS**: SSL certificates included
✅ **Global CDN**: Fast worldwide
✅ **Serverless Scaling**: Automatic scaling
✅ **Free Tier**: Generous free tier
✅ **Preview Deployments**: Every PR gets a preview URL

## Limitations

⚠️ **Cold Starts**: First request after inactivity is slower
⚠️ **Function Timeout**: 10s limit on free tier
⚠️ **Database**: Need external database (Vercel Postgres recommended)
⚠️ **File System**: Read-only (use external storage)

## Next Steps

1. ✅ Set up Vercel project
2. ✅ Configure environment variables
3. ✅ Set up database (Vercel Postgres or external)
4. ✅ Deploy and test
5. ✅ Update frontend API_URL to use same domain

## Alternative: Separate Projects

If you prefer separate projects:
- Frontend: Deploy to Vercel (as configured)
- Backend: Deploy to Railway/Render (see `DEPLOYMENT_SETUP.md`)

Then update frontend `API_URL` to point to backend URL.


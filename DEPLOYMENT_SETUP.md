# Deployment Setup Guide

This guide will help you deploy your Angular frontend and Express backend to free hosting platforms.

## 🎯 Recommended Free Hosting Options

### Frontend: **Vercel** (Recommended)
- ✅ **Free tier**: Unlimited projects, 100GB bandwidth
- ✅ **Zero configuration**: Works out of the box with Angular
- ✅ **Automatic HTTPS**: SSL certificates included
- ✅ **Global CDN**: Fast worldwide
- ✅ **Preview deployments**: Every PR gets a preview URL

### Backend: **Railway** (Recommended) or **Render**
- ✅ **Railway**: $5/month free credit (usually enough for testing)
- ✅ **Render**: Free tier with limitations (spins down after inactivity)
- ✅ **Both**: Easy setup, automatic deployments
- ✅ **Database**: Both offer managed databases

## 📋 Prerequisites

1. GitHub repository (you already have this)
2. Accounts on hosting platforms (free to sign up)

## 🚀 Frontend Deployment (Vercel)

### Step 1: Sign up for Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your repository

### Step 2: Configure Vercel Project
1. In Vercel dashboard, click "Add New Project"
2. Select your repository
3. Configure:
   - **Framework Preset**: Angular
   - **Root Directory**: `apps/frontend`
   - **Build Command**: `npm ci && npx nx build frontend --configuration=production`
   - **Output Directory**: `dist/frontend/browser`
   - **Install Command**: `npm ci`

### Step 3: Get Vercel Credentials
1. Go to [Vercel Settings → Tokens](https://vercel.com/account/tokens)
2. Create a new token (name it "GitHub Actions")
3. Copy the token

### Step 4: Get Project IDs
1. Go to your project settings in Vercel
2. Find:
   - **Org ID**: In the URL or Settings → General
   - **Project ID**: In Settings → General

### Step 5: Add GitHub Secrets
Go to: Repository → Settings → Secrets and variables → Actions

Add these secrets:
- `VERCEL_TOKEN`: Your Vercel token
- `VERCEL_ORG_ID`: Your organization ID
- `VERCEL_PROJECT_ID`: Your project ID

### Step 6: Configure Environment Variables
In Vercel dashboard → Project → Settings → Environment Variables:
- `NODE_ENV`: `production`
- `API_URL`: Your backend URL **without** `/api/users` (e.g., `https://your-backend.railway.app`)

**Important**: The `API_URL` should be just the base URL. The `/api/users` path is automatically appended by the application.

### Step 7: Enable GitHub Actions
The workflow `.github/workflows/deploy-vercel.yml` will automatically deploy on pushes to `main`.

## 🔧 Backend Deployment (Railway - Recommended)

### Step 1: Sign up for Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. You'll get $5/month free credit

### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Select your repository
4. Railway will detect it's a Node.js project

### Step 3: Configure Railway
1. Click on your service
2. Go to Settings → Source
3. Set:
   - **Root Directory**: `/apps/backend`
   - **Build Command**: `npm ci && npx nx build backend --configuration=production`
   - **Start Command**: `node dist/backend/main.js`

### Step 4: Set Environment Variables
In Railway → Variables tab, add:
```
PORT=3333
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
JWT_SECRET=your-jwt-secret
```

### Step 5: Add Database (Optional)
1. In Railway, click "New" → "Database" → "Add MySQL"
2. Railway will automatically set `DATABASE_URL`
3. Update your environment variables

### Step 6: Get Railway Token
1. Go to [Railway Account Settings](https://railway.app/account)
2. Click "New Token"
3. Copy the token

### Step 7: Add GitHub Secret
Add to GitHub Secrets:
- `RAILWAY_TOKEN`: Your Railway token

### Step 8: Enable GitHub Actions
The workflow `.github/workflows/deploy-railway.yml` will automatically deploy on pushes to `main`.

## 🔧 Backend Deployment (Render - Alternative)

### Step 1: Sign up for Render
1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### Step 2: Create Web Service
1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `backend`
   - **Root Directory**: `apps/backend`
   - **Environment**: `Node`
   - **Build Command**: `npm ci && npx nx build backend --configuration=production`
   - **Start Command**: `node dist/backend/main.js`

### Step 3: Set Environment Variables
Add the same variables as Railway

### Step 4: Get Render Credentials
1. Go to [Render Dashboard → Account Settings → API Keys](https://dashboard.render.com/account/api-keys)
2. Create a new API key
3. Copy your Service ID from the service settings

### Step 5: Add GitHub Secrets
- `RENDER_API_KEY`: Your Render API key
- `RENDER_SERVICE_ID`: Your service ID

## 🔄 Alternative: Manual Deployment Workflow

If you prefer manual control, use `.github/workflows/cd.yml` and add deployment steps there.

## 📝 Environment Variables Checklist

### Frontend (Vercel)
- [ ] `NODE_ENV`: `production`
- [ ] `API_URL`: Your backend URL

### Backend (Railway/Render)
- [ ] `PORT`: `3333` (or let platform assign)
- [ ] `NODE_ENV`: `production`
- [ ] `FRONTEND_URL`: Your Vercel frontend URL
- [ ] `DB_HOST`: Database host
- [ ] `DB_USER`: Database user
- [ ] `DB_PASSWORD`: Database password
- [ ] `DB_NAME`: Database name
- [ ] `JWT_SECRET`: Random secret string

## 🧪 Testing Deployment

1. **Push to main branch**
2. **Check GitHub Actions**: Should see deployment workflows running
3. **Check Vercel**: Frontend should deploy automatically
4. **Check Railway/Render**: Backend should deploy automatically
5. **Test endpoints**: Visit your deployed URLs

## 🔍 Troubleshooting

### Frontend Issues
- **Build fails**: Check build logs in Vercel
- **API calls fail**: Verify `API_URL` environment variable
- **Routing issues**: Ensure Angular routing is configured correctly

### Backend Issues
- **Build fails**: Check Node version matches (should be 20)
- **Database connection fails**: Verify database credentials
- **CORS errors**: Check `FRONTEND_URL` matches your Vercel URL
- **Port issues**: Railway/Render assigns ports automatically, use `process.env.PORT`

### GitHub Actions Issues
- **Secrets not found**: Double-check secret names match exactly
- **Deployment fails**: Check workflow logs in Actions tab
- **Token expired**: Regenerate tokens and update secrets

## 📊 Monitoring

### Vercel
- View deployments: Vercel Dashboard
- View logs: Project → Deployments → Click deployment → Logs
- Analytics: Built-in analytics dashboard

### Railway
- View deployments: Railway Dashboard
- View logs: Service → Deployments → Click deployment → Logs
- Metrics: Built-in metrics dashboard

### Render
- View deployments: Render Dashboard
- View logs: Service → Logs tab
- Metrics: Built-in metrics

## 🎉 Next Steps

1. ✅ Set up Vercel for frontend
2. ✅ Set up Railway/Render for backend
3. ✅ Configure environment variables
4. ✅ Add GitHub secrets
5. ✅ Push to main and watch deployments
6. ✅ Test your deployed applications
7. ✅ Set up custom domains (optional)

## 💡 Tips

- **Use preview deployments**: Vercel creates preview URLs for every PR
- **Monitor usage**: Keep an eye on Railway credit usage
- **Set up alerts**: Configure email alerts for deployment failures
- **Use staging**: Consider a staging environment for testing
- **Database backups**: Set up regular backups for production data

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)


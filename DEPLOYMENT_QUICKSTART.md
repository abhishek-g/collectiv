# 🚀 Quick Deployment Guide

Get your app deployed in 10 minutes!

## Option 1: Vercel + Railway (Recommended - Easiest)

### Frontend (Vercel) - 5 minutes

1. **Sign up**: [vercel.com](https://vercel.com) → Sign up with GitHub
2. **Import repo**: Click "Add New Project" → Select your repo
3. **Configure**:
   - Root Directory: `apps/frontend`
   - Build Command: `npm ci && npx nx build frontend --configuration=production`
   - Output Directory: `dist/frontend/browser`
4. **Get credentials**:
   - Token: [vercel.com/account/tokens](https://vercel.com/account/tokens)
   - Org ID & Project ID: Project Settings → General
5. **Add GitHub secrets**:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
6. **Done!** Frontend auto-deploys on push to `main`

### Backend (Railway) - 5 minutes

1. **Sign up**: [railway.app](https://railway.app) → Sign up with GitHub
2. **Create project**: "New Project" → "Deploy from GitHub repo"
3. **Configure**:
   - Root Directory: `/apps/backend`
   - Build Command: `npm ci && npx nx build backend --configuration=production`
   - Start Command: `node dist/backend/main.js`
4. **Add environment variables**:
   ```
   PORT=3333
   NODE_ENV=production
   FRONTEND_URL=https://your-app.vercel.app
   DB_HOST=...
   DB_USER=...
   DB_PASSWORD=...
   DB_NAME=...
   JWT_SECRET=your-secret-here
   ```
5. **Get token**: [railway.app/account](https://railway.app/account) → New Token
6. **Add GitHub secret**: `RAILWAY_TOKEN`
7. **Done!** Backend auto-deploys on push to `main`

## Option 2: Vercel + Render (Free Tier)

Same as above, but use Render instead of Railway:

1. **Sign up**: [render.com](https://render.com)
2. **Create Web Service**: Connect GitHub repo
3. **Configure**: Same as Railway
4. **Get credentials**: API Key + Service ID
5. **Add secrets**: `RENDER_API_KEY`, `RENDER_SERVICE_ID`

## 🎯 What Happens Next?

1. **Push to main branch**
2. **GitHub Actions runs**:
   - Builds frontend and backend
   - Deploys to Vercel (frontend)
   - Deploys to Railway/Render (backend)
3. **Get URLs**:
   - Frontend: `https://your-app.vercel.app`
   - Backend: `https://your-backend.railway.app`

## 🔧 Environment Variables

### Frontend (Vercel)
```
API_URL=https://your-backend.railway.app
```

### Backend (Railway/Render)
```
PORT=3333
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
DB_HOST=...
DB_USER=...
DB_PASSWORD=...
DB_NAME=...
JWT_SECRET=generate-random-string
```

## 📝 Checklist

- [ ] Vercel account created
- [ ] Vercel project configured
- [ ] Vercel secrets added to GitHub
- [ ] Railway/Render account created
- [ ] Railway/Render service configured
- [ ] Backend secrets added to GitHub
- [ ] Environment variables set
- [ ] Database configured (if needed)
- [ ] Test deployment

## 🆘 Need Help?

See [DEPLOYMENT_SETUP.md](./DEPLOYMENT_SETUP.md) for detailed instructions.

## 💰 Cost

- **Vercel**: Free (unlimited projects)
- **Railway**: $5/month free credit
- **Render**: Free tier (spins down after inactivity)

**Total**: $0/month for testing! 🎉


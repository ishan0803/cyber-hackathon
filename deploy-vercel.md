# Quick Vercel Deployment Guide

## 🚀 Deploy to Vercel in 5 Minutes

### Step 1: Prepare Your Repository
```bash
# Make sure all changes are committed
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Deploy via Vercel Dashboard

1. **Go to [vercel.com](https://vercel.com)** and sign in
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure the project**:
   - Framework Preset: `Vite`
   - Build Command: `pnpm build`
   - Output Directory: `dist/spa`
   - Install Command: `pnpm install`
5. **Click "Deploy"**

### Step 3: Verify Deployment

Once deployed, you'll get a URL like: `https://your-project.vercel.app`

Test your API endpoints:
- `https://your-project.vercel.app/api/ping`
- `https://your-project.vercel.app/api/demo`

### Step 4: Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS as instructed

## 🔧 Environment Variables

If you need environment variables:

1. Go to Project Settings → Environment Variables
2. Add variables like:
   - `PING_MESSAGE`: `Hello from Vercel!`

## 📊 Monitoring

- View function logs: Dashboard → Functions
- Monitor performance: Dashboard → Analytics
- Check deployments: Dashboard → Deployments

## 🆘 Troubleshooting

**Build fails?**
- Check that `pnpm` is available
- Verify all dependencies are in `package.json`

**API routes not working?**
- Ensure files are in the `api/` directory
- Check function logs in Vercel dashboard

**Environment variables not working?**
- Verify they're set in Vercel dashboard
- Redeploy after adding variables

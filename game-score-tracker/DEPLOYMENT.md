# Deployment Guide for vishalthimmaiah.com

This guide will help you deploy the Game Score Tracker to your domain `vishalthimmaiah.com` using Vercel.

## Recommended Approach: Subdomain Deployment

Deploy the Game Score Tracker on `scoretracker.vishalthimmaiah.com` to keep your existing website intact.

### Step 1: Push to GitHub

1. **Commit and push your changes:**
```bash
git add .
git commit -m "feat: prepare Game Score Tracker for production deployment"
git push origin main
```

### Step 2: Deploy to Vercel

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import your GitHub repository** (monitor-research)
4. **Configure the project:**
   - **Project Name**: `game-score-tracker`
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `game-score-tracker`
   - **Build Command**: `pnpm build` (auto-configured)
   - **Output Directory**: `.next` (auto-configured)
   - **Install Command**: `pnpm install` (auto-configured)

5. **Environment Variables** (optional):
   ```
   NEXT_PUBLIC_APP_URL=https://scoretracker.vishalthimmaiah.com
   ```

6. **Click "Deploy"**

### Step 3: Configure Custom Domain

1. **In Vercel Dashboard**, go to your project settings
2. **Navigate to "Domains" tab**
3. **Add domain**: `scoretracker.vishalthimmaiah.com`
4. **Vercel will provide DNS instructions**

### Step 4: Update DNS Settings

Since your main domain is already on Vercel, you'll need to add a CNAME record:

1. **Go to your domain registrar** (or wherever you manage DNS)
2. **Add CNAME record:**
   - **Name/Host**: `scoretracker`
   - **Value/Target**: `cname.vercel-dns.com`
   - **TTL**: 300 (or default)

**OR** if managing DNS through Vercel:
1. **In Vercel Dashboard**, go to your main website project
2. **Domains tab** → **Manage DNS**
3. **Add record:**
   - **Type**: CNAME
   - **Name**: scoretracker
   - **Value**: Your new project's Vercel URL

### Step 5: Verify Deployment

1. **Wait for DNS propagation** (5-30 minutes)
2. **Visit**: `https://scoretracker.vishalthimmaiah.com`
3. **Test all features** of the Game Score Tracker

## Alternative: Subdirectory Deployment

If you prefer `vishalthimmaiah.com/games`, you'll need to:

1. **Configure Next.js with basePath:**
```javascript
// next.config.ts
const nextConfig = {
  basePath: '/games',
  assetPrefix: '/games',
  trailingSlash: true,
}
```

2. **Set up Vercel rewrites** in your main project to proxy `/games/*` to the Game Score Tracker project.

## Production Checklist

- [x] ✅ Production build passes without errors
- [x] ✅ Custom favicon configured
- [x] ✅ SEO metadata optimized
- [x] ✅ Error boundaries implemented
- [x] ✅ Security headers configured
- [x] ✅ Performance optimized (158kB bundle)
- [x] ✅ Mobile responsive design
- [x] ✅ TypeScript strict mode enabled

## Post-Deployment

### Analytics (Optional)
Add Vercel Analytics to track usage:
```bash
cd game-score-tracker
pnpm add @vercel/analytics
```

### Monitoring
- Monitor performance in Vercel Dashboard
- Check error logs in Vercel Functions tab
- Set up alerts for downtime

### Updates
To deploy updates:
```bash
git add .
git commit -m "feat: your update description"
git push origin main
```
Vercel will automatically redeploy.

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Custom Domains**: https://vercel.com/docs/projects/domains

## Troubleshooting

### Common Issues:

1. **DNS not propagating**: Wait up to 48 hours, use DNS checker tools
2. **Build fails**: Check build logs in Vercel dashboard
3. **404 errors**: Verify root directory is set to `game-score-tracker`
4. **Favicon not loading**: Clear browser cache, check network tab

### Getting Help:
- Check Vercel deployment logs
- Verify all environment variables are set
- Test locally with `pnpm build && pnpm start`

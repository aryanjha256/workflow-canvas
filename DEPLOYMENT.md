# Deployment Guide

This guide will help you deploy your Workflow Canvas application to various platforms.

## 📦 Building for Production

Before deploying, build your application:

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

## 🚀 Deployment Options

### Option 1: Vercel (Recommended - Easiest)

1. **Install Vercel CLI** (optional):

```bash
npm install -g vercel
```

2. **Deploy using Vercel CLI**:

```bash
vercel
```

3. **Or Deploy via GitHub**:
   - Push your code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite and deploy

**Vercel Configuration** (automatic for Vite):

- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Option 2: Netlify

1. **Install Netlify CLI** (optional):

```bash
npm install -g netlify-cli
```

2. **Deploy using CLI**:

```bash
netlify deploy --prod
```

3. **Or Deploy via GitHub**:
   - Push your code to GitHub
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`

**Netlify Configuration** (create `netlify.toml` in root):

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: GitHub Pages

1. **Install gh-pages**:

```bash
npm install --save-dev gh-pages
```

2. **Update `package.json`**:

```json
{
  "homepage": "https://yourusername.github.io/workflow-canvas",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. **Update `vite.config.ts`**:

```typescript
export default defineConfig({
  base: "/workflow-canvas/", // Your repo name
  plugins: [react()],
});
```

4. **Deploy**:

```bash
npm run deploy
```

5. **Enable GitHub Pages**:
   - Go to your repo → Settings → Pages
   - Source: Deploy from branch
   - Branch: `gh-pages` / root

### Option 4: Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect and deploy

**Railway Configuration**:

- Build Command: `npm run build`
- Start Command: `npm run preview`

### Option 5: Render

1. Go to [render.com](https://render.com)
2. Click "New" → "Static Site"
3. Connect your GitHub repository
4. Configure:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
5. Click "Create Static Site"

### Option 6: AWS Amplify

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. Click "Get Started" under "Amplify Hosting"
3. Connect your GitHub repository
4. Configure build settings:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - "**/*"
  cache:
    paths:
      - node_modules/**/*
```

## 🔧 Pre-Deployment Checklist

- [ ] Test build locally: `npm run build && npm run preview`
- [ ] Check for console errors in production build
- [ ] Update README with live demo link
- [ ] Test all features in production build
- [ ] Check mobile responsiveness
- [ ] Verify authentication flows work
- [ ] Test both Admin and Viewer roles
- [ ] Ensure all images and assets load correctly
- [ ] Check browser compatibility

## 🌐 Environment Variables

If you add real backend integration, create environment variables:

### For Vercel/Netlify:

Add in dashboard or create `.env.production`:

```env
VITE_API_URL=your-api-url
VITE_AUTH_DOMAIN=your-auth-domain
```

### Access in code:

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## 📊 Performance Tips

1. **Enable Compression**: Most platforms auto-enable gzip/brotli
2. **Use CDN**: Vercel/Netlify provide global CDN automatically
3. **Lazy Load**: Already implemented with React
4. **Code Splitting**: Vite handles this automatically
5. **Image Optimization**: Use next-gen formats (WebP)

## 🔒 Security Headers

For Netlify, create `netlify.toml`:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

## 📱 Custom Domain

### Vercel:

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Netlify:

1. Go to Site Settings → Domain Management
2. Add custom domain
3. Update DNS records

## 🐛 Troubleshooting

### Build Fails

- Check Node version (use v18+)
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run build`

### 404 on Refresh

- Ensure SPA redirect is configured (see Netlify config above)
- For Vercel, create `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

### Assets Not Loading

- Check `vite.config.ts` base path
- Verify assets are in `dist` after build
- Check browser console for 404 errors

## 📝 Post-Deployment

1. **Update README** with live demo link
2. **Test thoroughly** on deployed site
3. **Share** with stakeholders
4. **Monitor** for errors (use browser dev tools)
5. **Set up analytics** (optional): Google Analytics, Plausible, etc.

## 🎉 Quick Deploy Commands

```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod

# GitHub Pages
npm run deploy
```

## 📞 Support

If you encounter issues:

- Check platform documentation
- Review build logs
- Test production build locally: `npm run preview`
- Check browser console for errors

---

**Recommended Platform**: Vercel (easiest, fastest, free tier generous)

Good luck with your deployment! 🚀

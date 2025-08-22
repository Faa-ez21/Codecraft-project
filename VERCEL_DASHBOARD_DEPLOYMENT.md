# Vercel Dashboard Deployment Guide

## Deploy from Vercel Dashboard (Recommended)

### Step 1: Prepare Your Repository

1. **Commit all your changes to GitHub:**
   ```bash
   git add .
   git commit -m "Add Vercel configuration files"
   git push origin main
   ```

### Step 2: Create Projects on Vercel

You'll need to create **3 separate projects** on Vercel for your different applications:

#### Project 1: Backend API
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository: `Faa-ez21/Codecraft-project`
4. Configure the project:
   - **Project Name**: `codecraft-backend`
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

#### Project 2: Client Site
1. Click "New Project" again
2. Import the same repository: `Faa-ez21/Codecraft-project`
3. Configure the project:
   - **Project Name**: `codecraft-client-site`
   - **Framework Preset**: Vite
   - **Root Directory**: `apps/client-site`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

#### Project 3: Admin Dashboard
1. Click "New Project" again
2. Import the same repository: `Faa-ez21/Codecraft-project`
3. Configure the project:
   - **Project Name**: `codecraft-admin-dashboard`
   - **Framework Preset**: Vite
   - **Root Directory**: `apps/admin-dashboard`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 3: Configure Environment Variables

#### For Backend Project:
Go to your backend project → Settings → Environment Variables and add:
```
NODE_ENV=production
API_KEY=your_secure_api_key_here
CORS_ORIGINS=https://your-client-site.vercel.app,https://your-admin-dashboard.vercel.app
RATE_LIMIT_WINDOW_MIN=15
RATE_LIMIT_MAX=100
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
```

#### For Client Site Project:
Go to your client site project → Settings → Environment Variables and add:
```
VITE_API_URL=https://your-backend.vercel.app
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### For Admin Dashboard Project:
Go to your admin dashboard project → Settings → Environment Variables and add:
```
VITE_API_URL=https://your-backend.vercel.app
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 4: Deploy

1. After configuring each project, Vercel will automatically deploy
2. You'll get 3 URLs:
   - Backend: `https://codecraft-backend.vercel.app`
   - Client Site: `https://codecraft-client-site.vercel.app`
   - Admin Dashboard: `https://codecraft-admin-dashboard.vercel.app`

### Step 5: Update Environment Variables

Once you have the deployment URLs:

1. **Update Backend CORS_ORIGINS**:
   - Go to backend project → Settings → Environment Variables
   - Update `CORS_ORIGINS` with your actual frontend URLs

2. **Update Frontend API URLs**:
   - Go to client site project → Settings → Environment Variables
   - Update `VITE_API_URL` with your actual backend URL
   - Go to admin dashboard project → Settings → Environment Variables
   - Update `VITE_API_URL` with your actual backend URL

3. **Redeploy** all projects to apply the new environment variables

### Step 6: Automatic Deployments

- Vercel will automatically redeploy whenever you push to the `main` branch
- You can also manually trigger deployments from the Vercel dashboard

## Quick Checklist

- [ ] All files committed and pushed to GitHub
- [ ] Backend project created and configured
- [ ] Client site project created and configured
- [ ] Admin dashboard project created and configured
- [ ] All environment variables set
- [ ] CORS origins updated with actual URLs
- [ ] API URLs updated in frontend apps
- [ ] All projects successfully deployed

## Troubleshooting

### Common Issues:
1. **Build failures**: Check the build logs in Vercel dashboard
2. **Environment variables**: Make sure all required vars are set
3. **CORS errors**: Ensure CORS_ORIGINS includes your frontend URLs
4. **API connection**: Verify VITE_API_URL points to your backend

### Getting Help:
- Check the "Functions" tab for backend logs
- Use the "Preview" deployments to test changes
- Check the "Settings" → "Environment Variables" for each project

# Vercel Deployment Guide for Codecraft Project

## Overview
This project consists of multiple applications that can be deployed to Vercel:
- **Backend API** (Express.js)
- **Client Site** (React/Vite)
- **Admin Dashboard** (React/Vite)

## Deployment Options

### Option 1: Deploy as Separate Projects (Recommended)

#### 1. Deploy Backend API
```bash
cd backend
vercel --prod
```

#### 2. Deploy Client Site
```bash
cd apps/client-site
vercel --prod
```

#### 3. Deploy Admin Dashboard
```bash
cd apps/admin-dashboard
vercel --prod
```

### Option 2: Deploy as Monorepo
Deploy the entire project from the root directory:
```bash
vercel --prod
```

## Prerequisites

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

## Environment Variables Setup

### Backend Environment Variables
Set these in your Vercel project dashboard or via CLI:

```bash
# Required for backend
vercel env add PORT
vercel env add CORS_ORIGINS
vercel env add API_KEY
vercel env add NODE_ENV
vercel env add RATE_LIMIT_WINDOW_MIN
vercel env add RATE_LIMIT_MAX

# Supabase (if using)
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

### Frontend Environment Variables
```bash
# For React applications
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_API_URL
```

## Step-by-Step Deployment

### 1. Backend Deployment

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Initialize Vercel project:
   ```bash
   vercel
   ```

3. Answer the prompts:
   - Link to existing project? `N`
   - Project name: `codecraft-backend`
   - Directory: `./` (current directory)

4. Deploy to production:
   ```bash
   vercel --prod
   ```

### 2. Client Site Deployment

1. Navigate to client site directory:
   ```bash
   cd ../apps/client-site
   ```

2. Update environment variables if needed:
   ```bash
   # Create .env.production file
   echo "VITE_API_URL=https://your-backend.vercel.app" > .env.production
   ```

3. Deploy:
   ```bash
   vercel
   vercel --prod
   ```

### 3. Admin Dashboard Deployment

1. Navigate to admin dashboard directory:
   ```bash
   cd ../admin-dashboard
   ```

2. Deploy:
   ```bash
   vercel
   vercel --prod
   ```

## Post-Deployment Configuration

### 1. Update CORS Origins
Update your backend environment variables to include your frontend URLs:
```
CORS_ORIGINS=https://your-client-site.vercel.app,https://your-admin-dashboard.vercel.app
```

### 2. Update Frontend API URLs
Update your frontend applications to point to your deployed backend:
```javascript
// In your frontend config
const API_URL = process.env.VITE_API_URL || 'https://your-backend.vercel.app';
```

## Custom Domains (Optional)

1. In Vercel dashboard, go to your project
2. Navigate to "Domains" tab
3. Add your custom domain
4. Update DNS records as instructed

## Troubleshooting

### Common Issues:

1. **Build Failures**: Check that all dependencies are in package.json
2. **Environment Variables**: Ensure all required env vars are set in Vercel
3. **CORS Errors**: Update CORS_ORIGINS to include your frontend URLs
4. **Function Timeout**: For serverless functions, ensure they complete within 10s (hobby plan)

### Debug Commands:
```bash
# Check deployment logs
vercel logs [deployment-url]

# Local development with Vercel
vercel dev
```

## Production Checklist

- [ ] All environment variables configured
- [ ] CORS origins updated for production URLs
- [ ] API endpoints updated in frontend apps
- [ ] Database connection strings point to production
- [ ] Error handling and logging configured
- [ ] Rate limiting configured appropriately
- [ ] Security headers configured

## Useful Commands

```bash
# List all deployments
vercel ls

# Remove a deployment
vercel rm [deployment-url]

# Check project settings
vercel inspect [deployment-url]

# Set environment variable
vercel env add [variable-name]

# Pull environment variables locally
vercel env pull .env.local
```

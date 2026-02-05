# Switchboard Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the Switchboard API Endpoint Registry to production using Vercel and Supabase.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup (Supabase)](#database-setup-supabase)
3. [Application Deployment (Vercel)](#application-deployment-vercel)
4. [Post-Deployment Verification](#post-deployment-verification)
5. [Creating Admin Users](#creating-admin-users)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- A GitHub account with access to the Switchboard repository
- A Supabase account (free tier is sufficient to start)
- A Vercel account (free tier is sufficient to start)
- Node.js 18+ installed locally (for testing)

---

## Database Setup (Supabase)

### Step 1: Create Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in the project details:
   - **Name**: `switchboard-production` (or your preferred name)
   - **Database Password**: Generate a strong password and save it securely
   - **Region**: Choose the region closest to your users
4. Click "Create new project"
5. Wait for the project to finish provisioning (2-3 minutes)

### Step 2: Run Database Migration

1. Navigate to your Supabase project dashboard
2. Go to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `/supabase/migrations/001_initial_schema.sql` from your repository
5. Paste it into the SQL Editor
6. Click **Run** or press `Ctrl+Enter` (Windows/Linux) or `Cmd+Enter` (Mac)
7. Verify success - you should see "Success. No rows returned" or similar
8. Navigate to **Database > Tables** to verify all tables were created:
   - `user_roles`
   - `tags`
   - `endpoints`
   - `endpoint_tags`
   - `endpoint_requests`
   - `endpoint_request_tags`

### Step 3: Configure Storage

1. In your Supabase project dashboard, go to **Storage**
2. Click **Create a new bucket**
3. Configure the bucket:
   - **Name**: `endpoint-icons`
   - **Public bucket**: Toggle **ON** (this bucket stores publicly accessible endpoint icons)
   - **Allowed MIME types**: `image/png`, `image/jpeg`, `image/svg+xml`, `image/webp`
   - **File size limit**: 2 MB
4. Click **Create bucket**

### Step 4: Apply Storage Policies

1. Navigate to **Storage > Policies** in the left sidebar
2. Select the `endpoint-icons` bucket
3. Add the following policies:

**Policy 1: Public Read Access**
```sql
CREATE POLICY "Public can view endpoint icons"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'endpoint-icons');
```

**Policy 2: Authenticated Upload**
```sql
CREATE POLICY "Authenticated users can upload endpoint icons"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'endpoint-icons' AND
  (storage.foldername(name))[1] = 'icons'
);
```

**Policy 3: Admins Can Delete**
```sql
CREATE POLICY "Admins can delete endpoint icons"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'endpoint-icons' AND
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

**Policy 4: Users Can Upload**
---sql
CREATE POLICY "Users can upload their own icons"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
   bucket_id = 'endpoint-icons' AND
   (storage.foldername(name))[1] = auth.uid()::text
);

**Policy 4: Users Can Delete**
---sql
CREATE POLICY "Users can delete their own icons"
ON storage.objects FOR DELETE
TO authenticated
USING (
   bucket_id = 'endpoint-icons' AND
   (storage.foldername(name))[1] = auth.uid()::text
);
```

### Step 5: Collect API Credentials

1. Go to **Settings > API** in your Supabase project
2. Save the following values (you'll need them for Vercel):
   - **Project URL**: `https://[your-project-id].supabase.co`
   - **API Keys > anon public**: The public anonymous key
   - **API Keys > service_role**: The service role key (keep this secret!)

---

## Application Deployment (Vercel)

### Step 1: Connect Repository to Vercel

1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **Add New... > Project**
3. Import your Switchboard repository from GitHub
4. Vercel will automatically detect Next.js

### Step 2: Configure Build Settings

Verify the following settings (Vercel should auto-detect these):

- **Framework Preset**: Next.js
- **Root Directory**: `./` (leave as default)
- **Build Command**: `npm run build`
- **Install Command**: `npm install`
- **Output Directory**: `.next` (auto-detected)

### Step 3: Configure Environment Variables

In the Vercel project settings, add the following environment variables:

**Production Environment Variables**

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL | Production |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon public key | Production |
| `NEXT_PUBLIC_SITE_URL` | Your Vercel production URL (e.g., `https://switchboard.vercel.app`) | Production |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | Production |

**Notes:**
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- `SUPABASE_SERVICE_ROLE_KEY` is server-only and should never be exposed to the client
- You can also add these to Preview and Development environments

### Step 4: Deploy

1. Click **Deploy**
2. Vercel will build and deploy your application
3. Deployment typically takes 2-3 minutes
4. Once complete, you'll receive a production URL

### Step 5: Configure Custom Domain (Optional)

1. In your Vercel project, go to **Settings > Domains**
2. Add your custom domain
3. Follow Vercel's instructions to configure DNS records
4. Update `NEXT_PUBLIC_SITE_URL` environment variable to your custom domain
5. Redeploy the application

---

## Post-Deployment Verification

### Automated Health Checks

Run through this checklist to verify your deployment:

#### 1. Application Loads
- [ ] Navigate to your production URL
- [ ] Page loads without errors
- [ ] No console errors in browser DevTools

#### 2. Authentication Works
- [ ] Click "Sign In" in the header
- [ ] Register a new account
- [ ] Verify email confirmation (if enabled)
- [ ] Log in successfully
- [ ] Log out successfully

#### 3. Public Features
- [ ] Browse endpoints on the homepage
- [ ] Search for endpoints using the search bar
- [ ] Filter endpoints by tags
- [ ] Verify endpoint count displays correctly

#### 4. User Submissions
- [ ] Log in as a regular user
- [ ] Click "Submit Endpoint"
- [ ] Fill out the submission form
- [ ] Upload an endpoint icon (optional)
- [ ] Submit successfully
- [ ] Navigate to "My Submissions"
- [ ] Verify submission appears with "Pending" status

#### 5. Database Connectivity
- [ ] Verify all data loads correctly
- [ ] Check Supabase dashboard for new records
- [ ] Verify no RLS (Row Level Security) errors in browser console

### Performance Checks

1. Run Lighthouse audit (Chrome DevTools):
   - Target scores: Performance > 90, Accessibility > 95, Best Practices > 90, SEO > 90

2. Test mobile responsiveness:
   - iPhone (375px width)
   - iPad (768px width)
   - Desktop (1920px width)

3. Verify Vercel Analytics (if enabled):
   - Go to Vercel Dashboard > Analytics
   - Confirm data collection is working

---

## Creating Admin Users

After deployment, you need to manually create admin users in the database.

### Method 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **Authentication > Users**
3. Find the user you want to make admin (they must have registered first)
4. Copy their User UID
5. Go to **Database > Table Editor**
6. Select the `user_roles` table
7. Find the row with the user's `user_id`
8. Click to edit the row
9. Change the `role` column from `user` to `admin`
10. Click **Save**
11. The user now has admin access

### Method 2: Using SQL Editor

1. Go to **SQL Editor** in Supabase dashboard
2. Run the following query (replace `[USER_EMAIL]` with actual email):

```sql
UPDATE user_roles
SET role = 'admin'
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = '[USER_EMAIL]'
);
```

3. Verify the update:

```sql
SELECT ur.*, au.email
FROM user_roles ur
JOIN auth.users au ON ur.user_id = au.id
WHERE ur.role = 'admin';
```

### Verify Admin Access

1. Log in with the admin user account
2. You should now see "Admin Panel" in the left sidebar
3. Navigate to Admin Panel
4. Verify you can:
   - View dashboard statistics
   - See pending submissions
   - Approve/reject requests
   - Create endpoints directly

---

## Troubleshooting

### Issue: Build Fails in Vercel

**Symptoms:**
- Deployment fails during build step
- Error messages about missing environment variables

**Solution:**
1. Verify all environment variables are set in Vercel
2. Check that variable names match exactly (case-sensitive)
3. Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
4. Redeploy after adding variables

### Issue: "Invalid credentials" or "JWT expired" errors

**Symptoms:**
- Users can't log in
- Authentication fails silently
- Console shows JWT errors

**Solution:**
1. Verify `NEXT_PUBLIC_SUPABASE_URL` matches your Supabase project URL exactly
2. Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is the correct anon key (not service role key)
3. Check that `NEXT_PUBLIC_SITE_URL` matches your actual deployment URL
4. Clear browser cache and cookies
5. Redeploy application

### Issue: Images Not Loading

**Symptoms:**
- Endpoint icons don't display
- 403 Forbidden errors in console for Supabase storage URLs

**Solution:**
1. Verify the `endpoint-icons` bucket exists and is public
2. Check storage policies are correctly applied
3. Verify `next.config.js` has the correct `remotePatterns` configuration:
```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '*.supabase.co',
      pathname: '/storage/**',
    },
  ],
}
```

### Issue: Row Level Security (RLS) Errors

**Symptoms:**
- "insufficient privileges" errors
- Data doesn't load for certain users
- 403 errors when accessing endpoints

**Solution:**
1. Go to Supabase Dashboard > Database > Tables
2. Verify RLS is enabled on all tables
3. Check that policies are created correctly
4. Run the migration again if policies are missing
5. Test with Supabase's "View as user" feature

### Issue: Database Connection Errors

**Symptoms:**
- "Failed to fetch" errors
- Timeout errors
- No data loads on the frontend

**Solution:**
1. Check Supabase project is not paused (free tier projects pause after inactivity)
2. Verify database is not experiencing an outage (check Supabase status page)
3. Check connection pooling settings in Supabase dashboard
4. Verify `SUPABASE_SERVICE_ROLE_KEY` is set for server-side operations

### Issue: Slow Performance

**Symptoms:**
- Pages take a long time to load
- Laggy interactions
- Poor Lighthouse scores

**Solution:**
1. Check Vercel deployment region matches your primary user base
2. Enable Vercel Edge caching for static assets
3. Review Supabase database indexes (already included in migration)
4. Consider upgrading Supabase plan for better performance
5. Enable Vercel Analytics to identify bottlenecks

### Issue: CORS Errors

**Symptoms:**
- "CORS policy" errors in browser console
- API requests fail from the frontend

**Solution:**
1. This should not occur with proper Next.js setup
2. If it does, verify `NEXT_PUBLIC_SITE_URL` is set correctly
3. Check Supabase dashboard > API Settings > CORS
4. Ensure your Vercel domain is allowed

---

## Rollback Procedures

### Application Rollback

If you need to rollback a deployment:

1. Go to Vercel Dashboard > Deployments
2. Find the previous stable deployment
3. Click the three dots menu > "Promote to Production"
4. Confirm the rollback

### Database Rollback

Database rollbacks are more complex. Best practices:

1. **Always test migrations in a staging environment first**
2. Create a backup before running migrations:
   ```bash
   # Using Supabase CLI (if installed)
   supabase db dump -f backup-$(date +%Y%m%d).sql
   ```
3. If you need to rollback:
   - Create a reverse migration SQL script
   - Test it in a development database first
   - Apply carefully in production via SQL Editor

**Note:** The initial schema has no rollback migration. If needed, you would need to manually drop tables (not recommended in production).

---

## Monitoring and Maintenance

### Regular Tasks

**Daily:**
- Check Vercel dashboard for errors
- Monitor Supabase dashboard for unusual activity

**Weekly:**
- Review pending endpoint submissions
- Check database size and usage metrics
- Verify backups are running (if configured)

**Monthly:**
- Review Vercel and Supabase usage/billing
- Update dependencies: `npm update`
- Run security audit: `npm audit`
- Check for Next.js updates

### Setting Up Alerts

**Vercel:**
1. Go to Project Settings > Notifications
2. Enable alerts for:
   - Deployment failures
   - Performance degradation
   - Quota warnings

**Supabase:**
1. Go to Project Settings > Notifications
2. Enable alerts for:
   - Database connection issues
   - High CPU usage
   - Storage quota warnings

---

## Support and Resources

- **Switchboard Repository**: [GitHub Repository URL]
- **Next.js Documentation**: https://nextjs.org/docs
- **Vercel Documentation**: https://vercel.com/docs
- **Supabase Documentation**: https://supabase.com/docs
- **Deployment Issues**: Open an issue on the GitHub repository

---

## Appendix: Environment Variables Reference

### Required Variables

| Variable | Purpose | Example Value | Exposed to Client? |
|----------|---------|---------------|-------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://abc123.supabase.co` | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbG...` | Yes |
| `NEXT_PUBLIC_SITE_URL` | Application URL | `https://switchboard.vercel.app` | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) | `eyJhbG...` | No |

### Optional Variables

| Variable | Purpose | Example Value | Exposed to Client? |
|----------|---------|---------------|-------------------|
| `VERCEL_URL` | Automatically set by Vercel | Auto | No |
| `NEXT_PUBLIC_VERCEL_ENV` | Deployment environment | `production` | Yes |

---

## Security Checklist

Before going live, ensure:

- [ ] All environment variables are set correctly
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is not exposed to the client
- [ ] Security headers are configured in `next.config.js`
- [ ] RLS policies are enabled on all database tables
- [ ] Storage bucket policies are correctly configured
- [ ] HTTPS is enforced (automatic with Vercel)
- [ ] No sensitive data in client-side code
- [ ] No API keys committed to the repository
- [ ] Password policies are enforced in Supabase Auth settings
- [ ] Rate limiting is configured (if needed)

---

**Deployment Guide Version**: 1.0
**Last Updated**: 2026-02-04
**Prepared By**: DevOps Agent

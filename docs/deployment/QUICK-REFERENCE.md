# Deployment Quick Reference

Quick commands and procedures for common deployment tasks.

## Emergency Procedures

### Rollback Production Deployment

```bash
# Via Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Select your project
3. Click "Deployments"
4. Find the last stable deployment
5. Click "..." menu > "Promote to Production"
```

### Check Application Status

```bash
# Check if site is up
curl -I https://your-site.vercel.app

# Check health endpoint (if implemented)
curl https://your-site.vercel.app/healthz
```

### View Live Logs

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# View logs
vercel logs [deployment-url]
```

## Environment Variables

### Add/Update Environment Variable

```bash
# Via Vercel CLI
vercel env add VARIABLE_NAME production

# Via Dashboard
1. Go to Project Settings > Environment Variables
2. Add or edit variable
3. Redeploy to apply changes
```

### List Environment Variables

```bash
# Via Vercel CLI
vercel env ls

# Via Dashboard
Project Settings > Environment Variables
```

## Database Operations

### Run Migration

```sql
-- In Supabase SQL Editor
-- Copy and paste migration file contents
-- Run query
```

### Create Database Backup

```bash
# Via Supabase CLI (if installed)
supabase db dump -f backup-$(date +%Y%m%d).sql

# Via Dashboard
1. Go to Database > Backups
2. Click "Create backup"
```

### Check Database Size

```sql
-- In Supabase SQL Editor
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## User Management

### Create Admin User

```sql
-- Method 1: Update existing user
UPDATE user_roles
SET role = 'admin'
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'user@example.com');

-- Method 2: Verify admin status
SELECT ur.role, au.email
FROM user_roles ur
JOIN auth.users au ON ur.user_id = au.id
WHERE au.email = 'user@example.com';
```

### List All Admin Users

```sql
SELECT
  au.email,
  au.created_at,
  ur.role
FROM user_roles ur
JOIN auth.users au ON ur.user_id = au.id
WHERE ur.role = 'admin'
ORDER BY au.created_at DESC;
```

### Revoke Admin Access

```sql
UPDATE user_roles
SET role = 'user'
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'user@example.com');
```

## Monitoring

### Check Error Rates

```bash
# Via Vercel Dashboard
1. Go to Analytics
2. Check Error Rate graph
3. Filter by time range
```

### View Recent Errors

```bash
# Via Vercel Dashboard
1. Go to Deployments > Select deployment
2. Click "Functions" tab
3. View function logs and errors
```

### Monitor Database Performance

```sql
-- Check slow queries
SELECT
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

## Common Issues

### Issue: Users Can't Log In

```bash
# Check Supabase Auth settings
1. Go to Authentication > Settings
2. Verify Email Auth is enabled
3. Check redirect URLs include your production URL

# Verify environment variables
vercel env ls production
# Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set
```

### Issue: Images Not Loading

```bash
# Check storage bucket
1. Go to Supabase > Storage
2. Verify 'endpoint-icons' bucket exists
3. Check bucket is public
4. Verify storage policies

# Check Next.js config
# Ensure next.config.js has correct remotePatterns
```

### Issue: Build Failing

```bash
# Check build logs
1. Go to Vercel Dashboard > Deployments
2. Click failed deployment
3. View build logs

# Common fixes:
# - Add missing environment variables
# - Check for TypeScript errors: npm run type-check
# - Check for linting errors: npm run lint
# - Verify dependencies: npm ci && npm run build
```

### Issue: Slow Performance

```bash
# Check Vercel Analytics
1. Go to Analytics > Performance
2. Identify slow pages
3. Check for:
   - Large images
   - Slow database queries
   - Unoptimized components

# Check database indexes
# Verify indexes exist on frequently queried columns
```

## Deployment Workflow

### Standard Deployment

```bash
# 1. Ensure you're on the correct branch
git checkout master

# 2. Pull latest changes
git pull origin master

# 3. Run pre-deployment checks
npm run type-check
npm run lint
npm run build

# 4. Push to GitHub (triggers auto-deploy if configured)
git push origin master

# 5. Monitor deployment in Vercel Dashboard
```

### Manual Deployment via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to production
vercel --prod

# Deploy to preview
vercel
```

## Maintenance Tasks

### Weekly Tasks

```bash
# Check for dependency updates
npm outdated

# Run security audit
npm audit

# Review error logs in Vercel Dashboard
# Review database size and performance in Supabase Dashboard
```

### Monthly Tasks

```bash
# Update dependencies (carefully)
npm update
npm audit fix

# Review and optimize database
# Review Vercel and Supabase usage/billing
```

## Security

### Rotate API Keys

```bash
# 1. Generate new keys in Supabase
# 2. Update environment variables in Vercel
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# 3. Redeploy application
# 4. Delete old keys after verification
```

### Check Security Headers

```bash
curl -I https://your-site.vercel.app | grep -E "(X-Content-Type|X-Frame|X-XSS|Referrer)"
```

### Review RLS Policies

```sql
-- List all RLS policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

## Support Resources

- **Vercel Status**: https://vercel-status.com
- **Supabase Status**: https://status.supabase.com
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs

## Emergency Contacts

- **DevOps Team**: [Add contact info]
- **Database Admin**: [Add contact info]
- **On-Call Engineer**: [Add contact info]

---

**Last Updated:** 2026-02-04
**Maintained By:** DevOps Team

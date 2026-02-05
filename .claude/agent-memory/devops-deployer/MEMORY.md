# DevOps Agent Memory - Switchboard Project

## Project Configuration

### Technology Stack
- **Frontend/Backend**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel
- **Language**: TypeScript
- **Package Manager**: npm

### Key Files
- `next.config.js`: Next.js configuration with security headers and image optimization
- `vercel.json`: Vercel deployment configuration
- `supabase/migrations/001_initial_schema.sql`: Complete database schema with RLS policies
- `.env.example`: Environment variable template

## Environment Variables Required

### Production
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key (safe for client)
- `NEXT_PUBLIC_SITE_URL`: Production URL
- `SUPABASE_SERVICE_ROLE_KEY`: Server-side only (never expose to client)

### Build Issues Discovered
- Next.js static generation fails without environment variables
- `useSearchParams()` in client components causes prerender warnings
- All pages are client-side rendered ('use client')
- Build requires placeholder env vars: `NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co npm run build`

## Database Schema

### Tables
- `user_roles`: User role assignments (user/admin)
- `tags`: Service categories for filtering
- `endpoints`: Published API endpoints
- `endpoint_tags`: Many-to-many junction table
- `endpoint_requests`: Pending user submissions
- `endpoint_request_tags`: Tags for pending requests

### Key Functions
- `approve_endpoint_request(request_id)`: Atomically creates endpoint from request
- `reject_endpoint_request(request_id)`: Rejects pending request
- `is_admin(user_id)`: Checks admin status
- `get_user_role()`: Returns current user's role

### Storage
- Bucket: `endpoint-icons` (public)
- Policies: Public read, authenticated upload, admin delete

## Security Configuration

### Headers Applied (next.config.js)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

### RLS Policies
- All tables have Row Level Security enabled
- Admin checks use `is_admin()` function
- Public can view active endpoints only
- Users can view/manage their own submissions

## Testing Dependencies Added
- `@playwright/test`: E2E testing
- `vitest`: Unit testing
- `@testing-library/react`: Component testing
- `@testing-library/user-event`: User interaction testing
- `@testing-library/jest-dom`: DOM matchers
- `jsdom`: DOM environment for tests

### Test Scripts
- `npm run test`: Vitest unit tests
- `npm run test:ui`: Vitest with UI
- `npm run test:e2e`: Playwright E2E tests
- `npm run test:e2e:ui`: Playwright with UI

## Deployment Documentation Created

### Files
1. `docs/deployment/DEPLOYMENT-GUIDE.md`: Complete deployment instructions (15+ pages)
2. `docs/deployment/PRE-DEPLOYMENT-CHECKLIST.md`: Pre-flight checklist
3. `docs/deployment/QUICK-REFERENCE.md`: Common commands and procedures

### Key Sections
- Supabase setup and migration
- Vercel deployment configuration
- Environment variable management
- Admin user creation
- Post-deployment verification
- Troubleshooting guide
- Rollback procedures

## CI/CD Pipeline

### GitHub Actions
- `.github/workflows/ci.yml`: Lint, type-check, build, test
- `.github/workflows/deploy-production.yml`: Deploy to Vercel on main/master push

### Pipeline Stages
1. Lint and type check
2. Build verification (with placeholder env vars)
3. Security audit
4. Unit tests
5. E2E tests
6. Deploy to Vercel
7. Post-deployment verification

## Known Issues

### Build Time Issues
- Static generation fails without real Supabase credentials
- Workaround: Use placeholder env vars for build verification
- In production, Vercel will use real credentials from environment variables

### Suspense Boundary Warning
- `useSearchParams()` causes prerender warnings
- Not blocking deployment (Next.js will dynamically render)
- Future enhancement: Wrap in Suspense boundary if static generation needed

## Admin User Creation Process

1. User must register through the UI first
2. Admin updates `user_roles` table in Supabase:
   ```sql
   UPDATE user_roles
   SET role = 'admin'
   WHERE user_id = (SELECT id FROM auth.users WHERE email = 'user@example.com');
   ```
3. User gets immediate admin access (no re-login required)
4. Admin panel appears in left sidebar

## Vercel Configuration

### vercel.json
- Framework: Next.js auto-detected
- Functions: 1024MB memory, 30s timeout
- Headers: Security headers duplicated from next.config.js for redundancy
- Rewrite: `/healthz` → `/api/health` (if health check implemented)

### Recommended Settings
- Region: `iad1` (US East) or closest to users
- Node version: 20
- Build command: `npm run build`
- Install command: `npm install`

## Rollback Procedures

### Application Rollback
1. Vercel Dashboard → Deployments
2. Select previous stable deployment
3. "..." menu → "Promote to Production"
4. Instant rollback (no downtime)

### Database Rollback
- No automated rollback for migrations
- Must create reverse migration manually
- Always test migrations in staging first
- Consider database backups before schema changes

## Performance Considerations

### Build Time
- Expected: 2-3 minutes on Vercel
- If exceeds 5 minutes, investigate dependencies

### Database Indexes
- Full-text search on endpoints (title, company, description)
- Trigram indexes for fuzzy search
- Composite indexes on frequently queried columns

### Image Optimization
- Next.js Image component configured for Supabase storage
- Lazy loading enabled by default
- Remote patterns: `*.supabase.co/storage/**`

## Monitoring Recommendations

### Vercel Analytics
- Enable for performance tracking
- Monitor Core Web Vitals
- Track error rates

### Supabase Monitoring
- Database size and growth
- Connection pooling metrics
- Slow query analysis via `pg_stat_statements`

## Future Enhancements

1. Add health check endpoint at `/api/health`
2. Implement Sentry for error tracking
3. Add database backup automation
4. Implement rate limiting for API routes
5. Add monitoring alerts (Vercel + Supabase)
6. Implement staging environment
7. Add proper unit and E2E test coverage

## Lessons Learned

1. Next.js 14 App Router requires environment variables even for static generation
2. Client components with `useSearchParams()` need special handling
3. Security headers should be configured in both `next.config.js` and `vercel.json`
4. Supabase RLS policies must be thoroughly tested before deployment
5. Admin user creation requires manual database update (by design)
6. Placeholder env vars are sufficient for CI/CD build verification

## Contact Points

- **Repository**: /home/mschodin/projects/switchboard_v1
- **Branch**: switchboard_v1
- **Main Branch**: master
- **Documentation**: docs/deployment/

---

Last Updated: 2026-02-04

# Pre-Deployment Checklist

Use this checklist before every production deployment to ensure a smooth release.

## Code Quality

- [ ] All code changes have been reviewed and approved
- [ ] TypeScript type checking passes: `npm run type-check`
- [ ] Linting passes with no errors: `npm run lint`
- [ ] No console.log statements in production code (except intentional logging)
- [ ] No TODO or FIXME comments for critical functionality

## Testing

- [ ] All unit tests pass: `npm run test` (when implemented)
- [ ] All E2E tests pass: `npm run test:e2e` (when implemented)
- [ ] Manual testing completed for new features
- [ ] Regression testing completed for bug fixes
- [ ] Cross-browser testing completed (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsive testing completed (iOS Safari, Chrome Android)

## Dependencies

- [ ] All dependencies are up to date (or documented why not)
- [ ] No high or critical security vulnerabilities: `npm audit`
- [ ] Lock file is committed (package-lock.json)
- [ ] No unused dependencies

## Configuration

- [ ] Environment variables documented in `.env.example`
- [ ] All required environment variables are set in Vercel
- [ ] `next.config.js` is properly configured
- [ ] Security headers are enabled
- [ ] Image domains are whitelisted in Next.js config

## Database

- [ ] Database migrations are tested locally
- [ ] Migration has been applied to staging environment (if applicable)
- [ ] Rollback plan is documented
- [ ] Database backups are enabled
- [ ] RLS policies are tested and verified

## Performance

- [ ] Build completes successfully: `npm run build`
- [ ] Build time is acceptable (< 5 minutes)
- [ ] Bundle size is reasonable (check `.next/analyze` if available)
- [ ] Images are optimized and properly sized
- [ ] Fonts are preloaded
- [ ] No unnecessary re-renders in React components

## Security

- [ ] All API routes are protected with authentication
- [ ] RLS policies are enabled on all Supabase tables
- [ ] Sensitive data is not logged
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented (if applicable)
- [ ] SQL injection vulnerabilities have been checked
- [ ] XSS vulnerabilities have been checked
- [ ] CSRF protection is in place (Next.js handles this)

## Documentation

- [ ] README.md is up to date
- [ ] API documentation is up to date (if applicable)
- [ ] Deployment guide is accurate
- [ ] Changelog is updated with new changes

## Deployment Preparation

- [ ] Branch is up to date with main/master
- [ ] All changes are committed
- [ ] Git tags are created for the release (if applicable)
- [ ] Rollback procedure is documented
- [ ] Team is notified of upcoming deployment
- [ ] Deployment window is scheduled (if downtime expected)

## Vercel Specific

- [ ] Vercel project is connected to the correct repository
- [ ] Vercel build settings are correct
- [ ] Environment variables are set for Production environment
- [ ] Custom domain is configured (if applicable)
- [ ] Preview deployments are working correctly

## Supabase Specific

- [ ] Supabase project is not paused
- [ ] Database connection pooling is configured
- [ ] Storage buckets are created and configured
- [ ] Storage policies are applied
- [ ] Auth settings are correct (email confirmation, password requirements)

## Post-Deployment Verification Plan

- [ ] Health check endpoint is available
- [ ] Authentication flow works
- [ ] Critical user flows are tested
- [ ] Error monitoring is active (Vercel, Sentry, etc.)
- [ ] Analytics are tracking correctly

## Communication

- [ ] Stakeholders are informed of deployment
- [ ] Maintenance window is communicated (if applicable)
- [ ] Status page is updated (if applicable)
- [ ] Support team is prepared for potential issues

## Rollback Plan

- [ ] Previous stable deployment ID is documented
- [ ] Rollback procedure is tested
- [ ] Database rollback scripts are prepared (if schema changes)
- [ ] Team knows how to execute rollback

---

## Approval

**Deployed By:** _________________

**Date:** _________________

**Approved By:** _________________

**Deployment Notes:**

_________________________________________________________________________________

_________________________________________________________________________________

_________________________________________________________________________________

---

## Quick Command Reference

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build
npm run build

# Security audit
npm audit

# Test (when implemented)
npm run test
npm run test:e2e

# View dependencies
npm list --depth=0
```

---

**Last Updated:** 2026-02-04

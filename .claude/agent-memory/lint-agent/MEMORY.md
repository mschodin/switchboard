# Lint Agent Memory - Switchboard Project

## Project Overview
- **Name**: Switchboard API Endpoint Registry
- **Tech Stack**: Next.js 14, React 18, TypeScript 5.6, Supabase, Tailwind CSS
- **Code Quality**: 90/100

## Key Findings

### Critical Fixes Applied
1. HTML entity escaping in JSX (2 files)
   - `/src/app/(auth)/login/page.tsx`: `Don't` → `Don&apos;t`
   - `/src/components/submissions/submission-empty-state.tsx`: `haven't` → `haven&apos;t`
   - Rule: `react/no-unescaped-entities`

2. Hook dependency optimization
   - `/src/hooks/use-filters.ts`: Wrapped `tags` in `useMemo` to stabilize callback
   - Prevents unnecessary re-renders in dependent components
   - Rule: `react-hooks/exhaustive-deps`

### Lint Status
- **ESLint**: ✓ PASS (0 errors, 0 warnings after fixes)
- **TypeScript**: ⚠ Blocked by missing test dependencies
- **Test Config**: Tests defined but `@playwright/test`, `vitest`, `@testing-library/react` not in package.json

## Architecture Patterns

### Server/Client Component Boundary
- Properly marked with `'use server'` and `'use client'` directives
- Auth logic in server actions with proper user verification
- Client components for interactive UI (filters, forms)
- Layout uses AuthProvider for context-based state

### Authentication Flow
- Supabase Auth integration (JWT via httpOnly cookies)
- AuthProvider in root layout for session management
- RLS policies at database level for data isolation
- User roles with admin checks in server actions

### Form Validation Pattern
- Zod schemas defined in `/src/lib/validators.ts`
- Server-side validation in all server actions (never trust client)
- Strong password requirements (8+ chars, mixed case, numbers)
- UUID validation for tag IDs

### Database Pattern
- Comprehensive RLS policies on all tables
- Full-text search with GIN indexes on text fields
- Trigger-based timestamp updates (updated_at)
- Check constraints for data validation
- Junction tables for many-to-many relationships

## Security Insights

### Strengths
- ✓ Proper parameterized queries (no SQL injection risk)
- ✓ Input validation with Zod before database ops
- ✓ RLS policies prevent unauthorized access at DB level
- ✓ No hardcoded secrets, all environment variables
- ✓ Proper error handling doesn't expose sensitive data

### Gaps Identified
- ⚠ No rate limiting on Server Actions (recommend Upstash Redis)
- ⚠ No security headers configured (X-Content-Type-Options, etc.)
- ⚠ No Content Security Policy header
- ⚠ Cookie error handling silently fails (add debug logging)

## Performance Notes

### Query Optimization
- Database indexes properly configured on:
  - Status, company, title, created_at
  - Full-text search vectors (GIN indexes)
  - Junction tables (endpoint_id, tag_id)
- Client-side tag filtering works for small datasets but should move to SQL for >1000 endpoints

### Type Safety
- Strict TypeScript enabled (strict: true)
- Some `any` types in Supabase integration (server.ts line 15, endpoints.ts line 49)
- Recommendation: Create proper DTO types for API responses

## Code Patterns to Replicate

### Server Action Pattern
```typescript
'use server'

export async function action(formData: FormData): Promise<ActionResult> {
  const supabase = createServerClient()

  // Verify authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: { root: ['Auth required'] } }

  // Verify authorization
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()
  if (roleData?.role !== 'admin') {
    return { error: { root: ['Admin required'] } }
  }

  // Validate input
  const validated = schema.safeParse(Object.fromEntries(formData))
  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors }
  }

  // Execute operation
  const { data, error } = await supabase
    .from('table')
    .insert(validated.data)
    .select()
    .single()

  if (error) return { error: { root: [error.message] } }

  revalidatePath('/affected-path')
  return { success: true, data }
}
```

### Hook Pattern for URL Filters
```typescript
'use client'

export function useFilters() {
  const searchParams = useSearchParams()

  // Wrap parsed data in useMemo to stabilize references
  const filters = useMemo(
    () => ({ tags: searchParams.get('tags')?.split(',') ?? [] }),
    [searchParams]
  )

  // Use filters in useCallback with stable dependency
  const toggle = useCallback(
    (tag: string) => {
      const newTags = filters.tags.includes(tag)
        ? filters.tags.filter(t => t !== tag)
        : [...filters.tags, tag]
      // update URL
    },
    [filters]
  )
}
```

## Common Issues & Fixes

### ESLint Rule Violations
1. **react/no-unescaped-entities**: Use `&apos;`, `&quot;`, `&lt;`, `&gt;` for special chars
2. **react-hooks/exhaustive-deps**: Wrap dynamic values in useMemo/useCallback if used as dependency
3. **prefer-const**: Use const for variables that aren't reassigned

### TypeScript Issues
1. **Implicit any**: Always provide type for parameters/variables
2. **any usage**: Replace with `unknown` and proper type guards, or create proper interfaces
3. **Missing types**: Use type inference when possible, explicit when needed

## Improvements Made
- Comprehensive lint report with detailed findings
- Security audit with recommendations
- Fixed 3 linting issues automatically
- Identified test infrastructure gaps
- Generated multiple documentation files for future reference

## Next Actions for Team
1. Install test dependencies (`npm install --save-dev @playwright/test vitest @testing-library/react @testing-library/user-event`)
2. Implement security headers in next.config.js
3. Add rate limiting to Server Actions
4. Increase test coverage
5. Set up CI/CD with automated linting

## Files Modified
- `/src/app/(auth)/login/page.tsx` - Fixed HTML entity
- `/src/components/submissions/submission-empty-state.tsx` - Fixed HTML entity
- `/src/hooks/use-filters.ts` - Added useMemo optimization

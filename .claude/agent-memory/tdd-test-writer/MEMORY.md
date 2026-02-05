# TDD Test Writer - Switchboard Project Memory

## Project Context
- **Tech Stack:** Next.js 14+, React, TypeScript, Supabase, shadcn/ui
- **Testing Stack:** Vitest (unit/integration), React Testing Library, Playwright (E2E), pgTAP (database)
- **Approach:** Pure TDD - tests written from specs only, no source code examination

## Key Patterns Learned

### 1. Test Organization
- **Four-tier structure works well:** unit/ integration/ e2e/ db/
- **Fixtures centralized:** Single source of truth for mock data prevents drift
- **Mocks by domain:** Separate mock files per external service (Supabase, etc.)

### 2. Supabase-Specific Testing
- **RLS policies need dedicated DB tests:** Can't be fully tested at unit level
- **Database functions require SQL tests:** approve_endpoint_request(), etc.
- **Mock both browser and server clients:** Different auth patterns
- **Session management is complex:** Need tests for refresh, expiry, persistence

### 3. Next.js App Router Testing
- **Server Actions tested as functions:** Don't need full HTTP testing
- **Use redirect() mock:** Server Actions use redirect() not router.push()
- **Server Components need different approach:** May need integration tests instead of unit tests

### 4. Authentication Testing Patterns
- **Auth context is global state:** Test initialization, updates, cleanup
- **Role checking is critical:** Test admin vs user permissions extensively
- **Session persistence matters:** Test across page refreshes, tab switches
- **Three-tier auth:** Unauthenticated, Authenticated User, Admin

### 5. Form Testing Best Practices
- **Test validation before submission:** Client-side catches most errors
- **Test field constraints separately:** Max length, required, format
- **File uploads need special mocks:** createMockFile() utility
- **Multi-step forms need state tests:** Draft saving, restoration

### 6. E2E Test Patterns
- **Use data-testid liberally:** More stable than text/class selectors
- **Wait strategies matter:** waitForTimeout() vs waitForSelector()
- **Responsive tests need viewport changes:** Test at key breakpoints
- **Mock slow operations:** Use fake timers for debounce tests

### 7. Coverage Matrix Critical
- **Bidirectional traceability essential:** Requirement → Test, Test → Requirement
- **Average 2-3 tests per AC:** Some require more, simpler ones need fewer
- **Priority matters:** H/M/L helps focus test execution order

## Common Pitfalls Avoided

### 1. Over-Mocking
- ❌ Don't mock everything in unit tests
- ✅ Mock external services (Supabase), test actual logic

### 2. Testing Implementation Details
- ❌ Don't test internal state, private methods
- ✅ Test observable behavior, public APIs

### 3. Flaky E2E Tests
- ❌ Don't use arbitrary setTimeout()
- ✅ Use waitForSelector(), waitFor() with conditions

### 4. Incomplete Edge Cases
- Always test: null, undefined, empty string, empty array
- Always test: min/max boundaries, overflow
- Always test: network errors, permission denied

### 5. Missing Accessibility Tests
- Every interactive component needs keyboard navigation tests
- Every icon needs aria-label tests
- Every form needs proper label association tests

## Test Naming Conventions

### Good Test Names
```typescript
it('should display error when email is invalid')
it('should filter endpoints when tag is clicked')
it('should deny access to admin panel for regular users')
```

### Avoid
```typescript
it('works correctly') // Too vague
it('test authentication') // Not descriptive
it('AC1') // Use AC reference in comments, not test name
```

## Fixture Data Strategy

### Effective Patterns
1. **Realistic IDs:** Use UUIDs that look like real data
2. **Meaningful content:** Company names like "Auth0", "Stripe" help identify test context
3. **Variations ready:** Invalid data fixtures alongside valid ones
4. **Relationships preserved:** Mock data includes foreign key references

### Example
```typescript
export const mockEndpoints = [
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', // Pattern recognizable in logs
    company: 'Auth0', // Real company name aids debugging
    endpoint_tags: [{ tag: mockTags[0] }], // Relationship intact
  }
]
```

## Documentation Patterns That Worked

### Test File Headers
```typescript
/**
 * Unit Tests: ComponentName
 * Tests [what it tests]
 *
 * Based on:
 * - LLD Section X: [reference]
 * - User Story SWB-XXX: [story title]
 */
```

### Test Comments
```typescript
// AC2: Given registered user, When they enter valid credentials,
// Then they are authenticated

// Expected:
// - Calls supabase.auth.signInWithPassword
// - Updates auth context
// - Redirects to home
```

## Metrics

### Test Suite Size
- **Total tests:** 225
- **Unit tests:** 142 (63%)
- **Integration tests:** 12 (5%)
- **E2E tests:** 62 (28%)
- **Database tests:** 9 (4%)

### Coverage by Story
- Average 13.2 tests per user story
- Range: 6 tests (simple stories) to 22 tests (complex forms)

### Test Complexity
- Simple tests: 30% (single assertion, no setup)
- Medium tests: 50% (multiple steps, some mocking)
- Complex tests: 20% (multi-component, async, timing-dependent)

## Tools & Utilities Created

1. **createMockSupabaseClient()** - Comprehensive Supabase mock
2. **renderWithProviders()** - Custom render with auth context
3. **createMockFile()** - File upload testing
4. **mockMatchMedia()** - Responsive testing
5. **builders object** - Test data builders (endpoint, tag, request)

## Future Considerations

### When Implementation Begins
1. Import paths will need adjustment based on actual structure
2. Some tests may need refinement based on actual API responses
3. Database tests require Supabase local dev setup
4. CI/CD pipeline needs test database provisioning

### Potential Additions
1. Visual regression tests (Chromatic, Percy)
2. Performance tests (Lighthouse CI)
3. Load tests (k6) for API endpoints
4. Security tests (OWASP ZAP)

## Links to Key Files

- **Coverage Matrix:** `__tests__/TEST-COVERAGE-MATRIX.md`
- **Test README:** `__tests__/README.md`
- **Supabase Mocks:** `__tests__/mocks/supabase.ts`
- **Test Fixtures:** `__tests__/fixtures/endpoints.ts`
- **Test Utils:** `__tests__/utils/test-utils.tsx`

## Success Criteria Met

✅ 100% acceptance criteria coverage
✅ Tests written without examining source code (pure TDD)
✅ Comprehensive edge case coverage
✅ Clear traceability (requirements → tests)
✅ Organized structure (easy to navigate)
✅ Reusable mocks and utilities
✅ Detailed documentation
✅ Ready for implementation phase

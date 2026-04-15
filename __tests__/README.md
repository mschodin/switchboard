## Switchboard Test Suite

Comprehensive test suite for the Switchboard API Endpoint Registry application, following Test-Driven Development (TDD) principles.

---

## Overview

This test suite provides complete coverage of the Switchboard application based on:
- **Low-Level Design (LLD):** `/docs/design/SWITCHBOARD-LLD.md`
- **User Stories:** `/docs/user-stories/SWITCHBOARD-USER-STORIES.md`

**Total Test Cases:** 225 tests across unit, integration, E2E, and database layers

---

## Directory Structure

```
__tests__/
├── README.md                          # This file
├── TEST-COVERAGE-MATRIX.md            # Complete traceability matrix
│
├── unit/                              # Unit tests (142 tests)
│   ├── components/                    # Component tests
│   │   ├── endpoint-card.test.tsx     # EndpointCard component
│   │   ├── left-sidebar.test.tsx      # LeftSidebar component
│   │   ├── search-bar.test.tsx        # SearchBar component
│   │   └── endpoint-form.test.tsx     # EndpointForm component
│   ├── hooks/                         # Custom hook tests
│   │   └── use-auth.test.ts           # useAuth hook
│   ├── actions/                       # Server action tests
│   │   └── auth-actions.test.ts       # Auth server actions
│   └── utils/                         # Utility function tests
│
├── integration/                       # Integration tests (12 tests)
│   └── auth-flow.test.ts              # Complete auth workflows
│
├── e2e/                               # E2E tests with Playwright (62 tests)
│   ├── public-registry.spec.ts        # Public registry viewing
│   ├── search-and-filter.spec.ts      # Search and filter functionality
│   └── admin-workflow.spec.ts         # Admin approval workflows
│
├── db/                                # Database tests (9 tests)
│   ├── schema.test.sql                # Schema validation
│   ├── rls-policies.test.sql          # RLS policy tests
│   ├── triggers.test.sql              # Database triggers
│   └── functions.test.sql             # Database functions
│
├── mocks/                             # Test mocks
│   └── supabase.ts                    # Supabase client mocks
│
├── fixtures/                          # Test data fixtures
│   └── endpoints.ts                   # Endpoint test data
│
└── utils/                             # Test utilities
    └── test-utils.tsx                 # Custom render functions, helpers
```

---

## Test Categories

### 1. Unit Tests (142 tests)

**Purpose:** Test individual components, hooks, and functions in isolation

**Framework:** Vitest + React Testing Library

**Key Test Files:**
- `components/endpoint-card.test.tsx` - 19 tests
- `components/left-sidebar.test.tsx` - 13 tests
- `components/search-bar.test.tsx` - 20 tests
- `components/endpoint-form.test.tsx` - 22 tests
- `hooks/use-auth.test.ts` - 40+ tests
- `actions/auth-actions.test.ts` - 30+ tests

**Coverage:**
- Component rendering and interactions
- Hook state management
- Server action validation
- Form validation logic
- UI state transitions

### 2. Integration Tests (12 tests)

**Purpose:** Test complete workflows across multiple components/services

**Framework:** Vitest

**Key Test Files:**
- `integration/auth-flow.test.ts` - Complete authentication flows

**Coverage:**
- Registration → Database trigger → Role assignment
- Login → Session management → UI updates
- Logout → State clearing → Redirects
- Session persistence across page refreshes

### 3. E2E Tests (62 tests)

**Purpose:** Test complete user journeys in a real browser

**Framework:** Playwright

**Key Test Files:**
- `e2e/public-registry.spec.ts` - 20+ tests
- `e2e/search-and-filter.spec.ts` - 30+ tests
- `e2e/admin-workflow.spec.ts` - 15+ tests

**Coverage:**
- Public registry viewing and navigation
- Search and filter functionality
- Tag-based filtering with multi-select
- User registration and login flows
- Endpoint submission by authenticated users
- Admin approval/rejection workflows
- Direct endpoint creation by admins
- Responsive layout behavior

### 4. Database Tests (9 tests)

**Purpose:** Validate database schema, RLS policies, and functions

**Framework:** pgTAP or custom SQL test scripts

**Key Test Files:**
- `db/schema.test.sql` - Table structure validation
- `db/rls-policies.test.sql` - Row-level security policies
- `db/triggers.test.sql` - Database triggers
- `db/functions.test.sql` - PostgreSQL functions

**Coverage:**
- Schema integrity (tables, columns, constraints)
- RLS policy enforcement (unauthenticated, user, admin)
- Automatic role assignment trigger
- Approval/rejection functions

---

## Running Tests

### Prerequisites

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Configure Supabase test database credentials
```

### Run All Tests

```bash
npm test
```

### Run Specific Test Suites

```bash
# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# E2E tests only
npm run test:e2e

# Database tests only
npm run test:db
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Run E2E Tests in UI Mode (Playwright)

```bash
npx playwright test --ui
```

---

## Test Configuration

### Vitest Configuration

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '__tests__/',
        '.next/',
        'src/types/',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Playwright Configuration

Create `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: '__tests__/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### Test Setup File

Create `__tests__/setup.ts`:

```typescript
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock Supabase client (if needed globally)
vi.mock('@/lib/supabase/client', () => ({
  createBrowserClient: () => ({
    // Mock implementation
  }),
}))
```

---

## Writing Tests

### Test Naming Convention

Tests follow the "should [expected behavior] when [condition]" pattern:

```typescript
it('should display error when email is invalid', async () => {
  // Test implementation
})

it('should filter endpoints when tag is clicked', async () => {
  // Test implementation
})
```

### Test Structure (AAA Pattern)

All tests follow the Arrange-Act-Assert pattern:

```typescript
it('should highlight selected tag', async () => {
  // Arrange: Set up test data and render component
  const mockOnTagClick = vi.fn()
  render(<LeftSidebar selectedTags={[]} onTagClick={mockOnTagClick} />)

  // Act: Perform the action being tested
  const firstTag = screen.getByTestId('tag-list-item')
  await userEvent.click(firstTag)

  // Assert: Verify expected outcomes
  expect(firstTag).toHaveAttribute('aria-pressed', 'true')
  expect(mockOnTagClick).toHaveBeenCalledWith('authentication')
})
```

### Using Test Fixtures

```typescript
import { mockEndpoints, mockTags, validEndpointFormData } from '../fixtures/endpoints'

it('should render endpoint card with data', () => {
  render(<EndpointCard endpoint={mockEndpoints[0]} />)
  expect(screen.getByText('Auth0')).toBeInTheDocument()
})
```

### Using Test Utilities

```typescript
import { renderWithProviders, createMockAuthContext } from '../utils/test-utils'

it('should show admin options for admin users', () => {
  const authContext = createMockAuthContext({
    isAuthenticated: true,
    isAdmin: true,
  })

  renderWithProviders(<UserMenu />, { authContext })
  expect(screen.getByText('Admin Panel')).toBeInTheDocument()
})
```

---

## Test Data Management

### Mock Data

All mock data is centralized in `__tests__/fixtures/endpoints.ts`:
- `mockTags` - Tag fixtures
- `mockEndpoints` - Endpoint fixtures
- `mockEndpointRequests` - Request fixtures
- `mockUserRoles` - User role fixtures
- `validEndpointFormData` - Valid form data
- `invalidEndpointFormData` - Invalid form data variations

### Mock Supabase Client

Comprehensive Supabase client mock in `__tests__/mocks/supabase.ts`:
- Mock query builder
- Mock auth methods
- Mock storage methods
- Mock RPC calls

---

## Continuous Integration

### GitHub Actions Example

```yaml
name: Test Suite

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:unit

  integration-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:integration

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

---

## Coverage Goals

| Test Type | Goal | Current |
|-----------|------|---------|
| Unit Tests | 90%+ | TBD (tests written, awaiting implementation) |
| Integration Tests | 80%+ | TBD |
| E2E Tests | Critical Paths 100% | TBD |
| Database Tests | 100% | TBD |

---

## Test Maintenance

### When to Update Tests

1. **Requirement changes:** Update affected test cases
2. **New features:** Add new test cases
3. **Bug fixes:** Add regression tests
4. **Refactoring:** Update test implementations (not assertions)

### Test Review Checklist

- [ ] Test follows AAA pattern
- [ ] Test name describes expected behavior
- [ ] Test is independent (no reliance on other tests)
- [ ] Test uses appropriate mocks/fixtures
- [ ] Test has meaningful assertions
- [ ] Test covers happy path and error cases
- [ ] Test includes edge cases
- [ ] Test follows project conventions

---

## Debugging Tests

### Debug Unit Tests

```bash
# Run single test file
npm test -- endpoint-card.test.tsx

# Run tests matching pattern
npm test -- --grep "should filter"

# Run in debug mode
node --inspect-brk ./node_modules/vitest/vitest.mjs run
```

### Debug E2E Tests

```bash
# Run in headed mode (see browser)
npx playwright test --headed

# Run in debug mode
npx playwright test --debug

# Run specific test
npx playwright test admin-workflow.spec.ts -g "should approve"
```

---

## Known Limitations

1. **Database tests** require Supabase local instance or test database
2. **E2E tests** require application running on `localhost:3000`
3. **Some E2E tests** may be flaky due to timing - retries configured
4. **File upload tests** use mock files, not actual image validation

---

## Contributing

When adding new tests:

1. Place tests in appropriate directory
2. Follow naming conventions
3. Use existing fixtures/mocks
4. Update TEST-COVERAGE-MATRIX.md
5. Ensure tests are deterministic
6. Add comments for complex test logic

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## Support

For questions or issues with the test suite:
1. Check TEST-COVERAGE-MATRIX.md for test locations
2. Review test patterns in existing tests
3. Consult LLD for expected behavior
4. Review user stories for acceptance criteria

---

**Test Suite Version:** 1.0
**Last Updated:** 2026-02-04
**Status:** Complete - Ready for implementation phase

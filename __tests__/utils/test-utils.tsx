/**
 * Test utilities for React Testing Library
 * Provides custom render functions with providers
 */

import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { vi } from 'vitest'

/**
 * Mock auth context value
 */
export interface MockAuthContextValue {
  user: any | null
  session: any | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

/**
 * Creates a mock auth context provider for testing
 */
export function createMockAuthContext(overrides?: Partial<MockAuthContextValue>): MockAuthContextValue {
  return {
    user: null,
    session: null,
    isLoading: false,
    isAuthenticated: false,
    isAdmin: false,
    login: vi.fn().mockResolvedValue(undefined),
    register: vi.fn().mockResolvedValue(undefined),
    logout: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  }
}

/**
 * Mock router object for Next.js navigation
 */
export function createMockRouter(overrides?: any) {
  return {
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
    route: '/',
    ...overrides,
  }
}

/**
 * Custom render function that includes all providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: {
    authContext?: Partial<MockAuthContextValue>
    router?: any
    renderOptions?: Omit<RenderOptions, 'wrapper'>
  }
) {
  const authContext = createMockAuthContext(options?.authContext)

  // Create wrapper component with providers
  function Wrapper({ children }: { children: React.ReactNode }) {
    // In actual implementation, this would include AuthProvider, etc.
    // For now, just return children as providers will be mocked
    return <>{children}</>
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...options?.renderOptions }),
    authContext,
  }
}

/**
 * Waits for a condition to be true with timeout
 */
export async function waitForCondition(
  condition: () => boolean | Promise<boolean>,
  timeout = 3000,
  interval = 50
): Promise<void> {
  const startTime = Date.now()

  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return
    }
    await new Promise(resolve => setTimeout(resolve, interval))
  }

  throw new Error(`Condition not met within ${timeout}ms`)
}

/**
 * Creates a mock file for testing file uploads
 */
export function createMockFile(
  name: string,
  size: number,
  type: string
): File {
  const file = new File(['x'.repeat(size)], name, { type })
  return file
}

/**
 * Simulates form submission
 */
export function submitForm(form: HTMLFormElement, data: Record<string, string>) {
  Object.entries(data).forEach(([name, value]) => {
    const input = form.elements.namedItem(name) as HTMLInputElement
    if (input) {
      input.value = value
    }
  })

  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
}

/**
 * Mock fetch response helper
 */
export function mockFetchResponse(data: any, ok = true, status = 200) {
  return vi.fn().mockResolvedValue({
    ok,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data),
  })
}

/**
 * Creates a mock IntersectionObserver for testing
 */
export function mockIntersectionObserver() {
  const mockIntersectionObserver = vi.fn()
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  })
  window.IntersectionObserver = mockIntersectionObserver as any
}

/**
 * Creates a mock ResizeObserver for testing
 */
export function mockResizeObserver() {
  const mockResizeObserver = vi.fn()
  mockResizeObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  })
  window.ResizeObserver = mockResizeObserver as any
}

/**
 * Mocks window.matchMedia for responsive testing
 */
export function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

/**
 * Mocks clipboard API for copy functionality tests
 */
export function mockClipboard() {
  Object.assign(navigator, {
    clipboard: {
      writeText: vi.fn().mockResolvedValue(undefined),
      readText: vi.fn().mockResolvedValue(''),
    },
  })
}

/**
 * Test data builders
 */
export const builders = {
  endpoint: (overrides = {}) => ({
    id: 'test-endpoint-id',
    company: 'Test Company',
    title: 'Test API',
    description: 'Test description',
    status: 'active',
    protocol: 'HTTPS',
    address: 'https://api.test.com',
    ports: ['443'],
    icon_url: null,
    created_by: 'test-user-id',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    endpoint_tags: [],
    ...overrides,
  }),

  tag: (overrides = {}) => ({
    id: 'test-tag-id',
    name: 'Test Tag',
    slug: 'test-tag',
    color: '#6366f1',
    created_at: new Date().toISOString(),
    ...overrides,
  }),

  request: (overrides = {}) => ({
    id: 'test-request-id',
    company: 'Test Company',
    title: 'Test API Request',
    description: 'Test request description',
    protocol: 'HTTPS',
    address: 'https://api.test.com',
    ports: ['443'],
    icon_url: null,
    request_status: 'pending',
    submitted_by: 'test-user-id',
    reviewed_by: null,
    reviewed_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    endpoint_request_tags: [],
    ...overrides,
  }),
}

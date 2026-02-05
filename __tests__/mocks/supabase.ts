/**
 * Mock Supabase Client for Testing
 * Provides mock implementations of Supabase methods
 */

import { vi } from 'vitest'

export interface MockSupabaseClient {
  from: (table: string) => MockQueryBuilder
  auth: MockAuth
  storage: MockStorage
  rpc: (fn: string, params?: any) => Promise<{ data: any; error: any }>
}

export interface MockQueryBuilder {
  select: (columns?: string) => MockQueryBuilder
  insert: (data: any) => MockQueryBuilder
  update: (data: any) => MockQueryBuilder
  delete: () => MockQueryBuilder
  eq: (column: string, value: any) => MockQueryBuilder
  neq: (column: string, value: any) => MockQueryBuilder
  in: (column: string, values: any[]) => MockQueryBuilder
  or: (query: string) => MockQueryBuilder
  ilike: (column: string, pattern: string) => MockQueryBuilder
  order: (column: string, options?: any) => MockQueryBuilder
  limit: (count: number) => MockQueryBuilder
  single: () => Promise<{ data: any; error: any }>
  maybeSingle: () => Promise<{ data: any; error: any }>
  then: (resolve: any, reject?: any) => Promise<{ data: any; error: any }>
}

export interface MockAuth {
  getSession: () => Promise<{ data: { session: any }; error: any }>
  getUser: () => Promise<{ data: { user: any }; error: any }>
  signInWithPassword: (credentials: { email: string; password: string }) => Promise<{ data: any; error: any }>
  signUp: (credentials: { email: string; password: string }) => Promise<{ data: any; error: any }>
  signOut: () => Promise<{ error: any }>
  onAuthStateChange: (callback: (event: string, session: any) => void) => { data: { subscription: { unsubscribe: () => void } } }
}

export interface MockStorage {
  from: (bucket: string) => MockStorageBucket
}

export interface MockStorageBucket {
  upload: (path: string, file: any, options?: any) => Promise<{ data: any; error: any }>
  getPublicUrl: (path: string) => { data: { publicUrl: string } }
  remove: (paths: string[]) => Promise<{ data: any; error: any }>
  list: (path?: string, options?: any) => Promise<{ data: any; error: any }>
}

/**
 * Creates a mock Supabase client with default implementations
 */
export function createMockSupabaseClient(): MockSupabaseClient {
  const mockQueryBuilder: MockQueryBuilder = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    then: vi.fn().mockResolvedValue({ data: [], error: null }),
  }

  const mockAuth: MockAuth = {
    getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
    getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    signInWithPassword: vi.fn().mockResolvedValue({ data: null, error: null }),
    signUp: vi.fn().mockResolvedValue({ data: null, error: null }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    onAuthStateChange: vi.fn().mockReturnValue({
      data: {
        subscription: {
          unsubscribe: vi.fn(),
        },
      },
    }),
  }

  const mockStorageBucket: MockStorageBucket = {
    upload: vi.fn().mockResolvedValue({ data: { path: 'mock-path' }, error: null }),
    getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/mock-url' } }),
    remove: vi.fn().mockResolvedValue({ data: null, error: null }),
    list: vi.fn().mockResolvedValue({ data: [], error: null }),
  }

  const mockStorage: MockStorage = {
    from: vi.fn().mockReturnValue(mockStorageBucket),
  }

  return {
    from: vi.fn().mockReturnValue(mockQueryBuilder),
    auth: mockAuth,
    storage: mockStorage,
    rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
  }
}

/**
 * Mock user for testing
 */
export const mockUser = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  email: 'test@example.com',
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
  aud: 'authenticated',
  role: 'authenticated',
}

/**
 * Mock admin user for testing
 */
export const mockAdminUser = {
  ...mockUser,
  id: '123e4567-e89b-12d3-a456-426614174001',
  email: 'admin@example.com',
}

/**
 * Mock session for testing
 */
export const mockSession = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  expires_at: Date.now() + 3600000,
  token_type: 'bearer',
  user: mockUser,
}

/**
 * Mock admin session for testing
 */
export const mockAdminSession = {
  ...mockSession,
  user: mockAdminUser,
}

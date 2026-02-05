/**
 * Test fixtures for endpoints, endpoint requests, and related data
 */

export const mockTags = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Authentication',
    slug: 'authentication',
    color: '#ef4444',
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Payments',
    slug: 'payments',
    color: '#22c55e',
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Analytics',
    slug: 'analytics',
    color: '#3b82f6',
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: 'Storage',
    slug: 'storage',
    color: '#f59e0b',
    created_at: '2026-01-01T00:00:00.000Z',
  },
]

export const mockEndpoints = [
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    icon_url: 'https://example.com/auth-icon.png',
    company: 'Auth0',
    title: 'Authentication API',
    description: 'Enterprise authentication and authorization service',
    status: 'active' as const,
    protocol: 'HTTPS',
    address: 'https://api.auth0.com',
    ports: ['443'],
    created_by: '123e4567-e89b-12d3-a456-426614174000',
    created_at: '2026-01-15T10:00:00.000Z',
    updated_at: '2026-01-15T10:00:00.000Z',
    endpoint_tags: [
      {
        tag: mockTags[0],
      },
    ],
  },
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    icon_url: 'https://example.com/stripe-icon.png',
    company: 'Stripe',
    title: 'Payment Processing API',
    description: 'Complete payment processing solution with global coverage',
    status: 'active' as const,
    protocol: 'HTTPS',
    address: 'https://api.stripe.com',
    ports: ['443'],
    created_by: '123e4567-e89b-12d3-a456-426614174000',
    created_at: '2026-01-16T14:30:00.000Z',
    updated_at: '2026-01-16T14:30:00.000Z',
    endpoint_tags: [
      {
        tag: mockTags[1],
      },
    ],
  },
  {
    id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    icon_url: null,
    company: 'Analytics Corp',
    title: 'Event Tracking API',
    description: 'Real-time event tracking and analytics platform',
    status: 'active' as const,
    protocol: 'HTTPS',
    address: 'https://events.analytics.example',
    ports: ['443', '8443'],
    created_by: '123e4567-e89b-12d3-a456-426614174001',
    created_at: '2026-01-17T09:15:00.000Z',
    updated_at: '2026-01-17T09:15:00.000Z',
    endpoint_tags: [
      {
        tag: mockTags[2],
      },
    ],
  },
  {
    id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
    icon_url: 'https://example.com/s3-icon.png',
    company: 'AWS',
    title: 'S3 Storage API',
    description: 'Scalable object storage service',
    status: 'inactive' as const,
    protocol: 'HTTPS',
    address: 'https://s3.amazonaws.com',
    ports: ['443'],
    created_by: '123e4567-e89b-12d3-a456-426614174001',
    created_at: '2026-01-10T08:00:00.000Z',
    updated_at: '2026-01-20T16:00:00.000Z',
    endpoint_tags: [
      {
        tag: mockTags[3],
      },
    ],
  },
]

export const mockEndpointRequests = [
  {
    id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    icon_url: 'https://example.com/new-auth-icon.png',
    company: 'Okta',
    title: 'Identity Management API',
    description: 'Enterprise identity and access management',
    protocol: 'HTTPS',
    address: 'https://api.okta.com',
    ports: ['443'],
    request_status: 'pending' as const,
    submitted_by: '123e4567-e89b-12d3-a456-426614174000',
    reviewed_by: null,
    reviewed_at: null,
    created_at: '2026-02-01T10:00:00.000Z',
    updated_at: '2026-02-01T10:00:00.000Z',
    endpoint_request_tags: [
      {
        tag: mockTags[0],
      },
    ],
  },
  {
    id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
    icon_url: null,
    company: 'PayPal',
    title: 'Payment Gateway API',
    description: 'Online payment processing and gateway service',
    protocol: 'HTTPS',
    address: 'https://api.paypal.com',
    ports: ['443'],
    request_status: 'approved' as const,
    submitted_by: '123e4567-e89b-12d3-a456-426614174000',
    reviewed_by: '123e4567-e89b-12d3-a456-426614174001',
    reviewed_at: '2026-01-30T15:00:00.000Z',
    created_at: '2026-01-25T11:00:00.000Z',
    updated_at: '2026-01-30T15:00:00.000Z',
    endpoint_request_tags: [
      {
        tag: mockTags[1],
      },
    ],
  },
  {
    id: '00000000-0000-0000-0000-000000000000',
    icon_url: 'https://example.com/analytics-icon.png',
    company: 'Google',
    title: 'Analytics Reporting API',
    description: 'Web analytics and reporting service',
    protocol: 'HTTPS',
    address: 'https://analyticsreporting.googleapis.com',
    ports: ['443'],
    request_status: 'rejected' as const,
    submitted_by: '999e9999-e99b-99d9-a999-999999999999',
    reviewed_by: '123e4567-e89b-12d3-a456-426614174001',
    reviewed_at: '2026-01-28T09:00:00.000Z',
    created_at: '2026-01-20T14:00:00.000Z',
    updated_at: '2026-01-28T09:00:00.000Z',
    endpoint_request_tags: [
      {
        tag: mockTags[2],
      },
    ],
  },
]

export const mockUserRoles = [
  {
    id: 'role-111-111-111',
    user_id: '123e4567-e89b-12d3-a456-426614174000',
    role: 'user' as const,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'role-222-222-222',
    user_id: '123e4567-e89b-12d3-a456-426614174001',
    role: 'admin' as const,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
]

/**
 * Valid endpoint form data for testing
 */
export const validEndpointFormData = {
  company: 'Test Company',
  title: 'Test API Endpoint',
  description: 'A test API endpoint for unit testing',
  protocol: 'HTTPS',
  address: 'https://api.test.com',
  ports: '443, 8443',
  tagIds: ['11111111-1111-1111-1111-111111111111'],
  iconUrl: 'https://example.com/icon.png',
}

/**
 * Invalid endpoint form data variations for testing validation
 */
export const invalidEndpointFormData = {
  emptyCompany: {
    ...validEndpointFormData,
    company: '',
  },
  emptyTitle: {
    ...validEndpointFormData,
    title: '',
  },
  emptyAddress: {
    ...validEndpointFormData,
    address: '',
  },
  noTags: {
    ...validEndpointFormData,
    tagIds: [],
  },
  invalidProtocol: {
    ...validEndpointFormData,
    protocol: 'FTP',
  },
  tooLongCompany: {
    ...validEndpointFormData,
    company: 'a'.repeat(101),
  },
  tooLongTitle: {
    ...validEndpointFormData,
    title: 'a'.repeat(201),
  },
  tooLongDescription: {
    ...validEndpointFormData,
    description: 'a'.repeat(1001),
  },
  invalidIconUrl: {
    ...validEndpointFormData,
    iconUrl: 'not-a-url',
  },
}

/**
 * Valid registration form data
 */
export const validRegistrationData = {
  email: 'newuser@example.com',
  password: 'Password123',
  confirmPassword: 'Password123',
}

/**
 * Invalid registration data variations
 */
export const invalidRegistrationData = {
  invalidEmail: {
    ...validRegistrationData,
    email: 'not-an-email',
  },
  shortPassword: {
    ...validRegistrationData,
    password: 'Pass1',
    confirmPassword: 'Pass1',
  },
  noLowercase: {
    ...validRegistrationData,
    password: 'PASSWORD123',
    confirmPassword: 'PASSWORD123',
  },
  noUppercase: {
    ...validRegistrationData,
    password: 'password123',
    confirmPassword: 'password123',
  },
  noNumber: {
    ...validRegistrationData,
    password: 'Password',
    confirmPassword: 'Password',
  },
  passwordMismatch: {
    ...validRegistrationData,
    confirmPassword: 'DifferentPassword123',
  },
}

/**
 * Valid login form data
 */
export const validLoginData = {
  email: 'test@example.com',
  password: 'Password123',
}

/**
 * Chat message fixtures
 */
export const mockChatMessages = [
  {
    id: 'msg-1',
    role: 'assistant' as const,
    content: 'Hello! I can help you find API endpoints in the Switchboard registry. What are you looking for?',
    timestamp: '2026-02-04T10:00:00.000Z',
  },
  {
    id: 'msg-2',
    role: 'user' as const,
    content: 'I need authentication endpoints',
    timestamp: '2026-02-04T10:01:00.000Z',
  },
  {
    id: 'msg-3',
    role: 'assistant' as const,
    content: 'I found authentication endpoints in the registry. Check the filtered results!',
    timestamp: '2026-02-04T10:01:30.000Z',
  },
]

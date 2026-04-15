export const PROTOCOL_OPTIONS = [
  'HTTP',
  'HTTPS',
  'gRPC',
  'WebSocket',
  'TCP',
  'UDP',
] as const

export const ENDPOINT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DEPRECATED: 'deprecated',
} as const

export const REQUEST_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const

export const USER_ROLE = {
  USER: 'user',
  ADMIN: 'admin',
} as const

export const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
export const ALLOWED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/svg+xml',
  'image/webp',
]

export const STORAGE_BUCKET = 'endpoint-icons'

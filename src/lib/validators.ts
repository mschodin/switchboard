import { z } from 'zod'

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[a-z]/, 'Password must contain a lowercase letter')
      .regex(/[A-Z]/, 'Password must contain an uppercase letter')
      .regex(/[0-9]/, 'Password must contain a number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

// Endpoint validation schema
export const endpointSchema = z.object({
  company: z.string().min(1, 'Company name is required').max(100),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional(),
  protocol: z.enum(['HTTP', 'HTTPS', 'gRPC', 'WebSocket', 'TCP', 'UDP']),
  address: z.string().min(1, 'Address is required').max(500),
  ports: z
    .string()
    .optional()
    .transform((val) =>
      val ? val.split(',').map((p) => p.trim()).filter(Boolean) : null
    ),
  tagIds: z.array(z.string().uuid()).min(1, 'Select at least one tag'),
  iconUrl: z.string().url().optional().nullable(),
})

export type EndpointFormData = z.infer<typeof endpointSchema>

// Tag validation schema
export const tagSchema = z.object({
  name: z.string().min(1, 'Tag name is required').max(50),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  color: z.string().regex(/^#[0-9a-f]{6}$/i, 'Must be a valid hex color'),
})

export type TagFormData = z.infer<typeof tagSchema>

# Fullstack Engineer Memory - Switchboard Project

## Project Overview
Switchboard is an API Endpoint Registry built with Next.js 14 App Router, TypeScript, Supabase, and shadcn/ui.

## Key Architecture Decisions

### Authentication & Authorization
- Used Supabase Auth with email/password authentication
- Implemented role-based access control (user/admin) via `user_roles` table
- Created reusable AuthProvider context with useAuth hook
- Built AuthGuard and AdminGuard wrapper components for protected routes
- Auth state persists through Supabase session management

### Database Patterns
- Full RLS (Row Level Security) policies on all tables
- Database functions for complex operations (approve/reject requests)
- Generated columns for full-text search (`search_vector` on endpoints)
- Junction tables for many-to-many relationships (endpoints-tags, requests-tags)
- Triggers for auto-updating `updated_at` timestamps
- SECURITY DEFINER functions for admin operations

### State Management Strategy
- **Global State**: React Context for auth state only
- **URL State**: Search params for filters/search (shareable URLs)
- **Server State**: Server Components + Server Actions (no React Query needed)
- **Form State**: React Hook Form + Zod validation
- **UI State**: Local useState for modals, hover states, etc.

### Component Patterns
- Server Components by default, 'use client' only when needed
- Composition over prop drilling
- Shared EndpointForm component for both submit and create modes
- Consistent loading skeletons matching card dimensions
- Empty states with clear CTAs

### File Upload Strategy
- Client-side validation before upload (2MB, image types only)
- Separate upload action that returns public URL
- Store URLs in database, not files themselves
- User-specific folders in storage bucket (/${userId}/${timestamp}.ext)

## Common Gotchas & Solutions

### 1. Supabase Server Client in Server Actions
Always use `createServerClient()` from `@/lib/supabase/server` in Server Actions, not the browser client.

### 2. RLS Policy Testing
When testing admin functions, ensure the `is_admin()` function is called correctly. The policies depend on `auth.uid()` which only works in the context of an authenticated request.

### 3. Form Data in Server Actions
Remember to use `formData.getAll('tagIds')` for multi-select inputs, not `formData.get()`.

### 4. Next.js Redirects in Server Actions
Redirects using `redirect()` must happen AFTER all async operations. If called too early, they'll interrupt the action.

### 5. Image Component Requirements
Always provide `fill` prop with relative parent container when using responsive images without explicit width/height.

## Reusable Patterns

### Server Action Error Handling
```typescript
try {
  // Validate with Zod
  const validated = schema.safeParse(data)
  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors }
  }

  // Business logic
  const result = await someOperation()

  if (error) {
    return { error: { root: [error.message] } }
  }

  revalidatePath('/path')
  return { success: true, data: result }
} catch (err) {
  return { error: { root: [err.message] } }
}
```

### Protected Page Pattern
```typescript
'use client'

import { AuthGuard } from '@/components/auth/auth-guard'

export default function ProtectedPage() {
  return (
    <AuthGuard>
      {/* Page content */}
    </AuthGuard>
  )
}
```

### Filter Hook with URL Sync
```typescript
const { tags, search, setTags, setSearch, toggleTag, clearFilters } = useFilters()
```

## shadcn/ui Components Used
- button, card, input, badge, dropdown-menu
- dialog, skeleton, toast, form, select
- textarea, avatar, scroll-area, label, alert

## Important File Locations
- Database migration: `supabase/migrations/001_initial_schema.sql`
- Supabase clients: `src/lib/supabase/client.ts` and `server.ts`
- Auth actions: `src/actions/auth.ts`
- Endpoint actions: `src/actions/endpoints.ts`
- Request actions: `src/actions/requests.ts`
- Type definitions: `src/types/database.ts`

## Design System Implementation

### NICE.com Restyle (SWB-100 to SWB-111)
Successfully implemented complete visual restyle to match NICE.com design system:

**Color Palette:**
- Primary dark: `#22212B` (HSL: `252 14% 15%`) - near-black primary
- Cyan accent: `#23C9FF` (HSL: `195 100% 57%`) - focus rings, links only
- Blue gradient: `#2F33F5` → `#5192F4` → `#93C3FA` - NICE brand gradient
- Purple accent: `#872BFF` - admin dashboard icons
- Muted background: `#F5F5F7`, Muted text: `#6B6B76`

**Shadows:**
- subtle: `0 1px 3px rgba(0, 0, 0, 0.06)`
- card: `0 2px 8px rgba(0, 0, 0, 0.08)`
- elevated: `0 8px 24px rgba(0, 0, 0, 0.12)`

**Border Radius:**
- Global: `0.75rem` (12px), Cards: `rounded-xl`, Inputs: `rounded-md`, Badges: `rounded-md`

**Transitions:**
- Standard: `transition-all duration-200 ease-in-out`, Input focus: `transition-colors duration-150`
- Utility: `.transition-nice` in globals.css, Reduced motion respected via media query

**Key Styling Changes:**
- Buttons: Dark primary, outline with visible borders, cyan links
- Cards: 12px radius, subtle shadow, `border-black/[0.06]`
- Badges: `rounded-md`, `font-medium` (not pills/semibold)
- Status badges: Muted backgrounds (50 shades) with darker text
- Form inputs: `px-4` padding, cyan focus ring
- Header/Sidebars: Solid white, subtle borders `border-black/[0.08]`

**Critical HSL Alpha Syntax:**
- Borders: `0 0% 0% / 0.1` for `rgba(0,0,0,0.1)` equivalent
- Modern CSS syntax, fallback: `0 0% 90%` if needed

## Testing Notes
- Need to test admin approval/rejection flow
- Need to verify RLS policies work correctly
- Need to test file upload size limits
- Need to test form validations
- Need to test responsive layouts on all breakpoints
- Visual regression testing after CSS variable changes

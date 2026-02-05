# Enterprise Software Architect Memory - Switchboard Project

## Project Overview
- **Application**: Switchboard - API Endpoint Registry
- **Stack**: Next.js 14+ (App Router), Supabase (Auth, DB, Storage), shadcn/ui, Tailwind CSS

## Key Architectural Decisions

### Database Design
- RLS policies MUST be defined for every table - security by default
- Use database functions for atomic operations (approve_endpoint_request, reject_endpoint_request)
- Full-text search via `tsvector` GENERATED column with weighted ranking (title/company = A, description = B)
- Junction tables for many-to-many: `endpoint_tags`, `endpoint_request_tags`
- Trigger-based user role assignment on auth.users insert

### Authentication Pattern
- Server Actions authenticate internally - treat as public endpoints
- Auth context via React Context for client-side state
- AuthGuard/AdminGuard components for protected routes
- Role stored in separate `user_roles` table, not in auth metadata

### State Management
- Auth: React Context (global)
- Filters/Search: URL params (shareable, persists refresh)
- Server data: Server Components + Suspense
- UI ephemeral state: local useState
- Form state: react-hook-form + Zod

### Component Organization
- `/components/ui/` - shadcn/ui primitives
- `/components/layout/` - structural layout components
- `/components/{feature}/` - feature-specific components
- Server Actions in `/actions/` directory
- Hooks in `/hooks/` directory

## React Best Practices Applied
- Strategic Suspense boundaries for faster initial paint
- Server Components by default, Client Components when interactive
- Authenticate inside Server Actions, not just middleware
- Parallel data fetching with Promise.all where possible

## Supabase Patterns
- Browser client: `createBrowserClient()` from `@supabase/ssr`
- Server client: `createServerClient()` with cookie handling
- Storage bucket: public with auth-required uploads
- RLS functions: `is_admin()`, `get_user_role()` as SECURITY DEFINER

## Design Tokens
- Sidebar widths: left=280px, right=360px
- Breakpoints: mobile<768px, tablet<1024px, desktop>=1024px
- Status colors: active=#22c55e, inactive=#eab308, deprecated=#ef4444

## Files Created
- `/docs/design/SWITCHBOARD-LLD.md` - Complete Low-Level Design document

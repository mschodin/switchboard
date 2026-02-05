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

## NICE.com Restyling (SWB-100 to SWB-111)
- **Primary color**: `#22212B` (HSL: 252 14% 15%) - dark near-black
- **Accent/Ring**: `#23C9FF` (HSL: 195 100% 57%) - cyan, DO NOT use as body text (fails 4.5:1 contrast on white)
- **Brand gradient**: `#2F33F5` -> `#5192F4` -> `#93C3FA`
- **Muted text**: `#6B6B76` (HSL: 240 3% 44%)
- **Border approach**: `rgba(0,0,0,0.1)` via HSL alpha syntax `0 0% 0% / 0.1`
- **Shadows**: subtle=`0 1px 3px rgba(0,0,0,0.06)`, card=`0 2px 8px rgba(0,0,0,0.08)`, elevated=`0 8px 24px rgba(0,0,0,0.12)`
- **Radius**: `--radius: 0.75rem` (12px). Cards use `rounded-xl`, inputs/buttons use `rounded-md`
- **Font**: Be Vietnam Pro (weights: 200, 300, 400, 500, 600, 900) loaded via `next/font/google`
- **Transitions**: 200ms ease-in-out standard, 150ms for input focus
- All `text-brand-500` references must change to `text-primary` or `text-[#23C9FF]` depending on context
- CSS variable system uses HSL without `hsl()` wrapper, alpha format: `H S% L% / A`

## Key Learnings
- When using `next/font/google` with `variable` prop, apply BOTH the variable class AND `font-sans` to body for Tailwind integration
- shadcn/ui Badge default uses `rounded-full` -- NICE design uses `rounded-md` (chip style)
- `border-input` and `border-black/[0.06]` are different: former uses CSS var, latter is fixed
- Tailwind `rounded-xl` is fixed 12px; `rounded-lg` tracks `var(--radius)` -- they coincide when `--radius: 0.75rem`
- For pure styling LLDs, specify every class string change explicitly -- fullstack engineers should not guess

## Files Created
- `/docs/design/SWITCHBOARD-LLD.md` - Complete Low-Level Design document
- `/docs/design/SWB-RESTYLE-NICE-LLD.md` - NICE.com restyling LLD (SWB-100 to SWB-111)

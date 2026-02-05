# Technical PM Agent Memory - Switchboard Project

## Project Context
- **Switchboard**: API endpoint registry web application
- **Tech Stack**: Supabase (auth + database), React (likely Next.js based on skills)
- **Key Personas**: Visitor (public), User (authenticated), Admin

## Story Writing Patterns

### Supabase Projects - Common Story Groupings
1. Database schema + RLS policies (foundational, block everything)
2. Auth integration (depends on schema, blocks most features)
3. UI layout/shell (can parallel with auth)
4. Core data components (cards, lists)
5. Filtering/search (depends on data components)
6. User flows (submission forms)
7. Admin workflows (approval queues)

### Story Point Calibration for This Project
- Schema setup with RLS: 3 points
- Auth integration with roles: 3 points
- Page layout with responsive design: 3 points
- Reusable card components: 2 points
- Form with file upload: 3 points
- Admin approval workflow: 5 points (touches multiple tables, has business logic)

## Risk Patterns Identified
- RLS policies are complexity multipliers - allocate extra testing time
- Chat features tend to scope creep - keep UI-only stories separate from AI integration
- Icon/file uploads need both client and server validation

## Dependencies to Watch
- Any feature requiring user identity blocks on auth story
- Any feature displaying data blocks on schema + component stories
- Admin features should come after user-facing equivalents (reuse forms)

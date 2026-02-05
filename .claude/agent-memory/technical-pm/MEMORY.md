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

## Restyling Story Patterns
- For UI restyling projects, always start with a "design tokens" story (CSS variables, Tailwind config) that blocks all other stories
- Typography (font family) changes are a separate story from color/spacing -- font loading has performance implications (next/font)
- shadcn/ui components inherit from CSS variables, so changing root variables cascades globally -- call out regression testing risk
- Component-level stories (buttons, cards, inputs) should come before page-level stories (auth pages, admin dashboard)
- Always include a "hover/transitions sweep" story at the end to catch consistency gaps
- WCAG contrast ratios: always verify when changing color palettes -- accent colors (cyan #23C9FF) can fail AA on white (3.2:1)

## Story ID Conventions
- Feature stories: SWB-001 through SWB-015 (original feature set)
- Restyle stories: SWB-100 through SWB-111 (NICE.com alignment)
- Use 100+ numbering blocks for thematic story groups to avoid ID conflicts

## NICE.com Design Reference
- See `/docs/user-stories/SWB-RESTYLE-NICE-STORIES.md` for full design token reference
- Key colors: primary dark #22212B, accent cyan #23C9FF, blue gradient #2F33F5 to #93C3FA
- Font: Be Vietnam Pro (weights 200-900)
- Shadows: subtle/card/elevated three-tier system
- Border radius: 12px (0.75rem) for cards, 8px for buttons/inputs

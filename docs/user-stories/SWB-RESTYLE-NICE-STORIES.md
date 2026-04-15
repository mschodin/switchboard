# Switchboard Restyle - NICE.com Design System Alignment

## Executive Summary

| Story ID | Title | Priority | Points | Dependencies |
|----------|-------|----------|--------|--------------|
| SWB-100 | Update Design Tokens and CSS Variables | Must Have | 3 | None |
| SWB-101 | Update Typography to Be Vietnam Pro | Must Have | 2 | SWB-100 |
| SWB-102 | Restyle Button Component Variants | Must Have | 3 | SWB-100 |
| SWB-103 | Restyle Card and Container Components | Must Have | 3 | SWB-100 |
| SWB-104 | Restyle Header and Navigation | Must Have | 3 | SWB-100, SWB-101 |
| SWB-105 | Restyle Form Inputs, Selects, and Textarea | Should Have | 3 | SWB-100 |
| SWB-106 | Restyle Badge, Tag, and Status Components | Should Have | 2 | SWB-100 |
| SWB-107 | Update Sidebar Styling | Should Have | 3 | SWB-100, SWB-101, SWB-102 |
| SWB-108 | Restyle Auth Pages (Login/Register) | Should Have | 2 | SWB-100, SWB-102, SWB-103, SWB-105 |
| SWB-109 | Restyle Admin Dashboard and Request Cards | Could Have | 3 | SWB-100, SWB-102, SWB-103, SWB-106 |
| SWB-110 | Restyle Chat Sidebar UI | Could Have | 2 | SWB-100, SWB-105 |
| SWB-111 | Add Hover Effects and Transitions | Should Have | 2 | SWB-102, SWB-103 |

**Total Story Points: 31**

---

## NICE.com Design System Reference

The following design tokens were extracted from nice.com and serve as the target for all stories below.

### Color Palette
- **Primary Dark**: `#22212B` (near-black, used for primary buttons, dark backgrounds)
- **Primary Blue Gradient Start**: `#2F33F5` (deep blue)
- **Primary Blue Gradient Mid**: `#5192F4` (medium blue)
- **Primary Blue Gradient End**: `#93C3FA` (light blue)
- **Accent Cyan**: `#23C9FF` (bright cyan accent)
- **Accent Purple**: `#872BFF` / `#AD7DFC` (purple highlights)
- **Hero Gradient**: `linear-gradient(-90deg, #FF3E39, #FC2566, #8531E4, #05FCFF)` (multi-color, used sparingly for hero/feature emphasis)
- **Background Light**: `#FFFFFF` (primary background)
- **Background Muted**: `#F5F5F7` (light gray sections, card backgrounds)
- **Text Primary**: `#22212B` (dark, near-black)
- **Text Secondary/Muted**: `#6B6B76` (medium gray)
- **Border**: `rgba(0, 0, 0, 0.1)` (subtle, low-opacity borders)

### Typography
- **Font Family**: `'Be Vietnam Pro', sans-serif`
- **Font Weights**: 200 (light), 300, 400 (regular), 500 (medium), 600 (semibold), 900 (black/bold headlines)
- **Heading Sizes**: H1: 40-54px, H2: 32-40px, H3: 24-28px, H4: 18px
- **Body**: 16px standard, 14px small
- **Line Height**: 1.5-1.6 for body, 1.1-1.2 for large headings

### Button Styles
- **Primary**: Dark background (`#22212B`), white text, rounded-md (~8px), font-weight 500-600
- **Secondary/Outline**: Transparent background, dark border, dark text
- **Hover**: Subtle opacity shift or slight background color change
- **Border Radius**: 8px (moderate rounding, not pill-shaped)
- **Padding**: ~12px 24px for standard, ~10px 16px for small

### Card Styles
- **Background**: White (`#FFFFFF`)
- **Border**: None or very subtle (`rgba(0, 0, 0, 0.06)`)
- **Shadow**: Subtle depth shadow (`0 2px 8px rgba(0, 0, 0, 0.08)`)
- **Border Radius**: 12px
- **Padding**: 24px

### Shadows
- **Subtle**: `0 1px 3px rgba(0, 0, 0, 0.06)`
- **Card**: `0 2px 8px rgba(0, 0, 0, 0.08)`
- **Elevated/Hover**: `0 8px 24px rgba(0, 0, 0, 0.12)`

### Transitions
- **Duration**: 200-300ms
- **Easing**: `ease-in-out`
- **Hover Effects**: Slight shadow elevation, subtle background shifts, opacity changes

---

## Dependency Map

```
SWB-100 (Design Tokens / CSS Variables)
    |
    +---> SWB-101 (Typography)
    |         |
    |         +---> SWB-104 (Header/Nav)
    |         |
    |         +---> SWB-107 (Sidebars)
    |
    +---> SWB-102 (Buttons)
    |         |
    |         +---> SWB-107 (Sidebars)
    |         |
    |         +---> SWB-108 (Auth Pages)
    |         |
    |         +---> SWB-109 (Admin Dashboard)
    |         |
    |         +---> SWB-111 (Hover/Transitions)
    |
    +---> SWB-103 (Cards/Containers)
    |         |
    |         +---> SWB-108 (Auth Pages)
    |         |
    |         +---> SWB-109 (Admin Dashboard)
    |         |
    |         +---> SWB-111 (Hover/Transitions)
    |
    +---> SWB-105 (Form Inputs)
    |         |
    |         +---> SWB-108 (Auth Pages)
    |         |
    |         +---> SWB-110 (Chat Sidebar)
    |
    +---> SWB-106 (Badges/Tags)
              |
              +---> SWB-109 (Admin Dashboard)
```

---

## Stories (Recommended Implementation Order)

---

## Story: [SWB-100] Update Design Tokens and CSS Variables

### User Story
As a developer, I want the application's CSS variables and Tailwind configuration to reflect NICE.com's color palette and design tokens, so that all components inherit the correct visual foundation.

### Description
Replace the current shadcn/ui default CSS variables in `globals.css` with values derived from NICE.com's design system. Update the Tailwind configuration to include NICE-aligned custom colors, shadows, and border-radius values. This foundational story ensures that all downstream component restyling stories inherit the correct design tokens without per-component color overrides.

The current Switchboard theme uses a standard shadcn slate-based palette (primary at `221.2 83.2% 53.3%`, a standard blue). NICE.com uses a dramatically different palette centered on a near-black primary (`#22212B`), bright cyan accent (`#23C9FF`), and blue-to-purple gradients. The `--radius` should increase from `0.5rem` to `0.75rem` to match NICE's more generous border radii. The `brand` color scale should be replaced to align with NICE's blue gradient palette. New shadow utilities should be added.

### Acceptance Criteria
- [ ] **AC1**: Given the `:root` CSS variables in `globals.css`, When I inspect the computed values, Then `--primary` maps to NICE's dark primary (`#22212B` in HSL: `252 14% 15%`), `--primary-foreground` is white, and `--radius` is `0.75rem`
- [ ] **AC2**: Given the `:root` CSS variables, When I inspect accent and ring colors, Then `--ring` and accent colors reference NICE's cyan (`#23C9FF`, HSL: `195 100% 57%`) and the `--accent` background is a light blue-tinted neutral
- [ ] **AC3**: Given the `.dark` theme variables, When dark mode is enabled, Then variables are updated to maintain NICE's palette contrast in dark contexts (dark background, light foreground, cyan accents preserved)
- [ ] **AC4**: Given `tailwind.config.ts`, When I review the `brand` color scale, Then it maps to NICE's blue gradient range: `50: '#eef2ff'`, `100: '#dbeafe'`, `500: '#5192F4'`, `600: '#2F33F5'`, `700: '#1e1fb3'`
- [ ] **AC5**: Given `tailwind.config.ts`, When I review the `extend` section, Then new `boxShadow` utilities are defined: `subtle` (`0 1px 3px rgba(0,0,0,0.06)`), `card` (`0 2px 8px rgba(0,0,0,0.08)`), `elevated` (`0 8px 24px rgba(0,0,0,0.12)`)
- [ ] **AC6**: Given `tailwind.config.ts`, When I review border colors, Then `--border` maps to `rgba(0,0,0,0.1)` equivalent in HSL and `--input` border is updated accordingly

### Technical Notes
- Files to modify: `/home/mschodin/projects/switchboard_v1/src/app/globals.css`, `/home/mschodin/projects/switchboard_v1/tailwind.config.ts`
- The shadcn CSS variable system uses HSL values without the `hsl()` wrapper (e.g., `252 14% 15%` not `hsl(252, 14%, 15%)`)
- Preserve the existing variable names (`--primary`, `--secondary`, `--accent`, etc.) so shadcn components continue to reference them correctly
- The `status` colors (active/inactive/deprecated) should remain unchanged as they serve a distinct semantic purpose
- Add a new `--nice-gradient` CSS custom property for the NICE gradient: `linear-gradient(135deg, #2F33F5, #5192F4, #93C3FA)`

### Dependencies
- Blocked by: None
- Blocks: SWB-101, SWB-102, SWB-103, SWB-104, SWB-105, SWB-106, SWB-107, SWB-108, SWB-109, SWB-110, SWB-111
- Related: None

### Non-Functional Requirements
- Performance: CSS variable changes should not introduce any additional render cost
- Security: No security impact
- Accessibility: WCAG 2.1 AA contrast ratios must be maintained; verify `#22212B` on white and white on `#22212B` both pass (both do at ~13:1 ratio)

### Out of Scope
- Changing component markup or layout
- Modifying dark mode toggle functionality
- Any JavaScript/TypeScript logic changes

### Priority: Must Have
### Story Points: 3

---

## Story: [SWB-101] Update Typography to Be Vietnam Pro

### User Story
As a visitor, I want the application to use NICE.com's "Be Vietnam Pro" font family, so that the text rendering matches NICE's visual identity.

### Description
Replace the current font loading mechanism. The app currently loads `Inter` from `next/font/google` in `layout.tsx` and references `var(--font-geist-sans)` in `tailwind.config.ts`. Both should be updated to load and reference `Be Vietnam Pro` instead. The font should be loaded via `next/font/google` for optimal performance (automatic subsetting, self-hosting, zero layout shift). Font weights 200, 300, 400, 500, 600, and 900 should be included to support the full range used by NICE.com.

### Acceptance Criteria
- [ ] **AC1**: Given the root layout (`layout.tsx`), When the page loads, Then `Be Vietnam Pro` is the active font applied to the `<body>` element
- [ ] **AC2**: Given the Tailwind config, When `font-sans` is used in any component, Then it resolves to `'Be Vietnam Pro', system-ui, sans-serif`
- [ ] **AC3**: Given the font loading configuration, When the page loads, Then font weights 200, 300, 400, 500, 600, and 900 are available for use
- [ ] **AC4**: Given any page in the application, When rendered, Then there is no visible Flash of Unstyled Text (FOUT) because `next/font` handles font-display swap automatically
- [ ] **AC5**: Given the font bundle, When I measure the total font file size loaded, Then it is no larger than 150KB total (subset to latin)

### Technical Notes
- Files to modify: `/home/mschodin/projects/switchboard_v1/src/app/layout.tsx`, `/home/mschodin/projects/switchboard_v1/tailwind.config.ts`
- Use `next/font/google` with `Be_Vietnam_Pro` import (note the underscore naming convention for next/font)
- Replace `Inter` import and usage in `layout.tsx`
- Update the `fontFamily.sans` array in `tailwind.config.ts` to reference the new CSS variable (e.g., `var(--font-beVietnam)`)
- Remove the `--font-geist-sans` reference from Tailwind config since Geist was never actually loaded (the app loads Inter)

### Dependencies
- Blocked by: SWB-100
- Blocks: SWB-104, SWB-107
- Related: None

### Non-Functional Requirements
- Performance: Font files must be self-hosted via next/font (no external CDN calls at runtime)
- Security: No security impact
- Accessibility: Font must remain legible at all sizes; Be Vietnam Pro has strong readability scores

### Out of Scope
- Changing font sizes or weights applied to specific components (those are handled in downstream stories)
- Adding variable font support (Be Vietnam Pro standard weights are sufficient)

### Priority: Must Have
### Story Points: 2

---

## Story: [SWB-102] Restyle Button Component Variants

### User Story
As a user, I want the application's buttons to match NICE.com's button style (dark backgrounds, moderate rounding, clean hover effects), so that interactive elements feel polished and consistent with the NICE brand.

### Description
Update the `button.tsx` component's variant definitions to align with NICE.com's button system. The current buttons use the shadcn default (blue primary, light secondary, outline with hover background). NICE.com uses a dark near-black primary button (`#22212B`), moderate border-radius (8px), and subtle hover effects (opacity shift rather than dramatic color change). The outline variant should have a visible dark border. The ghost variant should have a slightly more visible hover state.

### Acceptance Criteria
- [ ] **AC1**: Given a `default` variant button, When rendered, Then it has a dark background matching `--primary` (`#22212B`), white text, and `border-radius: 8px` (matching `--radius: 0.75rem` from SWB-100)
- [ ] **AC2**: Given a `default` variant button, When hovered, Then it transitions to a slightly lighter shade (`hover:bg-primary/85`) over 200ms with `ease-in-out` timing
- [ ] **AC3**: Given an `outline` variant button, When rendered, Then it has a transparent background, a visible dark border (`border-[#22212B]/20` or `border-foreground/20`), dark text, and the same border-radius
- [ ] **AC4**: Given an `outline` variant button, When hovered, Then the background transitions to a very subtle fill (`hover:bg-foreground/5`)
- [ ] **AC5**: Given a `secondary` variant button, When rendered, Then it uses a light gray background (`bg-secondary`) with dark text and on hover shifts to `bg-secondary/70`
- [ ] **AC6**: Given a `ghost` variant button, When hovered, Then it shows a subtle background fill (`hover:bg-accent/80`) with a 200ms transition
- [ ] **AC7**: Given any button variant, When rendered, Then the base font-weight is `500` (medium) and `text-sm` size is preserved
- [ ] **AC8**: Given the `lg` size variant, When rendered, Then padding is `px-6 py-3` (slightly more generous than current `px-8`) and height is `h-11`

### Technical Notes
- File to modify: `/home/mschodin/projects/switchboard_v1/src/components/ui/button.tsx`
- The base CVA string should add `transition-all duration-200 ease-in-out` instead of the current `transition-colors`
- Update `font-medium` to `font-medium` (it is already correct, just verify)
- Ensure the `rounded-md` in base matches the global `--radius` (it will if SWB-100 is complete)
- The `destructive` variant should remain red-based but adopt the same border-radius and transition timing
- The `link` variant should change underline color to match the cyan accent: `text-[#23C9FF]` or `text-accent`

### Dependencies
- Blocked by: SWB-100
- Blocks: SWB-107, SWB-108, SWB-109, SWB-111
- Related: SWB-103

### Non-Functional Requirements
- Performance: No additional DOM elements; CSS-only changes
- Security: No security impact
- Accessibility: All buttons must maintain minimum 4.5:1 contrast ratio; focus-visible ring must remain visible and be updated to use cyan accent ring color

### Out of Scope
- Adding new button variants not present in the current component
- Changing button sizes or adding new size variants
- Modifying button behavior or event handling

### Priority: Must Have
### Story Points: 3

---

## Story: [SWB-103] Restyle Card and Container Components

### User Story
As a visitor, I want endpoint cards and container elements to have NICE.com's clean, modern card style (subtle shadows, generous radius, minimal borders), so that content areas look polished and visually distinct.

### Description
Update the `card.tsx` component and the `endpoint-card.tsx` component to use NICE.com's card styling. NICE uses borderless or very subtle-bordered cards with soft shadows and 12px border-radius. The current Switchboard cards use `rounded-lg border shadow-sm` which is close but needs refinement. The shadow should be softer and more diffused, the border should be nearly invisible, and hover states on endpoint cards should elevate the shadow smoothly.

### Acceptance Criteria
- [ ] **AC1**: Given the `Card` base component, When rendered, Then it has `border-radius: 12px` (using `rounded-xl`), a subtle shadow (`shadow-card` from SWB-100: `0 2px 8px rgba(0,0,0,0.08)`), and a nearly invisible border (`border border-black/[0.06]`)
- [ ] **AC2**: Given the `CardHeader` component, When rendered, Then padding is `p-6` (unchanged) and the title font-weight is `600` (semibold)
- [ ] **AC3**: Given the `CardContent` component, When rendered, Then padding is `p-6 pt-0` (unchanged)
- [ ] **AC4**: Given the `EndpointCard` component, When hovered, Then the shadow transitions from `shadow-card` to `shadow-elevated` (`0 8px 24px rgba(0,0,0,0.12)`) over 200ms, and the card translates up by 1-2px (`hover:-translate-y-0.5`)
- [ ] **AC5**: Given the `EndpointCard` component, When rendered, Then the current `hover:shadow-brand-500/10` class is replaced with the new standardized shadow utilities
- [ ] **AC6**: Given any card in the application, When rendered in the default (light) theme, Then the background is white (`bg-card` resolving to `#FFFFFF`)

### Technical Notes
- Files to modify: `/home/mschodin/projects/switchboard_v1/src/components/ui/card.tsx`, `/home/mschodin/projects/switchboard_v1/src/components/endpoints/endpoint-card.tsx`
- In `card.tsx`, change `rounded-lg` to `rounded-xl`, update shadow class from `shadow-sm` to `shadow-card`, update border to `border border-black/[0.06]`
- In `endpoint-card.tsx`, update the hover classes: replace `hover:shadow-lg hover:shadow-brand-500/10` with `hover:shadow-elevated hover:-translate-y-0.5`
- Add `transition-all duration-200 ease-in-out` to the Card base component for smooth hover transitions when cards are interactive
- The `admin-stats.tsx` cards and `request-card.tsx` cards will automatically inherit the base Card styling changes

### Dependencies
- Blocked by: SWB-100
- Blocks: SWB-108, SWB-109, SWB-111
- Related: SWB-102

### Non-Functional Requirements
- Performance: Shadow transitions should use GPU-accelerated properties (transform + box-shadow); verify no layout thrashing
- Security: No security impact
- Accessibility: Card focus states should be visible for keyboard navigation

### Out of Scope
- Changing card content layout or information hierarchy
- Adding new card variants
- Modifying endpoint data display logic

### Priority: Must Have
### Story Points: 3

---

## Story: [SWB-104] Restyle Header and Navigation

### User Story
As a visitor, I want the main header to match NICE.com's clean navigation style (white or very light background, subtle bottom border, balanced spacing), so that the top-level navigation feels professional and brand-aligned.

### Description
Update the `MainHeader` component and the `UserMenu` component to align with NICE.com's header/navigation patterns. NICE uses a clean white header with subtle separation from content below. The current Switchboard header uses a backdrop-blur effect which is more of a glassmorphism style; it should shift to a solid white background with a subtle bottom border. The "Endpoint Registry" title should use NICE's heading weight conventions (font-weight 600-900 for prominent headings). The search input in the header should have NICE-aligned styling (handled partly by SWB-105 input changes, but positioning and sizing adjustments belong here). The user menu avatar should use NICE's primary dark color instead of `brand-500`.

### Acceptance Criteria
- [ ] **AC1**: Given the `MainHeader` component, When rendered, Then the header has a solid white background (`bg-white`), a subtle bottom border (`border-b border-black/[0.08]`), and no backdrop-blur effect
- [ ] **AC2**: Given the header title "Endpoint Registry", When rendered, Then it uses `font-semibold` (weight 600) at the current `text-2xl` size, with color matching `--foreground` (dark text from NICE palette)
- [ ] **AC3**: Given the header subtitle, When rendered, Then it uses `text-sm` with `text-muted-foreground` matching NICE's muted gray (`#6B6B76`)
- [ ] **AC4**: Given the `UserMenu` avatar, When rendered for an authenticated user, Then the `AvatarFallback` background uses `bg-primary` (NICE's dark `#22212B`) instead of `bg-brand-500`
- [ ] **AC5**: Given the header container, When rendered, Then the height is `h-16` (unchanged) and horizontal padding is consistent with the content area below
- [ ] **AC6**: Given the `UserMenu` for unauthenticated users, When rendered, Then the "Log In" button uses `ghost` variant and "Sign Up" uses `default` variant (dark background from SWB-102)

### Technical Notes
- Files to modify: `/home/mschodin/projects/switchboard_v1/src/components/layout/main-header.tsx`, `/home/mschodin/projects/switchboard_v1/src/components/auth/user-menu.tsx`
- In `main-header.tsx`, replace `bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60` with `bg-white` (or `bg-background` since SWB-100 sets it to white)
- In `user-menu.tsx`, replace `bg-brand-500` on AvatarFallback with `bg-primary`
- The dropdown menu styling inherits from shadcn's `dropdown-menu.tsx` which will pick up the new CSS variables from SWB-100 automatically

### Dependencies
- Blocked by: SWB-100, SWB-101
- Blocks: None
- Related: SWB-102, SWB-105

### Non-Functional Requirements
- Performance: Removing backdrop-blur improves rendering performance on lower-end devices
- Security: No security impact
- Accessibility: Header must remain a landmark (`<header>` element preserved); focus order must be logical

### Out of Scope
- Adding new navigation links or menu items
- Changing the search functionality behavior
- Making the header sticky or changing its scroll behavior

### Priority: Must Have
### Story Points: 3

---

## Story: [SWB-105] Restyle Form Inputs, Selects, and Textarea

### User Story
As a user, I want form fields (inputs, selects, textareas) to match NICE.com's clean, modern input style, so that forms feel consistent with the overall design language.

### Description
Update the `input.tsx`, `select.tsx`, `textarea.tsx`, and `label.tsx` components to align with NICE.com's form styling. NICE uses inputs with subtle borders, slightly more generous padding, and a clean focus state (cyan-tinted focus ring rather than the default blue). Border-radius should match the global `--radius` (0.75rem / 12px). The focus ring should transition to the cyan accent color. Labels should use font-weight 500.

### Acceptance Criteria
- [ ] **AC1**: Given an `Input` component, When rendered, Then it has `border-radius` matching `--radius` (`rounded-md` resolving to `calc(0.75rem - 2px)`), a subtle border (`border-input` from updated CSS vars), `h-10` height, and `px-4 py-2` padding
- [ ] **AC2**: Given an `Input` component, When focused, Then the focus ring uses the cyan accent color (`ring-ring` resolving to NICE's cyan `#23C9FF`) with a 2px ring width and smooth 150ms transition
- [ ] **AC3**: Given a `Textarea` component, When rendered, Then it shares the same border, border-radius, and focus styling as the Input component
- [ ] **AC4**: Given a `SelectTrigger` component, When rendered, Then it matches the Input styling (same height, border, border-radius, padding) for visual consistency
- [ ] **AC5**: Given a `SelectContent` dropdown, When open, Then it has `rounded-xl` border-radius (12px), `shadow-elevated` shadow, and a subtle border matching the card border style
- [ ] **AC6**: Given a `Label` component, When rendered, Then it uses `font-medium` (weight 500) and `text-sm` with color from `--foreground`
- [ ] **AC7**: Given any form field in its placeholder state, When rendered, Then the placeholder text color matches NICE's muted gray (`--muted-foreground`)

### Technical Notes
- Files to modify: `/home/mschodin/projects/switchboard_v1/src/components/ui/input.tsx`, `/home/mschodin/projects/switchboard_v1/src/components/ui/select.tsx`, `/home/mschodin/projects/switchboard_v1/src/components/ui/textarea.tsx`, `/home/mschodin/projects/switchboard_v1/src/components/ui/label.tsx`
- Most changes are border-radius alignment and focus ring color, which cascade from SWB-100 CSS variable updates
- Explicit overrides may be needed for the `SelectContent` shadow and border-radius since it currently uses `rounded-md`
- Input padding change from `px-3` to `px-4` provides a slightly more spacious feel matching NICE
- Add `transition-colors duration-150` to inputs for smooth focus/blur border color transitions

### Dependencies
- Blocked by: SWB-100
- Blocks: SWB-108, SWB-110
- Related: SWB-102

### Non-Functional Requirements
- Performance: No additional DOM elements; CSS-only changes
- Security: No security impact
- Accessibility: Focus states must be clearly visible (WCAG 2.4.7); cyan ring on white background passes visibility requirements

### Out of Scope
- Changing form validation logic or error message display
- Adding new input types or variants
- Modifying form submission behavior

### Priority: Should Have
### Story Points: 3

---

## Story: [SWB-106] Restyle Badge, Tag, and Status Components

### User Story
As a visitor, I want badges, tags, and status indicators to use NICE.com's styling conventions, so that metadata labels look clean and consistent across the application.

### Description
Update `badge.tsx`, `tag-badge.tsx`, and `status-badge.tsx` to align with NICE.com's label/tag aesthetic. NICE uses clean, simple labels with light backgrounds and subtle text. The current tag badges use inline `style` props for dynamic colors (which should be preserved for category differentiation) but the base badge shape, padding, and font-weight should match NICE's conventions. Status badges should feel integrated rather than standing out with bright colored backgrounds.

### Acceptance Criteria
- [ ] **AC1**: Given a `Badge` component with `default` variant, When rendered, Then it has `rounded-md` border-radius (not fully round `rounded-full`), `font-medium` weight (instead of `font-semibold`), and `px-2.5 py-0.5` padding
- [ ] **AC2**: Given a `Badge` with `secondary` variant, When rendered, Then it has a light neutral background, dark text, and no visible border (borderless secondary badge)
- [ ] **AC3**: Given a `Badge` with `outline` variant, When rendered, Then it has a subtle border (`border-black/[0.15]`), transparent background, and dark text
- [ ] **AC4**: Given a `TagBadge` component, When rendered, Then it preserves the dynamic color system (inline styles for `backgroundColor`, `color`, `borderColor`) but uses `rounded-md` base shape instead of `rounded-full`
- [ ] **AC5**: Given a `StatusBadge` component, When rendered, Then the status dot indicator is preserved, the badge uses `rounded-md`, and the background colors are slightly muted (e.g., `bg-green-50` instead of `bg-green-100` for active)
- [ ] **AC6**: Given any badge, When hovered (if interactive), Then the transition uses `duration-200 ease-in-out`

### Technical Notes
- Files to modify: `/home/mschodin/projects/switchboard_v1/src/components/ui/badge.tsx`, `/home/mschodin/projects/switchboard_v1/src/components/tags/tag-badge.tsx`, `/home/mschodin/projects/switchboard_v1/src/components/endpoints/status-badge.tsx`
- The critical change in `badge.tsx` is `rounded-full` to `rounded-md` in the base CVA string
- `font-semibold` should become `font-medium` for a more subtle label feel
- `TagBadge` inline styles must be preserved because tag colors come from the database; only the base `Badge` shape class matters here
- `StatusBadge` background opacity reduction: `bg-green-100` to `bg-green-50`, `bg-yellow-100` to `bg-yellow-50`, `bg-red-100` to `bg-red-50`

### Dependencies
- Blocked by: SWB-100
- Blocks: SWB-109
- Related: SWB-103

### Non-Functional Requirements
- Performance: No performance impact
- Security: No security impact
- Accessibility: Status badges must maintain sufficient contrast between background and text; verify green-50/green-800 passes 4.5:1

### Out of Scope
- Adding new badge variants
- Changing which tags/statuses are displayed on cards
- Modifying tag filtering behavior triggered by badge clicks

### Priority: Should Have
### Story Points: 2

---

## Story: [SWB-107] Update Sidebar Styling

### User Story
As a visitor, I want the left sidebar (tag filter navigation) and right sidebar (chat) to match NICE.com's clean panel aesthetic, so that the overall three-panel layout feels cohesive and modern.

### Description
Update `left-sidebar.tsx` and `right-sidebar.tsx` to align with NICE.com's panel styling. NICE uses clean white panels with subtle borders and generous padding. The current sidebars use `bg-card` with `border-r`/`border-l` which is close but should be refined. The "Switchboard" brand name in the left sidebar currently uses `text-brand-500` (indigo) which should transition to NICE's primary dark or use a gradient text effect inspired by NICE's heading gradients. The "Filter by Category" section heading and the bottom action bar should be updated with refined typography and spacing.

### Acceptance Criteria
- [ ] **AC1**: Given the `LeftSidebar`, When rendered, Then the background is white (`bg-white` or `bg-card`), the right border is subtle (`border-r border-black/[0.08]`), and padding is `p-6`
- [ ] **AC2**: Given the "Switchboard" brand title in the left sidebar, When rendered, Then it uses `text-primary` (NICE's dark `#22212B`) with `font-bold` at `text-2xl`, OR it uses a CSS gradient text effect (`bg-gradient-to-r from-[#2F33F5] to-[#5192F4] bg-clip-text text-transparent`) for visual interest
- [ ] **AC3**: Given the "API Endpoint Registry" subtitle, When rendered, Then it uses `text-muted-foreground` with `text-sm` and `font-normal` (weight 400)
- [ ] **AC4**: Given the "Filter by Category" heading, When rendered, Then it uses `text-xs font-semibold uppercase tracking-wider text-muted-foreground` for a clean section label style
- [ ] **AC5**: Given the sidebar bottom action bar (Submit/Login/Signup buttons), When rendered, Then the border-top is subtle (`border-t border-black/[0.08]`) and buttons use the updated styles from SWB-102
- [ ] **AC6**: Given the `RightSidebar`, When rendered, Then the background matches the left sidebar and the left border uses the same subtle styling

### Technical Notes
- Files to modify: `/home/mschodin/projects/switchboard_v1/src/components/layout/left-sidebar.tsx`, `/home/mschodin/projects/switchboard_v1/src/components/layout/right-sidebar.tsx`
- The "Filter by Category" heading style change from `text-sm font-medium` to `text-xs font-semibold uppercase tracking-wider` follows NICE.com's section label pattern
- The gradient text effect for the brand title is optional but adds visual interest: implementers can choose between solid dark text or gradient text based on preference during sprint planning
- The sidebar widths (`sidebar-left: 280px`, `sidebar-right: 360px`) should remain unchanged (layout is out of scope)

### Dependencies
- Blocked by: SWB-100, SWB-101, SWB-102
- Blocks: None
- Related: SWB-104

### Non-Functional Requirements
- Performance: Gradient text effect (if used) has no measurable performance cost
- Security: No security impact
- Accessibility: Sidebar must remain navigable via keyboard; section headings should use appropriate HTML semantics

### Out of Scope
- Changing sidebar widths or responsive behavior
- Modifying the TagList component's filtering logic
- Adding collapsible sidebar functionality

### Priority: Should Have
### Story Points: 3

---

## Story: [SWB-108] Restyle Auth Pages (Login/Register)

### User Story
As a user, I want the login and registration pages to match NICE.com's auth page aesthetic, so that the onboarding experience feels premium and brand-consistent.

### Description
Update the login page (`/login/page.tsx`) and register page (`/register/page.tsx`) to align with NICE.com's form page styling. These pages currently center a Card on a muted background. The styling should be refined with NICE's card styling (from SWB-103), updated form inputs (from SWB-105), and buttons (from SWB-102). The background should shift from `bg-muted/50` to a cleaner look. The link colors should use NICE's accent colors instead of `text-brand-500`.

### Acceptance Criteria
- [ ] **AC1**: Given the login page, When rendered, Then the page background is a clean light gray (`bg-[#F5F5F7]` or `bg-muted`) without transparency modifier
- [ ] **AC2**: Given the login card, When rendered, Then it uses the updated Card styling from SWB-103 (12px radius, subtle shadow, minimal border)
- [ ] **AC3**: Given the card title "Log In", When rendered, Then it uses `text-2xl font-semibold` with `--foreground` color
- [ ] **AC4**: Given the "Sign up" link on the login page, When rendered, Then it uses the cyan accent color (`text-accent` or `text-[#23C9FF]`) instead of `text-brand-500`, with `hover:underline`
- [ ] **AC5**: Given the register page, When rendered, Then it mirrors the login page styling with the same background, card style, and link colors
- [ ] **AC6**: Given the form submit button (Log In / Sign Up), When rendered, Then it spans `w-full` and uses the dark primary style from SWB-102

### Technical Notes
- Files to modify: `/home/mschodin/projects/switchboard_v1/src/app/(auth)/login/page.tsx`, `/home/mschodin/projects/switchboard_v1/src/app/(auth)/register/page.tsx`
- Replace `bg-muted/50` with `bg-muted` (or `bg-[#F5F5F7]` if the muted variable does not precisely match)
- Replace `text-brand-500` on the sign-up/login link with the appropriate accent color class
- The form components (`LoginForm`, `RegisterForm`) will automatically pick up styling changes from SWB-102 (buttons) and SWB-105 (inputs) via the shared component library
- The `CardDescription` text should use `text-muted-foreground` (already correct, just verify)

### Dependencies
- Blocked by: SWB-100, SWB-102, SWB-103, SWB-105
- Blocks: None
- Related: SWB-101

### Non-Functional Requirements
- Performance: No performance impact
- Security: No security impact
- Accessibility: Form labels must be properly associated with inputs; error messages must be announced to screen readers

### Out of Scope
- Changing auth flow logic or adding OAuth providers
- Modifying form validation rules
- Adding password strength indicators or "remember me" functionality

### Priority: Should Have
### Story Points: 2

---

## Story: [SWB-109] Restyle Admin Dashboard and Request Cards

### User Story
As an admin, I want the admin dashboard stats and request cards to match NICE.com's styling, so that the management interface is visually consistent with the public-facing application.

### Description
Update `admin-stats.tsx` and `request-card.tsx` to use NICE-aligned styling. The stat cards should use the updated Card base (from SWB-103) with icon colors that align with NICE's palette. The request cards should use updated badges (from SWB-106) and buttons (from SWB-102). The approve button currently uses a hardcoded `bg-green-600` which should be updated to use a NICE-consistent approach (either keeping green for semantic meaning or using the primary style).

### Acceptance Criteria
- [ ] **AC1**: Given the admin stat cards, When rendered, Then they use the updated Card styling from SWB-103 and the icon colors are refined to use NICE-aligned tones: pending=`text-amber-500`, endpoints=`text-[#5192F4]`, active=`text-emerald-500`, users=`text-[#872BFF]`
- [ ] **AC2**: Given a request card, When rendered, Then it uses the updated Card base from SWB-103 with the same border, shadow, and radius
- [ ] **AC3**: Given the "View Details" button on a request card, When rendered, Then it uses the `outline` variant from SWB-102
- [ ] **AC4**: Given the "Approve" button, When rendered, Then it uses `bg-emerald-600 hover:bg-emerald-700` (keeping green for semantic meaning but updating the shade to match NICE's modern tone)
- [ ] **AC5**: Given the "Reject" button, When rendered, Then it uses the `destructive` variant which inherits updated styling from SWB-100/SWB-102
- [ ] **AC6**: Given the stat card values (numbers), When rendered, Then they use `text-3xl font-bold` (slightly larger for visual impact) with `--foreground` color

### Technical Notes
- Files to modify: `/home/mschodin/projects/switchboard_v1/src/components/admin/admin-stats.tsx`, `/home/mschodin/projects/switchboard_v1/src/components/admin/request-card.tsx`
- In `admin-stats.tsx`, update icon color classes: `text-yellow-600` to `text-amber-500`, `text-blue-600` to `text-[#5192F4]`, `text-green-600` to `text-emerald-500`, `text-purple-600` to `text-[#872BFF]`
- In `request-card.tsx`, update approve button from `bg-green-600 hover:bg-green-700` to `bg-emerald-600 hover:bg-emerald-700`
- Stat value text change: `text-2xl font-bold` to `text-3xl font-bold` for more visual weight
- Most changes are inherited from upstream stories; this story handles the few component-specific overrides

### Dependencies
- Blocked by: SWB-100, SWB-102, SWB-103, SWB-106
- Blocks: None
- Related: SWB-108

### Non-Functional Requirements
- Performance: No performance impact
- Security: No security impact (admin access control is unchanged)
- Accessibility: Action buttons must have distinct visual states (default, hover, disabled) and proper ARIA labels

### Out of Scope
- Changing admin workflow logic
- Adding new stat metrics or request card fields
- Modifying the approval/rejection action behavior

### Priority: Could Have
### Story Points: 3

---

## Story: [SWB-110] Restyle Chat Sidebar UI

### User Story
As a user, I want the chat sidebar (right panel) to match NICE.com's clean interface style, so that the AI assistant area feels integrated with the rest of the application design.

### Description
Update `chat-header.tsx`, `chat-input.tsx`, `chat-messages.tsx`, and `chat-message.tsx` to use NICE-aligned styling. The chat header icon color should change from `text-brand-500` to NICE's primary or accent color. The chat input area should use the updated input styling from SWB-105. Message bubbles should use NICE's background colors and border radii.

### Acceptance Criteria
- [ ] **AC1**: Given the `ChatHeader`, When rendered, Then the `MessageSquare` icon uses `text-primary` (NICE's dark `#22212B`) instead of `text-brand-500`, and the header title uses `font-semibold` with `text-sm`
- [ ] **AC2**: Given the chat input area, When rendered, Then the `Input` component uses the updated styling from SWB-105, and the send button uses `bg-primary` (dark) with `text-primary-foreground` (white)
- [ ] **AC3**: Given a user message bubble, When rendered, Then it has `bg-primary text-primary-foreground` (dark background, white text) with `rounded-xl` border-radius
- [ ] **AC4**: Given an assistant message bubble, When rendered, Then it has `bg-muted text-foreground` (light gray background, dark text) with `rounded-xl` border-radius
- [ ] **AC5**: Given the chat header border, When rendered, Then it uses the subtle border style (`border-b border-black/[0.08]`) consistent with other section dividers
- [ ] **AC6**: Given the chat input border, When rendered, Then it uses the same subtle border style (`border-t border-black/[0.08]`)

### Technical Notes
- Files to modify: `/home/mschodin/projects/switchboard_v1/src/components/chat/chat-header.tsx`, `/home/mschodin/projects/switchboard_v1/src/components/chat/chat-input.tsx`, `/home/mschodin/projects/switchboard_v1/src/components/chat/chat-message.tsx`
- In `chat-header.tsx`, change `text-brand-500` to `text-primary`
- In `chat-input.tsx`, the Input and Button components will inherit styling from SWB-105 and SWB-102 respectively; only verify border classes need explicit updates
- Message bubble styling may currently be inline or in `chat-message.tsx`; update to use the theme's color variables

### Dependencies
- Blocked by: SWB-100, SWB-105
- Blocks: None
- Related: SWB-107

### Non-Functional Requirements
- Performance: No performance impact
- Security: No security impact
- Accessibility: Chat messages must be readable by screen readers; proper ARIA roles for chat region

### Out of Scope
- Adding actual AI chat functionality
- Changing message display logic
- Adding typing indicators or read receipts

### Priority: Could Have
### Story Points: 2

---

## Story: [SWB-111] Add Hover Effects and Transitions

### User Story
As a visitor, I want interactive elements throughout the application to have smooth, consistent hover and transition effects matching NICE.com's interaction patterns, so that the interface feels responsive and polished.

### Description
This is a sweep-through story to audit and standardize hover effects and transitions across all interactive components. NICE.com uses consistent 200-300ms transitions with `ease-in-out` timing on interactive elements. Some components may already have transitions from earlier stories (SWB-102, SWB-103), but this story ensures completeness across sidebar tag items, filter badges, dropdown menu items, skeleton loading animations, and any other interactive elements not explicitly covered in previous stories.

### Acceptance Criteria
- [ ] **AC1**: Given a tag item in the left sidebar `TagList`, When hovered, Then it shows a subtle background highlight (`hover:bg-accent/50`) with a 200ms transition
- [ ] **AC2**: Given a filter badge in `EndpointFilters`, When the close (X) button is hovered, Then the opacity changes smoothly (`hover:opacity-70 transition-opacity duration-200`)
- [ ] **AC3**: Given a `DropdownMenuItem`, When hovered, Then the background transition is smooth (200ms) rather than instant
- [ ] **AC4**: Given the `EndpointGrid` skeleton loader, When displayed, Then the shimmer animation uses a smooth pulse that matches NICE's loading patterns (Tailwind's built-in `animate-pulse` is acceptable)
- [ ] **AC5**: Given any link in the application (sidebar brand link, auth page links, etc.), When hovered, Then the transition is smooth (color change or underline appearance uses `transition-all duration-200`)
- [ ] **AC6**: Given the global CSS, When I review transition utilities, Then a reusable `transition-nice` utility class is defined in `globals.css` that applies `transition-all duration-200 ease-in-out` for convenient reuse

### Technical Notes
- Files to modify: `/home/mschodin/projects/switchboard_v1/src/app/globals.css` (for utility class), `/home/mschodin/projects/switchboard_v1/src/components/tags/tag-list.tsx`, `/home/mschodin/projects/switchboard_v1/src/components/endpoints/endpoint-filters.tsx`, `/home/mschodin/projects/switchboard_v1/src/components/ui/dropdown-menu.tsx` (if needed)
- Add to `globals.css` within `@layer utilities`: `.transition-nice { @apply transition-all duration-200 ease-in-out; }`
- The `tag-list.tsx` file was not reviewed in detail; the implementer should inspect it for hover state opportunities
- Most dropdown menu transitions are handled by Radix UI's built-in animation; verify they are not overridden
- This story is intentionally broad to catch any interactive elements missed by component-specific stories

### Dependencies
- Blocked by: SWB-102, SWB-103
- Blocks: None
- Related: SWB-106, SWB-107

### Non-Functional Requirements
- Performance: All transitions must use GPU-accelerated properties where possible (transform, opacity); avoid transitioning layout properties (width, height, top, left)
- Security: No security impact
- Accessibility: Transitions must respect `prefers-reduced-motion: reduce` media query; add a global rule to disable transitions when this preference is set

### Out of Scope
- Adding page transition animations
- Adding loading spinners or progress bars
- Implementing scroll-based animations

### Priority: Should Have
### Story Points: 2

---

## Open Questions

1. **Gradient brand text**: Should the "Switchboard" brand title in the left sidebar use a CSS gradient text effect (inspired by NICE.com's gradient headings) or remain solid-colored? This is a design decision for sprint planning.

2. **Dark mode alignment**: NICE.com does not prominently feature a dark mode. Should the dark theme variables (`.dark` class in `globals.css`) be updated to match NICE's palette as well, or deprioritized? The current stories include dark mode updates in SWB-100 but implementers could defer if dark mode is not actively used.

3. **Accent color choice**: NICE.com uses both cyan (`#23C9FF`) and purple (`#872BFF`) as accents. The stories primarily use cyan for interactive elements (focus rings, links). Should purple be introduced as a secondary accent, or keep it simpler with cyan only?

4. **Badge shape**: NICE.com uses a mix of rounded-full pills and rounded-md chips across different contexts. The stories standardize on `rounded-md` for badges. Should tag badges specifically remain `rounded-full` to differentiate them from status badges?

---

## Risks

1. **Contrast compliance**: Shifting to NICE's near-black primary (`#22212B`) is safe for text on white, but care must be taken with the cyan accent (`#23C9FF`) on white backgrounds -- it has a contrast ratio of approximately 3.2:1 which fails WCAG AA for normal text. Use cyan only for large text, decorative elements, or interactive-state indicators (focus rings), never for body text.

2. **shadcn component inheritance**: Changing base CSS variables affects ALL shadcn components globally. Thorough visual regression testing across all pages (home, login, register, submit, admin, my-submissions) is essential after SWB-100.

3. **Font loading latency**: Adding Be Vietnam Pro with 6 weights could increase initial font payload. The `next/font` subsetting to Latin mitigates this, but should be verified in Lighthouse after SWB-101.

4. **Status badge contrast**: Reducing status badge background intensity (green-100 to green-50) may reduce contrast. Verify each combination (green-50/green-800, yellow-50/yellow-800, red-50/red-800) meets 4.5:1 ratio.

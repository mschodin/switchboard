# Switchboard - User Stories

## Executive Summary

| Story ID | Title | Priority | Points | Dependencies |
|----------|-------|----------|--------|--------------|
| SWB-001 | Database Schema Setup | Must Have | 3 | None |
| SWB-002 | Supabase Authentication Integration | Must Have | 3 | SWB-001 |
| SWB-003 | Public Registry Page Layout | Must Have | 3 | SWB-001 |
| SWB-004 | Endpoint Card Component | Must Have | 2 | SWB-003 |
| SWB-005 | Left Sidebar Navigation | Must Have | 2 | SWB-002 |
| SWB-006 | Tag/Category Filtering | Must Have | 3 | SWB-004, SWB-005 |
| SWB-007 | Search Functionality | Must Have | 2 | SWB-004 |
| SWB-008 | Header with Auth Menu | Must Have | 2 | SWB-002 |
| SWB-009 | User Registration Flow | Must Have | 3 | SWB-002 |
| SWB-010 | Endpoint Submission Form | Must Have | 3 | SWB-009 |
| SWB-011 | Endpoint Request Queue | Must Have | 3 | SWB-010 |
| SWB-012 | Admin Approval Workflow | Must Have | 5 | SWB-011 |
| SWB-013 | Admin Direct Endpoint Creation | Should Have | 2 | SWB-012 |
| SWB-014 | Chat Interface UI | Should Have | 3 | SWB-003 |
| SWB-015 | Endpoint Detail View | Could Have | 2 | SWB-004 |

**Total Story Points: 41**

---

## Dependency Map

```
SWB-001 (Database Schema)
    |
    +---> SWB-002 (Auth)
    |         |
    |         +---> SWB-005 (Left Sidebar)
    |         |         |
    |         |         +---> SWB-006 (Tag Filtering)
    |         |
    |         +---> SWB-008 (Header Auth Menu)
    |         |
    |         +---> SWB-009 (User Registration)
    |                   |
    |                   +---> SWB-010 (Endpoint Submission)
    |                             |
    |                             +---> SWB-011 (Request Queue)
    |                                       |
    |                                       +---> SWB-012 (Admin Approval)
    |                                                 |
    |                                                 +---> SWB-013 (Admin Direct Create)
    |
    +---> SWB-003 (Registry Layout)
              |
              +---> SWB-004 (Endpoint Card)
              |         |
              |         +---> SWB-006 (Tag Filtering)
              |         |
              |         +---> SWB-007 (Search)
              |         |
              |         +---> SWB-015 (Detail View)
              |
              +---> SWB-014 (Chat UI)
```

---

## Story: SWB-001 - Database Schema Setup

### User Story
As a **developer**, I want **a well-structured database schema in Supabase**, so that **the application has a solid foundation for storing endpoints, users, and requests**.

### Description
Set up the Supabase project and create the necessary database tables to support the endpoint registry functionality. This includes tables for endpoints, endpoint requests (pending submissions), tags/categories, and user roles. Configure Row Level Security (RLS) policies for appropriate data access.

### Acceptance Criteria
- [ ] **AC1**: Given a new Supabase project, When the schema migration is run, Then the following tables are created: `endpoints`, `endpoint_requests`, `tags`, `endpoint_tags` (junction table), `user_roles`
- [ ] **AC2**: Given the `endpoints` table, When examining its structure, Then it contains columns: `id` (UUID, PK), `icon_url` (text), `company` (text, not null), `title` (text, not null), `description` (text), `status` (enum: active/inactive/deprecated), `protocol` (text), `address` (text, not null), `ports` (text array, nullable), `created_at`, `updated_at`, `created_by` (FK to auth.users)
- [ ] **AC3**: Given the `endpoint_requests` table, When examining its structure, Then it mirrors the endpoints table with additional columns: `request_status` (enum: pending/approved/rejected), `submitted_by` (FK to auth.users), `reviewed_by` (FK to auth.users, nullable), `reviewed_at` (timestamp, nullable)
- [ ] **AC4**: Given the `tags` table, When examining its structure, Then it contains: `id` (UUID, PK), `name` (text, unique), `slug` (text, unique), `color` (text, nullable)
- [ ] **AC5**: Given RLS policies are configured, When an unauthenticated user queries `endpoints`, Then only rows with status 'active' are returned
- [ ] **AC6**: Given RLS policies are configured, When an admin user queries `endpoint_requests`, Then all pending requests are visible

### Technical Notes
- Use Supabase CLI for migrations
- Create enum types for `endpoint_status` and `request_status`
- Set up foreign key relationships with appropriate cascade rules
- Index frequently queried columns (company, title, status)
- Consider full-text search index on title and description

### Dependencies
- Blocked by: None
- Blocks: SWB-002, SWB-003
- Related: None

### Non-Functional Requirements
- Performance: Queries on endpoints table should return in < 100ms for up to 1000 records
- Security: RLS must be enabled on all tables; no direct table access without policies

### Out of Scope
- Chat message storage
- Analytics/audit logging tables
- API rate limiting configuration

### Priority: Must Have
### Story Points: 3

---

## Story: SWB-002 - Supabase Authentication Integration

### User Story
As a **user**, I want **to sign up, log in, and log out of the application**, so that **I can access authenticated features like submitting endpoint requests**.

### Description
Integrate Supabase Auth into the application with email/password authentication. Set up the auth context provider, create utility hooks for auth state, and configure the user roles system to distinguish between regular users and administrators.

### Acceptance Criteria
- [ ] **AC1**: Given a new user, When they complete the registration form with valid email and password, Then a new account is created in Supabase Auth and they receive a confirmation email
- [ ] **AC2**: Given a registered user, When they enter valid credentials on the login form, Then they are authenticated and redirected to the registry page
- [ ] **AC3**: Given an authenticated user, When they click the logout option, Then their session is terminated and they are returned to an unauthenticated state
- [ ] **AC4**: Given the auth context, When a component needs to check auth status, Then it can access `user`, `isAuthenticated`, `isAdmin`, and `isLoading` states
- [ ] **AC5**: Given a newly registered user, When their account is created, Then they are assigned the 'user' role by default
- [ ] **AC6**: Given an admin user, When checking their role, Then `isAdmin` returns true and they can access admin-only features

### Technical Notes
- Use `@supabase/supabase-js` client library
- Create AuthContext with React Context API
- Implement `useAuth` hook for easy access to auth state
- Store user role in `user_roles` table, synced via database trigger on auth.users insert
- Handle auth state persistence across page refreshes
- Implement protected route wrapper component

### Dependencies
- Blocked by: SWB-001
- Blocks: SWB-005, SWB-008, SWB-009
- Related: None

### Non-Functional Requirements
- Security: Passwords must meet minimum complexity (8 chars, mixed case, number)
- Security: Session tokens stored securely (httpOnly cookies or secure storage)
- Performance: Auth state check should not block initial page render

### Out of Scope
- Social auth providers (Google, GitHub, etc.)
- Password reset flow
- Email verification enforcement
- Two-factor authentication

### Priority: Must Have
### Story Points: 3

---

## Story: SWB-003 - Public Registry Page Layout

### User Story
As a **visitor**, I want **to see a well-structured landing page with clear sections**, so that **I can easily navigate the endpoint registry and understand the application's purpose**.

### Description
Create the main layout structure for the registry page including the three-column layout: left sidebar, main content area, and right sidebar. Implement the responsive grid system and basic page structure without the detailed component implementations.

### Acceptance Criteria
- [ ] **AC1**: Given a visitor accesses the root URL, When the page loads, Then they see a three-column layout with left sidebar, main content, and right sidebar
- [ ] **AC2**: Given the main content area, When the page renders, Then it displays a header section with "Service Registry" title and descriptive text
- [ ] **AC3**: Given the page layout, When viewed on desktop (> 1024px), Then all three columns are visible side-by-side
- [ ] **AC4**: Given the page layout, When viewed on tablet (768px - 1024px), Then the right sidebar collapses to a toggle-able overlay
- [ ] **AC5**: Given the page layout, When viewed on mobile (< 768px), Then both sidebars collapse to toggle-able overlays with hamburger and chat icons
- [ ] **AC6**: Given the main content area, When no authentication check is required, Then the endpoint grid area renders without waiting for auth state

### Technical Notes
- Use CSS Grid or Flexbox for three-column layout
- Implement responsive breakpoints at 768px and 1024px
- Left sidebar: fixed width 280px on desktop
- Right sidebar: fixed width 360px on desktop
- Main content: fluid width with max-width constraint
- Consider using CSS variables for consistent spacing and colors

### Dependencies
- Blocked by: SWB-001 (needs endpoints table to exist)
- Blocks: SWB-004, SWB-014
- Related: SWB-005

### Non-Functional Requirements
- Performance: Initial layout should render in < 500ms
- Accessibility: Proper landmark roles (nav, main, aside)
- Accessibility: Focus management when sidebars toggle on mobile

### Out of Scope
- Actual endpoint data fetching
- Search bar functionality
- Sidebar content implementation

### Priority: Must Have
### Story Points: 3

---

## Story: SWB-004 - Endpoint Card Component

### User Story
As a **visitor**, I want **to see endpoint information displayed in visually appealing cards**, so that **I can quickly scan and understand available services in the registry**.

### Description
Create a reusable endpoint card component that displays key endpoint information in a modern, clean design. The card should show the icon, company name, title, description, tags, and status in a consistent layout. Implement the grid layout for displaying multiple cards.

### Acceptance Criteria
- [ ] **AC1**: Given an endpoint object, When the card renders, Then it displays the endpoint's icon (or a default placeholder if none), company name, title, and truncated description (max 150 chars with ellipsis)
- [ ] **AC2**: Given an endpoint with tags, When the card renders, Then tags are displayed as colored pills/badges below the description (max 3 visible, with "+N more" indicator)
- [ ] **AC3**: Given an endpoint status, When the card renders, Then a status indicator is visible (green dot for active, yellow for inactive, red for deprecated)
- [ ] **AC4**: Given the endpoint grid, When multiple endpoints are displayed, Then they render in a responsive grid (4 columns on large screens, 3 on medium, 2 on small, 1 on mobile)
- [ ] **AC5**: Given a card, When a user hovers over it, Then a subtle elevation/shadow effect indicates interactivity
- [ ] **AC6**: Given endpoints are fetched from Supabase, When the data loads, Then cards render with real data and loading skeletons show during fetch

### Technical Notes
- Create `EndpointCard` component with TypeScript interface for props
- Use CSS Grid for the card layout
- Implement skeleton loading state for better UX
- Icon can be URL to image or icon identifier for icon library
- Consider lazy loading for card images
- Fetch endpoints using Supabase client with appropriate query

### Dependencies
- Blocked by: SWB-003
- Blocks: SWB-006, SWB-007, SWB-015
- Related: SWB-001

### Non-Functional Requirements
- Performance: Cards should virtualize if > 50 items (defer to separate story if needed)
- Accessibility: Cards should be keyboard navigable
- Accessibility: Status indicators need text alternatives for screen readers

### Out of Scope
- Click-through to detail view
- Card actions (edit, delete)
- Favoriting/bookmarking endpoints

### Priority: Must Have
### Story Points: 2

---

## Story: SWB-005 - Left Sidebar Navigation

### User Story
As a **visitor**, I want **a sidebar with the product name and service categories**, so that **I can understand the application brand and filter endpoints by category**.

### Description
Implement the left sidebar component with the "Switchboard" product name at the top, a list of service category tags for filtering, and conditional auth buttons at the bottom. The sidebar should clearly communicate the application's identity and provide navigation affordances.

### Acceptance Criteria
- [ ] **AC1**: Given the left sidebar, When it renders, Then "Switchboard" appears prominently at the top as the product name/logo
- [ ] **AC2**: Given tags exist in the database, When the sidebar loads, Then all unique tags are listed as clickable filter options
- [ ] **AC3**: Given an unauthenticated user, When viewing the sidebar bottom, Then a "Log In" button is displayed
- [ ] **AC4**: Given an authenticated user, When viewing the sidebar bottom, Then a "Register Endpoint" button is displayed
- [ ] **AC5**: Given the "Log In" button, When clicked, Then the login modal/page is triggered
- [ ] **AC6**: Given the "Register Endpoint" button, When clicked, Then the user is navigated to the endpoint submission form

### Technical Notes
- Fetch tags from Supabase `tags` table
- Use auth context to determine which button to show
- Consider adding tag counts (number of endpoints per tag)
- Implement smooth transitions for auth state changes
- Style active/selected tag state for filter functionality

### Dependencies
- Blocked by: SWB-002
- Blocks: SWB-006
- Related: SWB-003, SWB-010

### Non-Functional Requirements
- Accessibility: Sidebar navigation should use proper `nav` landmark
- Accessibility: Buttons must have adequate touch targets (44x44px minimum)

### Out of Scope
- Tag management (admin CRUD)
- Nested/hierarchical categories
- Tag search within sidebar

### Priority: Must Have
### Story Points: 2

---

## Story: SWB-006 - Tag/Category Filtering

### User Story
As a **visitor**, I want **to filter endpoints by service category tags**, so that **I can quickly find endpoints relevant to my needs**.

### Description
Implement the filtering functionality that connects the sidebar tags to the endpoint grid. When a user clicks a tag in the sidebar, the endpoint grid should update to show only endpoints that have that tag. Support multi-select filtering and provide clear visual feedback for active filters.

### Acceptance Criteria
- [ ] **AC1**: Given a tag in the sidebar, When clicked, Then the endpoint grid filters to show only endpoints with that tag
- [ ] **AC2**: Given an active filter, When the same tag is clicked again, Then the filter is removed and all endpoints are shown
- [ ] **AC3**: Given multiple tags selected, When filtering, Then endpoints matching ANY of the selected tags are shown (OR logic)
- [ ] **AC4**: Given active filters, When viewing the main content area, Then selected tags are displayed as removable chips above the grid
- [ ] **AC5**: Given active filters, When a "Clear all filters" option is clicked, Then all filters are removed and full endpoint list is shown
- [ ] **AC6**: Given a filter is applied, When the endpoint count changes, Then a count indicator shows "Showing X of Y endpoints"

### Technical Notes
- Use React state or URL query params for filter state (prefer URL for shareability)
- Filter query should be constructed on the client using Supabase's `.in()` method on the junction table
- Consider debouncing filter changes if performance is an issue
- Sync filter state between sidebar visual and filter chips

### Dependencies
- Blocked by: SWB-004, SWB-005
- Blocks: None
- Related: SWB-007

### Non-Functional Requirements
- Performance: Filter application should feel instant (< 100ms perceived)
- Accessibility: Filter state changes should be announced to screen readers

### Out of Scope
- Advanced filter operators (AND logic, exclusion)
- Filter presets/saved filters
- Filter by other endpoint fields (status, protocol)

### Priority: Must Have
### Story Points: 3

---

## Story: SWB-007 - Search Functionality

### User Story
As a **visitor**, I want **to search endpoints by keyword**, so that **I can find specific endpoints without browsing through all cards**.

### Description
Implement a search bar in the header section that filters endpoints based on text matching against endpoint title, company, and description fields. The search should provide real-time results as the user types.

### Acceptance Criteria
- [ ] **AC1**: Given the header section, When the page loads, Then a search input is visible with placeholder text "Search endpoints..."
- [ ] **AC2**: Given a user types in the search bar, When 300ms have passed since last keystroke (debounce), Then endpoints are filtered to match the search term
- [ ] **AC3**: Given a search term, When filtering, Then endpoints where title, company, OR description contains the term (case-insensitive) are shown
- [ ] **AC4**: Given a search term with no matches, When the grid updates, Then a "No endpoints found" message is displayed with suggestion to clear search
- [ ] **AC5**: Given an active search, When the clear (X) button in the search bar is clicked, Then the search is cleared and all endpoints are shown
- [ ] **AC6**: Given both search and tag filters are active, When results are shown, Then only endpoints matching BOTH search AND tag filters appear (AND logic between search and tags)

### Technical Notes
- Use Supabase's `.ilike()` or `.textSearch()` for search functionality
- Consider setting up a Postgres full-text search index for better performance
- Debounce search input to reduce API calls
- Combine search filter with tag filter in the query
- Consider URL sync for shareable search results

### Dependencies
- Blocked by: SWB-004
- Blocks: None
- Related: SWB-006

### Non-Functional Requirements
- Performance: Search results should return in < 200ms
- Accessibility: Search input must have associated label (can be visually hidden)

### Out of Scope
- Search suggestions/autocomplete
- Search history
- Advanced search syntax (exact match, exclusion)

### Priority: Must Have
### Story Points: 2

---

## Story: SWB-008 - Header with Auth Menu

### User Story
As a **user**, I want **a user icon in the header with auth options**, so that **I can easily access login, registration, and account management**.

### Description
Implement the person/user icon in the header section that shows a dropdown menu on hover or click. The menu options change based on authentication state - showing login/register for unauthenticated users and profile/logout for authenticated users.

### Acceptance Criteria
- [ ] **AC1**: Given the header section, When it renders, Then a person icon is visible aligned to the right of the header
- [ ] **AC2**: Given an unauthenticated user, When hovering over or clicking the person icon, Then a menu shows "Log In" and "Register" options
- [ ] **AC3**: Given an authenticated user, When hovering over or clicking the person icon, Then a menu shows user email/name, "My Submissions" (if regular user), "Admin Panel" (if admin), and "Log Out" options
- [ ] **AC4**: Given the menu is open, When clicking outside the menu, Then it closes
- [ ] **AC5**: Given the "Log In" menu item, When clicked, Then the login modal or page opens
- [ ] **AC6**: Given the "Log Out" menu item, When clicked, Then the user is logged out and the menu updates to show unauthenticated options

### Technical Notes
- Use a dropdown component (consider headless UI for accessibility)
- Subscribe to auth state changes to update menu dynamically
- Handle both hover (desktop) and click (mobile/tablet) interactions
- Consider keyboard navigation for the dropdown
- Use auth context for state and actions

### Dependencies
- Blocked by: SWB-002
- Blocks: None
- Related: SWB-005, SWB-009

### Non-Functional Requirements
- Accessibility: Dropdown must be keyboard navigable with proper ARIA attributes
- Accessibility: Menu should trap focus when open on mobile

### Out of Scope
- Profile settings page
- Avatar upload
- User preferences

### Priority: Must Have
### Story Points: 2

---

## Story: SWB-009 - User Registration Flow

### User Story
As a **new visitor**, I want **to create an account**, so that **I can submit endpoint registration requests**.

### Description
Implement the complete user registration flow including the registration form, validation, Supabase Auth integration, and success/error handling. The registration should be accessible from both the header menu and the sidebar login button.

### Acceptance Criteria
- [ ] **AC1**: Given a visitor clicks "Register", When the registration form appears, Then it includes fields for email, password, and confirm password
- [ ] **AC2**: Given form input, When the user submits with an invalid email format, Then an inline validation error is shown
- [ ] **AC3**: Given form input, When passwords do not match, Then an error message indicates the mismatch
- [ ] **AC4**: Given form input, When password is less than 8 characters, Then an error indicates minimum length requirement
- [ ] **AC5**: Given valid form submission, When the account is created successfully, Then the user sees a success message instructing them to check their email for verification
- [ ] **AC6**: Given an email already in use, When attempting to register, Then an error message indicates the email is already registered

### Technical Notes
- Use Supabase `auth.signUp()` method
- Implement client-side validation before API call
- Handle Supabase error codes appropriately (especially "User already registered")
- Consider using a modal for registration or a dedicated page
- Form state management with React Hook Form or similar

### Dependencies
- Blocked by: SWB-002
- Blocks: SWB-010
- Related: SWB-008

### Non-Functional Requirements
- Security: Password fields should mask input
- Security: Form should include CSRF protection if not SPA
- Accessibility: Form fields must have associated labels and error descriptions

### Out of Scope
- Social registration (OAuth)
- Email verification enforcement (email sent but not required to proceed)
- CAPTCHA/bot protection

### Priority: Must Have
### Story Points: 3

---

## Story: SWB-010 - Endpoint Submission Form

### User Story
As an **authenticated user**, I want **to submit a new endpoint for review**, so that **I can request my service be added to the registry**.

### Description
Create the endpoint submission form that allows authenticated users to enter all required endpoint information. The form should validate input, handle file uploads for icons, and create a new record in the `endpoint_requests` table with 'pending' status.

### Acceptance Criteria
- [ ] **AC1**: Given an authenticated user clicks "Register Endpoint", When the form loads, Then all endpoint fields are present: icon upload, company name, title, description, tags (multi-select), protocol, address, ports
- [ ] **AC2**: Given the form, When required fields (company, title, address) are left empty, Then validation errors prevent submission
- [ ] **AC3**: Given an icon upload, When a valid image file (PNG, JPG, SVG < 2MB) is selected, Then a preview is shown and the file is staged for upload
- [ ] **AC4**: Given valid form submission, When the submit button is clicked, Then a new record is created in `endpoint_requests` with status 'pending' and `submitted_by` set to current user
- [ ] **AC5**: Given successful submission, When the record is created, Then the user sees a success message indicating their request is pending review
- [ ] **AC6**: Given an unauthenticated user, When attempting to access the form URL directly, Then they are redirected to login

### Technical Notes
- Form fields: `icon` (file upload), `company` (text), `title` (text), `description` (textarea), `tags` (multi-select from existing tags), `protocol` (dropdown: HTTP, HTTPS, gRPC, WebSocket, etc.), `address` (text), `ports` (text, comma-separated or tag input)
- Upload icons to Supabase Storage bucket
- Use RLS to ensure users can only see their own submissions
- Consider saving draft state to localStorage

### Dependencies
- Blocked by: SWB-009
- Blocks: SWB-011
- Related: SWB-001, SWB-013

### Non-Functional Requirements
- Accessibility: Form must be fully keyboard navigable
- Security: Validate file type server-side, not just client-side
- Performance: Image upload should show progress indicator

### Out of Scope
- Bulk endpoint import
- API-based submission
- Draft saving to database

### Priority: Must Have
### Story Points: 3

---

## Story: SWB-011 - Endpoint Request Queue

### User Story
As a **user who submitted endpoints**, I want **to see the status of my submissions**, so that **I can track whether my endpoints have been approved or rejected**.

### Description
Create a "My Submissions" view accessible to authenticated users that displays their submitted endpoint requests with their current status. Users should be able to see pending, approved, and rejected submissions.

### Acceptance Criteria
- [ ] **AC1**: Given an authenticated user, When they navigate to "My Submissions", Then they see a list of all endpoint requests they have submitted
- [ ] **AC2**: Given the submissions list, When viewing an item, Then the endpoint details and request status (pending/approved/rejected) are visible
- [ ] **AC3**: Given a pending submission, When displayed, Then a "Pending Review" badge is shown in yellow/orange
- [ ] **AC4**: Given an approved submission, When displayed, Then an "Approved" badge is shown in green with the approval date
- [ ] **AC5**: Given a rejected submission, When displayed, Then a "Rejected" badge is shown in red (consider showing rejection reason in future iteration)
- [ ] **AC6**: Given the submissions list, When the user has no submissions, Then a helpful empty state message with CTA to "Submit your first endpoint" is shown

### Technical Notes
- Query `endpoint_requests` filtered by `submitted_by = auth.uid()`
- Consider pagination if user has many submissions
- Show most recent submissions first
- Reuse card component styling for consistency

### Dependencies
- Blocked by: SWB-010
- Blocks: SWB-012
- Related: SWB-008

### Non-Functional Requirements
- Performance: List should load in < 500ms for up to 100 items

### Out of Scope
- Editing submitted requests
- Withdrawing/canceling pending requests
- Notification when status changes

### Priority: Must Have
### Story Points: 3

---

## Story: SWB-012 - Admin Approval Workflow

### User Story
As an **administrator**, I want **to review and approve or reject endpoint submissions**, so that **I can maintain the quality and accuracy of the registry**.

### Description
Create an admin panel with a queue of pending endpoint requests. Admins can view full submission details and approve (moving to main endpoints table) or reject (marking as rejected) each request. Include basic admin access controls.

### Acceptance Criteria
- [ ] **AC1**: Given an admin user, When they navigate to "Admin Panel", Then they see a list of all pending endpoint requests
- [ ] **AC2**: Given a non-admin user, When attempting to access admin routes, Then they are shown an access denied message or redirected
- [ ] **AC3**: Given a pending request, When an admin clicks "View Details", Then full endpoint information is displayed including submitter info and submission date
- [ ] **AC4**: Given a pending request, When an admin clicks "Approve", Then the endpoint is created in the main `endpoints` table, the request status is updated to 'approved', and `reviewed_by` and `reviewed_at` are set
- [ ] **AC5**: Given a pending request, When an admin clicks "Reject", Then the request status is updated to 'rejected' with `reviewed_by` and `reviewed_at` set
- [ ] **AC6**: Given the admin panel, When viewing request counts, Then badges show counts for pending, approved today, and rejected today

### Technical Notes
- Create admin route guard checking `isAdmin` from auth context
- Approval action: INSERT into `endpoints` (copy all fields), UPDATE `endpoint_requests` status
- Use Supabase transaction or database function for atomicity
- RLS policies must allow admin to read all requests and update them

### Dependencies
- Blocked by: SWB-011
- Blocks: SWB-013
- Related: SWB-002

### Non-Functional Requirements
- Security: Admin actions must be logged (defer to future story if complex)
- Security: Double-check admin role before allowing mutations

### Out of Scope
- Rejection reasons/feedback to submitter
- Bulk approve/reject
- Request assignment to specific admins

### Priority: Must Have
### Story Points: 5

---

## Story: SWB-013 - Admin Direct Endpoint Creation

### User Story
As an **administrator**, I want **to add endpoints directly to the registry**, so that **I can populate the registry without going through the approval workflow**.

### Description
Extend admin capabilities to allow direct creation of endpoints that bypass the request queue. This uses the same form as the user submission but writes directly to the `endpoints` table instead of `endpoint_requests`.

### Acceptance Criteria
- [ ] **AC1**: Given an admin user, When viewing the admin panel, Then an "Add Endpoint" button is visible
- [ ] **AC2**: Given admin clicks "Add Endpoint", When the form loads, Then it contains the same fields as the user submission form
- [ ] **AC3**: Given admin submits the form, When submission is successful, Then the endpoint is created directly in the `endpoints` table (not endpoint_requests)
- [ ] **AC4**: Given successful creation, When the endpoint is added, Then the admin sees a success message and the new endpoint appears in the registry immediately
- [ ] **AC5**: Given a non-admin user, When attempting to access direct create functionality, Then they are denied access
- [ ] **AC6**: Given the admin form, When optional fields are left empty, Then the endpoint is created with null values for those fields

### Technical Notes
- Reuse the endpoint form component from SWB-010
- Add a prop to switch between "request" mode and "direct" mode
- In direct mode, INSERT into `endpoints` instead of `endpoint_requests`
- Set `created_by` to admin's user ID

### Dependencies
- Blocked by: SWB-012
- Blocks: None
- Related: SWB-010

### Non-Functional Requirements
- Security: Verify admin role server-side via RLS, not just client-side

### Out of Scope
- Bulk import from CSV/JSON
- Endpoint editing (separate story)
- Endpoint deletion (separate story)

### Priority: Should Have
### Story Points: 2

---

## Story: SWB-014 - Chat Interface UI

### User Story
As a **visitor**, I want **to see a chat interface in the right sidebar**, so that **I can interact with the Switchboard assistant in the future**.

### Description
Implement the UI shell for the chat interface in the right sidebar. This includes the header, message list area, and input field with send button. The chat will be non-functional for now (UI only), laying the groundwork for future AI integration.

### Acceptance Criteria
- [ ] **AC1**: Given the right sidebar, When it renders, Then a header displays "Chat with Switchboard" and a brief description
- [ ] **AC2**: Given the chat interface, When viewing the message area, Then it shows a welcome message from the assistant explaining its capabilities
- [ ] **AC3**: Given the chat input area, When it renders, Then a text input field and send button are visible at the bottom
- [ ] **AC4**: Given a user types in the input, When they click send or press Enter, Then the message appears in the message list as a user message (right-aligned, styled differently)
- [ ] **AC5**: Given a user sends a message, When the message is sent, Then a mock response appears after a short delay (e.g., "Chat functionality coming soon!")
- [ ] **AC6**: Given the message list, When there are multiple messages, Then the list scrolls to show the most recent message

### Technical Notes
- Create ChatMessage component with sender type (user/assistant) prop
- Style user messages differently from assistant messages (alignment, color)
- Implement auto-scroll to bottom on new messages
- Store messages in local React state (no persistence needed yet)
- Consider using a scrollable container with flex-end alignment

### Dependencies
- Blocked by: SWB-003
- Blocks: None (future: AI integration story)
- Related: None

### Non-Functional Requirements
- Accessibility: Input must have proper label
- Accessibility: New messages should be announced to screen readers (aria-live)

### Out of Scope
- Actual AI/LLM integration
- Message persistence
- Message history across sessions
- Typing indicators
- File attachments in chat

### Priority: Should Have
### Story Points: 3

---

## Story: SWB-015 - Endpoint Detail View

### User Story
As a **visitor**, I want **to click on an endpoint card to see full details**, so that **I can view all information including technical details like address and ports**.

### Description
Implement a detail view that shows when clicking an endpoint card. This can be a modal, slide-over panel, or dedicated page showing all endpoint fields including those not shown on the card (protocol, address, ports).

### Acceptance Criteria
- [ ] **AC1**: Given an endpoint card, When clicked, Then a detail view opens showing all endpoint information
- [ ] **AC2**: Given the detail view, When rendered, Then it displays: icon (larger), company, title, full description, all tags, status, protocol, address, and ports
- [ ] **AC3**: Given the detail view, When viewing the address, Then a "Copy" button allows copying the address to clipboard
- [ ] **AC4**: Given the detail view, When open, Then a close button (X) or clicking outside closes the view
- [ ] **AC5**: Given the detail view on mobile, When opened, Then it displays as a full-screen overlay for better readability
- [ ] **AC6**: Given the detail view, When pressing Escape key, Then the view closes

### Technical Notes
- Consider using a modal or slide-over panel component
- Implement URL routing for direct linking to endpoint detail (e.g., `/endpoint/[id]`)
- Fetch fresh data when opening detail view (or use cached data from list)
- Clipboard API for copy functionality

### Dependencies
- Blocked by: SWB-004
- Blocks: None
- Related: None

### Non-Functional Requirements
- Accessibility: Modal must trap focus while open
- Accessibility: Close mechanism must be keyboard accessible

### Out of Scope
- Endpoint metrics/analytics
- External links to documentation
- Endpoint health/status checking

### Priority: Could Have
### Story Points: 2

---

## Open Questions / Risks

### Questions for Stakeholder Input

1. **Email Verification**: Should email verification be required before users can submit endpoint requests?

2. **Tag Management**: Who can create new tags? Should there be an admin interface for tag CRUD, or are tags fixed?

3. **Rejection Feedback**: When admins reject a submission, should they be required/able to provide a reason? Should users be notified?

4. **Endpoint Status**: Can endpoints be deactivated by admins after approval? What triggers status changes?

5. **Chat Functionality**: What AI service will power the chat? What should the assistant be able to do (search endpoints, answer questions about services)?

### Identified Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Supabase RLS complexity | Medium | Thoroughly test policies in dev; document policy logic |
| Large number of endpoints impacts performance | Medium | Implement pagination/virtualization early; add DB indexes |
| Icon upload storage costs | Low | Set file size limits; consider CDN |
| Admin single point of failure | Medium | Plan for multiple admin accounts in production |
| Chat feature scope creep | High | Keep initial chat story strictly UI-only; separate AI integration |

---

## Recommended Implementation Order

### Sprint 1: Foundation (13 points)
1. SWB-001 - Database Schema Setup (3)
2. SWB-002 - Supabase Authentication Integration (3)
3. SWB-003 - Public Registry Page Layout (3)
4. SWB-004 - Endpoint Card Component (2)
5. SWB-005 - Left Sidebar Navigation (2)

### Sprint 2: Core Functionality (12 points)
6. SWB-006 - Tag/Category Filtering (3)
7. SWB-007 - Search Functionality (2)
8. SWB-008 - Header with Auth Menu (2)
9. SWB-009 - User Registration Flow (3)
10. SWB-010 - Endpoint Submission Form (3) - may carry to Sprint 3

### Sprint 3: Admin & Polish (14 points)
11. SWB-011 - Endpoint Request Queue (3)
12. SWB-012 - Admin Approval Workflow (5)
13. SWB-013 - Admin Direct Endpoint Creation (2)
14. SWB-014 - Chat Interface UI (3)
15. SWB-015 - Endpoint Detail View (2) - if time permits

---

*Document Version: 1.0*
*Created: 2026-02-04*
*Author: Technical PM Agent*

# Switchboard - API Endpoint Registry

A modern web application for browsing, submitting, and managing API endpoints. Built with Next.js 14, TypeScript, Supabase, and shadcn/ui.

## Features

- **Browse Endpoints**: Search and filter API endpoints by category
- **User Submissions**: Submit new endpoints for admin review
- **Admin Panel**: Approve/reject submissions and manage endpoints
- **Real-time Chat**: AI-powered chat interface (UI shell ready for integration)
- **Responsive Design**: Three-column layout that adapts to mobile, tablet, and desktop

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file:
   ```bash
   cp .env.example .env.local
   ```

4. Update `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

5. Run the database migration in your Supabase SQL editor:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the migration file: `supabase/migrations/001_initial_schema.sql`

6. Create the storage bucket:
   - Go to Storage in Supabase dashboard
   - Create a new public bucket named `endpoint-icons`
   - Apply the storage policies from the migration file

7. Start the development server:
   ```bash
   npm run dev
   ```

8. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
switchboard/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── auth/           # Authentication components
│   │   ├── endpoints/      # Endpoint-related components
│   │   ├── tags/           # Tag/filter components
│   │   ├── chat/           # Chat interface
│   │   └── admin/          # Admin panel components
│   ├── lib/                # Utilities and configurations
│   ├── hooks/              # Custom React hooks
│   ├── actions/            # Server Actions
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
└── supabase/              # Database migrations
```

## Creating an Admin User

After signing up, you need to manually set a user as admin in the database:

1. Go to Supabase Dashboard > Table Editor
2. Open the `user_roles` table
3. Find your user record and update the `role` column to `'admin'`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run unit tests with Vitest
- `npm run test:ui` - Run tests with Vitest UI
- `npm run test:e2e` - Run end-to-end tests with Playwright
- `npm run test:e2e:ui` - Run E2E tests with Playwright UI

## Key Features

### For Users
- Browse all active API endpoints
- Search endpoints by name, company, or description
- Filter endpoints by category tags
- Submit new endpoints for review
- Track submission status

### For Admins
- View dashboard with statistics
- Review pending submissions
- Approve or reject endpoint requests
- Create endpoints directly
- Manage all endpoints

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key
- `NEXT_PUBLIC_SITE_URL` - Your site URL (for redirects)
- `SUPABASE_SERVICE_ROLE_KEY` - (Optional) Service role key for server-side operations

## Database Schema

The application uses the following main tables:
- `endpoints` - Published API endpoints
- `endpoint_requests` - Pending user submissions
- `tags` - Category tags for filtering
- `user_roles` - User role assignments (user/admin)
- Junction tables for many-to-many relationships

## Deployment

For detailed deployment instructions, see the [Deployment Guide](./docs/deployment/DEPLOYMENT-GUIDE.md).

### Quick Start

1. **Set up Supabase:**
   - Create a new Supabase project
   - Run the migration: `supabase/migrations/001_initial_schema.sql`
   - Create storage bucket: `endpoint-icons` (public)

2. **Deploy to Vercel:**
   - Connect your GitHub repository to Vercel
   - Add environment variables (see Deployment Guide)
   - Deploy

3. **Create admin user:**
   - Register an account
   - Update `user_roles` table in Supabase to set role = 'admin'

See [Pre-Deployment Checklist](./docs/deployment/PRE-DEPLOYMENT-CHECKLIST.md) for a complete checklist.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

# Quick Start Guide - Switchboard

Get the Switchboard API Endpoint Registry running locally in 10 minutes.

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- A Supabase account (free tier works)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and create a new project
2. Wait for the project to finish setting up (2-3 minutes)
3. Note your project URL and anon key from Settings → API

### 3. Run Database Migration

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
5. Paste into the SQL editor
6. Click "Run" at the bottom right
7. Verify success (should see "Success. No rows returned")

### 4. Create Storage Bucket

1. Go to "Storage" in the left sidebar
2. Click "New bucket"
3. Name: `endpoint-icons`
4. Public bucket: ✅ Yes
5. Click "Create bucket"
6. Click on the new bucket, go to "Policies"
7. Create these policies:
   - **Public access for viewing**: Anyone can SELECT
   - **Authenticated upload**: Authenticated users can INSERT
   - **Admin delete**: Admins can DELETE

### 5. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your values:
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 6. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7. Create Your Admin Account

1. Click "Sign Up" in the top right
2. Enter your email and password
3. After registration, go to Supabase Dashboard
4. Navigate to: Database → Tables → user_roles
5. Find your user (by user_id)
6. Edit the `role` column and change it to `admin`
7. Refresh the Switchboard app
8. You should now see "Admin Panel" in the user menu

## What You Get

### Default Tags
The migration automatically creates 10 service category tags:
- Authentication
- Payments
- Analytics
- Storage
- Communication
- AI/ML
- Database
- DevOps
- Security
- Maps & Location

### User Features
- Browse endpoints with search and filtering
- Submit new endpoints for review
- Track submission status
- Chat interface (UI ready for AI integration)

### Admin Features
- Dashboard with statistics
- Review and approve/reject submissions
- Create endpoints directly
- Manage all endpoints

## Common Issues

### "Database error" when loading page
**Solution**: Make sure you ran the entire migration SQL and all policies were created.

### "Unauthorized" when submitting
**Solution**: Verify you're logged in and check browser console for auth errors.

### "Storage bucket not found" for icons
**Solution**: Create the `endpoint-icons` bucket and make it public.

### Can't see admin panel
**Solution**: Update your user_roles.role to 'admin' in Supabase dashboard.

## Project Structure

```
switchboard_v1/
├── src/
│   ├── app/              # Pages and routes
│   ├── components/       # React components
│   ├── lib/             # Utilities and config
│   ├── hooks/           # Custom React hooks
│   ├── actions/         # Server actions (API)
│   └── types/           # TypeScript types
├── public/              # Static files
├── supabase/            # Database migrations
└── [config files]
```

## Useful Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
```

## Next Steps

1. **Explore the app**: Click around and test all features
2. **Read the code**: Check out `src/components` to see patterns
3. **Create test endpoints**: Use the admin panel to add some endpoints
4. **Test user flow**: Register a new account and submit an endpoint

## Getting Help

- Check `README.md` for detailed documentation
- Review `IMPLEMENTATION_SUMMARY.md` for architecture details
- Look at the LLD: `docs/design/SWITCHBOARD-LLD.md`
- Review user stories: `docs/user-stories/SWITCHBOARD-USER-STORIES.md`

## Development Tips

### Hot Reload
Next.js watches for file changes. Edit any file and see changes instantly.

### TypeScript
The project uses strict TypeScript. Run `npm run type-check` to verify.

### Database Changes
If you modify the schema, create a new migration file in `supabase/migrations/`.

### Adding UI Components
Use shadcn/ui CLI:
```bash
npx shadcn@latest add [component-name]
```

### Environment Variables
- `NEXT_PUBLIC_*` variables are exposed to the browser
- Non-prefixed variables are server-only

## Production Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Add environment variables
6. Deploy

That's it! Your production app will be live in minutes.

---

**You're ready to go!** 🚀

If you encounter any issues, check the Supabase logs and browser console for detailed error messages.

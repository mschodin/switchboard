-- =============================================================================
-- SWITCHBOARD DATABASE SCHEMA
-- Version: 1.0
-- =============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For fuzzy text search

-- =============================================================================
-- ENUM TYPES
-- =============================================================================

CREATE TYPE endpoint_status AS ENUM ('active', 'inactive', 'deprecated');
CREATE TYPE request_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- =============================================================================
-- TABLES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- User Roles Table
-- Stores role assignments for authenticated users
-- -----------------------------------------------------------------------------
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT user_roles_user_id_unique UNIQUE (user_id)
);

-- Index for faster user role lookups
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role);

-- -----------------------------------------------------------------------------
-- Tags Table
-- Service categories for filtering endpoints
-- -----------------------------------------------------------------------------
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    color TEXT DEFAULT '#6366f1',  -- Default indigo color
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT tags_name_unique UNIQUE (name),
    CONSTRAINT tags_slug_unique UNIQUE (slug),
    CONSTRAINT tags_slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

-- Index for tag lookups
CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_tags_name ON tags(name);

-- -----------------------------------------------------------------------------
-- Endpoints Table
-- Main registry of approved API endpoints
-- -----------------------------------------------------------------------------
CREATE TABLE endpoints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    icon_url TEXT,
    company TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status endpoint_status NOT NULL DEFAULT 'active',
    protocol TEXT NOT NULL DEFAULT 'HTTPS',
    address TEXT NOT NULL,
    ports TEXT[],
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Full-text search vector
    search_vector TSVECTOR GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(company, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(description, '')), 'B')
    ) STORED,

    CONSTRAINT endpoints_company_not_empty CHECK (char_length(company) > 0),
    CONSTRAINT endpoints_title_not_empty CHECK (char_length(title) > 0),
    CONSTRAINT endpoints_address_not_empty CHECK (char_length(address) > 0)
);

-- Indexes for endpoints
CREATE INDEX idx_endpoints_status ON endpoints(status);
CREATE INDEX idx_endpoints_company ON endpoints(company);
CREATE INDEX idx_endpoints_title ON endpoints(title);
CREATE INDEX idx_endpoints_created_at ON endpoints(created_at DESC);
CREATE INDEX idx_endpoints_search_vector ON endpoints USING GIN(search_vector);
CREATE INDEX idx_endpoints_company_trgm ON endpoints USING GIN(company gin_trgm_ops);
CREATE INDEX idx_endpoints_title_trgm ON endpoints USING GIN(title gin_trgm_ops);

-- -----------------------------------------------------------------------------
-- Endpoint Tags Junction Table
-- Many-to-many relationship between endpoints and tags
-- -----------------------------------------------------------------------------
CREATE TABLE endpoint_tags (
    endpoint_id UUID NOT NULL REFERENCES endpoints(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (endpoint_id, tag_id)
);

-- Indexes for junction table queries
CREATE INDEX idx_endpoint_tags_endpoint_id ON endpoint_tags(endpoint_id);
CREATE INDEX idx_endpoint_tags_tag_id ON endpoint_tags(tag_id);

-- -----------------------------------------------------------------------------
-- Endpoint Requests Table
-- Pending submissions awaiting admin approval
-- -----------------------------------------------------------------------------
CREATE TABLE endpoint_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    icon_url TEXT,
    company TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    protocol TEXT NOT NULL DEFAULT 'HTTPS',
    address TEXT NOT NULL,
    ports TEXT[],
    request_status request_status NOT NULL DEFAULT 'pending',
    submitted_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT endpoint_requests_company_not_empty CHECK (char_length(company) > 0),
    CONSTRAINT endpoint_requests_title_not_empty CHECK (char_length(title) > 0),
    CONSTRAINT endpoint_requests_address_not_empty CHECK (char_length(address) > 0)
);

-- Indexes for endpoint requests
CREATE INDEX idx_endpoint_requests_status ON endpoint_requests(request_status);
CREATE INDEX idx_endpoint_requests_submitted_by ON endpoint_requests(submitted_by);
CREATE INDEX idx_endpoint_requests_created_at ON endpoint_requests(created_at DESC);

-- -----------------------------------------------------------------------------
-- Endpoint Request Tags Junction Table
-- Tags selected for pending requests
-- -----------------------------------------------------------------------------
CREATE TABLE endpoint_request_tags (
    request_id UUID NOT NULL REFERENCES endpoint_requests(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (request_id, tag_id)
);

-- Indexes for junction table queries
CREATE INDEX idx_endpoint_request_tags_request_id ON endpoint_request_tags(request_id);
CREATE INDEX idx_endpoint_request_tags_tag_id ON endpoint_request_tags(tag_id);

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Function: Update updated_at timestamp
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- Function: Create user role on auth.users insert
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -----------------------------------------------------------------------------
-- Function: Check if user is admin
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION is_admin(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = check_user_id AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -----------------------------------------------------------------------------
-- Function: Get current user's role
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
DECLARE
    user_role_value user_role;
BEGIN
    SELECT role INTO user_role_value
    FROM user_roles
    WHERE user_id = auth.uid();

    RETURN COALESCE(user_role_value, 'user');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -----------------------------------------------------------------------------
-- Function: Approve endpoint request
-- Atomically creates endpoint and updates request status
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION approve_endpoint_request(request_id UUID)
RETURNS UUID AS $$
DECLARE
    new_endpoint_id UUID;
    request_record endpoint_requests%ROWTYPE;
BEGIN
    -- Verify caller is admin
    IF NOT is_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Unauthorized: Admin access required';
    END IF;

    -- Get the request
    SELECT * INTO request_record
    FROM endpoint_requests
    WHERE id = request_id AND request_status = 'pending';

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Request not found or not pending';
    END IF;

    -- Create the endpoint
    INSERT INTO endpoints (
        icon_url, company, title, description,
        protocol, address, ports, created_by
    ) VALUES (
        request_record.icon_url,
        request_record.company,
        request_record.title,
        request_record.description,
        request_record.protocol,
        request_record.address,
        request_record.ports,
        request_record.submitted_by
    ) RETURNING id INTO new_endpoint_id;

    -- Copy tags from request to endpoint
    INSERT INTO endpoint_tags (endpoint_id, tag_id)
    SELECT new_endpoint_id, tag_id
    FROM endpoint_request_tags
    WHERE request_id = request_record.id;

    -- Update request status
    UPDATE endpoint_requests
    SET
        request_status = 'approved',
        reviewed_by = auth.uid(),
        reviewed_at = NOW(),
        updated_at = NOW()
    WHERE id = request_id;

    RETURN new_endpoint_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -----------------------------------------------------------------------------
-- Function: Reject endpoint request
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION reject_endpoint_request(request_id UUID)
RETURNS VOID AS $$
BEGIN
    -- Verify caller is admin
    IF NOT is_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Unauthorized: Admin access required';
    END IF;

    UPDATE endpoint_requests
    SET
        request_status = 'rejected',
        reviewed_by = auth.uid(),
        reviewed_at = NOW(),
        updated_at = NOW()
    WHERE id = request_id AND request_status = 'pending';

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Request not found or not pending';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Auto-update updated_at on endpoints
CREATE TRIGGER update_endpoints_updated_at
    BEFORE UPDATE ON endpoints
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at on endpoint_requests
CREATE TRIGGER update_endpoint_requests_updated_at
    BEFORE UPDATE ON endpoint_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at on user_roles
CREATE TRIGGER update_user_roles_updated_at
    BEFORE UPDATE ON user_roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create user role on new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- =============================================================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE endpoint_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE endpoint_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE endpoint_request_tags ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- User Roles Policies
-- -----------------------------------------------------------------------------

-- Users can read their own role
CREATE POLICY "Users can view own role"
    ON user_roles FOR SELECT
    USING (auth.uid() = user_id);

-- Admins can view all roles
CREATE POLICY "Admins can view all roles"
    ON user_roles FOR SELECT
    USING (is_admin(auth.uid()));

-- Only admins can update roles
CREATE POLICY "Admins can update roles"
    ON user_roles FOR UPDATE
    USING (is_admin(auth.uid()));

-- -----------------------------------------------------------------------------
-- Tags Policies
-- -----------------------------------------------------------------------------

-- Everyone can read tags (public)
CREATE POLICY "Tags are viewable by everyone"
    ON tags FOR SELECT
    USING (true);

-- Only admins can insert tags
CREATE POLICY "Admins can insert tags"
    ON tags FOR INSERT
    WITH CHECK (is_admin(auth.uid()));

-- Only admins can update tags
CREATE POLICY "Admins can update tags"
    ON tags FOR UPDATE
    USING (is_admin(auth.uid()));

-- Only admins can delete tags
CREATE POLICY "Admins can delete tags"
    ON tags FOR DELETE
    USING (is_admin(auth.uid()));

-- -----------------------------------------------------------------------------
-- Endpoints Policies
-- -----------------------------------------------------------------------------

-- Public: Everyone can view active endpoints
CREATE POLICY "Active endpoints are viewable by everyone"
    ON endpoints FOR SELECT
    USING (status = 'active');

-- Admins can view all endpoints regardless of status
CREATE POLICY "Admins can view all endpoints"
    ON endpoints FOR SELECT
    USING (is_admin(auth.uid()));

-- Only admins can insert endpoints directly
CREATE POLICY "Admins can insert endpoints"
    ON endpoints FOR INSERT
    WITH CHECK (is_admin(auth.uid()));

-- Only admins can update endpoints
CREATE POLICY "Admins can update endpoints"
    ON endpoints FOR UPDATE
    USING (is_admin(auth.uid()));

-- Only admins can delete endpoints
CREATE POLICY "Admins can delete endpoints"
    ON endpoints FOR DELETE
    USING (is_admin(auth.uid()));

-- -----------------------------------------------------------------------------
-- Endpoint Tags Policies
-- -----------------------------------------------------------------------------

-- Everyone can read endpoint tags (for filtering)
CREATE POLICY "Endpoint tags are viewable by everyone"
    ON endpoint_tags FOR SELECT
    USING (true);

-- Only admins can manage endpoint tags
CREATE POLICY "Admins can insert endpoint tags"
    ON endpoint_tags FOR INSERT
    WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can delete endpoint tags"
    ON endpoint_tags FOR DELETE
    USING (is_admin(auth.uid()));

-- -----------------------------------------------------------------------------
-- Endpoint Requests Policies
-- -----------------------------------------------------------------------------

-- Users can view their own requests
CREATE POLICY "Users can view own requests"
    ON endpoint_requests FOR SELECT
    USING (auth.uid() = submitted_by);

-- Admins can view all requests
CREATE POLICY "Admins can view all requests"
    ON endpoint_requests FOR SELECT
    USING (is_admin(auth.uid()));

-- Authenticated users can insert requests
CREATE POLICY "Authenticated users can submit requests"
    ON endpoint_requests FOR INSERT
    WITH CHECK (
        auth.uid() IS NOT NULL AND
        auth.uid() = submitted_by AND
        request_status = 'pending'
    );

-- Users cannot update their requests (must resubmit)
-- Admins can update request status
CREATE POLICY "Admins can update requests"
    ON endpoint_requests FOR UPDATE
    USING (is_admin(auth.uid()));

-- Users can delete their own pending requests
CREATE POLICY "Users can delete own pending requests"
    ON endpoint_requests FOR DELETE
    USING (
        auth.uid() = submitted_by AND
        request_status = 'pending'
    );

-- -----------------------------------------------------------------------------
-- Endpoint Request Tags Policies
-- -----------------------------------------------------------------------------

-- Users can view tags on their own requests
CREATE POLICY "Users can view own request tags"
    ON endpoint_request_tags FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM endpoint_requests
            WHERE id = request_id AND submitted_by = auth.uid()
        )
    );

-- Admins can view all request tags
CREATE POLICY "Admins can view all request tags"
    ON endpoint_request_tags FOR SELECT
    USING (is_admin(auth.uid()));

-- Authenticated users can add tags to their own requests
CREATE POLICY "Users can add tags to own requests"
    ON endpoint_request_tags FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM endpoint_requests
            WHERE id = request_id
            AND submitted_by = auth.uid()
            AND request_status = 'pending'
        )
    );

-- Users can remove tags from their own pending requests
CREATE POLICY "Users can remove tags from own pending requests"
    ON endpoint_request_tags FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM endpoint_requests
            WHERE id = request_id
            AND submitted_by = auth.uid()
            AND request_status = 'pending'
        )
    );

-- =============================================================================
-- SEED DATA
-- =============================================================================

-- Insert default tags (service categories)
INSERT INTO tags (name, slug, color) VALUES
    ('Authentication', 'authentication', '#ef4444'),
    ('Payments', 'payments', '#22c55e'),
    ('Analytics', 'analytics', '#3b82f6'),
    ('Storage', 'storage', '#f59e0b'),
    ('Communication', 'communication', '#8b5cf6'),
    ('AI/ML', 'ai-ml', '#ec4899'),
    ('Database', 'database', '#06b6d4'),
    ('DevOps', 'devops', '#84cc16'),
    ('Security', 'security', '#f97316'),
    ('Maps & Location', 'maps-location', '#14b8a6');

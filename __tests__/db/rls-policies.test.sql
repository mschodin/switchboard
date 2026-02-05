-- =============================================================================
-- RLS POLICY TESTS FOR SWITCHBOARD
-- Tests Row Level Security policies to ensure proper data access control
-- =============================================================================

BEGIN;

-- Load pgTAP extension
CREATE EXTENSION IF NOT EXISTS pgtap;

-- Set up test plan
SELECT plan(15);

-- =============================================================================
-- TEST SETUP
-- =============================================================================

-- Create test users
INSERT INTO auth.users (id, email, created_at)
VALUES
    ('test-user-1', 'user1@example.com', NOW()),
    ('test-user-2', 'user2@example.com', NOW()),
    ('test-admin-1', 'admin1@example.com', NOW());

-- Assign roles
INSERT INTO user_roles (user_id, role)
VALUES
    ('test-user-1', 'user'),
    ('test-user-2', 'user'),
    ('test-admin-1', 'admin');

-- Create test tags
INSERT INTO tags (id, name, slug, color)
VALUES
    ('tag-1', 'Test Tag 1', 'test-tag-1', '#000000'),
    ('tag-2', 'Test Tag 2', 'test-tag-2', '#ffffff');

-- Create test endpoints
INSERT INTO endpoints (id, company, title, address, status, created_by)
VALUES
    ('endpoint-active-1', 'Company A', 'Active Endpoint', 'https://a.com', 'active', 'test-user-1'),
    ('endpoint-inactive-1', 'Company B', 'Inactive Endpoint', 'https://b.com', 'inactive', 'test-user-1'),
    ('endpoint-active-2', 'Company C', 'Another Active', 'https://c.com', 'active', 'test-user-2');

-- Create test endpoint requests
INSERT INTO endpoint_requests (id, company, title, address, request_status, submitted_by)
VALUES
    ('request-pending-1', 'Company X', 'Pending Request 1', 'https://x.com', 'pending', 'test-user-1'),
    ('request-pending-2', 'Company Y', 'Pending Request 2', 'https://y.com', 'pending', 'test-user-2'),
    ('request-approved-1', 'Company Z', 'Approved Request', 'https://z.com', 'approved', 'test-user-1');

-- =============================================================================
-- ENDPOINTS TABLE - PUBLIC ACCESS
-- =============================================================================

-- Test 1: Unauthenticated users can see only active endpoints
-- Story SWB-001 AC5: Given RLS policies, When unauthenticated user queries endpoints,
-- Then only rows with status 'active' are returned
SET ROLE TO anonymous;
SELECT results_eq(
    'SELECT id FROM endpoints WHERE status = ''active'' ORDER BY id',
    $$VALUES ('endpoint-active-1'::uuid), ('endpoint-active-2'::uuid)$$,
    'Unauthenticated users should see only active endpoints'
);
RESET ROLE;

-- Test 2: Unauthenticated users cannot see inactive endpoints
SET ROLE TO anonymous;
SELECT is_empty(
    'SELECT id FROM endpoints WHERE status = ''inactive''',
    'Unauthenticated users should not see inactive endpoints'
);
RESET ROLE;

-- Test 3: Unauthenticated users cannot insert endpoints
SET ROLE TO anonymous;
SELECT throws_ok(
    $$INSERT INTO endpoints (company, title, address) VALUES ('Test', 'Test', 'https://test.com')$$,
    'Unauthenticated users should not be able to insert endpoints'
);
RESET ROLE;

-- =============================================================================
-- ENDPOINTS TABLE - ADMIN ACCESS
-- =============================================================================

-- Test 4: Admins can see all endpoints regardless of status
-- Story SWB-001 AC6: Given RLS policies, When admin queries endpoints,
-- Then all endpoints visible
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" TO '{"sub": "test-admin-1"}';
SELECT results_eq(
    'SELECT id FROM endpoints ORDER BY id',
    $$VALUES ('endpoint-active-1'::uuid), ('endpoint-active-2'::uuid), ('endpoint-inactive-1'::uuid)$$,
    'Admins should see all endpoints including inactive'
);
RESET ROLE;

-- Test 5: Admins can insert endpoints
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" TO '{"sub": "test-admin-1"}';
SELECT lives_ok(
    $$INSERT INTO endpoints (company, title, address) VALUES ('Admin Test', 'Admin Endpoint', 'https://admin.com')$$,
    'Admins should be able to insert endpoints'
);
RESET ROLE;

-- Test 6: Admins can update endpoints
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" TO '{"sub": "test-admin-1"}';
SELECT lives_ok(
    $$UPDATE endpoints SET status = 'deprecated' WHERE id = 'endpoint-active-1'$$,
    'Admins should be able to update endpoint status'
);
RESET ROLE;

-- Test 7: Admins can delete endpoints
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" TO '{"sub": "test-admin-1"}';
SELECT lives_ok(
    $$DELETE FROM endpoints WHERE company = 'Admin Test'$$,
    'Admins should be able to delete endpoints'
);
RESET ROLE;

-- =============================================================================
-- ENDPOINT_REQUESTS TABLE - USER ACCESS
-- =============================================================================

-- Test 8: Users can see only their own requests
-- Story SWB-011: User sees their submissions
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" TO '{"sub": "test-user-1"}';
SELECT results_eq(
    'SELECT id FROM endpoint_requests ORDER BY id',
    $$VALUES ('request-approved-1'::uuid), ('request-pending-1'::uuid)$$,
    'Users should see only their own endpoint requests'
);
RESET ROLE;

-- Test 9: Users cannot see other users' requests
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" TO '{"sub": "test-user-1"}';
SELECT is_empty(
    $$SELECT id FROM endpoint_requests WHERE submitted_by = 'test-user-2'$$,
    'Users should not see other users requests'
);
RESET ROLE;

-- Test 10: Authenticated users can submit requests
-- Story SWB-010 AC4: Valid submission creates endpoint_request
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" TO '{"sub": "test-user-1"}';
SELECT lives_ok(
    $$INSERT INTO endpoint_requests (company, title, address, submitted_by, request_status)
      VALUES ('New Company', 'New Endpoint', 'https://new.com', 'test-user-1', 'pending')$$,
    'Authenticated users should be able to submit endpoint requests'
);
RESET ROLE;

-- Test 11: Users can only submit with status 'pending'
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" TO '{"sub": "test-user-1"}';
SELECT throws_ok(
    $$INSERT INTO endpoint_requests (company, title, address, submitted_by, request_status)
      VALUES ('Hack', 'Hack', 'https://hack.com', 'test-user-1', 'approved')$$,
    'Users should not be able to submit with status other than pending'
);
RESET ROLE;

-- =============================================================================
-- ENDPOINT_REQUESTS TABLE - ADMIN ACCESS
-- =============================================================================

-- Test 12: Admins can see all endpoint requests
-- Story SWB-012 AC1: Admin sees all pending requests
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" TO '{"sub": "test-admin-1"}';
SELECT ok(
    (SELECT COUNT(*) FROM endpoint_requests) >= 3,
    'Admins should see all endpoint requests'
);
RESET ROLE;

-- Test 13: Admins can update request status
-- Story SWB-012 AC4: Admin approves request
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" TO '{"sub": "test-admin-1"}';
SELECT lives_ok(
    $$UPDATE endpoint_requests SET request_status = 'approved', reviewed_by = 'test-admin-1'
      WHERE id = 'request-pending-1'$$,
    'Admins should be able to update request status'
);
RESET ROLE;

-- =============================================================================
-- USER_ROLES TABLE - ACCESS CONTROL
-- =============================================================================

-- Test 14: Users can view their own role
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" TO '{"sub": "test-user-1"}';
SELECT results_eq(
    'SELECT role FROM user_roles WHERE user_id = ''test-user-1''',
    $$VALUES ('user'::user_role)$$,
    'Users should be able to view their own role'
);
RESET ROLE;

-- Test 15: Regular users cannot update roles
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" TO '{"sub": "test-user-1"}';
SELECT throws_ok(
    $$UPDATE user_roles SET role = 'admin' WHERE user_id = 'test-user-1'$$,
    'Regular users should not be able to update roles'
);
RESET ROLE;

-- =============================================================================
-- CLEANUP
-- =============================================================================

-- Finish tests and rollback
SELECT finish();
ROLLBACK;

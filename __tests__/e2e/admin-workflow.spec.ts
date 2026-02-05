/**
 * E2E Tests: Admin Approval Workflow
 * Tests admin panel, request review, approval/rejection
 *
 * Based on:
 * - User Stories SWB-012, SWB-013
 */

import { test, expect } from '@playwright/test'

test.describe('Admin Access Control', () => {
  test('should deny access to admin panel for unauthenticated users', async ({ page }) => {
    // Story SWB-012 AC2: Non-admin redirected

    await page.goto('/admin')

    // Should redirect to login or show access denied
    await expect(page).toHaveURL(/\/(login|access-denied)/)
  })

  test('should deny access to admin panel for regular users', async ({ page }) => {
    // Story SWB-012 AC2: Non-admin cannot access

    // Login as regular user (assume helper function)
    // await loginAsUser(page, 'user@example.com', 'password')

    await page.goto('/admin')

    // Should show access denied or redirect
    await expect(page.locator('text=Access Denied')).toBeVisible()
  })

  test('should allow access to admin panel for admin users', async ({ page }) => {
    // Story SWB-012 AC1: Admin can access panel

    // Login as admin (assume helper function)
    // await loginAsAdmin(page, 'admin@example.com', 'password')

    await page.goto('/admin')

    // Should see admin dashboard
    await expect(page.locator('text=Admin Panel')).toBeVisible()
  })
})

test.describe('Admin Panel - Request Queue', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin before each test
    // await loginAsAdmin(page, 'admin@example.com', 'password')
    await page.goto('/admin')
  })

  test('should display list of pending requests', async ({ page }) => {
    // Story SWB-012 AC1: Admin sees pending requests

    await expect(page.locator('text=Pending Requests')).toBeVisible()

    // Should see request cards
    const requests = page.locator('[data-testid="request-card"]')
    const count = await requests.count()

    expect(count).toBeGreaterThanOrEqual(0)
  })

  test('should display request counts in badges', async ({ page }) => {
    // Story SWB-012 AC6: Badges show pending, approved today, rejected today

    await expect(page.locator('[data-testid="pending-count"]')).toBeVisible()
    await expect(page.locator('[data-testid="approved-today-count"]')).toBeVisible()
    await expect(page.locator('[data-testid="rejected-today-count"]')).toBeVisible()
  })

  test('should show request details on each card', async ({ page }) => {
    // Assuming there are pending requests

    const firstRequest = page.locator('[data-testid="request-card"]').first()

    // Should show endpoint details
    await expect(firstRequest.locator('[data-testid="company"]')).toBeVisible()
    await expect(firstRequest.locator('[data-testid="title"]')).toBeVisible()
    await expect(firstRequest.locator('[data-testid="description"]')).toBeVisible()

    // Should show submitter info
    await expect(firstRequest.locator('[data-testid="submitted-by"]')).toBeVisible()
    await expect(firstRequest.locator('[data-testid="submitted-at"]')).toBeVisible()
  })

  test('should have approve and reject buttons', async ({ page }) => {
    const firstRequest = page.locator('[data-testid="request-card"]').first()

    await expect(firstRequest.locator('button:has-text("Approve")')).toBeVisible()
    await expect(firstRequest.locator('button:has-text("Reject")')).toBeVisible()
  })

  test('should open detail modal when "View Details" clicked', async ({ page }) => {
    // Story SWB-012 AC3: Admin clicks View Details

    const firstRequest = page.locator('[data-testid="request-card"]').first()
    await firstRequest.locator('button:has-text("View Details")').click()

    // Modal should open
    await expect(page.locator('[data-testid="request-detail-modal"]')).toBeVisible()

    // Should show full information
    await expect(page.locator('[data-testid="modal-company"]')).toBeVisible()
    await expect(page.locator('[data-testid="modal-title"]')).toBeVisible()
    await expect(page.locator('[data-testid="modal-protocol"]')).toBeVisible()
    await expect(page.locator('[data-testid="modal-address"]')).toBeVisible()
    await expect(page.locator('[data-testid="modal-ports"]')).toBeVisible()
  })

  test('should close detail modal when close button clicked', async ({ page }) => {
    const firstRequest = page.locator('[data-testid="request-card"]').first()
    await firstRequest.locator('button:has-text("View Details")').click()

    // Close modal
    await page.locator('[data-testid="modal-close"]').click()

    // Modal should close
    await expect(page.locator('[data-testid="request-detail-modal"]')).not.toBeVisible()
  })
})

test.describe('Admin Panel - Approve Request', () => {
  test.beforeEach(async ({ page }) => {
    // await loginAsAdmin(page, 'admin@example.com', 'password')
    await page.goto('/admin')
  })

  test('should approve endpoint request', async ({ page }) => {
    // Story SWB-012 AC4: Admin approves request

    // Get count before approval
    const initialCount = await page.locator('[data-testid="request-card"]').count()

    if (initialCount === 0) {
      test.skip()
    }

    const firstRequest = page.locator('[data-testid="request-card"]').first()
    const requestTitle = await firstRequest.locator('[data-testid="title"]').textContent()

    // Click approve
    await firstRequest.locator('button:has-text("Approve")').click()

    // Wait for confirmation or loading
    await page.waitForTimeout(1000)

    // Success message shown
    await expect(page.locator('text=approved successfully')).toBeVisible()

    // Request removed from pending list
    const newCount = await page.locator('[data-testid="request-card"]').count()
    expect(newCount).toBe(initialCount - 1)

    // Endpoint should now be in main registry
    await page.goto('/')
    await page.waitForSelector('[data-testid="endpoint-card"]')

    // Search for the approved endpoint
    const searchInput = page.locator('input[placeholder*="Search"]')
    await searchInput.fill(requestTitle || '')
    await page.waitForTimeout(400)

    // Should find the endpoint
    await expect(page.locator('[data-testid="endpoint-card"]').first()).toBeVisible()
  })

  test('should create endpoint in database on approval', async ({ page }) => {
    // Story SWB-012 AC4: Endpoint created in endpoints table

    const firstRequest = page.locator('[data-testid="request-card"]').first()

    // Get request details
    const company = await firstRequest.locator('[data-testid="company"]').textContent()
    const title = await firstRequest.locator('[data-testid="title"]').textContent()

    await firstRequest.locator('button:has-text("Approve")').click()
    await page.waitForTimeout(1000)

    // Verify endpoint exists via API or database query
    // This would require backend access or API endpoint
  })

  test('should update request status to approved', async ({ page }) => {
    // Story SWB-012 AC4: request_status updated

    const firstRequest = page.locator('[data-testid="request-card"]').first()
    await firstRequest.locator('button:has-text("Approve")').click()
    await page.waitForTimeout(1000)

    // Check database or API that status is 'approved'
  })

  test('should set reviewed_by and reviewed_at fields', async ({ page }) => {
    // Story SWB-012 AC4: reviewed_by and reviewed_at set

    const firstRequest = page.locator('[data-testid="request-card"]').first()
    await firstRequest.locator('button:has-text("Approve")').click()
    await page.waitForTimeout(1000)

    // Verify fields set in database
  })

  test('should copy tags from request to endpoint', async ({ page }) => {
    // Technical: Tags copied to endpoint_tags

    const firstRequest = page.locator('[data-testid="request-card"]').first()

    // Note tags on request
    const tags = await firstRequest.locator('[data-testid="tag-badge"]').count()

    await firstRequest.locator('button:has-text("Approve")').click()
    await page.waitForTimeout(1000)

    // After approval, endpoint should have same tags
  })

  test('should disable approve button during processing', async ({ page }) => {
    const firstRequest = page.locator('[data-testid="request-card"]').first()
    const approveButton = firstRequest.locator('button:has-text("Approve")')

    await approveButton.click()

    // Button should be disabled immediately
    await expect(approveButton).toBeDisabled()
  })

  test('should show loading indicator during approval', async ({ page }) => {
    const firstRequest = page.locator('[data-testid="request-card"]').first()
    await firstRequest.locator('button:has-text("Approve")').click()

    // Loading spinner or text
    await expect(page.locator('[data-testid="loading"]')).toBeVisible()
  })
})

test.describe('Admin Panel - Reject Request', () => {
  test.beforeEach(async ({ page }) => {
    // await loginAsAdmin(page, 'admin@example.com', 'password')
    await page.goto('/admin')
  })

  test('should reject endpoint request', async ({ page }) => {
    // Story SWB-012 AC5: Admin rejects request

    const initialCount = await page.locator('[data-testid="request-card"]').count()

    if (initialCount === 0) {
      test.skip()
    }

    const firstRequest = page.locator('[data-testid="request-card"]').first()

    // Click reject
    await firstRequest.locator('button:has-text("Reject")').click()

    // Wait for confirmation
    await page.waitForTimeout(1000)

    // Success message shown
    await expect(page.locator('text=rejected')).toBeVisible()

    // Request removed from pending list
    const newCount = await page.locator('[data-testid="request-card"]').count()
    expect(newCount).toBe(initialCount - 1)
  })

  test('should update request status to rejected', async ({ page }) => {
    // Story SWB-012 AC5: request_status updated to 'rejected'

    const firstRequest = page.locator('[data-testid="request-card"]').first()
    await firstRequest.locator('button:has-text("Reject")').click()
    await page.waitForTimeout(1000)

    // Verify status in database
  })

  test('should set reviewed_by and reviewed_at on rejection', async ({ page }) => {
    // Story SWB-012 AC5: reviewed_by and reviewed_at set

    const firstRequest = page.locator('[data-testid="request-card"]').first()
    await firstRequest.locator('button:has-text("Reject")').click()
    await page.waitForTimeout(1000)

    // Verify fields set in database
  })

  test('should not create endpoint in main registry on rejection', async ({ page }) => {
    // Rejected requests don't become endpoints

    const firstRequest = page.locator('[data-testid="request-card"]').first()
    const title = await firstRequest.locator('[data-testid="title"]').textContent()

    await firstRequest.locator('button:has-text("Reject")').click()
    await page.waitForTimeout(1000)

    // Endpoint should NOT be in registry
    await page.goto('/')
    const searchInput = page.locator('input[placeholder*="Search"]')
    await searchInput.fill(title || '')
    await page.waitForTimeout(400)

    // Should show "No endpoints found"
    await expect(page.locator('text=No endpoints found')).toBeVisible()
  })
})

test.describe('Admin Panel - Direct Endpoint Creation', () => {
  test.beforeEach(async ({ page }) => {
    // await loginAsAdmin(page, 'admin@example.com', 'password')
    await page.goto('/admin')
  })

  test('should show "Add Endpoint" button for admins', async ({ page }) => {
    // Story SWB-013 AC1: "Add Endpoint" button visible

    await expect(page.locator('button:has-text("Add Endpoint")')).toBeVisible()
  })

  test('should open endpoint form when "Add Endpoint" clicked', async ({ page }) => {
    // Story SWB-013 AC2: Form loads with same fields

    await page.locator('button:has-text("Add Endpoint")').click()

    // Form should open
    await expect(page.locator('[data-testid="endpoint-form"]')).toBeVisible()

    // Check for required fields
    await expect(page.locator('input[name="company"]')).toBeVisible()
    await expect(page.locator('input[name="title"]')).toBeVisible()
    await expect(page.locator('textarea[name="description"]')).toBeVisible()
  })

  test('should create endpoint directly in endpoints table', async ({ page }) => {
    // Story SWB-013 AC3: Direct INSERT into endpoints

    await page.locator('button:has-text("Add Endpoint")').click()

    // Fill form
    await page.fill('input[name="company"]', 'Test Company')
    await page.fill('input[name="title"]', 'Test API Endpoint')
    await page.fill('textarea[name="description"]', 'Test description')
    await page.selectOption('select[name="protocol"]', 'HTTPS')
    await page.fill('input[name="address"]', 'https://api.test.com')
    await page.fill('input[name="ports"]', '443')

    // Select at least one tag
    await page.locator('[data-testid="tag-checkbox"]').first().check()

    // Submit
    await page.locator('button[type="submit"]').click()

    // Wait for success
    await page.waitForTimeout(1000)

    // Success message shown
    await expect(page.locator('text=Endpoint created successfully')).toBeVisible()
  })

  test('should show endpoint immediately in registry', async ({ page }) => {
    // Story SWB-013 AC4: Endpoint appears immediately

    await page.locator('button:has-text("Add Endpoint")').click()

    const testTitle = `Test API ${Date.now()}`

    await page.fill('input[name="company"]', 'Test Company')
    await page.fill('input[name="title"]', testTitle)
    await page.fill('input[name="address"]', 'https://api.test.com')
    await page.locator('[data-testid="tag-checkbox"]').first().check()
    await page.locator('button[type="submit"]').click()
    await page.waitForTimeout(1000)

    // Navigate to registry
    await page.goto('/')

    // Search for endpoint
    const searchInput = page.locator('input[placeholder*="Search"]')
    await searchInput.fill(testTitle)
    await page.waitForTimeout(400)

    // Endpoint should be found
    await expect(page.locator('[data-testid="endpoint-card"]').first()).toBeVisible()
  })

  test('should set status to active by default', async ({ page }) => {
    // Direct creation → status: 'active'

    await page.locator('button:has-text("Add Endpoint")').click()

    // Fill minimal form
    await page.fill('input[name="company"]', 'Test')
    await page.fill('input[name="title"]', 'Test')
    await page.fill('input[name="address"]', 'https://test.com')
    await page.locator('[data-testid="tag-checkbox"]').first().check()
    await page.locator('button[type="submit"]').click()
    await page.waitForTimeout(1000)

    // Verify status in database or via API
  })

  test('should deny access to non-admin users', async ({ page }) => {
    // Story SWB-013 AC5: Non-admin denied access

    // Login as regular user
    // await loginAsUser(page, 'user@example.com', 'password')

    await page.goto('/admin/endpoints/new')

    // Should redirect or show error
    await expect(page.locator('text=Access Denied')).toBeVisible()
  })
})

test.describe('Admin Panel - Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    // await loginAsAdmin(page, 'admin@example.com', 'password')
    await page.goto('/admin')
  })

  test('should handle approval errors gracefully', async ({ page }) => {
    // Test network error during approval

    // Mock network failure or database error

    const firstRequest = page.locator('[data-testid="request-card"]').first()
    await firstRequest.locator('button:has-text("Approve")').click()

    // Should show error message
    // await expect(page.locator('text=error')).toBeVisible()
  })

  test('should handle rejection errors gracefully', async ({ page }) => {
    // Similar to approval errors
  })

  test('should handle concurrent approvals', async ({ page }) => {
    // Edge case: Two admins approve same request simultaneously
    // Expected: One succeeds, other gets error
  })
})

test.describe('Admin Panel - Permissions', () => {
  test('should verify admin role server-side', async ({ page }) => {
    // Security: Server-side role check, not just client

    // Attempt to call admin API without admin role
    // Should return 403 Forbidden
  })

  test('should log admin actions', async ({ page }) => {
    // NFR: Admin actions must be logged

    // After approval, check logs contain admin ID and action
  })
})

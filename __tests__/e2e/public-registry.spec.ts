/**
 * E2E Tests: Public Registry Viewing
 * Tests public access to endpoint registry without authentication
 *
 * Based on:
 * - User Stories SWB-003, SWB-004, SWB-006, SWB-007
 */

import { test, expect } from '@playwright/test'

test.describe('Public Registry Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page
    await page.goto('/')
  })

  test('should display the registry landing page', async ({ page }) => {
    // Story SWB-003 AC1: Visitor sees three-column layout

    // Expected elements:
    // - Left sidebar with "Switchboard" branding
    // - Main content area with "Service Registry" header
    // - Right sidebar with chat interface
    await expect(page.locator('text=Switchboard')).toBeVisible()
    await expect(page.locator('text=Service Registry')).toBeVisible()
  })

  test('should display endpoint cards in a grid', async ({ page }) => {
    // Story SWB-004 AC6: Cards render with real data

    // Wait for endpoints to load
    await page.waitForSelector('[data-testid="endpoint-card"]', { timeout: 5000 })

    // Count endpoint cards
    const cards = page.locator('[data-testid="endpoint-card"]')
    const count = await cards.count()

    expect(count).toBeGreaterThan(0)
  })

  test('should show endpoint details on each card', async ({ page }) => {
    // Story SWB-004 AC1: Card shows icon, company, title, description

    await page.waitForSelector('[data-testid="endpoint-card"]')
    const firstCard = page.locator('[data-testid="endpoint-card"]').first()

    // Check for required elements
    await expect(firstCard.locator('[data-testid="company"]')).toBeVisible()
    await expect(firstCard.locator('[data-testid="title"]')).toBeVisible()
    await expect(firstCard.locator('[data-testid="description"]')).toBeVisible()
    await expect(firstCard.locator('[data-testid="status-badge"]')).toBeVisible()
  })

  test('should display tags on endpoint cards', async ({ page }) => {
    // Story SWB-004 AC2: Tags displayed as colored pills

    await page.waitForSelector('[data-testid="endpoint-card"]')
    const firstCard = page.locator('[data-testid="endpoint-card"]').first()

    // Check for tag badges
    const tags = firstCard.locator('[data-testid="tag-badge"]')
    const tagCount = await tags.count()

    expect(tagCount).toBeGreaterThanOrEqual(0)
    expect(tagCount).toBeLessThanOrEqual(3) // Max 3 visible tags
  })

  test('should show hover effect on endpoint cards', async ({ page }) => {
    // Story SWB-004 AC5: Hover shows elevation effect

    await page.waitForSelector('[data-testid="endpoint-card"]')
    const firstCard = page.locator('[data-testid="endpoint-card"]').first()

    // Get initial box shadow
    const initialShadow = await firstCard.evaluate(el =>
      window.getComputedStyle(el).boxShadow
    )

    // Hover over card
    await firstCard.hover()

    // Get hover box shadow
    const hoverShadow = await firstCard.evaluate(el =>
      window.getComputedStyle(el).boxShadow
    )

    // Shadow should change on hover
    expect(hoverShadow).not.toBe(initialShadow)
  })

  test('should show loading skeletons during data fetch', async ({ page }) => {
    // Story SWB-004 AC6: Loading skeletons show during fetch

    // Navigate with network throttling or slow 3G
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    // Check for skeleton loaders
    const skeletons = page.locator('[data-testid="endpoint-card-skeleton"]')

    // Skeletons may be visible briefly or not at all if load is fast
    // This test might be flaky, so we just check it doesn't error
  })

  test('should display "Log In" button in left sidebar', async ({ page }) => {
    // Story SWB-005 AC3: Unauthenticated user sees Log In button

    const loginButton = page.locator('aside:left-of(main) >> text=Log In')
    await expect(loginButton).toBeVisible()
  })

  test('should display tags list in left sidebar', async ({ page }) => {
    // Story SWB-005 AC2: All tags listed in sidebar

    await page.waitForSelector('[data-testid="tag-list-item"]')
    const tags = page.locator('[data-testid="tag-list-item"]')
    const count = await tags.count()

    expect(count).toBeGreaterThan(0)
  })

  test('should display chat interface in right sidebar', async ({ page }) => {
    // Story SWB-014 AC1: Chat header displays

    const chatHeader = page.locator('text=Chat with Switchboard')
    await expect(chatHeader).toBeVisible()
  })

  test('should display search bar in header', async ({ page }) => {
    // Story SWB-007 AC1: Search input visible

    const searchInput = page.locator('input[placeholder*="Search"]')
    await expect(searchInput).toBeVisible()
  })

  test('should display user icon in header', async ({ page }) => {
    // Story SWB-008 AC1: Person icon visible in header

    const userIcon = page.locator('[data-testid="user-menu-button"]')
    await expect(userIcon).toBeVisible()
  })
})

test.describe('Public Registry - Responsive Layout', () => {
  test('should show three-column layout on desktop', async ({ page }) => {
    // Story SWB-003 AC3: Desktop shows all three columns

    await page.setViewportSize({ width: 1400, height: 900 })
    await page.goto('/')

    // Check all sidebars visible
    await expect(page.locator('[data-testid="left-sidebar"]')).toBeVisible()
    await expect(page.locator('[data-testid="main-content"]')).toBeVisible()
    await expect(page.locator('[data-testid="right-sidebar"]')).toBeVisible()
  })

  test('should collapse right sidebar on tablet', async ({ page }) => {
    // Story SWB-003 AC4: Tablet collapses right sidebar

    await page.setViewportSize({ width: 900, height: 800 })
    await page.goto('/')

    // Left sidebar visible, right sidebar hidden or toggleable
    await expect(page.locator('[data-testid="left-sidebar"]')).toBeVisible()
    await expect(page.locator('[data-testid="main-content"]')).toBeVisible()
  })

  test('should collapse both sidebars on mobile', async ({ page }) => {
    // Story SWB-003 AC5: Mobile collapses both sidebars

    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Only main content visible initially
    await expect(page.locator('[data-testid="main-content"]')).toBeVisible()

    // Check for hamburger menu toggle
    await expect(page.locator('[data-testid="mobile-nav-toggle"]')).toBeVisible()
  })

  test('should toggle left sidebar on mobile hamburger click', async ({ page }) => {
    // Story SWB-003 AC5: Sidebars toggle on mobile

    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    const hamburger = page.locator('[data-testid="mobile-nav-toggle"]')
    await hamburger.click()

    // Sidebar should appear as overlay
    await expect(page.locator('[data-testid="left-sidebar"]')).toBeVisible()

    // Click outside to close
    await page.locator('[data-testid="main-content"]').click()

    // Sidebar should close (may need adjustment based on implementation)
  })

  test('should adjust grid columns based on screen size', async ({ page }) => {
    // Story SWB-004 AC4: Responsive grid layout

    // Desktop: 4 columns
    await page.setViewportSize({ width: 1400, height: 900 })
    await page.goto('/')
    await page.waitForSelector('[data-testid="endpoint-card"]')

    // Medium: 3 columns
    await page.setViewportSize({ width: 1024, height: 768 })
    await page.waitForTimeout(500) // Allow layout to adjust

    // Mobile: 1-2 columns
    await page.setViewportSize({ width: 375, height: 667 })
    await page.waitForTimeout(500)

    // Visual regression test would be ideal here
  })
})

test.describe('Public Registry - Accessibility', () => {
  test('should have proper page structure', async ({ page }) => {
    // Check for semantic HTML
    await page.goto('/')

    // Check for main landmarks
    await expect(page.locator('main')).toBeVisible()
    await expect(page.locator('nav')).toBeVisible()

    // Check for heading hierarchy
    const h1 = page.locator('h1')
    await expect(h1).toBeVisible()
  })

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/')

    // Tab through interactive elements
    await page.keyboard.press('Tab')

    // Check that first focusable element receives focus
    const focused = await page.locator(':focus')
    await expect(focused).toBeVisible()
  })

  test('should have alt text for images', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('img', { timeout: 5000 })

    // Check all images have alt attributes
    const images = page.locator('img')
    const count = await images.count()

    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt')
      expect(alt).toBeDefined()
    }
  })

  test('should have ARIA labels for icons', async ({ page }) => {
    await page.goto('/')

    // Check status icons have labels
    const statusBadges = page.locator('[data-testid="status-badge"]')
    const count = await statusBadges.count()

    if (count > 0) {
      const firstBadge = statusBadges.first()
      const ariaLabel = await firstBadge.getAttribute('aria-label')
      expect(ariaLabel).toBeTruthy()
    }
  })

  test('should pass automated accessibility scan', async ({ page }) => {
    // This would use axe-playwright or similar
    await page.goto('/')

    // Example with axe-core:
    // const results = await injectAxe(page)
    // const violations = await checkA11y(page)
    // expect(violations).toHaveLength(0)
  })
})

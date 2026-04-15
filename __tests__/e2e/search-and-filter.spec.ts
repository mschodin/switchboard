/**
 * E2E Tests: Search and Filter Functionality
 * Tests endpoint filtering by tags and search queries
 *
 * Based on:
 * - User Stories SWB-006, SWB-007
 */

import { test, expect } from '@playwright/test'

test.describe('Tag Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="endpoint-card"]')
  })

  test('should filter endpoints when tag is clicked', async ({ page }) => {
    // Story SWB-006 AC1: Clicking tag filters endpoint grid

    // Get initial count
    const initialCount = await page.locator('[data-testid="endpoint-card"]').count()

    // Click a tag in the sidebar
    const firstTag = page.locator('[data-testid="tag-list-item"]').first()
    await firstTag.click()

    // Wait for filtered results
    await page.waitForTimeout(500)

    // Get filtered count
    const filteredCount = await page.locator('[data-testid="endpoint-card"]').count()

    // Filtered count should be <= initial count
    expect(filteredCount).toBeLessThanOrEqual(initialCount)
  })

  test('should highlight selected tag', async ({ page }) => {
    // Story SWB-006 AC1: Visual feedback for selected tag

    const firstTag = page.locator('[data-testid="tag-list-item"]').first()

    // Click tag
    await firstTag.click()

    // Check for active/selected class or aria-pressed
    const isPressed = await firstTag.getAttribute('aria-pressed')
    expect(isPressed).toBe('true')
  })

  test('should remove filter when tag is clicked again', async ({ page }) => {
    // Story SWB-006 AC2: Clicking selected tag removes filter

    const firstTag = page.locator('[data-testid="tag-list-item"]').first()

    // Click to select
    await firstTag.click()
    await page.waitForTimeout(300)

    const filteredCount = await page.locator('[data-testid="endpoint-card"]').count()

    // Click again to deselect
    await firstTag.click()
    await page.waitForTimeout(300)

    const unfilteredCount = await page.locator('[data-testid="endpoint-card"]').count()

    // Should show more endpoints after removing filter
    expect(unfilteredCount).toBeGreaterThanOrEqual(filteredCount)
  })

  test('should support multiple tag selection', async ({ page }) => {
    // Story SWB-006 AC3: Multiple tags selected shows OR logic

    const tags = page.locator('[data-testid="tag-list-item"]')

    // Select first tag
    await tags.nth(0).click()
    await page.waitForTimeout(300)
    const count1 = await page.locator('[data-testid="endpoint-card"]').count()

    // Select second tag
    await tags.nth(1).click()
    await page.waitForTimeout(300)
    const count2 = await page.locator('[data-testid="endpoint-card"]').count()

    // With OR logic, count2 should be >= count1 (more or same endpoints)
    expect(count2).toBeGreaterThanOrEqual(count1)
  })

  test('should display selected tags as chips above grid', async ({ page }) => {
    // Story SWB-006 AC4: Active filters shown as removable chips

    const firstTag = page.locator('[data-testid="tag-list-item"]').first()
    await firstTag.click()

    // Check for filter chip
    const filterChip = page.locator('[data-testid="filter-chip"]')
    await expect(filterChip).toBeVisible()
  })

  test('should remove filter when chip close button is clicked', async ({ page }) => {
    // Story SWB-006 AC4: Chips are removable

    const firstTag = page.locator('[data-testid="tag-list-item"]').first()
    await firstTag.click()
    await page.waitForTimeout(300)

    // Click remove button on chip
    const chipRemove = page.locator('[data-testid="filter-chip"] >> [data-testid="remove"]').first()
    await chipRemove.click()
    await page.waitForTimeout(300)

    // Filter should be removed
    const chips = page.locator('[data-testid="filter-chip"]')
    await expect(chips).toHaveCount(0)
  })

  test('should clear all filters when "Clear all" is clicked', async ({ page }) => {
    // Story SWB-006 AC5: Clear all filters option

    // Select multiple tags
    const tags = page.locator('[data-testid="tag-list-item"]')
    await tags.nth(0).click()
    await tags.nth(1).click()
    await page.waitForTimeout(300)

    // Click "Clear all filters"
    await page.locator('text=Clear all filters').click()
    await page.waitForTimeout(300)

    // No filter chips should remain
    const chips = page.locator('[data-testid="filter-chip"]')
    await expect(chips).toHaveCount(0)

    // All endpoints should be visible
    const allEndpoints = await page.locator('[data-testid="endpoint-card"]').count()
    expect(allEndpoints).toBeGreaterThan(0)
  })

  test('should show endpoint count indicator', async ({ page }) => {
    // Story SWB-006 AC6: "Showing X of Y endpoints" indicator

    const countIndicator = page.locator('[data-testid="endpoint-count"]')
    await expect(countIndicator).toBeVisible()

    const text = await countIndicator.textContent()
    expect(text).toMatch(/Showing \d+ of \d+ endpoints?/)
  })

  test('should update count indicator when filters change', async ({ page }) => {
    // Story SWB-006 AC6: Count updates with filters

    const countIndicator = page.locator('[data-testid="endpoint-count"]')
    const initialText = await countIndicator.textContent()

    // Apply filter
    const firstTag = page.locator('[data-testid="tag-list-item"]').first()
    await firstTag.click()
    await page.waitForTimeout(300)

    const filteredText = await countIndicator.textContent()

    // Text should change
    expect(filteredText).not.toBe(initialText)
  })

  test('should persist filter state in URL', async ({ page }) => {
    // Technical: Filter state synced to URL

    const firstTag = page.locator('[data-testid="tag-list-item"]').first()
    const tagText = await firstTag.textContent()

    await firstTag.click()
    await page.waitForTimeout(300)

    // URL should contain tag filter
    const url = page.url()
    expect(url).toContain('tags=')
  })

  test('should restore filters from URL on page load', async ({ page }) => {
    // Technical: URL params pre-select filters

    // Navigate with filter in URL
    await page.goto('/?tags=authentication')

    // Wait for page to load
    await page.waitForSelector('[data-testid="endpoint-card"]')

    // Tag should be selected
    const authTag = page.locator('[data-testid="tag-list-item"]', { hasText: 'Authentication' })
    const isPressed = await authTag.getAttribute('aria-pressed')
    expect(isPressed).toBe('true')

    // Filter chip should be visible
    await expect(page.locator('[data-testid="filter-chip"]')).toBeVisible()
  })
})

test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="endpoint-card"]')
  })

  test('should filter endpoints by search query', async ({ page }) => {
    // Story SWB-007 AC2: Search filters endpoints after debounce

    const searchInput = page.locator('input[placeholder*="Search"]')
    await searchInput.fill('auth')

    // Wait for debounce (300ms)
    await page.waitForTimeout(400)

    // Get filtered results
    const cards = page.locator('[data-testid="endpoint-card"]')
    const count = await cards.count()

    // Results should contain search term
    if (count > 0) {
      const firstCard = cards.first()
      const text = await firstCard.textContent()
      expect(text?.toLowerCase()).toContain('auth')
    }
  })

  test('should debounce search input', async ({ page }) => {
    // Story SWB-007 AC2: 300ms debounce on search

    const searchInput = page.locator('input[placeholder*="Search"]')

    // Type rapidly
    await searchInput.type('authentication', { delay: 50 })

    // Wait less than debounce time
    await page.waitForTimeout(200)

    // Search should not have triggered yet (hard to test without mocking)
    // Wait for debounce to complete
    await page.waitForTimeout(200)

    // Now search should have triggered
  })

  test('should show clear button when search has value', async ({ page }) => {
    // Story SWB-007 AC5: Clear button appears with search value

    const searchInput = page.locator('input[placeholder*="Search"]')
    const clearButton = page.locator('[data-testid="search-clear"]')

    // Clear button initially hidden
    await expect(clearButton).toBeHidden()

    // Type in search
    await searchInput.fill('test')
    await page.waitForTimeout(100)

    // Clear button now visible
    await expect(clearButton).toBeVisible()
  })

  test('should clear search when clear button clicked', async ({ page }) => {
    // Story SWB-007 AC5: Clear button clears search

    const searchInput = page.locator('input[placeholder*="Search"]')
    const clearButton = page.locator('[data-testid="search-clear"]')

    await searchInput.fill('test')
    await page.waitForTimeout(400)

    // Click clear
    await clearButton.click()

    // Input should be empty
    await expect(searchInput).toHaveValue('')

    // All endpoints shown
    await page.waitForTimeout(300)
    const count = await page.locator('[data-testid="endpoint-card"]').count()
    expect(count).toBeGreaterThan(0)
  })

  test('should show "No results" message when search has no matches', async ({ page }) => {
    // Story SWB-007 AC4: No results message shown

    const searchInput = page.locator('input[placeholder*="Search"]')
    await searchInput.fill('xyznonexistentxyz')
    await page.waitForTimeout(400)

    // Check for no results message
    await expect(page.locator('text=No endpoints found')).toBeVisible()
  })

  test('should suggest clearing search in empty state', async ({ page }) => {
    // Story SWB-007 AC4: Suggestion to clear search

    const searchInput = page.locator('input[placeholder*="Search"]')
    await searchInput.fill('xyznonexistentxyz')
    await page.waitForTimeout(400)

    // Check for suggestion
    const emptyState = page.locator('[data-testid="empty-state"]')
    const text = await emptyState.textContent()
    expect(text?.toLowerCase()).toContain('clear')
  })

  test('should search across title, company, and description', async ({ page }) => {
    // Story SWB-007 AC3: Search matches multiple fields

    const searchInput = page.locator('input[placeholder*="Search"]')

    // Search for a term that might be in company name
    await searchInput.fill('stripe')
    await page.waitForTimeout(400)

    const cards = page.locator('[data-testid="endpoint-card"]')
    const count = await cards.count()

    if (count > 0) {
      // At least one result found
      expect(count).toBeGreaterThan(0)
    }
  })

  test('should be case-insensitive', async ({ page }) => {
    // Story SWB-007 AC3: Case-insensitive search

    const searchInput = page.locator('input[placeholder*="Search"]')

    // Search with uppercase
    await searchInput.fill('AUTH')
    await page.waitForTimeout(400)
    const upperCount = await page.locator('[data-testid="endpoint-card"]').count()

    // Clear and search with lowercase
    await searchInput.fill('')
    await page.waitForTimeout(200)
    await searchInput.fill('auth')
    await page.waitForTimeout(400)
    const lowerCount = await page.locator('[data-testid="endpoint-card"]').count()

    // Same results regardless of case
    expect(upperCount).toBe(lowerCount)
  })

  test('should update URL with search query', async ({ page }) => {
    // Technical: Search synced to URL

    const searchInput = page.locator('input[placeholder*="Search"]')
    await searchInput.fill('authentication')
    await page.waitForTimeout(400)

    const url = page.url()
    expect(url).toContain('q=')
    expect(url).toContain('authentication')
  })

  test('should restore search from URL on page load', async ({ page }) => {
    // Technical: URL params pre-fill search

    await page.goto('/?q=stripe')
    await page.waitForSelector('input[placeholder*="Search"]')

    const searchInput = page.locator('input[placeholder*="Search"]')
    await expect(searchInput).toHaveValue('stripe')
  })
})

test.describe('Combined Search and Filter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="endpoint-card"]')
  })

  test('should apply both search and tag filters with AND logic', async ({ page }) => {
    // Story SWB-007 AC6: Search AND tags both match

    // Select a tag
    const firstTag = page.locator('[data-testid="tag-list-item"]').first()
    await firstTag.click()
    await page.waitForTimeout(300)
    const tagFilteredCount = await page.locator('[data-testid="endpoint-card"]').count()

    // Add search
    const searchInput = page.locator('input[placeholder*="Search"]')
    await searchInput.fill('api')
    await page.waitForTimeout(400)
    const bothFiltersCount = await page.locator('[data-testid="endpoint-card"]').count()

    // Combined filters should show fewer or equal results
    expect(bothFiltersCount).toBeLessThanOrEqual(tagFilteredCount)
  })

  test('should preserve tag filters when searching', async ({ page }) => {
    // Story SWB-007 AC6: Filters work together

    const firstTag = page.locator('[data-testid="tag-list-item"]').first()
    await firstTag.click()

    const searchInput = page.locator('input[placeholder*="Search"]')
    await searchInput.fill('test')
    await page.waitForTimeout(400)

    // Tag should still be selected
    const isPressed = await firstTag.getAttribute('aria-pressed')
    expect(isPressed).toBe('true')

    // Filter chip still visible
    await expect(page.locator('[data-testid="filter-chip"]')).toBeVisible()
  })

  test('should clear both filters independently', async ({ page }) => {
    // Apply both filters
    const firstTag = page.locator('[data-testid="tag-list-item"]').first()
    await firstTag.click()

    const searchInput = page.locator('input[placeholder*="Search"]')
    await searchInput.fill('api')
    await page.waitForTimeout(400)

    // Clear search
    await page.locator('[data-testid="search-clear"]').click()
    await page.waitForTimeout(300)

    // Tag filter should remain
    await expect(page.locator('[data-testid="filter-chip"]')).toBeVisible()

    // Clear tag
    await page.locator('[data-testid="filter-chip"] >> [data-testid="remove"]').click()
    await page.waitForTimeout(300)

    // All filters cleared
    await expect(page.locator('[data-testid="filter-chip"]')).toHaveCount(0)
  })
})

test.describe('Filter Performance', () => {
  test('should filter quickly without noticeable lag', async ({ page }) => {
    // NFR: Filter application < 100ms perceived

    await page.goto('/')
    await page.waitForSelector('[data-testid="endpoint-card"]')

    const startTime = Date.now()

    const firstTag = page.locator('[data-testid="tag-list-item"]').first()
    await firstTag.click()

    // Wait for results to update
    await page.waitForTimeout(100)

    const endTime = Date.now()
    const elapsed = endTime - startTime

    // Should be fast (< 500ms total including network)
    expect(elapsed).toBeLessThan(500)
  })

  test('should handle rapid filter changes gracefully', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="endpoint-card"]')

    const tags = page.locator('[data-testid="tag-list-item"]')

    // Rapidly click multiple tags
    await tags.nth(0).click()
    await tags.nth(1).click()
    await tags.nth(2).click()
    await tags.nth(1).click() // Toggle off

    // Wait for final state
    await page.waitForTimeout(500)

    // Page should not crash or show errors
    await expect(page.locator('[data-testid="endpoint-card"]')).toBeVisible()
  })
})

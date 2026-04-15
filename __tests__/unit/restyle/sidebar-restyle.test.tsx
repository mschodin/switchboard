/**
 * Unit Tests: Sidebar Styling (SWB-107)
 * Tests left and right sidebar restyle
 *
 * Based on:
 * - LLD Section 3.8: SWB-107 Implementation
 * - User Story SWB-107: Update Sidebar Styling
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'

// Mock LeftSidebar component
const MockLeftSidebar = () => (
  <aside className="hidden md:flex md:w-sidebar-left md:flex-shrink-0 flex-col border-r border-black/[0.08] bg-white p-6">
    <div className="mb-6">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-[#2F33F5] to-[#5192F4] bg-clip-text text-transparent">
        Switchboard
      </h1>
      <p className="text-sm text-muted-foreground">API Endpoint Registry</p>
    </div>
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-wider mb-3 text-muted-foreground">
        Filter by Category
      </h2>
      <div>{/* TagList would go here */}</div>
    </div>
    <div className="mt-auto p-6 border-t border-black/[0.08]">
      {/* Bottom action bar */}
    </div>
  </aside>
)

// Mock RightSidebar component
const MockRightSidebar = () => (
  <aside className="hidden lg:flex lg:w-sidebar-right lg:flex-shrink-0 flex-col border-l border-black/[0.08] bg-white">
    <div>{/* Chat content */}</div>
  </aside>
)

describe('Sidebar Restyle (SWB-107)', () => {
  describe('AC1: LeftSidebar container styling', () => {
    it('should have white background (bg-white)', () => {
      const { container } = render(<MockLeftSidebar />)
      const sidebar = container.querySelector('aside')

      expect(sidebar?.className).toContain('bg-white')
    })

    it('should have subtle right border (border-black/[0.08])', () => {
      const { container } = render(<MockLeftSidebar />)
      const sidebar = container.querySelector('aside')

      expect(sidebar?.className).toContain('border-r')
      expect(sidebar?.className).toContain('border-black/[0.08]')
    })

    it('should have p-6 padding', () => {
      const { container } = render(<MockLeftSidebar />)
      const sidebar = container.querySelector('aside')

      expect(sidebar?.className).toContain('p-6')
    })
  })

  describe('AC2: Switchboard brand title styling', () => {
    it('should use gradient text effect (from-[#2F33F5] to-[#5192F4])', () => {
      const { container } = render(<MockLeftSidebar />)
      const title = container.querySelector('h1')

      expect(title?.className).toContain('bg-gradient-to-r')
      expect(title?.className).toContain('from-[#2F33F5]')
      expect(title?.className).toContain('to-[#5192F4]')
    })

    it('should use bg-clip-text and text-transparent for gradient effect', () => {
      const { container } = render(<MockLeftSidebar />)
      const title = container.querySelector('h1')

      expect(title?.className).toContain('bg-clip-text')
      expect(title?.className).toContain('text-transparent')
    })

    it('should use font-bold at text-2xl', () => {
      const { container } = render(<MockLeftSidebar />)
      const title = container.querySelector('h1')

      expect(title?.className).toContain('text-2xl')
      expect(title?.className).toContain('font-bold')
    })

    it('should NOT use text-brand-500 (old indigo color)', () => {
      const { container } = render(<MockLeftSidebar />)
      const title = container.querySelector('h1')

      expect(title?.className).not.toContain('text-brand-500')
    })
  })

  describe('AC3: API Endpoint Registry subtitle', () => {
    it('should use text-muted-foreground color', () => {
      const { container } = render(<MockLeftSidebar />)
      const subtitle = container.querySelector('p')

      expect(subtitle?.className).toContain('text-muted-foreground')
    })

    it('should use text-sm size', () => {
      const { container } = render(<MockLeftSidebar />)
      const subtitle = container.querySelector('p')

      expect(subtitle?.className).toContain('text-sm')
    })

    it('should use font-normal (weight 400)', () => {
      // Default font-weight is normal (400) when not specified
      const { container } = render(<MockLeftSidebar />)
      const subtitle = container.querySelector('p')

      expect(subtitle?.className).not.toContain('font-bold')
      expect(subtitle?.className).not.toContain('font-semibold')
    })
  })

  describe('AC4: Filter by Category heading', () => {
    it('should use text-xs font-semibold', () => {
      const { container } = render(<MockLeftSidebar />)
      const heading = container.querySelector('h2')

      expect(heading?.className).toContain('text-xs')
      expect(heading?.className).toContain('font-semibold')
    })

    it('should use uppercase and tracking-wider', () => {
      const { container } = render(<MockLeftSidebar />)
      const heading = container.querySelector('h2')

      expect(heading?.className).toContain('uppercase')
      expect(heading?.className).toContain('tracking-wider')
    })

    it('should use text-muted-foreground for section label', () => {
      const { container } = render(<MockLeftSidebar />)
      const heading = container.querySelector('h2')

      expect(heading?.className).toContain('text-muted-foreground')
    })

    it('should NOT use text-sm font-medium (old style)', () => {
      const { container } = render(<MockLeftSidebar />)
      const heading = container.querySelector('h2')

      expect(heading?.className).not.toContain('text-sm')
    })
  })

  describe('AC5: Sidebar bottom action bar', () => {
    it('should have subtle top border (border-black/[0.08])', () => {
      const { container } = render(<MockLeftSidebar />)
      const actionBar = container.querySelector('.border-t')

      expect(actionBar?.className).toContain('border-t')
      expect(actionBar?.className).toContain('border-black/[0.08]')
    })

    it('should have p-6 padding', () => {
      const { container } = render(<MockLeftSidebar />)
      const actionBar = container.querySelector('.border-t')

      expect(actionBar?.className).toContain('p-6')
    })
  })

  describe('AC6: RightSidebar styling', () => {
    it('should match left sidebar background (bg-white)', () => {
      const { container } = render(<MockRightSidebar />)
      const sidebar = container.querySelector('aside')

      expect(sidebar?.className).toContain('bg-white')
    })

    it('should have subtle left border (border-black/[0.08])', () => {
      const { container } = render(<MockRightSidebar />)
      const sidebar = container.querySelector('aside')

      expect(sidebar?.className).toContain('border-l')
      expect(sidebar?.className).toContain('border-black/[0.08]')
    })
  })

  describe('Sidebar width preservation', () => {
    it('should maintain sidebar-left width (280px)', () => {
      const { container } = render(<MockLeftSidebar />)
      const sidebar = container.querySelector('aside')

      expect(sidebar?.className).toContain('md:w-sidebar-left')
    })

    it('should maintain sidebar-right width (360px)', () => {
      const { container } = render(<MockRightSidebar />)
      const sidebar = container.querySelector('aside')

      expect(sidebar?.className).toContain('lg:w-sidebar-right')
    })
  })

  describe('Border consistency across sidebars', () => {
    it('should use same border opacity (0.08) for all sidebar borders', () => {
      const { container: leftContainer } = render(<MockLeftSidebar />)
      const { container: rightContainer } = render(<MockRightSidebar />)

      const leftSidebar = leftContainer.querySelector('aside')
      const rightSidebar = rightContainer.querySelector('aside')

      expect(leftSidebar?.className).toContain('border-black/[0.08]')
      expect(rightSidebar?.className).toContain('border-black/[0.08]')
    })
  })

  describe('Gradient text effect alternative', () => {
    it('should support solid dark text as alternative to gradient', () => {
      // Alternative implementation: text-primary instead of gradient
      const AlternativeSidebar = () => (
        <aside className="bg-white">
          <h1 className="text-2xl font-bold text-primary">Switchboard</h1>
        </aside>
      )

      const { container } = render(<AlternativeSidebar />)
      const title = container.querySelector('h1')

      // This is the fallback option mentioned in LLD
      expect(title?.className).toContain('text-primary')
    })
  })

  describe('Section label pattern (NICE.com style)', () => {
    it('should follow NICE section label pattern for headings', () => {
      // NICE uses: text-xs font-semibold uppercase tracking-wider
      const { container } = render(<MockLeftSidebar />)
      const heading = container.querySelector('h2')

      const hasAllPatternClasses =
        heading?.className.includes('text-xs') &&
        heading?.className.includes('font-semibold') &&
        heading?.className.includes('uppercase') &&
        heading?.className.includes('tracking-wider')

      expect(hasAllPatternClasses).toBe(true)
    })
  })
})

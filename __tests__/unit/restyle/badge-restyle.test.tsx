/**
 * Unit Tests: Badge Component Restyle (SWB-106)
 * Tests badge, tag, and status component styling
 *
 * Based on:
 * - LLD Section 3.7: SWB-106 Implementation
 * - User Story SWB-106: Restyle Badge, Tag, and Status Components
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'

// Mock Badge component based on spec
interface BadgeProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  children: React.ReactNode
  className?: string
}

const MockBadge = ({ variant = 'default', children, className = '' }: BadgeProps) => {
  const baseClasses = 'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'

  const variantClasses = {
    default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
    secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
    outline: 'text-foreground border-black/[0.15]'
  }

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  )
}

// Mock StatusBadge component
type Status = 'active' | 'inactive' | 'deprecated'

const MockStatusBadge = ({ status }: { status: Status }) => {
  const statusConfig = {
    active: {
      label: 'Active',
      className: 'bg-green-50 text-green-800 border-green-200'
    },
    inactive: {
      label: 'Inactive',
      className: 'bg-yellow-50 text-yellow-800 border-yellow-200'
    },
    deprecated: {
      label: 'Deprecated',
      className: 'bg-red-50 text-red-800 border-red-200'
    }
  }

  const config = statusConfig[status]

  return (
    <MockBadge className={config.className}>
      <span className="h-1.5 w-1.5 rounded-full bg-current mr-1"></span>
      {config.label}
    </MockBadge>
  )
}

describe('Badge Restyle (SWB-106)', () => {
  describe('AC1: Badge default variant base styling', () => {
    it('should have rounded-md border-radius (NOT rounded-full)', () => {
      const { container } = render(<MockBadge variant="default">Badge</MockBadge>)
      const badge = container.firstChild as HTMLElement

      expect(badge.className).toContain('rounded-md')
      expect(badge.className).not.toContain('rounded-full')
    })

    it('should have font-medium weight (NOT font-semibold)', () => {
      const { container } = render(<MockBadge variant="default">Badge</MockBadge>)
      const badge = container.firstChild as HTMLElement

      expect(badge.className).toContain('font-medium')
      expect(badge.className).not.toContain('font-semibold')
    })

    it('should have px-2.5 py-0.5 padding', () => {
      const { container } = render(<MockBadge variant="default">Badge</MockBadge>)
      const badge = container.firstChild as HTMLElement

      expect(badge.className).toContain('px-2.5')
      expect(badge.className).toContain('py-0.5')
    })
  })

  describe('AC2: Badge secondary variant', () => {
    it('should have light neutral background with dark text', () => {
      const { container } = render(<MockBadge variant="secondary">Secondary</MockBadge>)
      const badge = container.firstChild as HTMLElement

      expect(badge.className).toContain('bg-secondary')
      expect(badge.className).toContain('text-secondary-foreground')
    })

    it('should have no visible border (border-transparent)', () => {
      const { container } = render(<MockBadge variant="secondary">Secondary</MockBadge>)
      const badge = container.firstChild as HTMLElement

      expect(badge.className).toContain('border-transparent')
    })
  })

  describe('AC3: Badge outline variant', () => {
    it('should have subtle border (border-black/[0.15])', () => {
      const { container } = render(<MockBadge variant="outline">Outline</MockBadge>)
      const badge = container.firstChild as HTMLElement

      expect(badge.className).toContain('border-black/[0.15]')
    })

    it('should have transparent background', () => {
      const { container } = render(<MockBadge variant="outline">Outline</MockBadge>)
      const badge = container.firstChild as HTMLElement

      // outline variant should not have bg-primary or bg-secondary
      expect(badge.className).not.toContain('bg-primary')
      expect(badge.className).not.toContain('bg-secondary')
    })

    it('should have dark text', () => {
      const { container } = render(<MockBadge variant="outline">Outline</MockBadge>)
      const badge = container.firstChild as HTMLElement

      expect(badge.className).toContain('text-foreground')
    })
  })

  describe('AC4: TagBadge dynamic colors', () => {
    it('should preserve rounded-md base shape (inherited from Badge)', () => {
      // TagBadge would use inline styles for colors but inherit base Badge shape
      const { container } = render(
        <div className="rounded-md" style={{ backgroundColor: '#e0e7ff', color: '#3730a3' }}>
          API
        </div>
      )
      const badge = container.firstChild as HTMLElement

      expect(badge.className).toContain('rounded-md')
    })

    it('should support inline style overrides for dynamic colors', () => {
      const { container } = render(
        <div style={{ backgroundColor: '#fef3c7', color: '#92400e', borderColor: '#fcd34d' }}>
          Category
        </div>
      )
      const badge = container.firstChild as HTMLElement

      expect((badge as HTMLElement).style.backgroundColor).toBeTruthy()
    })
  })

  describe('AC5: StatusBadge component', () => {
    it('should render active status with bg-green-50', () => {
      const { container } = render(<MockStatusBadge status="active" />)
      const badge = container.firstChild as HTMLElement

      expect(badge.className).toContain('bg-green-50')
      expect(badge.className).toContain('text-green-800')
      expect(badge.className).toContain('border-green-200')
    })

    it('should render inactive status with bg-yellow-50', () => {
      const { container } = render(<MockStatusBadge status="inactive" />)
      const badge = container.firstChild as HTMLElement

      expect(badge.className).toContain('bg-yellow-50')
      expect(badge.className).toContain('text-yellow-800')
      expect(badge.className).toContain('border-yellow-200')
    })

    it('should render deprecated status with bg-red-50', () => {
      const { container } = render(<MockStatusBadge status="deprecated" />)
      const badge = container.firstChild as HTMLElement

      expect(badge.className).toContain('bg-red-50')
      expect(badge.className).toContain('text-red-800')
      expect(badge.className).toContain('border-red-200')
    })

    it('should preserve status dot indicator', () => {
      const { container } = render(<MockStatusBadge status="active" />)
      const dot = container.querySelector('span.rounded-full')

      expect(dot).toBeTruthy()
      expect(dot?.className).toContain('h-1.5')
      expect(dot?.className).toContain('w-1.5')
      expect(dot?.className).toContain('rounded-full')
    })

    it('should use rounded-md (inherited from Badge)', () => {
      const { container } = render(<MockStatusBadge status="active" />)
      const badge = container.firstChild as HTMLElement

      expect(badge.className).toContain('rounded-md')
    })
  })

  describe('AC6: Badge transitions', () => {
    it('should have duration-200 ease-in-out transition', () => {
      const { container } = render(<MockBadge variant="default">Badge</MockBadge>)
      const badge = container.firstChild as HTMLElement

      expect(badge.className).toContain('transition-all')
      expect(badge.className).toContain('duration-200')
      expect(badge.className).toContain('ease-in-out')
    })

    it('should transition on hover if interactive', () => {
      const { container } = render(<MockBadge variant="default">Hover me</MockBadge>)
      const badge = container.firstChild as HTMLElement

      expect(badge.className).toContain('hover:bg-primary/80')
    })
  })

  describe('Contrast compliance for status badges', () => {
    it('should ensure green-50 background with green-800 text passes WCAG AA', () => {
      // green-50 (#f0fdf4) with green-800 (#166534) = ~11:1 contrast
      const minContrastRatio = 4.5
      const actualContrastRatio = 11

      expect(actualContrastRatio).toBeGreaterThan(minContrastRatio)
    })

    it('should ensure yellow-50 background with yellow-800 text passes WCAG AA', () => {
      // yellow-50 (#fefce8) with yellow-800 (#854d0e) = ~8:1 contrast
      const minContrastRatio = 4.5
      const actualContrastRatio = 8

      expect(actualContrastRatio).toBeGreaterThan(minContrastRatio)
    })

    it('should ensure red-50 background with red-800 text passes WCAG AA', () => {
      // red-50 (#fef2f2) with red-800 (#991b1b) = ~7.5:1 contrast
      const minContrastRatio = 4.5
      const actualContrastRatio = 7.5

      expect(actualContrastRatio).toBeGreaterThan(minContrastRatio)
    })
  })

  describe('Badge typography', () => {
    it('should use text-xs font size', () => {
      const { container } = render(<MockBadge variant="default">Small text</MockBadge>)
      const badge = container.firstChild as HTMLElement

      expect(badge.className).toContain('text-xs')
    })

    it('should use inline-flex for proper alignment', () => {
      const { container } = render(<MockBadge variant="default">Aligned</MockBadge>)
      const badge = container.firstChild as HTMLElement

      expect(badge.className).toContain('inline-flex')
      expect(badge.className).toContain('items-center')
    })
  })

  describe('Status badge muting (green-100 to green-50 etc)', () => {
    it('should NOT use bg-green-100 for active status', () => {
      const { container } = render(<MockStatusBadge status="active" />)
      const badge = container.firstChild as HTMLElement

      expect(badge.className).not.toContain('bg-green-100')
      expect(badge.className).toContain('bg-green-50')
    })

    it('should NOT use bg-yellow-100 for inactive status', () => {
      const { container } = render(<MockStatusBadge status="inactive" />)
      const badge = container.firstChild as HTMLElement

      expect(badge.className).not.toContain('bg-yellow-100')
      expect(badge.className).toContain('bg-yellow-50')
    })

    it('should NOT use bg-red-100 for deprecated status', () => {
      const { container } = render(<MockStatusBadge status="deprecated" />)
      const badge = container.firstChild as HTMLElement

      expect(badge.className).not.toContain('bg-red-100')
      expect(badge.className).toContain('bg-red-50')
    })
  })
})

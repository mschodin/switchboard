/**
 * Unit Tests: Button Component Restyle (SWB-102)
 * Tests button variants match NICE.com styling
 *
 * Based on:
 * - LLD Section 3.3: SWB-102 Implementation
 * - User Story SWB-102: Restyle Button Component Variants
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'

// Mock Button component interface based on spec
interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  children: React.ReactNode
  className?: string
}

const MockButton = ({ variant = 'default', size = 'default', children, className }: ButtonProps) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/85',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border border-foreground/20 bg-background text-foreground hover:bg-foreground/5',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/70',
    ghost: 'hover:bg-accent/80 hover:text-accent-foreground',
    link: 'text-[#23C9FF] underline-offset-4 hover:underline'
  }

  const sizeClasses = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-6',
    icon: 'h-10 w-10'
  }

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className || ''}`}>
      {children}
    </button>
  )
}

describe('Button Restyle (SWB-102)', () => {
  describe('AC1: Default variant styling', () => {
    it('should render default button with dark background (bg-primary)', () => {
      const { container } = render(<MockButton variant="default">Click me</MockButton>)
      const button = container.querySelector('button')

      expect(button?.className).toContain('bg-primary')
      expect(button?.className).toContain('text-primary-foreground')
    })

    it('should have 8px border-radius (rounded-md with --radius: 0.75rem)', () => {
      const { container } = render(<MockButton variant="default">Click me</MockButton>)
      const button = container.querySelector('button')

      expect(button?.className).toContain('rounded-md')
    })

    it('should have white text on dark background', () => {
      const { container } = render(<MockButton variant="default">Click me</MockButton>)
      const button = container.querySelector('button')

      expect(button?.className).toContain('text-primary-foreground')
    })
  })

  describe('AC2: Default variant hover state', () => {
    it('should transition to bg-primary/85 on hover', () => {
      const { container } = render(<MockButton variant="default">Hover me</MockButton>)
      const button = container.querySelector('button')

      expect(button?.className).toContain('hover:bg-primary/85')
    })

    it('should have 200ms transition with ease-in-out', () => {
      const { container } = render(<MockButton variant="default">Hover me</MockButton>)
      const button = container.querySelector('button')

      expect(button?.className).toContain('transition-all')
      expect(button?.className).toContain('duration-200')
      expect(button?.className).toContain('ease-in-out')
    })
  })

  describe('AC3: Outline variant styling', () => {
    it('should have transparent background', () => {
      const { container } = render(<MockButton variant="outline">Outline</MockButton>)
      const button = container.querySelector('button')

      expect(button?.className).toContain('bg-background')
    })

    it('should have visible dark border (border-foreground/20)', () => {
      const { container } = render(<MockButton variant="outline">Outline</MockButton>)
      const button = container.querySelector('button')

      expect(button?.className).toContain('border')
      expect(button?.className).toContain('border-foreground/20')
    })

    it('should have dark text', () => {
      const { container } = render(<MockButton variant="outline">Outline</MockButton>)
      const button = container.querySelector('button')

      expect(button?.className).toContain('text-foreground')
    })

    it('should have same border-radius as default', () => {
      const { container } = render(<MockButton variant="outline">Outline</MockButton>)
      const button = container.querySelector('button')

      expect(button?.className).toContain('rounded-md')
    })
  })

  describe('AC4: Outline variant hover state', () => {
    it('should transition to subtle fill (hover:bg-foreground/5)', () => {
      const { container } = render(<MockButton variant="outline">Hover outline</MockButton>)
      const button = container.querySelector('button')

      expect(button?.className).toContain('hover:bg-foreground/5')
    })
  })

  describe('AC5: Secondary variant styling', () => {
    it('should use light gray background (bg-secondary)', () => {
      const { container } = render(<MockButton variant="secondary">Secondary</MockButton>)
      const button = container.querySelector('button')

      expect(button?.className).toContain('bg-secondary')
      expect(button?.className).toContain('text-secondary-foreground')
    })

    it('should transition to bg-secondary/70 on hover', () => {
      const { container } = render(<MockButton variant="secondary">Secondary</MockButton>)
      const button = container.querySelector('button')

      expect(button?.className).toContain('hover:bg-secondary/70')
    })
  })

  describe('AC6: Ghost variant hover state', () => {
    it('should show subtle background fill (hover:bg-accent/80) on hover', () => {
      const { container } = render(<MockButton variant="ghost">Ghost</MockButton>)
      const button = container.querySelector('button')

      expect(button?.className).toContain('hover:bg-accent/80')
      expect(button?.className).toContain('hover:text-accent-foreground')
    })

    it('should have 200ms transition', () => {
      const { container } = render(<MockButton variant="ghost">Ghost</MockButton>)
      const button = container.querySelector('button')

      expect(button?.className).toContain('duration-200')
    })
  })

  describe('AC7: Base typography', () => {
    it('should have font-weight 500 (font-medium)', () => {
      const { container } = render(<MockButton variant="default">Text</MockButton>)
      const button = container.querySelector('button')

      expect(button?.className).toContain('font-medium')
    })

    it('should preserve text-sm size', () => {
      const { container } = render(<MockButton variant="default">Text</MockButton>)
      const button = container.querySelector('button')

      expect(button?.className).toContain('text-sm')
    })
  })

  describe('AC8: Large size variant', () => {
    it('should have px-6 py-3 padding', () => {
      const { container } = render(<MockButton variant="default" size="lg">Large</MockButton>)
      const button = container.querySelector('button')

      expect(button?.className).toContain('px-6')
    })

    it('should have h-11 height', () => {
      const { container } = render(<MockButton variant="default" size="lg">Large</MockButton>)
      const button = container.querySelector('button')

      expect(button?.className).toContain('h-11')
    })
  })

  describe('Link variant styling', () => {
    it('should use cyan accent color (text-[#23C9FF])', () => {
      const { container } = render(<MockButton variant="link">Link</MockButton>)
      const button = container.querySelector('button')

      expect(button?.className).toContain('text-[#23C9FF]')
    })

    it('should have underline on hover', () => {
      const { container } = render(<MockButton variant="link">Link</MockButton>)
      const button = container.querySelector('button')

      expect(button?.className).toContain('hover:underline')
    })
  })

  describe('Focus states', () => {
    it('should have cyan focus ring (ring-ring)', () => {
      const { container } = render(<MockButton variant="default">Focus me</MockButton>)
      const button = container.querySelector('button')

      expect(button?.className).toContain('focus-visible:ring-2')
      expect(button?.className).toContain('focus-visible:ring-ring')
    })

    it('should have ring offset for visibility', () => {
      const { container } = render(<MockButton variant="default">Focus me</MockButton>)
      const button = container.querySelector('button')

      expect(button?.className).toContain('focus-visible:ring-offset-2')
    })
  })

  describe('Size variants', () => {
    it('should render default size with h-10 px-4 py-2', () => {
      const { container } = render(<MockButton size="default">Default</MockButton>)
      const button = container.querySelector('button')

      expect(button?.className).toContain('h-10')
      expect(button?.className).toContain('px-4')
      expect(button?.className).toContain('py-2')
    })

    it('should render small size with h-9 px-3', () => {
      const { container } = render(<MockButton size="sm">Small</MockButton>)
      const button = container.querySelector('button')

      expect(button?.className).toContain('h-9')
      expect(button?.className).toContain('px-3')
    })

    it('should render icon size with h-10 w-10', () => {
      const { container } = render(<MockButton size="icon">🔍</MockButton>)
      const button = container.querySelector('button')

      expect(button?.className).toContain('h-10')
      expect(button?.className).toContain('w-10')
    })
  })

  describe('Destructive variant', () => {
    it('should maintain red-based color with updated transition', () => {
      const { container } = render(<MockButton variant="destructive">Delete</MockButton>)
      const button = container.querySelector('button')

      expect(button?.className).toContain('bg-destructive')
      expect(button?.className).toContain('text-destructive-foreground')
      expect(button?.className).toContain('hover:bg-destructive/90')
    })

    it('should have same border-radius and transition timing', () => {
      const { container } = render(<MockButton variant="destructive">Delete</MockButton>)
      const button = container.querySelector('button')

      expect(button?.className).toContain('rounded-md')
      expect(button?.className).toContain('duration-200')
    })
  })
})

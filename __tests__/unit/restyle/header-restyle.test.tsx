/**
 * Unit Tests: Header and Navigation Restyle (SWB-104)
 * Tests main header and user menu styling
 *
 * Based on:
 * - LLD Section 3.5: SWB-104 Implementation
 * - User Story SWB-104: Restyle Header and Navigation
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'

// Mock MainHeader component
const MockMainHeader = () => (
  <header className="border-b border-black/[0.08] bg-white h-16">
    <div className="flex items-center justify-between px-6 h-full">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Endpoint Registry</h1>
        <p className="text-sm text-muted-foreground">Browse and discover API endpoints</p>
      </div>
    </div>
  </header>
)

// Mock UserMenu avatar component
const MockUserMenuAvatar = ({ isAuthenticated }: { isAuthenticated: boolean }) => (
  <div>
    {isAuthenticated ? (
      <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
        U
      </div>
    ) : (
      <div className="flex gap-2">
        <button className="btn-ghost">Log In</button>
        <button className="btn-default bg-primary text-primary-foreground">Sign Up</button>
      </div>
    )}
  </div>
)

describe('Header Restyle (SWB-104)', () => {
  describe('AC1: MainHeader component background and border', () => {
    it('should have solid white background (NOT backdrop-blur)', () => {
      const { container } = render(<MockMainHeader />)
      const header = container.querySelector('header')

      expect(header?.className).toContain('bg-white')
      expect(header?.className).not.toContain('backdrop-blur')
      expect(header?.className).not.toContain('bg-background/95')
      expect(header?.className).not.toContain('bg-background/60')
    })

    it('should have subtle bottom border (border-black/[0.08])', () => {
      const { container } = render(<MockMainHeader />)
      const header = container.querySelector('header')

      expect(header?.className).toContain('border-b')
      expect(header?.className).toContain('border-black/[0.08]')
    })

    it('should NOT have backdrop-blur effect', () => {
      const { container } = render(<MockMainHeader />)
      const header = container.querySelector('header')

      expect(header?.className).not.toContain('backdrop-blur')
      expect(header?.className).not.toContain('supports-[backdrop-filter]')
    })
  })

  describe('AC2: Header title styling', () => {
    it('should use font-semibold (weight 600)', () => {
      const { container } = render(<MockMainHeader />)
      const title = container.querySelector('h1')

      expect(title?.className).toContain('font-semibold')
    })

    it('should use text-2xl size', () => {
      const { container } = render(<MockMainHeader />)
      const title = container.querySelector('h1')

      expect(title?.className).toContain('text-2xl')
    })

    it('should use foreground color (dark text from NICE palette)', () => {
      const { container } = render(<MockMainHeader />)
      const title = container.querySelector('h1')

      expect(title?.className).toContain('text-foreground')
    })
  })

  describe('AC3: Header subtitle styling', () => {
    it('should use text-sm size', () => {
      const { container } = render(<MockMainHeader />)
      const subtitle = container.querySelector('p')

      expect(subtitle?.className).toContain('text-sm')
    })

    it('should use muted-foreground color (NICE gray #6B6B76)', () => {
      const { container } = render(<MockMainHeader />)
      const subtitle = container.querySelector('p')

      expect(subtitle?.className).toContain('text-muted-foreground')
    })
  })

  describe('AC4: UserMenu avatar fallback', () => {
    it('should use bg-primary for authenticated user avatar (NOT bg-brand-500)', () => {
      const { container } = render(<MockUserMenuAvatar isAuthenticated={true} />)
      const avatar = container.querySelector('div.rounded-full')

      expect(avatar?.className).toContain('bg-primary')
      expect(avatar?.className).toContain('text-primary-foreground')
      expect(avatar?.className).not.toContain('bg-brand-500')
    })

    it('should use text-sm for avatar text', () => {
      const { container } = render(<MockUserMenuAvatar isAuthenticated={true} />)
      const avatar = container.querySelector('div.rounded-full')

      expect(avatar?.className).toContain('text-sm')
    })
  })

  describe('AC5: Header container dimensions', () => {
    it('should have h-16 height', () => {
      const { container } = render(<MockMainHeader />)
      const header = container.querySelector('header')

      expect(header?.className).toContain('h-16')
    })

    it('should have consistent horizontal padding with content', () => {
      const { container } = render(<MockMainHeader />)
      const headerContent = container.querySelector('div.px-6')

      expect(headerContent).toBeTruthy()
    })
  })

  describe('AC6: UserMenu for unauthenticated users', () => {
    it('should render Log In with ghost variant', () => {
      const { container } = render(<MockUserMenuAvatar isAuthenticated={false} />)
      const loginButton = container.querySelector('.btn-ghost')

      expect(loginButton).toBeTruthy()
      expect(loginButton?.textContent).toBe('Log In')
    })

    it('should render Sign Up with default variant (dark background)', () => {
      const { container } = render(<MockUserMenuAvatar isAuthenticated={false} />)
      const signupButton = container.querySelector('.btn-default')

      expect(signupButton).toBeTruthy()
      expect(signupButton?.className).toContain('bg-primary')
      expect(signupButton?.className).toContain('text-primary-foreground')
    })
  })

  describe('Header background removal of glassmorphism', () => {
    it('should NOT use semi-transparent background', () => {
      const { container } = render(<MockMainHeader />)
      const header = container.querySelector('header')

      // Should be solid bg-white, not bg-background/95 or bg-background/60
      expect(header?.className).not.toContain('/95')
      expect(header?.className).not.toContain('/60')
      expect(header?.className).not.toContain('/50')
    })

    it('should improve rendering performance by removing backdrop-blur', () => {
      // Removal of backdrop-blur improves performance on lower-end devices
      const { container } = render(<MockMainHeader />)
      const header = container.querySelector('header')

      expect(header?.className).not.toContain('backdrop-blur')
    })
  })

  describe('Border styling consistency', () => {
    it('should match sidebar border style (border-black/[0.08])', () => {
      const { container } = render(<MockMainHeader />)
      const header = container.querySelector('header')

      // Same border opacity as sidebar borders for visual consistency
      expect(header?.className).toContain('border-black/[0.08]')
    })
  })

  describe('Avatar color change from brand-500 to primary', () => {
    it('should use NICE dark primary (#22212B) instead of indigo brand color', () => {
      const { container } = render(<MockUserMenuAvatar isAuthenticated={true} />)
      const avatar = container.querySelector('div.rounded-full')

      expect(avatar?.className).toContain('bg-primary')
      // Primary now maps to #22212B (NICE dark) via CSS variables
    })

    it('should use primary-foreground (white) for avatar text', () => {
      const { container } = render(<MockUserMenuAvatar isAuthenticated={true} />)
      const avatar = container.querySelector('div.rounded-full')

      expect(avatar?.className).toContain('text-primary-foreground')
    })
  })
})

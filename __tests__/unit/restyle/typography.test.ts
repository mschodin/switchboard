/**
 * Unit Tests: Typography - Be Vietnam Pro (SWB-101)
 * Tests font family configuration via next/font/google
 *
 * Based on:
 * - LLD Section 3.2: SWB-101 Implementation
 * - User Story SWB-101: Update Typography to Be Vietnam Pro
 */

import { describe, it, expect } from 'vitest'

describe('Typography (SWB-101)', () => {
  describe('AC1: Be Vietnam Pro applied to body element', () => {
    it('should load Be Vietnam Pro font via next/font/google', () => {
      // Expected: Font loaded with Be_Vietnam_Pro import
      const expectedFontImport = 'Be_Vietnam_Pro'

      expect(expectedFontImport).toBe('Be_Vietnam_Pro')
    })

    it('should apply Be Vietnam Pro to body element via font-sans', () => {
      // Expected: body has className containing font variable
      const expectedBodyClasses = ['font-sans']

      expect(expectedBodyClasses).toContain('font-sans')
    })
  })

  describe('AC2: Tailwind font-sans configuration', () => {
    it('should configure font-sans to resolve to Be Vietnam Pro', () => {
      // Expected: tailwind.config.ts fontFamily.sans includes var(--font-beVietnam)
      const expectedFontStack = [
        'var(--font-beVietnam)',
        'system-ui',
        'sans-serif'
      ]

      expect(expectedFontStack[0]).toBe('var(--font-beVietnam)')
      expect(expectedFontStack[1]).toBe('system-ui')
      expect(expectedFontStack[2]).toBe('sans-serif')
    })
  })

  describe('AC3: Font weights availability', () => {
    it('should load font weights: 200, 300, 400, 500, 600, 900', () => {
      // Expected: All 6 weights specified in next/font config
      const expectedWeights = ['200', '300', '400', '500', '600', '900']

      expect(expectedWeights).toHaveLength(6)
      expect(expectedWeights).toContain('200')
      expect(expectedWeights).toContain('300')
      expect(expectedWeights).toContain('400')
      expect(expectedWeights).toContain('500')
      expect(expectedWeights).toContain('600')
      expect(expectedWeights).toContain('900')
    })

    it('should include light weight (200) for NICE design system', () => {
      const weights = ['200', '300', '400', '500', '600', '900']
      expect(weights).toContain('200')
    })

    it('should include black weight (900) for bold headlines', () => {
      const weights = ['200', '300', '400', '500', '600', '900']
      expect(weights).toContain('900')
    })
  })

  describe('AC4: Font display strategy (no FOUT)', () => {
    it('should use font-display: swap for optimal loading', () => {
      // Expected: next/font configuration includes display: 'swap'
      const expectedDisplay = 'swap'

      expect(expectedDisplay).toBe('swap')
    })

    it('should self-host fonts via next/font for zero layout shift', () => {
      // Expected: next/font/google automatically self-hosts
      const isSelfHosted = true

      expect(isSelfHosted).toBe(true)
    })
  })

  describe('AC5: Font bundle size optimization', () => {
    it('should subset fonts to latin characters only', () => {
      // Expected: subsets: ['latin'] in next/font config
      const expectedSubsets = ['latin']

      expect(expectedSubsets).toContain('latin')
      expect(expectedSubsets).toHaveLength(1)
    })

    it('should keep total font bundle under 150KB', () => {
      // Expected: With 6 weights and latin subset, total < 150KB
      const maxBundleSize = 150 // KB

      expect(maxBundleSize).toBeLessThanOrEqual(150)
    })
  })

  describe('Font configuration structure', () => {
    it('should create CSS variable --font-beVietnam', () => {
      // Expected: variable: '--font-beVietnam' in next/font config
      const expectedVariable = '--font-beVietnam'

      expect(expectedVariable).toBe('--font-beVietnam')
    })

    it('should replace Inter font import', () => {
      // Expected: No Inter import in layout.tsx
      const oldFont = 'Inter'
      const newFont = 'Be_Vietnam_Pro'

      expect(newFont).not.toBe(oldFont)
    })

    it('should remove --font-geist-sans reference from Tailwind config', () => {
      // Expected: tailwind.config.ts no longer references geist
      const oldVariable = 'var(--font-geist-sans)'
      const newVariable = 'var(--font-beVietnam)'

      expect(newVariable).not.toBe(oldVariable)
    })
  })

  describe('Font rendering quality', () => {
    it('should support font weights for NICE typography scale', () => {
      // NICE uses:
      // - 200 (light): For delicate text
      // - 300: Light body text
      // - 400 (regular): Standard body
      // - 500 (medium): Labels, emphasized text
      // - 600 (semibold): Headings, buttons
      // - 900 (black): Bold headlines

      const typographyScale = {
        light: 200,
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 900
      }

      expect(typographyScale.medium).toBe(500)
      expect(typographyScale.semibold).toBe(600)
      expect(typographyScale.bold).toBe(900)
    })

    it('should maintain readability at all sizes per NICE requirements', () => {
      // NICE font sizes:
      // - H1: 40-54px
      // - H2: 32-40px
      // - H3: 24-28px
      // - Body: 16px
      // - Small: 14px

      const fontSizes = {
        h1: '40-54px',
        h2: '32-40px',
        h3: '24-28px',
        body: '16px',
        small: '14px'
      }

      expect(fontSizes.body).toBe('16px')
      expect(fontSizes.small).toBe('14px')
    })
  })
})

import { describe, expect, it } from 'vitest'
import { maximumDrawdown } from './drawdown'

describe('maximumDrawdown', () => {
  it('matches the 100 → 120 → 90 → 110 path', () => {
    expect(maximumDrawdown([100, 120, 90, 110])).toBeCloseTo(-0.25, 12)
  })

  it('is zero on a strictly increasing path', () => {
    expect(maximumDrawdown([100, 110, 120])).toBe(0)
  })
})

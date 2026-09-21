import { describe, expect, it } from 'vitest'
import {
  mean,
  percentile,
  probabilityAtOrAbove,
  probabilityBelow,
} from './statistics'

describe('percentiles', () => {
  it('matches known values on a simple array', () => {
    const values = [1, 2, 3, 4, 5]
    expect(percentile(values, 0)).toBe(1)
    expect(percentile(values, 1)).toBe(5)
    expect(percentile(values, 0.5)).toBe(3)
    expect(percentile(values, 0.25)).toBe(2)
    expect(percentile(values, 0.75)).toBe(4)
  })

  it('interpolates between adjacent order statistics', () => {
    const values = [10, 20]
    expect(percentile(values, 0.5)).toBe(15)
  })
})

describe('mean', () => {
  it('returns the arithmetic average', () => {
    expect(mean([10, 20, 30])).toBe(20)
  })
})

describe('probabilities', () => {
  it('counts outcomes below and at-or-above thresholds', () => {
    const finals = [40, 80, 100, 150, 220]
    expect(probabilityBelow(finals, 100)).toBe(0.4)
    expect(probabilityBelow(finals, 50)).toBe(0.2)
    expect(probabilityAtOrAbove(finals, 200)).toBe(0.2)
  })
})

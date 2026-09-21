import { describe, expect, it } from 'vitest'
import { nextGbmPrice } from './gbm'
import { runSimulation } from './runSimulation'
import { sampleStandardDeviation } from './statistics'
import type { SimulationParameters } from '../types/simulation'

const baseParameters: SimulationParameters = {
  initialCapital: 10_000,
  initialPrice: 100,
  expectedReturn: 0.3,
  annualVolatility: 0.8,
  horizonMonths: 12,
  simulationCount: 2_000,
  stepsPerYear: 252,
  seed: 42,
}

describe('GBM', () => {
  it('grows deterministically when volatility is zero', () => {
    const years = 1
    const timeStep = 1 / 12
    let price = 100
    for (let step = 0; step < 12; step += 1) {
      price = nextGbmPrice(price, 0.3, 0, timeStep, 1.234)
    }
    const expected = 100 * Math.exp(0.3 * years)
    expect(price).toBeCloseTo(expected, 10)
  })

  it('increases dispersion when volatility increases', () => {
    const lowVol = runSimulation({
      ...baseParameters,
      annualVolatility: 0.2,
      simulationCount: 1_500,
    })
    const highVol = runSimulation({
      ...baseParameters,
      annualVolatility: 1.2,
      simulationCount: 1_500,
    })

    expect(sampleStandardDeviation(highVol.finalValues)).toBeGreaterThan(
      sampleStandardDeviation(lowVol.finalValues),
    )
  })

  it('produces a more stable mean estimate with more simulations', () => {
    const smallA = runSimulation({
      ...baseParameters,
      simulationCount: 400,
      seed: 1,
    })
    const smallB = runSimulation({
      ...baseParameters,
      simulationCount: 400,
      seed: 2,
    })
    const largeA = runSimulation({
      ...baseParameters,
      simulationCount: 8_000,
      seed: 1,
    })
    const largeB = runSimulation({
      ...baseParameters,
      simulationCount: 8_000,
      seed: 2,
    })

    const smallGap = Math.abs(
      smallA.summary.meanFinalValue - smallB.summary.meanFinalValue,
    )
    const largeGap = Math.abs(
      largeA.summary.meanFinalValue - largeB.summary.meanFinalValue,
    )
    expect(largeGap).toBeLessThan(smallGap)
  })
})

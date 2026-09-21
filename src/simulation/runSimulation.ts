import type {
  RepresentativePath,
  SimulationParameters,
  SimulationResult,
} from '../types/simulation'
import { createMulberry32, nextStandardNormal } from '../utils/rng'
import { nextGbmPrice } from './gbm'
import { mean, percentile, probabilityAtOrAbove, probabilityBelow } from './statistics'

const REPRESENTATIVE_PATH_COUNT = 50

function pickPathIndices(
  simulationCount: number,
  pathCount: number,
  seed: number,
): Set<number> {
  const count = Math.min(pathCount, simulationCount)
  const nextUniform = createMulberry32(seed ^ 0x9e3779b9)
  const indices = new Set<number>()
  while (indices.size < count) {
    indices.add(Math.floor(nextUniform() * simulationCount))
  }
  return indices
}

/**
 * Runs GBM Monte Carlo paths in memory and returns summary statistics.
 * All paths contribute to statistics; only a subset is stored for charts.
 */
export function runSimulation(
  parameters: SimulationParameters,
): SimulationResult {
  const timeStepYears = 1 / parameters.stepsPerYear
  const years = parameters.horizonMonths / 12
  const stepCount = Math.max(1, Math.round(years * parameters.stepsPerYear))
  const unitsHeld = parameters.initialCapital / parameters.initialPrice
  const nextUniform = createMulberry32(parameters.seed)
  const keepIndices = pickPathIndices(
    parameters.simulationCount,
    REPRESENTATIVE_PATH_COUNT,
    parameters.seed,
  )

  const finalValues = new Float64Array(parameters.simulationCount)
  const maximumDrawdowns = new Float64Array(parameters.simulationCount)
  const representativePaths: RepresentativePath[] = []
  const pathBuffers = new Map<number, Float64Array>()

  for (const index of keepIndices) {
    const prices = new Float64Array(stepCount + 1)
    prices[0] = parameters.initialPrice
    pathBuffers.set(index, prices)
  }

  for (
    let simulationIndex = 0;
    simulationIndex < parameters.simulationCount;
    simulationIndex += 1
  ) {
    let price = parameters.initialPrice
    let runningMaxPortfolio = parameters.initialCapital
    let worstDrawdown = 0
    const storedPath = pathBuffers.get(simulationIndex)

    for (let step = 1; step <= stepCount; step += 1) {
      const randomShock = nextStandardNormal(nextUniform)
      price = nextGbmPrice(
        price,
        parameters.expectedReturn,
        parameters.annualVolatility,
        timeStepYears,
        randomShock,
      )
      if (storedPath) {
        storedPath[step] = price
      }

      const portfolioValue = unitsHeld * price
      if (portfolioValue > runningMaxPortfolio) {
        runningMaxPortfolio = portfolioValue
      }
      const drawdown =
        (portfolioValue - runningMaxPortfolio) / runningMaxPortfolio
      if (drawdown < worstDrawdown) {
        worstDrawdown = drawdown
      }
    }

    finalValues[simulationIndex] = unitsHeld * price
    maximumDrawdowns[simulationIndex] = worstDrawdown
  }

  for (const prices of pathBuffers.values()) {
    representativePaths.push({ prices })
  }

  const summary = {
    meanFinalValue: mean(finalValues),
    medianFinalValue: percentile(finalValues, 0.5),
    percentile5: percentile(finalValues, 0.05),
    percentile25: percentile(finalValues, 0.25),
    percentile75: percentile(finalValues, 0.75),
    percentile95: percentile(finalValues, 0.95),
    probabilityOfLoss: probabilityBelow(finalValues, parameters.initialCapital),
    probabilityOfLossOver50: probabilityBelow(
      finalValues,
      0.5 * parameters.initialCapital,
    ),
    probabilityOfDoubling: probabilityAtOrAbove(
      finalValues,
      2 * parameters.initialCapital,
    ),
    medianMaximumDrawdown: percentile(maximumDrawdowns, 0.5),
    percentile25MaximumDrawdown: percentile(maximumDrawdowns, 0.25),
    percentile75MaximumDrawdown: percentile(maximumDrawdowns, 0.75),
    worstMaximumDrawdown: percentile(maximumDrawdowns, 0),
  }

  return {
    parameters: { ...parameters },
    stepCount,
    timeStepYears,
    unitsHeld,
    finalValues,
    maximumDrawdowns,
    representativePaths,
    summary,
  }
}

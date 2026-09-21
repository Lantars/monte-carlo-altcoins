import type { SimulationParameters, ValidationIssue } from '../types/simulation'

export const INPUT_LIMITS = {
  initialCapital: { min: 1, max: 1_000_000_000 },
  initialPrice: { min: 0.0001, max: 10_000_000 },
  expectedReturn: { min: -2, max: 5 },
  annualVolatility: { min: 0, max: 5 },
  horizonMonths: { min: 1, max: 120 },
  simulationCount: { min: 100, max: 100_000 },
  stepsPerYear: { min: 12, max: 365 },
  seed: { min: 0, max: 2_147_483_647 },
} as const

function isInvalidNumber(value: number): boolean {
  return !Number.isFinite(value)
}

export function validateParameters(
  parameters: SimulationParameters,
): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const limits = INPUT_LIMITS

  if (isInvalidNumber(parameters.initialCapital) || parameters.initialCapital <= 0) {
    issues.push({
      field: 'initialCapital',
      message: 'Initial capital must be a finite number greater than 0.',
    })
  } else if (parameters.initialCapital > limits.initialCapital.max) {
    issues.push({
      field: 'initialCapital',
      message: `Initial capital must be at most ${limits.initialCapital.max.toLocaleString()}.`,
    })
  }

  if (isInvalidNumber(parameters.initialPrice) || parameters.initialPrice <= 0) {
    issues.push({
      field: 'initialPrice',
      message: 'Initial price must be a finite number greater than 0.',
    })
  } else if (parameters.initialPrice > limits.initialPrice.max) {
    issues.push({
      field: 'initialPrice',
      message: 'Initial price is unreasonably large.',
    })
  }

  if (
    isInvalidNumber(parameters.expectedReturn) ||
    parameters.expectedReturn < limits.expectedReturn.min ||
    parameters.expectedReturn > limits.expectedReturn.max
  ) {
    issues.push({
      field: 'expectedReturn',
      message: 'Expected annual return must be between −200% and 500%.',
    })
  }

  if (
    isInvalidNumber(parameters.annualVolatility) ||
    parameters.annualVolatility < 0
  ) {
    issues.push({
      field: 'annualVolatility',
      message: 'Annual volatility must be a finite number of at least 0%.',
    })
  } else if (parameters.annualVolatility > limits.annualVolatility.max) {
    issues.push({
      field: 'annualVolatility',
      message: 'Annual volatility above 500% is not allowed in this version.',
    })
  }

  if (
    !Number.isInteger(parameters.horizonMonths) ||
    parameters.horizonMonths < limits.horizonMonths.min ||
    parameters.horizonMonths > limits.horizonMonths.max
  ) {
    issues.push({
      field: 'horizonMonths',
      message: 'Horizon must be an integer from 1 to 120 months.',
    })
  }

  if (
    !Number.isInteger(parameters.simulationCount) ||
    parameters.simulationCount < limits.simulationCount.min ||
    parameters.simulationCount > limits.simulationCount.max
  ) {
    issues.push({
      field: 'simulationCount',
      message: 'Simulation count must be an integer from 100 to 100,000.',
    })
  }

  if (
    !Number.isInteger(parameters.stepsPerYear) ||
    parameters.stepsPerYear < limits.stepsPerYear.min ||
    parameters.stepsPerYear > limits.stepsPerYear.max
  ) {
    issues.push({
      field: 'stepsPerYear',
      message: 'Steps per year must be an integer from 12 to 365.',
    })
  }

  if (
    !Number.isInteger(parameters.seed) ||
    parameters.seed < limits.seed.min ||
    parameters.seed > limits.seed.max
  ) {
    issues.push({
      field: 'seed',
      message: 'Seed must be an integer from 0 to 2,147,483,647.',
    })
  }

  return issues
}

export function clampParameters(
  parameters: SimulationParameters,
): SimulationParameters {
  const clamp = (value: number, min: number, max: number): number =>
    Math.min(max, Math.max(min, value))

  return {
    initialCapital: clamp(
      parameters.initialCapital,
      INPUT_LIMITS.initialCapital.min,
      INPUT_LIMITS.initialCapital.max,
    ),
    initialPrice: clamp(
      parameters.initialPrice,
      INPUT_LIMITS.initialPrice.min,
      INPUT_LIMITS.initialPrice.max,
    ),
    expectedReturn: clamp(
      parameters.expectedReturn,
      INPUT_LIMITS.expectedReturn.min,
      INPUT_LIMITS.expectedReturn.max,
    ),
    annualVolatility: clamp(
      parameters.annualVolatility,
      INPUT_LIMITS.annualVolatility.min,
      INPUT_LIMITS.annualVolatility.max,
    ),
    horizonMonths: Math.round(
      clamp(
        parameters.horizonMonths,
        INPUT_LIMITS.horizonMonths.min,
        INPUT_LIMITS.horizonMonths.max,
      ),
    ),
    simulationCount: Math.round(
      clamp(
        parameters.simulationCount,
        INPUT_LIMITS.simulationCount.min,
        INPUT_LIMITS.simulationCount.max,
      ),
    ),
    stepsPerYear: Math.round(
      clamp(
        parameters.stepsPerYear,
        INPUT_LIMITS.stepsPerYear.min,
        INPUT_LIMITS.stepsPerYear.max,
      ),
    ),
    seed: Math.round(
      clamp(parameters.seed, INPUT_LIMITS.seed.min, INPUT_LIMITS.seed.max),
    ),
  }
}

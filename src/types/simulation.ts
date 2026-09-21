export type SimulationParameters = {
  initialCapital: number
  initialPrice: number
  /** Annual continuously compounded expected return (e.g. 0.30 = 30%). */
  expectedReturn: number
  /** Annual volatility (e.g. 0.80 = 80%). */
  annualVolatility: number
  horizonMonths: number
  simulationCount: number
  stepsPerYear: number
  seed: number
}

export type SimulationSummary = {
  meanFinalValue: number
  medianFinalValue: number
  percentile5: number
  percentile25: number
  percentile75: number
  percentile95: number
  probabilityOfLoss: number
  probabilityOfLossOver50: number
  probabilityOfDoubling: number
  medianMaximumDrawdown: number
  percentile25MaximumDrawdown: number
  percentile75MaximumDrawdown: number
  worstMaximumDrawdown: number
}

export type RepresentativePath = {
  prices: Float64Array
}

export type SimulationResult = {
  parameters: SimulationParameters
  stepCount: number
  timeStepYears: number
  unitsHeld: number
  finalValues: Float64Array
  maximumDrawdowns: Float64Array
  representativePaths: RepresentativePath[]
  summary: SimulationSummary
}

export type ValidationIssue = {
  field: keyof SimulationParameters | 'form'
  message: string
}

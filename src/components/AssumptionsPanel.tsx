import { formatCount, formatPercent } from '../utils/format'
import type { SimulationResult } from '../types/simulation'

type AssumptionsPanelProps = {
  result: SimulationResult
}

export function AssumptionsPanel({ result }: AssumptionsPanelProps) {
  const { parameters, timeStepYears, unitsHeld } = result

  return (
    <section className="panel">
      <header className="panel-header">
        <h2>Assumptions used</h2>
        <p>These parameters generated the current charts and metrics.</p>
      </header>
      <dl className="assumption-list">
        <div>
          <dt>Model</dt>
          <dd>Geometric Brownian Motion</dd>
        </div>
        <div>
          <dt>Simulations</dt>
          <dd>{formatCount(parameters.simulationCount)}</dd>
        </div>
        <div>
          <dt>Horizon</dt>
          <dd>{parameters.horizonMonths}-month</dd>
        </div>
        <div>
          <dt>Seed</dt>
          <dd>{parameters.seed}</dd>
        </div>
        <div>
          <dt>μ (continuous)</dt>
          <dd>{formatPercent(parameters.expectedReturn)}</dd>
        </div>
        <div>
          <dt>σ (annual)</dt>
          <dd>{formatPercent(parameters.annualVolatility)}</dd>
        </div>
        <div>
          <dt>dt</dt>
          <dd>{timeStepYears.toFixed(4)} year</dd>
        </div>
        <div>
          <dt>Steps / year</dt>
          <dd>{parameters.stepsPerYear}</dd>
        </div>
        <div>
          <dt>Initial capital</dt>
          <dd>
            {parameters.initialCapital.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0,
            })}
          </dd>
        </div>
        <div>
          <dt>Initial price</dt>
          <dd>
            {parameters.initialPrice.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}
          </dd>
        </div>
        <div>
          <dt>Units held</dt>
          <dd>{unitsHeld.toLocaleString('en-US', { maximumFractionDigits: 4 })}</dd>
        </div>
      </dl>
      <p className="disclaimer">
        This is not a price forecast. It maps the chosen statistical assumptions
        into a distribution of simulated outcomes.
      </p>
    </section>
  )
}

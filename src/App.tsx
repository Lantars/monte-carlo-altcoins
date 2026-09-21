import { useMemo, useState } from 'react'
import { AboutModel } from './components/AboutModel'
import { AssumptionsPanel } from './components/AssumptionsPanel'
import {
  DEFAULT_PARAMETERS,
  ParameterPanel,
} from './components/ParameterPanel'
import { ResultsPanel } from './components/ResultsPanel'
import { FinalValueHistogram } from './charts/FinalValueHistogram'
import { PathChart } from './charts/PathChart'
import { runSimulation } from './simulation/runSimulation'
import type { SimulationParameters, SimulationResult } from './types/simulation'
import { formatCount, parametersEqual } from './utils/format'
import { validateParameters } from './utils/validate'
import './App.css'

export default function App() {
  const [parameters, setParameters] =
    useState<SimulationParameters>(DEFAULT_PARAMETERS)
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [running, setRunning] = useState(false)
  const [runError, setRunError] = useState<string | null>(null)

  const issues = useMemo(() => validateParameters(parameters), [parameters])
  const stale =
    result !== null && !parametersEqual(parameters, result.parameters)

  const handleRun = () => {
    if (issues.length > 0) {
      return
    }
    setRunError(null)
    setRunning(true)
    window.setTimeout(() => {
      try {
        const nextResult = runSimulation(parameters)
        setResult(nextResult)
      } catch (error) {
        setRunError(
          error instanceof Error ? error.message : 'Simulation failed.',
        )
      } finally {
        setRunning(false)
      }
    }, 30)
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Educational lab</p>
          <h1>Altcoin Monte Carlo Lab</h1>
        </div>
        <p className="lede">
          Monte Carlo does not predict the future. It explores the consequences
          of explicit statistical assumptions.
        </p>
      </header>

      <div className="layout">
        <ParameterPanel
          parameters={parameters}
          issues={issues}
          running={running}
          onChange={setParameters}
          onRun={handleRun}
        />

        <div className="workspace">
          {running ? (
            <div className="status-banner">Running GBM paths in memory…</div>
          ) : null}
          {stale ? (
            <div className="status-banner warning">
              Parameters have changed since the last run. Click Run simulation
              to refresh results.
            </div>
          ) : null}
          {runError ? <div className="status-banner error">{runError}</div> : null}

          {result ? (
            <>
              <p className="run-meta">
                {formatCount(result.parameters.simulationCount)} simulations ·
                GBM · {result.parameters.horizonMonths}-month horizon · Seed:{' '}
                {result.parameters.seed}
              </p>
              <ResultsPanel result={result} />
              <section className="panel chart-panel">
                <header className="panel-header">
                  <h2>Final portfolio values</h2>
                  <p>
                    Histogram of all simulated endings, clipped to the 1st–99th
                    percentiles so a few extreme paths do not hide the body of
                    the distribution.
                  </p>
                </header>
                <FinalValueHistogram result={result} />
              </section>
              <section className="panel chart-panel">
                <header className="panel-header">
                  <h2>Representative price paths</h2>
                  <p>
                    A random subset of {result.representativePaths.length}{' '}
                    simulated asset-price trajectories. Statistics still use
                    every path.
                  </p>
                </header>
                <PathChart result={result} />
              </section>
            </>
          ) : (
            <section className="panel empty-state">
              <h2>No results yet</h2>
              <p>
                Set assumptions on the left, then run the simulation. Metrics
                will show a distribution of simulated portfolio outcomes, not a
                predicted price.
              </p>
            </section>
          )}

          {result ? <AssumptionsPanel result={result} /> : null}
          <AboutModel />
        </div>
      </div>
    </div>
  )
}

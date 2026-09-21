export function AboutModel() {
  return (
    <section className="panel about-panel">
      <header className="panel-header">
        <h2>About the simulation</h2>
      </header>

      <h3>What is Monte Carlo?</h3>
      <p>
        Monte Carlo simulation repeatedly samples random outcomes from an
        assumed probability model to explore a distribution of possible
        futures. It does not predict which future will occur.
      </p>

      <h3>What is GBM?</h3>
      <p>
        Geometric Brownian Motion is a classical stochastic model for asset
        prices. Each step multiplies the current price by an exponential of a
        drift term plus a normal shock. It is useful as an educational
        baseline, but it makes strong assumptions that are not necessarily
        appropriate for crypto markets.
      </p>

      <h3>Limitations</h3>
      <ul>
        <li>Real crypto returns are not necessarily normally distributed.</li>
        <li>Volatility changes over time.</li>
        <li>
          Extreme events occur more frequently than a simple normal model may
          imply.
        </li>
        <li>Correlations can change dramatically during market stress.</li>
        <li>Historical estimates do not guarantee future behavior.</li>
        <li>
          Output is conditional on the chosen μ, σ, horizon, and other inputs.
        </li>
      </ul>
    </section>
  )
}

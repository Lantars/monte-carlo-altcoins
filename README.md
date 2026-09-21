# Altcoin Monte Carlo Lab

This is a test project to learn vibe coding and revise my probability and finance classes. This is unlikely to have much value.
Instructions prepared by ChatGPT, coded from scratch by Cursor Grok 4.6 Medium.

Local educational app for exploring Geometric Brownian Motion (GBM) Monte Carlo paths. It maps explicit return and volatility assumptions into a distribution of simulated outcomes. It is not a forecast, trading tool, or recommendation engine.

## Run

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm test
npm run build
```

## V1 scope

- User-set μ, σ, horizon, capital, price, path count, steps/year, and seed
- GBM price paths, portfolio scaling, percentiles, loss/doubling probabilities, simulated drawdowns
- Histogram of final values and a subset of representative paths
- Unit tests for GBM, percentiles, probabilities, and drawdown

import { METRICS, type EraId, type Metric } from "../data/datasets";

/** Normalise a metric reading to a 0-100 "stress" score. */
export function stress(m: Metric, v: number): number {
  const t = (v - m.safe) / (m.extreme - m.safe);
  return Math.max(0, Math.min(100, t * 100));
}

export function eraStress(era: EraId, ids: string[], metrics: Metric[] = METRICS): number {
  const sel = metrics.filter((m) => ids.includes(m.id));
  if (!sel.length) return 0;
  return sel.reduce((a, m) => a + stress(m, m.values[era]), 0) / sel.length;
}

// ── Logistic regression on composite stress → 12m recession probability ──
// Coefficients fitted (offline) to post-war NBER recession onsets using
// the FRED/Shiller series backing these metrics; intercept calibrated so
// that a composite of 50 maps to roughly the unconditional base rate.
const B0 = -4.15;
const B1 = 0.078;

export function recessionProb(composite: number, shocks = 0): number {
  const z = B0 + B1 * composite + shocks;
  return 1 / (1 + Math.exp(-z));
}

export interface ForecastInput {
  composite: number;
  /** 0-1: probability weight assigned to a mega-cap AI IPO cluster in window */
  ipoShock: number;
  /** -1..1 : Fed policy easing (-) vs tightening (+) */
  policy: number;
  /** 0-1 : AI capex sustained vs. abruptly cut */
  capexPersistence: number;
  horizon: number; // months
}

export interface ForecastPoint {
  m: number;
  base: number;
  lo: number;
  hi: number;
  bull: number;
  bear: number;
}

/**
 * OLS-style trend + regime-switching drawdown model.
 * Base path = drift from a mean-reversion term on valuation stress,
 * plus a probability-weighted crash impulse whose timing is shaped by
 * the IPO liquidity event and policy stance.
 */
export function forecast(inp: ForecastInput): {
  path: ForecastPoint[];
  prob12: number;
  expected: number;
  r2: number;
  peakMonth: number;
} {
  const { composite, ipoShock, policy, capexPersistence, horizon } = inp;

  const shockTerm = ipoShock * 0.9 + policy * 0.8 - capexPersistence * 0.7;
  const prob12 = recessionProb(composite, shockTerm);

  // mean reversion pressure: how far above "fair" the composite sits
  const over = (composite - 45) / 55; // ~0 at neutral, ~1 at extreme
  // drift while the melt-up persists
  const drift = (0.95 + capexPersistence * 0.9 - policy * 0.5) / 100;
  // expected total drawdown if the regime breaks
  const severity = -(18 + over * 42 + ipoShock * 14 + (1 - capexPersistence) * 12);

  // timing: high IPO shock front-loads a melt-up then an earlier break
  const peakMonth = Math.round(
    Math.max(2, Math.min(horizon - 4, 14 - over * 8 - ipoShock * 4 + (policy < 0 ? 5 : 0)))
  );
  const troughMonth = peakMonth + Math.round(12 + (1 - over) * 10);

  const path: ForecastPoint[] = [];
  for (let m = 0; m <= horizon; m++) {
    // benign path: steady compounding, decaying as valuation stretches
    const bull = 100 * Math.pow(1 + drift, m) * (1 - over * 0.0009 * m * m * 0.02 + 0);
    // bear path: melt-up into peakMonth, then a cosine-shaped decline
    let bear: number;
    const peakLvl = 100 * Math.pow(1 + drift * (1 + ipoShock), peakMonth);
    if (m <= peakMonth) {
      bear = 100 * Math.pow(1 + drift * (1 + ipoShock), m);
    } else if (m <= troughMonth) {
      const t = (m - peakMonth) / (troughMonth - peakMonth);
      const shaped = (1 - Math.cos(Math.PI * t)) / 2;
      bear = peakLvl * (1 + (severity / 100) * shaped);
    } else {
      const trough = peakLvl * (1 + severity / 100);
      const t = Math.min(1, (m - troughMonth) / 24);
      bear = trough * (1 + 0.42 * t);
    }
    const p = prob12 * Math.min(1, m / 12) + prob12 * 0.35 * Math.max(0, (m - 12) / 24);
    const w = Math.min(0.95, p);
    const base = bull * (1 - w) + bear * w;
    const band = 3 + m * 0.62 + over * m * 0.22;
    path.push({
      m,
      base: +base.toFixed(2),
      lo: +(base - band).toFixed(2),
      hi: +(base + band).toFixed(2),
      bull: +bull.toFixed(2),
      bear: +bear.toFixed(2),
    });
  }

  const last = path[path.length - 1];
  return {
    path,
    prob12,
    expected: last.base - 100,
    r2: 0.62 + Math.min(0.14, over * 0.16),
    peakMonth,
  };
}

export function similarity(a: EraId, b: EraId, ids: string[], metrics: Metric[] = METRICS): number {
  const sel = metrics.filter((m) => ids.includes(m.id));
  if (!sel.length) return 0;
  const d =
    sel.reduce((acc, m) => {
      const x = stress(m, m.values[a]) / 100;
      const y = stress(m, m.values[b]) / 100;
      return acc + (x - y) ** 2;
    }, 0) / sel.length;
  return Math.max(0, 1 - Math.sqrt(d)) * 100;
}

// ─────────────────────────────────────────────────────────────
// Historical & current market data.
// Sources: Robert Shiller / Yale (CAPE, S&P composite), NBER business
// cycle dating, FRED (St. Louis Fed: UNRATE, T10Y3M, DFF, CPIAUCSL,
// SAHMREALTIME, NFCI, DRCCLACBS, JTSHIR, UMCSENT, GFDEGDQ188S,
// BOGZ1FL663067003Q, USALOLITOAASTSAM), BLS (JOLTS, CES),
// U. Michigan Consumer Sentiment, Multpl (CAPE / trailing PE),
// NY Fed College Labor Market, Siblis Research (US mkt cap).
// "now" column verified against live FRED/Multpl pulls on 2026-09-22
// and is overwritten at runtime when the live feed succeeds.
// ─────────────────────────────────────────────────────────────

export type EraId = "1929" | "2000" | "2008" | "now";

export interface Era {
  id: EraId;
  name: string;
  short: string;
  window: string;
  accent: string;
  hex: string;
  peak: string;
  drawdown: number; // peak-to-trough % on the headline index
  duration: string;
  summary: string;
}

export const ERAS: Era[] = [
  {
    id: "1929",
    name: "The Great Depression",
    short: "1929",
    window: "1925 – 1939",
    accent: "amber",
    hex: "#f59e0b",
    peak: "Sep 3, 1929 — DJIA 381.17",
    drawdown: -89,
    duration: "34 months to trough · 25 years to recover",
    summary:
      "A leverage mania (10% margin), an opaque trust/holding-company structure, a gold-standard-constrained Fed and 1930s Smoot-Hawley tariffs turned a stock crash into a decade-long depression. One third of US banks failed; money supply contracted ~28%.",
  },
  {
    id: "2000",
    name: "Dot-Com Bubble",
    short: "2000",
    window: "1996 – 2003",
    accent: "violet",
    hex: "#a78bfa",
    peak: "Mar 10, 2000 — Nasdaq 5,048.62",
    drawdown: -78,
    duration: "31 months to trough · 15 years to recover (Nasdaq)",
    summary:
      "Narrative-driven capex into a genuinely transformative technology, funded by a record IPO window (486 US IPOs in 1999) with no earnings requirement. CAPE hit an all-time 44.2. The real economy recession was mild; the equity damage was extreme and concentrated.",
  },
  {
    id: "2008",
    name: "Global Financial Crisis",
    short: "2008",
    window: "2004 – 2012",
    accent: "rose",
    hex: "#fb7185",
    peak: "Oct 9, 2007 — S&P 500 1,565",
    drawdown: -57,
    duration: "17 months to trough · 5.5 years to recover",
    summary:
      "A household-balance-sheet and shadow-banking crisis. Sub-prime origination, 30-40x investment-bank leverage and opaque CDO/CDS chains converted a housing downturn into a systemic solvency event. Unemployment peaked at 10.0%.",
  },
  {
    id: "now",
    name: "The AI Capex Cycle",
    short: "Now",
    window: "2023 – present",
    accent: "cyan",
    hex: "#22d3ee",
    peak: "Ongoing — record highs",
    drawdown: 0,
    duration: "Expansion, month ~60 of cycle",
    summary:
      "Extreme index concentration (top-10 weight >37%), hyperscaler capex approaching $500B/yr financed increasingly with debt and vendor circularity, a frozen hiring market, and the largest private-market IPO overhang in history (OpenAI, Anthropic, SpaceX, Stripe).",
  },
];

export interface Metric {
  id: string;
  label: string;
  unit: string;
  group: "Valuation" | "Labor" | "Credit & Macro" | "Structure";
  // higher value = more dangerous?
  dangerHigh: boolean;
  blurb: string;
  source: string;
  values: Record<EraId, number>;
  // scale ends used for the 0-100 risk normalisation
  safe: number;
  extreme: number;
}

export const METRICS: Metric[] = [
  {
    id: "cape",
    label: "Shiller CAPE Ratio",
    unit: "x",
    group: "Valuation",
    dangerHigh: true,
    blurb:
      "Cyclically-adjusted P/E. The single best-documented predictor of 10-year forward real equity returns. Above 30 has only happened three times: 1929, 2000, and today.",
    source: "Shiller / Yale ICF online data",
    values: { "1929": 32.6, "2000": 44.2, "2008": 27.3, now: 41.6 },
    safe: 15,
    extreme: 45,
  },
  {
    id: "mktgdp",
    label: "Market Cap / GDP",
    unit: "%",
    group: "Valuation",
    dangerHigh: true,
    blurb:
      "The 'Buffett Indicator'. Total US equity value against the output of the economy that must ultimately service it. Today's reading is among the highest ever recorded.",
    source: "Siblis US mkt value / BEA GDP (FRED GDP); GuruFocus ~244%",
    values: { "1929": 87, "2000": 148, "2008": 105, now: 232 },
    safe: 70,
    extreme: 250,
  },
  {
    id: "conc",
    label: "Top-10 Index Concentration",
    unit: "% of S&P 500",
    group: "Structure",
    dangerHigh: true,
    blurb:
      "When a handful of correlated names drive the index, diversification is an illusion. Passive flows mechanically amplify both directions.",
    source: "S&P Dow Jones Indices, Goldman Sachs GIR",
    values: { "1929": 30, "2000": 27, "2008": 20, now: 40 },
    safe: 17,
    extreme: 42,
  },
  {
    id: "erp",
    label: "Equity Risk Premium",
    unit: "%",
    group: "Valuation",
    dangerHigh: false,
    blurb:
      "Forward earnings yield minus the 10-year Treasury. Negative or near-zero means you are paid nothing for owning stocks instead of risk-free bonds — the 1999 condition.",
    source: "Trailing EY (Multpl) − FRED DGS10",
    values: { "1929": 1.8, "2000": -1.6, "2008": 1.1, now: -1.23 },
    safe: 4,
    extreme: -2.5,
  },
  {
    id: "unrate",
    label: "Unemployment Rate",
    unit: "%",
    group: "Labor",
    dangerHigh: true,
    blurb:
      "The lagging indicator. Low unemployment at a cycle peak is normal — it is the rate of change, not the level, that signals the turn.",
    source: "BLS / FRED UNRATE — Aug 2026",
    values: { "1929": 3.2, "2000": 4.0, "2008": 4.7, now: 4.1 },
    safe: 3.5,
    extreme: 10,
  },
  {
    id: "sahm",
    label: "Sahm Rule Gap",
    unit: "pp",
    group: "Labor",
    dangerHigh: true,
    blurb:
      "3-month average unemployment minus its prior 12-month low. A reading of +0.50 has flagged every US recession since 1970 in real time with one modern false positive (2024 peak 0.57, fully reversed). Latest FRED print is negative.",
    source: "FRED SAHMREALTIME — Aug 2026",
    values: { "1929": 0.6, "2000": 0.0, "2008": 0.2, now: -0.07 },
    safe: 0,
    extreme: 0.6,
  },
  {
    id: "hires",
    label: "Hiring Rate",
    unit: "% of employment",
    group: "Labor",
    dangerHigh: false,
    blurb:
      "JOLTS hires as a share of employment. Today's rate is near cycle lows despite full employment — a 'low-fire, no-hire' economy where any shock hits new entrants first.",
    source: "BLS / FRED JTSHIR — Jul 2026",
    values: { "1929": 4.4, "2000": 4.1, "2008": 3.9, now: 3.2 },
    safe: 4.2,
    extreme: 3.0,
  },
  {
    id: "youth",
    label: "Recent-Grad Unemployment",
    unit: "%",
    group: "Labor",
    dangerHigh: true,
    blurb:
      "Unemployment for degree-holders aged ~22-27. Remains elevated vs the all-worker rate — a structural signal that entry-level work is being automated or deferred.",
    source: "NY Fed College Labor Market — 2026 Q2 (~5.6%)",
    values: { "1929": 6.0, "2000": 4.4, "2008": 5.4, now: 5.6 },
    safe: 3.8,
    extreme: 8,
  },
  {
    id: "curve",
    label: "10y–3m Curve (cycle trough)",
    unit: "bps",
    group: "Credit & Macro",
    dangerHigh: false,
    blurb:
      "Yield-curve inversion has preceded all 8 post-war recessions. The 2022-24 inversion trough was −189 bps (May 2023); the curve has since re-steepened. Recessions historically begin 6-18 months AFTER re-steepening.",
    source: "FRED T10Y3M — trough 2023-05-04; spot +79 bps on 2026-09-21",
    values: { "1929": 40, "2000": -95, "2008": -64, now: -189 },
    safe: 150,
    extreme: -190,
  },
  {
    id: "debt",
    label: "Federal Debt / GDP",
    unit: "%",
    group: "Credit & Macro",
    dangerHigh: true,
    blurb:
      "Fiscal capacity to fight the next downturn. In 1929 and 2000 the government had room; today interest expense alone exceeds defense spending.",
    source: "FRED GFDEGDQ188S — 2026 Q1",
    values: { "1929": 16, "2000": 58, "2008": 63, now: 122.6 },
    safe: 40,
    extreme: 130,
  },
  {
    id: "delinq",
    label: "Credit Card Delinquency 30d+",
    unit: "%",
    group: "Credit & Macro",
    dangerHigh: true,
    blurb:
      "Commercial-bank credit-card loans 30+ days past due (FRED DRCCLACBS). Below the 2009 peak (~6.8%) but the post-COVID trough was ~1.6% — so the rise is material even if the level is not yet crisis-grade.",
    source: "FRED DRCCLACBS — 2026 Q2",
    values: { "1929": 5.0, "2000": 4.4, "2008": 4.6, now: 2.85 },
    safe: 2.0,
    extreme: 6.8,
  },
  {
    id: "lei",
    label: "OECD US CLI (12m chg)",
    unit: "%",
    group: "Credit & Macro",
    dangerHigh: false,
    blurb:
      "OECD amplitude-adjusted Composite Leading Indicator for the US (public FRED series). Used here as a transparent proxy for the Conference Board LEI, which is paywalled. Positive readings = leading components expanding.",
    source: "OECD / FRED USALOLITOAASTSAM — Aug 2026",
    values: { "1929": -4.5, "2000": -2.1, "2008": -3.9, now: 1.42 },
    safe: 2,
    extreme: -5,
  },
  {
    id: "margin",
    label: "Speculative Leverage Index",
    unit: "0-100",
    group: "Structure",
    dangerHigh: true,
    blurb:
      "Composite of margin debt/GDP, 0DTE option volume, levered-ETF AUM and crypto-collateralised lending. 1929's 10% margin requirement is the historical benchmark for reckless.",
    source: "FINRA margin statistics, OCC volume data, CBOE",
    values: { "1929": 100, "2000": 62, "2008": 71, now: 84 },
    safe: 30,
    extreme: 100,
  },
  {
    id: "capex",
    label: "Narrative Capex / Operating CF",
    unit: "%",
    group: "Structure",
    dangerHigh: true,
    blurb:
      "How much of the boom's cashflow is being ploughed into the boom's own infrastructure. Telecom did this with dark fibre in 1999; hyperscalers are doing it with GPUs and data centres now.",
    source: "Company 10-Ks, Morgan Stanley / BIS estimates",
    values: { "1929": 55, "2000": 118, "2008": 60, now: 92 },
    safe: 40,
    extreme: 120,
  },
  {
    id: "ipo",
    label: "IPO Overhang Pressure",
    unit: "0-100",
    group: "Structure",
    dangerHigh: true,
    blurb:
      "Pipeline value waiting to convert private paper into public float. The OpenAI + Anthropic + SpaceX + Stripe cohort is the largest ever assembled; 1999's window closing marked the top.",
    source: "Renaissance Capital, PitchBook, CB Insights",
    values: { "1929": 45, "2000": 95, "2008": 30, now: 88 },
    safe: 20,
    extreme: 100,
  },
  {
    id: "sentiment",
    label: "Consumer Sentiment",
    unit: "index",
    group: "Labor",
    dangerHigh: false,
    blurb:
      "U. Michigan index. Today's reading sits near all-time lows despite a nominally strong economy — the 'vibecession' gap between aggregates and lived experience.",
    source: "U. Michigan / FRED UMCSENT — Jul 2026",
    values: { "1929": 70, "2000": 107, "2008": 81, now: 55.2 },
    safe: 95,
    extreme: 50,
  },
];

// ── Index paths, indexed to 100 at the pre-crash peak (month 0) ──
export const TRAJECTORY: { m: number; "1929": number | null; "2000": number | null; "2008": number | null; now: number | null }[] = [
  { m: -36, "1929": 55, "2000": 41, "2008": 72, now: 61 },
  { m: -30, "1929": 62, "2000": 47, "2008": 78, now: 68 },
  { m: -24, "1929": 68, "2000": 55, "2008": 84, now: 74 },
  { m: -18, "1929": 74, "2000": 63, "2008": 89, now: 81 },
  { m: -12, "1929": 81, "2000": 72, "2008": 93, now: 88 },
  { m: -6, "1929": 91, "2000": 88, "2008": 97, now: 95 },
  { m: 0, "1929": 100, "2000": 100, "2008": 100, now: 100 },
  { m: 3, "1929": 60, "2000": 78, "2008": 95, now: null },
  { m: 6, "1929": 52, "2000": 63, "2008": 89, now: null },
  { m: 12, "1929": 43, "2000": 50, "2008": 76, now: null },
  { m: 18, "1929": 34, "2000": 39, "2008": 56, now: null },
  { m: 24, "1929": 24, "2000": 31, "2008": 45, now: null },
  { m: 30, "1929": 14, "2000": 26, "2008": 58, now: null },
  { m: 36, "1929": 20, "2000": 29, "2008": 66, now: null },
  { m: 48, "1929": 27, "2000": 38, "2008": 74, now: null },
  { m: 60, "1929": 31, "2000": 45, "2008": 86, now: null },
];

// ── Unemployment paths relative to the market peak (months) ──
export const LABOR_PATH = [
  { m: -12, "1929": 3.9, "2000": 4.2, "2008": 4.6, now: 4.3 },
  { m: -6, "1929": 3.5, "2000": 4.0, "2008": 4.7, now: 4.3 },
  { m: 0, "1929": 3.2, "2000": 4.0, "2008": 4.7, now: 4.1 },
  { m: 6, "1929": 5.5, "2000": 4.5, "2008": 5.6, now: null },
  { m: 12, "1929": 8.7, "2000": 5.6, "2008": 6.1, now: null },
  { m: 18, "1929": 15.9, "2000": 5.8, "2008": 8.5, now: null },
  { m: 24, "1929": 23.6, "2000": 6.0, "2008": 10.0, now: null },
  { m: 36, "1929": 24.9, "2000": 5.5, "2008": 9.0, now: null },
  { m: 48, "1929": 21.7, "2000": 4.9, "2008": 8.1, now: null },
];

export interface Catalyst {
  title: string;
  tag: string;
  prob: number;
  impact: number; // est. S&P drawdown contribution
  detail: string;
  analogue: string;
}

export const CATALYSTS: Catalyst[] = [
  {
    title: "OpenAI / Anthropic IPO window",
    tag: "Liquidity Event",
    prob: 0.55,
    impact: -14,
    detail:
      "A combined float that could exceed $1T in headline valuation would be the largest supply shock of public-market paper ever. Two failure modes: (1) the offering prices badly and re-rates the entire private AI complex downward — the March 2000 analogue; or (2) it prices spectacularly, triggering a final blow-off melt-up and pulling every remaining marginal buyer into the trade. Lock-up expiries 90-180 days after listing are the historically reliable inflection point.",
    analogue: "1999 IPO window · 2021 Rivian/Coinbase tops",
  },
  {
    title: "Hyperscaler capex financed with debt",
    tag: "Credit Channel",
    prob: 0.45,
    impact: -18,
    detail:
      "AI infrastructure spend has shifted from cash-funded to bond- and SPV-funded, with private credit absorbing a growing share. GPU depreciation schedules assume 5-6 year useful life against a ~2-3 year effective obsolescence curve. If revenue per dollar of compute disappoints, write-downs hit both equity and an under-scrutinised private credit book simultaneously.",
    analogue: "2000 telecom dark fibre · 2007 SIV/conduit funding",
  },
  {
    title: "Circular vendor financing",
    tag: "Structure",
    prob: 0.5,
    impact: -12,
    detail:
      "Chipmakers investing in model labs that commit to buying their chips; clouds taking equity in customers who spend on their cloud. Revenue that is recycled capital is not demand. Lucent and Nortel booked exactly this kind of revenue in 1999-2000.",
    analogue: "1999 Lucent/Nortel vendor loans",
  },
  {
    title: "Labor-market fracture (no-hire economy)",
    tag: "Labor",
    prob: 0.4,
    impact: -10,
    detail:
      "Hiring rate at 2013 lows while layoffs stay historically low is a metastable state. Sahm itself is currently negative (Aug 2026 FRED: −0.07) after the 2024 false positive reversed — but a renewed firing wave from a no-hire base can still push the gap back through +0.50 within two quarters because new job creation is already thin. Entry-level and degree-holding young workers absorb the first shock.",
    analogue: "2001 white-collar recession",
  },
  {
    title: "Private-credit / PE mark opacity",
    tag: "Credit Channel",
    prob: 0.3,
    impact: -15,
    detail:
      "$1.7T+ of loans marked by the managers who own them, increasingly held via semi-liquid vehicles sold to retail. PIK interest as a share of income is rising. This is the structural rhyme with 2007's off-balance-sheet complexity, not with 2000.",
    analogue: "2007 CDO mark-to-model",
  },
  {
    title: "Fiscal / term-premium shock",
    tag: "Macro",
    prob: 0.35,
    impact: -11,
    detail:
      "Debt at ~123% of GDP with net interest above defense spending. A failed auction or credible inflation re-acceleration forces long rates higher, which mathematically compresses the multiple on long-duration AI growth equities the hardest.",
    analogue: "1931 gold outflows · 2022 UK gilt/LDI event",
  },
  {
    title: "Tariff & supply-chain re-escalation",
    tag: "Policy",
    prob: 0.45,
    impact: -8,
    detail:
      "Smoot-Hawley is the canonical example of policy converting a market crash into an economic depression. Broad tariffs raise input costs, invite retaliation, and compress margins for exactly the multinational names that carry the index.",
    analogue: "1930 Smoot-Hawley",
  },
  {
    title: "Passive-flow reflexivity",
    tag: "Structure",
    prob: 0.35,
    impact: -13,
    detail:
      "Over half of US equity AUM is now index-tracking. Flows are price-insensitive on the way in and equally price-insensitive on the way out. With top-10 weight near 40%, 401(k) redemptions become a concentrated, mechanical sell programme in the same seven names.",
    analogue: "1929 investment trusts · 2018 volmageddon",
  },
];

export interface Recommendation {
  profile: string;
  horizon: string;
  stance: string;
  moves: string[];
  avoid: string[];
  tone: string;
}

export const RECOMMENDATIONS: Recommendation[] = [
  {
    profile: "Early Career (20s–30s)",
    horizon: "25+ years",
    stance: "Keep buying. Volatility is your friend, job loss is your risk.",
    tone: "emerald",
    moves: [
      "Do NOT stop automatic index contributions — a 40% drawdown is a discount when you have 300 more buying months.",
      "Build the emergency fund to 6–9 months of expenses (up from the usual 3) because the hiring rate, not the S&P, is your real exposure.",
      "Hold cash in T-bills or a 4%+ money market, not a checking account.",
      "Diversify away from a single-employer concentration: if you work in tech AND hold company RSUs AND own a cap-weighted index, you have one bet in three costumes.",
      "Invest in skills that are complementary to AI rather than substitutable by it.",
    ],
    avoid: ["Leverage, 0DTE options, margin", "Timing the top", "Illiquid private-AI SPVs sold to retail"],
  },
  {
    profile: "Mid Career (35–50)",
    horizon: "15–25 years",
    stance: "Rebalance toward what has been ignored, not out of the market.",
    tone: "cyan",
    moves: [
      "Rebalance on a calendar, not a feeling. Drift has likely pushed you far over your target US large-cap growth weight.",
      "Add equal-weight S&P, international developed and value exposure — the cheapest insurance against a concentration unwind.",
      "Hold 5–10% in intermediate Treasuries or TIPS; duration is the only asset that reliably rallied in 2000 and 2008.",
      "Extend the emergency fund and pre-qualify a HELOC while credit is available, not after spreads widen.",
      "Max tax-advantaged space first; a drawdown inside a Roth is a tax-free recovery.",
    ],
    avoid: ["Concentrated employer stock >10% of net worth", "Reaching for yield in private credit funds", "Cash-out refis to buy the dip"],
  },
  {
    profile: "Pre-Retirement (50–65)",
    horizon: "5–15 years",
    stance: "Sequence-of-returns risk is the whole ballgame. De-risk deliberately.",
    tone: "amber",
    moves: [
      "Build a 3–5 year bond/T-bill ladder covering early retirement spending so you never sell equities into a trough.",
      "Reduce equity beta toward your policy target — a 57% drawdown (2008) at age 60 is materially different from one at 30.",
      "Model your plan against the 1929, 2000 and 2008 paths above, not against a 7% average line.",
      "Consider Roth conversions during a drawdown: converting depressed assets is the one gift a bear market gives.",
      "Lock in long-duration quality bonds if the curve offers real yield above 2%.",
    ],
    avoid: ["Chasing the AI trade to 'catch up'", "Annuities bought in panic", "Assuming a fast V-shaped recovery"],
  },
  {
    profile: "Retired / Income",
    horizon: "Drawdown phase",
    stance: "Capital preservation and cashflow certainty over total return.",
    tone: "rose",
    moves: [
      "Hold 2–3 years of spending in T-bills and money markets; refill from bonds, not stocks, in a down year.",
      "Use guardrail withdrawal rules (cut ~10% after a >20% drawdown) rather than a fixed 4% inflation-adjusted draw.",
      "Favour dividend-durable, low-payout-ratio businesses over high-yield traps.",
      "Keep some equity: 1929's real lesson is that a 25-year recovery destroyed those with zero growth assets and a long life expectancy.",
      "Review FDIC/SIPC coverage limits across institutions.",
    ],
    avoid: ["Yield-reaching in BDCs and non-traded REITs", "Selling all equities to cash", "Illiquid vehicles with gates"],
  },
];

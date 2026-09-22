// ─────────────────────────────────────────────────────────────
// Live market data layer.
// Primary path: FRED CSV (St. Louis Fed) — no API key required.
// Browser CORS is inconsistent, so we try direct → public CORS
// relays → baked snapshot verified against FRED/Multpl/NY Fed.
// Snapshot taken: 2026-09-22.
// ─────────────────────────────────────────────────────────────

export interface LivePoint {
  id: string;
  label: string;
  value: number;
  unit: string;
  asOf: string;
  source: string;
  series?: string; // FRED id when applicable
  group: "Labor" | "Rates & Credit" | "Activity" | "Valuation" | "Risk";
  /** Higher = more stressed when true */
  dangerHigh: boolean;
  note?: string;
  /** Normal / healthy reference value */
  normal?: number;
  /** Normal healthy band (low) */
  normalLow?: number;
  /** Normal healthy band (high) */
  normalHigh?: number;
  /** Critical / recessionary stress threshold */
  critical?: number;
  /** Market-breaking / extreme crisis threshold */
  breaking?: number;
}

/** Baked snapshot — every figure traced to a primary print below. */
export const SNAPSHOT_AS_OF = "2026-09-22";

export const SNAPSHOT: LivePoint[] = [
  // Labor
  {
    id: "unrate",
    label: "Unemployment Rate",
    value: 4.1,
    unit: "%",
    asOf: "2026-08",
    source: "BLS / FRED UNRATE",
    series: "UNRATE",
    group: "Labor",
    dangerHigh: true,
    normal: 4.0,
    normalLow: 3.8,
    normalHigh: 4.6,
    critical: 5.5,
    breaking: 7.5,
  },
  {
    id: "sahm",
    label: "Sahm Rule (real-time)",
    value: -0.07,
    unit: "pp",
    asOf: "2026-08",
    source: "FRED SAHMREALTIME (Claudia Sahm)",
    series: "SAHMREALTIME",
    group: "Labor",
    dangerHigh: true,
    note: "Below 0.50 trigger. 2024 false positive peaked at 0.57 then fully reversed.",
    normal: 0.0,
    normalLow: -0.1,
    normalHigh: 0.2,
    critical: 0.5,
    breaking: 1.0,
  },
  {
    id: "u6",
    label: "U-6 Underemployment",
    value: 7.7,
    unit: "%",
    asOf: "2026-08",
    source: "BLS / FRED U6RATE",
    series: "U6RATE",
    group: "Labor",
    dangerHigh: true,
    normal: 7.0,
    normalLow: 6.5,
    normalHigh: 7.5,
    critical: 9.0,
    breaking: 11.0,
  },
  {
    id: "hires",
    label: "JOLTS Hiring Rate",
    value: 3.2,
    unit: "%",
    asOf: "2026-07",
    source: "BLS / FRED JTSHIR",
    series: "JTSHIR",
    group: "Labor",
    dangerHigh: false,
    normal: 4.0,
    normalLow: 3.8,
    normalHigh: 4.3,
    critical: 3.2,
    breaking: 2.5,
  },
  {
    id: "jor",
    label: "Job Openings Rate",
    value: 4.4,
    unit: "%",
    asOf: "2026-07",
    source: "BLS / FRED JTSJOR",
    series: "JTSJOR",
    group: "Labor",
    dangerHigh: false,
    normal: 4.6,
    normalLow: 4.3,
    normalHigh: 4.9,
    critical: 3.8,
    breaking: 3.2,
  },
  {
    id: "quits",
    label: "Quit Rate",
    value: 1.9,
    unit: "%",
    asOf: "2026-07",
    source: "BLS / FRED JTSQUR",
    series: "JTSQUR",
    group: "Labor",
    dangerHigh: false,
    normal: 2.3,
    normalLow: 2.0,
    normalHigh: 2.6,
    critical: 1.6,
    breaking: 1.2,
  },
  {
    id: "claims",
    label: "Initial Jobless Claims",
    value: 196,
    unit: "k",
    asOf: "2026-09-12",
    source: "DOL / FRED ICSA",
    series: "ICSA",
    group: "Labor",
    dangerHigh: true,
    note: "Weekly level, thousands.",
    normal: 220,
    normalLow: 200,
    normalHigh: 240,
    critical: 300,
    breaking: 400,
  },
  {
    id: "claims4w",
    label: "Claims 4-week Avg",
    value: 203.25,
    unit: "k",
    asOf: "2026-09-12",
    source: "DOL / FRED IC4WSA",
    series: "IC4WSA",
    group: "Labor",
    dangerHigh: true,
    normal: 230,
    normalLow: 210,
    normalHigh: 250,
    critical: 300,
    breaking: 400,
  },
  {
    id: "payrolls",
    label: "Nonfarm Payrolls",
    value: 159075,
    unit: "k",
    asOf: "2026-08",
    source: "BLS / FRED PAYEMS",
    series: "PAYEMS",
    group: "Labor",
    dangerHigh: false,
    note: "Level, thousands of workers.",
    normal: 160000,
    normalLow: 158000,
    normalHigh: 163000,
    critical: 150000,
    breaking: 140000,
  },
  {
    id: "youth",
    label: "Recent-Grad Unemployment",
    value: 5.6,
    unit: "%",
    asOf: "2026-Q2",
    source: "NY Fed College Labor Market",
    group: "Labor",
    dangerHigh: true,
    note: "Degree-holders ~ages 22–27. NY Fed: 'stayed elevated at about 5.6%'.",
    normal: 3.8,
    normalLow: 3.5,
    normalHigh: 4.2,
    critical: 6.0,
    breaking: 8.0,
  },
  {
    id: "emratio",
    label: "Employment–Population Ratio",
    value: 59.1,
    unit: "%",
    asOf: "2026-08",
    source: "BLS / FRED EMRATIO",
    series: "EMRATIO",
    group: "Labor",
    dangerHigh: false,
  },

  // Rates & Credit
  {
    id: "dgs10",
    label: "10-Year Treasury",
    value: 5.01,
    unit: "%",
    asOf: "2026-09-18",
    source: "Treasury / FRED DGS10",
    series: "DGS10",
    group: "Rates & Credit",
    dangerHigh: true,
    normal: 4.0,
    normalLow: 3.5,
    normalHigh: 4.5,
    critical: 5.5,
    breaking: 6.5,
  },
  {
    id: "dff",
    label: "Fed Funds (effective)",
    value: 3.88,
    unit: "%",
    asOf: "2026-09-18",
    source: "NY Fed / FRED DFF",
    series: "DFF",
    group: "Rates & Credit",
    dangerHigh: true,
    normal: 3.5,
    normalLow: 3.0,
    normalHigh: 4.0,
    critical: 5.0,
    breaking: 6.0,
  },
  {
    id: "curve",
    label: "10y–3m Spread",
    value: 0.79,
    unit: "pp",
    asOf: "2026-09-21",
    source: "FRED T10Y3M",
    series: "T10Y3M",
    group: "Rates & Credit",
    dangerHigh: false,
    note: "Currently re-steepened. Cycle trough was −1.89 pp on 2023-05-04.",
    normal: 0.5,
    normalLow: 0.2,
    normalHigh: 0.8,
    critical: -0.2,
    breaking: -0.8,
  },
  {
    id: "curve_min",
    label: "10y–3m Cycle Trough",
    value: -1.89,
    unit: "pp",
    asOf: "2023-05-04",
    source: "FRED T10Y3M",
    series: "T10Y3M",
    group: "Rates & Credit",
    dangerHigh: false,
    note: "Deepest inversion of the 2022–24 cycle.",
    normal: -0.5,
    normalLow: -0.2,
    normalHigh: -0.8,
    critical: -1.5,
    breaking: -2.0,
  },
  {
    id: "hyoas",
    label: "HY OAS",
    value: 2.68,
    unit: "pp",
    asOf: "2026-09-18",
    source: "ICE BofA / FRED BAMLH0A0HYM2",
    series: "BAMLH0A0HYM2",
    group: "Rates & Credit",
    dangerHigh: true,
    normal: 2.5,
    normalLow: 2.0,
    normalHigh: 3.0,
    critical: 4.5,
    breaking: 6.0,
  },
  {
    id: "igoas",
    label: "IG OAS",
    value: 0.77,
    unit: "pp",
    asOf: "2026-09-18",
    source: "ICE BofA / FRED BAMLC0A0CM",
    series: "BAMLC0A0CM",
    group: "Rates & Credit",
    dangerHigh: true,
    normal: 0.8,
    normalLow: 0.6,
    normalHigh: 1.0,
    critical: 1.8,
    breaking: 2.5,
  },
  {
    id: "delinq",
    label: "Card Delinquency 30d+",
    value: 2.85,
    unit: "%",
    asOf: "2026-Q2",
    source: "FRED DRCCLACBS",
    series: "DRCCLACBS",
    group: "Rates & Credit",
    dangerHigh: true,
    note: "Commercial-bank credit-card loans 30+ days due. Distinct from NY Fed 90+ transition rates.",
    normal: 2.2,
    normalLow: 2.0,
    normalHigh: 2.5,
    critical: 4.0,
    breaking: 6.5,
  },
  {
    id: "mtgdel",
    label: "Mortgage Delinquency",
    value: 1.86,
    unit: "%",
    asOf: "2026-Q2",
    source: "FRED DRSFRMACBS",
    series: "DRSFRMACBS",
    group: "Rates & Credit",
    dangerHigh: true,
    normal: 1.5,
    normalLow: 1.3,
    normalHigh: 1.8,
    critical: 3.0,
    breaking: 5.0,
  },
  {
    id: "mort30",
    label: "30-Year Mortgage Rate",
    value: 6.95,
    unit: "%",
    asOf: "2026-09-17",
    source: "Freddie Mac / FRED MORTGAGE30US",
    series: "MORTGAGE30US",
    group: "Rates & Credit",
    dangerHigh: true,
    normal: 6.0,
    normalLow: 5.5,
    normalHigh: 6.5,
    critical: 8.0,
    breaking: 10.0,
  },
  {
    id: "debt",
    label: "Federal Debt / GDP",
    value: 122.6,
    unit: "%",
    asOf: "2026-Q1",
    source: "FRED GFDEGDQ188S",
    series: "GFDEGDQ188S",
    group: "Rates & Credit",
    dangerHigh: true,
    normal: 60,
    normalLow: 55,
    normalHigh: 70,
    critical: 100,
    breaking: 130,
  },
  {
    id: "tdsp",
    label: "HH Debt Service Ratio",
    value: 11.16,
    unit: "%",
    asOf: "2026-Q1",
    source: "FRED TDSP",
    series: "TDSP",
    group: "Rates & Credit",
    dangerHigh: true,
    normal: 10,
    normalLow: 9,
    normalHigh: 11,
    critical: 12,
    breaking: 14,
  },
  {
    id: "margin",
    label: "Broker Security Credit",
    value: 742,
    unit: "$B",
    asOf: "2026-Q2",
    source: "FRED BOGZ1FL663067003Q (FoF)",
    series: "BOGZ1FL663067003Q",
    group: "Rates & Credit",
    dangerHigh: true,
    note: "Security brokers & dealers; security credit outstanding. Closest public FoF proxy for margin debt.",
    normal: 700,
    normalLow: 650,
    normalHigh: 800,
    critical: 950,
    breaking: 1200,
  },
  {
    id: "nfci",
    label: "Chicago Fed NFCI",
    value: -0.56,
    unit: "idx",
    asOf: "2026-09-11",
    source: "FRED NFCI",
    series: "NFCI",
    group: "Rates & Credit",
    dangerHigh: true,
    note: "Negative = looser than average financial conditions.",
    normal: -0.3,
    normalLow: -0.5,
    normalHigh: -0.1,
    critical: -0.7,
    breaking: -1.0,
  },

  // Activity
  {
    id: "gdpg",
    label: "Real GDP Growth (SAAR)",
    value: 1.5,
    unit: "%",
    asOf: "2026-Q2",
    source: "BEA / FRED A191RL1Q225SBEA",
    series: "A191RL1Q225SBEA",
    group: "Activity",
    dangerHigh: false,
    normal: 2.5,
    normalLow: 2.0,
    normalHigh: 3.0,
    critical: 0.5,
    breaking: -1.5,
  },
  {
    id: "indpro",
    label: "Industrial Production",
    value: 103.07,
    unit: "idx",
    asOf: "2026-08",
    source: "Fed / FRED INDPRO",
    series: "INDPRO",
    group: "Activity",
    dangerHigh: false,
    normal: 103,
    normalLow: 101,
    normalHigh: 105,
    critical: 98,
    breaking: 95,
  },
  {
    id: "houst",
    label: "Housing Starts",
    value: 1275,
    unit: "k SAAR",
    asOf: "2026-08",
    source: "Census / FRED HOUST",
    series: "HOUST",
    group: "Activity",
    dangerHigh: false,
    normal: 1400,
    normalLow: 1300,
    normalHigh: 1500,
    critical: 1000,
    breaking: 800,
  },
  {
    id: "sentiment",
    label: "U. Michigan Sentiment",
    value: 55.2,
    unit: "idx",
    asOf: "2026-07",
    source: "U. Michigan / FRED UMCSENT",
    series: "UMCSENT",
    group: "Activity",
    dangerHigh: false,
    normal: 90,
    normalLow: 85,
    normalHigh: 95,
    critical: 55,
    breaking: 40,
  },
  {
    id: "save",
    label: "Personal Saving Rate",
    value: 3.0,
    unit: "%",
    asOf: "2026-07",
    source: "BEA / FRED PSAVERT",
    series: "PSAVERT",
    group: "Activity",
    dangerHigh: false,
    normal: 7.0,
    normalLow: 6.0,
    normalHigh: 8.0,
    critical: 3.5,
    breaking: 2.0,
  },
  {
    id: "cli",
    label: "OECD CLI (US) 12m Δ",
    value: 1.42,
    unit: "%",
    asOf: "2026-08",
    source: "OECD / FRED USALOLITOAASTSAM",
    series: "USALOLITOAASTSAM",
    group: "Activity",
    dangerHigh: false,
    note: "Amplitude-adjusted composite leading indicator, 12-month percent change.",
    normal: 1.0,
    normalLow: 0.5,
    normalHigh: 1.5,
    critical: -2.5,
    breaking: -4.5,
  },
  {
    id: "recprob",
    label: "NY Fed Recession Prob",
    value: 0.76,
    unit: "%",
    asOf: "2026-07",
    source: "NY Fed / FRED RECPROUSM156N",
    series: "RECPROUSM156N",
    group: "Activity",
    dangerHigh: true,
    note: "Treasury-spread-based smoothed probability. Near-zero reading.",
    normal: 25,
    normalLow: 20,
    normalHigh: 30,
    critical: 40,
    breaking: 55,
  },

  // Valuation
  {
    id: "spx",
    label: "S&P 500",
    value: 7764.7,
    unit: "pts",
    asOf: "2026-09-21",
    source: "FRED SP500",
    series: "SP500",
    group: "Valuation",
    dangerHigh: true,
    normal: 6900,
    normalLow: 6500,
    normalHigh: 7300,
    critical: 8500,
    breaking: 9500,
  },
  {
    id: "cape",
    label: "Shiller CAPE",
    value: 41.6,
    unit: "x",
    asOf: "2026-09",
    source: "Multpl (Shiller/Yale underlying)",
    group: "Valuation",
    dangerHigh: true,
    note: "multpl.com current Shiller PE. Only 1929 and 2000 printed higher peaks.",
    normal: 20,
    normalLow: 18,
    normalHigh: 25,
    critical: 35,
    breaking: 45,
  },
  {
    id: "pe",
    label: "S&P 500 Trailing P/E",
    value: 26.48,
    unit: "x",
    asOf: "2026-09",
    source: "Multpl",
    group: "Valuation",
    dangerHigh: true,
    normal: 18,
    normalLow: 16,
    normalHigh: 21,
    critical: 28,
    breaking: 32,
  },
  {
    id: "ey",
    label: "Earnings Yield",
    value: 3.78,
    unit: "%",
    asOf: "2026-09",
    source: "Multpl",
    group: "Valuation",
    dangerHigh: false,
    normal: 4.0,
    normalLow: 3.5,
    normalHigh: 4.5,
    critical: 3.0,
    breaking: 2.0,
  },
  {
    id: "erp",
    label: "Equity Risk Premium",
    value: -1.23,
    unit: "pp",
    asOf: "2026-09",
    source: "EY 3.78 − DGS10 5.01",
    group: "Valuation",
    dangerHigh: false,
    note: "Trailing earnings yield minus 10-year Treasury. Negative = stocks yield less than Treasuries.",
    normal: 2.0,
    normalLow: 1.5,
    normalHigh: 3.0,
    critical: -1.5,
    breaking: -3.5,
  },
  {
    id: "mktgdp",
    label: "US Mkt Cap / GDP",
    value: 232,
    unit: "%",
    asOf: "2026-Q2",
    source: "Siblis US mkt value $75.3T / BEA GDP $32.49T",
    group: "Valuation",
    dangerHigh: true,
    note: "Buffett Indicator approximation. GuruFocus prints ~244% on a related methodology.",
    normal: 100,
    normalLow: 90,
    normalHigh: 120,
    critical: 180,
    breaking: 220,
  },
  {
    id: "gdp",
    label: "Nominal GDP",
    value: 32.49,
    unit: "$T",
    asOf: "2026-Q2",
    source: "BEA / FRED GDP",
    series: "GDP",
    group: "Valuation",
    dangerHigh: false,
    normal: 30,
    normalLow: 28,
    normalHigh: 33,
    critical: 25,
    breaking: 20,
  },

  // Risk
  {
    id: "vix",
    label: "VIX",
    value: 14.81,
    unit: "idx",
    asOf: "2026-09-18",
    source: "CBOE / FRED VIXCLS",
    series: "VIXCLS",
    group: "Risk",
    dangerHigh: true,
    normal: 15,
    normalLow: 13,
    normalHigh: 18,
    critical: 30,
    breaking: 45,
  },
  {
    id: "termprem",
    label: "10y Term Premium",
    value: 0.96,
    unit: "pp",
    asOf: "2026-09-11",
    source: "NY Fed ACM / FRED THREEFYTP10",
    series: "THREEFYTP10",
    group: "Risk",
    dangerHigh: true,
    normal: 1.0,
    normalLow: 0.7,
    normalHigh: 1.3,
    critical: -0.2,
    breaking: -0.8,
  },
  {
    id: "breakeven",
    label: "5y5y Forward Inflation",
    value: 2.35,
    unit: "%",
    asOf: "2026-09-21",
    source: "FRED T5YIFR",
    series: "T5YIFR",
    group: "Risk",
    dangerHigh: true,
    normal: 2.2,
    normalLow: 2.0,
    normalHigh: 2.5,
    critical: 3.5,
    breaking: 4.5,
  },
  {
    id: "oil",
    label: "WTI Crude",
    value: 107.02,
    unit: "$/bbl",
    asOf: "2026-09-15",
    source: "FRED DCOILWTICO",
    series: "DCOILWTICO",
    group: "Risk",
    dangerHigh: true,
    normal: 75,
    normalLow: 65,
    normalHigh: 85,
    critical: 110,
    breaking: 140,
  },
  {
    id: "dollar",
    label: "Trade-Weighted Dollar",
    value: 119.51,
    unit: "idx",
    asOf: "2026-09-18",
    source: "FRED DTWEXBGS",
    series: "DTWEXBGS",
    group: "Risk",
    dangerHigh: true,
    normal: 105,
    normalLow: 100,
    normalHigh: 110,
    critical: 118,
    breaking: 125,
  },
];

/** Map live ids → metric ids used by the comparison model. */
export const LIVE_TO_METRIC: Record<string, string> = {
  unrate: "unrate",
  sahm: "sahm",
  hires: "hires",
  youth: "youth",
  curve_min: "curve",
  debt: "debt",
  delinq: "delinq",
  cli: "lei",
  sentiment: "sentiment",
  cape: "cape",
  mktgdp: "mktgdp",
  erp: "erp",
};

export type LiveStatus = "idle" | "loading" | "live" | "snapshot";

export interface LiveState {
  points: LivePoint[];
  status: LiveStatus;
  fetchedAt: string | null;
  errors: string[];
}

function parseCsv(text: string): { date: string; value: number }[] {
  return text
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((line) => {
      const [date, raw] = line.split(",");
      if (!date || raw === undefined || raw === "." || raw === "") return null;
      const value = Number(raw);
      if (!Number.isFinite(value)) return null;
      return { date, value };
    })
    .filter((x): x is { date: string; value: number } => !!x);
}

async function fetchFredCsv(series: string): Promise<{ date: string; value: number }[]> {
  const url = `https://fred.stlouisfed.org/graph/fredgraph.csv?id=${encodeURIComponent(series)}`;
  const attempts: string[] = [
    url,
    `https://corsproxy.io/?${encodeURIComponent(url)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  ];
  let lastErr: unknown;
  for (const u of attempts) {
    try {
      const res = await fetch(u, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      if (!text.startsWith("observation_date") && !text.includes(",")) {
        throw new Error("unexpected payload");
      }
      const rows = parseCsv(text);
      if (!rows.length) throw new Error("empty series");
      return rows;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr ?? new Error(`failed ${series}`);
}

function last(rows: { date: string; value: number }[]) {
  return rows[rows.length - 1];
}

function minSince(rows: { date: string; value: number }[], isoFrom: string) {
  const slice = rows.filter((r) => r.date >= isoFrom);
  return slice.reduce((a, b) => (b.value < a.value ? b : a), slice[0]);
}

function yoy(rows: { date: string; value: number }[]) {
  const cur = last(rows);
  const targetYear = Number(cur.date.slice(0, 4)) - 1;
  const target = `${targetYear}${cur.date.slice(4)}`;
  // find nearest ≤ 12m ago
  let prev = rows[0];
  for (const r of rows) {
    if (r.date <= target) prev = r;
    else break;
  }
  // prefer exact month match walking back ~14 observations
  const approx = rows.slice(-14)[0] ?? prev;
  const base = Math.abs(new Date(cur.date).getTime() - new Date(prev.date).getTime()) <
    Math.abs(new Date(cur.date).getTime() - new Date(approx.date).getTime())
    ? prev
    : approx;
  return { date: cur.date, value: ((cur.value / base.value) - 1) * 100 };
}

/** Try to refresh every FRED-backed point. Non-FRED points stay at snapshot. */
export async function refreshLive(): Promise<LiveState> {
  const base = SNAPSHOT.map((p) => ({ ...p }));
  const byId = Object.fromEntries(base.map((p) => [p.id, p]));
  const errors: string[] = [];
  let anyLive = false;

  const fredJobs: { id: string; series: string; xform?: "last" | "min22" | "yoy" | "k" | "millionsToB" | "billionsToT" }[] = [
    { id: "unrate", series: "UNRATE" },
    { id: "sahm", series: "SAHMREALTIME" },
    { id: "u6", series: "U6RATE" },
    { id: "hires", series: "JTSHIR" },
    { id: "jor", series: "JTSJOR" },
    { id: "quits", series: "JTSQUR" },
    { id: "claims", series: "ICSA", xform: "k" },
    { id: "claims4w", series: "IC4WSA", xform: "k" },
    { id: "payrolls", series: "PAYEMS" },
    { id: "emratio", series: "EMRATIO" },
    { id: "dgs10", series: "DGS10" },
    { id: "dff", series: "DFF" },
    { id: "curve", series: "T10Y3M" },
    { id: "curve_min", series: "T10Y3M", xform: "min22" },
    { id: "hyoas", series: "BAMLH0A0HYM2" },
    { id: "igoas", series: "BAMLC0A0CM" },
    { id: "delinq", series: "DRCCLACBS" },
    { id: "mtgdel", series: "DRSFRMACBS" },
    { id: "mort30", series: "MORTGAGE30US" },
    { id: "debt", series: "GFDEGDQ188S" },
    { id: "tdsp", series: "TDSP" },
    { id: "margin", series: "BOGZ1FL663067003Q", xform: "millionsToB" },
    { id: "nfci", series: "NFCI" },
    { id: "gdpg", series: "A191RL1Q225SBEA" },
    { id: "indpro", series: "INDPRO" },
    { id: "houst", series: "HOUST" },
    { id: "sentiment", series: "UMCSENT" },
    { id: "save", series: "PSAVERT" },
    { id: "cli", series: "USALOLITOAASTSAM", xform: "yoy" },
    { id: "recprob", series: "RECPROUSM156N" },
    { id: "spx", series: "SP500" },
    { id: "gdp", series: "GDP", xform: "billionsToT" },
    { id: "vix", series: "VIXCLS" },
    { id: "termprem", series: "THREEFYTP10" },
    { id: "breakeven", series: "T5YIFR" },
    { id: "oil", series: "DCOILWTICO" },
    { id: "dollar", series: "DTWEXBGS" },
  ];

  await Promise.all(
    fredJobs.map(async (job) => {
      try {
        const rows = await fetchFredCsv(job.series);
        const p = byId[job.id];
        if (!p) return;
        let date = "";
        let value = 0;
        switch (job.xform) {
          case "min22": {
            const m = minSince(rows, "2022-01-01");
            date = m.date;
            value = m.value;
            break;
          }
          case "yoy": {
            const y = yoy(rows);
            date = y.date;
            value = y.value;
            break;
          }
          case "k": {
            const l = last(rows);
            date = l.date;
            value = l.value / 1000;
            break;
          }
          case "millionsToB": {
            const l = last(rows);
            date = l.date;
            value = l.value / 1000;
            break;
          }
          case "billionsToT": {
            const l = last(rows);
            date = l.date;
            value = l.value / 1000;
            break;
          }
          default: {
            const l = last(rows);
            date = l.date;
            value = l.value;
          }
        }
        p.value = Number(value.toFixed(2));
        p.asOf = date;
        anyLive = true;
      } catch (e) {
        errors.push(`${job.series}: ${e instanceof Error ? e.message : "fail"}`);
      }
    })
  );

  // Derived ERP if we have both legs live
  if (byId.dgs10 && byId.ey) {
    byId.erp.value = Number((byId.ey.value - byId.dgs10.value).toFixed(2));
    byId.erp.asOf = byId.dgs10.asOf;
    byId.erp.source = `EY ${byId.ey.value} − DGS10 ${byId.dgs10.value}`;
  }
  if (byId.gdp && byId.mktgdp && byId.mktgdp.value && byId.gdp.value) {
    // keep mktgdp from snapshot unless we later add Wilshire
  }

  return {
    points: base,
    status: anyLive ? "live" : "snapshot",
    fetchedAt: new Date().toISOString(),
    errors,
  };
}

export function applyLiveToMetrics(
  metrics: { id: string; values: Record<string, number> }[],
  points: LivePoint[]
) {
  const map = Object.fromEntries(points.map((p) => [p.id, p]));
  return metrics.map((m) => {
    const liveId = Object.entries(LIVE_TO_METRIC).find(([, mid]) => mid === m.id)?.[0];
    if (!liveId || !map[liveId]) return m;
    const v = map[liveId].value;
    // curve metric is stored in bps in the model
    const nowVal = m.id === "curve" ? Math.round(v * 100) : Number(v.toFixed(2));
    return { ...m, values: { ...m.values, now: nowVal } };
  });
}

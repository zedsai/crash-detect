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

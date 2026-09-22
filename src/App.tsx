import { useCallback, useEffect, useMemo, useState } from "react";
import { METRICS, type EraId, type Metric } from "./data/datasets";
import {
  SNAPSHOT,
  applyLiveToMetrics,
  refreshLive,
  type LivePoint,
  type LiveStatus,
} from "./data/live";
import { recessionProb } from "./lib/model";
import Compare from "./sections/Compare";
import Forecast from "./sections/Forecast";
import Catalysts from "./sections/Catalysts";
import Playbook from "./sections/Playbook";
import LiveData from "./sections/LiveData";
import { riskColor } from "./components/Shared";

const TABS = [
  { id: "live", label: "Live" },
  { id: "compare", label: "Compare" },
  { id: "forecast", label: "Forecast" },
  { id: "catalysts", label: "Catalysts" },
  { id: "playbook", label: "Playbook" },
] as const;

type Tab = (typeof TABS)[number]["id"];

export default function App() {
  const [tab, setTab] = useState<Tab>("live");
  const [selected, setSelected] = useState<string[]>(METRICS.map((m) => m.id));
  const [eras, setEras] = useState<EraId[]>(["1929", "2000", "2008", "now"]);

  const [points, setPoints] = useState<LivePoint[]>(SNAPSHOT);
  const [status, setStatus] = useState<LiveStatus>("snapshot");
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>(METRICS);

  const pull = useCallback(async () => {
    setStatus("loading");
    try {
      const state = await refreshLive();
      setPoints(state.points);
      setStatus(state.status);
      setFetchedAt(state.fetchedAt);
      setErrors(state.errors);
      setMetrics(applyLiveToMetrics(METRICS, state.points) as Metric[]);
    } catch (e) {
      setStatus("snapshot");
      setErrors([e instanceof Error ? e.message : "refresh failed"]);
      setFetchedAt(new Date().toISOString());
    }
  }, []);

  useEffect(() => {
    void pull();
  }, [pull]);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? (s.length > 1 ? s.filter((x) => x !== id) : s) : [...s, id]));
  const toggleEra = (id: EraId) =>
    setEras((s) => (s.includes(id) ? (s.length > 1 ? s.filter((x) => x !== id) : s) : [...s, id]));

  // eraStress/recessionProb read from module-level METRICS; compute against live-overlaid copy
  const risk = useMemo(() => {
    const sel = metrics.filter((m) => selected.includes(m.id));
    if (!sel.length) return 0;
    const { stress } = requireScore(sel);
    return stress;
  }, [metrics, selected]);

  const prob = recessionProb(risk, 0.55 * 0.9 - 0.2 * 0.8 - 0.7 * 0.7) * 100;

  return (
    <div className="min-h-screen bg-[#07090d] text-zinc-200 antialiased">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-[36rem] w-[36rem] rounded-full bg-cyan-500/8 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-[32rem] w-[32rem] rounded-full bg-rose-500/8 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[28rem] w-[28rem] rounded-full bg-violet-500/7 blur-[120px]" />
      </div>

      <header className="sticky top-0 z-30 border-b border-white/8 bg-[#07090d]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 17l5-6 4 4 5-8" />
                <path d="M17 7h4v4" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight text-zinc-50">CRASHSCOPE</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                1929 · 2000 · 2008 · now
              </div>
            </div>
          </div>

          <nav className="order-3 flex w-full gap-1 overflow-x-auto rounded-xl border border-white/8 bg-white/[0.03] p-1 md:order-none md:ml-6 md:w-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition md:px-4 ${
                  tab === t.id
                    ? "bg-white/10 text-zinc-50 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-4 sm:gap-5">
            <div className="hidden text-right sm:block">
              <div className="text-[10px] uppercase tracking-wider text-zinc-500">Data</div>
              <div
                className="text-xs font-semibold leading-none"
                style={{
                  color:
                    status === "live" ? "#34d399" : status === "loading" ? "#fbbf24" : "#22d3ee",
                }}
              >
                {status === "live" ? "LIVE" : status === "loading" ? "…" : "SNAPSHOT"}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-zinc-500">Composite risk</div>
              <div className="text-lg font-semibold leading-none tabular-nums" style={{ color: riskColor(risk) }}>
                {risk.toFixed(0)}
                <span className="text-xs text-zinc-600">/100</span>
              </div>
            </div>
            <div className="hidden text-right sm:block">
              <div className="text-[10px] uppercase tracking-wider text-zinc-500">P(recession 12m)</div>
              <div className="text-lg font-semibold leading-none tabular-nums" style={{ color: riskColor(prob) }}>
                {prob.toFixed(0)}%
              </div>
            </div>
            <span className="relative flex h-2.5 w-2.5">
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                style={{ background: riskColor(risk) }}
              />
              <span
                className="relative inline-flex h-2.5 w-2.5 rounded-full"
                style={{ background: riskColor(risk) }}
              />
            </span>
          </div>
        </div>
      </header>

      {tab === "compare" && (
        <section className="relative mx-auto max-w-7xl px-5 pt-14">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              Live-backed by FRED · Shiller/Multpl · BLS · NY Fed · OECD · BEA
            </div>
            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-zinc-50 sm:text-6xl">
              History doesn&apos;t repeat.
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400 bg-clip-text text-transparent">
                It regresses to the mean.
              </span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-zinc-400">
              A side-by-side of the three great American market breaks and the one we are living in — the
              valuation, labor, credit and structural indicators that preceded each, a regression model for what
              comes next, and a concrete playbook for your money. Current-era figures refresh from primary sources.
            </p>
          </div>
        </section>
      )}

      <main className="relative mx-auto max-w-7xl px-5 py-12">
        {tab === "live" && (
          <LiveData
            points={points}
            status={status}
            fetchedAt={fetchedAt}
            errors={errors}
            onRefresh={pull}
          />
        )}
        {tab === "compare" && (
          <Compare
            selected={selected}
            toggle={toggle}
            eras={eras}
            toggleEra={toggleEra}
            metrics={metrics}
          />
        )}
        {tab === "forecast" && <Forecast selected={selected} metrics={metrics} />}
        {tab === "catalysts" && <Catalysts />}
        {tab === "playbook" && <Playbook selected={selected} metrics={metrics} />}
      </main>

      <footer className="relative border-t border-white/8 px-5 py-10">
        <div className="mx-auto max-w-7xl space-y-3 text-xs leading-relaxed text-zinc-500">
          <p>
            <strong className="text-zinc-400">Live sources.</strong> FRED (St. Louis Fed) CSV endpoints for
            UNRATE, SAHMREALTIME, JTSHIR, JTSJOR, JTSQUR, ICSA, IC4WSA, PAYEMS, U6RATE, EMRATIO, DGS10, DFF,
            T10Y3M, BAMLH0A0HYM2, BAMLC0A0CM, DRCCLACBS, DRSFRMACBS, MORTGAGE30US, GFDEGDQ188S, TDSP,
            BOGZ1FL663067003Q, NFCI, A191RL1Q225SBEA, INDPRO, HOUST, UMCSENT, PSAVERT, USALOLITOAASTSAM,
            RECPROUSM156N, SP500, GDP, VIXCLS, THREEFYTP10, T5YIFR, DCOILWTICO, DTWEXBGS. Valuation overlays:
            Multpl Shiller CAPE &amp; trailing PE/earnings yield; Siblis Research US market value; NY Fed
            College Labor Market (recent-grad unemployment). Snapshot verified 2026-09-22; Live tab re-pulls on
            demand.
          </p>
          <p>
            <strong className="text-zinc-400">Disclaimer.</strong> CRASHSCOPE is an educational modelling tool.
            The regression is calibrated to historical relationships that may not hold. Nothing here is
            investment, tax or legal advice. Forecast intervals are model output, not probabilities about the
            real world. Always click through to the FRED series link on each tile to confirm the latest print.
          </p>
        </div>
      </footer>
    </div>
  );
}

/** Local stress average so header tracks live-overlaid metrics. */
function requireScore(sel: Metric[]) {
  let sum = 0;
  for (const m of sel) {
    const v = m.values.now;
    const t = (v - m.safe) / (m.extreme - m.safe);
    sum += Math.max(0, Math.min(100, t * 100));
  }
  return { stress: sum / sel.length };
}

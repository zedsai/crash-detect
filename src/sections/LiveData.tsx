import { useMemo, useState } from "react";
import type { LivePoint, LiveStatus } from "../data/live";
import { SNAPSHOT_AS_OF } from "../data/live";
import { Card, Pill, SectionTitle } from "../components/Shared";

const GROUPS = ["Labor", "Rates & Credit", "Activity", "Valuation", "Risk"] as const;

type ScoreLevel = "Normal" | "Abnormal" | "Critical" | "Market Breaking";

function getScore(p: LivePoint): { level: ScoreLevel; color: string; desc: string; delta: string } {
  const { normal, normalLow, normalHigh, critical, breaking, dangerHigh, value } = p;
  if (normal === undefined || critical === undefined) {
    return { level: "Normal", color: "#64748b", desc: "No benchmark set", delta: "" };
  }
  let level: ScoreLevel = "Normal";
  let color = "#34d399"; // emerald
  let deltaStr = "";

  const nl = normalLow ?? normal;
  const nh = normalHigh ?? normal;
  if (dangerHigh) {
    // Higher is worse
    if (value >= (breaking ?? Infinity)) {
      level = "Market Breaking"; color = "#fb7185"; deltaStr = `+${value - (nh ?? value)} above normal`;
    } else if (value >= (critical ?? Infinity)) {
      level = "Critical"; color = "#f87171"; deltaStr = `+${value - (nh ?? value)} above normal`;
    } else if (value > nh) {
      level = "Abnormal"; color = "#fbbf24"; deltaStr = `+${value - (nh ?? value)} above normal`;
    } else {
      level = "Normal"; color = "#34d399"; deltaStr = value <= nl ? `${(nl - value).toFixed(1)} below band` : `within normal`;
    }
  } else {
    // Lower is worse
    if (value <= (breaking ?? -Infinity)) {
      level = "Market Breaking"; color = "#fb7185"; deltaStr = `-${(nl ?? value) - value} below normal`;
    } else if (value <= (critical ?? -Infinity)) {
      level = "Critical"; color = "#f87171"; deltaStr = `-${(nl ?? value) - value} below normal`;
    } else if (value < nl) {
      level = "Abnormal"; color = "#fbbf24"; deltaStr = `-${(nl ?? value) - value} below normal`;
    } else {
      level = "Normal"; color = "#34d399"; deltaStr = value >= nh ? `${(value - nh).toFixed(1)} above band` : `within normal`;
    }
  }
  return { level, color, desc: deltaStr, delta: deltaStr };
}

export default function LiveData({
  points,
  status,
  fetchedAt,
  errors,
  onRefresh,
}: {
  points: LivePoint[];
  status: LiveStatus;
  fetchedAt: string | null;
  errors: string[];
  onRefresh: () => void;
}) {
  const [q, setQ] = useState("");
  const [group, setGroup] = useState<(typeof GROUPS)[number] | "All">("All");
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return points.filter((p) => {
      if (group !== "All" && p.group !== group) return false;
      if (!qq) return true;
      return (
        p.label.toLowerCase().includes(qq) ||
        p.source.toLowerCase().includes(qq) ||
        (p.series ?? "").toLowerCase().includes(qq) ||
        p.id.includes(qq)
      );
    });
  }, [points, q, group]);

  const statusPill =
    status === "live"
      ? { hex: "#34d399", t: "Live FRED feed" }
      : status === "loading"
        ? { hex: "#fbbf24", t: "Refreshing…" }
        : status === "snapshot"
          ? { hex: "#22d3ee", t: `Snapshot ${SNAPSHOT_AS_OF}` }
          : { hex: "#a1a1aa", t: "Idle" };

  async function handleRefresh() {
    setBusy(true);
    try {
      await onRefresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <SectionTitle
        eyebrow="Live market tape"
        title="Primary-source prints, refreshed on demand"
        sub="Every tile is wired to a named public series. Click Refresh to re-pull FRED CSVs in the browser (via direct request, then public CORS relays). If the network path is blocked, the app keeps the verified 2026-09-22 snapshot so numbers never go blank."
      />

      <Card className="flex flex-wrap items-center gap-3 p-4">
        <Pill hex={statusPill.hex}>{statusPill.t}</Pill>
        {fetchedAt && (
          <span className="text-[11px] text-zinc-500">
            last attempt {new Date(fetchedAt).toLocaleString()}
          </span>
        )}
        <span className="text-[11px] text-zinc-500">
          {points.length} series · {filtered.length} shown
        </span>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter series…"
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-cyan-400/40"
          />
          <button
            onClick={handleRefresh}
            disabled={busy || status === "loading"}
            className="rounded-lg bg-cyan-500/20 px-3 py-1.5 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/30 disabled:opacity-50"
          >
            {busy || status === "loading" ? "Pulling FRED…" : "Refresh live"}
          </button>
        </div>
      </Card>

      <div className="flex flex-wrap gap-2">
        {(["All", ...GROUPS] as const).map((g) => (
          <button
            key={g}
            onClick={() => setGroup(g)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
              group === g
                ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
                : "border-white/8 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((p) => {
          const scoreInfo = getScore(p);
          return (
            <Card key={p.id} className="p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 h-0.5 w-full" style={{ background: scoreInfo.color }} />
              <div className="flex items-start justify-between gap-2">
                <div className="text-[10px] uppercase tracking-wider text-zinc-500">{p.group}</div>
                {p.series && (
                  <a
                    href={`https://fred.stlouisfed.org/series/${p.series}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-cyan-500/80 hover:text-cyan-300"
                  >
                    {p.series} ↗
                  </a>
                )}
              </div>
              <div className="mt-1 text-sm font-medium text-zinc-200">{p.label}</div>
              <div className="flex items-baseline gap-3 mt-2">
                <div className="text-2xl font-semibold tabular-nums tracking-tight text-zinc-50">
                  {p.unit.startsWith("$") ? (
                    <>
                      <span className="text-lg text-zinc-500">{p.unit[0]}</span>
                      {p.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      <span className="ml-1 text-sm font-medium text-zinc-500">{p.unit.slice(1)}</span>
                    </>
                  ) : (
                    <>
                      {p.value.toLocaleString(undefined, {
                        maximumFractionDigits: Math.abs(p.value) >= 100 ? 1 : 2,
                      })}
                      <span className="ml-1 text-sm font-medium text-zinc-500">{p.unit}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold"
                  style={{ borderColor: scoreInfo.color + "40", background: scoreInfo.color + "18", color: scoreInfo.color }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: scoreInfo.color }} />
                  {scoreInfo.level}
                </span>
                {p.normal !== undefined && (
                  <span className="text-[11px] text-zinc-400 tabular-nums">
                    normal {p.normal.toLocaleString(undefined, { maximumFractionDigits: Math.abs(p.normal) >= 100 ? 0 : 1 })}
                    {p.unit}
                  </span>
                )}
              </div>
              <div className="mt-1 text-[11px] leading-relaxed text-zinc-500">
                {scoreInfo.delta ? scoreInfo.delta : `as of ${p.asOf}`}
              </div>
              {p.critical !== undefined && (
                <div className="mt-1 text-[10px] text-zinc-600 tabular-nums">
                  abnormal &gt; {p.normalHigh?.toLocaleString()}{p.unit} · critical ≥ {p.critical?.toLocaleString()}{p.unit} · breaking ≥ {p.breaking?.toLocaleString()}{p.unit}
                </div>
              )}
              <div className="mt-2 truncate text-[10px] text-zinc-600" title={p.source}>
                {p.source}
              </div>
              {p.note && <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">{p.note}</p>}
            </Card>
          );
        })}
      </div>

      {!!errors.length && (
        <Card className="p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Fetch notes ({errors.length})
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">
            Some series fell back to the verified snapshot. Browser CORS often blocks direct FRED
            access; relays are tried automatically.
          </p>
          <ul className="mt-2 max-h-40 space-y-1 overflow-auto text-[10px] text-zinc-600">
            {errors.slice(0, 12).map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </Card>
      )}

      <Card className="p-5">
        <h4 className="text-sm font-semibold text-zinc-100">How the live layer works</h4>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {[
            [
              "1. Snapshot boot",
              "App loads instantly with a 2026-09-22 snapshot hand-checked against FRED CSVs, Multpl CAPE/PE, NY Fed college-labor notes and Siblis market-cap.",
            ],
            [
              "2. FRED pull",
              "Refresh requests fred.stlouisfed.org/graph/fredgraph.csv?id=… for each series, then corsproxy.io and allorigins relays if the browser blocks direct access.",
            ],
            [
              "3. Model hook-up",
              "Successful pulls overwrite the 'now' column on matching comparison metrics (Sahm, UNRATE, CAPE inputs, debt/GDP, curve trough, hires, sentiment, etc.) so gauges and the forecast move with the tape.",
            ],
          ].map(([t, b]) => (
            <div key={t} className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
              <div className="text-xs font-semibold text-cyan-300">{t}</div>
              <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">{b}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[11px] leading-relaxed text-zinc-500">
          Non-FRED prints (Shiller CAPE via Multpl, Buffett Indicator via Siblis/GDP, recent-grad
          unemployment via NY Fed) stay on the latest verified snapshot until those publishers expose
          a CORS-friendly endpoint. Units: DRCCLACBS is bank-card 30+ day delinquency (not NY Fed
          90-day transitions); curve metric uses the 2022–24 trough (−189 bps) for cross-era stress
          comparison while the live spot spread is shown separately above.
        </p>
      </Card>
    </div>
  );
}

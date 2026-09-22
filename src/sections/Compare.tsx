import { useState } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ReferenceLine,
} from "recharts";
import { ERAS, METRICS as DEFAULT_METRICS, TRAJECTORY, LABOR_PATH, type EraId, type Metric } from "../data/datasets";
import { stress, eraStress, similarity } from "../lib/model";
import { Bar, Card, Gauge, Pill, SectionTitle, riskColor } from "../components/Shared";

const tipStyle = {
  background: "#0b0e14",
  border: "1px solid #ffffff18",
  borderRadius: 12,
  fontSize: 12,
  color: "#e4e4e7",
};

export default function Compare({
  selected,
  toggle,
  eras,
  toggleEra,
  metrics = DEFAULT_METRICS,
}: {
  selected: string[];
  toggle: (id: string) => void;
  eras: EraId[];
  toggleEra: (id: EraId) => void;
  metrics?: Metric[];
}) {
  const [chart, setChart] = useState<"index" | "labor">("index");
  const groups = Array.from(new Set(metrics.map((m) => m.group)));

  return (
    <div className="space-y-10">
      <div>
        <SectionTitle
          eyebrow="Side by side"
          title="Four manias, one framework"
          sub="Every bubble looks unique from inside it. Normalising each era's readings onto a common 0–100 stress scale shows where today genuinely rhymes — and where it does not."
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {ERAS.map((e) => {
            const s = eraStress(e.id, selected, metrics);
            const on = eras.includes(e.id);
            return (
              <Card
                key={e.id}
                glow={e.hex}
                className={`cursor-pointer p-5 transition ${on ? "ring-1" : "opacity-55 hover:opacity-90"}`}
              >
                <div onClick={() => toggleEra(e.id)} style={{ outlineColor: e.hex }}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs text-zinc-500">{e.window}</div>
                      <h3 className="mt-0.5 text-lg font-semibold text-zinc-50">{e.name}</h3>
                    </div>
                    <Pill hex={e.hex}>{on ? "shown" : "hidden"}</Pill>
                  </div>
                  <div className="mt-4 flex items-end gap-4">
                    <div>
                      <div className="text-3xl font-semibold tabular-nums" style={{ color: e.hex }}>
                        {e.drawdown === 0 ? "—" : `${e.drawdown}%`}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-zinc-500">peak→trough</div>
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 flex justify-between text-[10px] text-zinc-500">
                        <span>stress</span>
                        <span className="tabular-nums" style={{ color: riskColor(s) }}>
                          {s.toFixed(0)}
                        </span>
                      </div>
                      <Bar pct={s} hex={riskColor(s)} />
                    </div>
                  </div>
                  <p className="mt-4 text-xs leading-relaxed text-zinc-400">{e.summary}</p>
                  <div className="mt-3 border-t border-white/8 pt-3 text-[11px] text-zinc-500">
                    {e.peak} · {e.duration}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card className="p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-zinc-100">
                {chart === "index" ? "Index path around the peak" : "Unemployment around the peak"}
              </h3>
              <p className="text-xs text-zinc-500">
                {chart === "index"
                  ? "Headline index = 100 at each era's pre-crash peak (month 0)."
                  : "The labor market always turns after the market, never before."}
              </p>
            </div>
            <div className="flex rounded-lg border border-white/10 bg-white/5 p-0.5 text-xs">
              {(["index", "labor"] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setChart(c)}
                  className={`rounded-md px-3 py-1.5 font-medium transition ${
                    chart === c ? "bg-cyan-500/20 text-cyan-300" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {c === "index" ? "Equities" : "Jobs"}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[340px]">
            <ResponsiveContainer>
              <LineChart data={chart === "index" ? TRAJECTORY : LABOR_PATH}>
                <CartesianGrid stroke="#ffffff0d" vertical={false} />
                <XAxis
                  dataKey="m"
                  tick={{ fill: "#71717a", fontSize: 11 }}
                  tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}m`}
                  stroke="#ffffff18"
                />
                <YAxis
                  tick={{ fill: "#71717a", fontSize: 11 }}
                  stroke="#ffffff18"
                  unit={chart === "labor" ? "%" : ""}
                />
                <ReferenceLine x={0} stroke="#ffffff30" strokeDasharray="4 4" />
                <Tooltip contentStyle={tipStyle} labelFormatter={(v) => `Month ${v}`} />
                <Legend wrapperStyle={{ fontSize: 11, color: "#a1a1aa" }} />
                {ERAS.filter((e) => eras.includes(e.id)).map((e) => (
                  <Line
                    key={e.id}
                    type="monotone"
                    dataKey={e.id}
                    name={e.short}
                    stroke={e.hex}
                    strokeWidth={e.id === "now" ? 3 : 2}
                    dot={false}
                    strokeDasharray={e.id === "now" ? "0" : undefined}
                    connectNulls={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-base font-semibold text-zinc-100">Pattern fingerprint</h3>
          <p className="mb-2 text-xs text-zinc-500">Selected indicators, normalised stress.</p>
          <div className="h-[290px]">
            <ResponsiveContainer>
              <RadarChart
                data={metrics.filter((m) => selected.includes(m.id)).map((m) => {
                  const row: Record<string, number | string> = { k: m.label.split(" ")[0] };
                  ERAS.forEach((e) => (row[e.id] = +stress(m, m.values[e.id]).toFixed(1)));
                  return row;
                })}
              >
                <PolarGrid stroke="#ffffff12" />
                <PolarAngleAxis dataKey="k" tick={{ fill: "#71717a", fontSize: 9 }} />
                <Tooltip contentStyle={tipStyle} />
                {ERAS.filter((e) => eras.includes(e.id)).map((e) => (
                  <Radar
                    key={e.id}
                    dataKey={e.id}
                    name={e.short}
                    stroke={e.hex}
                    fill={e.hex}
                    fillOpacity={e.id === "now" ? 0.22 : 0.08}
                  />
                ))}
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 border-t border-white/8 pt-4">
            <div className="text-[11px] uppercase tracking-wider text-zinc-500">
              Similarity of today to…
            </div>
            {(["1929", "2000", "2008"] as EraId[]).map((id) => {
              const sim = similarity("now", id, selected, metrics);
              const era = ERAS.find((e) => e.id === id)!;
              return (
                <div key={id} className="flex items-center gap-3">
                  <span className="w-12 text-xs text-zinc-400">{era.short}</span>
                  <div className="flex-1">
                    <Bar pct={sim} hex={era.hex} />
                  </div>
                  <span className="w-10 text-right text-xs tabular-nums text-zinc-300">
                    {sim.toFixed(0)}%
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div>
        <SectionTitle
          eyebrow="Indicator explorer"
          title="Pick your evidence"
          sub="Toggle indicators to rebuild the fingerprint, the similarity scores and the forecast composite. Every series is drawn from a primary public source."
        />
        <div className="space-y-6">
          {groups.map((g) => (
            <div key={g}>
              <div className="mb-3 flex items-center gap-3">
                <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">{g}</h4>
                <div className="h-px flex-1 bg-white/8" />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {metrics.filter((m) => m.group === g).map((m) => {
                  const on = selected.includes(m.id);
                  const sNow = stress(m, m.values.now);
                  return (
                    <Card
                      key={m.id}
                      className={`cursor-pointer p-4 transition ${
                        on ? "border-cyan-400/30 bg-cyan-400/[0.04]" : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      <div onClick={() => toggle(m.id)}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <div
                              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                                on ? "border-cyan-400 bg-cyan-400/25" : "border-white/20"
                              }`}
                            >
                              {on && (
                                <svg viewBox="0 0 12 12" className="h-3 w-3 text-cyan-300">
                                  <path d="M2 6l3 3 5-6" fill="none" stroke="currentColor" strokeWidth="2" />
                                </svg>
                              )}
                            </div>
                            <span className="text-sm font-medium text-zinc-100">{m.label}</span>
                          </div>
                          <span
                            className="shrink-0 text-xs font-semibold tabular-nums"
                            style={{ color: riskColor(sNow) }}
                          >
                            {sNow.toFixed(0)}
                          </span>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-zinc-400">{m.blurb}</p>
                        <div className="mt-3 grid grid-cols-4 gap-2">
                          {ERAS.map((e) => (
                            <div key={e.id} className="rounded-lg bg-white/[0.03] p-2 text-center">
                              <div className="text-[9px] uppercase tracking-wider text-zinc-500">
                                {e.short}
                              </div>
                              <div
                                className="text-sm font-semibold tabular-nums"
                                style={{ color: e.hex }}
                              >
                                {m.values[e.id]}
                              </div>
                              <div className="text-[9px] text-zinc-600">{m.unit}</div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 text-[10px] text-zinc-600">Source: {m.source}</div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-around gap-6">
          {ERAS.map((e) => (
            <Gauge key={e.id} value={eraStress(e.id, selected, metrics)} label={e.name} hex={e.hex} />
          ))}
        </div>
      </Card>
    </div>
  );
}

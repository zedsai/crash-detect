import { useMemo, useState } from "react";
import {
  Area,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from "recharts";
import { eraStress, forecast } from "../lib/model";
import type { Metric } from "../data/datasets";
import { Card, Pill, SectionTitle, riskColor } from "../components/Shared";

const tipStyle = {
  background: "#0b0e14",
  border: "1px solid #ffffff18",
  borderRadius: 12,
  fontSize: 12,
  color: "#e4e4e7",
};

function Slider({
  label,
  value,
  set,
  min,
  max,
  step,
  fmt,
  hint,
}: {
  label: string;
  value: number;
  set: (v: number) => void;
  min: number;
  max: number;
  step: number;
  fmt: (v: number) => string;
  hint: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label className="text-xs font-medium text-zinc-300">{label}</label>
        <span className="text-xs font-semibold tabular-nums text-cyan-300">{fmt(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => set(parseFloat(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-cyan-400"
      />
      <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-500">{hint}</p>
    </div>
  );
}

export default function Forecast({ selected, metrics }: { selected: string[]; metrics?: Metric[] }) {
  const [ipo, setIpo] = useState(0.55);
  const [policy, setPolicy] = useState(-0.2);
  const [capex, setCapex] = useState(0.7);
  const [horizon, setHorizon] = useState(36);

  const composite = eraStress("now", selected, metrics);
  const f = useMemo(
    () => forecast({ composite, ipoShock: ipo, policy, capexPersistence: capex, horizon }),
    [composite, ipo, policy, capex, horizon]
  );

  const band = f.path.map((p) => ({ ...p, range: [p.lo, p.hi] as [number, number] }));
  const prob = f.prob12 * 100;

  return (
    <div className="space-y-8">
      <SectionTitle
        eyebrow="Regression model"
        title="A forward path, honestly bounded"
        sub="A logistic regression maps the composite indicator stress onto a 12-month recession probability, which then weights a two-regime price path (continued melt-up vs. valuation mean-reversion). Shaded band = ±1 modelled standard error. This is a scenario engine, not a prediction."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <Card className="space-y-6 p-6">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              12-month recession probability
            </div>
            <div className="mt-1 flex items-end gap-3">
              <span className="text-5xl font-semibold tabular-nums" style={{ color: riskColor(prob) }}>
                {prob.toFixed(0)}%
              </span>
              <span className="pb-2 text-xs text-zinc-500">base rate ≈ 15%</span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${prob}%`, background: riskColor(prob), boxShadow: `0 0 12px ${riskColor(prob)}` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 border-y border-white/8 py-4">
            {[
              { k: "Composite stress", v: composite.toFixed(0) + " / 100" },
              { k: "Model pseudo-R²", v: f.r2.toFixed(2) },
              { k: `Expected ${horizon}m return`, v: `${f.expected > 0 ? "+" : ""}${f.expected.toFixed(1)}%` },
              { k: "Modal peak", v: `month +${f.peakMonth}` },
            ].map((x) => (
              <div key={x.k}>
                <div className="text-[10px] uppercase tracking-wider text-zinc-500">{x.k}</div>
                <div className="text-lg font-semibold tabular-nums text-zinc-100">{x.v}</div>
              </div>
            ))}
          </div>

          <div className="space-y-5">
            <Slider
              label="AI mega-IPO liquidity event"
              value={ipo}
              set={setIpo}
              min={0}
              max={1}
              step={0.05}
              fmt={(v) => `${(v * 100).toFixed(0)}% weight`}
              hint="Probability-weight on an OpenAI / Anthropic-scale listing cluster inside the window. Raising it front-loads a melt-up and pulls the modal peak earlier."
            />
            <Slider
              label="Policy stance"
              value={policy}
              set={setPolicy}
              min={-1}
              max={1}
              step={0.1}
              fmt={(v) => (v < -0.15 ? "Easing" : v > 0.15 ? "Tightening" : "Neutral")}
              hint="Negative = cuts and liquidity support (delays but enlarges the eventual reversion). Positive = restrictive policy into a stretched multiple."
            />
            <Slider
              label="AI capex persistence"
              value={capex}
              set={setCapex}
              min={0}
              max={1}
              step={0.05}
              fmt={(v) => `${(v * 100).toFixed(0)}%`}
              hint="Share of announced hyperscaler capex that actually converts to revenue-generating demand. Below ~50% is the 2000 dark-fibre outcome."
            />
            <Slider
              label="Horizon"
              value={horizon}
              set={setHorizon}
              min={12}
              max={60}
              step={6}
              fmt={(v) => `${v} months`}
              hint="Forecast window. Uncertainty widens roughly linearly with time."
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-zinc-100">Modelled index path (today = 100)</h3>
            <Pill hex="#22d3ee">two-regime weighted</Pill>
          </div>
          <div className="h-[430px]">
            <ResponsiveContainer>
              <ComposedChart data={band}>
                <defs>
                  <linearGradient id="bandg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.22} />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#ffffff0d" vertical={false} />
                <XAxis
                  dataKey="m"
                  tick={{ fill: "#71717a", fontSize: 11 }}
                  stroke="#ffffff18"
                  tickFormatter={(v) => `+${v}m`}
                />
                <YAxis tick={{ fill: "#71717a", fontSize: 11 }} stroke="#ffffff18" domain={["auto", "auto"]} />
                <ReferenceLine y={100} stroke="#ffffff28" strokeDasharray="4 4" />
                <ReferenceLine
                  x={f.peakMonth}
                  stroke="#f43f5e60"
                  strokeDasharray="3 3"
                  label={{ value: "modal peak", fill: "#fb7185", fontSize: 10, position: "top" }}
                />
                <Tooltip contentStyle={tipStyle} labelFormatter={(v) => `Month +${v}`} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area dataKey="range" name="±1 s.e." stroke="none" fill="url(#bandg)" />
                <Line dataKey="bull" name="Melt-up regime" stroke="#34d399" strokeWidth={1.5} dot={false} strokeDasharray="5 4" />
                <Line dataKey="bear" name="Reversion regime" stroke="#fb7185" strokeWidth={1.5} dot={false} strokeDasharray="5 4" />
                <Line dataKey="base" name="Probability-weighted" stroke="#22d3ee" strokeWidth={3} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 border-t border-white/8 pt-4 text-[11px] leading-relaxed text-zinc-500">
            <strong className="text-zinc-400">Specification.</strong> P(recession) = σ(−4.15 + 0.078·C + 0.9·IPO + 0.8·Policy − 0.7·Capex), where C is
            the mean normalised stress of the selected indicators. The price path blends a drift regime against a
            cosine-shaped drawdown whose severity scales with valuation overshoot. Coefficients are calibrated to
            post-war NBER onsets using the underlying FRED and Shiller series. Pseudo-R² near 0.6 means the model
            explains a meaningful share of historical turns and still misses plenty — treat wide bands as the message.
          </p>
        </Card>
      </div>
    </div>
  );
}

import { useState } from "react";
import { RECOMMENDATIONS, type Metric } from "../data/datasets";
import { eraStress } from "../lib/model";
import { Card, Pill, SectionTitle, riskColor } from "../components/Shared";

const TONE: Record<string, string> = {
  emerald: "#34d399",
  cyan: "#22d3ee",
  amber: "#f59e0b",
  rose: "#fb7185",
};

function allocation(risk: number, idx: number) {
  // idx 0 = youngest
  const baseEq = [92, 78, 58, 38][idx];
  const shift = ((risk - 50) / 50) * [6, 10, 14, 10][idx];
  const eq = Math.max(20, Math.round(baseEq - shift));
  const cash = Math.min(40, Math.round([6, 10, 16, 24][idx] + shift * 0.6));
  const bonds = Math.max(0, 100 - eq - cash);
  return { eq, bonds, cash };
}

export default function Playbook({ selected, metrics }: { selected: string[]; metrics?: Metric[] }) {
  const risk = eraStress("now", selected, metrics);
  const [active, setActive] = useState(0);
  const r = RECOMMENDATIONS[active];
  const a = allocation(risk, active);
  const hex = TONE[r.tone];

  return (
    <div className="space-y-8">
      <SectionTitle
        eyebrow="Your move"
        title="What to actually do about it"
        sub="Positioning scales with the live composite risk reading, not with headlines. Nothing here is personalised financial advice — it is a framework for stress-testing decisions you were going to make anyway."
      />

      <div className="flex flex-wrap gap-2">
        {RECOMMENDATIONS.map((x, i) => (
          <button
            key={x.profile}
            onClick={() => setActive(i)}
            className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
              active === i
                ? "border-white/20 bg-white/10 text-zinc-50"
                : "border-white/8 text-zinc-400 hover:border-white/15 hover:text-zinc-200"
            }`}
          >
            {x.profile}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <Card glow={hex} className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-zinc-50">{r.profile}</h3>
            <Pill hex={hex}>{r.horizon}</Pill>
          </div>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: hex }}>
            {r.stance}
          </p>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-wider text-zinc-500">
              <span>Risk-adjusted allocation sketch</span>
              <span style={{ color: riskColor(risk) }}>risk {risk.toFixed(0)}</span>
            </div>
            <div className="flex h-10 overflow-hidden rounded-xl">
              {[
                { l: "Equities", v: a.eq, c: "#22d3ee" },
                { l: "Bonds/TIPS", v: a.bonds, c: "#a78bfa" },
                { l: "Cash/T-bills", v: a.cash, c: "#34d399" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="flex items-center justify-center text-[11px] font-semibold text-black/70"
                  style={{ width: `${s.v}%`, background: s.c }}
                >
                  {s.v >= 10 ? `${s.v}%` : ""}
                </div>
              ))}
            </div>
            <div className="mt-2 flex gap-4 text-[11px] text-zinc-500">
              <span>◼ Equities {a.eq}%</span>
              <span>◼ Bonds {a.bonds}%</span>
              <span>◼ Cash {a.cash}%</span>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-zinc-500">
              Shifts automatically as you toggle indicators on the Compare tab — higher composite stress moves
              weight from equity beta toward duration and short-term Treasuries.
            </p>
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="p-6">
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
              Do this
            </h4>
            <ul className="space-y-3">
              {r.moves.map((m) => (
                <li key={m} className="flex gap-3 text-sm leading-relaxed text-zinc-300">
                  <span className="mt-0.5 text-emerald-400">✓</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-6">
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-rose-400">
              Avoid
            </h4>
            <div className="flex flex-wrap gap-2">
              {r.avoid.map((x) => (
                <span
                  key={x}
                  className="rounded-lg border border-rose-500/20 bg-rose-500/8 px-3 py-1.5 text-xs text-rose-300"
                >
                  {x}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-6">
        <h4 className="text-sm font-semibold text-zinc-100">The rules that survived all three crashes</h4>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Time in > timing", "Missing the 10 best days — which cluster inside bear markets — halves long-run returns."],
            ["Liquidity is optionality", "Cash is not a bad investment; it is a purchase option on other people's panic."],
            ["Diversify the correlation, not the ticker count", "Ten tech funds is one position."],
            ["Your income is an asset", "Value it, insure it, and don't correlate your portfolio to your paycheck."],
          ].map(([t, b]) => (
            <div key={t} className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
              <div className="text-sm font-medium text-zinc-100">{t}</div>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">{b}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

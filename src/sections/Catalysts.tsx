import { useState } from "react";
import { CATALYSTS } from "../data/datasets";
import { Bar, Card, Pill, SectionTitle, riskColor } from "../components/Shared";

export default function Catalysts() {
  const [open, setOpen] = useState<string | null>(CATALYSTS[0].title);
  const sorted = [...CATALYSTS].sort((a, b) => b.prob * -b.impact - a.prob * -a.impact);

  return (
    <div className="space-y-8">
      <SectionTitle
        eyebrow="Transmission channels"
        title="What actually breaks it"
        sub="Crashes need a trigger and a transmission mechanism. Ranked below by expected impact (probability × modelled drawdown contribution). The AI IPO cohort is the single largest discrete liquidity event on the calendar."
      />

      <Card className="p-6">
        <div className="mb-4 grid grid-cols-[1fr_auto_auto] gap-4 border-b border-white/8 pb-2 text-[10px] uppercase tracking-wider text-zinc-500">
          <span>Catalyst</span>
          <span className="w-24 text-right">Probability</span>
          <span className="w-24 text-right">Impact</span>
        </div>
        <div className="divide-y divide-white/6">
          {sorted.map((c) => {
            const isOpen = open === c.title;
            const ev = c.prob * -c.impact;
            return (
              <div key={c.title}>
                <button
                  onClick={() => setOpen(isOpen ? null : c.title)}
                  className="grid w-full grid-cols-[1fr_auto_auto] items-center gap-4 py-4 text-left transition hover:bg-white/[0.02]"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`text-zinc-600 transition-transform ${isOpen ? "rotate-90" : ""}`}
                    >
                      ▶
                    </span>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-zinc-100">{c.title}</div>
                      <div className="mt-1 flex items-center gap-2">
                        <Pill hex={riskColor(ev * 8)}>{c.tag}</Pill>
                        <span className="truncate text-[11px] text-zinc-500">≈ {c.analogue}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-24">
                    <div className="mb-1 text-right text-xs tabular-nums text-zinc-300">
                      {(c.prob * 100).toFixed(0)}%
                    </div>
                    <Bar pct={c.prob * 100} hex="#a78bfa" />
                  </div>
                  <div className="w-24">
                    <div className="mb-1 text-right text-xs tabular-nums text-rose-400">{c.impact}%</div>
                    <Bar pct={-c.impact * 4} hex="#fb7185" />
                  </div>
                </button>
                {isOpen && (
                  <p className="pb-5 pl-8 pr-2 text-sm leading-relaxed text-zinc-400">{c.detail}</p>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-3">
        {[
          {
            t: "Why this is not 2008",
            c: "#34d399",
            b: "Household leverage is far lower, banks hold materially more capital, and mortgage underwriting is conservative. A repeat requires a credit event, and the regulated banking system is not the obvious candidate — private credit is.",
          },
          {
            t: "Why this rhymes with 2000",
            c: "#a78bfa",
            b: "A real technology, an unreal cashflow story. Capex funded on the expectation of demand, circular vendor revenue, an IPO window as the release valve, and a CAPE only ever exceeded once. The 2000 crash halved the index without a severe recession.",
          },
          {
            t: "Why 1929 still matters",
            c: "#f59e0b",
            b: "1929 shows how policy turns a crash into a depression: tariffs, a passive central bank, and no fiscal capacity. Today's fiscal capacity is the constraint — debt at 123% of GDP limits the size of the next bailout.",
          },
        ].map((x) => (
          <Card key={x.t} glow={x.c} className="p-5">
            <h4 className="text-sm font-semibold" style={{ color: x.c }}>
              {x.t}
            </h4>
            <p className="mt-2 text-xs leading-relaxed text-zinc-400">{x.b}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

import type { ReactNode } from "react";
import { cn } from "../utils/cn";

export function Card({
  children,
  className,
  glow,
}: {
  children: ReactNode;
  className?: string;
  glow?: string;
}) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-white/8 bg-[#0e1117]/80 backdrop-blur-xl",
        "shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_20px_40px_-20px_rgba(0,0,0,0.8)]",
        className
      )}
    >
      {glow && (
        <div
          className="pointer-events-none absolute -top-px left-8 right-8 h-px"
          style={{ background: `linear-gradient(90deg,transparent,${glow},transparent)` }}
        />
      )}
      {children}
    </div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mb-6">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
        {eyebrow}
      </div>
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">{title}</h2>
      {sub && <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">{sub}</p>}
    </div>
  );
}

export function Gauge({ value, label, hex }: { value: number; label: string; hex: string }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-32 w-32">
        <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
          <circle cx="64" cy="64" r={r} fill="none" stroke="#ffffff10" strokeWidth="10" />
          <circle
            cx="64"
            cy="64"
            r={r}
            fill="none"
            stroke={hex}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${(pct / 100) * c} ${c}`}
            style={{ filter: `drop-shadow(0 0 8px ${hex}80)`, transition: "stroke-dasharray .7s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold tabular-nums text-zinc-50">{pct.toFixed(0)}</span>
          <span className="text-[10px] uppercase tracking-widest text-zinc-500">/ 100</span>
        </div>
      </div>
      <div className="mt-2 text-xs font-medium text-zinc-400">{label}</div>
    </div>
  );
}

export function Bar({ pct, hex }: { pct: number; hex: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${Math.max(2, Math.min(100, pct))}%`, background: hex, boxShadow: `0 0 10px ${hex}90` }}
      />
    </div>
  );
}

export function Pill({ children, hex }: { children: ReactNode; hex?: string }) {
  return (
    <span
      className="rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
      style={{
        color: hex ?? "#a1a1aa",
        borderColor: (hex ?? "#a1a1aa") + "40",
        background: (hex ?? "#a1a1aa") + "12",
      }}
    >
      {children}
    </span>
  );
}

export function riskColor(v: number) {
  if (v < 33) return "#34d399";
  if (v < 55) return "#fbbf24";
  if (v < 75) return "#fb923c";
  return "#f43f5e";
}

"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CLUSTER_DEFAULTS, CLUSTER_NAMES, type ClusterName } from "@/lib/clusters";
import { RendaCard } from "@/components/dashboard/RendaCard";

interface Props {
  clusterMetas: Record<ClusterName, number>;
  renda: number;
}

export function ClusterSliders({ clusterMetas: initial, renda }: Props) {
  const [metas, setMetas] = useState(initial);
  const updateMetas = useMutation(api.configs.updateClusterMetas);

  const total = Math.round(
    Object.values(metas).reduce((a, b) => a + b, 0) * 100
  );

  async function handleSlider(name: ClusterName, pct: number) {
    const next = { ...metas, [name]: pct / 100 };
    setMetas(next);
    await updateMetas({ clusterMetas: next });
  }

  async function resetDefaults() {
    const defaults = Object.fromEntries(
      CLUSTER_NAMES.map((k) => [k, CLUSTER_DEFAULTS[k].meta])
    ) as Record<ClusterName, number>;
    setMetas(defaults);
    await updateMetas({ clusterMetas: defaults });
  }

  return (
    <div>
      {/* Total */}
      <div
        className="rounded-lg px-4 py-2 mb-2"
        style={{
          background: "var(--surface2)",
          border: `1px solid ${total > 100 ? "var(--red)" : "var(--border)"}`,
        }}
      >
        <div className="flex justify-between items-center">
          <span className="text-xs" style={{ color: total > 100 ? "var(--red)" : "var(--muted)" }}>
            {total > 100 ? "⚠️ Total alocado" : "Total alocado"}
            {total > 100 && (
              <i className="text-[10px] ml-1">total precisa ser até 100%</i>
            )}
          </span>
          <span
            className="text-[17px] font-semibold"
            style={{
              fontFamily: "var(--font-dm-mono)",
              color: total === 100 ? "var(--green)" : total > 100 ? "var(--red)" : "var(--muted)",
            }}
          >
            {total}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        {CLUSTER_NAMES.map((name) => {
          const cfg = CLUSTER_DEFAULTS[name];
          const pct = Math.round((metas[name] ?? cfg.meta) * 100);
          return (
            <div
              key={name}
              className="rounded-xl px-3 py-3"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="text-[11px] font-medium leading-tight pr-1">{name}</div>
                <span
                  className="text-[15px] font-semibold shrink-0"
                  style={{ fontFamily: "var(--font-dm-mono)", color: cfg.color }}
                >
                  {pct}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={pct}
                onChange={(e) => handleSlider(name, Number(e.target.value))}
                className="w-full h-1 rounded-full appearance-none outline-none cursor-pointer"
                style={{
                  accentColor: cfg.color,
                  background: `linear-gradient(to right, ${cfg.color} ${pct}%, var(--surface2) ${pct}%)`,
                }}
              />
            </div>
          );
        })}
      </div>

      <button
        onClick={resetDefaults}
        className="w-full py-2 rounded-lg text-[13px] mb-2 transition-colors"
        style={{
          background: "transparent",
          border: "1px solid var(--border2)",
          color: "var(--muted)",
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLElement).style.borderColor = "var(--green)";
          (e.target as HTMLElement).style.color = "var(--green)";
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.borderColor = "var(--border2)";
          (e.target as HTMLElement).style.color = "var(--muted)";
        }}
      >
        Restaurar padrão AUVP
      </button>

      <p className="text-xs text-center leading-relaxed mb-3" style={{ color: "var(--muted)" }}>
        Padrão AUVP: Liberdade 25% · Custo Fixo 30%<br />
        Conforto 15% · Metas 15% · Prazeres 10% · Conhecimento 5%
      </p>

      <RendaCard renda={renda} />
    </div>
  );
}

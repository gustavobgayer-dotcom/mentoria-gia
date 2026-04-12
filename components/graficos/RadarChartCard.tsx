"use client";

import { CLUSTER_DEFAULTS, CLUSTER_NAMES, type ClusterName } from "@/lib/clusters";
import { fmt } from "@/lib/utils";
import { ChartCard } from "./BarChartCard";

interface Props {
  renda: number;
  clusterMetas: Record<ClusterName, number>;
  totByCluster: Record<ClusterName, number>;
  totByClusterPrev?: Record<ClusterName, number>;
}

export function RadarChartCard({ renda, clusterMetas, totByCluster, totByClusterPrev }: Props) {
  const entries = CLUSTER_NAMES.map((name) => {
    const metaPct = clusterMetas[name] ?? CLUSTER_DEFAULTS[name].meta;
    const meta = metaPct * renda;
    const realizado = totByCluster[name] ?? 0;
    const prevRealizado = totByClusterPrev?.[name] ?? 0;
    const ratio = meta > 0 ? realizado / meta : 0;
    const pct = Math.round(ratio * 100);
    const color = CLUSTER_DEFAULTS[name].color;

    // Status
    let statusColor: string;
    if (pct > 100) statusColor = "#ff5b5b";
    else if (pct > 85) statusColor = "#f5a623";
    else statusColor = color;

    const diff = realizado - prevRealizado;

    return { name, meta, realizado, pct, color, statusColor, diff };
  });

  const hasComp = !!totByClusterPrev;

  return (
    <ChartCard
      title="Quanto você usou de cada área"
      subtitle="Veja o percentual do orçamento que já foi utilizado em cada área. 100% = chegou no limite."
    >
      <div className="flex flex-col gap-3">
        {entries.map(({ name, meta, realizado, pct, color, statusColor, diff }) => (
          <div key={name}>
            <div className="flex items-center justify-between mb-1">
              {/* Dot + nome */}
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                <span className="text-[12px] truncate" style={{ color: "var(--text)" }}>{name}</span>
              </div>
              {/* Valor e % */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {hasComp && diff !== 0 && (
                  <span
                    className="text-[10px]"
                    style={{
                      color: diff > 0 ? "#ff5b5b" : "#00d4a0",
                      fontFamily: "var(--font-dm-mono)",
                    }}
                  >
                    {diff > 0 ? "+" : ""}{fmt(diff)}
                  </span>
                )}
                <span
                  className="text-[12px] font-semibold w-[38px] text-right"
                  style={{ color: statusColor, fontFamily: "var(--font-dm-mono)" }}
                >
                  {pct}%
                </span>
              </div>
            </div>

            {/* Barra de progresso */}
            <div
              className="h-[6px] rounded-full overflow-hidden"
              style={{ background: "var(--surface2)" }}
            >
              <div
                className="h-full rounded-full transition-[width] duration-500"
                style={{
                  width: `${Math.min(pct, 100)}%`,
                  background: statusColor,
                }}
              />
            </div>

            {/* Valores embaixo */}
            <div className="flex justify-between mt-[3px]">
              <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                {fmt(realizado)} gastos
              </span>
              <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                limite {fmt(meta)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}

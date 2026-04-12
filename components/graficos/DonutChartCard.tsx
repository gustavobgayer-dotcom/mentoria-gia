"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CLUSTER_DEFAULTS, CLUSTER_NAMES, type ClusterName } from "@/lib/clusters";
import { ChartCard } from "./BarChartCard";
import { fmt } from "@/lib/utils";

interface Props {
  totByCluster: Record<ClusterName, number>;
}

export function DonutChartCard({ totByCluster }: Props) {
  const total = CLUSTER_NAMES.reduce((s, n) => s + (totByCluster[n] ?? 0), 0);
  const data = CLUSTER_NAMES.map((name) => ({
    name,
    value: Math.round(totByCluster[name] ?? 0),
    color: CLUSTER_DEFAULTS[name].color,
    pct: total > 0 ? Math.round(((totByCluster[name] ?? 0) / total) * 100) : 0,
  })).filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <ChartCard
        title="Como seu dinheiro foi distribuído"
        subtitle="Adicione lançamentos para ver a distribuição dos seus gastos."
      >
        <div className="flex items-center justify-center h-24" style={{ color: "var(--muted)" }}>
          <span className="text-[13px]">Nenhum gasto registrado</span>
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard
      title="Como seu dinheiro foi distribuído"
      subtitle="Cada fatia mostra quanto do total foi gasto em cada área do orçamento."
    >
      <div className="flex gap-x-0 gap-y-0">
        {/* Gráfico */}
        <div className="flex-shrink-0">
          <ResponsiveContainer width={160} height={160}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="55%"
                outerRadius="80%"
                dataKey="value"
                strokeWidth={2}
                stroke="#111827"
              >
                {data.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "#1a2235", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8 }}
                formatter={(v: number, _: string, props: { payload?: { name?: string; pct?: number } }) => [
                  `${fmt(v)} · ${props.payload?.pct ?? 0}%`,
                  props.payload?.name ?? "",
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legenda detalhada */}
        <div className="flex-1 flex flex-col justify-center gap-[6px] pl-2 min-w-0">
          {data.map((d) => (
            <div key={d.name} className="flex items-center justify-between gap-2 min-w-0">
              <div className="flex items-center gap-[6px] min-w-0">
                <div className="w-2 h-2 rounded-[2px] flex-shrink-0" style={{ background: d.color }} />
                <span className="text-[11px] truncate" style={{ color: "var(--muted)" }}>
                  {d.name}
                </span>
              </div>
              <span
                className="text-[11px] flex-shrink-0"
                style={{ color: d.color, fontFamily: "var(--font-dm-mono)" }}
              >
                {d.pct}%
              </span>
            </div>
          ))}
          <div
            className="mt-1 pt-2 flex items-center justify-between"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <span className="text-[11px]" style={{ color: "var(--muted)" }}>Total</span>
            <span className="text-[12px] font-semibold" style={{ color: "var(--text)", fontFamily: "var(--font-dm-mono)" }}>
              {fmt(total)}
            </span>
          </div>
        </div>
      </div>
    </ChartCard>
  );
}

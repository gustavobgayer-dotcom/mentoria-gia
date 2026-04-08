"use client";

import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from "recharts";
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
    short: name.split(" ")[0],
    value: Math.round(totByCluster[name] ?? 0),
    color: CLUSTER_DEFAULTS[name].color,
  })).filter((d) => d.value > 0);

  return (
    <ChartCard title="Distribuição dos gastos">
      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-3">
        {data.map((d) => (
          <span key={d.name} className="flex items-center gap-[5px] text-[11px]" style={{ color: "var(--muted)" }}>
            <span className="w-2 h-2 rounded-[2px]" style={{ background: d.color }} />
            {d.short} {total > 0 ? Math.round((d.value / total) * 100) : 0}%
          </span>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={230}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="60%"
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
            formatter={(v: number) => [
              `${fmt(v)} (${total > 0 ? Math.round((v / total) * 100) : 0}%)`,
              undefined,
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

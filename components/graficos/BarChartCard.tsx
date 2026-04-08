"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { CLUSTER_DEFAULTS, CLUSTER_NAMES, type ClusterName } from "@/lib/clusters";

interface Props {
  renda: number;
  clusterMetas: Record<ClusterName, number>;
  totByCluster: Record<ClusterName, number>;
}

export function BarChartCard({ renda, clusterMetas, totByCluster }: Props) {
  const data = CLUSTER_NAMES.map((name) => ({
    name: name.split(" ")[0],
    Meta: Math.round((clusterMetas[name] ?? CLUSTER_DEFAULTS[name].meta) * renda),
    Realizado: Math.round(totByCluster[name] ?? 0),
    color: CLUSTER_DEFAULTS[name].color,
  }));

  return (
    <ChartCard title="Realizado vs Meta (R$)">
      <div className="flex gap-4 flex-wrap mb-3">
        <LegItem color="rgba(77,141,247,0.5)" label="Meta" />
        <LegItem color="#00d4a0" label="Realizado" />
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: "#8896b3", fontSize: 10, fontFamily: "DM Mono" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#8896b3", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `R$${Math.round(v / 1000)}k`}
          />
          <Tooltip
            contentStyle={{ background: "#1a2235", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8 }}
            labelStyle={{ color: "#f0f4ff", fontWeight: 500 }}
            formatter={(v: number) => [`R$ ${v.toLocaleString("pt-BR")}`, undefined]}
          />
          <Bar dataKey="Meta" fill="rgba(77,141,247,0.2)" stroke="#4d8df7" strokeWidth={1} radius={[4, 4, 0, 0]} />
          <Bar
            dataKey="Realizado"
            radius={[4, 4, 0, 0]}
            fill="#00d4a0"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function LegItem({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-[5px] text-[11px]" style={{ color: "var(--muted)" }}>
      <span className="w-2 h-2 rounded-[2px]" style={{ background: color }} />
      {label}
    </span>
  );
}

export function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-4 mb-3"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="text-[13px] font-medium mb-3">{title}</div>
      {children}
    </div>
  );
}

"use client";

import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip,
} from "recharts";
import { CLUSTER_DEFAULTS, CLUSTER_NAMES, type ClusterName } from "@/lib/clusters";
import { ChartCard } from "./BarChartCard";

interface Props {
  renda: number;
  clusterMetas: Record<ClusterName, number>;
  totByCluster: Record<ClusterName, number>;
}

export function RadarChartCard({ renda, clusterMetas, totByCluster }: Props) {
  const data = CLUSTER_NAMES.map((name) => {
    const meta = (clusterMetas[name] ?? CLUSTER_DEFAULTS[name].meta) * renda;
    const realizado = totByCluster[name] ?? 0;
    return {
      name: name.split(" ")[0],
      Atingimento: meta > 0 ? Math.round((realizado / meta) * 100) : 0,
      Meta: 100,
    };
  });

  const maxVal = Math.max(130, ...data.map((d) => d.Atingimento));

  return (
    <ChartCard title="Atingimento das metas (%)">
      <ResponsiveContainer width="100%" height={220}>
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.06)" />
          <PolarAngleAxis
            dataKey="name"
            tick={{ fill: "#8896b3", fontSize: 10, fontFamily: "DM Mono" }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, maxVal]}
            tick={{ fill: "#8896b3", fontSize: 9 }}
            tickCount={4}
            style={{ backdropFilter: "none" }}
          />
          <Radar
            name="Meta 100%"
            dataKey="Meta"
            stroke="rgba(77,141,247,0.35)"
            fill="rgba(77,141,247,0.05)"
            strokeWidth={1}
            strokeDasharray="5 5"
          />
          <Radar
            name="Atingimento %"
            dataKey="Atingimento"
            stroke="#00d4a0"
            fill="rgba(0,212,160,0.12)"
            strokeWidth={1.5}
            dot={{ fill: "#00d4a0", r: 3 }}
          />
          <Tooltip
            contentStyle={{ background: "#1a2235", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8 }}
            formatter={(v: number) => [`${v}%`, undefined]}
          />
        </RadarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

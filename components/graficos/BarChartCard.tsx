"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";
import { CLUSTER_DEFAULTS, CLUSTER_NAMES, type ClusterName } from "@/lib/clusters";
import { fmt } from "@/lib/utils";

interface Props {
  renda: number;
  clusterMetas: Record<ClusterName, number>;
  totByCluster: Record<ClusterName, number>;
  totByClusterPrev?: Record<ClusterName, number>;
}

const SHORT: Record<ClusterName, string> = {
  "Liberdade Financeira": "Liberd.",
  "Custo Fixo": "Custo",
  "Conforto": "Conforto",
  "Metas": "Metas",
  "Prazeres": "Prazer.",
  "Conhecimento": "Conhec.",
};

export function BarChartCard({ renda, clusterMetas, totByCluster, totByClusterPrev }: Props) {
  const data = CLUSTER_NAMES.map((name) => ({
    name: SHORT[name],
    fullName: name,
    Meta: Math.round((clusterMetas[name] ?? CLUSTER_DEFAULTS[name].meta) * renda),
    Realizado: Math.round(totByCluster[name] ?? 0),
    color: CLUSTER_DEFAULTS[name].color,
  }));

  // Comparativo mês anterior
  const hasComp = !!totByClusterPrev;
  const totalAtual = CLUSTER_NAMES.reduce((s, n) => s + (totByCluster[n] ?? 0), 0);
  const totalPrev = hasComp ? CLUSTER_NAMES.reduce((s, n) => s + (totByClusterPrev![n] ?? 0), 0) : 0;
  const diffTotal = totalAtual - totalPrev;

  return (
    <ChartCard
      title="Planejado vs Realizado"
      subtitle="As barras coloridas mostram o que você gastou. As azuis mostram o limite planejado."
    >
      <div className="flex gap-4 flex-wrap mb-3">
        <LegItem color="rgba(77,141,247,0.4)" label="Limite planejado" />
        <LegItem color="#00d4a0" label="Gasto real (cor por área)" />
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} barGap={3}>
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
            formatter={(v: number, name: string) => [
              `R$ ${v.toLocaleString("pt-BR")}`,
              name === "Meta" ? "Limite planejado" : "Gasto real",
            ]}
          />
          <Bar dataKey="Meta" fill="rgba(77,141,247,0.18)" stroke="#4d8df7" strokeWidth={1} radius={[4, 4, 0, 0]} />
          <Bar dataKey="Realizado" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.fullName} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Comparativo mês anterior */}
      {hasComp && totalPrev > 0 && (
        <div
          className="mt-3 flex items-center justify-between rounded-lg px-3 py-2"
          style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}
        >
          <span className="text-[12px]" style={{ color: "var(--muted)" }}>Vs mês anterior</span>
          <span
            className="text-[12px] font-semibold"
            style={{
              fontFamily: "var(--font-dm-mono)",
              color: diffTotal > 0 ? "#ff5b5b" : "#00d4a0",
            }}
          >
            {diffTotal > 0 ? "+" : ""}{fmt(diffTotal)}
          </span>
        </div>
      )}
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

export function ChartCard({
  title, subtitle, children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-xl p-4 mb-3"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="text-[14px] font-semibold mb-1" style={{ color: "var(--text)" }}>{title}</div>
      {subtitle && (
        <div className="text-[11px] leading-relaxed mb-3" style={{ color: "var(--muted)" }}>{subtitle}</div>
      )}
      {children}
    </div>
  );
}

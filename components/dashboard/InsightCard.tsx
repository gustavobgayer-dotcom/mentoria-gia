"use client";

import { CLUSTER_DEFAULTS, CLUSTER_NAMES, type ClusterName } from "@/lib/clusters";
import { fmt } from "@/lib/utils";

interface Props {
  renda: number;
  clusterMetas: Record<ClusterName, number>;
  totByCluster: Record<ClusterName, number>;
}

function getInsight(renda: number, clusterMetas: Record<ClusterName, number>, totByCluster: Record<ClusterName, number>) {
  const totalGasto = CLUSTER_NAMES.reduce((s, n) => s + (totByCluster[n] ?? 0), 0);

  if (totalGasto === 0) {
    return {
      emoji: "🐟",
      text: "Nenhum gasto registrado ainda. Use o botão + para adicionar seu primeiro lançamento.",
      color: "var(--muted)",
      bg: "var(--surface2)",
    };
  }

  const entries = CLUSTER_NAMES.map((name) => {
    const metaPct = clusterMetas[name] ?? CLUSTER_DEFAULTS[name].meta;
    const meta = metaPct * renda;
    const gasto = totByCluster[name] ?? 0;
    const ratio = meta > 0 ? gasto / meta : 0;
    return { name, gasto, meta, ratio, saldo: meta - gasto };
  });

  // Prioridade 1: cluster que já estourou o limite
  const over = entries.filter((e) => e.ratio > 1).sort((a, b) => b.ratio - a.ratio);
  if (over.length > 0) {
    const pior = over[0];
    return {
      emoji: "⚠️",
      text: `${pior.name} ultrapassou o limite em ${fmt(pior.gasto - pior.meta)}. Revise os gastos dessa área para equilibrar o mês.`,
      color: "#ff5b5b",
      bg: "rgba(255,91,91,0.07)",
    };
  }

  // Prioridade 2: cluster próximo do limite (> 85%)
  const near = entries.filter((e) => e.ratio > 0.85 && e.gasto > 0).sort((a, b) => b.ratio - a.ratio);
  if (near.length > 0) {
    const proximo = near[0];
    return {
      emoji: "🎯",
      text: `${proximo.name} está em ${Math.round(proximo.ratio * 100)}% do limite. Ainda sobram ${fmt(proximo.saldo)} — fique de olho!`,
      color: "#f5a623",
      bg: "rgba(245,166,35,0.07)",
    };
  }

  // Prioridade 3: tudo bem — destaca o cluster mais econômico
  const comGasto = entries.filter((e) => e.gasto > 0).sort((a, b) => a.ratio - b.ratio);
  if (comGasto.length > 0) {
    const melhor = comGasto[0];
    return {
      emoji: "✅",
      text: `Ótimo controle! ${melhor.name} está usando apenas ${Math.round(melhor.ratio * 100)}% do orçamento previsto.`,
      color: "#00d4a0",
      bg: "rgba(0,212,160,0.07)",
    };
  }

  return {
    emoji: "💡",
    text: "Continue registrando seus gastos para ver insights personalizados aqui.",
    color: "var(--muted)",
    bg: "var(--surface2)",
  };
}

export function InsightCard({ renda, clusterMetas, totByCluster }: Props) {
  const insight = getInsight(renda, clusterMetas, totByCluster);

  return (
    <div
      className="rounded-xl px-4 py-3 mb-[14px] flex items-start gap-3"
      style={{ background: insight.bg, border: `1px solid ${insight.color}30` }}
    >
      <span className="text-[18px] leading-none mt-[2px] flex-shrink-0">{insight.emoji}</span>
      <p className="text-[13px] leading-relaxed flex-1" style={{ color: "var(--text)" }}>
        {insight.text}
      </p>
    </div>
  );
}

export function InsightCardSkeleton() {
  return (
    <div
      className="rounded-xl px-4 py-3 mb-[14px] h-[58px] animate-pulse"
      style={{ background: "var(--surface2)" }}
    />
  );
}

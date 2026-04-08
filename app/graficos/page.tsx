"use client";

import { Suspense } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMonth } from "@/hooks/useMonth";
import { Shell } from "@/components/layout/Shell";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { BarChartCard } from "@/components/graficos/BarChartCard";
import { DonutChartCard } from "@/components/graficos/DonutChartCard";
import { RadarChartCard } from "@/components/graficos/RadarChartCard";
import { CLUSTER_NAMES, type ClusterName } from "@/lib/clusters";

function GraficosContent() {
  const { mes, ano } = useMonth();
  const config = useQuery(api.configs.get);
  const lancamentos = useQuery(api.lancamentos.list, { mes, ano });

  if (!config || !lancamentos) {
    return <div className="flex-1 flex items-center justify-center" style={{ color: "var(--muted)" }}>Carregando...</div>;
  }

  const totByCluster = Object.fromEntries(
    CLUSTER_NAMES.map((k) => [
      k,
      lancamentos.filter((l) => l.cluster === k).reduce((s, l) => s + l.valor, 0),
    ])
  ) as Record<ClusterName, number>;

  return (
    <div className="flex-1 scrollable px-4 pt-4 pb-24">
      <BarChartCard
        renda={config.renda}
        clusterMetas={config.clusterMetas as Record<ClusterName, number>}
        totByCluster={totByCluster}
      />
      <DonutChartCard totByCluster={totByCluster} />
      <RadarChartCard
        renda={config.renda}
        clusterMetas={config.clusterMetas as Record<ClusterName, number>}
        totByCluster={totByCluster}
      />
    </div>
  );
}

export default function GraficosPage() {
  return (
    <Shell>
      <TopBar />
      <Suspense fallback={null}>
        <GraficosContent />
      </Suspense>
      <BottomNav />
    </Shell>
  );
}

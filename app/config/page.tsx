"use client";

import { Suspense } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Shell } from "@/components/layout/Shell";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { ClusterSliders } from "@/components/config/ClusterSliders";
import type { ClusterName } from "@/lib/clusters";

function ConfigContent() {
  const config = useQuery(api.configs.get);

  if (!config) {
    return <div className="flex-1 flex items-center justify-center" style={{ color: "var(--muted)" }}>Carregando...</div>;
  }

  return (
    <div className="flex-1 scrollable px-4 pt-4 pb-24">
      <div
        className="text-[10px] font-medium uppercase tracking-widest mb-[10px]"
        style={{ color: "var(--muted)", fontFamily: "var(--font-dm-mono)" }}
      >
        Percentuais por cluster
      </div>
      <ClusterSliders
        clusterMetas={config.clusterMetas as Record<ClusterName, number>}
        renda={config.renda}
      />
    </div>
  );
}

export default function ConfigPage() {
  return (
    <Shell>
      <TopBar />
      <Suspense fallback={null}>
        <ConfigContent />
      </Suspense>
      <BottomNav />
    </Shell>
  );
}

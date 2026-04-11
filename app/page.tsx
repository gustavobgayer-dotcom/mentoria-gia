"use client";

import { Suspense, useState } from "react";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMonth } from "@/hooks/useMonth";
import { Shell } from "@/components/layout/Shell";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { SummaryGrid } from "@/components/dashboard/SummaryGrid";
import { ClusterCards } from "@/components/dashboard/ClusterCards";
import { AddTransactionSheet } from "@/components/sheets/AddTransactionSheet";
import { CLUSTER_NAMES, type ClusterName } from "@/lib/clusters";
import { Plus } from "lucide-react";
import { OnboardingScreen } from "@/components/onboarding/OnboardingScreen";

function DashboardContent() {
  const { mes, ano } = useMonth();
  const [fabOpen, setFabOpen] = useState(false);

  const config = useQuery(api.configs.get);
  const lancamentos = useQuery(api.lancamentos.list, { mes, ano });

  if (config === undefined || !lancamentos) {
    return <div className="flex-1 flex items-center justify-center" style={{ color: "var(--muted)" }}>Carregando...</div>;
  }

  if (config === null) {
    return <OnboardingScreen />;
  }

  const totByCluster = Object.fromEntries(
    CLUSTER_NAMES.map((k) => [
      k,
      lancamentos.filter((l) => l.cluster === k).reduce((s, l) => s + l.valor, 0),
    ])
  ) as Record<ClusterName, number>;

  const totalGasto = Object.values(totByCluster).reduce((a, b) => a + b, 0);
  const saldo = config.renda - totalGasto;

  return (
    <>
      <div className="flex-1 scrollable px-4 pt-4 pb-24">
        <SummaryGrid totalGasto={totalGasto} saldo={saldo} />
        <ClusterCards
          renda={config.renda}
          clusterMetas={config.clusterMetas as Record<ClusterName, number>}
          totByCluster={totByCluster}
        />
      </div>

      {/* FAB */}
      <button
        onClick={() => setFabOpen(true)}
        className="fixed bottom-[76px] right-4 w-[52px] h-[52px] rounded-full flex items-center justify-center z-50 transition-transform active:scale-95"
        style={{
          background: "var(--green)",
          boxShadow: "0 4px 20px rgba(0,212,160,0.35)",
        }}
      >
        <Plus size={22} color="#0a0f1e" strokeWidth={2.5} />
      </button>

      <AddTransactionSheet open={fabOpen} onClose={() => setFabOpen(false)} />
    </>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  if (isLoading || !isAuthenticated) {
    return <div className="flex-1 flex items-center justify-center" style={{ color: "var(--muted)" }}>Carregando...</div>;
  }
  return <>{children}</>;
}

export default function DashboardPage() {
  return (
    <Shell>
      <TopBar />
      <Suspense fallback={null}>
        <AuthGuard>
          <DashboardContent />
        </AuthGuard>
      </Suspense>
      <BottomNav />
    </Shell>
  );
}

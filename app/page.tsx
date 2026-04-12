"use client";

import { Suspense, useState, useRef, useCallback } from "react";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMonth } from "@/hooks/useMonth";
import { Shell } from "@/components/layout/Shell";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { SummaryGrid } from "@/components/dashboard/SummaryGrid";
import { ClusterCards } from "@/components/dashboard/ClusterCards";
import { InsightCard, InsightCardSkeleton } from "@/components/dashboard/InsightCard";
import { AddTransactionSheet } from "@/components/sheets/AddTransactionSheet";
import { CLUSTER_NAMES, type ClusterName } from "@/lib/clusters";
import { Plus, RefreshCw } from "lucide-react";
import { OnboardingScreen } from "@/components/onboarding/OnboardingScreen";
import { motion, AnimatePresence } from "motion/react";

// ─── Skeletons ───────────────────────────────────────────────────────────────
function SummaryGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-[10px] mb-[14px]">
      {[0, 1].map((i) => (
        <div
          key={i}
          className="rounded-lg p-[14px] h-[72px] animate-pulse"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        />
      ))}
    </div>
  );
}

function ClusterCardsSkeleton() {
  return (
    <div>
      <div className="w-32 h-3 rounded-full mb-3 animate-pulse" style={{ background: "var(--surface2)" }} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="rounded-xl h-[96px] mb-[10px] animate-pulse"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        />
      ))}
    </div>
  );
}

// ─── Pull-to-refresh ─────────────────────────────────────────────────────────
function usePullToRefresh() {
  const [refreshing, setRefreshing] = useState(false);
  const [pullY, setPullY] = useState(0);
  const startYRef = useRef(0);
  const pullingRef = useRef(false);
  const THRESHOLD = 64;

  const onTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollTop === 0) {
      startYRef.current = e.touches[0].clientY;
      pullingRef.current = true;
    }
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!pullingRef.current) return;
    const delta = e.touches[0].clientY - startYRef.current;
    if (delta > 0) setPullY(Math.min(delta * 0.45, THRESHOLD));
    else { pullingRef.current = false; setPullY(0); }
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!pullingRef.current) return;
    pullingRef.current = false;
    if (pullY >= THRESHOLD) {
      setRefreshing(true);
      setPullY(0);
      setTimeout(() => setRefreshing(false), 900);
    } else {
      setPullY(0);
    }
    startYRef.current = 0;
  }, [pullY]);

  return { refreshing, pullY, onTouchStart, onTouchMove, onTouchEnd };
}

// ─── Dashboard content ───────────────────────────────────────────────────────
function DashboardContent() {
  const { mes, ano } = useMonth();
  const [fabOpen, setFabOpen] = useState(false);
  const { refreshing, pullY, onTouchStart, onTouchMove, onTouchEnd } = usePullToRefresh();

  const config = useQuery(api.configs.get);
  const lancamentos = useQuery(api.lancamentos.list, { mes, ano });

  if (config === undefined || lancamentos === undefined) {
    return (
      <div className="flex-1 scrollable px-4 pt-4 pb-24">
        <SummaryGridSkeleton />
        <InsightCardSkeleton />
        <ClusterCardsSkeleton />
      </div>
    );
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
      {/* Indicador de pull-to-refresh */}
      <AnimatePresence>
        {(refreshing || pullY > 10) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center py-2"
            style={{ color: "var(--green)" }}
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
              style={{ transform: !refreshing ? `rotate(${(pullY / 64) * 180}deg)` : undefined }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="flex-1 scrollable px-4 pt-4 pb-24"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          transform: pullY > 0 ? `translateY(${pullY}px)` : undefined,
          transition: pullY === 0 ? "transform 0.3s ease" : undefined,
        }}
      >
        <SummaryGrid totalGasto={totalGasto} saldo={saldo} />
        <InsightCard
          renda={config.renda}
          clusterMetas={config.clusterMetas as Record<ClusterName, number>}
          totByCluster={totByCluster}
        />
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

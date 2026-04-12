"use client";

import { Suspense, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Shell } from "@/components/layout/Shell";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { ClusterSliders } from "@/components/config/ClusterSliders";
import { OnboardingScreen } from "@/components/onboarding/OnboardingScreen";
import { BookOpen } from "lucide-react";
import type { ClusterName } from "@/lib/clusters";

function ConfigContent({ onOpenTutorial }: { onOpenTutorial: () => void }) {
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

      {/* Botão Tutorial */}
      <div className="mt-8 mb-2">
        <div
          className="text-[10px] font-medium uppercase tracking-widest mb-3"
          style={{ color: "var(--muted)", fontFamily: "var(--font-dm-mono)" }}
        >
          Ajuda
        </div>
        <button
          onClick={onOpenTutorial}
          className="w-full h-[46px] rounded-xl flex items-center gap-3 px-4 transition-opacity active:opacity-70"
          style={{ background: "var(--surface)", border: "1px solid var(--border2)" }}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--surface2)" }}
          >
            <BookOpen size={14} strokeWidth={1.8} style={{ color: "var(--green)" }} />
          </div>
          <span className="text-[14px] font-medium flex-1 text-left" style={{ color: "var(--text)" }}>
            Ver tutorial do app
          </span>
          <span className="text-[12px]" style={{ color: "var(--muted)" }}>→</span>
        </button>
      </div>
    </div>
  );
}

export default function ConfigPage() {
  const [showTutorial, setShowTutorial] = useState(false);

  return (
    <Shell>
      <TopBar />
      <Suspense fallback={null}>
        <ConfigContent onOpenTutorial={() => setShowTutorial(true)} />
      </Suspense>
      <BottomNav />

      {/* Overlay do tutorial */}
      {showTutorial && (
        <div
          className="absolute inset-0 z-50 flex flex-col"
          style={{ background: "var(--bg)" }}
        >
          <OnboardingScreen onClose={() => setShowTutorial(false)} />
        </div>
      )}
    </Shell>
  );
}

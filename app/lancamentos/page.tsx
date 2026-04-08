"use client";

import { Suspense, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMonth } from "@/hooks/useMonth";
import { Shell } from "@/components/layout/Shell";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { TransactionList } from "@/components/lancamentos/TransactionList";
import { AddTransactionSheet } from "@/components/sheets/AddTransactionSheet";
import { Plus } from "lucide-react";

function LancamentosContent() {
  const { mes, ano } = useMonth();
  const [fabOpen, setFabOpen] = useState(false);
  const lancamentos = useQuery(api.lancamentos.list, { mes, ano });

  if (!lancamentos) {
    return <div className="flex-1 flex items-center justify-center" style={{ color: "var(--muted)" }}>Carregando...</div>;
  }

  return (
    <>
      <div className="flex-1 scrollable px-4 pt-4 pb-24">
        <div
          className="text-[10px] font-medium uppercase tracking-widest mb-[10px]"
          style={{ color: "var(--muted)", fontFamily: "var(--font-dm-mono)" }}
        >
          Histórico de lançamentos
        </div>
        <TransactionList lancamentos={lancamentos} mes={mes} ano={ano} />
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

export default function LancamentosPage() {
  return (
    <Shell>
      <TopBar />
      <Suspense fallback={null}>
        <LancamentosContent />
      </Suspense>
      <BottomNav />
    </Shell>
  );
}

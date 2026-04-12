"use client";

import { Suspense, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMonth } from "@/hooks/useMonth";
import { Shell } from "@/components/layout/Shell";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { TransactionList } from "@/components/lancamentos/TransactionList";
import { TemplateCards } from "@/components/lancamentos/TemplateCards";
import { AddTransactionSheet } from "@/components/sheets/AddTransactionSheet";
import { ImportExcelSheet } from "@/components/sheets/ImportExcelSheet";
import { Plus, Upload } from "lucide-react";

function LancamentosContent() {
  const { mes, ano } = useMonth();
  const [fabOpen, setFabOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const lancamentos = useQuery(api.lancamentos.list, { mes, ano });
  const config = useQuery(api.configs.get);

  if (!lancamentos || config === undefined) {
    return <div className="flex-1 flex items-center justify-center" style={{ color: "var(--muted)" }}>Carregando...</div>;
  }

  return (
    <>
      <div className="flex-1 scrollable px-4 pt-4 pb-24">
        {config && (
          <TemplateCards lancamentos={lancamentos} renda={config.renda} mes={mes} ano={ano} />
        )}
        <div
          className="text-[10px] font-medium uppercase tracking-widest mb-[10px]"
          style={{ color: "var(--muted)", fontFamily: "var(--font-dm-mono)" }}
        >
          Histórico de lançamentos
        </div>
        <TransactionList lancamentos={lancamentos} mes={mes} ano={ano} />
      </div>

      {/* FAB — importar Excel */}
      <button
        onClick={() => setImportOpen(true)}
        className="fixed bottom-[76px] right-[68px] w-[44px] h-[44px] rounded-full flex items-center justify-center z-50 transition-transform active:scale-95"
        style={{
          background: "var(--surface2)",
          border: "1px solid var(--border2)",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        }}
      >
        <Upload size={18} style={{ color: "var(--muted)" }} />
      </button>

      {/* FAB — novo lançamento */}
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
      <ImportExcelSheet open={importOpen} onClose={() => setImportOpen(false)} />
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

"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { CLUSTER_DEFAULTS, CLUSTER_NAMES, MONTHS, type ClusterName } from "@/lib/clusters";
import { fmt } from "@/lib/utils";
import { EditTransactionSheet } from "@/components/sheets/EditTransactionSheet";
import { Pencil, Trash2, Undo2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface Lancamento {
  _id: Id<"lancamentos">;
  cluster: string;
  tipo: string;
  ident: string;
  valor: number;
  mes: number;
  ano: number;
  pagamento?: string;
}

interface Props {
  lancamentos: Lancamento[];
  mes: number;
  ano: number;
}

const UNDO_DELAY = 5000;

export function TransactionList({ lancamentos, mes, ano }: Props) {
  const [editing, setEditing] = useState<Lancamento | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<Lancamento | null>(null);
  const [undoItem, setUndoItem] = useState<Lancamento | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const remove = useMutation(api.lancamentos.remove);
  const add = useMutation(api.lancamentos.add);

  // Limpa timer ao desmontar
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  async function handleConfirmDelete() {
    if (!confirmTarget) return;
    const deleted = confirmTarget;
    setConfirmTarget(null);
    await remove({ id: deleted._id });

    // Mostra undo toast
    setUndoItem(deleted);
    timerRef.current = setTimeout(() => setUndoItem(null), UNDO_DELAY);
  }

  async function handleUndo() {
    if (!undoItem) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    const item = undoItem;
    setUndoItem(null);
    await add({
      cluster: item.cluster,
      tipo: item.tipo,
      ident: item.ident,
      valor: item.valor,
      mes: item.mes,
      ano: item.ano,
      pagamento: item.pagamento,
    });
  }

  if (lancamentos.length === 0) {
    return (
      <div className="text-center py-12 px-6 text-sm leading-loose" style={{ color: "var(--muted)" }}>
        Comece registrando seu primeiro gasto em<br />
        <strong style={{ color: "var(--text)" }}>{MONTHS[mes]} {ano}</strong>.<br />
        Leva menos de 10 segundos. Use o +
      </div>
    );
  }

  // Group by cluster
  const grouped: Record<string, Lancamento[]> = {};
  CLUSTER_NAMES.forEach((k) => (grouped[k] = []));
  lancamentos.forEach((l) => { if (grouped[l.cluster]) grouped[l.cluster].push(l); });

  return (
    <>
      <EditTransactionSheet key={editing?._id} lancamento={editing} onClose={() => setEditing(null)} />

      {/* Bottom sheet de confirmação */}
      <AnimatePresence>
        {confirmTarget && (
          <>
            <motion.div
              key="confirm-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[200]"
              style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
              onClick={() => setConfirmTarget(null)}
            />
            <motion.div
              key="confirm-sheet"
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="fixed bottom-0 left-0 right-0 mx-auto z-[201] rounded-t-[20px] p-5 pb-8"
              style={{ maxWidth: 430, background: "var(--surface)", borderTop: "1px solid var(--border2)" }}
            >
              <p className="text-[15px] font-semibold mb-1" style={{ color: "var(--text)" }}>
                Remover lançamento?
              </p>
              <p className="text-[13px] mb-5" style={{ color: "var(--muted)" }}>
                <strong style={{ color: "var(--text)" }}>{confirmTarget.ident}</strong>
                {" — "}{fmt(confirmTarget.valor)} não poderá ser recuperado automaticamente.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmTarget(null)}
                  className="flex-1 h-[44px] rounded-lg text-[14px] font-medium transition-opacity active:opacity-70"
                  style={{ background: "var(--surface2)", border: "1px solid var(--border2)", color: "var(--text)" }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 h-[44px] rounded-lg text-[14px] font-semibold transition-opacity active:opacity-70"
                  style={{ background: "rgba(255,91,91,0.12)", border: "1px solid rgba(255,91,91,0.3)", color: "#ff5b5b" }}
                >
                  Remover
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast de desfazer */}
      <AnimatePresence>
        {undoItem && (
          <motion.div
            key="undo-toast"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed bottom-[84px] left-0 right-0 mx-auto z-[300] px-4"
            style={{ maxWidth: 430 }}
          >
            <div
              className="flex items-center justify-between rounded-xl px-4 py-3"
              style={{ background: "var(--surface2)", border: "1px solid var(--border2)", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}
            >
              <span className="text-[13px]" style={{ color: "var(--muted)" }}>
                <strong style={{ color: "var(--text)" }}>{undoItem.ident}</strong> removido
              </span>
              <button
                onClick={handleUndo}
                className="flex items-center gap-1.5 text-[13px] font-semibold ml-4 transition-opacity active:opacity-70"
                style={{ color: "var(--green)" }}
              >
                <Undo2 size={14} />
                Desfazer
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista */}
      <div>
        {CLUSTER_NAMES.map((cluster) => {
          const items = grouped[cluster];
          if (!items.length) return null;
          const color = CLUSTER_DEFAULTS[cluster as ClusterName]?.color ?? "#888";
          const total = items.reduce((s, i) => s + i.valor, 0);

          return (
            <div key={cluster} className="mb-4">
              <div
                className="text-[10px] font-medium uppercase tracking-widest mb-[6px] pb-[6px] border-b"
                style={{ color, borderColor: "var(--border)" }}
              >
                {cluster} · {fmt(total)}
              </div>
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center px-3 py-[9px] rounded-lg mb-[5px]"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="w-[7px] h-[7px] rounded-full mr-[10px] shrink-0" style={{ background: color }} />
                    <div className="min-w-0">
                      <div className="text-[13px] truncate max-w-[160px]" style={{ color: "var(--text)" }}>
                        {item.ident}
                      </div>
                      <div className="text-[11px]" style={{ color: "var(--muted)" }}>
                        {item.tipo}
                      </div>
                    </div>
                  </div>
                  <div
                    className="text-[13px] font-medium ml-2 shrink-0"
                    style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text)" }}
                  >
                    {fmt(item.valor)}
                  </div>
                  <button
                    onClick={() => setEditing(item)}
                    className="pl-2 opacity-40 hover:opacity-100 transition-opacity"
                    style={{ color: "var(--muted)" }}
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setConfirmTarget(item)}
                    className="pl-1 opacity-40 hover:opacity-100 transition-opacity"
                    style={{ color: "var(--muted)" }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </>
  );
}

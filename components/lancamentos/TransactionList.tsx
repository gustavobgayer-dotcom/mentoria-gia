"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { CLUSTER_DEFAULTS, CLUSTER_NAMES, MONTHS, type ClusterName } from "@/lib/clusters";
import { fmt } from "@/lib/utils";

interface Lancamento {
  _id: Id<"lancamentos">;
  cluster: string;
  tipo: string;
  ident: string;
  valor: number;
  mes: number;
  ano: number;
}

interface Props {
  lancamentos: Lancamento[];
  mes: number;
  ano: number;
}

export function TransactionList({ lancamentos, mes, ano }: Props) {
  const remove = useMutation(api.lancamentos.remove);

  async function handleDelete(id: Id<"lancamentos">) {
    if (!confirm("Remover este lançamento?")) return;
    await remove({ id });
  }

  if (lancamentos.length === 0) {
    return (
      <div className="text-center py-12 px-6 text-sm leading-loose" style={{ color: "var(--muted)" }}>
        Nenhum lançamento em<br />
        <strong style={{ color: "var(--text)" }}>{MONTHS[mes]} {ano}</strong>.<br />
        Use o + para adicionar.
      </div>
    );
  }

  // Group by cluster
  const grouped: Record<string, Lancamento[]> = {};
  CLUSTER_NAMES.forEach((k) => (grouped[k] = []));
  lancamentos.forEach((l) => {
    if (grouped[l.cluster]) grouped[l.cluster].push(l);
  });

  return (
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
                  <div
                    className="w-[7px] h-[7px] rounded-full mr-[10px] shrink-0"
                    style={{ background: color }}
                  />
                  <div className="min-w-0">
                    <div
                      className="text-[13px] truncate max-w-[160px]"
                      style={{ color: "var(--text)" }}
                    >
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
                  onClick={() => handleDelete(item._id)}
                  className="pl-2 text-lg opacity-40 hover:opacity-100 transition-opacity"
                  style={{ color: "var(--muted)" }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

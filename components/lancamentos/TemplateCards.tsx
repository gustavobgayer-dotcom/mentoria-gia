"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CLUSTER_DEFAULTS, type ClusterName } from "@/lib/clusters";
import { TRANSACTION_TEMPLATES, type TransactionTemplate } from "@/lib/templates";
import { fmt } from "@/lib/utils";

interface Lancamento {
  cluster: string;
  ident: string;
}

interface Props {
  lancamentos: Lancamento[];
  renda: number;
  mes: number;
  ano: number;
}

export function TemplateCards({ lancamentos, renda, mes, ano }: Props) {
  const pending = TRANSACTION_TEMPLATES.filter(
    (t) => !lancamentos.some((l) => l.cluster === t.cluster && l.ident === t.ident)
  );

  if (pending.length === 0) return null;

  return (
    <div className="mb-4">
      <div
        className="text-[10px] font-medium uppercase tracking-widest mb-[8px]"
        style={{ color: "var(--amber)", fontFamily: "var(--font-dm-mono)" }}
      >
        💡 Sugestões de lançamento
      </div>
      {pending.map((t) => (
        <TemplateCard key={t.ident} template={t} renda={renda} mes={mes} ano={ano} />
      ))}
    </div>
  );
}

function TemplateCard({
  template, renda, mes, ano,
}: {
  template: TransactionTemplate;
  renda: number;
  mes: number;
  ano: number;
}) {
  const autoValue = template.valorAuto ? template.valorAuto(renda) : null;
  const [valor, setValor] = useState(autoValue !== null ? String(autoValue) : "");
  const [loading, setLoading] = useState(false);
  const add = useMutation(api.lancamentos.add);
  const color = CLUSTER_DEFAULTS[template.cluster as ClusterName]?.color ?? "#888";

  async function confirm() {
    const v = parseFloat(valor);
    if (!v || v <= 0) return;
    setLoading(true);
    await add({
      cluster: template.cluster,
      tipo: template.tipo,
      ident: template.ident,
      valor: v,
      mes,
      ano,
    });
  }

  return (
    <div
      className="flex items-center gap-3 rounded-xl px-3 py-[10px] mb-[8px]"
      style={{
        background: "var(--surface)",
        border: `1px solid var(--border)`,
        borderLeft: `3px solid ${color}`,
      }}
    >
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium truncate" style={{ color: "var(--text)" }}>
          {template.ident}
        </div>
        <div className="text-[11px]" style={{ color: "var(--muted)" }}>
          {template.tipo}
          {autoValue !== null && (
            <span style={{ color: color }}> · {fmt(autoValue)}</span>
          )}
        </div>
      </div>

      <input
        type="number"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        placeholder="0,00"
        inputMode="decimal"
        min="0"
        step="1"
        className="w-[90px] h-[34px] rounded-lg px-2 text-sm outline-none transition-colors text-right shrink-0"
        style={{
          background: "var(--surface2)",
          border: "1px solid var(--border2)",
          color: "var(--text)",
          fontFamily: "var(--font-dm-mono)",
        }}
        onFocus={(e) => (e.target.style.borderColor = color)}
        onBlur={(e) => (e.target.style.borderColor = "var(--border2)")}
      />
      <button
        onClick={confirm}
        disabled={loading || !valor || parseFloat(valor) <= 0}
        className="h-[34px] px-3 rounded-lg text-[12px] font-semibold transition-opacity active:opacity-85 disabled:opacity-40 shrink-0"
        style={{ background: color, color: "#0a0f1e" }}
      >
        {loading ? "..." : "OK"}
      </button>
    </div>
  );
}

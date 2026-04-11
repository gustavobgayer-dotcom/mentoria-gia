"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { CLUSTER_NAMES, PAYMENT_METHODS } from "@/lib/clusters";
import { BottomSheet } from "./BottomSheet";

interface Lancamento {
  _id: Id<"lancamentos">;
  cluster: string;
  tipo: string;
  ident: string;
  valor: number;
  pagamento?: string;
}

interface Props {
  lancamento: Lancamento | null;
  onClose: () => void;
}

export function EditTransactionSheet({ lancamento, onClose }: Props) {
  const [form, setForm] = useState({
    cluster: lancamento?.cluster ?? CLUSTER_NAMES[0],
    tipo: lancamento?.tipo ?? "",
    ident: lancamento?.ident ?? "",
    valor: lancamento ? String(lancamento.valor) : "",
    pagamento: lancamento?.pagamento ?? PAYMENT_METHODS[0],
  });
  const [error, setError] = useState("");
  const update = useMutation(api.lancamentos.update);

  // reset form when lancamento changes
  function field(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setError("");
  }

  async function save() {
    if (!form.tipo.trim() || !form.ident.trim()) {
      setError("Preencha o tipo e a identificação.");
      return;
    }
    const valor = parseFloat(form.valor);
    if (isNaN(valor) || valor <= 0) {
      setError("Informe um valor válido.");
      return;
    }
    await update({
      id: lancamento!._id,
      cluster: form.cluster,
      tipo: form.tipo.trim(),
      ident: form.ident.trim(),
      valor,
      pagamento: form.pagamento,
    });
    onClose();
  }

  return (
    <BottomSheet open={!!lancamento} onClose={onClose} title="Editar lançamento">
      <Field label="Cluster">
        <Select value={form.cluster} onChange={(v) => field("cluster", v)} options={CLUSTER_NAMES} />
      </Field>
      <Field label="Tipo">
        <Input value={form.tipo} onChange={(v) => field("tipo", v)} placeholder="Ex: Comida, Assinatura, Casa..." />
      </Field>
      <Field label="Identificação">
        <Input value={form.ident} onChange={(v) => field("ident", v)} placeholder="Ex: Mercado, Netflix, Aluguel..." />
      </Field>
      <Field label="Valor (R$)">
        <Input type="number" value={form.valor} onChange={(v) => field("valor", v)} placeholder="0,00" inputMode="decimal" />
      </Field>
      <Field label="Pagamento">
        <Select value={form.pagamento} onChange={(v) => field("pagamento", v)} options={PAYMENT_METHODS} />
      </Field>
      {error && <p className="text-xs mb-3" style={{ color: "var(--red)" }}>{error}</p>}
      <button
        onClick={save}
        className="w-full h-[46px] rounded-lg text-[15px] font-semibold mt-2 transition-opacity active:opacity-85"
        style={{ background: "var(--green)", color: "#0a0f1e" }}
      >
        Salvar alterações
      </button>
    </BottomSheet>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-[11px] uppercase tracking-wider mb-2" style={{ color: "var(--muted)", fontFamily: "var(--font-dm-mono)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text", inputMode }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      inputMode={inputMode}
      className="w-full h-[42px] rounded-lg px-3 text-sm outline-none transition-colors"
      style={{ background: "var(--surface2)", border: "1px solid var(--border2)", color: "var(--text)" }}
      onFocus={(e) => (e.target.style.borderColor = "var(--green)")}
      onBlur={(e) => (e.target.style.borderColor = "var(--border2)")}
    />
  );
}

function Select({ value, onChange, options }: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-[42px] rounded-lg px-3 text-sm outline-none appearance-none transition-colors"
      style={{ background: "var(--surface2)", border: "1px solid var(--border2)", color: "var(--text)" }}
    >
      {options.map((o) => (
        <option key={o} value={o} style={{ background: "var(--surface)" }}>{o}</option>
      ))}
    </select>
  );
}

"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMonth } from "@/hooks/useMonth";
import { CLUSTER_DEFAULTS, CLUSTER_NAMES, PAYMENT_METHODS, type ClusterName } from "@/lib/clusters";
import { BottomSheet } from "./BottomSheet";

// ─── Tipos por cluster ────────────────────────────────────────────────────────
export const TIPO_OPTIONS: Record<ClusterName, string[]> = {
  "Liberdade Financeira": ["Ações", "Fundos", "Previdência", "Renda Fixa", "Criptomoeda", "Outros"],
  "Custo Fixo": ["Aluguel", "Financiamento", "Água", "Luz", "Internet", "Celular", "Condomínio", "Plano de Saúde", "Escola", "Outros"],
  "Conforto": ["Alimentação", "Academia", "Streaming", "Transporte", "Vestuário", "Farmácia", "Outros"],
  "Metas": ["Viagem", "Veículo", "Reforma", "Presente", "Reserva de Emergência", "Outros"],
  "Prazeres": ["Restaurante", "Delivery", "Cinema", "Shows", "Hobbies", "Jogos", "Outros"],
  "Conhecimento": ["Curso", "Livro", "Workshop", "Mentoria", "App / Assinatura", "Outros"],
};

interface Props {
  open: boolean;
  onClose: () => void;
}

const defaultCluster = CLUSTER_NAMES[0];
const INITIAL = {
  cluster: defaultCluster,
  tipo: TIPO_OPTIONS[defaultCluster][0],
  tipoCustom: "",
  ident: "",
  valor: "",
  pagamento: PAYMENT_METHODS[0],
};

export function AddTransactionSheet({ open, onClose }: Props) {
  const { mes, ano } = useMonth();
  const [form, setForm] = useState(INITIAL);
  const [error, setError] = useState("");
  const addLancamento = useMutation(api.lancamentos.add);

  function field<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setError("");
  }

  function handleClusterChange(cluster: string) {
    const cl = cluster as ClusterName;
    setForm((f) => ({
      ...f,
      cluster,
      tipo: TIPO_OPTIONS[cl]?.[0] ?? "",
      tipoCustom: "",
    }));
    setError("");
  }

  async function save() {
    const finalTipo = form.tipo === "Outros" ? form.tipoCustom.trim() : form.tipo;
    if (!finalTipo) {
      setError("Selecione ou informe o tipo do gasto.");
      return;
    }
    if (!form.ident.trim()) {
      setError("Informe uma descrição para o lançamento.");
      return;
    }
    const valor = parseFloat(form.valor);
    if (isNaN(valor) || valor <= 0) {
      setError("Informe um valor válido.");
      return;
    }
    await addLancamento({
      cluster: form.cluster,
      tipo: finalTipo,
      ident: form.ident.trim(),
      valor,
      mes,
      ano,
      pagamento: form.pagamento,
    });
    setForm(INITIAL);
    onClose();
  }

  const tipoOpts = TIPO_OPTIONS[form.cluster as ClusterName] ?? [];

  return (
    <BottomSheet open={open} onClose={onClose} title="Novo lançamento">

      {/* Cluster — grid visual com dots coloridos */}
      <Field label="Área">
        <ClusterGrid value={form.cluster} onChange={handleClusterChange} />
      </Field>

      {/* Tipo — select dinâmico por cluster */}
      <Field label="Tipo">
        <NativeSelect
          value={form.tipo}
          onChange={(v) => field("tipo", v)}
          options={tipoOpts}
        />
      </Field>

      {/* Input de tipo personalizado quando "Outros" */}
      {form.tipo === "Outros" && (
        <Field label="Descreva o tipo">
          <TextInput
            value={form.tipoCustom}
            onChange={(v) => field("tipoCustom", v)}
            placeholder="Ex: Seguro, Associação..."
            autoFocus
          />
        </Field>
      )}

      {/* Descrição */}
      <Field label="Descrição">
        <TextInput
          value={form.ident}
          onChange={(v) => field("ident", v)}
          placeholder="Ex: Mercado, Netflix, Aluguel..."
        />
      </Field>

      {/* Valor */}
      <Field label="Valor (R$)">
        <TextInput
          value={form.valor}
          onChange={(v) => field("valor", v)}
          placeholder="0,00"
          inputMode="decimal"
          type="number"
        />
      </Field>

      {/* Pagamento */}
      <Field label="Pagamento">
        <NativeSelect
          value={form.pagamento}
          onChange={(v) => field("pagamento", v)}
          options={[...PAYMENT_METHODS]}
        />
      </Field>

      {error && <p className="text-xs mb-3" style={{ color: "var(--red)" }}>{error}</p>}

      <button
        onClick={save}
        className="w-full h-[46px] rounded-lg text-[15px] font-semibold mt-2 transition-opacity active:opacity-85"
        style={{ background: "var(--green)", color: "#0a0f1e" }}
      >
        Salvar lançamento
      </button>
    </BottomSheet>
  );
}

// ─── Cluster grid com dots coloridos ─────────────────────────────────────────
function ClusterGrid({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-[6px]">
      {CLUSTER_NAMES.map((name) => {
        const color = CLUSTER_DEFAULTS[name].color;
        const active = value === name;
        return (
          <button
            key={name}
            type="button"
            onClick={() => onChange(name)}
            className="flex items-center gap-2 h-[36px] rounded-lg px-3 text-[12px] font-medium text-left transition-all active:scale-95"
            style={{
              background: active ? `${color}20` : "var(--surface2)",
              border: `1px solid ${active ? color : "var(--border2)"}`,
              color: active ? color : "var(--muted)",
            }}
          >
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
            <span className="truncate">{name === "Liberdade Financeira" ? "Liberdade" : name}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Shared primitives ────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label
        className="block text-[11px] uppercase tracking-wider mb-2"
        style={{ color: "var(--muted)", fontFamily: "var(--font-dm-mono)" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function TextInput({
  value, onChange, placeholder, type = "text", inputMode, autoFocus,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoFocus?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      inputMode={inputMode}
      autoFocus={autoFocus}
      className="w-full h-[42px] rounded-lg px-3 text-sm outline-none transition-colors"
      style={{
        background: "var(--surface2)",
        border: "1px solid var(--border2)",
        color: "var(--text)",
      }}
      onFocus={(e) => (e.target.style.borderColor = "var(--green)")}
      onBlur={(e) => (e.target.style.borderColor = "var(--border2)")}
    />
  );
}

function NativeSelect({
  value, onChange, options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-[42px] rounded-lg px-3 text-sm outline-none appearance-none transition-colors"
      style={{
        background: "var(--surface2)",
        border: "1px solid var(--border2)",
        color: "var(--text)",
      }}
    >
      {options.map((o) => (
        <option key={o} value={o} style={{ background: "var(--surface)" }}>
          {o}
        </option>
      ))}
    </select>
  );
}

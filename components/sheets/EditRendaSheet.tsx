"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BottomSheet } from "./BottomSheet";

interface Props {
  open: boolean;
  onClose: () => void;
  currentRenda: number;
}

export function EditRendaSheet({ open, onClose, currentRenda }: Props) {
  const [value, setValue] = useState(String(currentRenda));
  const updateRenda = useMutation(api.configs.updateRenda);

  async function save() {
    const v = parseFloat(value);
    if (!isNaN(v) && v > 0) {
      await updateRenda({ renda: v });
      onClose();
    }
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Renda mensal líquida">
      <div className="mb-4">
        <label
          className="block text-[11px] uppercase tracking-wider mb-2"
          style={{ color: "var(--muted)", fontFamily: "var(--font-dm-mono)" }}
        >
          Valor (R$)
        </label>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="13340"
          step="1"
          min="0"
          inputMode="decimal"
          autoFocus
          className="w-full h-[58px] rounded-lg px-4 text-[26px] font-light outline-none transition-colors"
          style={{
            background: "var(--surface2)",
            border: "1px solid var(--border2)",
            color: "var(--text)",
            fontFamily: "var(--font-dm-mono)",
            letterSpacing: "-0.5px",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--green)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border2)")}
        />
        <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>
          Informe o valor líquido após impostos e contribuições.
        </p>
      </div>
      <button
        onClick={save}
        className="w-full h-[46px] rounded-lg text-[15px] font-semibold transition-opacity active:opacity-85"
        style={{ background: "var(--green)", color: "#0a0f1e" }}
      >
        Salvar renda
      </button>
    </BottomSheet>
  );
}

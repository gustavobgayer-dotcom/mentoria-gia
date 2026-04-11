"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function OnboardingScreen() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const updateRenda = useMutation(api.configs.updateRenda);

  async function handleSubmit() {
    const renda = parseFloat(value);
    if (!renda || renda <= 0) return;
    setLoading(true);
    await updateRenda({ renda });
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mb-6 text-2xl"
        style={{ background: "var(--green-bg)", border: "1px solid var(--green)" }}
      >
        🎯
      </div>

      <h1
        className="text-[22px] font-semibold text-center mb-3 leading-tight"
        style={{ color: "var(--text)" }}
      >
        Parabéns por dar o primeiro passo!
      </h1>

      <p className="text-center text-[14px] mb-2 leading-relaxed" style={{ color: "var(--muted)" }}>
        Organizar suas finanças é uma das melhores decisões que você pode tomar.
      </p>
      <p className="text-center text-[14px] mb-8 leading-relaxed" style={{ color: "var(--muted)" }}>
        Para começar, informe sua <span style={{ color: "var(--text)" }}>renda líquida mensal</span> — o valor que você recebe após impostos e contribuições.
      </p>

      <div className="w-full mb-3">
        <label
          className="block text-[11px] uppercase tracking-wider mb-2"
          style={{ color: "var(--muted)", fontFamily: "var(--font-dm-mono)" }}
        >
          Renda líquida mensal (R$)
        </label>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="0"
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
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !value || parseFloat(value) <= 0}
        className="w-full h-[46px] rounded-lg text-[15px] font-semibold transition-opacity active:opacity-85 disabled:opacity-40"
        style={{ background: "var(--green)", color: "#0a0f1e" }}
      >
        {loading ? "Salvando..." : "Começar organização"}
      </button>
    </div>
  );
}

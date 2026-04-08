"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMonth } from "@/hooks/useMonth";
import { MONTHS } from "@/lib/clusters";
import { BottomSheet } from "./BottomSheet";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function MonthPickerSheet({ open, onClose }: Props) {
  const { mes, ano, setMonth } = useMonth();
  const [pickMes, setPickMes] = useState(mes);
  const [pickAno, setPickAno] = useState(ano);

  function confirm() {
    setMonth(pickMes, pickAno);
    onClose();
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Selecionar mês">
      {/* Year row */}
      <div className="flex items-center justify-center gap-5 mb-4">
        <button
          onClick={() => setPickAno((y) => y - 1)}
          className="w-[34px] h-[34px] rounded-lg flex items-center justify-center text-lg transition-colors"
          style={{ background: "var(--surface2)", border: "1px solid var(--border2)", color: "var(--text)" }}
        >
          <ChevronLeft size={18} />
        </button>
        <span
          className="text-lg font-medium min-w-[52px] text-center"
          style={{ fontFamily: "var(--font-dm-mono)" }}
        >
          {pickAno}
        </span>
        <button
          onClick={() => setPickAno((y) => y + 1)}
          className="w-[34px] h-[34px] rounded-lg flex items-center justify-center text-lg transition-colors"
          style={{ background: "var(--surface2)", border: "1px solid var(--border2)", color: "var(--text)" }}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Month grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {MONTHS.map((m, i) => {
          const selected = i === pickMes && pickAno === ano;
          return (
            <button
              key={m}
              onClick={() => setPickMes(i)}
              className="rounded-lg py-[10px] text-[13px] text-center transition-all"
              style={{
                background: i === pickMes ? "var(--green-bg)" : "var(--surface2)",
                border: `1px solid ${i === pickMes ? "var(--green)" : "var(--border)"}`,
                color: i === pickMes ? "var(--green)" : "var(--muted)",
                fontWeight: i === pickMes ? 500 : 400,
              }}
            >
              {m.slice(0, 3)}
            </button>
          );
        })}
      </div>

      <button
        onClick={confirm}
        className="w-full h-[46px] rounded-lg text-[15px] font-semibold transition-opacity active:opacity-85"
        style={{ background: "var(--green)", color: "#0a0f1e" }}
      >
        Confirmar
      </button>
    </BottomSheet>
  );
}

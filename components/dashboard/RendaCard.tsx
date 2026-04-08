"use client";

import { useState } from "react";
import { fmt } from "@/lib/utils";
import { EditRendaSheet } from "@/components/sheets/EditRendaSheet";

interface Props {
  renda: number;
}

export function RendaCard({ renda }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="rounded-xl p-[18px] mb-[14px] flex justify-between items-center"
        style={{
          background: "linear-gradient(135deg,#0e1f3d,#112240)",
          border: "1px solid rgba(77,141,247,0.25)",
        }}
      >
        <div>
          <div
            className="text-[11px] uppercase tracking-widest"
            style={{ color: "var(--muted)", fontFamily: "var(--font-dm-mono)" }}
          >
            Renda líquida mensal
          </div>
          <div
            className="text-[28px] font-light mt-[2px]"
            style={{ letterSpacing: "-1px", color: "var(--text)" }}
          >
            <span className="text-sm font-normal" style={{ color: "var(--muted)" }}>R$</span>{" "}
            {Math.round(renda).toLocaleString("pt-BR")}
          </div>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="rounded-full text-xs px-4 py-[6px] transition-colors"
          style={{
            background: "rgba(77,141,247,0.12)",
            border: "1px solid rgba(77,141,247,0.3)",
            color: "var(--blue)",
          }}
        >
          Editar
        </button>
      </div>

      <EditRendaSheet open={open} onClose={() => setOpen(false)} currentRenda={renda} />
    </>
  );
}

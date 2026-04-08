"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useMonth } from "@/hooks/useMonth";
import { MONTHS } from "@/lib/clusters";
import { MonthPickerSheet } from "@/components/sheets/MonthPickerSheet";

export function TopBar() {
  const { mes, ano } = useMonth();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="px-[18px] pt-4 pb-3 border-b relative z-10"
        style={{ borderColor: "var(--border)", background: "var(--bg)" }}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-[10px]">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "var(--green)" }}
            >
              <svg width={18} height={18} viewBox="0 0 24 24" fill="#0a0f1e">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
            </div>
            <div>
              <div className="text-[16px] font-semibold tracking-tight">
                Sardinha Finance
              </div>
              <div
                className="text-[10px] uppercase tracking-widest mt-px"
                style={{
                  color: "var(--muted)",
                  fontFamily: "var(--font-dm-mono)",
                }}
              >
                Metodologia AUVP
              </div>
            </div>
          </div>

          {/* Month pill */}
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-[5px] rounded-full px-3 py-[5px] text-xs transition-colors"
            style={{
              background: "var(--surface2)",
              border: "1px solid var(--border2)",
              color: "var(--green)",
            }}
          >
            <span>{MONTHS[mes]} {ano}</span>
            <ChevronDown size={12} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <MonthPickerSheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}

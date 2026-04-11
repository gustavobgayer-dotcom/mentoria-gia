"use client";

import { Shell } from "@/components/layout/Shell";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Zap, TrendingUp, CreditCard, BarChart3, ShieldCheck, Sparkles } from "lucide-react";

const FEATURES = [
  {
    icon: CreditCard,
    title: "Open Finance",
    description: "Conecte seu banco e cartão. Todos os lançamentos importados e categorizados automaticamente.",
  },
  {
    icon: TrendingUp,
    title: "Previsão do mês",
    description: "O app estima seus gastos com base no histórico e te avisa antes de estourar o limite.",
  },
  {
    icon: BarChart3,
    title: "Score financeiro",
    description: "Um número simples que resume sua saúde financeira com base nos seus hábitos reais.",
  },
  {
    icon: Sparkles,
    title: "Detecção de assinaturas",
    description: "Identifica cobranças recorrentes automaticamente e te mostra quanto você gasta por mês com assinaturas.",
  },
  {
    icon: ShieldCheck,
    title: "Alertas inteligentes",
    description: "Notificações quando você está próximo de atingir o limite de gasto de um cluster.",
  },
];

export default function ProPage() {
  return (
    <Shell>
      <TopBar />
      <div className="flex-1 scrollable px-4 pt-4 pb-24">

        {/* Hero */}
        <div
          className="rounded-2xl px-5 py-6 mb-4 text-center relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0e1f3d, #1a0533)",
            border: "1px solid rgba(168,85,247,0.3)",
          }}
        >
          {/* Glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 rounded-full blur-3xl opacity-30"
            style={{ background: "#a855f7" }}
          />

          <div
            className="inline-flex items-center gap-[6px] rounded-full px-3 py-1 text-[11px] font-semibold mb-3 relative"
            style={{
              background: "rgba(168,85,247,0.15)",
              border: "1px solid rgba(168,85,247,0.4)",
              color: "#c084fc",
              fontFamily: "var(--font-dm-mono)",
              letterSpacing: "0.08em",
            }}
          >
            <Zap size={11} fill="#c084fc" strokeWidth={0} />
            SARDINHA PRO
          </div>

          <h1
            className="text-[22px] font-semibold leading-tight mb-2 relative"
            style={{ letterSpacing: "-0.5px" }}
          >
            Controle total das<br />suas finanças
          </h1>

          <p className="text-[13px] leading-relaxed relative" style={{ color: "var(--muted)" }}>
            Conecte seu banco, automatize seus lançamentos e tenha uma visão completa do seu dinheiro.
          </p>
        </div>

        {/* Features */}
        <div
          className="text-[10px] font-medium uppercase tracking-widest mb-3"
          style={{ color: "var(--muted)", fontFamily: "var(--font-dm-mono)" }}
        >
          O que está incluído
        </div>

        <div className="flex flex-col gap-2 mb-4">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl px-4 py-3 flex items-start gap-3"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-[1px]"
                style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" }}
              >
                <Icon size={15} color="#c084fc" strokeWidth={1.8} />
              </div>
              <div>
                <div className="text-sm font-medium mb-[2px]">{title}</div>
                <div className="text-[11px] leading-relaxed" style={{ color: "var(--muted)" }}>
                  {description}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          className="w-full py-[14px] rounded-xl text-[14px] font-semibold transition-opacity active:opacity-80"
          style={{
            background: "linear-gradient(135deg, #a855f7, #7c3aed)",
            color: "white",
            boxShadow: "0 4px 24px rgba(168,85,247,0.35)",
          }}
        >
          Assinar Sardinha PRO
        </button>

        <p className="text-[11px] text-center mt-2" style={{ color: "var(--muted)" }}>
          Em breve · Lista de espera aberta
        </p>

      </div>
      <BottomNav />
    </Shell>
  );
}

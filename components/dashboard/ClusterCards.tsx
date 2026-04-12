"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { CLUSTER_DEFAULTS, CLUSTER_NAMES, type ClusterName } from "@/lib/clusters";
import { fmt } from "@/lib/utils";

const CLUSTER_INFO: Record<ClusterName, string> = {
  "Liberdade Financeira": "Aqui vai o dinheiro que trabalha por você: ações, fundos, previdência, tesouro direto. Quanto mais você coloca aqui cedo, mais rápido seu dinheiro cresce sem você precisar trabalhar por ele.",
  "Custo Fixo": "São as contas que chegam todo mês independente do que você faz: aluguel, financiamento, escola dos filhos, plano de saúde, condomínio. O objetivo é manter esses gastos previsíveis e controlados.",
  "Conforto": "Gastos que melhoram sua rotina: academia, streaming, alimentação fora de casa, transporte por app, farmácia. Ter conforto é importante — só não pode ultrapassar o seu limite.",
  "Metas": "Dinheiro guardado para objetivos concretos: a viagem dos sonhos, trocar de carro, reformar a casa, um presente especial. Cada real aqui tem um destino certo no futuro próximo.",
  "Prazeres": "Lazer puro e simples: shows, restaurantes, jogos, hobbies, passeios. Essa área existe porque você merece aproveitar a vida agora — sem culpa, dentro do limite.",
  "Conhecimento": "Investimento em você mesmo: cursos, livros, workshops, mentorias. É o único investimento que ninguém pode tomar de você — e o retorno aparece por toda a vida.",
};

interface Props {
  renda: number;
  clusterMetas: Record<ClusterName, number>;
  totByCluster: Record<ClusterName, number>;
}

export function ClusterCards({ renda, clusterMetas, totByCluster }: Props) {
  const [openInfo, setOpenInfo] = useState<ClusterName | null>(null);

  return (
    <div>
      <div
        className="text-[10px] font-medium uppercase tracking-widest mb-[10px] mt-1"
        style={{ color: "var(--muted)", fontFamily: "var(--font-dm-mono)" }}
      >
        Limites de gasto por cluster
      </div>

      {CLUSTER_NAMES.map((name) => {
        const cfg = CLUSTER_DEFAULTS[name];
        const realizado = totByCluster[name] ?? 0;
        const metaPct = clusterMetas[name] ?? cfg.meta;
        const meta = metaPct * renda;
        const ratio = meta > 0 ? realizado / meta : 0;
        const saldoCl = meta - realizado;

        const pct = Math.round(ratio * 100);

        let badge: { label: string; cls: string };
        let barColor: string;
        if (pct > 100) {
          badge = { label: "Estourou", cls: "bg-[rgba(255,91,91,0.1)] text-[#ff5b5b]" };
          barColor = "#ff5b5b";
        } else if (pct === 100) {
          badge = { label: "Limite Atingido", cls: "bg-[rgba(0,212,160,0.1)] text-[#00d4a0]" };
          barColor = "#00d4a0";
        } else if (pct > 85) {
          badge = { label: "Próximo", cls: "bg-[rgba(245,166,35,0.1)] text-[#f5a623]" };
          barColor = "#f5a623";
        } else {
          badge = { label: "OK", cls: "bg-[rgba(0,212,160,0.1)] text-[#00d4a0]" };
          barColor = cfg.color;
        }

        const saldoColor = saldoCl >= 0 ? "#00d4a0" : "#ff5b5b";
        const isInfoOpen = openInfo === name;

        return (
          <div
            key={name}
            className="rounded-xl px-4 py-[14px] mb-[10px] transition-colors"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="flex justify-between items-start mb-[10px]">
              <div>
                <div className="flex items-center gap-[6px]">
                  <div className="text-sm font-medium">{name}</div>
                  <button
                    onClick={() => setOpenInfo(isInfoOpen ? null : name)}
                    className="flex items-center justify-center transition-opacity"
                    style={{ color: isInfoOpen ? cfg.color : "var(--muted)", opacity: isInfoOpen ? 1 : 0.6 }}
                  >
                    <Info size={13} strokeWidth={2} />
                  </button>
                </div>
                <div
                  className="text-[11px] mt-[2px]"
                  style={{ color: "var(--muted)", fontFamily: "var(--font-dm-mono)" }}
                >
                  {Math.round(metaPct * 100)}% · limite de gasto {fmt(meta)}
                </div>
              </div>
              <span className={`text-[11px] font-medium px-[9px] py-[3px] rounded-full ${badge.cls}`}>
                {badge.label}
              </span>
            </div>

            {/* Info tooltip */}
            {isInfoOpen && (
              <div
                className="text-[11px] leading-relaxed rounded-lg px-3 py-2 mb-[10px]"
                style={{
                  background: "var(--surface2)",
                  border: `1px solid ${cfg.color}30`,
                  color: "var(--muted)",
                }}
              >
                {CLUSTER_INFO[name]}
              </div>
            )}

            {/* Progress bar with % inside */}
            <div className="h-5 rounded-full overflow-hidden relative" style={{ background: "var(--surface2)" }}>
              <div
                className="h-full rounded-full transition-[width] duration-500"
                style={{ width: `${Math.min(ratio, 1) * 100}%`, background: barColor }}
              />
              <span
                className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold"
                style={{ color: "white", fontFamily: "var(--font-dm-mono)" }}
              >
                {pct}%
              </span>
            </div>

            <div className="flex justify-between mt-2 text-xs" style={{ color: "var(--muted)" }}>
              <span>
                Gasto: <strong style={{ color: "var(--text)", fontWeight: 500 }}>{fmt(realizado)}</strong>
              </span>
              <span>
                Saldo: <strong style={{ color: saldoColor, fontWeight: 500 }}>{fmt(saldoCl)}</strong>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

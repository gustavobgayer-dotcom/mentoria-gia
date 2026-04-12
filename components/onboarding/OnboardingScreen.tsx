"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AnimatePresence, motion } from "motion/react";
import { LayoutDashboard, Activity, ClipboardList, Settings, ChevronRight, ChevronLeft, X } from "lucide-react";
import { CLUSTER_DEFAULTS, CLUSTER_NAMES, type ClusterName } from "@/lib/clusters";

const CLUSTER_SUBTITLES: Record<ClusterName, string> = {
  "Liberdade Financeira": "Investimentos e futuro",
  "Custo Fixo":           "Moradia e contas fixas",
  "Conforto":             "Qualidade de vida",
  "Metas":                "Seus sonhos e objetivos",
  "Prazeres":             "Lazer e diversão",
  "Conhecimento":         "Cursos e crescimento",
};

const TABS = [
  {
    Icon: LayoutDashboard,
    label: "Dashboard",
    desc: "Visão geral do mês. Veja quanto gastou em cada área e se está dentro das metas.",
  },
  {
    Icon: ClipboardList,
    label: "Lançamentos",
    desc: "Registre cada gasto aqui. Leva menos de 10 segundos e mantém tudo organizado.",
  },
  {
    Icon: Activity,
    label: "Gráficos",
    desc: "Compare seus gastos com as metas e veja sua evolução mês a mês.",
  },
  {
    Icon: Settings,
    label: "Config",
    desc: "Ajuste os percentuais de cada área e atualize sua renda quando precisar.",
  },
];

// ─── Step 0: Boas-vindas ────────────────────────────────────────────────────
function StepBemVindo() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-6 text-3xl"
        style={{ background: "var(--green-bg)", border: "1px solid var(--green)" }}
      >
        🐟
      </div>

      <h1 className="text-[24px] font-semibold mb-4 leading-tight" style={{ color: "var(--text)" }}>
        Bem-vindo ao Sardinha!
      </h1>

      <p className="text-[14px] leading-relaxed mb-4" style={{ color: "var(--muted)" }}>
        O app que te ajuda a organizar o dinheiro e conquistar a{" "}
        <span style={{ color: "var(--text)" }}>liberdade financeira</span> — passo a passo.
      </p>

      <p className="text-[14px] leading-relaxed" style={{ color: "var(--muted)" }}>
        A ideia é simples: cada real que você ganha é dividido em{" "}
        <span style={{ color: "var(--text)" }}>6 áreas</span>. Você decide quanto vai pra cada uma.
        O Sardinha acompanha e te avisa quando algo sai do planejado.
      </p>
    </div>
  );
}

// ─── Step 1: Os 6 clusters ──────────────────────────────────────────────────
function StepClusters() {
  return (
    <div className="flex-1 flex flex-col justify-center px-6">
      <h2 className="text-[20px] font-semibold mb-1" style={{ color: "var(--text)" }}>
        Seu dinheiro dividido em 6 áreas
      </h2>
      <p className="text-[13px] mb-5" style={{ color: "var(--muted)" }}>
        Cada área tem uma meta de percentual. Você ajusta depois.
      </p>

      <div className="flex flex-col gap-3">
        {CLUSTER_NAMES.map((name) => {
          const { color, meta } = CLUSTER_DEFAULTS[name];
          return (
            <div key={name} className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ background: color }}
              />
              <div className="flex-1 min-w-0">
                <span className="text-[14px] font-medium" style={{ color: "var(--text)" }}>
                  {name}
                </span>
                <span className="text-[13px] ml-2" style={{ color: "var(--muted)" }}>
                  {CLUSTER_SUBTITLES[name]}
                </span>
              </div>
              <span
                className="text-[13px] font-medium flex-shrink-0"
                style={{ color, fontFamily: "var(--font-dm-mono)" }}
              >
                {Math.round(meta * 100)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 2: As abas ────────────────────────────────────────────────────────
function StepAbas() {
  return (
    <div className="flex-1 flex flex-col justify-center px-6">
      <h2 className="text-[20px] font-semibold mb-1" style={{ color: "var(--text)" }}>
        O app tem 4 áreas principais
      </h2>
      <p className="text-[13px] mb-5" style={{ color: "var(--muted)" }}>
        Cada aba tem um propósito claro.
      </p>

      <div className="flex flex-col gap-3">
        {TABS.map(({ Icon, label, desc }) => (
          <div
            key={label}
            className="flex items-start gap-3 rounded-xl p-3"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: "var(--surface2)" }}
            >
              <Icon size={16} strokeWidth={1.8} style={{ color: "var(--green)" }} />
            </div>
            <div className="min-w-0">
              <p className="text-[14px] font-medium mb-0.5" style={{ color: "var(--text)" }}>
                {label}
              </p>
              <p className="text-[12px] leading-relaxed" style={{ color: "var(--muted)" }}>
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 3: Renda ──────────────────────────────────────────────────────────
function StepRenda({
  value,
  onChange,
  onSubmit,
  loading,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  return (
    <div className="flex-1 flex flex-col justify-center px-6">
      <h2 className="text-[20px] font-semibold mb-2" style={{ color: "var(--text)" }}>
        Quase lá! Uma pergunta:
      </h2>
      <p className="text-[14px] mb-1 leading-relaxed" style={{ color: "var(--muted)" }}>
        Qual é a sua{" "}
        <span style={{ color: "var(--text)" }}>renda líquida mensal</span>?
      </p>
      <p className="text-[13px] mb-6 leading-relaxed" style={{ color: "var(--muted)" }}>
        O valor que cai na sua conta após impostos e descontos.
      </p>

      <div className="w-full mb-2">
        <label
          className="block text-[11px] uppercase tracking-wider mb-2"
          style={{ color: "var(--muted)", fontFamily: "var(--font-dm-mono)" }}
        >
          Renda líquida (R$)
        </label>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
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
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        />
      </div>

      <p className="text-[12px]" style={{ color: "var(--muted)" }}>
        Você pode alterar isso a qualquer momento em Config.
      </p>
    </div>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────
export function OnboardingScreen({ onClose }: { onClose?: () => void }) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [renda, setRenda] = useState("");
  const [loading, setLoading] = useState(false);
  const updateRenda = useMutation(api.configs.updateRenda);
  const isTutorial = !!onClose;

  const TOTAL_STEPS = 4;

  function goNext() {
    setDirection(1);
    setStep((s) => s + 1);
  }

  function goBack() {
    setDirection(-1);
    setStep((s) => s - 1);
  }

  async function handleSubmit() {
    if (isTutorial) { onClose(); return; }
    const val = parseFloat(renda);
    if (!val || val <= 0) return;
    setLoading(true);
    await updateRenda({ renda: val });
  }

  const isLastStep = step === TOTAL_STEPS - 1;
  const canAdvance = isLastStep ? (isTutorial || parseFloat(renda) > 0) : true;

  const variants = {
    enter: (dir: number) => ({ x: dir * 40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir * -40, opacity: 0 }),
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Botão fechar (só no modo tutorial) */}
      {isTutorial && (
        <div className="flex justify-end px-4 pt-4">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-opacity active:opacity-70"
            style={{ background: "var(--surface2)", border: "1px solid var(--border2)" }}
          >
            <X size={15} style={{ color: "var(--muted)" }} />
          </button>
        </div>
      )}

      {/* Conteúdo animado */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="absolute inset-0 flex flex-col"
          >
            {step === 0 && <StepBemVindo />}
            {step === 1 && <StepClusters />}
            {step === 2 && <StepAbas />}
            {step === 3 && (
              <StepRenda
                value={renda}
                onChange={setRenda}
                onSubmit={handleSubmit}
                loading={loading}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Rodapé: dots + navegação */}
      <div className="px-6 pb-safe pt-4 pb-8 flex items-center justify-between gap-4">
        {/* Dots */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === step ? 20 : 6,
                height: 6,
                background: i === step ? "var(--green)" : "var(--border2)",
              }}
            />
          ))}
        </div>

        {/* Botões */}
        <div className="flex items-center gap-2">
          {step > 0 && (
            <button
              onClick={goBack}
              className="w-[40px] h-[40px] rounded-lg flex items-center justify-center transition-opacity active:opacity-70"
              style={{ background: "var(--surface2)", border: "1px solid var(--border2)" }}
            >
              <ChevronLeft size={18} style={{ color: "var(--muted)" }} />
            </button>
          )}

          <button
            onClick={isLastStep ? handleSubmit : goNext}
            disabled={!canAdvance || loading}
            className="h-[40px] px-5 rounded-lg text-[14px] font-semibold flex items-center gap-1.5 transition-opacity active:opacity-85 disabled:opacity-40"
            style={{ background: "var(--green)", color: "#0a0f1e" }}
          >
            {isLastStep
              ? isTutorial ? "Fechar" : loading ? "Salvando..." : "Começar"
              : "Próximo"}
            {!isLastStep && <ChevronRight size={16} strokeWidth={2.5} />}
          </button>
        </div>
      </div>
    </div>
  );
}

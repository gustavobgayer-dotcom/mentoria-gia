import { fmt } from "@/lib/utils";

interface Props {
  totalGasto: number;
  saldo: number;
}

export function SummaryGrid({ totalGasto, saldo }: Props) {
  return (
    <div className="grid grid-cols-2 gap-[10px] mb-[14px]">
      <SumCard label="Total gasto" value={fmt(totalGasto)} />
      <SumCard
        label="Saldo do mês"
        value={(saldo < 0 ? "−" : "") + fmt(Math.abs(saldo))}
        color={saldo >= 0 ? "var(--green)" : "var(--red)"}
      />
    </div>
  );
}

function SumCard({
  label, value, color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div
      className="rounded-lg p-[14px]"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div
        className="text-[11px] uppercase tracking-wider"
        style={{ color: "var(--muted)", fontFamily: "var(--font-dm-mono)" }}
      >
        {label}
      </div>
      <div
        className="text-[20px] font-medium mt-1"
        style={{ letterSpacing: "-0.5px", color: color ?? "var(--text)" }}
      >
        {value}
      </div>
    </div>
  );
}

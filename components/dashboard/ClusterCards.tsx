import { CLUSTER_DEFAULTS, CLUSTER_NAMES, type ClusterName } from "@/lib/clusters";
import { fmt } from "@/lib/utils";

interface Props {
  renda: number;
  clusterMetas: Record<ClusterName, number>;
  totByCluster: Record<ClusterName, number>;
}

export function ClusterCards({ renda, clusterMetas, totByCluster }: Props) {
  return (
    <div>
      <div
        className="text-[10px] font-medium uppercase tracking-widest mb-[10px] mt-1"
        style={{ color: "var(--muted)", fontFamily: "var(--font-dm-mono)" }}
      >
        Metas por cluster
      </div>

      {CLUSTER_NAMES.map((name) => {
        const cfg = CLUSTER_DEFAULTS[name];
        const realizado = totByCluster[name] ?? 0;
        const metaPct = clusterMetas[name] ?? cfg.meta;
        const meta = metaPct * renda;
        const ratio = meta > 0 ? realizado / meta : 0;
        const saldoCl = meta - realizado;

        let badge: { label: string; cls: string };
        let barColor: string;
        if (ratio > 1) {
          badge = { label: "Estourou", cls: "bg-[rgba(255,91,91,0.1)] text-[#ff5b5b]" };
          barColor = "#ff5b5b";
        } else if (ratio > 0.85) {
          badge = { label: "Próximo", cls: "bg-[rgba(245,166,35,0.1)] text-[#f5a623]" };
          barColor = "#f5a623";
        } else {
          badge = { label: "OK", cls: "bg-[rgba(0,212,160,0.1)] text-[#00d4a0]" };
          barColor = cfg.color;
        }

        const saldoColor = saldoCl >= 0 ? "#00d4a0" : "#ff5b5b";

        return (
          <div
            key={name}
            className="rounded-xl px-4 py-[14px] mb-[10px] transition-colors"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="flex justify-between items-start mb-[10px]">
              <div>
                <div className="text-sm font-medium">{name}</div>
                <div
                  className="text-[11px] mt-[2px]"
                  style={{ color: "var(--muted)", fontFamily: "var(--font-dm-mono)" }}
                >
                  {Math.round(metaPct * 100)}% · meta {fmt(meta)}
                </div>
              </div>
              <span className={`text-[11px] font-medium px-[9px] py-[3px] rounded-full ${badge.cls}`}>
                {badge.label}
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-[5px] rounded-full overflow-hidden" style={{ background: "var(--surface2)" }}>
              <div
                className="h-full rounded-full transition-[width] duration-500"
                style={{ width: `${Math.min(ratio, 1) * 100}%`, background: barColor }}
              />
            </div>

            <div className="flex justify-between mt-2 text-xs" style={{ color: "var(--muted)" }}>
              <span>
                Gasto: <strong style={{ color: "var(--text)", fontWeight: 500 }}>{fmt(realizado)}</strong>
              </span>
              <span>{Math.round(ratio * 100)}% da meta</span>
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

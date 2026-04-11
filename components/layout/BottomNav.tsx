"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { LayoutDashboard, Activity, ClipboardList, Settings, Zap } from "lucide-react";

const NAV_ITEMS = [
  { href: "/",            label: "Dashboard",   Icon: LayoutDashboard, pro: false },
  { href: "/graficos",    label: "Gráficos",    Icon: Activity,        pro: false },
  { href: "/lancamentos", label: "Lançamentos", Icon: ClipboardList,   pro: false },
  { href: "/config",      label: "Config",      Icon: Settings,        pro: false },
  { href: "/pro",         label: "PRO",         Icon: Zap,             pro: true  },
];

function BottomNavInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const qs = searchParams.toString() ? `?${searchParams.toString()}` : "";

  return (
    <>
      {NAV_ITEMS.map(({ href, label, Icon, pro }) => {
        const active = pathname === href;

        if (pro) {
          return (
            <Link
              key={href}
              href={`${href}${qs}`}
              className="flex-1 flex flex-col items-center gap-1 py-2 text-[11px] transition-colors"
              style={{ color: active ? "#c084fc" : "#a855f7" }}
            >
              <div className="relative">
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center"
                  style={{
                    background: active
                      ? "rgba(168,85,247,0.25)"
                      : "rgba(168,85,247,0.12)",
                    border: "1px solid rgba(168,85,247,0.35)",
                  }}
                >
                  <Zap size={13} fill={active ? "#c084fc" : "#a855f7"} strokeWidth={0} />
                </div>
              </div>
              <span className="font-semibold tracking-wide" style={{ fontFamily: "var(--font-dm-mono)", letterSpacing: "0.05em" }}>
                {label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={href}
            href={`${href}${qs}`}
            className="flex-1 flex flex-col items-center gap-1 py-2 text-[11px] transition-colors"
            style={{ color: active ? "var(--green)" : "var(--muted)" }}
          >
            <Icon size={20} strokeWidth={1.8} />
            {label}
          </Link>
        );
      })}
    </>
  );
}

export function BottomNav() {
  return (
    <nav
      className="flex border-t pb-safe"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <Suspense fallback={null}>
        <BottomNavInner />
      </Suspense>
    </nav>
  );
}

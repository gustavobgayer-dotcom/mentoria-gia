"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { LayoutDashboard, Activity, ClipboardList, Settings } from "lucide-react";

const NAV_ITEMS = [
  { href: "/",             label: "Dashboard",   Icon: LayoutDashboard },
  { href: "/graficos",     label: "Gráficos",    Icon: Activity },
  { href: "/lancamentos",  label: "Lançamentos", Icon: ClipboardList },
  { href: "/config",       label: "Config",      Icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const qs = searchParams.toString() ? `?${searchParams.toString()}` : "";

  return (
    <nav
      className="flex border-t pb-safe"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      {NAV_ITEMS.map(({ href, label, Icon }) => {
        const active = pathname === href;
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
    </nav>
  );
}

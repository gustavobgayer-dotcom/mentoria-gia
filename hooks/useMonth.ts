"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

export function useMonth() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const now = new Date();
  const mes = Number(searchParams.get("mes") ?? now.getMonth());
  const ano = Number(searchParams.get("ano") ?? now.getFullYear());

  const setMonth = useCallback(
    (newMes: number, newAno: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("mes", String(newMes));
      params.set("ano", String(newAno));
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  return { mes, ano, setMonth };
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CLUSTER_DEFAULTS, type ClusterName } from "./clusters";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fmt(value: number): string {
  return "R$ " + Math.round(value).toLocaleString("pt-BR");
}

export function clrOf(name: string): string {
  return CLUSTER_DEFAULTS[name as ClusterName]?.color ?? "#888";
}

export function defaultClusterMetas(): Record<ClusterName, number> {
  return Object.fromEntries(
    Object.entries(CLUSTER_DEFAULTS).map(([k, v]) => [k, v.meta])
  ) as Record<ClusterName, number>;
}

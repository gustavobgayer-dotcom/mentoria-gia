export type ClusterName =
  | "Liberdade Financeira"
  | "Custo Fixo"
  | "Conforto"
  | "Metas"
  | "Prazeres"
  | "Conhecimento";

export interface ClusterConfig {
  meta: number;
  color: string;
}

export const CLUSTER_DEFAULTS: Record<ClusterName, ClusterConfig> = {
  "Liberdade Financeira": { meta: 0.25, color: "#00d4a0" },
  "Custo Fixo":           { meta: 0.30, color: "#4d8df7" },
  "Conforto":             { meta: 0.15, color: "#f5a623" },
  "Metas":                { meta: 0.15, color: "#a78bfa" },
  "Prazeres":             { meta: 0.10, color: "#f472b6" },
  "Conhecimento":         { meta: 0.05, color: "#34d399" },
};

export const CLUSTER_NAMES = Object.keys(CLUSTER_DEFAULTS) as ClusterName[];

export const PAYMENT_METHODS = [
  "Cartão de Crédito | XP",
  "Boleto",
  "Transferência",
  "Débito Automático",
  "Pix",
  "-",
];

export const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

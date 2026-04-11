import type { ClusterName } from "./clusters";

export interface TransactionTemplate {
  cluster: ClusterName;
  tipo: string;
  ident: string;
  valorAuto?: (renda: number) => number;
}

export const TRANSACTION_TEMPLATES: TransactionTemplate[] = [
  {
    cluster: "Liberdade Financeira",
    tipo: "Investimento Mensal",
    ident: "Investimento Mensal",
    valorAuto: (renda) => Math.round(renda * 0.25 * 100) / 100,
  },
  {
    cluster: "Custo Fixo",
    tipo: "Casa",
    ident: "Aluguel",
  },
  {
    cluster: "Custo Fixo",
    tipo: "Casa",
    ident: "Conta de Luz",
  },
  {
    cluster: "Custo Fixo",
    tipo: "Casa",
    ident: "Conta de Água",
  },
  {
    cluster: "Custo Fixo",
    tipo: "Casa",
    ident: "Conta de Internet",
  },
  {
    cluster: "Custo Fixo",
    tipo: "Telefone",
    ident: "Conta de Celular",
  },
  {
    cluster: "Custo Fixo",
    tipo: "Comida",
    ident: "Mercado",
  },
];

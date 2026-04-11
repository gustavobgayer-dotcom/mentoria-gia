import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ─── TABELAS EXISTENTES (novos campos opcionais adicionados) ───────

  lancamentos: defineTable({
    userId: v.string(),
    cluster: v.string(),
    tipo: v.string(),
    ident: v.string(),
    valor: v.number(),
    mes: v.number(),
    ano: v.number(),
    pagamento: v.optional(v.string()),
    // Novos campos
    nota: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    origem: v.optional(v.string()),          // "manual" | "open_finance"
    transacaoRawId: v.optional(v.id("transacoesRaw")),
  })
    .index("by_user_mes_ano", ["userId", "mes", "ano"])
    .index("by_user_and_cluster", ["userId", "cluster"]),

  config: defineTable({
    userId: v.string(),
    renda: v.number(),
    clusterMetas: v.record(v.string(), v.number()),
    // Novos campos
    tipoRenda: v.optional(v.string()),        // "fixa" | "variavel" | "mista"
    rendaFixa: v.optional(v.number()),
    diaRecebimentoFixo: v.optional(v.number()),
    diaRecebimentoVariavel: v.optional(v.number()),
    tema: v.optional(v.string()),
    moeda: v.optional(v.string()),
    preferencias: v.optional(v.any()),
  }).index("by_userId", ["userId"]),

  // ─── TABELAS NOVAS ─────────────────────────────────────────────────

  users: defineTable({
    userId: v.string(),
    nome: v.optional(v.string()),
    email: v.optional(v.string()),
    cargo: v.optional(v.string()),
    role: v.string(),                  // "user" | "admin"
    plano: v.optional(v.string()),     // "free" | "pro"
    cadastradoEm: v.number(),
  }).index("by_userId", ["userId"]),

  rendaHistorico: defineTable({
    userId: v.string(),
    valor: v.number(),
    mes: v.number(),
    ano: v.number(),
    registradoEm: v.number(),
  }).index("by_userId_and_mes_and_ano", ["userId", "mes", "ano"]),

  receitas: defineTable({
    userId: v.string(),
    valor: v.number(),
    origem: v.string(),
    mes: v.number(),
    ano: v.number(),
    nota: v.optional(v.string()),
  }).index("by_userId_and_mes_and_ano", ["userId", "mes", "ano"]),

  recorrentes: defineTable({
    userId: v.string(),
    cluster: v.string(),
    tipo: v.string(),
    ident: v.string(),
    valor: v.number(),
    diaDoMes: v.optional(v.number()),
    ativo: v.boolean(),
  }).index("by_userId", ["userId"]),

  alertas: defineTable({
    userId: v.string(),
    cluster: v.string(),
    limitePercentual: v.number(),
    ativo: v.boolean(),
    canal: v.optional(v.string()),
  }).index("by_userId", ["userId"]),

  featureEvents: defineTable({
    userId: v.string(),
    feature: v.string(),
    timestamp: v.number(),
    metadata: v.optional(v.any()),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_feature", ["userId", "feature"]),

  contasConectadas: defineTable({
    userId: v.string(),
    banco: v.string(),
    tipoConta: v.string(),             // "cartao" | "corrente" | "investimento"
    ativo: v.boolean(),
    ultimaSincronizacao: v.optional(v.number()),
    consentimentoExpiraEm: v.optional(v.number()),
  }).index("by_userId", ["userId"]),

  transacoesRaw: defineTable({
    userId: v.string(),
    contaConectadaId: v.id("contasConectadas"),
    descricaoOriginal: v.string(),
    valor: v.number(),
    data: v.number(),
    status: v.string(),               // "pendente" | "categorizado" | "ignorado"
    lancamentoId: v.optional(v.id("lancamentos")),
  })
    .index("by_userId_and_status", ["userId", "status"])
    .index("by_userId_and_data", ["userId", "data"]),

  regrasCategorizacao: defineTable({
    userId: v.optional(v.string()),
    palavraChave: v.string(),
    cluster: v.string(),
    tipo: v.string(),
    prioridade: v.number(),
    global: v.boolean(),
  })
    .index("by_userId", ["userId"])
    .index("by_global", ["global"]),

  benchmarks: defineTable({
    cargo: v.string(),
    cluster: v.string(),
    mediaPercentual: v.number(),
    totalUsuarios: v.number(),
    mes: v.number(),
    ano: v.number(),
    calculadoEm: v.number(),
  }).index("by_cargo_and_cluster_and_mes_and_ano", ["cargo", "cluster", "mes", "ano"]),
});

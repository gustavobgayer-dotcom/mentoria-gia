import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  lancamentos: defineTable({
    userId: v.string(),
    cluster: v.string(),
    tipo: v.string(),
    ident: v.string(),
    valor: v.number(),
    mes: v.number(),
    ano: v.number(),
    pagamento: v.optional(v.string()),
  }).index("by_user_mes_ano", ["userId", "mes", "ano"]),

  config: defineTable({
    userId: v.string(),
    renda: v.number(),
    clusterMetas: v.record(v.string(), v.number()),
  }).index("by_userId", ["userId"]),
});

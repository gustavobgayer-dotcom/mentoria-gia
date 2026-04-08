import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  lancamentos: defineTable({
    cluster: v.string(),
    tipo: v.string(),
    ident: v.string(),
    valor: v.number(),
    mes: v.number(),
    ano: v.number(),
    pagamento: v.optional(v.string()),
  }).index("by_mes_ano", ["mes", "ano"]),

  config: defineTable({
    renda: v.number(),
    clusterMetas: v.record(v.string(), v.number()),
  }),
});

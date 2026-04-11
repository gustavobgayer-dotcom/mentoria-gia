import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./_utils";

// Somente admin: lista benchmarks por cargo e cluster
export const list = query({
  args: {
    cargo: v.string(),
    mes: v.number(),
    ano: v.number(),
  },
  handler: async (ctx, { cargo, mes, ano }) => {
    await requireAdmin(ctx);
    return await ctx.db
      .query("benchmarks")
      .withIndex("by_cargo_and_cluster_and_mes_and_ano", (q) =>
        q.eq("cargo", cargo).eq("cluster", "").eq("mes", mes).eq("ano", ano)
      )
      .collect();
  },
});

// Somente admin: cria ou atualiza uma média
export const upsert = mutation({
  args: {
    cargo: v.string(),
    cluster: v.string(),
    mediaPercentual: v.number(),
    totalUsuarios: v.number(),
    mes: v.number(),
    ano: v.number(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const existing = await ctx.db
      .query("benchmarks")
      .withIndex("by_cargo_and_cluster_and_mes_and_ano", (q) =>
        q
          .eq("cargo", args.cargo)
          .eq("cluster", args.cluster)
          .eq("mes", args.mes)
          .eq("ano", args.ano)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        mediaPercentual: args.mediaPercentual,
        totalUsuarios: args.totalUsuarios,
        calculadoEm: Date.now(),
      });
    } else {
      await ctx.db.insert("benchmarks", { ...args, calculadoEm: Date.now() });
    }
  },
});

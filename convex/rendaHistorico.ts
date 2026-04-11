import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./_utils";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);
    return await ctx.db
      .query("rendaHistorico")
      .withIndex("by_userId_and_mes_and_ano", (q) => q.eq("userId", userId))
      .order("desc")
      .take(24);
  },
});

export const getByMonth = query({
  args: { mes: v.number(), ano: v.number() },
  handler: async (ctx, { mes, ano }) => {
    const userId = await requireAuth(ctx);
    return await ctx.db
      .query("rendaHistorico")
      .withIndex("by_userId_and_mes_and_ano", (q) =>
        q.eq("userId", userId).eq("mes", mes).eq("ano", ano)
      )
      .unique();
  },
});

export const add = mutation({
  args: {
    valor: v.number(),
    mes: v.number(),
    ano: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const existing = await ctx.db
      .query("rendaHistorico")
      .withIndex("by_userId_and_mes_and_ano", (q) =>
        q.eq("userId", userId).eq("mes", args.mes).eq("ano", args.ano)
      )
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { valor: args.valor, registradoEm: Date.now() });
    } else {
      await ctx.db.insert("rendaHistorico", { ...args, userId, registradoEm: Date.now() });
    }
  },
});

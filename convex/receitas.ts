import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./_utils";

export const list = query({
  args: { mes: v.number(), ano: v.number() },
  handler: async (ctx, { mes, ano }) => {
    const userId = await requireAuth(ctx);
    return await ctx.db
      .query("receitas")
      .withIndex("by_userId_and_mes_and_ano", (q) =>
        q.eq("userId", userId).eq("mes", mes).eq("ano", ano)
      )
      .collect();
  },
});

export const add = mutation({
  args: {
    valor: v.number(),
    origem: v.string(),
    mes: v.number(),
    ano: v.number(),
    nota: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    return await ctx.db.insert("receitas", { ...args, userId });
  },
});

export const remove = mutation({
  args: { id: v.id("receitas") },
  handler: async (ctx, { id }) => {
    const userId = await requireAuth(ctx);
    const doc = await ctx.db.get(id);
    if (!doc || doc.userId !== userId) throw new Error("Unauthorized");
    await ctx.db.delete(id);
  },
});

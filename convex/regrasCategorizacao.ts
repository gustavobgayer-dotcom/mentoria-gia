import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, requireAdmin } from "./_utils";

// Lista regras do usuário + regras globais do app
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);

    const globais = await ctx.db
      .query("regrasCategorizacao")
      .withIndex("by_global", (q) => q.eq("global", true))
      .collect();

    const doUsuario = await ctx.db
      .query("regrasCategorizacao")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    return [...globais, ...doUsuario].sort((a, b) => b.prioridade - a.prioridade);
  },
});

export const add = mutation({
  args: {
    palavraChave: v.string(),
    cluster: v.string(),
    tipo: v.string(),
    prioridade: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    return await ctx.db.insert("regrasCategorizacao", {
      ...args,
      userId,
      global: false,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("regrasCategorizacao") },
  handler: async (ctx, { id }) => {
    const userId = await requireAuth(ctx);
    const doc = await ctx.db.get(id);
    if (!doc || doc.userId !== userId) throw new Error("Unauthorized");
    if (doc.global) throw new Error("Não é possível remover regras globais");
    await ctx.db.delete(id);
  },
});

// Somente admin: adiciona regra global do app
export const addGlobal = mutation({
  args: {
    palavraChave: v.string(),
    cluster: v.string(),
    tipo: v.string(),
    prioridade: v.number(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.insert("regrasCategorizacao", {
      ...args,
      global: true,
    });
  },
});

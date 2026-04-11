import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./_utils";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);
    return await ctx.db
      .query("recorrentes")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const add = mutation({
  args: {
    cluster: v.string(),
    tipo: v.string(),
    ident: v.string(),
    valor: v.number(),
    diaDoMes: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    return await ctx.db.insert("recorrentes", { ...args, userId, ativo: true });
  },
});

export const update = mutation({
  args: {
    id: v.id("recorrentes"),
    cluster: v.string(),
    tipo: v.string(),
    ident: v.string(),
    valor: v.number(),
    diaDoMes: v.optional(v.number()),
  },
  handler: async (ctx, { id, ...fields }) => {
    const userId = await requireAuth(ctx);
    const doc = await ctx.db.get(id);
    if (!doc || doc.userId !== userId) throw new Error("Unauthorized");
    await ctx.db.patch(id, fields);
  },
});

export const toggle = mutation({
  args: { id: v.id("recorrentes") },
  handler: async (ctx, { id }) => {
    const userId = await requireAuth(ctx);
    const doc = await ctx.db.get(id);
    if (!doc || doc.userId !== userId) throw new Error("Unauthorized");
    await ctx.db.patch(id, { ativo: !doc.ativo });
  },
});

export const remove = mutation({
  args: { id: v.id("recorrentes") },
  handler: async (ctx, { id }) => {
    const userId = await requireAuth(ctx);
    const doc = await ctx.db.get(id);
    if (!doc || doc.userId !== userId) throw new Error("Unauthorized");
    await ctx.db.delete(id);
  },
});

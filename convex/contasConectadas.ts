import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./_utils";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);
    return await ctx.db
      .query("contasConectadas")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const add = mutation({
  args: {
    banco: v.string(),
    tipoConta: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    return await ctx.db.insert("contasConectadas", { ...args, userId, ativo: true });
  },
});

export const deactivate = mutation({
  args: { id: v.id("contasConectadas") },
  handler: async (ctx, { id }) => {
    const userId = await requireAuth(ctx);
    const doc = await ctx.db.get(id);
    if (!doc || doc.userId !== userId) throw new Error("Unauthorized");
    await ctx.db.patch(id, { ativo: false });
  },
});

export const updateSyncTime = mutation({
  args: { id: v.id("contasConectadas") },
  handler: async (ctx, { id }) => {
    const userId = await requireAuth(ctx);
    const doc = await ctx.db.get(id);
    if (!doc || doc.userId !== userId) throw new Error("Unauthorized");
    await ctx.db.patch(id, { ultimaSincronizacao: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id("contasConectadas") },
  handler: async (ctx, { id }) => {
    const userId = await requireAuth(ctx);
    const doc = await ctx.db.get(id);
    if (!doc || doc.userId !== userId) throw new Error("Unauthorized");
    await ctx.db.delete(id);
  },
});

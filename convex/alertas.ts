import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./_utils";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);
    return await ctx.db
      .query("alertas")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const add = mutation({
  args: {
    cluster: v.string(),
    limitePercentual: v.number(),
    canal: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    return await ctx.db.insert("alertas", { ...args, userId, ativo: true });
  },
});

export const update = mutation({
  args: {
    id: v.id("alertas"),
    cluster: v.string(),
    limitePercentual: v.number(),
    canal: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...fields }) => {
    const userId = await requireAuth(ctx);
    const doc = await ctx.db.get(id);
    if (!doc || doc.userId !== userId) throw new Error("Unauthorized");
    await ctx.db.patch(id, fields);
  },
});

export const toggle = mutation({
  args: { id: v.id("alertas") },
  handler: async (ctx, { id }) => {
    const userId = await requireAuth(ctx);
    const doc = await ctx.db.get(id);
    if (!doc || doc.userId !== userId) throw new Error("Unauthorized");
    await ctx.db.patch(id, { ativo: !doc.ativo });
  },
});

export const remove = mutation({
  args: { id: v.id("alertas") },
  handler: async (ctx, { id }) => {
    const userId = await requireAuth(ctx);
    const doc = await ctx.db.get(id);
    if (!doc || doc.userId !== userId) throw new Error("Unauthorized");
    await ctx.db.delete(id);
  },
});

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./_utils";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);
    return await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
  },
});

export const upsert = mutation({
  args: {
    nome: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const existing = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, args);
    } else {
      await ctx.db.insert("users", {
        userId,
        role: "user",
        plano: "free",
        cadastradoEm: Date.now(),
        ...args,
      });
    }
  },
});

export const updateProfile = mutation({
  args: {
    nome: v.optional(v.string()),
    email: v.optional(v.string()),
    cargo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (!user) throw new Error("Usuário não encontrado");
    await ctx.db.patch(user._id, args);
  },
});

export const updatePlano = mutation({
  args: { plano: v.string() },
  handler: async (ctx, { plano }) => {
    const userId = await requireAuth(ctx);
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (!user) throw new Error("Usuário não encontrado");
    await ctx.db.patch(user._id, { plano });
  },
});

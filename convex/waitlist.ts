import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./_utils";

// Entra na lista de espera (idempotente — não duplica)
export const add = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);
    const existing = await ctx.db
      .query("waitlist")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (existing) return; // já está na lista
    await ctx.db.insert("waitlist", { userId, registradoEm: Date.now() });
  },
});

// Conta total de pessoas na lista (limitado a 9999 para performance)
export const count = query({
  args: {},
  handler: async (ctx) => {
    const entries = await ctx.db.query("waitlist").take(9999);
    return entries.length;
  },
});

// Verifica se o usuário atual já está na lista
export const isOnList = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;
    const userId = identity.tokenIdentifier;
    const existing = await ctx.db
      .query("waitlist")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    return existing !== null;
  },
});

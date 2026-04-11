import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, requireAdmin } from "./_utils";

export const track = mutation({
  args: {
    feature: v.string(),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    await ctx.db.insert("featureEvents", {
      userId,
      feature: args.feature,
      timestamp: Date.now(),
      metadata: args.metadata,
    });
  },
});

// Somente admin: lista os eventos de um usuário específico
export const listByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    await requireAdmin(ctx);
    return await ctx.db
      .query("featureEvents")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .take(100);
  },
});

// Somente admin: lista eventos por funcionalidade
export const listByFeature = query({
  args: { userId: v.string(), feature: v.string() },
  handler: async (ctx, { userId, feature }) => {
    await requireAdmin(ctx);
    return await ctx.db
      .query("featureEvents")
      .withIndex("by_userId_and_feature", (q) =>
        q.eq("userId", userId).eq("feature", feature)
      )
      .order("desc")
      .take(100);
  },
});

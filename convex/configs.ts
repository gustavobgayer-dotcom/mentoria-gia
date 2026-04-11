import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./_utils";

const DEFAULT_CONFIG = {
  renda: 13340,
  clusterMetas: {
    "Liberdade Financeira": 0.25,
    "Custo Fixo": 0.30,
    "Conforto": 0.15,
    "Metas": 0.15,
    "Prazeres": 0.10,
    "Conhecimento": 0.05,
  },
};

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);
    const config = await ctx.db
      .query("config")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    return config ?? null;
  },
});

export const updateRenda = mutation({
  args: { renda: v.number() },
  handler: async (ctx, { renda }) => {
    const userId = await requireAuth(ctx);
    const config = await ctx.db
      .query("config")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (config) {
      await ctx.db.patch(config._id, { renda });
    } else {
      await ctx.db.insert("config", { ...DEFAULT_CONFIG, renda, userId });
    }
  },
});

export const updateClusterMetas = mutation({
  args: { clusterMetas: v.record(v.string(), v.number()) },
  handler: async (ctx, { clusterMetas }) => {
    const userId = await requireAuth(ctx);
    const config = await ctx.db
      .query("config")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (config) {
      await ctx.db.patch(config._id, { clusterMetas });
    } else {
      await ctx.db.insert("config", { ...DEFAULT_CONFIG, clusterMetas, userId });
    }
  },
});

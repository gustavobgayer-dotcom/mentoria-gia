import { QueryCtx, MutationCtx } from "./_generated/server";

export async function requireAuth(ctx: QueryCtx | MutationCtx): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthenticated");
  return identity.tokenIdentifier;
}

export async function requireAdmin(ctx: QueryCtx | MutationCtx): Promise<string> {
  const userId = await requireAuth(ctx);
  const user = await ctx.db
    .query("users")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .unique();
  if (!user || user.role !== "admin") throw new Error("Unauthorized: acesso restrito a administradores");
  return userId;
}

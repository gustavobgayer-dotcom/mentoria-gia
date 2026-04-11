import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./_utils";

export const listPendentes = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);
    return await ctx.db
      .query("transacoesRaw")
      .withIndex("by_userId_and_status", (q) =>
        q.eq("userId", userId).eq("status", "pendente")
      )
      .order("desc")
      .take(50);
  },
});

export const add = mutation({
  args: {
    contaConectadaId: v.id("contasConectadas"),
    descricaoOriginal: v.string(),
    valor: v.number(),
    data: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    return await ctx.db.insert("transacoesRaw", {
      ...args,
      userId,
      status: "pendente",
    });
  },
});

export const categorizar = mutation({
  args: {
    id: v.id("transacoesRaw"),
    cluster: v.string(),
    tipo: v.string(),
    ident: v.string(),
  },
  handler: async (ctx, { id, cluster, tipo, ident }) => {
    const userId = await requireAuth(ctx);
    const transacao = await ctx.db.get(id);
    if (!transacao || transacao.userId !== userId) throw new Error("Unauthorized");

    const lancamentoId = await ctx.db.insert("lancamentos", {
      userId,
      cluster,
      tipo,
      ident,
      valor: transacao.valor,
      mes: new Date(transacao.data).getMonth() + 1,
      ano: new Date(transacao.data).getFullYear(),
      origem: "open_finance",
      transacaoRawId: id,
    });

    await ctx.db.patch(id, { status: "categorizado", lancamentoId });
    return lancamentoId;
  },
});

export const ignorar = mutation({
  args: { id: v.id("transacoesRaw") },
  handler: async (ctx, { id }) => {
    const userId = await requireAuth(ctx);
    const doc = await ctx.db.get(id);
    if (!doc || doc.userId !== userId) throw new Error("Unauthorized");
    await ctx.db.patch(id, { status: "ignorado" });
  },
});

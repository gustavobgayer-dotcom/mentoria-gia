import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./_utils";

export const list = query({
  args: { mes: v.number(), ano: v.number() },
  handler: async (ctx, { mes, ano }) => {
    const userId = await requireAuth(ctx);
    return await ctx.db
      .query("lancamentos")
      .withIndex("by_user_mes_ano", (q) =>
        q.eq("userId", userId).eq("mes", mes).eq("ano", ano)
      )
      .collect();
  },
});

export const add = mutation({
  args: {
    cluster: v.string(),
    tipo: v.string(),
    ident: v.string(),
    valor: v.number(),
    mes: v.number(),
    ano: v.number(),
    pagamento: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    return await ctx.db.insert("lancamentos", { ...args, userId });
  },
});

export const update = mutation({
  args: {
    id: v.id("lancamentos"),
    cluster: v.string(),
    tipo: v.string(),
    ident: v.string(),
    valor: v.number(),
    pagamento: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...fields }) => {
    const userId = await requireAuth(ctx);
    const doc = await ctx.db.get(id);
    if (!doc || doc.userId !== userId) throw new Error("Unauthorized");
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("lancamentos") },
  handler: async (ctx, { id }) => {
    const userId = await requireAuth(ctx);
    const doc = await ctx.db.get(id);
    if (!doc || doc.userId !== userId) throw new Error("Unauthorized");
    await ctx.db.delete(id);
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);
    const existing = await ctx.db
      .query("lancamentos")
      .withIndex("by_user_mes_ano", (q) => q.eq("userId", userId))
      .first();
    if (existing) return;

    const data = [
      { cluster: "Liberdade Financeira", tipo: "Futuro",        ident: "Investimento",        valor: 3335,   mes: 3, ano: 2025 },
      { cluster: "Custo Fixo",           tipo: "Comida",        ident: "Mercado",              valor: 1500,   mes: 3, ano: 2025 },
      { cluster: "Custo Fixo",           tipo: "Casa",          ident: "Aluguel",              valor: 1000,   mes: 3, ano: 2025 },
      { cluster: "Custo Fixo",           tipo: "CNPJ",          ident: "Alíquota NF",          valor: 800.40, mes: 3, ano: 2025 },
      { cluster: "Custo Fixo",           tipo: "Saúde",         ident: "Plano de Saúde",       valor: 500,    mes: 3, ano: 2025 },
      { cluster: "Custo Fixo",           tipo: "Contabilidade", ident: "Obvia - Mensalidade",  valor: 279.80, mes: 3, ano: 2025 },
      { cluster: "Conforto",             tipo: "Futuro",        ident: "Vidigal",              valor: 250,    mes: 3, ano: 2025 },
      { cluster: "Custo Fixo",           tipo: "CNPJ",          ident: "INSS",                 valor: 166.98, mes: 3, ano: 2025 },
      { cluster: "Custo Fixo",           tipo: "Casa",          ident: "Lavar Roupa",          valor: 130,    mes: 3, ano: 2025 },
      { cluster: "Conhecimento",         tipo: "Assinatura",    ident: "GLA",                  valor: 125,    mes: 3, ano: 2025 },
      { cluster: "Conforto",             tipo: "Assinatura",    ident: "ChatGPT",              valor: 120,    mes: 3, ano: 2025 },
      { cluster: "Custo Fixo",           tipo: "Casa",          ident: "Internet",             valor: 100,    mes: 3, ano: 2025 },
      { cluster: "Custo Fixo",           tipo: "Casa",          ident: "Luz",                  valor: 100,    mes: 3, ano: 2025 },
      { cluster: "Custo Fixo",           tipo: "Barbearia",     ident: "Cortar Cabelo",        valor: 100,    mes: 3, ano: 2025 },
      { cluster: "Conhecimento",         tipo: "Assinatura",    ident: "Sobral",               valor: 45,     mes: 3, ano: 2025 },
      { cluster: "Conhecimento",         tipo: "Assinatura",    ident: "AUVP",                 valor: 250,    mes: 3, ano: 2025 },
      { cluster: "Custo Fixo",           tipo: "Telefone",      ident: "Fluke",                valor: 37,     mes: 3, ano: 2025 },
      { cluster: "Custo Fixo",           tipo: "Telefone",      ident: "Fluke 2 (Mãe)",        valor: 37,     mes: 3, ano: 2025 },
      { cluster: "Conforto",             tipo: "Assinatura",    ident: "Crunchyroll",          valor: 20,     mes: 3, ano: 2025 },
      { cluster: "Conforto",             tipo: "Assinatura",    ident: "Spotify",              valor: 12.90,  mes: 3, ano: 2025 },
      { cluster: "Conforto",             tipo: "Saúde",         ident: "Academia",             valor: 129.90, mes: 3, ano: 2025 },
      { cluster: "Metas",                tipo: "Presente",      ident: "Mãe",                  valor: 41.67,  mes: 3, ano: 2025 },
      { cluster: "Metas",                tipo: "Presente",      ident: "Pai",                  valor: 41.67,  mes: 3, ano: 2025 },
      { cluster: "Metas",                tipo: "Presente",      ident: "Namorada",             valor: 41.67,  mes: 3, ano: 2025 },
      { cluster: "Metas",                tipo: "Computador",    ident: "Peças",                valor: 500,    mes: 3, ano: 2025 },
      { cluster: "Metas",                tipo: "Viagem",        ident: "Planejamento",         valor: 500,    mes: 3, ano: 2025 },
      { cluster: "Prazeres",             tipo: "Trabalho",      ident: "Happy Hour",           valor: 150,    mes: 3, ano: 2025 },
      { cluster: "Prazeres",             tipo: "Comida",        ident: "Lanches",              valor: 200,    mes: 3, ano: 2025 },
      { cluster: "Prazeres",             tipo: "Computador",    ident: "Jogo",                 valor: 100,    mes: 3, ano: 2025 },
      { cluster: "Conforto",             tipo: "Transporte",    ident: "Uber",                 valor: 200,    mes: 3, ano: 2025 },
      { cluster: "Metas",                tipo: "Trabalho",      ident: "Almoço",               valor: 200,    mes: 3, ano: 2025 },
      { cluster: "Conforto",             tipo: "Transporte",    ident: "Viagem p Floripa",     valor: 300,    mes: 3, ano: 2025 },
      { cluster: "Prazeres",             tipo: "Ano novo",      ident: "?",                    valor: 300,    mes: 3, ano: 2025 },
      { cluster: "Prazeres",             tipo: "Carnaval",      ident: "?",                    valor: 300,    mes: 3, ano: 2025 },
      { cluster: "Conforto",             tipo: "Saúde",         ident: "Suplemento",           valor: 100,    mes: 3, ano: 2025 },
      { cluster: "Conforto",             tipo: "Saúde",         ident: "Nutricionista",        valor: 100,    mes: 3, ano: 2025 },
    ];

    for (const item of data) {
      await ctx.db.insert("lancamentos", { ...item, userId });
    }
  },
});

/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as _utils from "../_utils.js";
import type * as alertas from "../alertas.js";
import type * as benchmarks from "../benchmarks.js";
import type * as configs from "../configs.js";
import type * as contasConectadas from "../contasConectadas.js";
import type * as featureEvents from "../featureEvents.js";
import type * as lancamentos from "../lancamentos.js";
import type * as receitas from "../receitas.js";
import type * as recorrentes from "../recorrentes.js";
import type * as regrasCategorizacao from "../regrasCategorizacao.js";
import type * as rendaHistorico from "../rendaHistorico.js";
import type * as transacoesRaw from "../transacoesRaw.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  _utils: typeof _utils;
  alertas: typeof alertas;
  benchmarks: typeof benchmarks;
  configs: typeof configs;
  contasConectadas: typeof contasConectadas;
  featureEvents: typeof featureEvents;
  lancamentos: typeof lancamentos;
  receitas: typeof receitas;
  recorrentes: typeof recorrentes;
  regrasCategorizacao: typeof regrasCategorizacao;
  rendaHistorico: typeof rendaHistorico;
  transacoesRaw: typeof transacoesRaw;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};

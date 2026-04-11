# Schema — sardinha-finance

Desenhado em 11/04/2026. Aprovado pelo usuário antes da implementação.

---

## Diagrama de relacionamentos

```
users ──────────────────────────────────────────┐
  │                                              │
  ├── config                                     │
  ├── rendaHistorico                             │
  ├── receitas                                   │ role: "admin"
  ├── lancamentos ←── transacoesRaw              │
  ├── recorrentes      └── contasConectadas      │
  ├── alertas                                    │
  ├── featureEvents ─────────────────────────────┤
  └── regrasCategorização        benchmarks ─────┘
```

---

## Legenda

- `(existe)` → tabela já existe, recebe novos campos
- `(novo)` → tabela será criada do zero
- `opcional` → campo pode ficar vazio
- `referência` → aponta para um documento de outra tabela

---

## 1. `users` (novo)

Perfil completo do usuário.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `userId` | texto | sim | ID do login (chave de busca) |
| `nome` | texto | opcional | Nome do usuário |
| `email` | texto | opcional | Email |
| `cargo` | texto | opcional | Ex: "CLT", "PJ", "Autônomo", "Empresário" |
| `role` | texto | sim | `"user"` ou `"admin"` |
| `plano` | texto | opcional | `"free"` ou `"pro"` |
| `cadastradoEm` | data | sim | Quando criou a conta |

**Índices:** `by_userId`

---

## 2. `config` (existe — recebe novos campos)

Configurações financeiras e personalização.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `userId` | texto | sim | Dono |
| `renda` | número | sim | Renda de referência (já existe) |
| `clusterMetas` | registro | sim | Metas por cluster (já existe) |
| `tipoRenda` | texto | opcional | `"fixa"`, `"variavel"` ou `"mista"` |
| `rendaFixa` | número | opcional | Parte fixa (para tipo `"mista"`) |
| `diaRecebimentoFixo` | número | opcional | Ex: `5` — dia do salário fixo |
| `diaRecebimentoVariavel` | número | opcional | Ex: `20` — dia que costuma receber variável |
| `tema` | texto | opcional | `"light"` ou `"dark"` |
| `moeda` | texto | opcional | `"BRL"`, `"USD"`... |
| `preferencias` | objeto livre | opcional | Campo coringa para futuro |

**Índices:** `by_userId`

---

## 3. `rendaHistorico` (novo)

Histórico do valor da renda mês a mês.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `userId` | texto | sim | Dono |
| `valor` | número | sim | Renda total do mês |
| `mes` | número | sim | Mês |
| `ano` | número | sim | Ano |
| `registradoEm` | data | sim | Quando foi salvo |

**Índices:** `by_user_mes_ano`

---

## 4. `receitas` (novo)

Entradas de dinheiro reais (além da renda fixa).

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `userId` | texto | sim | Dono |
| `valor` | número | sim | Valor recebido |
| `origem` | texto | sim | Ex: "Salário", "Freela", "Dividendos" |
| `mes` | número | sim | Mês |
| `ano` | número | sim | Ano |
| `nota` | texto | opcional | Observação livre |

**Índices:** `by_user_mes_ano`

---

## 5. `lancamentos` (existe — recebe novos campos)

Despesas. Mantém tudo que existe, ganha 4 campos novos.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `userId` | texto | sim | Dono (já existe) |
| `cluster` | texto | sim | Ex: "Custo Fixo" (já existe) |
| `tipo` | texto | sim | Ex: "Comida" (já existe) |
| `ident` | texto | sim | Ex: "Mercado" (já existe) |
| `valor` | número | sim | Valor (já existe) |
| `mes` | número | sim | Mês (já existe) |
| `ano` | número | sim | Ano (já existe) |
| `pagamento` | texto | opcional | Já existe |
| `nota` | texto | opcional | Observação livre |
| `tags` | lista de texto | opcional | Ex: `["recorrente", "anual"]` |
| `origem` | texto | opcional | `"manual"` ou `"open_finance"` |
| `transacaoRawId` | referência | opcional | Aponta para `transacoesRaw` |

**Índices:** `by_user_mes_ano`, `by_user_cluster`

---

## 6. `recorrentes` (novo)

Templates de gastos que se repetem todo mês.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `userId` | texto | sim | Dono |
| `cluster` | texto | sim | Ex: "Custo Fixo" |
| `tipo` | texto | sim | Ex: "Casa" |
| `ident` | texto | sim | Ex: "Aluguel" |
| `valor` | número | sim | Valor esperado |
| `diaDoMes` | número | opcional | Dia que costuma vencer |
| `ativo` | booleano | sim | Se ainda está valendo |

**Índices:** `by_userId`

---

## 7. `alertas` (novo)

Limites de gasto por cluster com notificação.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `userId` | texto | sim | Dono |
| `cluster` | texto | sim | Qual cluster monitorar |
| `limitePercentual` | número | sim | Ex: `0.80` = avisar em 80% do orçamento |
| `ativo` | booleano | sim | Se o alerta está ligado |
| `canal` | texto | opcional | `"banner"`, `"email"`, `"push"` |

**Índices:** `by_userId`

---

## 8. `featureEvents` (novo)

Registro de quais funcionalidades cada usuário usa.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `userId` | texto | sim | Quem fez a ação |
| `feature` | texto | sim | Ex: `"add_lancamento"`, `"view_dashboard"` |
| `timestamp` | data | sim | Quando aconteceu |
| `metadata` | objeto livre | opcional | Detalhes extras da ação |

**Índices:** `by_userId`, `by_user_feature`

---

## 9. `contasConectadas` (novo)

Conexões com bancos via Open Finance.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `userId` | texto | sim | Dono |
| `banco` | texto | sim | Ex: "Nubank", "Itaú" |
| `tipoConta` | texto | sim | `"cartao"`, `"corrente"`, `"investimento"` |
| `ativo` | booleano | sim | Se a conexão está válida |
| `ultimaSincronizacao` | data | opcional | Quando foi a última busca |
| `consentimentoExpiraEm` | data | opcional | Open Finance exige renovar autorização |

**Índices:** `by_userId`

---

## 10. `transacoesRaw` (novo)

Dados brutos vindos do banco — antes de categorizar.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `userId` | texto | sim | Dono |
| `contaConectadaId` | referência | sim | Aponta para `contasConectadas` |
| `descricaoOriginal` | texto | sim | Texto cru do banco, ex: "UBER *TRIP" |
| `valor` | número | sim | Valor da transação |
| `data` | data | sim | Data original da transação |
| `status` | texto | sim | `"pendente"`, `"categorizado"`, `"ignorado"` |
| `lancamentoId` | referência | opcional | Aponta para `lancamentos` após categorizar |

**Índices:** `by_user_status`, `by_user_data`

---

## 11. `regrasCategorização` (novo)

Como o app transforma descrições do banco em clusters.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `userId` | texto | opcional | Vazio = regra global do app |
| `palavraChave` | texto | sim | Ex: "McDonald", "UBER", "NETFLIX" |
| `cluster` | texto | sim | Para onde vai |
| `tipo` | texto | sim | Qual tipo |
| `prioridade` | número | sim | Regra do usuário tem prioridade sobre global |
| `global` | booleano | sim | `true` = regra padrão do app |

**Índices:** `by_userId`, `by_global`

---

## 12. `benchmarks` (novo — somente admin)

Médias anônimas agregadas por cargo. Nenhum dado individual aqui.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `cargo` | texto | sim | Grupo analisado, ex: "PJ" |
| `cluster` | texto | sim | Ex: "Custo Fixo" |
| `mediaPercentual` | número | sim | Média do grupo, ex: `0.28` |
| `totalUsuarios` | número | sim | Quantos usuários formam essa média |
| `mes` | número | sim | Mês do cálculo |
| `ano` | número | sim | Ano do cálculo |
| `calculadoEm` | data | sim | Quando foi gerado |

**Índices:** `by_cargo_cluster_mes_ano`

---

## Controle de acesso

| Tabela | Usuário comum | Admin |
|---|---|---|
| `users` | Próprio registro | Todos |
| `config` | Próprio | Todos |
| `rendaHistorico` | Próprio | Todos |
| `receitas` | Próprio | Todos |
| `lancamentos` | Próprio | Todos |
| `recorrentes` | Próprio | Todos |
| `alertas` | Próprio | Todos |
| `featureEvents` | Não acessa | Todos |
| `contasConectadas` | Próprio | Todos |
| `transacoesRaw` | Próprio | Todos |
| `regrasCategorização` | Próprias + globais | Todos + cria globais |
| `benchmarks` | Não acessa | Somente admin |

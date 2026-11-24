# Backend Forja

## Requisitos

- Node.js 24 ou compatível
- NPM

## Configuração

1. Copie `.env.example` para `.env`.
2. Defina um `JWT_SECRET` longo e aleatório em produção.
3. Instale as dependências e gere o cliente Prisma:

```powershell
npm install
npm run prisma:generate
npm run prisma:migrate
```

4. Configure `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_CPF` e `ADMIN_PASSWORD` no `.env`.
   A senha do administrador precisa ter pelo menos 12 caracteres. Crie a conta inicial:

```powershell
npm run prisma:seed:admin
```

O cadastro público cria somente contas `FUNCIONARIO`; não permite conceder acesso administrativo.
Para inserir o catálogo demonstrativo (opcional e seguro para executar novamente):

```powershell
npm run prisma:seed:games
```

## Executar

```powershell
npm run dev
```

O servidor inicia em `http://127.0.0.1:3333` por padrão.

## Validar

```powershell
npm run build
npm test
```

## Contrato da API

Todas as rotas abaixo são relativas à origem do backend (por padrão `http://127.0.0.1:3333`).
Rotas protegidas exigem `Authorization: Bearer <token>`. Login e cadastro retornam o JWT como
JSON string, válido por 1 dia. O frontend deve enviar JSON com `Content-Type: application/json`.

| Método | Rota | Acesso | Resposta principal |
|---|---|---|---|
| `GET` | `/` | Público | Status do serviço |
| `POST` | `/cadastro` | Público | Cria `FUNCIONARIO` e retorna JWT |
| `POST` | `/login` | Público | Retorna JWT |
| `POST` | `/logout` | Público | Mensagem; o cliente deve apagar seu cookie |
| `GET` | `/me` | Autenticado | Dados do usuário atual, sem senha |
| `GET` | `/funcionarios` | Administrador | Lista funcionários, sem senhas |
| `GET` | `/funcionarios/:id` | Próprio usuário ou administrador | Dados do funcionário |
| `PUT` | `/funcionarios/:id` | Próprio usuário ou administrador | Atualiza perfil; cargo só por administrador |
| `DELETE` | `/funcionarios/:id` | Administrador | Exclui funcionário |
| `GET` | `/jogos` | Público | Lista ordenada de jogos |
| `GET` | `/jogos/:id` | Público | Jogo por ID |
| `POST` | `/jogos` | Administrador | Cria jogo |
| `PUT` | `/jogos/:id` | Administrador | Atualiza jogo |
| `DELETE` | `/jogos/:id` | Administrador | Exclui jogo |
| `GET` | `/desejos` | Autenticado | Lista `{ jogoId, createdAt, jogo }` do usuário |
| `POST` | `/desejos/:jogoId` | Autenticado | Adiciona jogo aos desejos |
| `DELETE` | `/desejos/:jogoId` | Autenticado | Remove jogo dos desejos |
| `GET` | `/biblioteca` | Autenticado | Lista jogos e progresso do usuário |
| `POST` | `/biblioteca/:jogoId` | Autenticado | Adiciona jogo à biblioteca |
| `PUT` | `/biblioteca/:jogoId` | Autenticado | Atualiza `horasJogadas`, `status` ou `conquistas` |
| `DELETE` | `/biblioteca/:jogoId` | Autenticado | Remove jogo da biblioteca |

O objeto de jogo usa `titulo`, `descricao`, `genero`, `plataforma`, `imagemUrl`,
`anoLancamento` e `preco`. Estados válidos da biblioteca: `NAO_INICIADO`, `EM_ANDAMENTO`
e `CONCLUIDO`. Exclusão não encontrada retorna `404`; campos inválidos retornam `400`;
duplicidade retorna `409`.

Pedidos, pagamentos, promoções, lançamentos e configurações ainda não fazem parte do modelo
nem da API; essas telas precisam de requisitos e entidades próprios antes de integração.

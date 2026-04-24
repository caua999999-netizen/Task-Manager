# Task Manager — Backend

API REST em Node.js + TypeScript + Express + PostgreSQL (Prisma).

## Stack

- Node.js + TypeScript
- Express
- PostgreSQL 16 (Docker)
- Prisma ORM
- JWT + bcrypt
- Zod

## Scripts

\`\`\`bash
npm run dev      # Inicia em modo dev com hot reload
npm run build    # Compila TypeScript para JavaScript
npm run start    # Roda a versão compilada
\`\`\`

## Estrutura

- `src/config/` — instância do Prisma Client
- `src/controllers/` — lógica dos endpoints
- `src/middlewares/` — autenticação JWT
- `src/routes/` — definição das rotas
- `src/schemas/` — validações com Zod
- `src/server.ts` — entrada da aplicação

## Banco de dados

Três modelos principais com relações:

- **User** (id, name, email, password, createdAt, updatedAt)
- **Project** (id, name, description, ownerId → User, createdAt, updatedAt)
- **Task** (id, title, description, status, priority, projectId → Project, creatorId → User)

Relações com `onDelete: Cascade` — deletar um projeto deleta todas suas tarefas automaticamente.

## Variáveis de ambiente

Crie um `.env` na raiz do backend com:

\`\`\`
DATABASE_URL="postgresql://taskuser:taskpass@localhost:5432/taskmanager?schema=public"
JWT_SECRET="uma_string_secreta_longa_aqui"
\`\`\`
# Task Manager — Frontend

Aplicação React + TypeScript que consome a API do Task Manager.

## Stack

- React 19 + TypeScript
- Vite
- React Router DOM
- Tailwind CSS
- Axios
- React Hook Form + Zod

## Scripts

\`\`\`bash
npm run dev      # Inicia em modo dev
npm run build    # Compila para produção
npm run preview  # Preview da build de produção
\`\`\`

## Estrutura

- `src/components/` — Button, Input, Select, Modal, TaskCard, ProjectModal, TaskModal, ConfirmDialog
- `src/contexts/` — AuthContext (estado global de autenticação)
- `src/hooks/` — useProjects, useTasks (encapsulam estado + chamadas API)
- `src/pages/` — Login, Register, Dashboard, ProjectDetails
- `src/schemas/` — validações Zod dos formulários
- `src/services/` — camada de API (api.ts, projects.ts, tasks.ts)
- `src/types/` — tipos TypeScript compartilhados

## Features

- Autenticação persistente (localStorage)
- Interceptor automático de token em todas requisições
- Redirect para /login em caso de token expirado
- Rotas públicas e protegidas
- Validação client-side + server-side
- UI responsiva (grid adaptável)
- Feedback visual de loading e erros

## Configuração da API

Por padrão, a aplicação aponta para `http://localhost:3333` (configurado em `src/services/api.ts`).
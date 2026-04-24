# Task Manager

Sistema fullstack de gerenciamento de projetos e tarefas, desenvolvido como projeto de portfólio para demonstrar habilidades em desenvolvimento web moderno.

## 🎯 Sobre o projeto

O Task Manager é uma aplicação completa que permite aos usuários:

- Cadastrar-se e fazer login com autenticação segura (JWT)
- Criar, editar e deletar projetos pessoais
- Gerenciar tarefas dentro de cada projeto
- Classificar tarefas por status (a fazer, em andamento, concluída) e prioridade (baixa, média, alta)
- Filtrar tarefas e visualizar estatísticas em tempo real
- Cada usuário acessa apenas seus próprios dados (autorização)

## 🛠️ Stack

### Backend
- **Node.js** + **TypeScript**
- **Express** — framework HTTP
- **PostgreSQL** — banco de dados relacional
- **Prisma** — ORM
- **Docker** — containerização do banco
- **JWT** (jsonwebtoken) — autenticação
- **bcrypt** — hash de senhas
- **Zod** — validação de dados

### Frontend
- **React** + **TypeScript**
- **Vite** — build tool
- **React Router** — navegação SPA
- **Tailwind CSS** — estilização
- **Axios** — cliente HTTP
- **React Hook Form** + **Zod** — formulários tipados e validados
- **Context API** — gerenciamento de estado global

## 🏗️ Arquitetura

Monorepo com dois projetos independentes:

\`\`\`
task-manager/
├── backend/          API REST
│   ├── src/
│   │   ├── config/       Configuração do Prisma
│   │   ├── controllers/  Lógica das rotas
│   │   ├── middlewares/  Middleware JWT
│   │   ├── routes/       Definição de rotas
│   │   ├── schemas/      Validações com Zod
│   │   └── server.ts
│   └── prisma/           Schema e migrations
└── frontend/         Aplicação React
    └── src/
        ├── components/   Componentes reutilizáveis
        ├── contexts/     AuthContext
        ├── hooks/        Custom hooks
        ├── pages/        Telas da aplicação
        ├── schemas/      Validações de formulários
        ├── services/     Camada de API
        └── types/        Tipos TypeScript
\`\`\`

## 🔐 Segurança

- Senhas nunca são armazenadas em texto puro (hash com bcrypt)
- Autenticação via JWT com expiração de 7 dias
- Todas as rotas de dados são protegidas por middleware
- Autorização por dono — usuários só acessam seus próprios recursos
- Validação de entrada em todas as rotas (Zod)

## 🚀 Como rodar localmente

### Pré-requisitos
- Node.js 20+
- Docker Desktop
- Git

### Backend

\`\`\`bash
cd backend

# Instalar dependências
npm install

# Criar arquivo .env baseado no .env.example
# DATABASE_URL="postgresql://taskuser:taskpass@localhost:5432/taskmanager?schema=public"
# JWT_SECRET="sua_string_secreta"

# Subir o PostgreSQL via Docker
docker-compose up -d

# Rodar migrations
npx prisma migrate dev

# Iniciar servidor
npm run dev
\`\`\`

Backend roda em `http://localhost:3333`

### Frontend

\`\`\`bash
cd frontend

# Instalar dependências
npm install

# Iniciar aplicação
npm run dev
\`\`\`

Frontend roda em `http://localhost:5173`

## 📡 Endpoints da API

### Autenticação

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /auth/register | Cadastra novo usuário |
| POST | /auth/login | Autentica e retorna JWT |
| GET | /me | Retorna dados do usuário logado |

### Projetos (protegidas)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /projects | Lista projetos do usuário |
| POST | /projects | Cria novo projeto |
| GET | /projects/:id | Detalhes de um projeto |
| PUT | /projects/:id | Atualiza projeto |
| DELETE | /projects/:id | Deleta projeto |

### Tarefas (protegidas)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /tasks | Lista tarefas (aceita filtros) |
| POST | /tasks | Cria nova tarefa |
| GET | /tasks/:id | Detalhes de uma tarefa |
| PUT | /tasks/:id | Atualiza tarefa |
| DELETE | /tasks/:id | Deleta tarefa |

**Filtros disponíveis em `/tasks`:** `?projectId=X&status=todo&priority=high`

## 💡 Decisões técnicas

- **Prisma 6**: escolhi a versão estável em vez da 7 (recém-lançada) por ter melhor documentação e ampla adoção no mercado
- **Atualização otimista da UI**: após criar/editar/deletar, a lista é atualizada localmente em vez de refazer requisições, oferecendo resposta instantânea
- **Custom hooks (`useProjects`, `useTasks`)**: encapsulam toda a lógica de estado e chamadas à API, mantendo os componentes limpos
- **Service layer no frontend**: centraliza chamadas à API em arquivos dedicados, facilitando manutenção
- **Monorepo**: backend e frontend no mesmo repositório para facilitar desenvolvimento coordenado

## 👤 Autor

**Cauã Farias Camargo**

- GitHub: [@caua999999-netizen](https://github.com/caua999999-netizen)
- Estudante de Engenharia da Computação
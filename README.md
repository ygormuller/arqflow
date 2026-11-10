# ArqFlow MVP — versão portátil

Esta é uma cópia enxuta e independente do protótipo homologado do ArqFlow. Ela contém somente o frontend demonstrativo, com dados fictícios em memória.

## O que foi removido

A cópia não depende de Manus, OAuth Manus, tRPC, Express, Drizzle, banco de dados, storage, APIs proprietárias, logs de sessão, `manus-routes.json`, arquivos de configuração de plataforma ou diretórios de infraestrutura do projeto original.

## Requisitos

- Node.js 20 ou superior
- npm 10 ou pnpm 9+

## Execução

```bash
npm install
npm run dev
```

A aplicação ficará disponível em `http://localhost:3000`.

Para validar o build de produção:

```bash
npm run check
npm run build
npm run preview
```

O manifesto de rotas neutro está em `public/routes.json`. Ele é apenas um inventário simples da rota do protótipo e não depende de nenhum runtime específico.

## Escopo atual

O protótipo demonstra visão geral do projeto, entregas e versões, pendências, compras, portal do cliente, aprovação, solicitação de alteração e criação simulada de projeto. Os dados são locais e são reiniciados quando a página é recarregada.

Para a próxima fase produtiva, será necessário adicionar backend, autenticação, persistência, armazenamento de arquivos, permissões, notificações e auditoria.

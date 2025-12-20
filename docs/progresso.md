# Progresso Whaticket SaaS (Dev Local)

## Ambiente e Acesso
- Backend: `http://localhost:3001`
- Frontend: `http://localhost:3250`
- Banco: Postgres (`5433` host → `5432` contêiner)
- Redis: `6379`

## Ajustes de Infra
- `docker-compose.yaml`
  - Adicionados serviços `postgres` e `redis` com volumes
  - Portas publicadas: `whaticket_backend` `3001:3000`, `whaticket_frontend` `3250:3250`
- `.env`
  - `BACKEND_URL=http://localhost:3001`
  - `REACT_APP_BACKEND_URL=http://localhost:3001`
  - Credenciais Postgres/Redis para desenvolvimento

## Provisionamento do Banco
- Migrações: `docker compose run --rm whaticket_backend npm run db:migrate`
- Seeds (usuário admin): `docker compose run --rm whaticket_backend npm run db:seed`

## Correções Frontend
- Seletor de idioma simplificado e sem ícone
  - `frontend/src/components/UserLanguageSelector/index.js:39–55` — exibe `Idioma: BR/EN/ES`
  - Removido Turco; opções: PT‑BR, EN, ES
- Detecção e troca de idioma
  - `frontend/src/translate/i18n.js:6–18` — persistência em `localStorage` e fallback
  - `frontend/src/App.js:97–104` — tratamento robusto de `i18nextLng` (fix da tela branca)
- Servidor estático sem cache
  - `frontend/server.js:7–15` — cabeçalhos no‑cache
  - `frontend/server.js:20–22` — endpoint `GET /health`

## Multi‑Provedor (Base)
- Interface e fábrica de provedores
  - `backend/src/libs/providers/IWhatsAppProvider.ts:1–10`
  - `backend/src/libs/providers/ProviderFactory.ts:1–19`
- Provedores
  - `backend/src/libs/providers/BaileysProvider.ts:1–12` (delegando a `initWASocket`)
  - `backend/src/libs/providers/WhatsMeowProvider.ts:1–10` (stub)
- Inicialização de sessão usando fábrica
  - `backend/src/services/WbotServices/StartWhatsAppSession.ts:1–7,22–31`

## Status Atual
- Containers rodando: backend, frontend, postgres, redis
- Login funcional (admin/admin.com + 123456 via seed)
- Frontend acessível externamente sem tela branca
- Provedor default: Baileys; estrutura pronta para `whatsmeow`

## Próximos Passos Propostos
- Implementar `WhatsMeowProvider` via bridge (Go) exposto por HTTP/gRPC
  - Config `WHATSAPP_BRIDGE_URL`
  - Rotas: `connect`, `sendMessage`, `readMessages`, eventos (webhook)
- Adicionar opção no admin para selecionar provedor por sessão (`Whatsapp.provider`)
- Testes de integração para envio/recebimento e QR/pairing


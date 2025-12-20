# Guia de Inicialização Rápida no Whaticket

Aqui estão os passos simples para iniciar o sistema no seu dia-a-dia, permitindo edições rápidas (hot-reload).

## 1. Banco de Dados (Docker)
Antes de tudo, garanta que o banco de dados está rodando.
1. Abra o **Docker Desktop**.
2. Vá em **Containers**.
3. Expanda o grupo `whaticket`.
4. Garanta que **`postgres`** e **`redis`** estejam com o ícone **Verde (Running)**. Se não estiverem, clique no botão de **Play ▶️**.

## 2. Iniciar o Backend (Servidor)
1. Abra um terminal na pasta do projeto.
2. Entre na pasta backend:
   ```bash
   cd backend
   ```
3. Rode o comando de desenvolvimento:
   ```bash
   npm run dev
   ```
   *Aguarde aparecer "Server started on port: ..."*

## 3. Iniciar o Frontend (Tela)
1. Abra **outro** terminal (pode clicar no `+` do VS Code).
2. Entre na pasta frontend:
   ```bash
   cd frontend
   ```
3. Rode o comando:
   ```bash
   npm start
   ```
4. O navegador deve abrir automaticamente. Se perguntar se quer usar outra porta (porque a 3000 está ocupada), digite `y` e dê Enter.

---

### Resumo dos Comandos
| Terminal 1 (Backend) | Terminal 2 (Frontend) |
| -------------------- | --------------------- |
| `cd backend`         | `cd frontend`         |
| `npm run dev`        | `npm start`           |

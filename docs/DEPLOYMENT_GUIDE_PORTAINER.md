# Guia de Deploy e Arquitetura de Produção (Portainer + Traefik)

Este documento descreve a arquitetura de deploy recomendada para produção, utilizando **Portainer**, **Traefik** e **Docker Stacks** separadas para garantir escalabilidade e manutenção.

## 📂 Estrutura de Arquivos de Deploy

Recomendamos manter os arquivos de definição das stacks na pasta `/deploy` do repositório para versionamento e referência.

**Estrutura sugerida:**
```
/deploy
  ├── 01-postgres-stack.yml    # Banco de Dados
  ├── 02-redis-stack.yml       # Cache e Filas
  └── 03-app-stack.yml         # Whaticket (Frontend + Backend) + Labels Traefik
```

---

## 🏗️ Arquitetura das Stacks (Portainer)

Para um ambiente robusto, dividimos a aplicação em 3 stacks independentes. Isso permite atualizar a aplicação (Stack 3) sem reiniciar o banco de dados (Stack 1) ou perder o cache (Stack 2).

### 1. Stack de Banco de Dados (PostgreSQL)
*   **Serviço:** `postgres`
*   **Rede:** `rede-banco` (internal)
*   **Volume:** Persistência de dados em volume nomeado ou bind mount.
*   **Backup:** Configurar rotina de backup automática.

### 2. Stack de Cache (Redis)
*   **Serviço:** `redis`
*   **Rede:** `rede-banco` (internal) + `rede-app`
*   **Config:** Senha forte definida via variável de ambiente.

### 3. Stack da Aplicação (WhatsFlux / Whaticket)
*   **Serviços:** `frontend`, `backend`
*   **Rede:** `rede-app` (conecta com Redis) + `rede-traefik` (public)
*   **Proxy Reverso:** **Traefik** (configurado via Labels no docker-compose).

#### Labels do Traefik (Exemplo para Backend)
```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.backend.rule=Host(`api.seu-dominio.com`)"
  - "traefik.http.routers.backend.entrypoints=websecure"
  - "traefik.http.routers.backend.tls.certresolver=myresolver"
```

---

## 🔄 Fluxo de Atualização Contínua (CI/CD via Portainer)

Para manter o servidor sempre atualizado com a versão mais recente do código no GitHub, utilizamos o recurso de **Git Repository Polling** ou **Webhook** do Portainer.

### Passo a Passo:

1.  **Commit & Push:**
    *   Faça suas alterações localmente (VS Code).
    *   Suba as alterações para o GitHub:
        ```bash
        git add .
        git commit -m "Melhoria no envio LID"
        git push origin main
        ```

2.  **Configuração no Portainer (Stack App):**
    *   Vá na Stack da Aplicação (`03-app-stack`).
    *   Em **Repository**, configure a URL do seu repo GitHub.
    *   Ative **Automatic Updates**.
    *   **Opção A (Polling):** O Portainer checa o GitHub a cada X minutos.
    *   **Opção B (Webhook):** Copie a URL do Webhook fornecida pelo Portainer e adicione no seu repositório GitHub (Settings -> Webhooks). Assim que você der push, o Portainer atualiza instantaneamente.

3.  **Variáveis de Ambiente (.env):**
    *   Mantenha o arquivo `.env` seguro dentro do Portainer (Environment Variables) e **nunca** comite senhas reais no GitHub.

---

## ✅ Checklist de Deploy

1.  [ ] Código testado localmente (`npm run dev`).
2.  [ ] Arquivos de Stack (`/deploy/*.yml`) atualizados com as configurações de rede/traefik corretas.
3.  [ ] Alterações "commitadas" no GitHub (`git push`).
4.  [ ] Portainer configurado para puxar a branch `main`.
5.  [ ] Variáveis (LID, Tokens, Senhas) configuradas no Portainer.

---

## 🚑 Solução de Problemas

*   **Erro de Rede:** Verifique se as redes `rede-banco` e `rede-traefik` existem e se os containers estão conectados nelas.
*   **Erro de Build:** Verifique os logs do Portainer para ver se faltou alguma dependência no `package.json`.
*   **Traefik 404:** Verifique se os labels `Host(...)` coincidem com o DNS configurado.

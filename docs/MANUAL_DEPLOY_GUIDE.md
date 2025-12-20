# Guia de Deploy Manual "Cirúrgico" (Fast-Apply)

Este guia descreve o método utilizado para aplicar alterações de código (Frontend ou Backend) em containers Docker rodando localmente ou em produção, sem a necessidade de reconstruir a imagem inteira (`docker build`), o que pode ser lento ou falhar por problemas de rede.

## Quando usar este método?
- Quando o comando `docker compose up --build` falha (ex: erro de rede ao baixar pacotes npm/apk).
- Quando você precisa aplicar uma correção rápida (hotfix) em produção sem derrubar o serviço por muito tempo.
- Quando a alteração é pequena (apenas arquivos de código, sem novas dependências no `package.json`).

---

## 🚀 Passo a Passo

### 1. Identificar o Container Alvo
Primeiro, descubra o ID ou o Nome do container que você deseja atualizar.

```bash
docker ps
# Ou para filtrar (ex: frontend)
docker ps | grep frontend
```
*Anote o ID do container (ex: `a1b2c3d4e5f6`) ou o nome (ex: `whaticket-whaticket_frontend-1`).*

### 2. Copiar o Arquivo Alterado
Copie o arquivo do seu computador (host) para dentro do container, no caminho correto.

**Sintaxe:**
```bash
docker cp <CAMINHO_ORIGEM_HOST> <ID_CONTAINER>:<CAMINHO_DESTINO_CONTAINER>
```

**Exemplo (Frontend - App.js):**
```bash
docker cp frontend/src/App.js whaticket-whaticket_frontend-1:/usr/src/app/src/App.js
```

**Exemplo (Backend - wbotMessageListener.ts):**
```bash
docker cp backend/src/services/WbotServices/wbotMessageListener.ts whaticket-backend-1:/usr/src/app/src/services/WbotServices/
```

### 3. Recompilar o Código (Build)
Entre no container ou execute o comando remotamente para recompilar o projeto.

**Para Frontend (React):**
```bash
docker exec <ID_CONTAINER> npm run build
```
*Isso vai gerar a pasta `build` estática novamente com suas alterações.*

**Para Backend (Node/TypeScript):**
```bash
# Entrar no container para garantir
docker exec -it <ID_CONTAINER> /bin/bash
# Rodar o build
npm run build
# (Opcional) Sair
exit
# Reiniciar o container para pegar o novo código compilado
docker restart <ID_CONTAINER>
```

### 4. Validar
- **Frontend:** Dê um refresh forçado no navegador (`Ctrl + F5` ou `Cmd + Shift + R`).
- **Backend:** Verifique os logs para garantir que iniciou sem erros (`docker logs <ID_CONTAINER> -f`).

---

## ⚠️ Importante
- **Novas Dependências:** Se você instalou um pacote novo (`npm install pacote-novo`), este método **NÃO** via funcionar sozinho. Você precisará rodar `npm install` dentro do container antes do `npm run build`.
- **Persistência:** Essas alterações vivem apenas dentro do container atual. Se você deletar o container (`docker rm`), as alterações somem. O ideal é sempre atualizar a imagem Docker oficial assim que possível.

---

## 🎨 Como Mudar as Cores (Tema)

Se você precisar ajustar as cores novamente (ex: mudar o tom de verde), o arquivo que controla toda a paleta de cores do sistema é:

📂 **Arquivo:** `frontend/src/App.js`

Procure pelo bloco `palette` dentro da função `createTheme`. As principais cores para alterar são:

```javascript
palette: {
    // ...
    // Cor Principal (Botões, ícones, destaques)
    primary: { main: mode === "light" ? "#SEU_CODIGO_HEX" : "#FFFFFF" },
    
    // Cor da Barra Lateral e Fundo dos Menus
    // (Geralmente igual à primária ou um tom complementar)
    quicktags: { main: mode === "light" ? "#SEU_CODIGO_HEX" : "#SEU_CODIGO_HEX" },
    
    // Barra Superior (Gradiente ou Cor Sólida)
    barraSuperior: mode === "light" ? "linear-gradient(to right, #COR1, #COR2 , #COR3)" : "#666",
    // ...
}
```

### Exemplo do "Verde WhatsFlux" (Atual):
- Código de cor usado: **`#00695C`** (Teal Escuro/Verde Petróleo)

Basta substituir esse código hexadecimal pela cor que desejar e seguir os passos de **Deploy Manual** acima para aplicar.


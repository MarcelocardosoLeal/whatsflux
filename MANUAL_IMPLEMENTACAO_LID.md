# Manual de Implementação do Suporte a LID - Whaticket
## Guia Completo para Implementação Manual

---

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Alterações no Banco de Dados](#alterações-no-banco-de-dados)
3. [Alterações nos Arquivos do Backend](#alterações-nos-arquivos-do-backend)
4. [Verificação e Testes](#verificação-e-testes)
5. [Rollback (Desfazer Alterações)](#rollback)

---

## 🎯 VISÃO GERAL

### O que é LID?
LID (Link ID) é um novo sistema de identificação do WhatsApp para proteger a privacidade dos usuários.

**Formatos:**
- **Tradicional (JID):** `5511999999999@s.whatsapp.net`
- **Novo (LID):** `5511999999999@lid`

### Problema que resolve:
- ✅ Tickets duplicados para o mesmo contato
- ✅ Histórico de conversas fragmentado
- ✅ Incompatibilidade com privacidade do WhatsApp

---

## 💾 ALTERAÇÕES NO BANCO DE DADOS

### 🔌 Como Acessar o Banco de Dados

#### OPÇÃO A: Via Portainer (Recomendado para Docker)

**1. Acesse o Portainer:**
- Abra `http://seu-servidor:9000`
- Faça login

**2. Localize o Container do PostgreSQL:**
- Menu lateral: **Containers**
- Procure por: `postgres`, `whaticket-postgres`, `whaticket_postgres` ou similar

**3. Abrir Console do Container:**
- Clique no container do Postgres
- Clique em **"Console"** (ou **">_ Console"**)
- Selecione **"/bin/bash"** ou **"/bin/sh"**
- Clique em **"Connect"**

**4. Conectar ao PostgreSQL:**

```bash
# Conectar ao banco (ajuste o nome do banco se necessário)
psql -U whaticket -d whaticket

# Ou se o usuário for diferente
psql -U postgres -d whaticket
```

**5. Você verá o prompt do PostgreSQL:**
```
whaticket=#
```

**Agora pode executar os comandos SQL abaixo!**

---

#### OPÇÃO B: Via pgAdmin / DBeaver / Outro Cliente

**Informações de Conexão:**
- **Host:** IP do servidor ou `localhost` (se estiver no servidor)
- **Porta:** `5432` (padrão) ou a porta mapeada no Docker
- **Banco:** `whaticket` (ou o nome configurado)
- **Usuário:** `whaticket` ou `postgres`
- **Senha:** Verifique no arquivo `.env` ou `docker-compose.yml`

---

#### OPÇÃO C: Via SSH + Terminal

```bash
# Conectar ao servidor via SSH
ssh usuario@seu-servidor

# Acessar o container do Postgres
docker exec -it whaticket-postgres-1 psql -U whaticket -d whaticket
```

---

### 📊 Como Executar SQL via pgAdmin (Passo a Passo)

Se você tem acesso ao banco via **pgAdmin**, siga estes passos:

**1. Abrir o pgAdmin:**
- Abra o pgAdmin no seu computador
- Conecte-se ao servidor PostgreSQL do Whaticket

**2. Navegar até o Banco de Dados:**
- No painel esquerdo, expanda: **Servers**
- Expanda o servidor do Whaticket
- Expanda **Databases**
- Clique no banco **whaticket** (ou o nome configurado)

**3. Abrir o Query Tool:**
- Clique com o botão direito no banco **whaticket**
- Selecione **Query Tool** (ou pressione `Alt + Shift + Q`)
- Uma nova aba será aberta com um editor SQL

**4. Executar os Comandos SQL:**
- Cole o comando SQL no editor
- Clique no botão **▶ Execute/Refresh** (ou pressione `F5`)
- Aguarde a mensagem de sucesso

**5. Verificar o Resultado:**
- Na parte inferior, você verá:
  - ✅ **"Query returned successfully"** = Sucesso!
  - ❌ Se houver erro, leia a mensagem e corrija

**💡 Dica:** Você pode executar múltiplos comandos de uma vez. Basta colar todos e clicar em Execute.

**📸 Exemplo Visual do pgAdmin:**

```
┌─────────────────────────────────────────────────────────┐
│ Query Tool - whaticket                            [X]   │
├─────────────────────────────────────────────────────────┤
│ ▶ Execute  💾 Save  📋 Copy  ⚙ Options              │
├─────────────────────────────────────────────────────────┤
│ ALTER TABLE "Contacts"                                  │
│ ADD COLUMN "lid" VARCHAR(255) NULL;                     │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ Messages                                                │
│ ✅ Query returned successfully in 45 msec.             │
└─────────────────────────────────────────────────────────┘
```

**⚠️ Atenção:** 
- Se aparecer erro "column already exists", significa que a coluna já foi criada. Pode prosseguir.
- Se aparecer erro de permissão, verifique se está usando o usuário correto (postgres ou whaticket).

---

### PASSO 1: Adicionar Coluna `lid` na Tabela `Contacts`

**Acesse seu banco de dados PostgreSQL** (via pgAdmin, DBeaver, Portainer ou terminal)

**Execute o seguinte SQL:**

```sql
-- Adicionar coluna lid à tabela Contacts
ALTER TABLE "Contacts" 
ADD COLUMN "lid" VARCHAR(255) NULL;
```

**Verificar se foi criada:**

```sql
-- Verificar estrutura da tabela
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'Contacts' 
ORDER BY ordinal_position;
```

**Resultado esperado:**
Você deve ver uma nova coluna chamada `lid` do tipo `character varying` com `is_nullable = YES`

---

### PASSO 2: (Opcional) Criar Índice para Performance

**Para melhorar a performance de busca por LID:**

```sql
-- Criar índice na coluna lid
CREATE INDEX idx_contacts_lid ON "Contacts" ("lid");
```

**Verificar índices criados:**

```sql
-- Listar todos os índices da tabela Contacts
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'Contacts';
```

---

## 📝 ALTERAÇÕES NOS ARQUIVOS DO BACKEND

### 📂 Como Editar Arquivos via Portainer

#### OPÇÃO A: Via Console do Container (Recomendado)

**1. Acesse o Portainer:**
- Abra `http://seu-servidor:9000`
- Faça login

**2. Localize o Container do Backend:**
- Menu lateral: **Containers**
- Procure por: `backend`, `whaticket-backend`, `whaticket_backend` ou similar

**3. Abrir Console:**
- Clique no container do backend
- Clique em **"Console"** (ou **">_ Console"**)
- Selecione **"/bin/bash"** ou **"/bin/sh"**
- Clique em **"Connect"**

**4. Instalar Editor de Texto (se necessário):**

```bash
# Testar se o nano está instalado
nano --version

# Se não estiver, instalar
apt-get update && apt-get install -y nano

# Ou usar vi (geralmente já vem instalado)
vi --version
```

**5. Navegar até os Arquivos:**

```bash
# Ir para a pasta do backend
cd /app

# Ou se estiver em outro local
cd /usr/src/app

# Listar arquivos para confirmar
ls -la
```

**6. Editar os Arquivos:**

```bash
# Exemplo: Editar Contact.ts
nano src/models/Contact.ts

# Ou com vi
vi src/models/Contact.ts
```

**💡 Dicas do Nano:**
- `CTRL + O` = Salvar
- `CTRL + X` = Sair
- `CTRL + W` = Buscar

**💡 Dicas do Vi:**
- `i` = Entrar em modo de edição
- `ESC` = Sair do modo de edição
- `:wq` = Salvar e sair
- `:q!` = Sair sem salvar

---

#### OPÇÃO B: Via SSH + Editor Local

```bash
# Conectar ao servidor
ssh usuario@seu-servidor

# Acessar o container
docker exec -it whaticket-backend-1 /bin/bash

# Editar arquivos
nano /app/src/models/Contact.ts
```

---

#### OPÇÃO C: Via Volume Mapeado (Se Configurado)

Se o `docker-compose.yml` tem volumes mapeados:

```bash
# Conectar ao servidor via SSH
ssh usuario@seu-servidor

# Editar diretamente na pasta mapeada
nano /caminho/do/volume/backend/src/models/Contact.ts
```

---

### ARQUIVO 1: `backend/src/models/Contact.ts`

**Localização:** `backend/src/models/Contact.ts`

**O que fazer:** Adicionar o campo `lid` ao modelo

**Procure por esta seção (aproximadamente linha 84-89):**

```typescript
  @ForeignKey(() => Whatsapp)
  @Column
  whatsappId: number;

  @BelongsTo(() => Whatsapp)
  whatsapp: Whatsapp;
}
```

**Substitua por:**

```typescript
  @ForeignKey(() => Whatsapp)
  @Column
  whatsappId: number;

  @BelongsTo(() => Whatsapp)
  whatsapp: Whatsapp;

  @Column
  lid: string;
}
```

**⚠️ ATENÇÃO:** Adicione as 3 linhas ANTES do fechamento da classe `}`

---

### ARQUIVO 2: `backend/src/services/ContactServices/CreateOrUpdateContactService.ts`

**Localização:** `backend/src/services/ContactServices/CreateOrUpdateContactService.ts`

#### MUDANÇA 2.1: Adicionar Import do Operador OR

**No INÍCIO do arquivo (linha 1-4), procure:**

```typescript
import { getIO } from "../../libs/socket";
import Contact from "../../models/Contact";
import ContactCustomField from "../../models/ContactCustomField";
import { isNil } from "lodash";
```

**Adicione APÓS a linha do lodash:**

```typescript
import { getIO } from "../../libs/socket";
import Contact from "../../models/Contact";
import ContactCustomField from "../../models/ContactCustomField";
import { isNil } from "lodash";
import { Op } from "sequelize";  // ← NOVA LINHA
```

---

#### MUDANÇA 2.2: Adicionar `lid` na Interface Request

**Procure pela interface Request (aproximadamente linha 10-20):**

```typescript
interface Request {
  name: string;
  number: string;
  isGroup: boolean;
  email?: string;
  profilePicUrl?: string;
  companyId: number;
  extraInfo?: ExtraInfo[];
  whatsappId?: number;
  disableBot?: boolean;
}
```

**Adicione o campo `lid`:**

```typescript
interface Request {
  name: string;
  number: string;
  isGroup: boolean;
  email?: string;
  profilePicUrl?: string;
  companyId: number;
  extraInfo?: ExtraInfo[];
  whatsappId?: number;
  disableBot?: boolean;
  lid?: string;  // ← NOVA LINHA
}
```

---

#### MUDANÇA 2.3: Adicionar `lid` nos Parâmetros da Função

**Procure pela declaração da função (aproximadamente linha 22-32):**

```typescript
const CreateOrUpdateContactService = async ({
  name,
  number: rawNumber,
  profilePicUrl,
  isGroup,
  email = "",
  companyId,
  extraInfo = [],
  whatsappId,
  disableBot = false
}: Request): Promise<Contact> => {
```

**Adicione o parâmetro `lid`:**

```typescript
const CreateOrUpdateContactService = async ({
  name,
  number: rawNumber,
  profilePicUrl,
  isGroup,
  email = "",
  companyId,
  extraInfo = [],
  whatsappId,
  disableBot = false,
  lid  // ← NOVA LINHA
}: Request): Promise<Contact> => {
```

---

#### MUDANÇA 2.4: Implementar Busca Inteligente (Número OU LID)

**Procure pela busca de contato (aproximadamente linha 38-43):**

```typescript
  contact = await Contact.findOne({
    where: {
      number,
      companyId
    }
  });
```

**Substitua por busca com OR:**

```typescript
  contact = await Contact.findOne({
    where: {
      [Op.or]: [
        { number, companyId },
        ...(lid ? [{ lid, companyId }] : [])
      ]
    }
  });
```

**📌 Explicação:**
- Busca primeiro por `number` E `companyId`
- **SE** `lid` existir, também busca por `lid` E `companyId`
- Evita duplicação de contatos

---

#### MUDANÇA 2.5: Salvar LID ao Criar Contato

**Procure pela criação de contato (aproximadamente linha 58-68):**

```typescript
    contact = await Contact.create({
      name,
      number,
      profilePicUrl,
      email,
      isGroup,
      extraInfo,
      companyId,
      whatsappId,
      disableBot
    });
```

**Adicione o campo `lid`:**

```typescript
    contact = await Contact.create({
      name,
      number,
      profilePicUrl,
      email,
      isGroup,
      extraInfo,
      companyId,
      whatsappId,
      disableBot,
      lid  // ← NOVA LINHA
    });
```

---

### ARQUIVO 3: `backend/src/services/WbotServices/wbotMessageListener.ts`

**Localização:** `backend/src/services/WbotServices/wbotMessageListener.ts`

**⚠️ ARQUIVO GRANDE:** Este arquivo tem mais de 2600 linhas. Use CTRL+F para buscar.

#### MUDANÇA 3.1: Detectar e Passar LID no verifyContact

**Busque pela função `verifyContact` (aproximadamente linha 549-576)**

**Procure por este trecho:**

```typescript
const verifyContact = async (
  msgContact: IMe,
  wbot: Session,
  companyId: number
): Promise<Contact> => {
  let profilePicUrl: string;
  try {
    profilePicUrl = await wbot.profilePictureUrl(msgContact.id);
  } catch (e) {
    Sentry.captureException(e);
    profilePicUrl = `${process.env.FRONTEND_URL}/nopicture.png`;
  }

  const contactData = {
    name: msgContact?.name || msgContact.id.replace(/\D/g, ""),
    number: msgContact.id.replace(/\D/g, ""),
    profilePicUrl,
    isGroup: msgContact.id.includes("g.us"),
    companyId,
    whatsappId: wbot.id
  };
```

**Adicione a detecção de LID APÓS o bloco try/catch e ANTES de `contactData`:**

```typescript
const verifyContact = async (
  msgContact: IMe,
  wbot: Session,
  companyId: number
): Promise<Contact> => {
  let profilePicUrl: string;
  try {
    profilePicUrl = await wbot.profilePictureUrl(msgContact.id);
  } catch (e) {
    Sentry.captureException(e);
    profilePicUrl = `${process.env.FRONTEND_URL}/nopicture.png`;
  }

  // ↓↓↓ ADICIONE ESTAS 3 LINHAS ↓↓↓
  // Detectar LID contact
  const isLidContact = msgContact.id.includes("@lid");
  const lid = isLidContact ? msgContact.id : undefined;
  // ↑↑↑ FIM DA ADIÇÃO ↑↑↑

  const contactData = {
    name: msgContact?.name || msgContact.id.replace(/\D/g, ""),
    number: msgContact.id.replace(/\D/g, ""),
    profilePicUrl,
    isGroup: msgContact.id.includes("g.us"),
    companyId,
    whatsappId: wbot.id,
    lid  // ← ADICIONE ESTA LINHA
  };
```

**📌 Explicação:**
- Detecta se o ID contém `@lid`
- Se sim, armazena o ID completo no campo `lid`
- Passa para o service que vai salvar no banco

---

## ✅ VERIFICAÇÃO E TESTES

### PASSO 1: Verificar Banco de Dados

```sql
-- Verificar se a coluna foi criada
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Contacts' AND column_name = 'lid';
```

**Resultado esperado:**
```
column_name | data_type
------------|------------------
lid         | character varying
```

---

### PASSO 2: Reiniciar o Backend

#### OPÇÃO A: Se usar Portainer (Docker)

**1. Acesse o Portainer:**
- Abra o navegador e vá para `http://seu-servidor:9000`
- Faça login

**2. Navegue até o Container:**
- Menu lateral: **Containers**
- Localize o container do **backend** (ex: `whaticket_backend`, `whaticket-backend-1`)

**3. Reiniciar o Container:**
- Clique no container do backend
- Clique no botão **"Restart"** (ícone de seta circular)
- Aguarde o status mudar para **"Running"** (verde)

**4. Verificar Logs:**
- Ainda na tela do container, clique em **"Logs"**
- Procure por:
  - ✅ `Sistema de criptografia para sockets inicializado`
  - ✅ `GERENDO RECEITA...`
  - ❌ **NÃO deve ter:** `column "lid" does not exist`

**OU via Terminal (SSH no servidor):**

```bash
# Listar containers
docker ps

# Reiniciar o container do backend (substitua pelo nome correto)
docker restart whaticket-backend-1

# Ver logs em tempo real
docker logs -f whaticket-backend-1
```

---

#### OPÇÃO B: Se usar PM2 (Instalação Tradicional)

**No servidor de produção:**

```bash
# Parar o backend
pm2 stop backend

# Iniciar novamente
pm2 start backend

# Ver logs
pm2 logs backend
```

---

#### OPÇÃO C: Se usar Systemctl

```bash
# Parar o backend
sudo systemctl stop whaticket-backend

# Iniciar novamente
sudo systemctl start whaticket-backend

# Ver logs
sudo journalctl -u whaticket-backend -f
```

---

### PASSO 3: Verificar Logs

**Verificar se não há erros:**

```bash
# Se usar PM2
pm2 logs backend

# Se usar systemctl
sudo journalctl -u whaticket-backend -f
```

**Procure por:**
- ✅ `Sistema de criptografia para sockets inicializado`
- ✅ `GERENDO RECEITA...`
- ❌ **NÃO deve ter:** `column "lid" does not exist`

---

### PASSO 4: Testar com Contato Real

1. **Envie uma mensagem** de um número com privacidade ativada (LID)
2. **Verifique no banco:**

```sql
-- Ver contatos com LID
SELECT id, name, number, lid, "createdAt" 
FROM "Contacts" 
WHERE lid IS NOT NULL 
ORDER BY "createdAt" DESC 
LIMIT 10;
```

3. **Envie outra mensagem** do mesmo número
4. **Verifique se NÃO duplicou:**

```sql
-- Verificar duplicatas (não deve retornar nada)
SELECT number, COUNT(*) 
FROM "Contacts" 
GROUP BY number 
HAVING COUNT(*) > 1;
```

---

## 🔄 ROLLBACK (Desfazer Alterações)

### Se precisar reverter as mudanças:

#### 1. Remover coluna do banco:

```sql
ALTER TABLE "Contacts" DROP COLUMN "lid";
```

#### 2. Reverter arquivos:

**Use Git para voltar à versão anterior:**

```bash
git checkout HEAD -- backend/src/models/Contact.ts
git checkout HEAD -- backend/src/services/ContactServices/CreateOrUpdateContactService.ts
git checkout HEAD -- backend/src/services/WbotServices/wbotMessageListener.ts
```

#### 3. Reiniciar backend

---

## 📊 RESUMO DAS ALTERAÇÕES

### Banco de Dados:
- ✅ 1 coluna adicionada: `lid` (VARCHAR, NULL)
- ✅ 1 índice opcional: `idx_contacts_lid`

### Arquivos Modificados:
1. ✅ `backend/src/models/Contact.ts` (3 linhas)
2. ✅ `backend/src/services/ContactServices/CreateOrUpdateContactService.ts` (4 mudanças)
3. ✅ `backend/src/services/WbotServices/wbotMessageListener.ts` (4 linhas)

### Total:
- **1 tabela alterada**
- **3 arquivos modificados**
- **~15 linhas de código adicionadas**

---

## 🆘 TROUBLESHOOTING

### Erro: "column lid does not exist"
**Solução:** Execute o SQL de criação da coluna novamente

### Erro: "Cannot find module 'sequelize'"
**Solução:** Verifique se o import `import { Op } from "sequelize";` está correto

### Contatos duplicando
**Solução:** Verifique se a busca com `[Op.or]` está implementada corretamente

### LID não está sendo salvo
**Solução:** Verifique se o campo `lid` foi adicionado em:
- Interface `Request`
- Parâmetros da função
- Objeto `contactData`
- `Contact.create()`

---

## 📞 SUPORTE

Se encontrar problemas:
1. Verifique os logs do backend
2. Confirme que o banco foi alterado corretamente
3. Revise cada arquivo modificado linha por linha
4. Compare com este manual

---

**Versão:** 1.0  
**Data:** 17/12/2025  
**Compatibilidade:** Whaticket com Baileys 6.7.18+

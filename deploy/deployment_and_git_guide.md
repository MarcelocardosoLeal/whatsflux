# 🚀 Guia de Deploy e Sincronização WhatsFlux

Este guia explica como subir seu código para o GitHub com segurança e como instalar a aplicação no seu servidor Portainer.

---

## 🔒 Parte 1: Subindo para o GitHub (Para Iniciantes)

Como você tem o **GitHub Desktop**, siga estes passos para criar um repositório **PRIVADO**:

1.  **Abra o GitHub Desktop**.
2.  Vá em **File > Add local repository**.
3.  Clique em **Choose** e selecione a pasta `C:\Users\marce\Documentos\GitHub\Whaticket`.
4.  O GitHub Desktop vai dizer que a pasta não é um repositório git. Clique em **create a repository**.
    *   **IMPORTANTE**: Marque a opção **"Initialize this repository with a README"**.
5.  No menu superior, clique em **Publish repository**.
    *   **MUITO IMPORTANTE**: Certifique-se de que a caixa **"Keep this code private"** esteja **MARCADA**.
6.  Clique em **Publish**. Pronto! Seu código agora está seguro na nuvem.

---

## 🏗️ Parte 2: Deploy no Portainer

Como o Postgres e o Redis já estão rodando no seu servidor, vamos adicionar apenas a Stack da aplicação.

### Passo 1: Preparar no Portainer
1.  Acesse seu **Portainer**.
2.  Vá em **Stacks** no menu lateral.
3.  Clique no botão **+ Add stack**.
4.  Dê um nome, por exemplo: `whatsflux-app`.

### Passo 2: Configurar o Código
1.  Em **Build method**, você tem duas opções:
    *   **Option A (Web editor)**: Abra o arquivo `deploy/docker-compose.stack.yml` no seu computador, copie tudo e cole no editor do Portainer.
    *   **Option B (Repository - Recomendado)**:
        *   Selecione **Repository**.
        *   Cole a URL do seu GitHub Privado.
        *   Em **Compose path**, coloque: `deploy/docker-compose.stack.yml`.

### Passo 3: Finalizar
1.  Clique em **Deploy the stack**.
2.  O Portainer vai baixar o código, construir as imagens (backend e frontend) e colocar no ar.
3.  Aguarde cerca de 2 a 5 minutos para o build inicial.

---

## 🛠️ Detalhes Técnicos (Já configurados para você)

*   **Rede**: O app está usando a rede `minha_rede`.
*   **URLs**: 
    *   Frontend: `https://appv2.whatisflux.com.br`
    *   Backend: `https://homologapi.whatsflux.com.br`
*   **Segurança**: O arquivo `.gitignore` foi configurado para **NUNCA** subir suas senhas locais, bancos de dados ou arquivos temporários.

---

## 🆘 Precisa mudar algo?
Se precisar alterar o domínio ou a senha no futuro, basta editar os valores dentro do arquivo `deploy/docker-compose.stack.yml` e clicar em **Update the stack** no Portainer.

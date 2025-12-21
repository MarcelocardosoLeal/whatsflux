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

## 📦 Parte 2: Criando as Imagens no Servidor

Como o seu código é privado e não queremos deixar as imagens abertas na internet (num Registro público), precisamos "ensinar" o seu servidor a criar as imagens do WhatsFlux uma única vez.

### Passo 1: Clonar no Servidor
1.  Acesse o terminal do seu servidor (via SSH).
2.  Entre na pasta onde você costuma colocar seus projetos.
3.  Clone o seu novo repositório privado:
    ```bash
    git clone https://github.com/SEU_USUARIO/Whaticket.git
    cd Whaticket
    ```

### Passo 2: Construir as Imagens
1.  Rode este comando único. Ele vai ler o seu código e criar as imagens `whaticket-backend` e `whaticket-frontend` dentro do seu servidor:
    ```bash
    docker compose -f deploy/docker-compose.build.yml build
    ```
2.  Aguarde terminar (pode levar uns 5 minutos). 
3.  **Pronto!** Agora que as imagens existem localmente, o Portainer vai conseguir encontrá-las.

---

## 🏗️ Parte 3: Deploy da Stack no Portainer

## 🛠️ Detalhes Técnicos (Já configurados para você)

*   **Rede**: O app está usando a rede `minha_rede`.
*   **URLs**: 
    *   Frontend: `https://appv2.whatisflux.com.br`
    *   Backend: `https://homologapi.whatsflux.com.br`
*   **Segurança**: O arquivo `.gitignore` foi configurado para **NUNCA** subir suas senhas locais, bancos de dados ou arquivos temporários.

---

## 🆘 Precisa mudar algo?
Se precisar alterar o domínio ou a senha no futuro, basta editar os valores dentro do arquivo `deploy/docker-compose.stack.yml` e clicar em **Update the stack** no Portainer.

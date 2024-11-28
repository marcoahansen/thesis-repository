# Repositório de TCCs

Uma aplicação de repositório de TCCs construída com **Fastify**, **Prisma** e **TypeScript** para gerenciar teses acadêmicas.

## Tabela de Conteúdos

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Uso](#uso)
- [Scripts](#scripts)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Licença](#licença)

## Visão Geral

Este projeto fornece uma plataforma eficiente para armazenar e recuperar teses. Inclui recursos para submissão, recuperação e categorização de teses, construído com tecnologias web modernas.

## Tecnologias

Este projeto é construído utilizando as seguintes tecnologias:

- **[Fastify](https://www.fastify.io/)**: Um framework web rápido e de baixo overhead para Node.js.
- **[Prisma](https://www.prisma.io/)**: Um ORM moderno para TypeScript e JavaScript que ajuda a gerenciar interações com o banco de dados.
- **[TypeScript](https://www.typescriptlang.org/)**: Um superconjunto tipado de JavaScript que escala.

## Pré-requisitos

Certifique-se de ter o seguinte instalado antes de começar:

- **[Node.js](https://nodejs.org/)**: Versão LTS recomendada.
- **[Docker](https://www.docker.com/)**: Para executar o banco de dados.
- **[npm](https://www.npmjs.com/)**: Gerenciador de pacotes Node.

## Instalação

Siga estes passos para configurar o projeto localmente:

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/marcoahansen/thesis-repository.git
   cd thesis-repository
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure o banco de dados:**

   Inicie o banco de dados usando o Docker:

   ```bash
   docker-compose up -d
   ```

4. **Aplique as migrações do Prisma:**

   Execute as migrações para configurar o esquema do seu banco de dados:

   ```bash
   npx prisma migrate deploy
   ```

5. **Seed o banco de dados:**

   Se você tiver um script de seed, execute o seguinte para semear o banco de dados com dados iniciais:

   ```bash
   npm run prisma:seed
   ```

## Build Docker

Para realizar o build da imagem docker execute:

```bash
docker-compose up -d --build
```

## Uso

Para iniciar o servidor de desenvolvimento, use o seguinte comando:

```bash
npm run dev
```

O servidor será iniciado em modo de desenvolvimento e você poderá acessá-lo localmente através de:

```
http://localhost:3333
```

## Scripts

O projeto inclui alguns scripts npm para tarefas comuns:

- **`npm run dev`**: Inicia o servidor de desenvolvimento com suporte a TypeScript e hot-reloading.
- **`npm run prisma:seed`**: Semeia o banco de dados com dados iniciais.
- **`npx prisma studio`**: Abre o Prisma Studio para gerenciamento do banco de dados.

## Variáveis de Ambiente

Você precisará configurar as seguintes variáveis de ambiente para executar o projeto. Crie um arquivo `.env` no diretório raiz do projeto:

```bash
CLOUDFLARE_SECRET_KEY="sua-chave-secreta-cloudflare"
CLOUDFLARE_ACCESS_KEY="sua-chave-de-acesso-cloudflare"
CLOUDFLARE_ENDPOINT="https://api.cloudflare.com/seu-endpoint"
BUCKET_NAME="seu-nome-de-bucket"
PORT=3333
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
JWT_SECRET="sua-chave-secreta-jwt"
FCOOKIE_SECRET="sua-chave-secreta-fcookie"
```

## Licença

Este projeto é licenciado sob a Licença ISC. Veja o arquivo [LICENSE](./LICENSE) para detalhes.

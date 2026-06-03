# Verificador de Notícias

Site para verificar a veracidade de notícias usando IA (Claude) com busca na web em tempo real.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Anthropic Claude** (claude-sonnet-4) + web search tool
- **Vercel** para deploy

---

## Como rodar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/verificador-noticias.git
cd verificador-noticias
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure a chave da API

Crie o arquivo `.env.local` na raiz:

```bash
cp .env.example .env.local
```

Edite `.env.local` e adicione sua chave:

```
ANTHROPIC_API_KEY=sk-ant-sua-chave-aqui
```

> Obtenha sua chave em: https://console.anthropic.com/

### 4. Rode o servidor de desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

---

## Como fazer deploy na Vercel

### Opção A — Via GitHub (recomendado)

1. Faça push do projeto para um repositório no GitHub
2. Acesse https://vercel.com e clique em **"Add New Project"**
3. Importe o repositório do GitHub
4. Na seção **"Environment Variables"**, adicione:
   - `ANTHROPIC_API_KEY` = sua chave da API
5. Clique em **Deploy**

Pronto! A Vercel vai gerar uma URL pública automaticamente.

### Opção B — Via CLI

```bash
npm i -g vercel
vercel
```

Siga as instruções e adicione a variável de ambiente quando solicitado.

---

## Estrutura do projeto

```
├── app/
│   ├── api/
│   │   └── verificar/
│   │       └── route.ts       # API route (backend)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── VerificadorClient.tsx  # Interface interativa
│   └── VerificadorClient.module.css
├── .env.example
└── package.json
```

---

## Próximas melhorias sugeridas

- [ ] Histórico de verificações (localStorage ou banco de dados)
- [ ] Suporte a URL — extrair texto de links de notícias
- [ ] Rate limiting para evitar abuso
- [ ] Compartilhar resultado via link
- [ ] Bot de WhatsApp integrado à mesma API

# Feira Nova Web

Interface React do Feira Nova, separada da API e sem regras de processamento de planilhas.

## Desenvolvimento

```bash
npm install
copy .env.example .env
npm run dev
```

Configure `VITE_API_URL` com a origem da API. O valor padrão de desenvolvimento é `http://localhost:3000`.

## Validação

```bash
npm run lint
npm run build
```

## Docker e Render

A URL pública da API é incorporada pelo Vite durante o build. Por isso, o argumento
`VITE_API_URL` é obrigatório ao construir a imagem de produção:

```bash
docker build --build-arg VITE_API_URL=https://api.exemplo.com -t feira-nova-web .
docker run --rm -p 8080:8080 -e PORT=8080 feira-nova-web
```

A aplicação fica disponível em `http://localhost:8080`. O Nginx responde
`GET /health` e direciona rotas que não representam assets para `index.html`, permitindo
atualizar diretamente qualquer rota da SPA.

No Render, crie um Web Service com o `Dockerfile` e configure:

- build argument `VITE_API_URL` com a origem HTTPS pública da API, sem barra final;
- health check em `/health`;
- `PORT` fornecida pelo próprio Render, sem valor fixo na configuração do serviço.

O build falha quando `VITE_API_URL` não é informado, impedindo uma publicação que use
o fallback local de desenvolvimento.

## Estrutura

- `components/`: componentes e shells reutilizáveis;
- `pages/`: composição de páginas;
- `services/`: cliente HTTP e integrações;
- `types/`: contratos compartilhados da Web;
- `lib/`: configuração e utilitários sem regra de negócio.

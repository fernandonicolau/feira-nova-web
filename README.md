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
npm run typecheck
npm test
npm run build
```

## Fundação de interface

- tokens semânticos de cor, foco e sombra ficam centralizados em `src/styles.css`;
- primitivos reutilizáveis ficam em `src/components/ui` e usam `cn()` para composição de classes;
- formulários não triviais usam React Hook Form com schemas Zod e erros associados aos campos;
- React Query concentra estado remoto, cache, loading e erro;
- Vitest e Testing Library validam comportamento e acessibilidade observável.

A tela inicial demonstra a fundação com uma entrada manual real enviada a
`POST /api/v1/batches/process`. A Web apenas monta o contrato e apresenta o resultado; regras de
interpretação dos pedidos continuam exclusivamente na API. As cores atuais são tokens provisórios
da identidade Feira Nova e podem ser alteradas em um único ponto quando o branding definitivo for
aprovado.

As orientações locais para evoluir e revisar a interface estão em `.agents/README.md`.

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

### Deploy nativo

O serviço Web no Render acompanha a branch `main`. Um push nessa branch dispara o build e o deploy nativos do Render a partir do `Dockerfile`; `VITE_API_URL` é fornecida como variável do serviço e o Render a traduz para argumento do build Docker. Se o auto-deploy estiver desabilitado, use **Manual Deploy > Deploy latest commit** no painel do Render.

O GitHub apenas hospeda o código. Não é necessário workflow, `RENDER_API_KEY`, deploy hook ou secret do Render no repositório.

## Estrutura

- `components/`: componentes e shells reutilizáveis;
- `pages/`: composição de páginas;
- `services/`: cliente HTTP e integrações;
- `types/`: contratos compartilhados da Web;
- `lib/`: configuração e utilitários sem regra de negócio.

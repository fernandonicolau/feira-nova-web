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

## Estrutura

- `components/`: componentes e shells reutilizáveis;
- `pages/`: composição de páginas;
- `services/`: cliente HTTP e integrações;
- `types/`: contratos compartilhados da Web;
- `lib/`: configuração e utilitários sem regra de negócio.

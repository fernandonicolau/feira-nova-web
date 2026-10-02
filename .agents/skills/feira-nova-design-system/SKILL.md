---
name: feira-nova-design-system
description: Criar ou alterar interfaces do Feira Nova Web quando a mudança envolver tokens, componentes reutilizáveis, formulários ou composição visual React/Tailwind.
---

# Design system do Feira Nova

Antes de criar um componente, procure um primitivo em `src/components/ui` e os tokens em `src/styles.css`.

- Expresse cor e estado com tokens semânticos; não espalhe valores ou classes de paleta nos componentes.
- Preserve a identidade operacional: superfícies claras, verde como ação primária e âmbar como apoio, sem copiar branding externo.
- Use `cn()` para composição de classes e CVA apenas quando variantes tipadas eliminarem duplicação real.
- Formulários não triviais usam React Hook Form, schema Zod e `Field` para labels, descrição e erro acessíveis.
- Estado remoto pertence ao React Query; regras do motor e transformações de planilha permanecem na API.
- Adicione apenas primitivos exigidos pelo uso atual e cubra comportamento observável com testes.

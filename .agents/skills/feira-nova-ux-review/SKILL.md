---
name: feira-nova-ux-review
description: Revisar uma interface do Feira Nova Web antes da entrega, com foco em acessibilidade, responsividade, estados assíncronos e consistência visual.
---

# Revisão de UX do Feira Nova

Avalie a interface no contexto operacional e corrija problemas concretos, sem redesenhar fora do escopo.

- Confirme ordem de tabulação, labels, foco visível, mensagens com `role` adequado e contraste por token.
- Confira estados inicial, carregando, sucesso, vazio e erro para toda operação assíncrona relevante.
- Verifique 320 px, breakpoint intermediário e desktop; evite controles ou textos que estourem a largura.
- Prefira hierarquia clara, texto direto e densidade compatível com uso repetitivo.
- Execute typecheck, lint, testes e build; registre limitações que dependam de navegador ou serviço externo.

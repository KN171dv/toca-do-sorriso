# Toca do Sorriso na Brasa — site próprio de pedidos

Site de hamburgueria (cardápio → carrinho → checkout → pedido via WhatsApp) que substitui a página do InstaDelivery. React 19 + TypeScript + Vite 8 + Tailwind CSS 4, pré-renderizado (SSG) no build.

## Stack de trabalho

```
CLAUDE CODE
├── ✅ Frontend Design
├── ✅ Impeccable
├── ✅ Emil Design Engineer
├── 📥 Playwright
├── 📥 Code Review
├── 📥 TypeScript LSP
├── 📥 Security Guidance
└── 📥 Context7

PROJETO
├── 📦 GSAP
├── 📦 ScrollTrigger
├── 📦 Motion
├── 📦 Lenis
└── 📦 React Three Fiber → somente quando necessário
```

✅ já habilitado · 📥 instalar quando a tarefa pedir · 📦 dependência do projeto.

Quando usar cada plugin 📥:
- **Playwright** — conferir resultado visual, responsividade (320 → 1920) e o fluxo de pedido.
- **TypeScript LSP** — checar tipos enquanto edita.
- **Context7** — antes de mexer em API de GSAP, Motion, Lenis, Tailwind 4 ou Vite.
- **Code Review** — ao fechar uma etapa / antes de commit ou PR.
- **Security Guidance** — ao tocar no checkout, em dados de cliente ou ao criar backend/admin.

Onde cada lib do projeto entra (já instaladas, exceto R3F):
- **GSAP + ScrollTrigger** — tudo que é ligado ao scroll: exploded view (`BurgerExploded.tsx`), parallax do hero e da seção Experiência, reveals (`useReveal.ts`). Registrados em `src/lib/motion.ts`.
- **Motion** — entrada/saída de modal, carrinho e checkout (`components/ui/Sheet.tsx`). Fica em chunk assíncrono; não importar em componentes do primeiro render.
- **Lenis** — scroll suave só em desktop (ponteiro fino), sincronizado com o ticker do GSAP (`hooks/useLenis.ts`).
- **React Three Fiber** — NÃO instalado. O exploded view usa camadas 2D com transform. Só adicionar se houver um modelo 3D real do hambúrguer, e confirmar com o usuário antes.

## Comandos

- `npm run dev` — desenvolvimento
- `npm run build` — typecheck + build + pré-render (gera `dist/`)
- `npm run preview` — serve o build
- `npm run typecheck` · `npm run lint`
- `npm run images:fetch` — baixa as fotos originais do InstaDelivery e regera os WebP
- `npm run layers:render` — rasteriza `design/burger-layers/*.svg` → `public/images/burger-layers`

## Regras do projeto

1. **Nunca inventar dados da empresa** (preço, ingrediente, horário, taxa, endereço, avaliação, tempo de entrega). Tudo vem de `src/data/`, auditado em `docs/AUDITORIA.md`. O que não existe fica vazio/configurável.
2. **Dados fora dos componentes.** Preço, produto, taxa, horário e contato só em `src/data/*`. A UI lê via `src/lib/catalog.ts`.
3. **Regra de negócio fora da UI**: `src/lib/` (pricing, hours, validation, whatsapp, orderService).
4. **Conversão primeiro.** Animação nunca pode atrasar ou esconder o caminho até o pedido.
5. **Animação só com `transform`/`opacity`**, respeitando `prefers-reduced-motion` (use `gsap.matchMedia`).
6. **Mobile first**: alvos de toque ≥ 44px, sem overflow horizontal, inputs com fonte ≥ 16px.
7. **Fotos reais primeiro.** Sem foto → placeholder identificado (`ProductPhoto`), nunca banco de imagens ou IA.
8. HTML é pré-renderizado: nada de `window`/`localStorage` durante o render; estado do cliente entra em `useEffect`.

## Mapa rápido

- `src/data/` — business, hours, delivery, payments, categories, addons, products, featured
- `src/lib/` — catalog, pricing, hours, validation, whatsapp, orderService, motion, format
- `src/store/` — `cart.ts` (carrinho persistido), `ui.ts` (painéis + dados do checkout)
- `src/components/sections/` — Hero, BurgerExploded, BestSellers, Menu, Experience, Delivery, Instagram, FinalCta
- `src/components/{menu,cart,checkout,layout,ui}/`
- `docs/ARCHITECTURE.md` — arquitetura, pendências e caminho para o admin/backend

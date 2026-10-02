# Toca do Sorriso na Brasa

Site próprio de pedidos: cardápio real, carrinho, checkout e envio do pedido para o WhatsApp da loja.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + build + pré-render → dist/
npm run preview
```

## Editar o conteúdo
Tudo fica em `src/data/`:

| Arquivo | O que muda |
|---|---|
| `products.ts` | produtos, preços, descrições, fotos, disponibilidade (`active`) |
| `categories.ts` | categorias e ordem |
| `addons.ts` | adicionais e preços |
| `delivery.ts` | bairros, taxas, pedido mínimo, tempo estimado |
| `payments.ts` | formas de pagamento |
| `hours.ts` | horário de funcionamento |
| `business.ts` | endereço, WhatsApp, Instagram |
| `featured.ts` | hero, mais pedidos, camadas do exploded view |

## Publicar
Qualquer hospedagem estática (Vercel, Netlify, Cloudflare Pages): build `npm run build`, pasta `dist`. Defina `VITE_SITE_URL` com o domínio final.

Mais detalhes: `docs/ARCHITECTURE.md` · auditoria do site antigo: `docs/AUDITORIA.md` · guia para o Claude Code: `CLAUDE.md`.

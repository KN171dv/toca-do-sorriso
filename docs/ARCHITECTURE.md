# Arquitetura

## Fluxo
Instagram → site → produto (modal) → carrinho → checkout → **WhatsApp da loja com o pedido pronto**.

O pedido é montado no navegador e enviado como mensagem formatada (`src/lib/whatsapp.ts`). Funciona sem backend e sem mensalidade. O carrinho e os dados do cliente ficam salvos no aparelho (`localStorage`) para o próximo pedido ser mais rápido.

## Camadas
| Camada | Pasta | Responsabilidade |
|---|---|---|
| Dados | `src/data` | Único lugar com preço, produto, taxa, horário, contato |
| Domínio | `src/lib` | Preço, horário, validação, mensagem, envio |
| Estado | `src/store` | Carrinho, painéis abertos, dados do checkout (Zustand) |
| UI | `src/components` | Seções, cardápio, carrinho, checkout |

A UI nunca importa `products` diretamente: usa `src/lib/catalog.ts`. Trocar a origem dos dados (arquivo → API) é mexer só ali.

## Decisões de design
- **Paleta**: carvão `#0D0907`, laranja-brasa `#F58A2A`, creme `#F6E7CE` — tirada do logo.
- **Tipografia**: Anton (títulos, ecoa o condensado do logo) + Barlow (texto). Self-hosted em `public/fonts`.
- **Foto é protagonista**: fundo escuro, sem cards brancos; calor vem de gradientes radiais e fagulhas em CSS.
- **Animação**: hero em CSS puro (roda no primeiro paint); scroll com GSAP/ScrollTrigger; overlays com Motion.

## Exploded view (`BurgerExploded.tsx`)
- Seção alta com conteúdo `sticky`; um ScrollTrigger com `scrub` conduz a timeline. Só `transform`/`opacity`.
- Desktop (≥1024px): rótulos ao lado de cada camada. Mobile: uma camada em foco + legenda única.
- `prefers-reduced-motion`: hambúrguer montado e lista de ingredientes, sem pin.
- **As camadas são ilustrações** (`design/burger-layers/*.svg` → `npm run layers:render`). Não existem fotos recortadas dos ingredientes. Para trocar por fotos reais: salvar PNG/WebP com fundo transparente em `public/images/burger-layers/` com os mesmos nomes e ajustar `ratio`/`y` em `src/data/featured.ts`.

## Performance
- HTML pré-renderizado no build (`scripts/prerender.mjs`) e hidratado no cliente.
- Modal, carrinho, checkout e Motion em chunks assíncronos, pré-aquecidos após 2,5 s.
- Imagens WebP com `srcset`, lazy-loading e dimensões fixas (CLS ≈ 0).
- Lighthouse mobile local: Performance 88 · Acessibilidade 100 · Boas práticas 96–100 · SEO 100.

## Pendências para produção
- [ ] Definir domínio e preencher `VITE_SITE_URL` (canonical, Open Graph, Schema.org).
- [ ] Confirmar tabela de taxa de entrega (bairro × km) e o tempo estimado.
- [ ] Fotos: Brasileirinho Burguer e os dois pratos feitos.
- [ ] Logo corrigido ("DO").
- [ ] CEP e coordenadas em `src/data/business.ts` (SEO local).
- [ ] Rodar `npm run images:fetch` para regerar as fotos a partir dos originais.
- [ ] Analytics/Pixel, se desejado.

## Caminho para backend + admin
Hoje não há servidor. Para ter painel de pedidos e edição de cardápio:

1. **Banco** (sugestão: Supabase — Postgres + Auth + Storage). Tabelas espelhando `src/types`: `categories`, `products`, `addons`, `product_addons`, `delivery_zones`, `payment_methods`, `opening_hours`, `settings`, `orders`, `order_items`.
2. **Catálogo**: reimplementar `src/lib/catalog.ts` lendo do banco (os campos `active` e `order` já existem para ativar/desativar e ordenar).
3. **Pedidos**: criar um `OrderGateway` em `src/lib/orderService.ts` que grava em `orders` e, em seguida, abre o WhatsApp. A interface já está pronta.
4. **Admin** (`/admin`, rota protegida): CRUD de produto, preço, descrição, imagem, disponibilidade; taxa por bairro; horários; lista de pedidos em tempo real.
5. **Segurança**: recalcular o total no servidor (nunca confiar no preço enviado pelo cliente), RLS no banco, validação dos campos do checkout.

Com rotas e servidor, vale migrar de Vite SPA para Next.js; os componentes e a pasta `lib` são reaproveitados.

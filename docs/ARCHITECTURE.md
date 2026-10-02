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

## Hambúrguer em destaque (`BurgerExploded.tsx`)

### Asset
- Original: `public/images/burger/hamburguer-3d.png` (1254², vista explodida do **Duplo Bacon** com rótulos desenhados). WebP da imagem inteira ao lado (`hamburguer-3d.webp`, `-640.webp`). É uma imagem ilustrativa — a seção diz isso.
- `npm run burger:build` (`scripts/burger-3d.mjs`):
  1. move a imagem enviada (`upload/`, raiz, `public/` ou `src/`) para `public/images/burger/`;
  2. **remove o fundo** com `@imgly/background-removal-node` — só desenvolvimento, nunca dependência do site. Instalar sob demanda (`npm i --no-save @imgly/background-removal-node`) e rodar com `-- --fresh`. O recorte fica em cache em `design/burger-3d/cutout.png`, então o comando normal não precisa do modelo;
  3. apaga os pontos/linhas dos rótulos que tocavam a comida (caixas fixas medidas nesta imagem) e a sombra escura das frestas;
  4. separa **6 peças** por cor + faixa vertical: pão de cima, maionese, bacon, cheddar+carne, cheddar+carne, pão de baixo. Cada peça leva um anel de 3 px (alfa decrescente) por baixo da peça da frente, para não abrir frestas;
  5. exporta `public/images/burger-layers/3d-*.webp` (inteira e `-sm`) e a geometria em `src/data/burger3d.ts` (gerado — não editar).
- **Montado** = peças aproximadas (`ASSEMBLE_DY` no script, ajustado no olho). **Aberto** = posição da foto original. A animação nunca abre além da foto, então nenhuma parte escondida aparece.
- Rótulos: `burgerLabels` em `src/data/featured.ts` (texto da descrição do produto + peça + altura do conector). Trocar o produto em destaque exige outra imagem.

### Animação
- Seção de uma tela (sem `sticky`/scrub). O palco reserva a altura do hambúrguer montado + o espaço para abrir (`--open`: 0,75 no mobile, 1 no desktop); a abertura é calculada desse espaço real.
- Entrada: o hambúrguer desce e assenta (`expo.out`), com brilho; flutuação leve só enquanto a seção está na tela.
- Quando o hambúrguer passa de 62% da altura da tela, a timeline toca **por tempo** (~2,5 s até o fim dos rótulos): peças se afastam com rotação pequena → rótulos com conector em sequência (desktop) ou legenda de ingredientes (mobile/tablet) → recompõe → anel no "Adicionar" e botão "Ver de novo".
- Toca uma vez por carregamento. Se a seção sai da tela no meio, `progress(1)` leva ao estado final. Preço e "Adicionar" ficam sempre visíveis.
- `prefers-reduced-motion`: sem timeline; hambúrguer montado + legenda de ingredientes + CTA. A lista `sr-only` de ingredientes existe em todos os modos.

## Navegação
- Cabeçalho: Início · Destaque · Cardápio · Sobre · Delivery · Contato (ordem da página). O item ativo vem das posições das seções, lidas só no `refresh` do ScrollTrigger.
- < 1024px: menu em tela cheia (`useOverlay`: foco preso, Esc, devolve o foco). Status compacto a partir de 375px, completo a partir de 480px; abaixo disso, o status aparece dentro do menu.

## Microinterações
- Adicionar ao carrinho: `flyToCart` (miniatura até o carrinho, 550 ms, WAAPI), check no botão "+", pulso no ícone do carrinho (`useCartFeedback`) e aviso `aria-live` (`CartAnnouncer`). Tudo desligado/instantâneo com movimento reduzido.
- Tailwind 4: `scale-*`/`translate-*` usam as propriedades CSS `scale`/`translate`, então transições devem listar `translate,scale` (não `transform`).

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

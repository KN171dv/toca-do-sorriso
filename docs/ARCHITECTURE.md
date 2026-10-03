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

### Animação — abre uma vez e fica aberto
- Seção de uma tela (sem `sticky`/scrub). O palco reserva a altura do **estado aberto** (`--open`: 0,75 no mobile, 1 no desktop), que é permanente e define o tamanho da seção. No desktop a largura vem da altura da tela: `min(30vw, (100svh − 220px) / 1,43, 560px)`.
- Antes do gatilho: montado e **imóvel** (nenhuma animação em loop).
- Quando o hambúrguer passa de 70% da altura da tela, uma timeline pausada toca uma vez (~2,3 s): peças se afastam com rotação de 1° → rótulos com conector em sequência (desktop) ou lista de ingredientes (mobile/tablet) → anel no "Adicionar" quando entra o último rótulo. **Não recompõe** e não há "Ver de novo".
- Fica aberto. Passar direto (`onLeave`), voltar de baixo (`onEnterBack`), trocar de aba ou estourar o prazo leva ao estado final. Só volta ao montado com um novo carregamento (F5).
- A âncora `#destaque` para no topo da seção (`data-scroll-offset="0"` lido por `scrollToTarget`), porque a seção já reserva o espaço do cabeçalho no próprio padding.
- `prefers-reduced-motion`: aberto desde o início, desenhado em CSS (`transform` inline + classes `motion-reduce:`), sem timeline. A lista `sr-only` de ingredientes existe em todos os modos.

## Direção de arte (etapa 5: calor da etapa 3 + acabamento)
- A etapa 4 (menos fórmula por **remoção**) foi revertida (`git revert`, commit "Reverte a etapa 4"); a regra é refinar por acabamento, nunca por remoção.
- Etiquetas laranja, títulos grandes com destaque laranja, brilhos e fagulhas ficam. A variação vem da **composição** de cada seção: Mais pedidos com o 1º card mais largo; Cardápio com título menor e abas fortes; Sobre com foto grande + lista de lanchonete (linhas tracejadas); Delivery com painel único dos três números + bairros em tabela; Instagram com a faixa e a legenda "Do nosso cardápio".
- Brilho de fundo forte no hero, no destaque e no CTA final; suave (~0,08–0,11) nas demais. Junções em gradiente entre coal-900 e coal-950.
- Acabamento: `Money` (algarismos tabulares, "R$" menor) em todo preço; `.card-surface` (borda fina + luz interna no topo) nos cards; sombra laranja dos botões suave e difusa (`shadow-ember`, `shadow-ember-pressed`); placeholder "Foto em breve" discreto.
- Carrinho: a barra flutuante só existe abaixo de 768px; a partir daí o botão do cabeçalho mostra o subtotal (a barra cobria o "+" de itens na base da tela). Entre 1024 e 1279px o status do cabeçalho fica compacto.

## Hero
- `featured.heroVariant` (`src/data/featured.ts`): `'foto'` (padrão) = foto real do Big Sorriso; `'3d'` = recorte montado do Duplo Bacon (`public/images/burger/hamburguer-3d-montado.webp`, gerado por `npm run burger:build`), legenda "Imagem ilustrativa", pílula abre o Duplo Bacon. A pré-carga do LCP segue a variante (`heroPreload` em `vite.config.ts`, marcador `<!--HERO_PRELOAD-->` no `index.html`).
- Foto sempre nítida, no máximo 500px, sem máscara nem degradê sobre o lanche. Sem contorno chapado: sombra quente e profunda e o brilho da brasa passando por trás. A pílula "Na foto" (abre o produto) fica na borda inferior; no celular, quase toda abaixo da foto, sem cobrir o lanche.
- Fagulhas (`Embers`): poucas e variadas — a maioria pequena e rápida, ~1 em 5 maior, lenta e desfocada.
- Continua sendo o LCP (`preload`, `fetchpriority=high`, `width`/`height`).
- Entrada em CSS puro, só com deslocamento. Saída (scrub) só com deslocamento e opacidade.
- Título limitado pela largura **e** pela altura da tela; em telas baixas (< 700px de altura, mobile) o parágrafo sai e, abaixo de 620px, a foto encolhe e a etiqueta "Na foto" sai — "Pedir agora" e "Ver por dentro" aparecem sem rolar em qualquer largura.

## Animações de scroll (`useReveal.ts`)
| Marcação | Efeito |
|---|---|
| `data-reveal` | sobe e aparece (texto, cards, botões) |
| `data-reveal="title"` | linhas sobem de dentro de uma máscara (SplitText, ≥768px; no celular vira o efeito simples) |
| `data-reveal="media"` | `clip-path` se abre e a imagem (`[data-reveal-inner]` ou 1ª `<img>`) assenta de 1,06 → 1 |
| `data-reveal="stat"` | números de destaque com mais presença (Delivery) |
| `data-reveal="ambient"` | brilho de fundo da seção acende uma vez |
- Itens que entram juntos (uma linha de grade) são escalonados em 0,07 s (0,04 s no celular). `expo.out`/`power3.out`, 0,7–1 s. Cada elemento anima uma vez.
- A preparação (SplitText, estado oculto) roda em `requestIdleCallback`, só para o que está abaixo da tela — fora do caminho do LCP.
- Proteções (o conteúdo nunca fica invisível esperando): rolagem rápida (> 2600 px/s) ou item já acima da tela → estado final na hora; prazo por animação; ao voltar para a aba, o pendente na tela termina; `IntersectionObserver` revela o que está na tela há 2,2 s; foco do teclado revela na hora. Nada usa `visibility: hidden`.
- Títulos com link dentro (Instagram) usam o efeito simples: a máscara por linha esconderia um link focável de leitores de tela.
- Máscara do SplitText: `overflow-clip-margin` evita cortar acentos sem mudar o layout; `text-align: inherit` mantém títulos centralizados no lugar (CLS 0).
- Seções `coal-900` têm junções em gradiente com as vizinhas `coal-950`.

## Logo
- O arquivo `public/images/brand/logo.webp` (e `logo-192/512.png`) diz **"TOCA DD SORRISO"**. Enquanto não houver logo corrigido, o cabeçalho e o menu mobile usam o selo (`logo-96.webp`, 40px no celular e 44px a partir de 640px, decorativo, `alt=""`) com o nome correto em texto ao lado. Rodapé mantém o selo. Quando chegar um logo novo, gerar as versões com sharp e atualizar favicon/manifest.

## Recarregar (F5)
- Script mínimo no `<head>` (`index.html`): `history.scrollRestoration = 'manual'` e, só em recarregamento, remove a âncora da URL e vai ao topo antes do conteúdo. O `App` reforça o topo no Lenis e chama `ScrollTrigger.refresh()`. Link direto com âncora continua funcionando.

## Navegação
- Cabeçalho: Início · Destaque · Cardápio · Sobre · Delivery · Contato (ordem da página). O item ativo vem das posições das seções, lidas só no `refresh` do ScrollTrigger.
- < 1024px: menu em tela cheia (`useOverlay`: foco preso, Esc, devolve o foco). Status compacto a partir de 375px, completo a partir de 480px; abaixo disso, o status aparece dentro do menu.

## Microinterações
- Modal do produto: foto inteira, quadrada, até 500px (tamanho do arquivo), sobre fundo escuro com brilho — sem `object-cover` em área de outra proporção. Barras de rolagem do modal/carrinho/checkout finas e escuras (`index.css`).
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
- [ ] Fotos reais da loja, da chapa e da equipe (seção Sobre; ver comentário em `Experience.tsx`).
- [ ] Foto do hero em resolução maior (hoje 500px) e posts reais do Instagram.

## Imagem de compartilhamento
- `public/images/brand/og.jpg` (1200×630): nome em texto (Anton + Barlow) e a foto real do hambúrguer, sem o selo com erro. `npm run og:build` (`scripts/og-image.mjs`) renderiza com Playwright — ferramenta só de desenvolvimento (`npm i --no-save playwright` ou `PLAYWRIGHT_MODULE=...`).
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

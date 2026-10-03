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
- **Foto é protagonista**: fundo escuro, sem cards brancos.
- **Animação**: hero em CSS puro (roda no primeiro paint); scroll com GSAP/ScrollTrigger; overlays com Motion.

### Direção de arte (etapa 4: menos fórmula)
- A receita completa (etiqueta laranja + título gigante em Anton com final laranja) fica **só no hero e no destaque**. As demais seções têm títulos diretos ("Os mais pedidos", "Cardápio", "Sobre a Toca", "Entrega e retirada"), sem etiqueta, em tamanhos diferentes (o do cardápio é pequeno e funcional). O CTA final mantém "Seu próximo hambúrguer começa aqui."
- **Brilho/calor** (gradientes radiais) só no hero e no destaque; as outras seções têm fundo liso, com junções suaves entre coal-900 e coal-950. Sem fagulhas, sem sombra laranja nos botões, sem numeração decorativa, sem pílula de status fora do cabeçalho.
- **Ritmo**: Mais pedidos e Cardápio ficam colados; Sobre e Delivery têm mais ar (mudam de assunto).
- **Escala de cantos**: pequeno (8–12px) em campos e itens de lista; médio (16px) em cards de produto; grande só em peças de destaque (cards de Mais pedidos 28px, modal). Sem borda onde o fundo já separa.
- **Texto**: sem travessão em texto corrido; não inventar fatos (Sobre não tem história, fundador, data nem depoimento).
- **Formatos**: Delivery é uma faixa de informação + tabela de bairros (nome à esquerda, taxa à direita), não cards; Sobre é uma lista de bilhete; Instagram é um bloco simples (@ + convite + botão), sem fotos que imitem feed.

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

## Hero
- Foto do Big Sorriso (arquivo de 500px) exibida no máximo com 500px, **fundida ao fundo** por degradê nas quatro bordas (16% em cima, 10% nas laterais, 8% embaixo — estreito onde o bacon e o pão chegam perto da borda), sem moldura nem cantos. "Na foto" é uma legenda discreta abaixo da imagem. Continua sendo o LCP (`preload`, `fetchpriority=high`, `width`/`height`).
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
- O arquivo `public/images/brand/logo.webp` (e `logo-192/512.png`) diz **"TOCA DD SORRISO"** e em ~32px fica ilegível. Enquanto não houver logo corrigido, o cabeçalho e o menu mobile mostram só o nome em texto; o selo aparece apenas no rodapé. Quando chegar um logo novo (`public/images/brand/logo.*`), gerar as versões com sharp, colocar no cabeçalho em tamanho legível e atualizar favicon/manifest.

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
- [ ] Fotos reais da loja, da chapa e da equipe (entram na seção Sobre; ver comentário em `Experience.tsx`).
- [ ] Foto do hero em resolução maior (hoje 500px).
- [ ] Posts reais do Instagram (o bloco do Instagram pode ganhar 2–3 fotos paradas).
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

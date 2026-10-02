/**
 * Curadoria de destaques — tudo aponta para produtos reais do cardápio.
 */
export const featured = {
  /** Foto usada no hero (fundo escuro, mais dramática). */
  heroProductId: 'big-sorriso',
  /** Produto da apresentação "exploded view". */
  explodedProductId: 'duplo-bacon',
  /** Marcados como destaque / + vendido no InstaDelivery. */
  bestSellerIds: ['duplo-bacon', 'tudao', 'combo-casal-2'],
  /** Faixa de fotos na seção do Instagram (fotos do cardápio). */
  galleryIds: ['big-sorriso', 'duplo-bacon', 'tudao', 'melt-burguer', 'churras-burguer', 'salada-burguer', 'combo-casal-2', 'burguer-bacon'],
} as const

export interface BurgerLayer {
  id: string
  /** Rótulo — ingredientes reais da descrição do produto. */
  label: string
  detail?: string
  /**
   * Arte da camada. Hoje: ilustração (design/burger-layers/*.svg).
   * Quando houver fotos recortadas reais, basta trocar o arquivo.
   */
  image: string
  /** Proporção altura/largura do arquivo. */
  ratio: number
  /** Posição (em % da largura do palco) do topo da camada, montado. */
  y: number
}

/** Camadas do Duplo Bacon, de cima para baixo. */
export const explodedLayers: BurgerLayer[] = [
  { id: 'pao-topo', label: 'Pão brioche', detail: 'Tostado na manteiga', image: '/images/burger-layers/bun-top.webp', ratio: 380 / 800, y: 0 },
  { id: 'maionese', label: 'Maionese temperada', image: '/images/burger-layers/mayo.webp', ratio: 150 / 800, y: 33 },
  { id: 'bacon', label: 'Bacon', image: '/images/burger-layers/bacon.webp', ratio: 190 / 800, y: 33 },
  { id: 'cheddar-1', label: 'Queijo cheddar', image: '/images/burger-layers/cheddar.webp', ratio: 190 / 800, y: 45 },
  { id: 'carne-1', label: 'Carne 100g', detail: 'Na brasa', image: '/images/burger-layers/patty.webp', ratio: 230 / 800, y: 51 },
  { id: 'cheddar-2', label: 'Queijo cheddar', image: '/images/burger-layers/cheddar.webp', ratio: 190 / 800, y: 66 },
  { id: 'carne-2', label: 'Carne 100g', detail: '2 carnes no total', image: '/images/burger-layers/patty.webp', ratio: 230 / 800, y: 72 },
  { id: 'pao-base', label: 'Pão brioche', detail: 'Base tostada', image: '/images/burger-layers/bun-bottom.webp', ratio: 220 / 800, y: 90 },
]

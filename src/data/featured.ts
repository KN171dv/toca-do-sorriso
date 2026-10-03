/**
 * Curadoria de destaques — tudo aponta para produtos reais do cardápio.
 */
export const featured = {
  /**
   * Imagem do hero:
   *  'foto' → foto real do produto heroProductId (padrão)
   *  '3d'   → recorte montado do hambúrguer 3D (Duplo Bacon), nítido e sem fundo;
   *           legenda "Imagem ilustrativa", o botão abre explodedProductId.
   */
  heroVariant: 'foto' as 'foto' | '3d',
  /** Foto usada no hero (fundo escuro, mais dramática). */
  heroProductId: 'big-sorriso',
  /** Produto da apresentação "exploded view". */
  explodedProductId: 'duplo-bacon',
  /** Marcados como destaque / + vendido no InstaDelivery. */
  bestSellerIds: ['duplo-bacon', 'tudao', 'combo-casal-2'],
  /** Faixa de fotos na seção do Instagram (fotos do cardápio). */
  galleryIds: ['big-sorriso', 'duplo-bacon', 'tudao', 'melt-burguer', 'churras-burguer', 'salada-burguer', 'combo-casal-2', 'burguer-bacon'],
} as const

/**
 * Rótulos da apresentação do Duplo Bacon (seção "Destaque").
 * As camadas são recortes reais de public/images/burger/hamburguer-3d.png
 * (geometria em ./burger3d.ts, gerada por scripts/burger-3d.mjs).
 * Ingredientes = descrição do produto em products.ts; a imagem mostra
 * duas fatias de cheddar, uma sobre cada carne.
 */
export interface BurgerLabel {
  id: string
  label: string
  detail?: string
  /** Peça do hambúrguer a que o rótulo pertence (burgerPieces[].id). */
  piece: string
  /** Altura do conector dentro da peça (0 = topo, 1 = base). */
  at: number
  /** Onde o conector toca a comida, em % da largura do quadro. */
  edge: number
}

/** De cima para baixo, na ordem em que aparecem. */
export const burgerLabels: BurgerLabel[] = [
  { id: 'pao-topo', label: 'Pão brioche', detail: 'Tostado na manteiga', piece: 'pao-topo', at: 0.36, edge: 90 },
  { id: 'maionese', label: 'Maionese temperada', piece: 'maionese', at: 0.2, edge: 80 },
  { id: 'bacon', label: 'Bacon', piece: 'bacon', at: 0.44, edge: 86 },
  { id: 'cheddar-1', label: 'Queijo cheddar', piece: 'carne-1', at: 0.26, edge: 92 },
  { id: 'carne-1', label: 'Carne 100g', detail: 'Na brasa', piece: 'carne-1', at: 0.71, edge: 91 },
  { id: 'cheddar-2', label: 'Queijo cheddar', piece: 'carne-2', at: 0.23, edge: 91 },
  { id: 'carne-2', label: 'Carne 100g', detail: '2 carnes no total', piece: 'carne-2', at: 0.69, edge: 91 },
  { id: 'pao-base', label: 'Pão brioche', detail: 'Tostado na manteiga', piece: 'pao-base', at: 0.45, edge: 93 },
]

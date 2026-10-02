// Gerado por scripts/burger-3d.mjs — não editar à mão.
// Camadas recortadas de public/images/burger/hamburguer-3d.png (vista explodida do Duplo Bacon).

export interface BurgerPiece {
  id: string
  src: string
  srcSmall: string
  /** Tamanho do arquivo em px. */
  width: number
  height: number
  /** Caixa da peça no hambúrguer montado, em % do quadro (x/w da largura, y/h da altura). */
  x: number
  y: number
  w: number
  h: number
  /** Deslocamento vertical até a posição "aberto" (foto original), em % da altura do quadro. */
  spread: number
}

/** Proporção largura/altura do quadro (hambúrguer montado). */
export const BURGER_FRAME_RATIO = 0.92
/** Altura extra do estado totalmente aberto, em % da altura do quadro. */
export const BURGER_MAX_SPREAD = 31.41

export const burgerPieces: BurgerPiece[] = [
  { id: 'pao-topo', src: '/images/burger-layers/3d-pao-topo.webp', srcSmall: '/images/burger-layers/3d-pao-topo-sm.webp', width: 684, height: 297, x: 9.56, y: 0, w: 86.04, h: 34.3, spread: -15.7 },
  { id: 'maionese', src: '/images/burger-layers/3d-maionese.webp', srcSmall: '/images/burger-layers/3d-maionese-sm.webp', width: 480, height: 160, x: 23.4, y: 22.17, w: 60.38, h: 18.48, spread: -7.97 },
  { id: 'bacon', src: '/images/burger-layers/3d-bacon.webp', srcSmall: '/images/burger-layers/3d-bacon-sm.webp', width: 795, height: 169, x: 0, y: 26.44, w: 100, h: 19.52, spread: -2.77 },
  { id: 'carne-1', src: '/images/burger-layers/3d-carne-1.webp', srcSmall: '/images/burger-layers/3d-carne-1-sm.webp', width: 692, height: 250, x: 8.55, y: 35.8, w: 87.04, h: 28.87, spread: 3.58 },
  { id: 'carne-2', src: '/images/burger-layers/3d-carne-2.webp', srcSmall: '/images/burger-layers/3d-carne-2-sm.webp', width: 692, height: 223, x: 6.42, y: 55.54, w: 87.04, h: 25.75, spread: 11.09 },
  { id: 'pao-base', src: '/images/burger-layers/3d-pao-base.webp', srcSmall: '/images/burger-layers/3d-pao-base-sm.webp', width: 690, height: 204, x: 8.05, y: 76.44, w: 86.79, h: 23.56, spread: 15.7 },
]

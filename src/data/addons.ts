import type { Addon } from '@/types'

/** Adicionais reais (grupos de complementos do InstaDelivery). */
export const addons: Addon[] = [
  { id: 'carne-extra', name: 'Carne de hambúrguer extra', price: 6, max: 20, active: true },
  { id: 'cebola-caramelizada', name: 'Cebola caramelizada', price: 4, max: 20, active: true },
  { id: 'ovo', name: 'Ovo', price: 4, max: 20, active: true },
  { id: 'salada', name: 'Salada', description: 'Cebola roxa, alface e tomate', price: 3, max: 10, active: true },
  { id: 'bacon', name: 'Bacon', price: 3, max: 20, active: true },
  { id: 'picles', name: 'Picles', price: 2, max: 20, active: true },
  { id: 'cheddar-polenghi', name: 'Cheddar Polenghi', price: 3.5, max: 20, active: true },
  { id: 'mostarda-mel', name: 'Mostarda com mel', price: 1.99, max: 15, active: true },
]

const BASE = ['carne-extra', 'cebola-caramelizada', 'ovo', 'bacon', 'picles', 'cheddar-polenghi', 'mostarda-mel']
/** Conjunto sem "Salada" (Burguer Bacon e Salada Burguer). */
export const ADDONS_BASIC = BASE
/** Conjunto completo. */
export const ADDONS_FULL = ['carne-extra', 'cebola-caramelizada', 'ovo', 'salada', 'bacon', 'picles', 'cheddar-polenghi', 'mostarda-mel']

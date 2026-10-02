import type { DeliveryZone } from '@/types'

/**
 * Regras de pedido e entrega — valores reais do InstaDelivery.
 *
 * ⚠️ CONFIRMAR COM O PROPRIETÁRIO: o InstaDelivery possui duas tabelas de taxa
 * (por bairro, abaixo, e por km). Usamos a tabela por bairro porque não exige
 * geolocalização. A tabela por km está em `feeByKm` para referência.
 */
export const deliveryConfig = {
  minimumOrder: 20,
  /** Tempo estimado (min) configurado na loja para entrega e retirada. */
  estimatedMinutes: { delivery: 45, pickup: 45 },
  modes: { delivery: true, pickup: true },
  /** Loja também atende consumo no local (não faz parte do fluxo online). */
  dineIn: true,
  /** Permite montar/enviar pedido com a loja fechada (resposta ao abrir). */
  allowOrdersWhenClosed: true,
} as const

export const deliveryZones: DeliveryZone[] = [
  { id: 'rua-63', name: 'Rua 63', fee: 4 },
  { id: '18-baixo', name: '18 (parte de baixo)', fee: 5 },
  { id: 'carobinha', name: 'Carobinha', fee: 5 },
  { id: 'invasao', name: 'Invasão', fee: 5 },
  { id: 'mendanha', name: 'Mendanha', fee: 5 },
  { id: 'projetada-a-b', name: 'Projetada A e B (próx. ao Guaracamp)', fee: 5 },
  { id: 'qd-100', name: 'Qd. 100', fee: 5 },
  { id: 'restinga', name: 'Restinga', fee: 5 },
  { id: 'votorantim', name: 'Votorantim', fee: 5 },
  { id: '18-cima', name: '18 (parte de cima)', fee: 6 },
  { id: 'banharao', name: 'Banharão', fee: 6 },
  { id: 'campo-belo', name: 'Campo Belo', fee: 6 },
  { id: 'cebo', name: 'Cebo', fee: 6 },
  { id: 'condominio-250', name: 'Condomínio 250', fee: 6 },
  { id: 'outro-lado-brasil', name: 'Do outro lado da Brasil', fee: 6 },
  { id: 'guandu', name: 'Guandu', fee: 6 },
  { id: 'prox-gas-guandu', name: 'Próx. ao gás (Guandu)', fee: 6 },
  { id: 'vbl', name: 'VBL', fee: 6 },
  { id: 'restinga-brasil', name: 'Restinga (próx. à Brasil)', fee: 7 },
  { id: 'cabui', name: 'Cabuí', fee: 8 },
  { id: 'esplanada-mendanha', name: 'Esplanada (Est. do Mendanha)', fee: 8 },
  { id: 'lameirao', name: 'Lameirão', fee: 8 },
  { id: 'pro-farma', name: 'Pro Farma', fee: 8 },
  { id: 'prox-colegio-tenente', name: 'Próx. Colégio Tenente', fee: 8 },
  { id: 'santissimo', name: 'Santíssimo', fee: 8 },
  { id: 'sao-geraldo', name: 'São Geraldo', fee: 8 },
  { id: 'serrinha', name: 'Serrinha', fee: 8 },
  { id: 'jardim-leticia', name: 'Jardim Letícia', fee: 10 },
  { id: 'realengo', name: 'Realengo', fee: 15 },
]

/** Tabela alternativa por distância (km → taxa). Acima de 8 km não entrega. */
export const feeByKm: { upToKm: number; fee: number }[] = [
  { upToKm: 3, fee: 5 },
  { upToKm: 5, fee: 6 },
  { upToKm: 6, fee: 7 },
  { upToKm: 7, fee: 8.5 },
  { upToKm: 8, fee: 9.5 },
]

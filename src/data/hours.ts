import type { DayHours } from '@/types'

/** Horários reais cadastrados no InstaDelivery (fuso America/Sao_Paulo). */
export const TIMEZONE = 'America/Sao_Paulo'

export const openingHours: DayHours[] = [
  { day: 0, open: '19:00', close: '23:59' },
  { day: 1, open: '19:00', close: '23:59' },
  { day: 2, open: '19:00', close: '23:59' },
  { day: 3, open: '19:00', close: '23:59' },
  { day: 4, open: '19:00', close: '23:59' },
  { day: 5, open: '19:00', close: '23:59' },
  { day: 6, open: '19:20', close: '23:59' },
]

export const DAY_NAMES = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

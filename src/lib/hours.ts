import type { DayHours } from '@/types'
import { DAY_NAMES, TIMEZONE, openingHours } from '@/data/hours'

export interface StoreStatus {
  isOpen: boolean
  /** Ex.: "Aberto até 23:59" | "Abre hoje às 19:00" | "Abre amanhã às 19:00" */
  label: string
  todayHours: DayHours | undefined
  /** true enquanto o status real ainda não foi calculado no cliente. */
  pending?: boolean
}

const toMinutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

/** Dia da semana e minutos do dia no fuso da loja, independente do fuso do cliente. */
function storeNow(date: Date): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(date)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ''
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'))
  return { day, minutes: Number(get('hour')) * 60 + Number(get('minute')) }
}

export function getStoreStatus(date = new Date(), hours: DayHours[] = openingHours): StoreStatus {
  const { day, minutes } = storeNow(date)
  const today = hours.find((h) => h.day === day)

  if (today && minutes >= toMinutes(today.open) && minutes <= toMinutes(today.close)) {
    return { isOpen: true, label: `Aberto até ${today.close}`, todayHours: today }
  }
  if (today && minutes < toMinutes(today.open)) {
    return { isOpen: false, label: `Abre hoje às ${today.open}`, todayHours: today }
  }
  for (let i = 1; i <= 7; i++) {
    const next = hours.find((h) => h.day === (day + i) % 7)
    if (next) {
      const when = i === 1 ? 'amanhã' : DAY_NAMES[next.day].toLowerCase()
      return { isOpen: false, label: `Abre ${when} às ${next.open}`, todayHours: today }
    }
  }
  return { isOpen: false, label: 'Fechado', todayHours: today }
}

/** Agrupa dias consecutivos com o mesmo horário: "Dom a Sex · 19:00–23:59". */
export function summarizeHours(hours: DayHours[] = openingHours): { days: string; time: string }[] {
  const short = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  const sorted = [...hours].sort((a, b) => a.day - b.day)
  const groups: { from: number; to: number; time: string }[] = []
  for (const h of sorted) {
    const time = `${h.open} – ${h.close}`
    const last = groups[groups.length - 1]
    if (last && last.time === time && last.to === h.day - 1) last.to = h.day
    else groups.push({ from: h.day, to: h.day, time })
  }
  return groups.map((g) => ({ days: g.from === g.to ? short[g.from] : `${short[g.from]} a ${short[g.to]}`, time: g.time }))
}

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export const formatMoney = (value: number): string => brl.format(value)

/** Aplica máscara (21) 99999-9999 enquanto digita. */
export function maskPhone(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export const cx = (...parts: (string | false | null | undefined)[]): string => parts.filter(Boolean).join(' ')

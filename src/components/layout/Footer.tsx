import { businessInfo, formatPhone, fullAddress } from '@/data/business'
import { summarizeHours } from '@/lib/hours'
import { whatsappContactUrl } from '@/lib/whatsapp'
import { ClockIcon, InstagramIcon, PinIcon, WhatsappIcon } from '@/components/ui/Icons'

export function Footer() {
  const hours = summarizeHours()
  return (
    <footer id="contato" className="border-t border-cream-100/10 bg-coal-950 pb-28 pt-14 md:pb-14">
      <div className="container-x grid gap-10 md:grid-cols-[auto_1fr_1fr_1fr] md:gap-12">
        <img src={businessInfo.logo} alt="Logo Toca do Sorriso na Brasa" width={112} height={112} loading="lazy" className="size-28 rounded-2xl" />

        <div>
          <h2 className="eyebrow mb-3">Onde estamos</h2>
          <address className="flex gap-3 not-italic text-cream-100">
            <PinIcon className="mt-0.5 shrink-0 text-ember-500" />
            <span>
              {fullAddress()}
              <span className="mt-1 block text-sm text-cream-500">{businessInfo.address.reference}</span>
            </span>
          </address>
        </div>

        <div>
          <h2 className="eyebrow mb-3">Horário</h2>
          <ul className="space-y-1.5">
            {hours.map((h) => (
              <li key={h.days} className="flex gap-3 text-cream-100">
                <ClockIcon className="mt-0.5 shrink-0 text-ember-500" />
                <span><span className="font-semibold">{h.days}</span> · {h.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="eyebrow mb-3">Fale com a gente</h2>
          <ul className="space-y-1">
            <li>
              <a href={whatsappContactUrl()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-3 text-cream-100 transition-colors hover:text-ember-400">
                <WhatsappIcon className="text-ember-500" /> WhatsApp {formatPhone(businessInfo.whatsapp)}
              </a>
            </li>
            <li>
              <a href={businessInfo.instagram.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-3 text-cream-100 transition-colors hover:text-ember-400">
                <InstagramIcon className="text-ember-500" /> {businessInfo.instagram.handle}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-x mt-12 border-t border-cream-100/10 pt-6 text-sm text-cream-500">
        © {new Date().getFullYear()} {businessInfo.name}. Imagens meramente ilustrativas.
      </div>
    </footer>
  )
}

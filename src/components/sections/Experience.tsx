/** Só afirmações verificáveis no cardápio/cadastro da loja. */
const FACTS = [
  { title: 'Pão brioche', text: 'Tostado na manteiga em todos os hambúrgueres da casa.' },
  { title: 'Carne de 100g', text: 'Uma, duas ou três, do Burguer Bacon ao Big Sorriso.' },
  { title: 'Maionese temperada', text: 'Vai no lanche e também à parte, para acompanhar as fritas.' },
  { title: 'Do seu jeito', text: 'Adicionais como ovo, bacon, cebola caramelizada e carne extra.' },
]

/**
 * Sobre a Toca. Sem história, fundador, data ou depoimento: só o que está no
 * cadastro e no cardápio.
 */
export function Experience() {
  return (
    <section id="sobre" aria-labelledby="experiencia-titulo" className="grain relative isolate overflow-hidden bg-coal-900 py-24 lg:py-40">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 bg-gradient-to-b from-coal-950 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-28 bg-gradient-to-t from-coal-950 to-transparent" />
      <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start lg:gap-16">
        <div>
          <h2 data-reveal="title" id="experiencia-titulo" className="display text-[clamp(2.2rem,8vw,3.6rem)] text-cream-50">Sobre a Toca</h2>
          <p data-reveal className="mt-5 max-w-lg text-lg leading-relaxed text-cream-300">
            A Toca do Sorriso na Brasa fica no Mendanha, Rio de Janeiro, e abre todas as noites.
            Peça para entregar, retire no balcão ou venha comer aqui.
          </p>

          {/* Como um bilhete de lanchonete: lista corrida, linhas tracejadas */}
          <ul className="mt-9 max-w-xl border-t border-dashed border-cream-100/20">
            {FACTS.map((f) => (
              <li data-reveal key={f.title} className="flex flex-col gap-0.5 border-b border-dashed border-cream-100/20 py-3.5 sm:flex-row sm:gap-5">
                <span className="shrink-0 font-semibold text-cream-50 sm:w-44">{f.title}</span>
                <span className="text-cream-300">{f.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Foto na proporção do arquivo (780×351), nunca maior que ele: sem ampliar nem cortar.
            TODO: quando houver fotos reais da loja, da chapa e da equipe, entram aqui
            (ex.: uma da fachada/balcão e uma da chapa), também sem passar do tamanho do arquivo. */}
        <figure data-reveal="media" className="w-full max-w-[780px] overflow-hidden rounded-2xl lg:mt-3">
          <div data-reveal-inner>
            <img
              src="/images/categories/hamburguer.webp"
              alt="Três hambúrgueres da Toca do Sorriso servidos na tábua com molhos"
              width={780} height={351} loading="lazy" decoding="async"
              className="block aspect-[780/351] w-full object-cover"
            />
          </div>
        </figure>
      </div>
    </section>
  )
}

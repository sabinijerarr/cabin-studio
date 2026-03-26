const sessionPackages = [
  { name: '2 Hours', price: '$120', deposit: 60, popular: false },
  { name: '3 Hours', price: '$180', deposit: 90, popular: true },
  { name: '4 Hours', price: '$240', deposit: 120, popular: false },
]

const otherServices = [
  {
    label: '02',
    title: 'Mixing & Mastering',
    packages: [
      { name: 'Essential Mix & Master', price: '$89' },
      { name: 'Premium Mix & Master', price: '$149' },
    ],
    description: 'Your track mixed and mastered to streaming and radio-ready standards. Two revision rounds included on every project.',
    features: ['Stem mixing', 'Analog-style processing', 'Two revision rounds', 'All formats delivered'],
  },
  {
    label: '03',
    title: 'Music Production',
    price: '$99',
    unit: '/ beat',
    description: 'Custom beat creation and full track arrangement. Bring a reference or start from scratch — we build from the ground up.',
    features: ['Beat creation', 'Full arrangement', 'Genre-flexible', 'Stems + project file'],
  },
  {
    label: '04',
    title: 'Artist Development',
    description: 'Creative direction, flow coaching, and song structure guidance. For artists who want to grow beyond the session.',
    features: ['Creative direction', 'Songwriting support', 'Flow & delivery coaching', 'Industry insight'],
  },
]

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="relative bg-warm-black py-24 px-4 sm:px-8"
      aria-label="Studio services and pricing"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber/30 to-transparent" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-jetbrains text-[11px] tracking-[0.4em] text-amber uppercase mb-4">
            What We Offer
          </p>
          <h2 className="font-cinzel text-4xl sm:text-5xl text-cream font-semibold mb-4">
            Services &amp; Rates
          </h2>
          <p className="font-cormorant text-xl text-cream/50 italic max-w-xl mx-auto">
            Simple, honest pricing. No hidden fees — just quality sound and a great experience.
          </p>
        </div>

        {/* ── Studio Sessions — full-width hero card ── */}
        <div className="border border-amber/25 bg-warm-black p-8 sm:p-12 mb-px relative overflow-hidden">
          {/* Subtle amber glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,168,83,0.06)_0%,transparent_60%)] pointer-events-none" />

          <div className="relative">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
              <div>
                <p className="font-jetbrains text-[10px] tracking-[0.4em] text-amber/60 uppercase mb-3">01</p>
                <h3 className="font-cinzel text-3xl sm:text-4xl text-cream font-semibold">
                  Studio Sessions
                </h3>
                <p className="font-cormorant text-lg text-cream/55 mt-2 italic">
                  Neumann U87 · Neve 1073 · Engineer included · All files delivered
                </p>
              </div>
              <p className="font-jetbrains text-[10px] tracking-[0.3em] text-amber/50 uppercase sm:text-right whitespace-nowrap">
                $60 / hr
              </p>
            </div>

            {/* Package cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {sessionPackages.map((pkg) => (
                <div
                  key={pkg.name}
                  className={`relative border p-5 transition-colors duration-200 ${
                    pkg.popular
                      ? 'border-amber bg-amber/8'
                      : 'border-cream/15 bg-transparent'
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-px left-4 right-4 h-px bg-amber" />
                  )}
                  {pkg.popular && (
                    <p className="font-jetbrains text-[9px] tracking-[0.4em] text-amber uppercase mb-2">
                      Most Popular ★
                    </p>
                  )}
                  <p className="font-cormorant text-base text-cream/70 mb-1">{pkg.name}</p>
                  <p className="font-cinzel text-3xl text-amber">{pkg.price}</p>
                  <p className="font-jetbrains text-[9px] tracking-widest text-cream/30 mt-2 uppercase">
                    ${pkg.deposit} deposit
                  </p>
                </div>
              ))}
            </div>

            <a
              href="/booking"
              className="inline-block px-10 py-4 font-cinzel text-sm tracking-[0.25em] uppercase text-warm-black bg-amber hover:bg-amber-light transition-colors duration-300 shadow-[0_4px_20px_rgba(212,168,83,0.3)]"
            >
              Book a Session
            </a>
          </div>
        </div>

        {/* ── Other services — 3-column grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-cream/10">
          {otherServices.map((service) => (
            <div
              key={service.label}
              className="group bg-warm-black p-8 hover:bg-warm-black-light transition-colors duration-300 flex flex-col"
            >
              <p className="font-jetbrains text-[10px] tracking-[0.4em] text-amber/60 uppercase mb-5">
                {service.label}
              </p>
              <h3 className="font-cinzel text-xl text-cream font-semibold mb-3">
                {service.title}
              </h3>

              {'price' in service && service.price && (
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="font-cinzel text-2xl text-amber">{service.price}</span>
                  <span className="font-cormorant text-base text-cream/50">{'unit' in service ? service.unit : ''}</span>
                </div>
              )}
              {'packages' in service && service.packages && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {service.packages.map((pkg) => (
                    <div key={pkg.name} className="border border-cream/15 px-3 py-1.5">
                      <span className="font-jetbrains text-[9px] tracking-wide text-cream/50 block">{pkg.name}</span>
                      <span className="font-cinzel text-base text-amber">{pkg.price}</span>
                    </div>
                  ))}
                </div>
              )}

              <p className="font-cormorant text-base text-cream/60 leading-relaxed mb-5 flex-1">
                {service.description}
              </p>

              <ul className="space-y-1.5 mb-6">
                {service.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <span className="w-1 h-1 rounded-full bg-amber flex-shrink-0" />
                    <span className="font-cormorant text-sm text-cream/50">{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="/booking?expand=addl"
                className="block text-center border border-amber/40 group-hover:border-amber text-amber font-cinzel text-xs tracking-[0.25em] uppercase py-3 transition-colors duration-300 hover:bg-amber hover:text-warm-black"
              >
                Book Now
              </a>
            </div>
          ))}
        </div>

        <p className="text-center font-cormorant text-base text-cream/35 italic mt-8">
          50% deposit required to confirm booking. Accepted: Cash, Credit Card, Venmo, CashApp
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-forest to-transparent" />
    </section>
  )
}
